import { Test, TestingModule } from '@nestjs/testing';
import { LoadShapeService } from './load-shape.service';

describe('LoadShapeService', () => {
  let service: LoadShapeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LoadShapeService],
    }).compile();

    service = module.get<LoadShapeService>(LoadShapeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
