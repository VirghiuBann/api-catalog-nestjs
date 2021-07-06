import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductDocument, Product } from './entities/product.entity';
import { Products } from './interfaces/products.interface';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel('Product')
    private readonly productModel: Model<ProductDocument>,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const newProduct = new this.productModel(createProductDto);
    return newProduct.save();
  }

  async findAll(): Promise<Product[]> {
    return this.productModel.find().exec();
  }

  async findOne(id: string): Promise<Product> {
    let product = await this.productModel.findById(id);
    if (!product) {
      throw `Product not found with ID: ${id}`;
    }
    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const oldProduct = await this.productModel.findById(id);
    if (!oldProduct) {
      throw 'updated product successfully';
    }
    oldProduct.title = updateProductDto.title;
    oldProduct.description = updateProductDto.description;

    const result = await oldProduct.save();
    return result;
  }

  async remove(id: string) {
    const product = await this.productModel.findByIdAndDelete(id);
    if (!product) {
      throw `This product with #${id} not found`;
    }

    return { message: 'deleted product ' + id };
  }
}
