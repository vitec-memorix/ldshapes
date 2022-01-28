import { Controller, Post, UseInterceptors, UploadedFile, Req, Request, Get, Res, StreamableFile, Response, Query } from '@nestjs/common';
import { FileService } from './file.service';
import { FileInterceptor } from "@nestjs/platform-express";
import { multerOptions } from './file.inceptor';
import { createReadStream } from 'fs';
import { join } from 'path';

@Controller('file')
export class FileController {

  constructor(
    private readonly fileService: FileService,
  ) {
  }

  @Post()
  @UseInterceptors(FileInterceptor('file', multerOptions))
  async upload(@UploadedFile() file) {
    // console.log(req.body['omg'])
    console.log('done')
  }

  @Get()
  getFile(@Query() query): StreamableFile {
    let filePath = '../resources';
    if(query['folder']) {
      filePath += query['folder'];
    }
    console.log(`${filePath}/${query['file']}`);
    const file = createReadStream(`${filePath}/${query['file']}`);
    return new StreamableFile(file);
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
