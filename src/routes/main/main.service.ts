import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { MainDocument } from './main.schema';
import { Model } from 'mongoose';

@Injectable()
export class MainService {
  constructor(
    @InjectModel('main') private readonly mainModel: Model<MainDocument>,
  ) {}

  async find() {
    const docs = await this.mainModel.find().exec();
    if (docs.length === 0)
      throw new HttpException(
        "The main document hasn't been created yet!",
        HttpStatus.NOT_FOUND,
      );
    return docs[0];
  }
}
