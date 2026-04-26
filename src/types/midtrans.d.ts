interface Snap {
  pay(token: string, options: SnapOptions): void;
}

interface SnapOptions {
  onSuccess?: () => void;
  onPending?: () => void;
  onError?: () => void;
  onClose?: () => void;
}

declare global {
  interface Window {
    snap: Snap;
  }
}

export {};