import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Screen } from './screen.entity';

@Entity({ name: 'Sector' })
export class Sector {
  @PrimaryGeneratedColumn('identity')
  id: number;

  @Column({ length: 1024 })
  name: string;

  @Column({ length: 1024 })
  topic: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamptz' })
  deletedAt: Date;

  @OneToMany(() => Screen, (screen) => screen.sector, {
    nullable: true,
    createForeignKeyConstraints: true,
  })
  screens: Screen[];
}
