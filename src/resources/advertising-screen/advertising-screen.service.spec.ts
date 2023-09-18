import { Test, TestingModule } from '@nestjs/testing';
import { AdvertisingScreenService } from './advertising-screen.service';

describe('AdvertisingScreenService', () => {
  let service: AdvertisingScreenService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AdvertisingScreenService],
    }).compile();

    service = module.get<AdvertisingScreenService>(AdvertisingScreenService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
