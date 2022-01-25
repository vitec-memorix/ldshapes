import { Injectable } from '@nestjs/common';
import { CreateShapeDto } from './dto/create-shape.dto';
import { GenerateShapeService } from './generate-shape/generate-shape.service';
import { LoadShapeService } from './load-shape/load-shape.service';
import { FileService } from '../file/file.service';

@Injectable()
export class ShapeService {
  constructor(
    private readonly generateShapeService: GenerateShapeService,
    private readonly loadShapeService: LoadShapeService,
    private readonly fileService: FileService,
  ) {}

  createShape(createShapeDto: CreateShapeDto) {
    return this.generateShapeService.create(createShapeDto);
  }

  async getAllShapeFiles() {
    return await this.fileService.GetFileListing('shapes');
  }

  async loadShape(file) {
    if (file === 'new') {
      return new CreateShapeDto();
    }

    return await this.loadShapeService.create(file);
  }
}
