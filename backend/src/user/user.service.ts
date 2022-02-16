import {
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
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
    @Inject('database') private docRef,
  ) {
    this.docRef = this.docRef.collection('users');
  }

  async create(payload: CreateUserDto): Promise<UserDocument> {
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
  }

  async hashPassword(password: string): Promise<string> {
    const round = 10;
    const salt = await bcrypt.genSalt(round);
    const hashedPassword = bcrypt.hash(password, salt);
    return hashedPassword;
  }

  index(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  findById(id: string): Promise<User> {
    return this.userModel.findById(id).exec();
  }

  findByEmail(email: string): Promise<UserDocument> {
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

  //------------------------------------ GCloud database--------------------------//

  async creatOnCloud(payload: CreateUserDto): Promise<UserDocument> {
    if (!payload.role) payload.role = [Role.User];
    let password, info;
    ({ password, ...info } = payload);
    const hashedPassword = await this.hashPassword(password);
    const passwordObject = { password: hashedPassword };
    return await this.docRef.doc(info.email).set({
      ...info,
      ...passwordObject,
    });
  }

  async indexOnCloud() {
    const snapshot = await this.docRef.get();
    let result = [];
    let password, info;
    snapshot.forEach((doc) => {
      ({ password, ...info } = doc.data());
      result.push(info);
    });
    return result;
  }

  async deleteOnCloud(email) {
    return await this.docRef.doc(email).delete();
  }

  async findByEmailOnCloud(email: string) {
    const doc = await this.docRef.doc(email).get();
    if (!doc.exists) {
      console.log('No such document!');
      return null;
    } else {
      console.log('Document data:', doc.data());
      let password, info;
      ({ password, ...info } = doc.data());
      return info;
    }
  }
}
