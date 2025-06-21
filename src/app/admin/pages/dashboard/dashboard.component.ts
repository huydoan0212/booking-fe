import { Component } from '@angular/core';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexStroke,
  ApexTitleSubtitle
} from 'ng-apexcharts';
import { NgApexchartsModule } from 'ng-apexcharts';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  dataLabels: ApexDataLabels;
  stroke: ApexStroke;
  title: ApexTitleSubtitle;
};

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    NgApexchartsModule,
    FormsModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  cinemas = [
    { id: 'cgv-hn', name: 'CGV Hà Nội' },
    { id: 'lotte-hcm', name: 'Lotte Hồ Chí Minh' },
    { id: 'galaxy-dn', name: 'Galaxy Đà Nẵng' }
  ];

  revenueData: Record<string, number[]> = {
    'cgv-hn':    [120, 140, 100, 180, 90, 160, 200, 190, 220, 150, 170, 210],
    'lotte-hcm': [110, 130, 95, 160, 80, 150, 180, 170, 210, 140, 160, 200],
    'galaxy-dn': [90, 100, 85, 120, 75, 130, 140, 135, 160, 120, 125, 145]
  };

  selectedCinema: string = 'cgv-hn';

  chartOptions: ChartOptions;

  constructor() {
    this.chartOptions = this.getChartOptions(this.selectedCinema);
  }

  getChartOptions(cinemaId: string): ChartOptions {
    const cinemaName = this.cinemas.find(c => c.id === cinemaId)?.name || '';
    return {
      series: [
        {
          name: 'Doanh thu (triệu VND)',
          data: this.revenueData[cinemaId] || []
        }
      ],
      chart: {
        height: 350,
        type: 'line',
        zoom: {
          enabled: false
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: 'smooth'
      },
      title: {
        text: `Doanh thu theo rạp (${cinemaName}) trong 12 tháng`,
        align: 'left'
      },
      xaxis: {
        categories: [
          'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
          'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
        ]
      }
    };
  }

  onCinemaChange() {
    this.chartOptions = this.getChartOptions(this.selectedCinema);
  }
}
