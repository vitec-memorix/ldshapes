import { extname } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { diskStorage } from 'multer';
import { v4 as uuid } from 'uuid';
import { HttpException, HttpStatus } from '@nestjs/common';
import * as fs from "fs";

let uploadPath = '../resources';

// Multer upload options
export const multerOptions = {
  // Check the mimetypes to allow for upload
  fileFilter: (req: any, file: any, cb: any) => {
    if (extname(file.originalname).match(/^(\.ttl)$/)) {
      // Allow storage of file
      cb(null, true);
    } else {
      // Reject file
      cb(new HttpException(`Unsupported file type ${extname(file.originalname)}`, HttpStatus.BAD_REQUEST), false);
    }
  },
  // Storage properties
  storage: diskStorage({
    // Destination storage path details
    destination: (req: any, file: any, cb: any) => {
      uploadPath = '../resources';
      if(req.body['folder'] !== undefined) {
        uploadPath = uploadPath + req.body['folder'];
      }
      // Create folder if doesn't exist
      if (!existsSync(uploadPath)) {
        mkdirSync(uploadPath);
      }
      console.log(uploadPath);
      cb(null, uploadPath);
    },
    // File modification details
    filename: (req: any, file: any, cb: any) => {
      // Calling the callback passing the random name generated with the original extension name
      let filename = `${file.originalname}`;
      let newFilename = filename;
      //file extension exists
      let n = filename.lastIndexOf('.');
      //add a number for duplicates
      let filenumber = 1;
      if (n >= 0) {
        while (fs.existsSync(`${uploadPath}/${newFilename}`)) {
          filenumber++;
          newFilename = filename.substring(0, n) + '(' + filenumber + ')' + filename.substring(n);
        }
      }
      console.log(`${newFilename}`);
      //save file as original filename.
      cb(null, `${newFilename}`)
    },
  }),
};
