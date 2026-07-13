CREATE TABLE public.ancestry (
    code text NOT NULL,
    name_en text NOT NULL
);

ALTER TABLE ONLY public.ancestry
    ADD CONSTRAINT ancestry_pkey PRIMARY KEY (code);
