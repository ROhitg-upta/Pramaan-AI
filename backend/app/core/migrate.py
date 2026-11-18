import os
import sys
import logging
from sqlalchemy import text
from app.core.database import engine

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("migration_runner")

def run_migrations():
    logger.info("Starting schema migration...")
    migration_file = os.path.join(
        os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))),
        "database",
        "migrations",
        "001_initial_schema.sql"
    )

    if not os.path.exists(migration_file):
        logger.error(f"Migration file not found at {migration_file}")
        sys.exit(1)

    with open(migration_file, "r", encoding="utf-8") as f:
        sql = f.read()

    with engine.begin() as conn:
        # Split statements on semicolons and execute
        statements = [stmt.strip() for stmt in sql.split(";") if stmt.strip()]
        for stmt in statements:
            conn.execute(text(stmt))
        logger.info(f"Successfully applied 001_initial_schema.sql ({len(statements)} statements)")

if __name__ == "__main__":
    run_migrations()
