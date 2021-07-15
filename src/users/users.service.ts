import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserDocument, User } from './entities/user.entity';
import { generateHash } from './utils/hashing';

// export type User = any;

@Injectable()
export class UsersService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<UserDocument>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const newUser = new this.userModel(createUserDto);
    const passwordHash = await generateHash(newUser.password);
    newUser.password = passwordHash;
    return await newUser.save();
  }

  async findAll(): Promise<User[]> {
    const users = await this.userModel.find();
    return users;
  }

  async findOne(id: string): Promise<User | undefined> {
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new NotFoundException();
    }

    return user;
    // return this.users.find((user) => user.username === username);
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const oldUser = await this.userModel.findById(id);
    if (!oldUser) {
      throw new NotFoundException('Not found product with id: ' + id);
    }
    oldUser.name = updateUserDto.name;
    oldUser.email = updateUserDto.email;
    oldUser.password = updateUserDto.password;

    return await oldUser.save();
  }

  async remove(id: string) {
    return await this.userModel.findByIdAndDelete(id);
  }

  async findByUsername(username: string): Promise<User | undefined> {
    const user = await this.userModel.findOne({ email: username }).lean();
    return user;
  }
}
