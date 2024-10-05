import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1727313878790 implements MigrationInterface {
  name = 'Migrations1727313878790';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "User" ADD "idKeycloak" character varying(1024)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "User" DROP COLUMN "idKeycloak"`);
  }
}
