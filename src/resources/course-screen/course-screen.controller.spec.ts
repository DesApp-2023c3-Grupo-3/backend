import { Test, TestingModule } from '@nestjs/testing';
import { CourseScreenController } from './course-screen.controller';
import { CourseScreenService } from './course-screen.service';

describe('CourseScreenController', () => {
  let controller: CourseScreenController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CourseScreenController],
      providers: [CourseScreenService],
    }).compile();

    controller = module.get<CourseScreenController>(CourseScreenController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
