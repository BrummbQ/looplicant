import { onMount } from "svelte";
import appCss from "../app.css?inline";

export const utilitySheet = new CSSStyleSheet();
utilitySheet.replaceSync(appCss);

export function applyUtilitySheet(host: HTMLElement) {
  onMount(async () => {
    const shadowRoot = host.shadowRoot;
    if (shadowRoot) {
      shadowRoot.adoptedStyleSheets = [utilitySheet];
    }
  });
}
