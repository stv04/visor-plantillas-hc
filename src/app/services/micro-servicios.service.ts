import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IFormatoAuditoria } from '../interfaces/microServices';
import { headAppJson } from '../interfaces/utils';

@Injectable({
  providedIn: 'root'
})
export class MicroServiciosService {

  // private msAuditoria = "https://localhost:7081/MsAuditoriaHC";
  private msAuditoria = "http://181.129.245.90:8165/MsAuditarHC";

  constructor(
    private http: HttpClient
  ) { }


  //#region MICROSERVICIO AUDITORIA
  private pathAuditarHC = "/AuditarHC";
  postAuditarHc(aud: IFormatoAuditoria):Observable<any> {
    return this.http.post(this.msAuditoria + this.pathAuditarHC, aud, {
      headers: headAppJson,
      responseType: "text"
    });
  }
  //#endregion
}
