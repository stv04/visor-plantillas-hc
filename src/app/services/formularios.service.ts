import { DatePipe } from '@angular/common';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, tap } from 'rxjs';
import { IFormulario, IHistoriaClinica, IMostradorFormulario, IFormSeleccionado, IHistoriaSeleccionada } from '../interfaces/formularios';
import { IHistClinPorDocExt, ITempAudioria } from '../interfaces/historiaClinica';
import { IGrupEtPorRias, IGrupoEtareo, IRias } from '../interfaces/rias';
import { IRiasTreeNode } from '../interfaces/utils';
import {AfiliadosService} from "./afiliados.service";

@Injectable({
  providedIn: 'root'
})
export class FormulariosService {

  // private endpoint:string = "https://localhost:7000/MsHistoriaClinica";
  private endpoint:string = "http://181.129.245.90:8165/MsHistoriaClinica";
  private pathForm:string = "/Formularios";
  private pathHistClin:string = "/HistoriaClinica";
  private pathRias:string = "/Rias";
  private pathGruposEtareos:string = "/GruposEtareos";
  private pathGrupEtPorRia:string = "/GrupoEtPorRia";
  private pathTemporalAuditoria = "/Temporales/Auditoria";

  private pathDocXForm:string = this.pathForm + "/relacionDocumento";
  private pathHCPorDocExtAfil:string = this.pathHistClin + "/ObtenerHistorialClinicoDeAfiliado";
  private HcPorDocExt:string = this.pathHistClin + "/HcPorDocExt"
  private headAppJson = new HttpHeaders({
    "Content-Type": "application/json"
  });

  private listaFormBhSub = new BehaviorSubject<IMostradorFormulario[]>([]);
  private seleccionado = new BehaviorSubject({});
  private mostrarioForms:Array<IMostradorFormulario> = [];
  private historiaOrdenesMedicas:Array<any> = [];
  private listaRias:IRias[] = [];

  public idAfiliado:number = 0;
  public cargando:boolean = false;
  constructor(private http: HttpClient, private dp: DatePipe) { }

  set lectorFormulario(obj:any) {

  }

  get allFormsFinded():IMostradorFormulario[] { return this.mostrarioForms }

  getAll():Observable<IMostradorFormulario[]> {
    if(this.mostrarioForms.length) 
      return this.listaFormBhSub;

    return this.http.get<IMostradorFormulario[]>(this.endpoint + this.pathForm)
    .pipe(tap(r => this.listaFormBhSub.next(r)));
  }

  get(id:number):Observable<IFormulario> {
    this.cargando = true;
    return this.http.get<IFormulario>(this.endpoint + this.pathForm + "?id=" + id);
  }

  async renderFormulario(formulario: IFormulario, moderador:Function, config?: IHistoriaSeleccionada) {
    let html = formulario.tX_HTML_FORM;
    const css = formulario.tX_CSS_FORM;
    const idForm = formulario.nU_IDFORMULARIO_FORM;
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

    const domParsed = new DOMParser().parseFromString(html, "text/html");
    const domHtml:Document = await moderador(domParsed) || domParsed;
    
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
      this.setForm({url, titulo, idForm, lectura: false, ...config});

    }

    this.cargando = false;
  }

  setForm(obj: IFormSeleccionado):void {
    this.seleccionado.next(obj);
  }

  setMostrarios(formularios:IMostradorFormulario[]) {
    this.mostrarioForms = formularios;
  }

  get selected():Observable<any> {
    return this.seleccionado;
  }

  //LLENADO DE HISTORIA CLÍNICA
  enviarHistoriaClinica(historia:IHistoriaClinica):Observable<IHistoriaClinica> {
    const headers = new HttpHeaders({
      "Content-Type": "application/json"
    });

    return this.http.post<IHistoriaClinica>(this.endpoint + this.pathHistClin, historia, {
      headers,
    });

  }


  //DOCUMENTOS ASOCIADOS
  obtenerDocumentosAsociados(id: number):Observable<any> {
    const params = new HttpParams({
      fromObject: {id}
    });
    
    return this.http.get(this.endpoint + this.pathDocXForm, {params});
  }

  agregarDocumentoExterno(documento: IHistClinPorDocExt):Observable<string> {
    return this.http.post(this.endpoint + this.HcPorDocExt, documento, {
      headers: this.headAppJson,
      responseType: "text"
    });
  }

  getHcPorDocExtAfil(idAfil: number, idDocumentoExterno:number) {
    const params = new HttpParams({
      fromObject: {idDocumentoExterno}
    });

    if(idAfil === this.idAfiliado && this.historiaOrdenesMedicas.length) {
      return new BehaviorSubject(this.historiaOrdenesMedicas);
    };

    this.historiaOrdenesMedicas = [];

    return this.http.get(this.endpoint + this.pathHCPorDocExtAfil + "/" + idAfil, {params})
    .pipe(map(res => {
      (<any[]>res)
      .forEach(doc => {
        const informacion = doc.tX_INFODILIGENCIADA_HCXDE;
        const idHC = doc.nU_IDHISTORIACLINICA_HCXDE;
        const fecha = this.dp.transform(doc.fE_FECHA_HC, "short");

        if(!/^[\[|\{]/.test(informacion)) return;

        const jsonInfo = JSON.parse(informacion);

        jsonInfo
        .map((info:any) => {
          info.historia = idHC;
          info.fecha = fecha;
          return info;
        })
        
        this.historiaOrdenesMedicas = this.historiaOrdenesMedicas.concat(jsonInfo);
      });

      this.historiaOrdenesMedicas.sort((a, b) => {
        return new Date(b.fecha).getTime() - new Date(a.fecha).getTime();
      });

      return this.historiaOrdenesMedicas;
    }))
  }

  getHcPorAfil(idAfil:number):Observable<any> {
    return this.http.get(this.endpoint + this.pathHCPorDocExtAfil + "/" + idAfil)
  }

  getDocumentosDiligenciados(idHc: number):Observable<any> {
    return this.http.get(this.endpoint + this.HcPorDocExt + "/" + idHc);
  }

  //#region RIAS
  get rias():Observable<IRias[]> {
    return this.http.get<IRias[]>(this.endpoint + this.pathRias)
    .pipe(tap(v => this.listaRias = v));
  }

  postRias(rias:IRias):Observable<any> {
    return this.http.post(this.endpoint + this.pathRias, rias, {
      headers: this.headAppJson,
      responseType: "text"
    });
  }

  public compactarRiasEnArbol(padre:number = 0, isPadre:boolean = false) {
    const children:IRiasTreeNode[] = [];

    this.listaRias.filter(r => isPadre ? r.nU_PK_RIAS === padre : r.nU_PADREATENCION_RIAS === padre)
    .forEach(rias => {
      const hijos = this.listaRias.filter(ria => ria.nU_PADREATENCION_RIAS === rias.nU_PK_RIAS);
      
      const node:IRiasTreeNode = {
        name: rias.tX_ATENCION_RIAS,
        pk: rias.nU_PK_RIAS,
        pkPadre: rias.nU_PADREATENCION_RIAS
      }
      
      if(hijos.length) node.children = this.compactarRiasEnArbol(rias.nU_PK_RIAS);
      
      children.push(node);
    });

    return children;
  }
  
  get gruposEtareos():Observable<any> {
    return this.http.get(this.endpoint + this.pathGruposEtareos);
  }

  postGrupoEtareo(grupo:IGrupoEtareo):Observable<any> {
    return this.http.post(this.endpoint + this.pathGruposEtareos, grupo, {
      headers: this.headAppJson,
      responseType: "text"
    });
  }

  get gruposEtPorRias():Observable<IGrupEtPorRias[]> {
    return this.http.get<IGrupEtPorRias[]>(this.endpoint + this.pathGrupEtPorRia);
  }

  postGrupoEtPorRias(rel:IGrupEtPorRias) {
    return this.http.post(this.endpoint + this.pathGrupEtPorRia, rel, {
      headers: this.headAppJson,
      responseType: "text"
    });
  }
  //#endregion

  //#region TEMPORALES
  get temporalesAuditoria():Observable<ITempAudioria[]> {
    return this.http.get<ITempAudioria[]>(this.endpoint + this.pathTemporalAuditoria)
    // .pipe(tap(v => this.listaRias = v));
  }

  postTemporalAuditoria(temp: ITempAudioria):Observable<any> {
    return this.http.post(this.endpoint + this.pathTemporalAuditoria, temp, {
      headers: this.headAppJson,
      responseType: "text"
    });
  }
  //#endregion
}