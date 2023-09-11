import { Test, TestingModule } from '@nestjs/testing';
import { AdvertisingService } from './advertising.service';

describe('AdvertisingService', () => {
  let service: AdvertisingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AdvertisingService],
    }).compile();

    service = module.get<AdvertisingService>(AdvertisingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
