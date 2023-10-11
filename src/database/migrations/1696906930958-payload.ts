import { MigrationInterface, QueryRunner } from 'typeorm';

export class Payload1696906930958 implements MigrationInterface {
  name = 'Payload1696906930958';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "Advertising" ADD "payload" character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "Advertising" DROP COLUMN "payload"`);
  }
}
