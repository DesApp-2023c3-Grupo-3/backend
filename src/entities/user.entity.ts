import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Role } from './role.entity';

@Entity({ name: 'User' })
export class User {
  @PrimaryGeneratedColumn('identity')
  id: number;

  @Column({ length: 1024 })
  name: string;

  @Column({ length: 1024 })
  dni: string;

  @Column({ length: 1024 })
  password: string;

  @Column({ length: 1024, nullable: true })
  idKeycloak: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamptz' })
  deletedAt: Date;

  @ManyToOne(() => Role, (role) => role.id, {
    nullable: true,
    createForeignKeyConstraints: true,
  })
  role: Role;
}
