import { Test, TestingModule } from '@nestjs/testing';
import { AdvertisingScheduleController } from './advertising-schedule.controller';
import { AdvertisingScheduleService } from './advertising-schedule.service';

describe('AdvertisingScheduleController', () => {
  let controller: AdvertisingScheduleController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdvertisingScheduleController],
      providers: [AdvertisingScheduleService],
    }).compile();

    controller = module.get<AdvertisingScheduleController>(
      AdvertisingScheduleController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
