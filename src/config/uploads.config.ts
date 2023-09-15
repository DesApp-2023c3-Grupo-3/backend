import { ParseFilePipeBuilder } from '@nestjs/common';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { diskStorage } from 'multer';
import { extname } from 'path';

export const filesConfigImages = {
  destination: process.env.FILESYSTEM_STORAGE || './public',
  fileType: process.env.UPLOAD_TYPES_SUPPORTED || 'jpg|jpeg|png|pdf',
  maxSize: parseInt(process.env.UPLOAD_SIZE_SUPPORTED) || 1024 * 1024 * 5,
  responseHeaders: (fileName: string): any => {
    return {
      'Content-Type': 'application/' + extname(fileName).replace('.', ''),
      'Content-Disposition': 'attachment; filename=' + fileName,
    };
  },
};

export const multerOptions = (): MulterOptions => ({
  storage: diskStorage({
    destination: filesConfigImages.destination,
    filename: (req, file, callback) => {
      const suffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const ext = extname(file.originalname);
      const originaName = file.originalname.replace(new RegExp(ext), '');
      const fileName = `${originaName}-${suffix}${ext}`;
      callback(null, fileName);
    },
  }),
  fileFilter: (req, file, callback) => {
    file.originalname = file.originalname = Buffer.from(
      file.originalname,
      'latin1',
    ).toString('utf8');
    callback(null, true);
  },
});

export const parseFilePipeBuilder = new ParseFilePipeBuilder()
  .addFileTypeValidator({
    fileType: filesConfigImages.fileType,
  })
  .addMaxSizeValidator({
    maxSize: filesConfigImages.maxSize,
  })
  .build();
