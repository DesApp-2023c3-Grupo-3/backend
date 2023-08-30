import {
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  Entity,
  DeleteDateColumn,
} from 'typeorm';
import { ImageType } from './image-type.entity';
import { Schedule } from './schedule.entity';
import { Sector } from './sector.entity';
import { User } from './user.entity';

@Entity({ name: 'Image' })
export class Image {
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

  @ManyToOne(() => ImageType, (imageType) => imageType.id, {
    nullable: true,
    createForeignKeyConstraints: true,
  })
  imageType: ImageType;

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
}
