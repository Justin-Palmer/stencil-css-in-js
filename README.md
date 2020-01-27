# CSS-In-JS <!-- omit in toc -->

`stencil-css-in-js` is a decorator for using JSS with Stencil components to support stronger theming and style override functionality.

## Table of Contents <!-- omit in toc -->

- [Installation](#installation)
- [Usage](#usage)
  - [Basic](#basic)
  - [Dynamic Styles](#dynamic-styles)
  - [Component Overrides](#component-overrides)
- [componentWillLoad](#componentwillload)

## Installation

```bash
npm install --save-dev stencil-css-in-js
```

## Usage

### Basic

```ts
import { Component, h } from "@stencil/core";
import { CssInJs } from "stencil-css-in-js";

const styles = {
  root: {
    padding: "24px",
    background: "black"
  },
  content: {
    color: "white"
  }
};

@Component({
  tag: "css-in-js-test",
  shadow: true
})
export class CssInJsTest {
  // componentWillLoad is required due to StencilJs build optimizations
  componentWillLoad() {}

  @CssInJs({
    styles
  })
  renderer = (classes: any) => {
    return (
      <div class={classes.root}>
        <div class={classes.content}>
          <slot></slot>
        </div>
      </div>
    );
  };
}
```

### Dynamic Styles

Style rules will use the "theme" class property for dynamic theming. This can be set from either props or by using a state variable. Stencil's State Tunnel library is a good choice for providing a theming api for component libraries, as shown in the example below.

```ts
import { Component, h } from "@stencil/core";
import { CssInJs } from "stencil-css-in-js";
import Tunnel from "../theme-provider/get-provider";

const styles = {
  root: {
    padding: "24px",
    background: (theme: any) => theme.background
  },
  content: {
    color: "white"
  }
};

@Component({
  tag: "css-in-js-test",
  styleUrl: "css-in-js-test.css",
  shadow: true
})
export class CssInJsTest {
  // componentWillLoad is required due to StencilJs build optimizations
  componentWillLoad() {}

  @CssInJs({
    styles
  })
  renderer = (classes: any) => {
    return (
      <div class={classes.root}>
        <div class={classes.content}>
          <slot></slot>
        </div>
      </div>
    );
  };
}

Tunnel.injectProps(CssInJsTest, ["theme"]);
```

### Component Overrides

While using predefined variables for theming does work for a lot of use cases, sometimes you'll want to provide the ability to completely override classes instead of just changing theme variables. This can be especially important for component libraries where you want to provide more flexibility to styling.

```ts
import { Component, h, State } from "@stencil/core";
import { CssInJs } from "stencil-css-in-js";

const styles = {
  root: {
    padding: "24px",
    background: (theme: any) => theme.background
  },
  content: {
    color: "white"
  }
};

@Component({
  tag: "css-in-js-test",
  styleUrl: "css-in-js-test.css",
  shadow: true
})
export class CssInJsTest {
  @State() theme = {
    background: "black",
    CssInJsTest: {
      root: {
        padding: "48px"
      }
    }
  };

  // componentWillLoad is required due to StencilJs build optimizations
  componentWillLoad() {}

  @CssInJs({
    styles
  })
  renderer = (classes: any) => {
    return (
      <div class={classes.root}>
        <div class={classes.content}>
          <slot></slot>
        </div>
      </div>
    );
  };
}
```

While the example shows theme as State for readability purposes, you'll generally want theme to be passed as a prop to the component.

## componentWillLoad

Although less than ideal, currently the lifecycle method `componentWillLoad` is required (even if it is empty) in components due to Stencil build optimizations.
