import {
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Entity,
} from 'typeorm';
import { Advertising } from './advertising.entity';
import { Screen } from './screen.entity';

@Entity({ name: 'AdvertisingScreen' })
export class AdvertisingScreen {
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

  @ManyToOne(() => Screen, (screen) => screen.id, {
    nullable: true,
    createForeignKeyConstraints: true,
  })
  screen: Screen;
}
