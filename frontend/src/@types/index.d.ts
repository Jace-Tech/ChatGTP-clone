export {};

declare global {
  interface Window {
    handleCopy: (state: MouseEvent) => void;
  }

  interface EventTarget{
    parentNode: HTMLElement;
    dataset: any;
  }
}
