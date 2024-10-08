import { MigrationInterface, QueryRunner } from 'typeorm';

export class Mapa31728398063345 implements MigrationInterface {
  name = 'Mapa31728398063345';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "Map" ADD "deletedAt" TIMESTAMP WITH TIME ZONE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "Map" DROP COLUMN "deletedAt"`);
  }
}
