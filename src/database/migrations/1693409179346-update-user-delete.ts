import { MigrationInterface, QueryRunner } from 'typeorm';

export class updateUserDelete1693409179346 implements MigrationInterface {
  name = 'updateUserDelete1693409179346';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "User" RENAME COLUMN "deleteAt" TO "deletedAt"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "User" RENAME COLUMN "deletedAt" TO "deleteAt"`,
    );
  }
}
