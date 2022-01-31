import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { ShapeService } from './shape.service';
import { FileService } from '../file/file.service';
import { CreateShapeDto } from './dto/create-shape.dto';

@Controller('shape')
export class ShapeController {
  constructor(
    private readonly shapeService: ShapeService,
    private readonly fileService: FileService,
  ) {}

  @Post()
  async create(@Body() createShapeDto: CreateShapeDto) {
    return this.shapeService.createShape(createShapeDto);
  }

  @Get()
  async findAll() {
    return JSON.stringify(await this.shapeService.getAllShapeFiles());
  }

  @Get(':file')
  async findOne(@Param('file') file: string) {
    return await this.shapeService.loadShape(file);
  }

  @Delete(':file')
  async delete(@Param('file') file: string) {
    return await this.fileService.deleteFile('shapes/'+file);
  }
}
