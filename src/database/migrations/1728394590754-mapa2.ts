import { MigrationInterface, QueryRunner } from 'typeorm';

export class Mapa21728394590754 implements MigrationInterface {
  name = 'Mapa21728394590754';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "Map" ADD "name" text NOT NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "Map" DROP COLUMN "name"`);
  }
}
