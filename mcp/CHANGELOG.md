# Changelog

## [1.1.1](https://github.com/radiant-network/radiant-mcp/compare/v1.1.0...v1.1.1) (2026-11-10)


### Bug Fixes

* **starrocks:** run logins one at a time so a connection never reads another call's token file ([#75](https://github.com/radiant-network/radiant-mcp/issues/75)) ([9b497ee](https://github.com/radiant-network/radiant-mcp/commit/9b497ee3f3d1274748c3e073701a494184ea7a7a))

## [1.1.0](https://github.com/radiant-network/radiant-mcp/compare/v1.0.3...v1.1.0) (2026-11-09)


### Features

* **survival:** read patient lists in one SQL statement instead of paging the portal ([#71](https://github.com/radiant-network/radiant-mcp/issues/71)) ([83687a6](https://github.com/radiant-network/radiant-mcp/commit/83687a67e3f9114b7ec040fba3c63d42fe43d016))


### Bug Fixes

* **cohort,tools:** count the consequence summary on the most severe impact, run the summaries in parallel, share the list cut and the case type, and build the nearby list from the rules ([#65](https://github.com/radiant-network/radiant-mcp/issues/65)) ([ee4b116](https://github.com/radiant-network/radiant-mcp/commit/ee4b116afd1a1f20ed9be432f3aa2861da45c2d0))
* expired token and auth failures, second_hit gene join, error codes, CNV types and misleading tests ([#68](https://github.com/radiant-network/radiant-mcp/issues/68)) ([dd250d4](https://github.com/radiant-network/radiant-mcp/commit/dd250d4d101d56cec901bfe35893c39069e22a95))
* **occurrences:** read one filter object without its list as one filter, not as the field shorthand ([#67](https://github.com/radiant-network/radiant-mcp/issues/67)) ([52b49d7](https://github.com/radiant-network/radiant-mcp/commit/52b49d7dbd125622c2422ee270017e28b9414b75))
* P/LP counted only for its gene, no per-carrier SNV list, complete cases in a cut oncoprint, test hygiene ([#69](https://github.com/radiant-network/radiant-mcp/issues/69)) ([f75ddc0](https://github.com/radiant-network/radiant-mcp/commit/f75ddc0398803ccfaecea7ffd480c223e5ff9299))
* **patients,auth,cohort:** skip identifier matches without a patient key, narrow the expiry margin to 5 s, tell TLS from client errors, link somatic CNV carriers to cnv-to, and cover the first-hit branch ([#73](https://github.com/radiant-network/radiant-mcp/issues/73)) ([087a714](https://github.com/radiant-network/radiant-mcp/commit/087a7147d3aa19ab6cfcbb9619d37087fc196870))
* portal redirects, capped autocomplete, keyless patients, cut summaries, docs and tests ([#74](https://github.com/radiant-network/radiant-mcp/issues/74)) ([68e33ed](https://github.com/radiant-network/radiant-mcp/commit/68e33edd6af92411156d2a7c12ab85944588bcd0))
* read_query after USE/SET, oncoprint gene membership, second_hit impact on the gene, family case data types ([#63](https://github.com/radiant-network/radiant-mcp/issues/63)) ([4c0bc3e](https://github.com/radiant-network/radiant-mcp/commit/4c0bc3e08edbc0d6f460d22e2b098d4800e086a2))
* somatic carrier rule, identifier search counts, oncoprint filters and review low findings ([#66](https://github.com/radiant-network/radiant-mcp/issues/66)) ([0b58320](https://github.com/radiant-network/radiant-mcp/commit/0b58320016b3af76b092c0c4d01620425a411985))
* **survival,hits:** AND the cohort and group filters, keep first-hit loci out of other genes' second hits, and harden auth, TLS and missing-view errors ([#72](https://github.com/radiant-network/radiant-mcp/issues/72)) ([2843e73](https://github.com/radiant-network/radiant-mcp/commit/2843e73d3139818f7fab06943c6d34edb229e48d))


### Performance Improvements

* **cases,genes:** run the case task lookups side by side and resolve every gene of a tool in one portal search ([#70](https://github.com/radiant-network/radiant-mcp/issues/70)) ([2e0b184](https://github.com/radiant-network/radiant-mcp/commit/2e0b184d640b8947231d7f0cdf7bc6403a1b262b))

## [1.0.3](https://github.com/radiant-network/radiant-mcp/compare/v1.0.2...v1.0.3) (2026-11-08)


### Bug Fixes

* tumor-normal somatic SNVs only, germline carrier quality rule, unloaded re-analyses, and review fixes ([#61](https://github.com/radiant-network/radiant-mcp/issues/61)) ([396005b](https://github.com/radiant-network/radiant-mcp/commit/396005b1a14f648e760c827e3976c59a2855cc76))

## [1.0.2](https://github.com/radiant-network/radiant-mcp/compare/v1.0.1...v1.0.2) (2026-11-08)


### Bug Fixes

* **stats,queries:** correct the log-rank degrees of freedom, stop counting a variant in the genes it is only near, and describe is_deleterious as a score flag ([#59](https://github.com/radiant-network/radiant-mcp/issues/59)) ([6c4a211](https://github.com/radiant-network/radiant-mcp/commit/6c4a21197760e83f6b82818e01008ac5ebe3a77f))

## [1.0.1](https://github.com/radiant-network/radiant-mcp/compare/v1.0.0...v1.0.1) (2026-11-08)


### Bug Fixes

* **queries:** ignore re-analysis tasks not imported yet, accept numeric locus_id, correct the consequence filter description and the somatic filter docs, and allow the sorts the portal accepts ([#56](https://github.com/radiant-network/radiant-mcp/issues/56)) ([e778375](https://github.com/radiant-network/radiant-mcp/commit/e7783752985353bb347caac59203a798830f7926))
* **results:** return the arguments FastMCP rejects before a tool runs as the invalid_input envelope, with one entry per argument and the allowed values ([#58](https://github.com/radiant-network/radiant-mcp/issues/58)) ([a7fc276](https://github.com/radiant-network/radiant-mcp/commit/a7fc276e73033d2ee961bd4eb355ba254c78d6e2))

## [1.0.0](https://github.com/radiant-network/radiant-mcp/compare/v0.4.1...v1.0.0) (2026-11-08)


### ⚠ BREAKING CHANGES

* **tools:** return one result envelope from every tool with typed error codes and a shared output schema ([#44](https://github.com/radiant-network/radiant-mcp/issues/44))

### Features

* **sql:** replace mcp-server-starrocks with our own read_query and table_overview ([#30](https://github.com/radiant-network/radiant-mcp/issues/30)) ([7b83e2e](https://github.com/radiant-network/radiant-mcp/commit/7b83e2e53faa2c8f5d3d47e419c886d73548135e))
* **starrocks:** RAD-263 verify the StarRocks TLS certificate against STARROCKS_SSL_CA or the system CA bundle when STARROCKS_SSL_VERIFY is set ([#46](https://github.com/radiant-network/radiant-mcp/issues/46)) ([9b0dcc2](https://github.com/radiant-network/radiant-mcp/commit/9b0dcc24035d8fb43e691b82f34594aa929bf0d2))
* **survival_curve:** compare any patient groups and document the clinical views ([#27](https://github.com/radiant-network/radiant-mcp/issues/27)) ([d805e03](https://github.com/radiant-network/radiant-mcp/commit/d805e03708d463a9ffc0551aa628bd8480f4c837))
* **tools:** one data_type vocabulary, typed tool arguments and layered modules ([#32](https://github.com/radiant-network/radiant-mcp/issues/32)) ([05e1f09](https://github.com/radiant-network/radiant-mcp/commit/05e1f092fd16247db0e9d8231a1183a858528b62))
* **tools:** return one result envelope from every tool with typed error codes and a shared output schema ([#44](https://github.com/radiant-network/radiant-mcp/issues/44)) ([5c9937e](https://github.com/radiant-network/radiant-mcp/commit/5c9937eb8049fee32204a8270f08bf9df4be2060))


### Bug Fixes

* **cohort:** count carrier cases by their proband, like oncoprint, and add cases_any_member and a family-role summary ([#53](https://github.com/radiant-network/radiant-mcp/issues/53)) ([d7248ca](https://github.com/radiant-network/radiant-mcp/commit/d7248caf8e0f8e6a36b530a97512a68153b83096))
* **cohort:** match any transcript of the gene, count reruns once and leave fetal phenotypes out ([#38](https://github.com/radiant-network/radiant-mcp/issues/38)) ([2287535](https://github.com/radiant-network/radiant-mcp/commit/2287535b6a48b0ae94e952d4bcffd65b9f597eab))
* **deps:** move to fastmcp 4.1 and the MCP Python SDK v2 ([#33](https://github.com/radiant-network/radiant-mcp/issues/33)) ([094db2d](https://github.com/radiant-network/radiant-mcp/commit/094db2de901bbe89e037cd16300693c94f7ea693))
* **errors:** report an unknown database at connect and an unknown table in table_overview as invalid_input, and document the client timeout ([#54](https://github.com/radiant-network/radiant-mcp/issues/54)) ([bbcd276](https://github.com/radiant-network/radiant-mcp/commit/bbcd276840980298d4e197ac18d5574cb48696e0))
* **genes:** stop promising alias resolution and tell the agent to retry with the official HGNC symbol ([#55](https://github.com/radiant-network/radiant-mcp/issues/55)) ([2aa0580](https://github.com/radiant-network/radiant-mcp/commit/2aa05808ba918c97251ca042761d2d5a4826f25a))
* **oncoprint:** count the proband only in germline cases, every altered case per gene and flag a cut ([#34](https://github.com/radiant-network/radiant-mcp/issues/34)) ([62bcc67](https://github.com/radiant-network/radiant-mcp/commit/62bcc67c08ec8d5f53971dfcb50136c9a20eca70))
* **queries:** read only the latest task of each sequencing per case in the carrier and oncoprint queries, keeping tumor-normal and tumor-only analyses apart ([#50](https://github.com/radiant-network/radiant-mcp/issues/50)) ([141307b](https://github.com/radiant-network/radiant-mcp/commit/141307bfc93897814be872bec75871e7a6749fc7))
* **results:** error codes that tell the agent what to do, and revert the ineffective MULTI_STATEMENTS flag ([#51](https://github.com/radiant-network/radiant-mcp/issues/51)) ([f2a258b](https://github.com/radiant-network/radiant-mcp/commit/f2a258bbb527890886b7e5c519ef66e12fb083ce))
* **runtime:** cap concurrent tool calls with a busy answer, stop portal retries, add a connect timeout and map transport errors to upstream ([#49](https://github.com/radiant-network/radiant-mcp/issues/49)) ([3869274](https://github.com/radiant-network/radiant-mcp/commit/3869274ef0dd32fa1043e42d0d07868cdea31ed6))
* **runtime:** cap read_query in StarRocks with sql_select_limit, keep connection and portal 5xx details out of results, and log one line per tool call without patient data ([#52](https://github.com/radiant-network/radiant-mcp/issues/52)) ([ec06444](https://github.com/radiant-network/radiant-mcp/commit/ec064448bff38ec1e327fa665fbf7b16e07de20a))
* **search:** check filter and sort fields against the portal, search cases by sample id and keep user filters ([#36](https://github.com/radiant-network/radiant-mcp/issues/36)) ([bee2c0a](https://github.com/radiant-network/radiant-mcp/commit/bee2c0ac40af804ff3b43f705b8d2ed4d3d8a1d0))
* **second_hit:** flag cut lists, read comphet pairs once per gene and only the latest task of a rerun ([#35](https://github.com/radiant-network/radiant-mcp/issues/35)) ([c74caab](https://github.com/radiant-network/radiant-mcp/commit/c74caab58a49e7cbfca203118911cd97134d7db8))
* **starrocks:** open connections without MULTI_STATEMENTS so a call runs one statement and returns its result ([#48](https://github.com/radiant-network/radiant-mcp/issues/48)) ([45361f4](https://github.com/radiant-network/radiant-mcp/commit/45361f45734f76403e447a6ca01185b96ae2661d))
* **survival_curve:** order-free log-rank, explained skips and exclusions, genotyped non-carriers and fewer portal calls ([#40](https://github.com/radiant-network/radiant-mcp/issues/40)) ([bf7f3eb](https://github.com/radiant-network/radiant-mcp/commit/bf7f3eb8a018a15a3d074f5211148d9b55e37817))
* **tools:** explain duo Venn regions, reject duplicate bars, stack lollipop residues and hide internal errors ([#39](https://github.com/radiant-network/radiant-mcp/issues/39)) ([ebd31bd](https://github.com/radiant-network/radiant-mcp/commit/ebd31bde639b79161f4d233bd4ace36f9059a109))
* **tools:** publish the whole docstring of every tool by moving the result text above Args and documenting each argument on its own line ([#47](https://github.com/radiant-network/radiant-mcp/issues/47)) ([18ed68f](https://github.com/radiant-network/radiant-mcp/commit/18ed68fb3dd509095bedc12bd5e04eb540038885))
* **upstream:** stop sharing table_overview results across users and hide upstream resources ([#29](https://github.com/radiant-network/radiant-mcp/issues/29)) ([7d806d7](https://github.com/radiant-network/radiant-mcp/commit/7d806d7869a788b169f2ea9b42c2166a6fe5ce90))

## [0.4.1](https://github.com/radiant-network/radiant-mcp/compare/v0.4.0...v0.4.1) (2026-11-06)


### Bug Fixes

* **second_hit:** pair hemizygous snvs inside a deletion and report family deletions ([#25](https://github.com/radiant-network/radiant-mcp/issues/25)) ([7106dc1](https://github.com/radiant-network/radiant-mcp/commit/7106dc1b7a02c957506af8d0faf4599bcc157221))

## [0.4.0](https://github.com/radiant-network/radiant-mcp/compare/v0.3.0...v0.4.0) (2026-11-06)


### Features

* RAD-254 add family venn survival oncoprint lollipop timeline and bar chart tools ([#23](https://github.com/radiant-network/radiant-mcp/issues/23)) ([3f40704](https://github.com/radiant-network/radiant-mcp/commit/3f40704c08dc28043bc51646f2aeff3823851e8d))

## [0.3.0](https://github.com/radiant-network/radiant-mcp/compare/v0.2.1...v0.3.0) (2026-11-06)


### Features

* RAD-251 add case, patient and cohort tools for the D.A.V.I.D agents ([#17](https://github.com/radiant-network/radiant-mcp/issues/17)) ([b468da6](https://github.com/radiant-network/radiant-mcp/commit/b468da61f203e114dfb4875dd9a2a2fd445f7e0c))
* RAD-252 add second-hit, cohort carriers, gene info and ontology lookup tools ([#21](https://github.com/radiant-network/radiant-mcp/issues/21)) ([c74cfe6](https://github.com/radiant-network/radiant-mcp/commit/c74cfe60ea9ca6d41499e4fdd47968e2581cd3aa))


### Bug Fixes

* RAD-251 allow last-resort SQL in the patient and cohort agents ([#19](https://github.com/radiant-network/radiant-mcp/issues/19)) ([294b151](https://github.com/radiant-network/radiant-mcp/commit/294b151bc224d87c60a9ac84bd712fde63663700))
* RAD-251 explain array columns and unnest in describe_schema ([#20](https://github.com/radiant-network/radiant-mcp/issues/20)) ([234a1ec](https://github.com/radiant-network/radiant-mcp/commit/234a1ec49f6aaca1476535a1be2532a0ceebf890))
* RAD-252 use the BioMCP 0.9.3 tool names and add pathway analysis to the agents ([#22](https://github.com/radiant-network/radiant-mcp/issues/22)) ([2758a3f](https://github.com/radiant-network/radiant-mcp/commit/2758a3f09b117cd04133d7fd0a65867e378182e0))

## [0.2.1](https://github.com/radiant-network/radiant-mcp/compare/v0.2.0...v0.2.1) (2026-10-30)


### Bug Fixes

* bump vulnerable dependencies and run the image as a non-root user ([#13](https://github.com/radiant-network/radiant-mcp/issues/13)) ([7fe61b6](https://github.com/radiant-network/radiant-mcp/commit/7fe61b6898f08ba5baa5cc7d331468d91efecd4d))

## [0.2.0](https://github.com/radiant-network/radiant-mcp/compare/v0.1.0...v0.2.0) (2026-10-30)


### Features

* add health endpoints and custom server wrapper ([d2fe591](https://github.com/radiant-network/radiant-mcp/commit/d2fe591cb02acdff783993b26b9773573e7d4258))
* add librechat example ([8d55cd0](https://github.com/radiant-network/radiant-mcp/commit/8d55cd0628fdd8390d2bca61b515b001d561f010))
* add StarRocks MCP Server Docker image ([874f506](https://github.com/radiant-network/radiant-mcp/commit/874f506046fd883df0caaee190de1bd31c4fc5d7))
* add valid scopes ([52f1aad](https://github.com/radiant-network/radiant-mcp/commit/52f1aadfbfef06bc8a4773f736b9a02d2ceb1b5e))
* case context tool ([dd770c0](https://github.com/radiant-network/radiant-mcp/commit/dd770c0f5f3c3a217367e495fdd00643c419834c))
* improve agence ([cd305e2](https://github.com/radiant-network/radiant-mcp/commit/cd305e2be5fd4db0bb6a39d57d712943f5c44300))
* oauth for mcp ([6a0141d](https://github.com/radiant-network/radiant-mcp/commit/6a0141db985511bca404005e0bc94883e84e8ebb))
* remove starrocks default connection ([2a8ce53](https://github.com/radiant-network/radiant-mcp/commit/2a8ce53b0def351ae1f987ad5f0205f05366728d))
* serch case by mrn ([d65076c](https://github.com/radiant-network/radiant-mcp/commit/d65076c2eef9620f40923a04699471061c65ad34))
* support both mcp and mcp/ ([b58a865](https://github.com/radiant-network/radiant-mcp/commit/b58a865046d10894a33a69cfafc0c22cf66aadd8))
* use keycloak providre instead of custom MultiAuth ([65b6a5f](https://github.com/radiant-network/radiant-mcp/commit/65b6a5f2f68364fb03e2e20c3a493c717d3df25d))
* use part in sql queries ([6fecfde](https://github.com/radiant-network/radiant-mcp/commit/6fecfde92e0e53cf5cd8343afbb1a47cab2ece57))


### Bug Fixes

* bind server to 0.0.0.0 for container accessibility ([62aa384](https://github.com/radiant-network/radiant-mcp/commit/62aa384eacdc32ef7241b662fae5fa5ba9e3c5b7))
* proxy headers ([dccf798](https://github.com/radiant-network/radiant-mcp/commit/dccf79801ee334908e4aaf6d6db2be3ae088fcc5))
* routes for dcr ([5b9f43f](https://github.com/radiant-network/radiant-mcp/commit/5b9f43f17aabe1bb5c782fce3e7453aafb448298))
* supported scopes ([c8ae7ff](https://github.com/radiant-network/radiant-mcp/commit/c8ae7ffaf34ee255087d226ec813e690fc87a738))
* use sub as db username ([a0ab9f3](https://github.com/radiant-network/radiant-mcp/commit/a0ab9f3c17572aac90b9992baa6230da47d36eb1))
* used fix third party lib version ([d7c5878](https://github.com/radiant-network/radiant-mcp/commit/d7c587802e03fa884045effcfdc94e4d4102e22c))


### Documentation

* update readme ([f01226d](https://github.com/radiant-network/radiant-mcp/commit/f01226d2ebe55f02ca817d473cd5e4630df3a359))
