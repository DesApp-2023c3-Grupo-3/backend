import { MigrationInterface, QueryRunner } from "typeorm";

export class asd1692746027680 implements MigrationInterface {
  name = 'asd1692746027680'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "contacto" ADD "email" character varying`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "contacto" DROP COLUMN "email"`);
  }

}
