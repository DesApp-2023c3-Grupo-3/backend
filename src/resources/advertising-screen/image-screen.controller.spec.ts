import { Test, TestingModule } from '@nestjs/testing';
import { AdvertisingScreenController } from './image-screen.controller';
import { AdvertisingScreenService } from './image-screen.service';

describe('AdvertisingScreenController', () => {
  let controller: AdvertisingScreenController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdvertisingScreenController],
      providers: [AdvertisingScreenService],
    }).compile();

    controller = module.get<AdvertisingScreenController>(
      AdvertisingScreenController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
