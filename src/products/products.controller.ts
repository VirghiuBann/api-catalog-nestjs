import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpException,
  HttpStatus,
  ParseIntPipe,
  UsePipes,
  UseInterceptors,
  UseFilters,
  NotFoundException,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ValidationPipe } from './validations/validation.pipe';
import { LoggingInterceptor } from '../interceptors/logging.interceptor';
import { Products } from './interfaces/products.interface';
import { HttpExceptionFilter } from 'src/filters/http-exception.filter';

@Controller('products')
@UseFilters(new HttpExceptionFilter())
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  // @UsePipes(new ValidationPipe(CreateProductDto))
  async create(@Body(new ValidationPipe()) createProductDto: CreateProductDto) {
    const prod = await this.productsService.create(createProductDto);
    return prod;
  }

  @Get()
  async findAll() {
    const products = await this.productsService.findAll();
    return products;
  }

  @Get(':id')
  @UseInterceptors(LoggingInterceptor)
  async findOne(@Param('id') id: string) {
    try {
      const product = await this.productsService.findOne(id);
      if (!product) {
        throw new NotFoundException();
      }
      return product;
    } catch (error) {
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        message: 'This product with id: ' + id + ' not found.',
      });
    }
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    try {
      await this.productsService.update(id, updateProductDto);
      return { message: `Product ID: ${id} updated successfully!` };
    } catch (error) {
      throw new NotFoundException('Product not Found.');
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const product = await this.productsService.remove(id);

    if (!product) {
      throw new NotFoundException('This product not found.');
    }

    return { message: 'product deleted successfully' };
  }
}
