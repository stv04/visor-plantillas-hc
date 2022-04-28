import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { IFormulario, IMostradorFormulario } from '../models/formularios';
import {AfiliadosService} from "./afiliados.service";

@Injectable({
  providedIn: 'root'
})
export class FormulariosService {

  private endopoint:string = "https://localhost:7000/Formularios";
  private seleccionado = new BehaviorSubject("");
  private mostrarioForms:Array<IMostradorFormulario> = [];
  constructor(private http: HttpClient, private afilServ: AfiliadosService) { }

  getAll():Observable<IMostradorFormulario[]> {
    if(this.mostrarioForms.length) 
      return new BehaviorSubject(this.mostrarioForms);

    return this.http.get<IMostradorFormulario[]>(this.endopoint);
  }

  get(id:number):Observable<IFormulario> {
    return this.http.get<IFormulario>(this.endopoint + "?id=" + id);
  }

  setForm(url: string):void {
    this.seleccionado.next(url);
  }

  setMostrarios(formularios:IMostradorFormulario[]) {
    this.mostrarioForms = formularios;
  }

  getSelected():Observable<string> {
    return this.seleccionado
  }
}