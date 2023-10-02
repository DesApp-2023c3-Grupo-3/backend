import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1696272266524 implements MigrationInterface {
  name = 'Migrations1696272266524';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "Screen" ADD "subscription" character varying(100)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "Screen" DROP COLUMN "subscription"`);
  }
}
