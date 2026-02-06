import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Banner } from '../../database/schemas/banner.schema';

@Injectable()
export class BannersService {
  constructor(
    @InjectModel(Banner.name) private bannerModel: Model<Banner>,
  ) {}

  async findAll() {
    return this.bannerModel.find({
      isActive: true,
    }).sort({ displayOrder: 1 }).lean();
  }
}
