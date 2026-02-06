import { BannersService } from './banners.service';
export declare class BannersController {
    private bannersService;
    constructor(bannersService: BannersService);
    findAll(): Promise<(import("../../database/schemas").Banner & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
}
