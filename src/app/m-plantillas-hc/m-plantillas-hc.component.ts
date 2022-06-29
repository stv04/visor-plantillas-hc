import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DidOpenEvent, SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { lastValueFrom } from 'rxjs';
import { IFormulario } from '../interfaces/formularios';
import { AfiliadosService } from '../services/afiliados.service';
import { DataMasterService } from '../services/data-master.service';
import { FormulariosService } from '../services/formularios.service';

@Component({
  selector: 'app-m-plantillas-hc',
  templateUrl: './m-plantillas-hc.component.html',
  styleUrls: ['./m-plantillas-hc.component.css']
})
export class MPlantillasHcComponent implements OnInit {
  public cargando:boolean = true;

  formularios:Array<any> = [];
  constructor(
    private formulariosService: FormulariosService,
    private dialog: MatDialog,
    private afilServ: AfiliadosService,
    private dataMastServ: DataMasterService
  ) { }

  ngOnInit(): void {

    this.formulariosService.getAll().subscribe(observer => {
      this.formularios = observer;
      this.formulariosService.setMostrarios(observer);
    });

  }

  selectFormulario(id:number) {
    if(this.afilServ.afiliado) {
      this.formulariosService.idAfiliado = this.afilServ.afiliado.nU_IDAFILIADO_AFIL;
    }

    this.formulariosService.get(id).subscribe(observer => {
      this.dialog.closeAll();
      this.renderFormulario(observer);
    });
  }

  async renderFormulario(formulario: IFormulario) {
    let html = formulario.tX_HTML_FORM;
    const css = formulario.tX_CSS_FORM;
    const id = formulario.nU_IDFORMULARIO_FORM;
    const js = formulario.tX_JS_FORM;
    const titulo = formulario.tX_NOMBREFORMULARIO_FORM;


    const setHeader = (style:string) => `
      <head>
        <meta charset="UTF-8" />

        <link
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css"
          rel="stylesheet"
        />
        <style>${style}</style>
      </head>
    `;

    let estructura = `
      <!DOCTYPE html>
    `;

    const domHtml = new DOMParser().parseFromString(html, "text/html");
    const elements = domHtml.querySelectorAll<HTMLInputElement>("[data-servicio]");
    const elementosConServicios:HTMLInputElement[] = [];

    elements.forEach(e => elementosConServicios.push(e));

    for await (const el of elementosConServicios) {
      if(el) await this.obtenerServicios(el);
    }

    const form:HTMLFormElement|null = domHtml.querySelector<HTMLFormElement>("form");
    const body = domHtml.body;

    if(!form) {
      console.log("no tiene formulario")
      const childs = body.childNodes;
      const formulario = domHtml.createElement("form");

      console.log("CHILD NODES => ", childs);
      console.log("CHILDREN => ", body.children);
      while(childs.length) {
        formulario.appendChild(childs[0]);
      }
      body.appendChild(formulario);
    }


    estructura += setHeader(css);
    estructura += domHtml.body.outerHTML;
    // .replace("</body>", "") + "<script>" + js + "</script>" + "</body>"

    // setValue("far", "245");
 
    if(html) {
      const blob = new Blob([estructura], {
        type: "text/html"
      });
  
      const url = URL.createObjectURL(blob);
      this.formulariosService.setForm({url, titulo, id});

    }
  }

  private async obtenerServicios(el: HTMLInputElement):Promise<any> {
    const atributo = el.getAttribute("data-servicio")?.split("::");
    interface ICampos {
      titulo:string,
      conversion?:string,
    }

    interface IParamsRecibidos {
      nombre:string,
      campos:ICampos[],
      eval?:string,
      separador?:string
    }

    if(atributo) {
      const [servicio, query] = atributo;
      const toParser = query.replace(/&quote;/g, "\"");
      const params:IParamsRecibidos = JSON.parse(toParser);
      const campos:ICampos[] = params.campos;
      
      if(servicio === "afiliados" && this.afilServ.afiliado) {
        el.setAttribute("disabled", "true");
        const values = [];
        let i = 0;
        for await (let c of campos) {
          const title:string = c.titulo;
          const conversion = c.conversion;

          values[i] = this.afilServ.afiliado[title];
          
          if(conversion) {
            const consulta:number = values[i];
            const datosMaestros = await lastValueFrom(this.dataMastServ.dataMaster(conversion));
            values[i] = datosMaestros[consulta][0];
          }

          i++
        }

        const value = this.evaluarValor(values.join(params.separador || ""), params.eval || "");
        // const value:string = campos.map(async c => this.afilServ.afiliado[c]).join(" ");

        el.setAttribute("value", value);
      }
    }
  }

  private evaluarValor(valor:string, evaluador:string): string {
    switch(evaluador) {
      case "edad":
        const fecha = valor.split("/").reverse().join("-");
        const now = new Date().getTime();
        const birth = new Date(fecha).getTime();

        const age = Math.floor((now - birth) * 3.2e-11);
        return age.toString();

      case "tipo-usuario":
        const [afil, coti] = valor.split(",");
        return afil == coti ? "Afiliado" : "Cotizante";

      default: 
        return valor
    }
  }

}
