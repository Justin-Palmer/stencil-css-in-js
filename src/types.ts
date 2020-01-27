import { StyleSheet } from "jss";

export interface Theme {
  [key: string]: any;
}

export interface Styles {
  [key: string]: any;
}

export interface StyleObject {
  sheet: StyleSheet<string>;
  adoptedSheet: ExtendedCSSStyleSheet;
}

export interface ExtendedCSSStyleSheet extends CSSStyleSheet {
  // Needed due to typescript error with replaceSync not existing on type CSSStyleSheet at the moment.
  replaceSync?: any;
  "data-cssInJsId"?: any;
}
