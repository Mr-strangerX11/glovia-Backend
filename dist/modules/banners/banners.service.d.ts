import { Model } from 'mongoose';
import { Banner } from '../../database/schemas/banner.schema';
export declare class BannersService {
    private bannerModel;
    constructor(bannerModel: Model<Banner>);
    findAll(): Promise<(Banner & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
}
