import { Test, TestingModule } from '@nestjs/testing';
import { ImageScreenService } from './advertising-screen.service';

describe('ImageScreenService', () => {
  let service: ImageScreenService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ImageScreenService],
    }).compile();

    service = module.get<ImageScreenService>(ImageScreenService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
