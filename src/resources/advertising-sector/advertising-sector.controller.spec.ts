import { Test, TestingModule } from '@nestjs/testing';
import { AdvertisingSectorController } from './advertising-sector.controller';
import { AdvertisingSectorService } from './advertising-sector.service';

describe('AdvertisingSectorController', () => {
  let controller: AdvertisingSectorController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdvertisingSectorController],
      providers: [AdvertisingSectorService],
    }).compile();

    controller = module.get<AdvertisingSectorController>(
      AdvertisingSectorController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
