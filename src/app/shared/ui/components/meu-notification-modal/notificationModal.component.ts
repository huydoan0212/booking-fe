import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';

@Component({
  selector: 'meu-notification-modal',
  standalone: true,
  imports: [CommonModule],
  template: '',
})
export class NotificationModalComponent {
  constructor(private modal: NzModalService) {}

  showWarning(message: string, title: string): void {
    this.modal.warning({
      nzTitle: `<p class="tw-text-lg tw-font-medium">${title}</p>`,
      nzContent: `<p class="tw-text-base tw-font-medium">${message}</p>`,
    });
  }
  showError(message: string, title: string): void {
    this.modal.error({
      nzTitle: `<p class="tw-text-lg tw-font-medium">${title}</p>`,
      nzContent: `<p class="tw-text-base tw-font-medium">${message}</p>`,
    });
  }
}
