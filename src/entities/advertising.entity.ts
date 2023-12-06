import {
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  Entity,
  DeleteDateColumn,
  OneToMany,
} from 'typeorm';
import { AdvertisingType } from './advertising-type.entity';
import { User } from './user.entity';
import { AdvertisingSchedule } from './advertising-schedule.entity';
import { AdvertisingSector } from './advertising-sector.entity';

@Entity({ name: 'Advertising' })
export class Advertising {
  @PrimaryGeneratedColumn('identity')
  id: number;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar', nullable: true })
  payload: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamptz' })
  deletedAt: Date;

  @ManyToOne(() => AdvertisingType, (advertisingType) => advertisingType.id, {
    nullable: true,
    createForeignKeyConstraints: true,
  })
  advertisingType: AdvertisingType;

  @ManyToOne(() => User, (user) => user.id, {
    nullable: true,
    createForeignKeyConstraints: true,
  })
  user: User;

  @OneToMany(
    () => AdvertisingSector,
    (advertisingSector) => advertisingSector.advertising,
    {
      nullable: true,
      createForeignKeyConstraints: true,
    },
  )
  advertisingSectors: AdvertisingSector[];

  @OneToMany(
    () => AdvertisingSchedule,
    (advertisingSchedule) => advertisingSchedule.advertising,
    {
      nullable: true,
      createForeignKeyConstraints: true,
    },
  )
  advertisingSchedules: AdvertisingSchedule[];
}
