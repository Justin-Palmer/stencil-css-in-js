import jss, { StyleSheet } from "jss";
import preset from "jss-preset-default";
import { Theme, Styles, StyleObject, ExtendedCSSStyleSheet } from "./types";

let sheets: Sheets = {};
let defaultKey = {};

jss.setup({
  ...preset()
});

function getStyles({
  theme = defaultKey,
  styles,
  componentName,
  useAdoptedStyles
}: GetStyles): StyleObject {
  if (!sheets[componentName]) {
    sheets[componentName] = new WeakMap();
  }

  if (!sheets[componentName].has(theme)) {
    let componentStyles = { ...styles };

    if (theme[componentName]) {
      for (const property in theme[componentName]) {
        componentStyles[property] = {
          ...componentStyles[property],
          ...theme[componentName][property]
        };
      }
    }

    const sheet = jss.createStyleSheet(componentStyles);
    sheet.update(theme);
    sheets[componentName].set(theme, getStyleObject(sheet, useAdoptedStyles));
  }

  return sheets[componentName].get(theme);
}

function getStyleObject(
  sheet: StyleSheet,
  useAdoptedStyles: boolean
): StyleObject {
  let adoptedSheet: ExtendedCSSStyleSheet = null;

  if (useAdoptedStyles) {
    adoptedSheet = new CSSStyleSheet();
    adoptedSheet.replaceSync(sheet.toString());

    Object.defineProperty(adoptedSheet, "data-cssInJsId", {
      value: "cssInJsId"
    });
  }

  return {
    sheet,
    adoptedSheet
  };
}

export { getStyles };

export interface GetStyles {
  theme: Theme;
  styles: Styles;
  componentName: string;
  useAdoptedStyles: boolean;
}

interface Sheets {
  [key: string]: any;
}
