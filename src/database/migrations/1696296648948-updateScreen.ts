import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateScreen1696296648948 implements MigrationInterface {
  name = 'UpdateScreen1696296648948';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "Screen" ADD "courseIntervalTime" integer`,
    );
    await queryRunner.query(
      `ALTER TABLE "Screen" ADD "advertisingIntervalTime" integer`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "Screen" DROP COLUMN "advertisingIntervalTime"`,
    );
    await queryRunner.query(
      `ALTER TABLE "Screen" DROP COLUMN "courseIntervalTime"`,
    );
  }
}
