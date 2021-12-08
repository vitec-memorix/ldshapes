import { Injectable } from '@nestjs/common';
import { CreateShapeDto } from './dto/create-shape.dto';
import { GenerateShapeService } from './generate-shape/generate-shape.service';
import { LoadShapeService } from './load-shape/load-shape.service';
import { FileService } from '../file/file.service';

@Injectable()
export class ShapeService {
  constructor(private readonly generateShapeService: GenerateShapeService) {

  }

  createShape(createShapeDto: CreateShapeDto) {
    return this.generateShapeService.create(createShapeDto);
  }

  async getAllShapeFiles() {
    const fileService = new FileService();
    return await fileService.GetFileListing('shapes');
  }

  async loadShape(file) {
    // const tmp = new CreateShapeDto();
    if (file === 'new') {
      console.log(new CreateShapeDto());
      return new CreateShapeDto();
    }
    const loadShapeService = new LoadShapeService();
    return await loadShapeService.create(file);
  }
}
