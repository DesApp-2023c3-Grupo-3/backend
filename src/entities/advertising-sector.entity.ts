import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
} from 'typeorm';
import { Advertising } from './advertising.entity';
import { Sector } from './sector.entity';

@Entity({ name: 'AdvertisingSector' })
export class AdvertisingSector {
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

  @ManyToOne(() => Sector, (sector) => sector.advertisingSectors, {
    nullable: true,
    createForeignKeyConstraints: true,
  })
  sector: Sector;
}
