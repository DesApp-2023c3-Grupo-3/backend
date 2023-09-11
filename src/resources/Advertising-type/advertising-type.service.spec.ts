import { Test, TestingModule } from '@nestjs/testing';
import { AdvertisingTypeService } from './advertising-type.service';

describe('AdvertisingTypeService', () => {
  let service: AdvertisingTypeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AdvertisingTypeService],
    }).compile();

    service = module.get<AdvertisingTypeService>(AdvertisingTypeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
