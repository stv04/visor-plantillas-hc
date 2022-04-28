import { Component, ElementRef, HostListener, OnInit } from '@angular/core';

@Component({
  selector: 'app-drop-perfil',
  templateUrl: './drop-perfil.component.html',
  styleUrls: ['./drop-perfil.component.css']
})
export class DropPerfilComponent implements OnInit {
  public open: string = "";
  constructor(private eRef: ElementRef) { }

  ngOnInit(): void {
  }

  @HostListener("document:click", ["$event"])
  hide(event:Event) {
    if(!this.eRef.nativeElement.contains(event.target)) { this.open = ""; }

  }

}
