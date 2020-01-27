import { Config } from "@stencil/core";

export const config: Config = {
  namespace: "stencil-css-in-js",
  srcIndexHtml: "src/index.html",
  outputTargets: [
    {
      type: "dist",
      esmLoaderPath: "../loader"
    },
    {
      type: "docs-readme"
    },
    {
      type: "www",
      serviceWorker: null // disable service workers
    }
  ]
};
