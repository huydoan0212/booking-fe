import { Component, OnInit } from "@angular/core";
import {RouterLink, RouterLinkActive} from '@angular/router';
import {NgClass} from '@angular/common';

@Component({
  selector: "app-sidebar",
  templateUrl: "./sidebar.component.html",
  imports: [
    RouterLinkActive,
    RouterLink,
    NgClass
  ]
})
export class SidebarComponent {
  collapseShow: string | string[] | Set<string> | { [p: string]: any } | null | undefined;

  toggleCollapseShow(hidden: string) {

  }
}

