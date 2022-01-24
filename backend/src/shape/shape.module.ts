import { Module } from '@nestjs/common';
import { ShapeService } from './shape.service';
import { GenerateShapeService } from './generate-shape/generate-shape.service';
import { ShapeController } from './shape.controller';
import { LoadShapeService } from './load-shape/load-shape.service';
import { FileService } from 'src/file/file.service';

@Module({
  controllers: [ShapeController],
  providers: [
    ShapeService,
    GenerateShapeService,
    LoadShapeService,
    FileService,
  ],
})
export class ShapeModule {}
