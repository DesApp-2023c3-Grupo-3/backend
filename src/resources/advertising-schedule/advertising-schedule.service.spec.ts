import { Test, TestingModule } from '@nestjs/testing';
import { AdvertisingScheduleService } from './advertising-schedule.service';

describe('AdvertisingScheduleService', () => {
  let service: AdvertisingScheduleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AdvertisingScheduleService],
    }).compile();

    service = module.get<AdvertisingScheduleService>(
      AdvertisingScheduleService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
