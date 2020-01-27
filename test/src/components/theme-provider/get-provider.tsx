import { h } from "@stencil/core";
import { createProviderConsumer } from "@stencil/state-tunnel";

export interface State {
  theme: any;
}

export default createProviderConsumer<State>(
  {
    theme: {}
  },
  (subscribe, child) => (
    <context-consumer subscribe={subscribe} renderer={child} />
  )
);
