import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateImage1694718128534 implements MigrationInterface {
  name = 'CreateImage1694718128534';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "Image" DROP COLUMN "fileName"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "Image" ADD "fileName" character varying NOT NULL`,
    );
  }
}
