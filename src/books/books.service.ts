/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import * as fs from 'fs';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { ConfigService } from '@nestjs/config';
import * as path from 'path';

@Injectable()
export class BooksService {
  private index: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly elasticsearchService: ElasticsearchService,
  ) {
    this.index = this.configService.get('INDEX_NAME') || 'books';
  }

  async populate() {
    const indexExists = await this.elasticsearchService.indices.exists({
      index: this.index,
    });
    if (!indexExists) {
      await this.elasticsearchService.indices.create({
        index: this.index,
        body: {
          mappings: {
            properties: {
              id: { type: 'integer' },
              title: { type: 'text' },
              author: { type: 'text' },
              genre: { type: 'text' },
              rating: { type: 'float' },
            },
          },
        },
      });
    }

    const filePath = path.join(__dirname, '../../books.json');
    const books: CreateBookDto[] = JSON.parse(
      fs.readFileSync(filePath, 'utf-8'),
    );

    for (const book of books) {
      await this.elasticsearchService.index({
        index: this.index,
        id: book.id.toString(),
        body: book,
      });
    }

    await this.elasticsearchService.indices.refresh({ index: this.index });
    return { message: 'Data populated successfully' };
  }

  async searchBooks(searchText: string) {
    try {
      const params = {
        index: this.index,
        body: {
          query: searchText
            ? {
                bool: {
                  must: [
                    {
                      multi_match: {
                        query: searchText,
                        fields: ['title^3', 'author^2', 'genre'],
                        fuzziness: 'AUTO',
                        operator: 'and',
                      },
                    },
                  ],
                },
              }
            : {
                match_all: {},
              },
        },
      };

      const response =
        await this.elasticsearchService.search<CreateBookDto>(params);
      const data = response.hits.hits.map((hit) => hit._source);
      return {
        data,
        total: data.length,
      };
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new InternalServerErrorException(error.message);
      }
      console.log(error);
      throw new InternalServerErrorException('An unknown error occurred');
    }
  }

  async getBookInfo(id: string) {
    try {
      const response = await this.elasticsearchService.get<CreateBookDto>({
        index: this.index,
        id,
      });
      return {
        message: 'Data fetched successfully',
        data: response._source,
      };
    } catch (error) {
      if (error instanceof Error) {
        throw new InternalServerErrorException(error.message);
      }

      throw new NotFoundException({ error: 'Data not found' });
    }
  }

  async update(id: string, updateBookDto: UpdateBookDto) {
    try {
      const data = await this.elasticsearchService.update({
        index: this.index,
        id,
        body: { doc: updateBookDto },
      });
      return {
        message: 'Data updated successfully',
        data,
      };
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new InternalServerErrorException(error.message);
      }
    }
  }

  async remove(id: string) {
    try {
      await this.elasticsearchService.delete({
        index: this.index,
        id,
      });
      return {
        message: 'Data has been deleted successfully',
      };
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new InternalServerErrorException(error.message);
      }
    }
  }
}
