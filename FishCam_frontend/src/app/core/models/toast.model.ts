export type ToastType = 'SUCCESS' | 'ERROR' | 'WARNING' | 'INFO';

export interface Toast {
  id: string;
  type: ToastType;
  message: string;
}