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
  startDate: Date; //Rango de cunado inicia

  @Column({ type: 'timestamptz' })
  endDate: Date; //Cuando termina el rango

  @Column({ type: 'timestamptz' })
  startHour: Date; // Hora de inicio LU-20:34:67

  @Column({ type: 'timestamptz' })
  endHour: Date;

  @Column({ type: 'text' })
  dayCode: string; // TODO: Esto debe persistir el dia ["LU", "MA", "MI", "JU", "VI", "SA", "DO"]

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
