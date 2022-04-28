import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-container',
  templateUrl: './container.component.html',
  styleUrls: ['./container.component.css']
})
export class ContainerComponent implements OnInit {

  sidebarIsOpen:boolean = true;
  constructor() { }

  ngOnInit(): void {
  }

  toggleSidebar(bool: boolean) {
    this.sidebarIsOpen = bool;
  }

}
