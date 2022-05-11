import { Component, ElementRef, Input, OnInit } from '@angular/core';
import { SummernoteOptions } from 'ngx-summernote/lib/summernote-options';
import { IHistoriaClinica } from '../models/formularios';
import { AfiliadosService } from '../services/afiliados.service';
import { FormulariosService } from '../services/formularios.service';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.css']
})
export class ContentComponent implements OnInit {

  @Input() sidebarOpen = false;
  private iFrame:HTMLIFrameElement|null = null

  public title:string = "";
  public idForm:number = 0;
  public cargando:boolean = false;
  public documentosExternos: number[] = [];

  public config:SummernoteOptions = {
    tabsize: 2,
    height: 200,
    toolbar: [
      ['style', ['bold', 'italic', 'underline', 'fontsize']]
    ],
  }

  constructor(
    private formularioService: FormulariosService,
    private afilServ: AfiliadosService
  ) {

  }

  ngOnInit(): void {
    this.initFormulario();
  }

  initFormulario():void {
    this.formularioService.selected.subscribe((res:any) => {
      if(!this.iFrame) this.iFrame = document.querySelector("#iframe-visor");

      if(res.url && this.iFrame) {
        this.iFrame.src = res.url;
      }

      if(res.titulo) this.title = res.titulo;
      if(res.id) {
        this.idForm = res.id;
        this.buscarDocExt(res.id);
      }

    })
  }

  buscarDocExt(id: number) {
    this.formularioService.obtenerDocumentosAsociados(id).subscribe(res => {
      this.documentosExternos = res.map((doc:any) => doc.nU_IDDOCUMENTO_FORMXDOC);
    })
  }

  guardarHistoriaClinica() {
    if(this.iFrame) {
      const form = this.iFrame.contentDocument?.forms[0];
      if(!form) return;

      const respuesta:any[] = [];

      const formData:FormData = new FormData(form);
      const els = form.querySelectorAll<HTMLInputElement>("input[name]");

      formData.forEach((value, name) => {
        respuesta.push({name, value});
      });

      els.forEach((el:HTMLInputElement) => {
        const name = el.getAttribute("name");
        const exists = respuesta.some(v => v.name === name);

        if(exists) return;
        
        const respIndividual = {
          name,
          value: el.value
        }

        respuesta.push(respIndividual);
      });

      console.log(respuesta);
      const historiaClinica:IHistoriaClinica = {
        nU_IDHISTORIACLINICA_HC: 0,
        nU_IDAFILIADO_HC: this.afilServ.afiliado.nU_IDAFILIADO_AFIL,
        nU_IDFORMULARIO_HC: this.idForm,
        nU_IDESPMEDICO_HC: 1,
        nU_IDLABORATORIO_HC: 1,
        nU_ESTADO_HC: 1,
        nU_IDMEDICO_HC: 1,
        tX_RESPUESTA_HC: JSON.stringify(respuesta),
        fE_FECHA_HC: new Date()
      }

      this.formularioService.enviarHistoriaClinica(historiaClinica).subscribe(res => {
        alert(res);
      })
      
    }
  }

  revisarDocumentoAsociado(id: number): boolean {
    return this.documentosExternos.some(d => d === id);
  }

}
