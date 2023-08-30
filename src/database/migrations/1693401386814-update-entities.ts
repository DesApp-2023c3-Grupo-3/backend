import { MigrationInterface, QueryRunner } from 'typeorm';

export class updateEntities1693401386814 implements MigrationInterface {
  name = 'updateEntities1693401386814';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "Clasroom" RENAME COLUMN "deleteAt" TO "createdAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "User" RENAME COLUMN "deletedAt" TO "createdAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "Screen" RENAME COLUMN "deleteAt" TO "createdAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "CourseScreen" RENAME COLUMN "deleteAt" TO "createdAt"`,
    );
    await queryRunner.query(
      `CREATE TABLE "contacto" ("id" SERIAL NOT NULL, "nombre" character varying(100) NOT NULL, "edad" integer NOT NULL, "email" character varying, CONSTRAINT "PK_fcab8128cce0aac92da26cf1883" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`ALTER TABLE "Image" DROP COLUMN "deleteAt"`);
    await queryRunner.query(
      `ALTER TABLE "Image" ADD "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "Clasroom" ALTER COLUMN "createdAt" SET DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "Clasroom" ALTER COLUMN "deletedAt" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "Clasroom" ALTER COLUMN "createdAt" SET DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "Clasroom" ALTER COLUMN "deletedAt" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "Screen" ALTER COLUMN "createdAt" SET DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "Screen" ALTER COLUMN "deletedAt" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "CourseScreen" ALTER COLUMN "createdAt" SET DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "CourseScreen" ALTER COLUMN "deletedAt" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "Image" ALTER COLUMN "deletedAt" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "Image" ALTER COLUMN "deletedAt" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "Clasroom" ALTER COLUMN "createdAt" SET DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "Clasroom" ALTER COLUMN "deletedAt" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "Clasroom" ALTER COLUMN "createdAt" SET DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "Clasroom" ALTER COLUMN "deletedAt" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "Screen" ALTER COLUMN "createdAt" SET DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "Screen" ALTER COLUMN "deletedAt" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "CourseScreen" ALTER COLUMN "createdAt" SET DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "CourseScreen" ALTER COLUMN "deletedAt" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "Image" ALTER COLUMN "deletedAt" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "Image" ALTER COLUMN "deletedAt" DROP DEFAULT`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "Image" ALTER COLUMN "deletedAt" SET DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "Image" ALTER COLUMN "deletedAt" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "CourseScreen" ALTER COLUMN "deletedAt" SET DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "CourseScreen" ALTER COLUMN "createdAt" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "Screen" ALTER COLUMN "deletedAt" SET DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "Screen" ALTER COLUMN "createdAt" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "Clasroom" ALTER COLUMN "deletedAt" SET DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "Clasroom" ALTER COLUMN "createdAt" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "Clasroom" ALTER COLUMN "deletedAt" SET DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "Clasroom" ALTER COLUMN "createdAt" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "Image" ALTER COLUMN "deletedAt" SET DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "Image" ALTER COLUMN "deletedAt" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "CourseScreen" ALTER COLUMN "deletedAt" SET DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "CourseScreen" ALTER COLUMN "createdAt" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "Screen" ALTER COLUMN "deletedAt" SET DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "Screen" ALTER COLUMN "createdAt" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "Clasroom" ALTER COLUMN "deletedAt" SET DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "Clasroom" ALTER COLUMN "createdAt" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "Clasroom" ALTER COLUMN "deletedAt" SET DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "Clasroom" ALTER COLUMN "createdAt" DROP DEFAULT`,
    );
    await queryRunner.query(`ALTER TABLE "Image" DROP COLUMN "createdAt"`);
    await queryRunner.query(
      `ALTER TABLE "Image" ADD "deleteAt" TIMESTAMP WITH TIME ZONE NOT NULL`,
    );
    await queryRunner.query(`DROP TABLE "contacto"`);
    await queryRunner.query(
      `ALTER TABLE "CourseScreen" RENAME COLUMN "createdAt" TO "deleteAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "Screen" RENAME COLUMN "createdAt" TO "deleteAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "User" RENAME COLUMN "createdAt" TO "deletedAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "Clasroom" RENAME COLUMN "createdAt" TO "deleteAt"`,
    );
  }
}
