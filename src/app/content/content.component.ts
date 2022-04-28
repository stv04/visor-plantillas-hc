import { Component, ElementRef, Input, OnInit } from '@angular/core';
import { FormulariosService } from '../services/formularios.service';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.css']
})
export class ContentComponent implements OnInit {

  @Input() sidebarOpen = false;
  constructor(private formularioService: FormulariosService) { }

  ngOnInit(): void {
    this.initFormulario();
  }

  initFormulario():void {
    const iFrame:HTMLIFrameElement|null = document.querySelector("#iframe-visor");
    this.formularioService.getSelected().subscribe((res:string) => {
      if(iFrame) {
        iFrame.src = res;
      }
    })
  }

}
