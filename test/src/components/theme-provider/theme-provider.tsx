import { Component, h, Host, Prop } from "@stencil/core";
import Tunnel from "./get-provider";

@Component({
  tag: "theme-provider",
  shadow: true
})
export class MyComponent {
  @Prop() theme = {};

  render() {
    return (
      <Host>
        <Tunnel.Provider state={{ theme: this.theme }}>
          <slot></slot>
        </Tunnel.Provider>
      </Host>
    );
  }
}
