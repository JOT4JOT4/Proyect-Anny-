import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async findByRut(rut: string) {
    return this.userModel.findOne({ rut }).lean();
  }

  async create(createDto: Partial<User>) {
    const created = new this.userModel(createDto);
    return created.save();
  }

  async upsertByRut(rut: string, payload: Partial<User>) {
    return this.userModel
      .findOneAndUpdate({ rut }, { $set: payload }, { upsert: true, new: true })
      .lean();
  }

  async list(limit = 50) {
    return this.userModel.find().limit(limit).lean();
  }
}