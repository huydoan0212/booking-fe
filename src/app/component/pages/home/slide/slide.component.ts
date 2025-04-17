import { Component, AfterViewInit } from '@angular/core';
import Swiper from 'swiper';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { NgForOf } from '@angular/common';

Swiper.use([Navigation, Pagination, Autoplay]);

@Component({
  selector: 'app-slide',
  standalone: true,
  imports: [NgForOf],
  templateUrl: './slide.component.html',
  styleUrls: ['./slide.component.scss']
})
export class SlideComponent implements AfterViewInit {
  slides = [
    { img: 'assets/images/slide1.jpg' },
    { img: 'assets/images/slide2.jpg' },
    { img: 'assets/images/slide3.jpg' },
    { img: 'assets/images/slide4.jpg' },
    { img: 'assets/images/slide5.jpg' },
    { img: 'assets/images/slide6.jpg' },
  ];

  ngAfterViewInit() {
    new Swiper('.mySwiper', {
      slidesPerView: 1.5,          // Hiển thị 1.5 slide cùng lúc
      spaceBetween: 50,            // Khoảng cách giữa các slide
      loop: true,                  // Vòng lặp qua các slide
      centeredSlides: true,        // Căn giữa slide hiện tại
      autoplay: {
        delay: 3000                // Tự động chuyển slide sau mỗi 3 giây
      },
      pagination: {
        el: '.swiper-pagination',  // Chỉ định phần tử chứa pagination
        clickable: true            // Cho phép nhấp vào các điểm phân trang
      },
      navigation: {
        nextEl: '.swiper-button-next',  // Chỉ định nút next
        prevEl: '.swiper-button-prev',  // Chỉ định nút prev
      },
      effect: 'fade',              // Hiệu ứng chuyển đổi mờ dần
      speed: 800                   // Thời gian chuyển đổi (800ms)
    });
  }
}
