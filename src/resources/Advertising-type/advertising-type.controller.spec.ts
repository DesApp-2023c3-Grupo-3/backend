import { Test, TestingModule } from '@nestjs/testing';
import { AdvertisingTypeController } from './advertising-type.controller';
import { AdvertisingTypeService } from './advertising-type.service';

describe('AdvertisingTypeController', () => {
  let controller: AdvertisingTypeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdvertisingTypeController],
      providers: [AdvertisingTypeService],
    }).compile();

    controller = module.get<AdvertisingTypeController>(
      AdvertisingTypeController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
