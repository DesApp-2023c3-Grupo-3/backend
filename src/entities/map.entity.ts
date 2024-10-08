import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'Map' })
export class Map {
  @PrimaryGeneratedColumn('identity')
  id: number;

  @Column()
  originalName: string;

  @Column({ type: 'text' })
  base64Data: string;

  @Column({ type: 'text' })
  name: string;

  @Column({ type: 'timestamptz', nullable: true })
  deletedAt: Date;
}
