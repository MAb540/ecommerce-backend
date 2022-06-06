import { MigrationInterface, QueryRunner } from 'typeorm';

export class UserEntityUpdated1651844304836 implements MigrationInterface {
  name = 'UserEntityUpdated1651844304836';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" ADD "role" smallint NOT NULL DEFAULT '1'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "role"`);
  }
}
