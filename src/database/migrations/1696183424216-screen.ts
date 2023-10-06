import { MigrationInterface, QueryRunner } from 'typeorm';

export class Screen1696183424216 implements MigrationInterface {
  name = 'Screen1696183424216';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "Screen" RENAME COLUMN "subscription" TO "templeteId"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "Screen" RENAME COLUMN "templeteId" TO "subscription"`,
    );
  }
}
