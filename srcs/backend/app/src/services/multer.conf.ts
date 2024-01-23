import { HttpException, HttpStatus } from '@nestjs/common';
import { diskStorage } from 'multer';
import { extname } from 'path';

export const multerConfig = {
  dest: './uploads',
};

export const multerOptions = {
  storage: diskStorage({
    destination: './uploads',
    filename: (req, file, cb) => {
      const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('');
      return cb(null, `${randomName}${extname(file.originalname)}`);
    },
  }),
  fileFilter: (req, file, cb) => {
    if (file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
      cb(null, true);
    } else {
      cb(new HttpException(`Unsupported file type ${extname(file.originalname)}`, HttpStatus.BAD_REQUEST), false);
    }
  },
};