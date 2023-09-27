import { MigrationInterface, QueryRunner } from 'typeorm';

export class AvisosSchedules1695829416183 implements MigrationInterface {
  name = 'AvisosSchedules1695829416183';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "Advertising" DROP CONSTRAINT "FK_4abf5164f528c3101e98a73c09b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "Advertising" DROP COLUMN "scheduleId"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "Advertising" ADD "scheduleId" integer`,
    );
    await queryRunner.query(
      `ALTER TABLE "Advertising" ADD CONSTRAINT "FK_4abf5164f528c3101e98a73c09b" FOREIGN KEY ("scheduleId") REFERENCES "Schedule"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
