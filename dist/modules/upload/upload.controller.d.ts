import { UploadService } from './upload.service';
export declare class UploadController {
    private uploadService;
    constructor(uploadService: UploadService);
    uploadImage(file: Express.Multer.File): Promise<{
        url: string;
    }>;
    uploadImages(files: Express.Multer.File[]): Promise<{
        urls: string[];
    }>;
}
