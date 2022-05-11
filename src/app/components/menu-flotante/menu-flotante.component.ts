import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-menu-flotante',
  templateUrl: './menu-flotante.component.html',
  styleUrls: ['./menu-flotante.component.css']
})
export class MenuFlotanteComponent implements OnInit {

  public open:string = "";
  constructor() { }

  ngOnInit(): void {
  }

}
