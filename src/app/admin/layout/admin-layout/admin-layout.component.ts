import {Component} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {SidebarComponent} from '../sidebar/sidebar.component';

@Component({
  selector: "app-admin-layout",
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.scss'],
  imports: [
    RouterOutlet,
    SidebarComponent
  ]
})
export class AdminLayoutComponent {

}

