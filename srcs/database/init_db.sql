
-- For use UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
-- Table: public.users
-- DROP TABLE IF EXISTS public.users;
CREATE TABLE IF NOT EXISTS public.users
(
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    email text COLLATE pg_catalog."default" NOT NULL,
    login text COLLATE pg_catalog."default" NOT NULL,
    password text COLLATE pg_catalog."default" NOT NULL,
    name text COLLATE pg_catalog."default" NOT NULL,
    "lastName" text COLLATE pg_catalog."default" NOT NULL,
    "isActive" boolean NOT NULL DEFAULT true,
    roles text[] COLLATE pg_catalog."default" NOT NULL DEFAULT '{user}'::text[],
    first_time boolean NOT NULL DEFAULT false,
    "twoFASecret" character varying COLLATE pg_catalog."default",
    images text COLLATE pg_catalog."default" NOT NULL DEFAULT 'uploads/default.png'::text,
    CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY (id),
    CONSTRAINT "UQ_2d443082eccd5198f95f2a36e2c" UNIQUE (login),
    CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE (email)
);
INSERT INTO public.users(email, login, password, name, "lastName",roles, "twoFASecret")
	VALUES ('dperez-z@student.42madrid.com','dperez-z','$2b$10$EU3fl11y1jJ47Nr6D.KIxOYaMznodfw2CuVqBBgmzSMoq9BfOoJtu', 'Daniel', 'Pérez','{user,super-user,admin}',NULL);
INSERT INTO public.users(email, login, password, name, "lastName",roles, "twoFASecret")
	VALUES ('fballest@student.42madrid.com','fballest','$2b$10$EU3fl11y1jJ47Nr6D.KIxOYaMznodfw2CuVqBBgmzSMoq9BfOoJtu', 'Fernando', 'Ballesteros','{user,super-user,admin}',NULL);
INSERT INTO public.users(email, login, password, name, "lastName",roles, "twoFASecret")
	VALUES ('juan-gon@student.42madrid.com','juan-gon','$2b$10$EU3fl11y1jJ47Nr6D.KIxOYaMznodfw2CuVqBBgmzSMoq9BfOoJtu', 'Juan Angel', 'Gonzales','{user,super-user,admin}',NULL);

--TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.users
    OWNER to transcendence;
