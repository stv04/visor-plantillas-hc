import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { IFormulario, IHistoriaClinica, IMostradorFormulario } from '../interfaces/formularios';
import { IHistClinPorDocExt } from '../interfaces/historiaClinica';
import {AfiliadosService} from "./afiliados.service";

@Injectable({
  providedIn: 'root'
})
export class FormulariosService {

  private endpoint:string = "https://localhost:7000/";
  private pathForm:string = "Formularios";
  private pathHistClin:string = "HistoriaClinica";
  private pathDocXForm:string = this.pathForm + "/relacionDocumento";
  private headAppJson = new HttpHeaders({
    "Content-Type": "application/json"
  });

  private seleccionado = new BehaviorSubject({});
  private mostrarioForms:Array<IMostradorFormulario> = [];
  constructor(private http: HttpClient, private afilServ: AfiliadosService) { }

  getAll():Observable<IMostradorFormulario[]> {
    if(this.mostrarioForms.length) 
      return new BehaviorSubject(this.mostrarioForms);

    return this.http.get<IMostradorFormulario[]>(this.endpoint + this.pathForm);
  }

  get(id:number):Observable<IFormulario> {
    return this.http.get<IFormulario>(this.endpoint + this.pathForm + "?id=" + id);
  }

  setForm(obj: any):void {
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


  //DACUMENTOS ASOCIADOS
  obtenerDocumentosAsociados(id: number):Observable<any> {
    const params = new HttpParams({
      fromObject: {id}
    });
    
    return this.http.get(this.endpoint + this.pathDocXForm, {params});
  }

  agregarDocumentoExterno(documento: IHistClinPorDocExt):Observable<string> {
    return this.http.post(this.endpoint + this.pathHistClin + "/HcPorDocExt", documento, {
      headers: this.headAppJson,
      responseType: "text"
    });
  }
}