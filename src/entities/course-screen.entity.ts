import {
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Course } from './course.entity';
import { Screen } from './screen.entity';

@Entity({ name: 'CourseScreen' })
export class CourseScreen {
  @PrimaryGeneratedColumn('identity')
  id: number;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamptz' })
  deletedAt: Date;

  @ManyToOne(() => Course, (course) => course.id, {
    nullable: true,
    createForeignKeyConstraints: true,
  })
  course: Course;

  @ManyToOne(() => Screen, (screen) => screen.id, {
    nullable: true,
    createForeignKeyConstraints: true,
  })
  screen: Screen;
}
