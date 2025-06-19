import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'sortSeatsByColumn', standalone: true })
export class SortSeatsByColumnPipe implements PipeTransform {
  transform(
    seats: {
      row: string;
      seatNumber: number;
      status: 'AVAILABLE' | 'BOOKED';
      type: 'STANDARD' | 'VIP' | 'COUPLE';
    }[]
  ) {
    // Tạo bản sao mảng để không thay đổi nguyên mảng gốc
    return [...seats].sort((a, b) => a.seatNumber - b.seatNumber);
  }
}
