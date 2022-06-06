import { MigrationInterface, QueryRunner } from 'typeorm';

export class UserEntityCreated1649593208265 implements MigrationInterface {
  name = 'UserEntityCreated1649593208265';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "users" ("createdBy" character varying, "createdDate" TIMESTAMP DEFAULT now(), "updatedBy" character varying, "updatedDate" TIMESTAMP DEFAULT now(), "id" uuid NOT NULL, "firstName" character varying(50), "lastName" character varying(50), "username" character varying(50), "email" character varying(125) NOT NULL, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "users"`);
  }
}
