-- CREATE DATABASE IF NOT EXISTS tasker_db
SELECT 'CREATE DATABASE tasker_db'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'tasker_db')\gexec