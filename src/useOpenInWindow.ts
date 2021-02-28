import { useCallback, useState } from "react";

import { calculateCenterPoint } from "./calculateCenterPoint";
import { windowOptionsMapper } from "./windowOptionsMapper";

export type SpecsOption = "yes" | "no" | 1 | 0;

export type WithUrl = {
  /**
   * A DOMString indicating the URL of the resource to be loaded.
   * This can be a path or URL to an HTML page, image file, or any other resource that is supported by the browser.
   * If the empty string ("") is specified as url, a blank page is opened into the targeted browsing context.
   */
  url: string;
};

export interface UseOpenInWindowOptions {
  /* Specifies the target attribute or the name of the window. The following values are supported:
  _blank - URL is loaded into a new window, or tab. This is default
  _parent - URL is loaded into the parent frame
  _self - URL replaces the current page
  _top - URL replaces any framesets that may be loaded
  name - The name of the window (Note: the name does not specify the title of the new window)
  */
  name?: "_blank" | "_parent" | "_self" | "_top" | string;
  /* specifies if window should be centered, default true */
  centered?: boolean;
  /* put window in focus, default true */
  focus?: boolean;
  /* Optional. A comma-separated list of items, no whitespaces. */
  specs?: {
    /* The height of the window. Min. value is 100, default is 800*/
    height: number;
    /* The width of the window. Min. value is 100, default is 800*/
    width: number;
    /* The left position of the window. Negative values not allowed */
    left?: number;
    /* The top position of the window. Negative values not allowed */
    top?: number;
    /* Whether or not to display the window in theater mode. Default is no. IE only */
    channelmode?: SpecsOption;
    directories?: SpecsOption;
    /* Whether or not to display the browser in full-screen mode. Default is no. A window in full-screen mode must also be in theater mode. IE only */
    fullscreen?: SpecsOption;
    /* Whether or not to display the address field. Opera only */
    location?: SpecsOption;
    /*	Whether or not to display the menu bar */
    menubar?: SpecsOption;
    /*	Whether or not the window is resizable. IE only */
    resizable?: SpecsOption;
    /*	Whether or not to display scroll bars. IE, Firefox & Opera only */
    scrollbars?: SpecsOption;
    /*	Whether or not to add a status bar */
    status?: SpecsOption;
    /*	Whether or not to display the title bar. Ignored unless the calling application is an HTML Application or a trusted dialog box */
    titlebar?: SpecsOption;
    /*	Whether or not to display the browser toolbar. IE and Firefox only */
    toolbar?: SpecsOption;
  };
}

export type UseOpenInWindowOptionsWithUrl = UseOpenInWindowOptions & WithUrl;
// Return types
export type UseOpenInWindowReturn = [() => void, Window | null | undefined];
export type UseOpenInWindowReturnWithOptionsArgFirst = [
  (
    event: React.MouseEvent,
    callbackOptions?: UseOpenInWindowOptionsWithUrl
  ) => void,
  Window | null | undefined
];

export const defaultOptions: Required<UseOpenInWindowOptions> = {
  name: "_blank",
  centered: true,
  focus: true,
  specs: {
    height: 300,
    width: 600,
    scrollbars: "yes",
  },
};

const getUrlAndOptions = (
  urlOrOptions: string | UseOpenInWindowOptionsWithUrl,
  optionsArg?: UseOpenInWindowOptions
) => {
  let url = "";
  let options = null
  if (typeof urlOrOptions === "object") {
    url = urlOrOptions.url;
    options = urlOrOptions as UseOpenInWindowOptions;
  } else {
    url = urlOrOptions;
    options = optionsArg!;
  }

  return [url, options] as const;
};

export function useOpenInWindow(
  options: UseOpenInWindowOptionsWithUrl
): UseOpenInWindowReturnWithOptionsArgFirst;
export function useOpenInWindow(
  url: string,
  options?: UseOpenInWindowOptions
): UseOpenInWindowReturn;
export function useOpenInWindow(
  urlOrOptions: string | UseOpenInWindowOptionsWithUrl,
  optionsArg?: UseOpenInWindowOptions
) {
  const [newWindowHandler, setNewWindowHandler] = useState<Window | null>();

  const [url, options] = getUrlAndOptions(urlOrOptions, optionsArg);
  const openInWindow = useCallback(
    (
      event: React.MouseEvent,
      callbackOptions?: UseOpenInWindowOptionsWithUrl
    ) => {
      event?.preventDefault?.();

      const { specs } = options;
      const { specs: defaultSpecs } = defaultOptions;
      let mixedOptions = { ...defaultOptions, ...options };
      let mixedSpecs = { ...defaultSpecs, ...specs };
      let urlToOpen = callbackOptions?.url || url;

      // If options passed as first argument then serve different callback
      if (typeof callbackOptions === "object") {
        const { specs: callbackSpecs } = callbackOptions;
        mixedOptions = { ...mixedOptions, ...callbackOptions };
        mixedSpecs = { ...mixedSpecs, ...callbackSpecs };
      }

      const { focus, name, centered } = mixedOptions;
      let windowOptions = "";

      if (centered) {
        const { width, height, ...restSpecs } = mixedSpecs;
        const centerPoint = calculateCenterPoint(width, height);
        windowOptions = windowOptionsMapper({
          width,
          height,
          ...centerPoint,
          ...restSpecs,
        });
      } else {
        windowOptions = windowOptionsMapper(mixedSpecs);
      }

      const newWindow = window.open(urlToOpen, name, windowOptions);

      // Puts focus on the newWindow
      if (focus && newWindow) newWindow.focus();

      setNewWindowHandler(newWindow);
    },
    [url, options, setNewWindowHandler]
  );

  return [openInWindow, newWindowHandler] as UseOpenInWindowReturn;
}
