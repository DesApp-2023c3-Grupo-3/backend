import { Test, TestingModule } from '@nestjs/testing';
import { ImageTypeService } from './image-type.service';

describe('ImageTypeService', () => {
  let service: ImageTypeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ImageTypeService],
    }).compile();

    service = module.get<ImageTypeService>(ImageTypeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
