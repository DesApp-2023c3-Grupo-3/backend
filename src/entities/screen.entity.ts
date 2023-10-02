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

@Entity({ name: 'Screen' })
export class Screen {
  @PrimaryGeneratedColumn('identity')
  id: number;

  @Column({ type: 'varchar', length: 100 })
  subscription: string;

  @Column({ type: 'varchar', length: 100 })
  templeteId: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamptz' })
  deletedAt: Date;

  @ManyToOne(() => Sector, (sector) => sector.id, {
    nullable: true,
    createForeignKeyConstraints: true,
  })
  sector: Sector;
}
