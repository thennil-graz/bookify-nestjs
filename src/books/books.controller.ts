import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  Put,
} from '@nestjs/common';
import { BooksService } from './books.service';
import { UpdateBookDto } from './dto/update-book.dto';

@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Post('/populate')
  create() {
    return this.booksService.populate();
  }

  @Get()
  findAll(@Query('s') searchText: string) {
    return this.booksService.searchBooks(searchText);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.booksService.getBookInfo(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateBookDto: UpdateBookDto) {
    return this.booksService.update(id, updateBookDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.booksService.remove(id);
  }
}
