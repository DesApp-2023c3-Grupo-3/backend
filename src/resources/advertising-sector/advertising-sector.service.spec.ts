import { Test, TestingModule } from '@nestjs/testing';
import { AdvertisingSectorService } from './advertising-sector.service';

describe('AdvertisingSectorService', () => {
  let service: AdvertisingSectorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AdvertisingSectorService],
    }).compile();

    service = module.get<AdvertisingSectorService>(AdvertisingSectorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
