import { setupZoneTestEnv } from 'jest-preset-angular/setup-env/zone';

setupZoneTestEnv();

// jsdom does not implement layout observers or native modal dialog methods.
Object.defineProperty(globalThis, 'ResizeObserver', {
  writable: true,
  value: class ResizeObserver {
    observe(): void {}
    unobserve(): void {}
    disconnect(): void {}
  }
});
HTMLDialogElement.prototype.showModal = function (): void { this.open = true; };
HTMLDialogElement.prototype.close = function (): void {
  this.open = false;
  this.dispatchEvent(new Event('close'));
};
