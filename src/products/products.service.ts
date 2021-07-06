import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductDocument, Product } from './entities/product.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel('Product')
    private readonly productModel: Model<ProductDocument>,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const newProduct = new this.productModel(createProductDto);
    return await newProduct.save();
  }

  async findAll(): Promise<Product[]> {
    const products = await this.productModel.find();
    return products;
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.productModel.findById(id);
    return product;
  }

  async update(
    id: string,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    const oldProduct = await this.productModel.findById(id);
    if (!oldProduct) {
      throw new NotFoundException('Not found product with id: ' + id);
    }
    oldProduct.title = updateProductDto.title;
    oldProduct.description = updateProductDto.description;

    return await oldProduct.save();
  }

  async remove(id: string) {
    return await this.productModel.findByIdAndDelete(id);
  }
}
