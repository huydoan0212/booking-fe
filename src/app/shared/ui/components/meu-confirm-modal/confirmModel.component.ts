import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NzButtonType } from 'ng-zorro-antd/button';
import { NzModalService } from 'ng-zorro-antd/modal';

@Component({
  selector: 'meu-confirm-modal',
  template: '',
  standalone: true,
  imports: [CommonModule],
})
export class ConfirmModalComponent {
  constructor(private modal: NzModalService) {}
  showModalConfirm(
    title: string,
    content: string,
    okText: string,
    cancelText: string,
    type: string,
    onOk: () => void
  ) {
    this.modal.confirm({
      nzTitle: `<p class="tw-text-lg tw-font-medium">${title}</p>`,
      nzContent: `<p class="tw-text-base tw-font-medium">${content}</p>`,
      nzOkText: okText,
      nzOkType: type as NzButtonType,
      nzOkDanger: true,
      nzOnOk: onOk,
      nzCancelText: cancelText,
      nzOnCancel: () => {},
    });
  }
}
