import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Query } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { Role } from '../role/role.enum';
import { CaslAbilityFactory } from '../casl/casl-ability.factory';
@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private caslAbilityFactory: CaslAbilityFactory,
  ) {}

  async create(payload: CreateUserDto): Promise<UserDocument> {
    try {
      if (!payload.role) payload.role = [Role.User];
      let password, info;
      ({ password, ...info } = payload);
      const hashedPassword = await this.hashPassword(password);
      const passwordObject = { password: hashedPassword };
      const user = new this.userModel({
        ...info,
        ...passwordObject,
      });
      return user.save();
      // ({ password, ...userInfo } = (await user.save()).);
      // return userInfo;
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException('Email already exist.');
    }
  }

  async hashPassword(password: string): Promise<string> {
    const round = 10;
    const salt = await bcrypt.genSalt(round);
    const hashedPassword = bcrypt.hash(password, salt);
    return hashedPassword;
  }

  index(): Promise<UserDocument[]> {
    return this.userModel.find().exec();
  }

  findById(id: string): Promise<UserDocument> {
    return this.userModel.findById(id).exec();
  }

  loginByEmail(email: string): Promise<UserDocument> {
    return this.userModel
      .findOne({ email: email })
      .select('email password role')
      .exec();
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
