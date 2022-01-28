import { Controller, Post, UseInterceptors, UploadedFile, Req, Request } from '@nestjs/common';
import { FileService } from './file.service';
import { diskStorage } from 'multer';
import { FileInterceptor } from "@nestjs/platform-express";
import * as fs from 'fs';
import { multerOptions } from './file.inceptor';


@Controller('file')
export class FileController {

  constructor(
    private readonly fileService: FileService,
  ) {
  }

  @Post()
  // @Post(':folder')
  @UseInterceptors(FileInterceptor('file', multerOptions))
  async upload(@UploadedFile() file) {
    // console.log(req.body['omg'])
    console.log('done')
  }
  //
  // @Get()
  // async findAll() {
  //   return JSON.stringify(await this.shapeService.getAllShapeFiles());
  // }
  //
  // @Get(':file')
  // async findOne(@Param('file') file: string) {
  //   return await this.shapeService.loadShape(file);
  // }
  //
  // @Delete(':file')
  // async delete(@Param('file') file: string) {
  //   return await this.fileService.deleteFile('shapes/'+file);
  // }
}
