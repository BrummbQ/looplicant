export function dispatchDataLoadEvent<T>(host: HTMLElement, detail?: T) {
  const event = new CustomEvent("dataloaded", {
    detail,
    bubbles: true,
    composed: true,
  });
  host.dispatchEvent(event);
}
