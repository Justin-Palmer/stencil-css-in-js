import { Component, h } from "@stencil/core";
import { CssInJs } from "../../../../dist/index";
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
  componentWillLoad() {}

  @CssInJs({
    styles
  })
  renderer = (classes: any) => {
    return (
      <div class={classes.root} data-cy="root">
        <div class={classes.content}>
          <slot></slot>
        </div>
      </div>
    );
  };
}

Tunnel.injectProps(CssInJsTest, ["theme"]);
