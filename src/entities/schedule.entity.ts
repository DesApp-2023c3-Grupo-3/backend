import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { AdvertisingSchedule } from './advertising-schedule.entity';

@Entity({ name: 'Schedule' })
export class Schedule {
  @PrimaryGeneratedColumn('identity')
  id: number;

  @Column({ type: 'timestamptz' })
  startDate: Date;

  @Column({ type: 'timestamptz' })
  endDate: Date;

  @Column({ type: 'time' })
  startHour: string;

  @Column({ type: 'time' })
  endHour: string;

  @Column({ type: 'varchar' })
  scheduleDays: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamptz' })
  deletedAt: Date;

  @OneToMany(
    () => AdvertisingSchedule,
    (advertisingSchedule) => advertisingSchedule.schedule,
    {
      createForeignKeyConstraints: true,
    },
  )
  advertisingSchedules: AdvertisingSchedule[];
}
