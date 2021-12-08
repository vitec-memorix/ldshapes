import { Test, TestingModule } from '@nestjs/testing';
import { GenerateShapeService } from './generate-shape/generate-shape.service';

describe('GenerateShapeService', () => {
  let service: GenerateShapeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GenerateShapeService],
    }).compile();

    service = module.get<GenerateShapeService>(GenerateShapeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
