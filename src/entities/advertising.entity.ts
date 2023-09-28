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
import { Sector } from './sector.entity';
import { User } from './user.entity';
import { AdvertisingSchedule } from './advertising-schedule.entity';

@Entity({ name: 'Advertising' })
export class Advertising {
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

  @ManyToOne(() => Sector, (sector) => sector.id, {
    nullable: true,
    createForeignKeyConstraints: true,
  })
  sector: Sector;

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
