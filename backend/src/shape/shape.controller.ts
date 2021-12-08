import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ShapeService } from './shape.service';
import { CreateShapeDto } from './dto/create-shape.dto';


@Controller('shape')
export class ShapeController {
  constructor(private readonly shapeService: ShapeService) {}

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
}
