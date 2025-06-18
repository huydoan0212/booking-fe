import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'filterSeatsByRow', standalone: true })
export class FilterSeatsByRowPipe implements PipeTransform {
  transform(
    seats: {
      row: string;
      seatNumber: number;
      status: 'AVAILABLE' | 'BOOKED';
      type: 'STANDARD' | 'VIP' | 'COUPLE';
    }[],
    row: string
  ) {
    return seats.filter(s => s.row === row);
  }
}
