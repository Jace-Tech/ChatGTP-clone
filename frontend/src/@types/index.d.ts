export {};

declare global {
  interface Window {
    handleCopy: (state: MouseEvent) => void;
    handleDeleteChat: (event: Event) => void;
    handleToggleFormatting?: (event: Event, message: string ) => void;
  }

  interface EventTarget{
    parentNode: HTMLElement;
    id: string;
    dataset: any;
  }
}
