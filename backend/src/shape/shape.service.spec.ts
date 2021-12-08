import { Test, TestingModule } from '@nestjs/testing';
import { ShapeService } from './shape.service';
import { FileService } from '../file/file.service';

describe('ShapeService', () => {
  let service: ShapeService;
  let file: FileService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ShapeService, FileService],
    }).compile();

    service = module.get<ShapeService>(ShapeService);
    file = module.get<FileService>(FileService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
