-- Migration number: 0002 	 2026-09-05T13:46:55.000Z
-- Test migration verifying D1 migration lifecycle

CREATE TABLE IF NOT EXISTS "SchemaAuditLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "event" TEXT NOT NULL,
    "appliedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO "SchemaAuditLog" ("id", "event") VALUES ('init-migration-test', 'Migration lifecycle verified');
