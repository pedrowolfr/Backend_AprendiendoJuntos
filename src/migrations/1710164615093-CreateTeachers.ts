import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateTeachers1710164615093 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "teachers",
        columns: [
          {
            name: "id",
            type: "int",
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "increment",
          },
          {
            name: "user_id",
            type: "int",
          },
          {
            name: "photo",
            type: "varchar",
            length: "500",
            default:
              "'https://cdn.icon-icons.com/icons2/4178/PNG/512/emotemotion_smile_avatar_expression_face_icon_262136.png'",
          },
          {
            name: "subject",
            type: "varchar",
            length: "100",
          },
          {
            name: "created_at",
            type: "timestamp",
            default: "CURRENT_TIMESTAMP",
          },
          {
            name: "updated_at",
            type: "timestamp",
            default: "CURRENT_TIMESTAMP",
            onUpdate: "CURRENT_TIMESTAMP",
          },
        ],
        foreignKeys: [
          {
            columnNames: ["user_id"],
            referencedTableName: "users",
            referencedColumnNames: ["id"],
            onDelete: "CASCADE",
          },
        ],
      }),
      true
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("teachers");
  }
}
