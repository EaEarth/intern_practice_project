import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Query } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  create(payload: CreateUserDto): Promise<UserDocument> {
    const user = new this.userModel(payload);
    return user.save();
  }

  index(): Promise<UserDocument[]> {
    return this.userModel.find().exec();
  }

  findById(id: string): Promise<UserDocument> {
    return this.userModel.findById(id).exec();
  }

  update(updateUserDto: UpdateUserDto): Promise<UserDocument> {
    const { id, ...updateInfo } = updateUserDto;
    return this.userModel
      .findByIdAndUpdate(id, updateInfo, { new: true })
      .exec();
  }

  delete(id: string): Promise<UserDocument> {
    return this.userModel.findByIdAndDelete(id).exec();
  }
}
