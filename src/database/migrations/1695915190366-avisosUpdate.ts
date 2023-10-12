import { MigrationInterface, QueryRunner } from 'typeorm';

export class AvisosUpdate1695915190366 implements MigrationInterface {
  name = 'AvisosUpdate1695915190366';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "AdvertisingType" ("id" integer GENERATED BY DEFAULT AS IDENTITY NOT NULL, "name" character varying(1024) NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_d2feff1b369d450a04b636cb21b" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "Sector" ("id" integer GENERATED BY DEFAULT AS IDENTITY NOT NULL, "name" character varying(1024) NOT NULL, "topic" character varying(1024) NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_4167cf23fa540adbb11cc5b4825" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "Role" ("id" integer GENERATED BY DEFAULT AS IDENTITY NOT NULL, "name" character varying NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_9309532197a7397548e341e5536" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "User" ("id" integer GENERATED BY DEFAULT AS IDENTITY NOT NULL, "name" character varying(1024) NOT NULL, "dni" character varying(1024) NOT NULL, "password" character varying(1024) NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, "roleId" integer, CONSTRAINT "PK_9862f679340fb2388436a5ab3e4" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "Advertising" ("id" integer GENERATED BY DEFAULT AS IDENTITY NOT NULL, "name" character varying NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, "advertisingTypeId" integer, "userId" integer, "sectorId" integer, CONSTRAINT "PK_2bcfc39a910f60618f47fabd427" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "Schedule" ("id" integer GENERATED BY DEFAULT AS IDENTITY NOT NULL, "startDate" TIMESTAMP WITH TIME ZONE NOT NULL, "endDate" TIMESTAMP WITH TIME ZONE NOT NULL, "startHour" TIMESTAMP WITH TIME ZONE NOT NULL, "endHour" TIMESTAMP WITH TIME ZONE NOT NULL, "dayCode" text NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_1e0db675cb5a22276ffd69b1a5a" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "AdvertisingSchedule" ("id" integer GENERATED BY DEFAULT AS IDENTITY NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, "advertisingId" integer, "scheduleId" integer, CONSTRAINT "PK_82aba0d7c15258f3cdeb557c4e3" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "Screen" ("id" integer GENERATED BY DEFAULT AS IDENTITY NOT NULL, "subscription" character varying(100) NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, "sectorId" integer, CONSTRAINT "PK_bf86825808b3babf300fad57b2f" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "AdvertisingScreen" ("id" integer GENERATED BY DEFAULT AS IDENTITY NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, "advertisingId" integer, "screenId" integer, CONSTRAINT "PK_5169b16d20fe839cf0ad0926281" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "Classroom" ("id" integer GENERATED BY DEFAULT AS IDENTITY NOT NULL, "name" character varying NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_6ff2b3fa3d6fc07411ba4a9cbe0" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "Subject" ("id" integer GENERATED BY DEFAULT AS IDENTITY NOT NULL, "name" character varying(1024) NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_ea85b796e06e827fbb699842d58" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "Course" ("id" integer GENERATED BY DEFAULT AS IDENTITY NOT NULL, "name" character varying NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, "userId" integer, "sectorId" integer, "scheduleId" integer, "subjectId" integer, "classroomId" integer, CONSTRAINT "PK_2132e2054a5c04b038320b38c11" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "CourseScreen" ("id" integer GENERATED BY DEFAULT AS IDENTITY NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, "courseId" integer, "screenId" integer, CONSTRAINT "PK_3ce824a52e194b0cd3442df1ca9" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "Image" ("id" integer GENERATED BY DEFAULT AS IDENTITY NOT NULL, "originalName" character varying NOT NULL, "path" character varying NOT NULL, CONSTRAINT "PK_ddecd6b02f6dd0d3d10a0a74717" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "User" ADD CONSTRAINT "FK_0b8c60cc29663fa5b9fb108edd7" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "Advertising" ADD CONSTRAINT "FK_2c51b97355ca547f9a560f462fb" FOREIGN KEY ("advertisingTypeId") REFERENCES "AdvertisingType"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "Advertising" ADD CONSTRAINT "FK_11b3988f2add47245cec97b5164" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "Advertising" ADD CONSTRAINT "FK_fb5d24358f18707421fbfe4f4b9" FOREIGN KEY ("sectorId") REFERENCES "Sector"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "AdvertisingSchedule" ADD CONSTRAINT "FK_b914c0b5ceaa351520e144a29a0" FOREIGN KEY ("advertisingId") REFERENCES "Advertising"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "AdvertisingSchedule" ADD CONSTRAINT "FK_3bd6cfe53121b7ebb29aa79512a" FOREIGN KEY ("scheduleId") REFERENCES "Schedule"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "Screen" ADD CONSTRAINT "FK_2374181548ba49b8c2e6e3a7ced" FOREIGN KEY ("sectorId") REFERENCES "Sector"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "AdvertisingScreen" ADD CONSTRAINT "FK_e6a5cecd58fe45da16a125c0ef2" FOREIGN KEY ("advertisingId") REFERENCES "Advertising"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "AdvertisingScreen" ADD CONSTRAINT "FK_e0c4a1dba0cd873ca7e10cba7c8" FOREIGN KEY ("screenId") REFERENCES "Screen"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "Course" ADD CONSTRAINT "FK_2d3ae7fc1f3090a4fa020729769" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "Course" ADD CONSTRAINT "FK_f45b26770933751b6f1fc03a06a" FOREIGN KEY ("sectorId") REFERENCES "Sector"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "Course" ADD CONSTRAINT "FK_88a8486e09bca1b969d4fb1e175" FOREIGN KEY ("scheduleId") REFERENCES "Schedule"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "Course" ADD CONSTRAINT "FK_f1374564cf131d69c62896c77e7" FOREIGN KEY ("subjectId") REFERENCES "Subject"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "Course" ADD CONSTRAINT "FK_ddae32113f4ef42f1d01838e84f" FOREIGN KEY ("classroomId") REFERENCES "Classroom"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "CourseScreen" ADD CONSTRAINT "FK_a2fb3bd3f4ad5545e6c0924c211" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "CourseScreen" ADD CONSTRAINT "FK_7adcdb55d8b2a445a50470f11ca" FOREIGN KEY ("screenId") REFERENCES "Screen"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "CourseScreen" DROP CONSTRAINT "FK_7adcdb55d8b2a445a50470f11ca"`,
    );
    await queryRunner.query(
      `ALTER TABLE "CourseScreen" DROP CONSTRAINT "FK_a2fb3bd3f4ad5545e6c0924c211"`,
    );
    await queryRunner.query(
      `ALTER TABLE "Course" DROP CONSTRAINT "FK_ddae32113f4ef42f1d01838e84f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "Course" DROP CONSTRAINT "FK_f1374564cf131d69c62896c77e7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "Course" DROP CONSTRAINT "FK_88a8486e09bca1b969d4fb1e175"`,
    );
    await queryRunner.query(
      `ALTER TABLE "Course" DROP CONSTRAINT "FK_f45b26770933751b6f1fc03a06a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "Course" DROP CONSTRAINT "FK_2d3ae7fc1f3090a4fa020729769"`,
    );
    await queryRunner.query(
      `ALTER TABLE "AdvertisingScreen" DROP CONSTRAINT "FK_e0c4a1dba0cd873ca7e10cba7c8"`,
    );
    await queryRunner.query(
      `ALTER TABLE "AdvertisingScreen" DROP CONSTRAINT "FK_e6a5cecd58fe45da16a125c0ef2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "Screen" DROP CONSTRAINT "FK_2374181548ba49b8c2e6e3a7ced"`,
    );
    await queryRunner.query(
      `ALTER TABLE "AdvertisingSchedule" DROP CONSTRAINT "FK_3bd6cfe53121b7ebb29aa79512a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "AdvertisingSchedule" DROP CONSTRAINT "FK_b914c0b5ceaa351520e144a29a0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "Advertising" DROP CONSTRAINT "FK_fb5d24358f18707421fbfe4f4b9"`,
    );
    await queryRunner.query(
      `ALTER TABLE "Advertising" DROP CONSTRAINT "FK_11b3988f2add47245cec97b5164"`,
    );
    await queryRunner.query(
      `ALTER TABLE "Advertising" DROP CONSTRAINT "FK_2c51b97355ca547f9a560f462fb"`,
    );
    await queryRunner.query(
      `ALTER TABLE "User" DROP CONSTRAINT "FK_0b8c60cc29663fa5b9fb108edd7"`,
    );
    await queryRunner.query(`DROP TABLE "Image"`);
    await queryRunner.query(`DROP TABLE "CourseScreen"`);
    await queryRunner.query(`DROP TABLE "Course"`);
    await queryRunner.query(`DROP TABLE "Subject"`);
    await queryRunner.query(`DROP TABLE "Classroom"`);
    await queryRunner.query(`DROP TABLE "AdvertisingScreen"`);
    await queryRunner.query(`DROP TABLE "Screen"`);
    await queryRunner.query(`DROP TABLE "AdvertisingSchedule"`);
    await queryRunner.query(`DROP TABLE "Schedule"`);
    await queryRunner.query(`DROP TABLE "Advertising"`);
    await queryRunner.query(`DROP TABLE "User"`);
    await queryRunner.query(`DROP TABLE "Role"`);
    await queryRunner.query(`DROP TABLE "Sector"`);
    await queryRunner.query(`DROP TABLE "AdvertisingType"`);
  }
}