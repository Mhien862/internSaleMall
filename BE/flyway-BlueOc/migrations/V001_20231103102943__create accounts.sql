-- public.accounts definition

-- Drop table

-- DROP TABLE public.accounts;

CREATE TABLE accounts (
	id serial4 NOT NULL,
	"password" varchar(255) NOT NULL,
	hash_key varchar(255) NULL,
	"token" varchar(255) NULL,
	user_id int4 NOT NULL,
	CONSTRAINT accounts_pkey PRIMARY KEY (id)
);


-- public.accounts foreign keys

ALTER TABLE accounts ADD CONSTRAINT accounts_users_fkey FOREIGN KEY (user_id) REFERENCES users(id) ON UPDATE CASCADE;