import { defineConfig } from "cypress";
import { getDateTime } from "./cypress/pom/shared/Utils";
import * as dotenv from "dotenv";
import fs from 'fs';
import path from 'path';

dotenv.config();

const { strDate, strTime } = getDateTime();

const getName = (url = "", parallel = "") => {
  if (url.includes("sjra-")) {
    return (
      url
        .replace("https://", "")
        .split(".")[0]
        .split("-")
        .splice(2, 4)
        .join("-") +
      "/" +
      parallel
    );
  } else {
    return "QA/" + parallel;
  }
};

export default defineConfig({
  projectId: 'g1apb2',
  chromeWebSecurity: true,
  video: false,
  screenshotOnRunFailure: true,
  viewportWidth: 1920,
  viewportHeight: 1080,
  experimentalStudio: true,
  experimentalWebKitSupport: false,
  env: {
    user_username: process.env.CYPRESS_USER_USERNAME,
    user_password: process.env.CYPRESS_USER_PASSWORD,
    keycloak_host: "https://auth.qa.juno.cqdg.ferlab.bio",
    keycloak_realm: "CQDG",
    keycloak_client: "cqdg-client",
    api_client: 'radiant',
    apiBaseUrl: "https://radiant-api.qa.juno.cqdg.ferlab.bio/",
  },

  e2e: {
    setupNodeEvents(on, config) {
      const cachedDataPath = path.join(__dirname, 'cypress/.cached-data.json');
      on("task", {
        checkCachedData() {
          return fs.existsSync(cachedDataPath);
        },
        loadCachedData() {
          if (fs.existsSync(cachedDataPath)) {
            const data = JSON.parse(fs.readFileSync(cachedDataPath, 'utf8'));
            return data;
          }
          else {
            return null;
          };
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
      return require("./cypress/plugins/index.ts")(on, config);
    },
    baseUrl: "https://radiant.qa.juno.cqdg.ferlab.bio/",
    supportFile: "cypress/support/e2e.js",
    specPattern: "cypress/**/*.cy.ts",
    slowTestThreshold: 60000,
    defaultCommandTimeout: 15000,
    pageLoadTimeout: 30000,
    downloadsFolder: `cypress/downloads/${getName(process.env.CYPRESS_BASE_URL, process.env.CYPRESS_PARALLEL)}`,
    screenshotsFolder: `cypress/screenshots/${getName(process.env.CYPRESS_BASE_URL, process.env.CYPRESS_PARALLEL)}`,
    videosFolder: `cypress/videos/${getName(process.env.CYPRESS_BASE_URL, process.env.CYPRESS_PARALLEL)}`,
    experimentalPromptCommand: true,
  },
  retries: {
    runMode: 2,
    openMode: 0,
  },
  reporter: "junit",
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

