export {};

declare global {
  interface Window {
    handleCopy: (state: MouseEvent) => void;
    handleToggleFormatting?: (event: Event, message: string ) => void;
  }

  interface EventTarget{
    parentNode: HTMLElement;
    dataset: any;
  }
}
