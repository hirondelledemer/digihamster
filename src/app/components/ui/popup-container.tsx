"use client";

import * as React from "react";

/**
 * A modal Radix layer (Sheet, Dialog) sets `pointer-events: none` on `<body>`
 * and re-enables it only on its own layer element. Base UI popups portal to
 * `<body>` by default, so inside a Sheet they render but inherit
 * `pointer-events: none` — visible, but dead to hover and click. They also fall
 * outside Radix's focus scope and count as outside presses.
 *
 * Sheet/Dialog publish their content element here so popups can portal into
 * that layer instead. Consumers need no changes.
 */
const PopupContainerContext = React.createContext<HTMLElement | null>(null);

export const PopupContainerProvider = PopupContainerContext.Provider;

/**
 * The nearest modal layer to portal a popup into, or `undefined` when there is
 * none (popup falls back to `<body>`). Never returns `null`: Base UI's portal
 * treats an explicit `null` container as "not resolved yet" and renders nothing.
 */
export function usePopupContainer(): HTMLElement | undefined {
  return React.useContext(PopupContainerContext) ?? undefined;
}
