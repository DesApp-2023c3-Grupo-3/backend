import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateImage1694718545055 implements MigrationInterface {
  name = 'CreateImage1694718545055';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "Image" ADD "path" character varying NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "Image" DROP COLUMN "path"`);
  }
}
