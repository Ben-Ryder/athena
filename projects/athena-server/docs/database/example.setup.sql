-- Cleaning up existing database if present
drop database if exists athena;

-- Cleaning up existing user if present
drop user if exists athena;

-- Create athena user and database
create user athena with password 'password' login;
create database athena;
grant connect on database athena to athena;

-- Switch to new database
\c athena

-- Create UUID extension for uuid_generate_v4 support
create extension if not exists "uuid-ossp";

-- Functions for automatically managing created_at and updated_at timestamps
CREATE OR REPLACE FUNCTION update_table_timestamps()
    RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Enums used in the database
create type order_by_fields as enum ('created_at', 'updated_at');
create type order_directions as enum ('ASC', 'DESC');


/**
    Users Table
    -----------
    Used to store user accounts that are required to access the application.
 */
create table if not exists users (
    id uuid not null default uuid_generate_v4(),
    username varchar(20) not null,
    email varchar(100) not null,
    password_hash varchar(100) not null,
    is_verified boolean not null default false,
    created_at timestamp not null default now(),
    updated_at timestamp not null,
    PRIMARY KEY (id)
);
create trigger update_user_timestamps before update on users for each row execute procedure update_table_timestamps();

/**
  Vaults Table
  -----------
  Used to store user vaults which then contain notes, tags, queries etc
 */
create table if not exists vaults (
    id uuid not null default uuid_generate_v4(),
    name varchar(50) not null,
    description varchar(255) not null,
    created_at timestamp not null default now(),
    updated_at timestamp not null,
    owner uuid not null,
    PRIMARY KEY (id),
    constraint vault_owner foreign key (owner) references users(id) on delete cascade
);
create trigger update_vault_timestamps before update on vaults for each row execute procedure update_table_timestamps();

/**
  Notes Table
  -----------
  Used to store notes.
 */
create table if not exists notes (
    id uuid not null default uuid_generate_v4(),
    title varchar(50) not null,
    description varchar(255),
    body text not null,
    created_at timestamp not null default now(),
    updated_at timestamp not null,
    vault uuid not null,
    PRIMARY KEY (id),
    constraint tag_vault foreign key (vault) references vaults(id) on delete cascade
);
create trigger update_note_timestamps before update on notes for each row execute procedure update_table_timestamps();

/**
  Tags Table
  -----------
  Used to store tags which can be used to categorise notes.
 */
create table if not exists tags (
    id uuid not null default uuid_generate_v4(),
    name varchar(50) not null,
    background_colour char(7),
    text_colour char(7),
    created_at timestamp not null default now(),
    updated_at timestamp not null,
    vault uuid not null,
    PRIMARY KEY (id),
    constraint tag_vault foreign key (vault) references vaults(id) on delete cascade
);
create trigger update_tag_timestamps before update on tags for each row execute procedure update_table_timestamps();

/**
  Note Tags Table
  -----------
  Used to store tags that have been applied to notes
 */
create table if not exists note_tags (
    id uuid not null default uuid_generate_v4(),
    note uuid not null,
    tag uuid not null,
    PRIMARY KEY (id),
    constraint note_tag_note foreign key (note) references notes(id) on delete cascade,
    constraint note_tag_tag foreign key (tag) references tags(id) on delete cascade
);

/**
  Queries Table
  -----------
  Used to store tags which can be used to categorise notes.
 */
create table if not exists queries (
    id uuid not null default uuid_generate_v4(),
    name varchar(50) not null,
    order_by order_by_fields not null,
    order_direction order_directions not null ,
    created_at timestamp not null default now(),
    updated_at timestamp not null,
    vault uuid not null,
    PRIMARY KEY (id),
    constraint tag_vault foreign key (vault) references vaults(id) on delete cascade
);
create trigger update_queries_timestamps before update on queries for each row execute procedure update_table_timestamps();

/**
  Query Tags Table
  -----------
  Used to store query tags which are used when filtering.
 */
create table if not exists query_tags (
     id uuid not null default uuid_generate_v4(),
     query uuid not null,
     tag uuid not null,
     or_group int not null,
     PRIMARY KEY (id),
     constraint query_tag_query foreign key (query) references queries(id) on delete cascade,
     constraint query_tag_tag foreign key (tag) references tags(id) on delete cascade
);

-- Grant privileges to athena user after everything is created
grant all privileges on all tables in schema public to athena;
grant all privileges on all sequences in schema public to athena;