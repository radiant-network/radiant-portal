# Radiant Portal

[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/license/apache-2-0)
[![Build Status](https://github.com/radiant-network/radiant-portal/actions/workflows/build_and_push.yml/badge.svg)](https://github.com/radiant-network/radiant-portal/actions/workflows/build_and_push.yml)
[![Build Storybook](https://github.com/radiant-network/radiant-portal/actions/workflows/storybook.yml/badge.svg)](https://github.com/radiant-network/radiant-portal/actions/workflows/storybook.yml)

Radiant Data Platform

# Links

- [Radiant Portal](https://portal.radiant.ferlab.bio/)
- [Documentation](https://radiant-network.github.io/radiant-portal/)
- [Storybook](https://radiant-network.github.io/radiant-portal/storybook)

# Backend

[Backend Documentation](./backend/README.md)

# Frontend

[Frontend Documentation](./frontend/README.md)

# Cypress

The end-to-end specs live in `cypress/`. A local run reads its URLs and its test account from `.env`.

## Runs in CI

| Run | Starts | Runs against |
|---|---|---|
| Ferlease | when the `cypress` label is added to a PR, then on each push or reopen while the PR has the label | the PR's Ferlease |
| Nightly | weekdays at 07:00 UTC, or by hand from the Actions tab | QA |

- Each run splits the specs into four shards on ECS. An aggregator waits for them and posts the results to Slack. A green GitHub job only means that the run started.
- Only `feat/`, `fix/`, `refactor/` and `perf/` branches get a Ferlease, named after the branch without that prefix, in lowercase: `feat/rad-1` and `fix/RAD-1` share one Ferlease, its runs and its artifacts.
- A Ferlease needs a branch name of at most 37 characters after the `/`: Kubernetes caps the length of its names. A longer one gets a "Release Failed" message in Slack.
- A Ferlease runs Cypress only on a branch rebased on main. Otherwise Slack posts "Launch Attempt Failed".
- To rerun a Ferlease without a push, remove the `cypress` label and add it again.

## Stopping a run

A Ferlease, like the nightly, has at most one run at a time. Its run in progress stops, and Slack posts "Cypress run stopped" with the reason, when:

- a new commit is pushed to the PR: the new run replaces it;
- the `cypress` label is removed;
- the PR is closed: the Ferlease is then torn down, and its Cypress artifacts deleted;
- a new nightly starts. To stop the nightly without starting another, run it by hand with `stop_only`.

A stopped run posts no results.

## Results

The Slack results message links the reports, the screenshots and a JUnit XML of the run. The links work as long as their files are kept:

- for a Ferlease, until the PR is closed: read them before the merge. Removing the `cypress` label keeps them;
- for the nightly, 7 days.

## Test accounts

Each run reserves one of four accounts, `cypress@email.me` to `cypress4@email.me`, and all its shards log in with it. Concurrent runs therefore never share the saved filters or the preferences of an account.

- **Reservation:** the first free account, in that order. Each reserved account has an object under `_locks/cypress-accounts/` in the artifacts bucket, which names the run that holds it. A conditional write ensures that two runs never get the same account. The object lives only as long as the run: an empty prefix means that no account is taken.
- **All taken:** the run posts a waiting message to Slack and retries every minute. After 60 minutes, it gives up and posts a failure message.
- **Release:** the aggregator frees the account when the run ends, whatever the result. Stopping a run frees it too. If a run dies without freeing it, the next run takes the account over once the reservation is 5 minutes old and the run has no task left.
- **Which account:** the Slack launch and results messages name it.
- **Local runs** reserve nothing and use the account of `.env`. To run as another account: `CYPRESS_USER_USERNAME=cypress2@email.me npx cypress run …`.

### Writing specs

- Compare with `cy.getUsername()`, never with a fixed email.
- Saved filters belong to one user. Before the first spec, a setup step gives the account the reference filters of `cypress/fixtures/reference-saved-filters.json`: it creates the missing ones and resets the ones that differ. To change a reference filter, change the fixture.

### Adding an account

1. Create it in the QA Keycloak, named "Cypress Cypress", with the shared password, not temporary.
2. Give it the grants of `cypress@email.me` on the `cypress` tenant, with the toolbox's `update-user`.
3. Add it to `ACCOUNTS` in `.github/scripts/cypress-account.sh`.
