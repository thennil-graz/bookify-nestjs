/* eslint-disable @typescript-eslint/require-await */
import { Module } from '@nestjs/common';
import { BooksService } from './books.service';
import { BooksController } from './books.controller';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ElasticsearchModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        node: configService.get('ELASTICSEARCH_URL'),
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [BooksController],
  providers: [BooksService],
})
export class BooksModule {}
