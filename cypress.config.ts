import { defineConfig } from "cypress";
import { getDateTime } from "./cypress/pom/shared/Utils";
import * as dotenv from "dotenv";

// Load environment variables from .env file
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
  //  projectId: '',
  //  projectId: '',
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
    keycloak_client: "cqdg-client", // Changed from 'radiant' to working client
  },

  e2e: {
    setupNodeEvents(on, config) {
      on("task", {
        log(message: string) {
          // Affiche le message dans la console Node
          console.log(message);
          return null;
        },
      });
      return require("./cypress/plugins/index.ts")(on, config);
    },
    baseUrl: "https://radiant.qa.juno.cqdg.ferlab.bio/", // QA server
    supportFile: "cypress/support/e2e.js",
    specPattern: "cypress/e2e/**/*.cy.ts",
    slowTestThreshold: 60000,
    // Increased timeouts for SPA hydration
    defaultCommandTimeout: 15000,
    pageLoadTimeout: 30000,
    downloadsFolder: `cypress/downloads/${getName(process.env.CYPRESS_BASE_URL, process.env.CYPRESS_PARALLEL)}`,
    screenshotsFolder: `cypress/screenshots/${getName(process.env.CYPRESS_BASE_URL, process.env.CYPRESS_PARALLEL)}`,
    videosFolder: `cypress/videos/${getName(process.env.CYPRESS_BASE_URL, process.env.CYPRESS_PARALLEL)}`,
  },
  retries: {
    runMode: 2,
    openMode: 0,
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

