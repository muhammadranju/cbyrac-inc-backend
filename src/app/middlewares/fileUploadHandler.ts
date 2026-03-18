import { Request } from 'express';
import fs from 'fs';
import path from 'path';
import multer, { FileFilterCallback, StorageEngine } from 'multer';
import { StatusCodes } from 'http-status-codes';
import ApiError from '../../errors/ApiError';

const fileUploadHandler = () => {
  // Create base uploads directory
  const baseUploadDir = path.join(process.cwd(), 'uploads');
  if (!fs.existsSync(baseUploadDir)) {
    fs.mkdirSync(baseUploadDir);
  }

  // Utility to create nested folder if missing
  const createDir = (dirPath: string) => {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
  };

  // Multer storage configuration
  const storage: StorageEngine = multer.diskStorage({
    destination: (
      req: Request,
      file: Express.Multer.File,
      cb: (error: Error | null, destination: string) => void
    ) => {
      let uploadDir: string;

      switch (file.fieldname) {
        case 'image':
        case 'socialSecurityCard':
        case 'residentCard':
        case 'photoId':
        case 'workAuthorizationDocument':
        case 'signature':
        case 'accountFile':
        case 'i9Form':
        case 'w4Form':
        case 'example':
          uploadDir = path.join(baseUploadDir, 'image');
          break;

        case 'media':
          uploadDir = path.join(baseUploadDir, 'media');
          break;

        case 'doc':
          uploadDir = path.join(baseUploadDir, 'doc');
          break;

        default:
          throw new ApiError(StatusCodes.BAD_REQUEST, 'File is not supported');
      }

      createDir(uploadDir);
      cb(null, uploadDir);
    },

    filename: (
      req: Request,
      file: Express.Multer.File,
      cb: (error: Error | null, filename: string) => void
    ) => {
      const fileExt = path.extname(file.originalname);
      const fileName =
        file.originalname
          .replace(fileExt, '')
          .toLowerCase()
          .split(' ')
          .join('-') +
        '-' +
        Date.now();
      cb(null, fileName + fileExt);
    },
  });

  // Multer file filter validation
  const fileFilter = (
    req: Request,
    file: Express.Multer.File,
    cb: FileFilterCallback
  ) => {
    const allowedImageTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    const allowedMediaTypes = ['video/mp4', 'audio/mpeg'];
    const allowedDocTypes = ['application/pdf'];

    if (allowedImageTypes.includes(file.mimetype)) {
      cb(null, true);
    } else if (allowedMediaTypes.includes(file.mimetype)) {
      cb(null, true);
    } else if (allowedDocTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new ApiError(
          StatusCodes.BAD_REQUEST,
          'Only .jpeg, .png, .jpg, .mp4, .mp3, or .pdf files are supported'
        )
      );
    }
  };

  // Final upload middleware
  const upload = multer({
    storage,
    fileFilter,
  }).fields([
    { name: 'image', maxCount: 3 },
    { name: 'media', maxCount: 3 },
    { name: 'doc', maxCount: 3 },
    { name: 'workAuthorizationDocument', maxCount: 3 },
    { name: 'residentCard', maxCount: 3 },
    { name: 'photoId', maxCount: 3 },
    { name: 'socialSecurityCard', maxCount: 3 },
    { name: 'signature', maxCount: 3 },
    { name: 'accountFile', maxCount: 3 },
    { name: 'i9Form', maxCount: 3 },
    { name: 'w4Form', maxCount: 3 },
    { name: 'example', maxCount: 3 },
  ]);

  return upload;
};

export default fileUploadHandler;
