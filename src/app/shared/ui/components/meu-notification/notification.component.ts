import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';

@Component({
  selector: 'meu-notification',
  standalone: true,
  imports: [CommonModule],
  template: '',
})
export class NotificationComponent {
  constructor(private notification: NzNotificationService) {}
  showNotification(status: boolean, message: string): void {
    const config = {
      nzDuration: 4500,
      width: '400px',
      marginLeft: '-265px',
    };
    if (status) {
      this.notification.blank('', message, {
        ...config,
        nzStyle: {
          background: '#f6ffed',
          border: '#b7eb8f solid 1px',
          color: ' #389e0d',
        },
      });
    } else {
      this.notification.blank('', message, {
        ...config,
        nzStyle: {
          background: '#fff1f0',
          border: '#ffa39e solid 1px',
          color: ' #cf1322',
        },
      });
    }
  }
}
