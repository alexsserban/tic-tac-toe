import { defineConfig } from "cypress";

export default defineConfig({
  env: {
    frontend: "http://localhost:3000",
    backend: "http://localhost:4000",
  },

  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
