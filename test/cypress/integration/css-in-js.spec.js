const defaultTemplate = [
  {
    component: "theme-provider",
    props: { theme: { background: "rgb(0, 0, 0)" } },
    children: [
      {
        component: "css-in-js-test",
        innerHTML: "Text Content"
      }
    ]
  }
];

context("CSS In JS", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("Should render default template", () => {
    cy.mount(defaultTemplate);

    cy.shadowGet("css-in-js-test")
      .shadowFind("[data-cy=root]")
      .then(elements => {
        cy.wrap(
          getComputedStyle(elements[0]).getPropertyValue("background-color")
        );
      })
      .should("equal", "rgb(0, 0, 0)");

    cy.matchImageSnapshot("Should render default template - 1");
  });

  it("Should dynamically update theme", () => {
    cy.mount(defaultTemplate);

    cy.shadowGet("css-in-js-test")
      .shadowFind("[data-cy=root]")
      .then(elements => {
        cy.wrap(
          getComputedStyle(elements[0]).getPropertyValue("background-color")
        );
      })
      .should("equal", "rgb(0, 0, 0)");

    cy.get("theme-provider").updateProps({
      theme: { background: "rgb(0, 125, 0)" }
    });

    cy.shadowGet("css-in-js-test")
      .shadowFind("[data-cy=root]")
      .wait(300)
      .then(elements => {
        cy.wrap(
          getComputedStyle(elements[0]).getPropertyValue("background-color")
        );
      })
      .should("equal", "rgb(0, 125, 0)");

    cy.matchImageSnapshot("Should dynamically update theme - 1");
  });

  it("Should render style overrides", () => {
    cy.mount(defaultTemplate);

    cy.get("theme-provider").updateProps({
      theme: {
        background: "rgb(0, 0, 0)",
        CssInJsTest: {
          root: {
            padding: "48px"
          }
        }
      }
    });

    cy.shadowGet("css-in-js-test")
      .shadowFind("[data-cy=root]")
      .wait(300)
      .then(elements => {
        cy.wrap(getComputedStyle(elements[0]).getPropertyValue("padding"));
      })
      .should("equal", "48px");

    cy.matchImageSnapshot("Should render style overrides - 1");
  });
});
