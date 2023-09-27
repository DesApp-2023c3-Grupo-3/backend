import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
} from 'typeorm';
import { Advertising } from './advertising.entity';
import { Schedule } from './schedule.entity';

@Entity({ name: 'AdvertisingSchedule' })
export class AdvertisingSchedule {
  @PrimaryGeneratedColumn('identity')
  id: number;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamptz' })
  deletedAt: Date;

  @ManyToOne(() => Advertising, (advertising) => advertising.id, {
    nullable: true,
    createForeignKeyConstraints: true,
  })
  advertising: Advertising;

  @ManyToOne(() => Schedule, (schedule) => schedule.id, {
    nullable: true,
    createForeignKeyConstraints: true,
  })
  schedule: Schedule;
}
