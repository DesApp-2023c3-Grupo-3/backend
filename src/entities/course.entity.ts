import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Sector } from './sector.entity';
import { User } from './user.entity';
import { Schedule } from './schedule.entity';
import { Subject } from './subject.entity';
import { Classroom } from './classroom.entity';

@Entity({ name: 'Course' })
export class Course {
  @PrimaryGeneratedColumn('identity')
  id: number;

  @Column({ type: 'varchar' })
  name: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamptz' })
  deletedAt: Date;

  @ManyToOne(() => User, (user) => user.id, {
    nullable: true,
    createForeignKeyConstraints: true,
  })
  user: User;

  @ManyToOne(() => Sector, (sector) => sector.id, {
    nullable: true,
    createForeignKeyConstraints: true,
  })
  sector: Sector;

  @ManyToOne(() => Schedule, (schedule) => schedule.id, {
    nullable: true,
    createForeignKeyConstraints: true,
  })
  schedule: Schedule;

  @ManyToOne(() => Subject, (subject) => subject.id, {
    nullable: true,
    createForeignKeyConstraints: true,
  })
  subject: Subject;

  @ManyToOne(() => Classroom, (classroom) => classroom.id, {
    nullable: true,
    createForeignKeyConstraints: true,
  })
  classroom: Classroom;
}
