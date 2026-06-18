import { Injectable, signal } from '@angular/core';
import { Toast, ToastType } from '../models/toast.model';

@Injectable({ providedIn: 'root' })
export class ToastService {
  private _toasts = signal<Toast[]>([]);
  readonly toasts = this._toasts.asReadonly();

  show(type: ToastType, message: string) {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast: Toast = { id, type, message };
    
    this._toasts.update(toasts => [newToast, ...toasts]);

    // Auto-dismiss après 4 secondes
    setTimeout(() => {
      this.remove(id);
    }, 4000);
  }

  success(message: string) { this.show('SUCCESS', message); }
  error(message: string) { this.show('ERROR', message); }
  warning(message: string) { this.show('WARNING', message); }
  info(message: string) { this.show('INFO', message); }

  remove(id: string) {
    this._toasts.update(toasts => toasts.filter(t => t.id !== id));
  }
}