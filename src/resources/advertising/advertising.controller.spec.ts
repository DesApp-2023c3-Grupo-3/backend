import { Test, TestingModule } from '@nestjs/testing';
import { AdvertisingController } from './advertising.controller';
import { AdvertisingService } from './advertising.service';

describe('AdvertisingController', () => {
  let controller: AdvertisingController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdvertisingController],
      providers: [AdvertisingService],
    }).compile();

    controller = module.get<AdvertisingController>(AdvertisingController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
