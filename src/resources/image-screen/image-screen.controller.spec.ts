import { Test, TestingModule } from '@nestjs/testing';
import { ImageScreenController } from './image-screen.controller';
import { ImageScreenService } from './image-screen.service';

describe('ImageScreenController', () => {
  let controller: ImageScreenController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ImageScreenController],
      providers: [ImageScreenService],
    }).compile();

    controller = module.get<ImageScreenController>(ImageScreenController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
