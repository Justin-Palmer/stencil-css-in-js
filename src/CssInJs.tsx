import { h, Host, getElement } from "@stencil/core";
import { VNode, ComponentInterface } from "@stencil/core/dist/declarations";
import { getStyles } from "./getStyle";
import { StyleObject, Styles, Theme, ExtendedCSSStyleSheet } from "./types";

const useAdoptedStyles = useAdoptedStyleSheets();

export function CssInJs(options: CssInJsOptions): CssInJsDecorator {
  return (target: ComponentInterface, propertyKey: string) => {
    const componentName = target.constructor.name;

    const originalWillLoad = target.componentWillLoad;
    if (!originalWillLoad) {
      console.error(
        `componentWillLoad lifecycle method in ${componentName} missing. Required for CssInJs decorator.`
      );
    }

    if (useAdoptedStyles) {
      target.componentWillLoad = function() {
        const willLoadResult = originalWillLoad?.call(this);
        const host = getElement(this);
        const root = (host.shadowRoot ?? host) as ExtendedShadowRoot;
        const stylesObject = getStyleObject(this, options.styles);

        watchTheme(this, options.styles, (newStyleObject: StyleObject) => {
          const adoptedSheet = root.adoptedStyleSheets;
          const index = adoptedSheet.findIndex(
            sheet => sheet["data-cssInJsId"]
          );

          if (index !== -1) {
            root.adoptedStyleSheets = Object.assign([], adoptedSheet, {
              [index]: newStyleObject.adoptedSheet
            });
          } else {
            root.adoptedStyleSheets = [
              ...adoptedSheet,
              newStyleObject.adoptedSheet
            ];
          }

          host.forceUpdate();
        });

        root.adoptedStyleSheets = [
          ...root.adoptedStyleSheets,
          stylesObject.adoptedSheet
        ];

        return willLoadResult;
      };

      target.render = function() {
        return this[propertyKey](
          getStyleObject(this, options.styles).sheet.classes
        );
      };
    } else {
      target.componentWillLoad = function() {
        const willLoadResult = originalWillLoad?.call(this);

        watchTheme(this, options.styles, () => {
          getElement(this).forceUpdate();
        });

        return willLoadResult;
      };

      target.render = function() {
        const stylesObject = getStyleObject(this, options.styles);
        const cssString = stylesObject.sheet.toString();
        let renderResult: VNode = this[propertyKey](stylesObject.sheet.classes);

        if (isHost(renderResult)) {
          prependStyleNode(renderResult, componentName, cssString);
        } else {
          renderResult = <Host>{renderResult}</Host>;
          prependStyleNode(renderResult, componentName, cssString);
        }

        return renderResult;
      };
    }
  };
}

function useAdoptedStyleSheets(): boolean {
  return Boolean((document as ExtendedDocument).adoptedStyleSheets);
}

function prependStyleNode(
  node: VNode,
  componentName: string,
  cssString: string
) {
  (node["$children$"] ?? []).unshift(
    <style type="text/css" css-in-js={componentName}>
      {cssString}
    </style>
  );
}

function isHost(node: VNode): boolean {
  return Object.values(node).includes(Host);
}

function getStyleObject(instance: ClassInstance, styles: Styles) {
  return getStyles({
    theme: instance.theme,
    styles: styles,
    componentName: instance.constructor.name,
    useAdoptedStyles
  });
}

function watchTheme(
  instance: ClassInstance,
  styles: Styles,
  callback?: (styleObject: StyleObject) => void
) {
  if (instance.theme) {
    let theme = instance.theme;

    Object.defineProperty(instance, "theme", {
      get: () => {
        return theme;
      },
      set: newValue => {
        theme = newValue;

        let themeObject = getStyles({
          theme: newValue,
          styles,
          componentName: instance.constructor.name,
          useAdoptedStyles
        });

        callback?.(themeObject);
      }
    });
  }
}

type CssInJsDecorator = (
  target: ComponentInterface,
  propertyKey: string
) => void;

interface ClassInstance extends ComponentInterface {
  theme: Theme;
}

interface CssInJsOptions {
  styles: Styles;
}

interface ExtendedShadowRoot extends ShadowRoot {
  adoptedStyleSheets: ExtendedCSSStyleSheet[];
}

interface ExtendedDocument extends Document {
  adoptedStyleSheets: CSSStyleSheet[];
}
