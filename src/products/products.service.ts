import { Injectable } from '@nestjs/common';

import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Products } from './interfaces/products.interface';

@Injectable()
export class ProductsService {
  public products: Products[] = [];

  create(createProductDto: CreateProductDto) {
    const prodId: number = this.products.length + 1;
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
    let product = this.products.find((item) => item.id == id);
    let message: {} = {};
    if (!product) {
      message = { message: `Product not found with ID: ${id}` };
    }
    return product ? product : message;
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    let productIndex = this.products.findIndex((item) => item.id == id);
    if (productIndex != -1) {
      const product = { ...this.products[productIndex] };
      product.title = updateProductDto.title;
      product.description = updateProductDto.description;

      this.products[productIndex] = { ...product };

      return { message: 'updated product successfully' };
    }
    return { message: `This product with #${id} not found` };
  }

  remove(id: number) {
    let productIndex = this.products.findIndex((item) => item.id == id);
    if (productIndex != -1) {
      this.products.splice(productIndex, 1);
      return { message: 'deleted product successfully' };
    }
    return { message: `This product with #${id} not found` };
  }
}
