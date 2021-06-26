import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Products } from './interfaces/products.interface';

@Injectable()
export class ProductsService {
  public products: Products[] = [];

  create(createProductDto: CreateProductDto) {
    const prodId: string = new Date().toISOString();
    const newProduct: Products = {
      id: prodId,
      title: createProductDto.title,
      description: createProductDto.description,
      createdAt: new Date().toISOString(),
    };
    this.products.push(newProduct);

    return { id: prodId };
  }

  findAll() {
    return this.products;
  }

  findOne(id: number) {
    return `This action returns a #${id} product`;
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}
