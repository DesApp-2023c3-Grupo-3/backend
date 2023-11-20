import { MigrationInterface, QueryRunner } from 'typeorm';

export class Imagne1700508600086 implements MigrationInterface {
  name = 'Imagne1700508600086';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "Advertising" DROP CONSTRAINT "FK_fb5d24358f18707421fbfe4f4b9"`,
    );
    await queryRunner.query(`ALTER TABLE "Advertising" DROP COLUMN "sectorId"`);
    await queryRunner.query(
      `ALTER TABLE "Image" ADD "base64Data" text NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "Image" DROP COLUMN "base64Data"`);
    await queryRunner.query(`ALTER TABLE "Advertising" ADD "sectorId" integer`);
    await queryRunner.query(
      `ALTER TABLE "Advertising" ADD CONSTRAINT "FK_fb5d24358f18707421fbfe4f4b9" FOREIGN KEY ("sectorId") REFERENCES "Sector"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
