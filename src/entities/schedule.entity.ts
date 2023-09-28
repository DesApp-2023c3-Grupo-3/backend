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

  @Column({ type: 'timestamptz' })
  startHour: Date;
  @Column({ type: 'timestamptz' })
  endHour: Date;

  @Column({ type: 'text' })
  dayCode: string;

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
