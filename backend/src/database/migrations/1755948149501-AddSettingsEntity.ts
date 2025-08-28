import { MigrationInterface, QueryRunner } from "typeorm";

export class AddSettingsEntity1755948149501 implements MigrationInterface {
    name = 'AddSettingsEntity1755948149501'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "settings" ("id" varchar PRIMARY KEY NOT NULL, "key" varchar NOT NULL, "value" text NOT NULL, "type" varchar CHECK( "type" IN ('string','number','boolean','json') ) NOT NULL DEFAULT ('string'), "category" varchar CHECK( "category" IN ('general','pricing','operations','notifications','security') ) NOT NULL DEFAULT ('general'), "description" varchar, "isGlobal" boolean NOT NULL DEFAULT (0), "isEditable" boolean NOT NULL DEFAULT (1), "defaultValue" text, "validationRules" text, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "parkId" varchar, "createdById" varchar, CONSTRAINT "UQ_c8639b7626fa94ba8265628f214" UNIQUE ("key"))`);
        await queryRunner.query(`CREATE TABLE "temporary_settings" ("id" varchar PRIMARY KEY NOT NULL, "key" varchar NOT NULL, "value" text NOT NULL, "type" varchar CHECK( "type" IN ('string','number','boolean','json') ) NOT NULL DEFAULT ('string'), "category" varchar CHECK( "category" IN ('general','pricing','operations','notifications','security') ) NOT NULL DEFAULT ('general'), "description" varchar, "isGlobal" boolean NOT NULL DEFAULT (0), "isEditable" boolean NOT NULL DEFAULT (1), "defaultValue" text, "validationRules" text, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "parkId" varchar, "createdById" varchar, CONSTRAINT "UQ_c8639b7626fa94ba8265628f214" UNIQUE ("key"), CONSTRAINT "FK_f004976bff088ad59c3eeb5054e" FOREIGN KEY ("parkId") REFERENCES "parks" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_bca2aae959dca204aead9478ae8" FOREIGN KEY ("createdById") REFERENCES "users" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_settings"("id", "key", "value", "type", "category", "description", "isGlobal", "isEditable", "defaultValue", "validationRules", "createdAt", "updatedAt", "parkId", "createdById") SELECT "id", "key", "value", "type", "category", "description", "isGlobal", "isEditable", "defaultValue", "validationRules", "createdAt", "updatedAt", "parkId", "createdById" FROM "settings"`);
        await queryRunner.query(`DROP TABLE "settings"`);
        await queryRunner.query(`ALTER TABLE "temporary_settings" RENAME TO "settings"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "settings" RENAME TO "temporary_settings"`);
        await queryRunner.query(`CREATE TABLE "settings" ("id" varchar PRIMARY KEY NOT NULL, "key" varchar NOT NULL, "value" text NOT NULL, "type" varchar CHECK( "type" IN ('string','number','boolean','json') ) NOT NULL DEFAULT ('string'), "category" varchar CHECK( "category" IN ('general','pricing','operations','notifications','security') ) NOT NULL DEFAULT ('general'), "description" varchar, "isGlobal" boolean NOT NULL DEFAULT (0), "isEditable" boolean NOT NULL DEFAULT (1), "defaultValue" text, "validationRules" text, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "parkId" varchar, "createdById" varchar, CONSTRAINT "UQ_c8639b7626fa94ba8265628f214" UNIQUE ("key"))`);
        await queryRunner.query(`INSERT INTO "settings"("id", "key", "value", "type", "category", "description", "isGlobal", "isEditable", "defaultValue", "validationRules", "createdAt", "updatedAt", "parkId", "createdById") SELECT "id", "key", "value", "type", "category", "description", "isGlobal", "isEditable", "defaultValue", "validationRules", "createdAt", "updatedAt", "parkId", "createdById" FROM "temporary_settings"`);
        await queryRunner.query(`DROP TABLE "temporary_settings"`);
        await queryRunner.query(`DROP TABLE "settings"`);
    }

}
