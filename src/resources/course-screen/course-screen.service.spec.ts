import { Test, TestingModule } from '@nestjs/testing';
import { CourseScreenService } from './course-screen.service';

describe('CourseScreenService', () => {
  let service: CourseScreenService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CourseScreenService],
    }).compile();

    service = module.get<CourseScreenService>(CourseScreenService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
