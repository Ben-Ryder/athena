-- Cleaning up existing database if present
DROP DATABASE IF EXISTS athena;

-- Cleaning up existing user if present
DROP USER IF EXISTS athena;

-- Create athena user and database
CREATE USER athena WITH PASSWORD 'password' LOGIN;
CREATE DATABASE athena;
GRANT CONNECT ON DATABASE athena TO athena;

-- Switch to new database
\c athena

-- Create UUID extension for uuid_generate_v4 support
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Functions for automatically managing created_at and updated_at timestamps
CREATE OR REPLACE FUNCTION update_table_timestamps()
    RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

-- Enums used in the database
CREATE TYPE order_by_fields AS ENUM ('created_at', 'updated_at');
CREATE TYPE order_directions AS ENUM ('ASC', 'DESC');


/**
    Users Table
    -----------
    Used to store user accounts that are required to access the application.
 */
CREATE TABLE IF NOT EXISTS users (
    id UUID NOT NULL DEFAULT uuid_generate_v4(),
    username VARCHAR(20) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(100) NOT NULL,
    encryption_secret VARCHAR(255) NOT NULL,
    is_verified BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (id)
);
CREATE TRIGGER update_user_timestamps BEFORE UPDATE ON users FOR EACH ROW EXECUTE PROCEDURE update_table_timestamps();

/**
  Vaults Table
  -----------
  Used to store user vaults which then contain notes, tags, queries etc
 */
CREATE TABLE IF NOT EXISTS vaults (
    id UUID NOT NULL DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    description VARCHAR(255),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    owner UUID NOT NULL,
    PRIMARY KEY (id),
    CONSTRAINT vault_owner FOREIGN KEY (owner) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT unique_user_vault_name UNIQUE(name, owner)
);
CREATE TRIGGER update_vault_timestamps BEFORE UPDATE ON vaults FOR EACH ROW EXECUTE PROCEDURE update_table_timestamps();

/**
  Notes Table
  -----------
  Used to store notes.
 */
CREATE TABLE IF NOT EXISTS notes (
    id UUID NOT NULL DEFAULT uuid_generate_v4(),
    title VARCHAR(100) NOT NULL,
    description VARCHAR(255),
    body TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    vault UUID NOT NULL,
    PRIMARY KEY (id),
    CONSTRAINT tag_vault FOREIGN KEY (vault) REFERENCES vaults(id) ON DELETE CASCADE
);
CREATE TRIGGER update_note_timestamps BEFORE UPDATE ON notes FOR EACH ROW EXECUTE PROCEDURE update_table_timestamps();

/**
  Tags Table
  -----------
  Used to store tags which can be used to categorise notes.
 */
CREATE TABLE IF NOT EXISTS tags (
    id UUID NOT NULL DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    background_colour char(7),
    text_colour char(7),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    vault UUID NOT NULL,
    PRIMARY KEY (id),
    CONSTRAINT tag_vault FOREIGN KEY (vault) REFERENCES vaults(id) ON DELETE CASCADE,
    CONSTRAINT unique_vault_tag_name UNIQUE(name, vault)
);
CREATE TRIGGER update_tag_timestamps BEFORE UPDATE ON tags FOR EACH ROW EXECUTE PROCEDURE update_table_timestamps();

/**
  Note Tags Table
  -----------
  Used to store tags that have been applied to notes
 */
CREATE TABLE IF NOT EXISTS note_tags (
    id UUID NOT NULL DEFAULT uuid_generate_v4(),
    note UUID NOT NULL,
    tag UUID NOT NULL,
    PRIMARY KEY (id),
    CONSTRAINT note_tag_note FOREIGN KEY (note) REFERENCES notes(id) ON DELETE CASCADE,
    CONSTRAINT note_tag_tag FOREIGN KEY (tag) REFERENCES tags(id) ON DELETE CASCADE
);

/**
  Queries Table
  -----------
  Used to store tags which can be used to categorise notes.
 */
CREATE TABLE IF NOT EXISTS queries (
    id UUID NOT NULL DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    order_by order_by_fields NOT NULL,
    order_direction order_directions NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    vault UUID NOT NULL,
    PRIMARY KEY (id),
    CONSTRAINT tag_vault FOREIGN KEY (vault) REFERENCES vaults(id) ON DELETE CASCADE,
    CONSTRAINT unique_vault_query_name UNIQUE(name, vault)
);
CREATE TRIGGER update_queries_timestamps BEFORE UPDATE ON queries FOR EACH ROW EXECUTE PROCEDURE update_table_timestamps();

/**
  Query Tags Table
  -----------
  Used to store query tags which are used when filtering.
 */
CREATE TABLE IF NOT EXISTS query_tags (
     id UUID NOT NULL DEFAULT uuid_generate_v4(),
     query UUID NOT NULL,
     tag UUID NOT NULL,
     or_group INT NOT NULL,
     PRIMARY KEY (id),
     CONSTRAINT query_tag_query FOREIGN KEY (query) REFERENCES queries(id) ON DELETE CASCADE,
     CONSTRAINT query_tag_tag FOREIGN KEY (tag) REFERENCES tags(id) ON DELETE CASCADE
);

-- Grant privileges to athena user after everything is created
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO athena;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO athena;
