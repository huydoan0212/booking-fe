// src/app/service/websocket/stomp.service.ts
import { Injectable } from '@angular/core';
import { Client, Message, Stomp, StompConfig, StompSubscription, frameCallbackType } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import {environment} from '../../environments/environment.development';

@Injectable({ providedIn: 'root' })
export class StompService {
  public client: Client;

  constructor() {
    this.client = new Client({
      webSocketFactory: () => new SockJS('http://localhost:8080/api/ws-ticket'), // KHÔNG có `/websocket`
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });
    this.client.onConnect = () => {
      console.log('STOMP connected via pure WebSocket');
    };
    this.client.onStompError = frame => {
      console.error('STOMP error: ' + frame.headers['message']);
    };
    this.client.activate();
  }

  /**
   * Subscribe tới một destination (e.g. /topic/seat-status/{showtimeId}).
   * callback sẽ được gọi khi có message.
   */
  subscribe(destination: string, callback: (message: Message) => void): StompSubscription {
    return this.client.subscribe(destination, callback);
  }

  /**
   * Gửi một message tới server qua STOMP.
   * destination ví dụ: '/app/lock-seat'
   */
  send(destination: string, body: any): void {
    if (this.client.connected) {
      this.client.publish({ destination, body: JSON.stringify(body) });
    } else {
      // Nếu chưa connect, có thể queue hoặc báo lỗi. Ở đây ta đơn giản log.
      console.error('STOMP not connected yet.');
    }
  }

  /**
   * Gửi message “đến user-specific queue” (nếu cần): '/user/{sessionId}/queue/...'
   * nhưng client phía Angular thường subscribe tới '/user/queue/errors' mặc định.
   */
  subscribeUserQueue(callback: (message: Message) => void): StompSubscription {
    return this.client.subscribe(`${environment.API_DOMAIN}/user/queue/errors`, callback);
  }
}
