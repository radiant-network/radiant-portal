import { defineConfig } from "cypress";
import { getDateTime, isFerlease } from "./cypress/pom/shared/Utils";
import * as dotenv from "dotenv";
import fs from "fs";
import path from "path";

dotenv.config();

const { strDate, strTime } = getDateTime();

const getName = (url = '', parallel = '') => {
  if (isFerlease()) {
    return (
      url.replace('https://', '').split('.')[0].split('-').splice(1).join('-') + '/' + parallel
    );
  } else {
    return 'QA/' + parallel;
  }
};

const BUILD_POLL_INTERVAL_MS = 20000;
const BUILD_WAIT_TIMEOUT_MS = 30 * 60 * 1000;

// A Ferlease run starts while its image is still being built and rolled out.
const waitForDeployedBuild = async (baseUrl: string, sha: string) => {
  const url = new URL("version.txt", baseUrl).toString();
  const deadline = Date.now() + BUILD_WAIT_TIMEOUT_MS;
  while (Date.now() < deadline) {
    // Without the file, the portal redirects to its login page.
    const deployed = await fetch(url, { cache: "no-store", redirect: "manual" })
      .then(response => (response.ok ? response.text() : ""))
      .catch(() => "");
    if (deployed.trim() === sha) return;
    console.log(`Waiting for build ${sha.slice(0, 7)} on ${baseUrl}`);
    await new Promise(resolve => setTimeout(resolve, BUILD_POLL_INTERVAL_MS));
  }
  throw new Error(`Build ${sha} not served by ${baseUrl} after ${BUILD_WAIT_TIMEOUT_MS / 60000} min`);
};

export default defineConfig({
  projectId: "g1apb2",
  chromeWebSecurity: true,
  video: false,
  screenshotOnRunFailure: true,
  viewportWidth: 1920,
  viewportHeight: 1080,
  experimentalWebKitSupport: false,
  allowCypressEnv: false,
  expose: {
    keycloak_host: "https://auth.dev.qlin.aws.sante.quebec",
    keycloak_realm: "qlin",
    keycloak_client: "radiant-local",
    // Only has to be whitelisted on the client: cy.login never follows it, the target
    // portal then logs in through its own client from the Keycloak SSO session.
    keycloak_redirect_uri: "http://localhost:3000/auth/callback",
    api_client: "radiant-local",
    api_tenant: "cypress",
    api_base_url: "https://api.dev.qlin.aws.sante.quebec/",
  },
  env: {
    user_username: process.env.CYPRESS_USER_USERNAME,
    user_password: process.env.CYPRESS_USER_PASSWORD,
  },

  e2e: {
    setupNodeEvents(on, config) {
      const cachedDataPath = path.join(__dirname, "cypress/.cached-data.json");
      on("task", {
        checkCachedData() {
          return fs.existsSync(cachedDataPath);
        },
        loadCachedData() {
          if (fs.existsSync(cachedDataPath)) {
            const data = JSON.parse(fs.readFileSync(cachedDataPath, "utf8"));
            return data;
          } else {
            return null;
          }
        },
        log(message: string) {
          console.log(message);
          return null;
        },
        saveCachedData(data) {
          fs.writeFileSync(cachedDataPath, JSON.stringify(data, null, 2));
          return null;
        },
      });
      on("before:run", async () => {
        const buildSha = process.env.FERLEASE_BUILD_SHA;
        if (buildSha) await waitForDeployedBuild(config.baseUrl ?? "", buildSha);
      });
      return require("./cypress/plugins/index.ts")(on, config);
    },
    baseUrl: "https://portail.dev.qlin.aws.sante.quebec/",
    supportFile: "cypress/support/e2e.js",
    specPattern: "cypress/**/*.cy.ts",
    slowTestThreshold: 60000,
    defaultCommandTimeout: 15000,
    pageLoadTimeout: 30000,
    downloadsFolder: `cypress/downloads/${getName(process.env.CYPRESS_BASE_URL, process.env.CYPRESS_PARALLEL)}`,
    screenshotsFolder: `cypress/screenshots/${getName(process.env.CYPRESS_BASE_URL, process.env.CYPRESS_PARALLEL)}`,
    videosFolder: `cypress/videos/${getName(process.env.CYPRESS_BASE_URL, process.env.CYPRESS_PARALLEL)}`,
  },
  retries: {
    runMode: 2,
    openMode: 0,
  },
  reporter: "mocha-junit-reporter",
  reporterOptions: {
    mochaFile:
      "cypress/results/" +
      `${getName(process.env.CYPRESS_BASE_URL, process.env.CYPRESS_PARALLEL)}/` +
      strDate +
      "_" +
      strTime +
      "-[hash].xml",
    rootSuiteTitle: "Tests Cypress",
  },
});
