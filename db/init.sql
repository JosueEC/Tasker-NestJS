-- CREATE DATABASE IF NOT EXISTS taskerdb
SELECT 'CREATE DATABASE taskerdb'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'taskerdb')\gexec