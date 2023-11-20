import { MigrationInterface, QueryRunner } from 'typeorm';

export class SacoPath1700509782726 implements MigrationInterface {
  name = 'SacoPath1700509782726';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "Image" DROP COLUMN "path"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "Image" ADD "path" character varying NOT NULL`,
    );
  }
}
