// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

import "cypress-shadow-dom";
import { addMatchImageSnapshotCommand } from "cypress-image-snapshot/command";
import { getFragment } from "../utils";

if (Cypress.browser.name === "electron" && Cypress.browser.isHeaded) {
  Cypress.Commands.add(
    "matchImageSnapshot",
    {
      prevSubject: ["optional", "element", "window", "document"]
    },
    (_, name) => {
      cy.log(
        "In non-headless electron we can't control the device scale factor so have made `CypressSubject#matchImageSnapshot` a noop."
      );
    }
  );
} else {
  addMatchImageSnapshotCommand();
}

Cypress.Commands.add(
  "mount",
  (template, options = { width: 600, height: 600, padding: 24 }) => {
    cy.document().then(doc => {
      let fragment = getFragment(doc, template);

      doc.body.style.width = `${options.width}px`;
      doc.body.style.height = `${options.height}px`;
      doc.body.style.padding = `${options.padding}px`;

      doc.body.appendChild(fragment);
    });

    cy.get(template[template.length - 1].component).should(
      "have.class",
      "hydrated"
    );
  }
);

Cypress.Commands.add(
  "updateProps",
  {
    prevSubject: true
  },
  (subject, props) => {
    Object.keys(props).forEach(key => {
      subject[0][key] = props[key];
    });

    return subject;
  }
);
