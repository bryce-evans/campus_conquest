--
-- PostgreSQL database dump
--

SET statement_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;

--
-- Name: games; Type: SCHEMA; Schema: -; Owner: ccadmin
--

CREATE SCHEMA games;


ALTER SCHEMA games OWNER TO ccadmin;

--
-- Name: SCHEMA games; Type: COMMENT; Schema: -; Owner: ccadmin
--

COMMENT ON SCHEMA games IS 'tables listing games each player is in';


--
-- Name: global; Type: SCHEMA; Schema: -; Owner: ccadmin
--

CREATE SCHEMA global;


ALTER SCHEMA global OWNER TO ccadmin;

--
-- Name: SCHEMA global; Type: COMMENT; Schema: -; Owner: ccadmin
--

COMMENT ON SCHEMA global IS 'list of tables for global info';


--
-- Name: state; Type: SCHEMA; Schema: -; Owner: ccadmin
--

CREATE SCHEMA state;


ALTER SCHEMA state OWNER TO ccadmin;

--
-- Name: SCHEMA state; Type: COMMENT; Schema: -; Owner: ccadmin
--

COMMENT ON SCHEMA state IS 'To keep track of state in the territory grab phase';


--
-- Name: teams; Type: SCHEMA; Schema: -; Owner: ccadmin
--

CREATE SCHEMA teams;


ALTER SCHEMA teams OWNER TO ccadmin;

--
-- Name: SCHEMA teams; Type: COMMENT; Schema: -; Owner: ccadmin
--

COMMENT ON SCHEMA teams IS 'a table listing set of players for each game';


--
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


SET search_path = public, pg_catalog;

--
-- Name: cc_team; Type: TYPE; Schema: public; Owner: ccadmin
--

CREATE TYPE cc_team AS ENUM (
    'hotel',
    'as',
    'aap',
    'cals',
    'ilr',
    'eng',
    'humec',
    'none',
    'other'
);


ALTER TYPE public.cc_team OWNER TO ccadmin;

--
-- Name: game_stage; Type: TYPE; Schema: public; Owner: ccadmin
--

CREATE TYPE game_stage AS ENUM (
    'start',
    'grab',
    'orders',
    'attack',
    'end'
);


ALTER TYPE public.game_stage OWNER TO ccadmin;

SET search_path = global, pg_catalog;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: games; Type: TABLE; Schema: global; Owner: ccadmin; Tablespace: 
--

CREATE TABLE games (
    id text,
    "desc" text,
    teams smallint,
    players smallint,
    privacy smallint,
    stage public.game_stage DEFAULT 'start'::public.game_stage,
    turn smallint DEFAULT 1,
    updated timestamp with time zone DEFAULT now()
);


ALTER TABLE global.games OWNER TO ccadmin;

--
-- Name: TABLE games; Type: COMMENT; Schema: global; Owner: ccadmin
--

COMMENT ON TABLE games IS 'List of all games going on';


--
-- Name: COLUMN games.teams; Type: COMMENT; Schema: global; Owner: ccadmin
--

COMMENT ON COLUMN games.teams IS 'team count';


--
-- Name: COLUMN games.players; Type: COMMENT; Schema: global; Owner: ccadmin
--

COMMENT ON COLUMN games.players IS 'number of players';


--
-- Name: COLUMN games.privacy; Type: COMMENT; Schema: global; Owner: ccadmin
--

COMMENT ON COLUMN games.privacy IS '0 : private, 1 : viewable, 2 : public';


--
-- Name: COLUMN games.turn; Type: COMMENT; Schema: global; Owner: ccadmin
--

COMMENT ON COLUMN games.turn IS 'current turn number';


--
-- Name: COLUMN games.updated; Type: COMMENT; Schema: global; Owner: ccadmin
--

COMMENT ON COLUMN games.updated IS 'last time the game was modified';


--
-- Name: id_name_map; Type: TABLE; Schema: global; Owner: ccadmin; Tablespace: 
--

CREATE TABLE id_name_map (
    id text NOT NULL,
    name text
);


ALTER TABLE global.id_name_map OWNER TO ccadmin;

--
-- Name: TABLE id_name_map; Type: COMMENT; Schema: global; Owner: ccadmin
--

COMMENT ON TABLE id_name_map IS 'a map of piece IDs to full names';


--
-- Name: users; Type: TABLE; Schema: global; Owner: ccadmin; Tablespace: 
--

CREATE TABLE users (
    id text,
    name text,
    password text,
    games smallint,
    last_signin timestamp with time zone
);


ALTER TABLE global.users OWNER TO ccadmin;

--
-- Name: TABLE users; Type: COMMENT; Schema: global; Owner: ccadmin
--

COMMENT ON TABLE users IS 'list of all users currently signed up';


--
-- Name: COLUMN users.id; Type: COMMENT; Schema: global; Owner: ccadmin
--

COMMENT ON COLUMN users.id IS 'netid';


--
-- Name: COLUMN users.name; Type: COMMENT; Schema: global; Owner: ccadmin
--

COMMENT ON COLUMN users.name IS 'full name';


--
-- Name: COLUMN users.password; Type: COMMENT; Schema: global; Owner: ccadmin
--

COMMENT ON COLUMN users.password IS 'password hash';


--
-- Name: COLUMN users.games; Type: COMMENT; Schema: global; Owner: ccadmin
--

COMMENT ON COLUMN users.games IS 'number of current games';


--
-- Name: COLUMN users.last_signin; Type: COMMENT; Schema: global; Owner: ccadmin
--

COMMENT ON COLUMN users.last_signin IS 'last time they signed in';


SET search_path = state, pg_catalog;

--
-- Name: _init; Type: TABLE; Schema: state; Owner: ccadmin; Tablespace: 
--

CREATE TABLE _init (
    piece_name text NOT NULL,
    team smallint,
    player text,
    "timestamp" timestamp with time zone NOT NULL
);


ALTER TABLE state._init OWNER TO ccadmin;

--
-- Name: test; Type: TABLE; Schema: state; Owner: ccadmin; Tablespace: 
--

CREATE TABLE test (
    piece_name text NOT NULL,
    team smallint,
    player text,
    "timestamp" timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE state.test OWNER TO ccadmin;

--
-- Name: TABLE test; Type: COMMENT; Schema: state; Owner: ccadmin
--

COMMENT ON TABLE test IS 'Table for keeping track of the /model territory grab test';


--
-- Name: COLUMN test.piece_name; Type: COMMENT; Schema: state; Owner: ccadmin
--

COMMENT ON COLUMN test.piece_name IS 'name of piece, e.g. "duffiled';


--
-- Name: test_dev; Type: TABLE; Schema: state; Owner: ccadmin; Tablespace: 
--

CREATE TABLE test_dev (
    piece_name text,
    team smallint,
    player text,
    "timestamp" timestamp with time zone
);


ALTER TABLE state.test_dev OWNER TO ccadmin;

SET search_path = teams, pg_catalog;

--
-- Name: _init; Type: TABLE; Schema: teams; Owner: ccadmin; Tablespace: 
--

CREATE TABLE _init (
    index smallint NOT NULL,
    player_count integer NOT NULL,
    id public.cc_team
);


ALTER TABLE teams._init OWNER TO ccadmin;

--
-- Name: test; Type: TABLE; Schema: teams; Owner: ccadmin; Tablespace: 
--

CREATE TABLE test (
    index smallint NOT NULL,
    player_count integer DEFAULT 0 NOT NULL,
    id public.cc_team DEFAULT 'none'::public.cc_team
);


ALTER TABLE teams.test OWNER TO ccadmin;

--
-- Name: test_player_count_seq; Type: SEQUENCE; Schema: teams; Owner: ccadmin
--

CREATE SEQUENCE test_player_count_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE teams.test_player_count_seq OWNER TO ccadmin;

--
-- Name: test_player_count_seq; Type: SEQUENCE OWNED BY; Schema: teams; Owner: ccadmin
--

ALTER SEQUENCE test_player_count_seq OWNED BY test.player_count;


SET search_path = global, pg_catalog;

--
-- Name: id_name_map_pkey; Type: CONSTRAINT; Schema: global; Owner: ccadmin; Tablespace: 
--

ALTER TABLE ONLY id_name_map
    ADD CONSTRAINT id_name_map_pkey PRIMARY KEY (id);


SET search_path = state, pg_catalog;

--
-- Name: test_pkey; Type: CONSTRAINT; Schema: state; Owner: ccadmin; Tablespace: 
--

ALTER TABLE ONLY test
    ADD CONSTRAINT test_pkey PRIMARY KEY (piece_name);


--
-- Name: public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE ALL ON SCHEMA public FROM PUBLIC;
REVOKE ALL ON SCHEMA public FROM postgres;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO PUBLIC;


--
-- PostgreSQL database dump complete
--

