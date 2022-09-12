import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { IMostradorFormulario, IFormulario, IHistoriaClinica, IHistoriaSeleccionada } from '../interfaces/formularios';
import { MPlantillasHcComponent } from '../m-plantillas-hc/m-plantillas-hc.component';
import { AfiliadosService } from '../services/afiliados.service';
import { FormulariosService } from '../services/formularios.service';

@Component({
  selector: 'app-buscar-historia-clinica',
  templateUrl: './buscar-historia-clinica.component.html',
  styleUrls: ['./buscar-historia-clinica.component.css']
})
export class BuscarHistoriaClinicaComponent implements OnInit {

  filtrarFecha:boolean = true;
  title:string = "";

  private formularios:IMostradorFormulario[] = [];
  private idHcSelected: number = 0;
  public historiaClinica:IHistoriaClinica[] = [];
  public cargandoHistoriaClinicaAfil:boolean = false;
  constructor(
    public dialog: MatDialog,
    private afilServ: AfiliadosService,
    private formServ: FormulariosService
  ) {}

  ngOnInit(): void {
    this.limpiador();
  }

  openDialog() {
    this.dialog.open(MPlantillasHcComponent);
  }

  get idAfil():number {
    return this.afilServ.idAfiliado;
  }

  tituloFormHistoriaClinica(idForm:number):string {
    const formulario = this.formularios.find(form => idForm === form.nU_IDFORMULARIO_FORM);

    if(!formulario) return "Formulario";
    
    return formulario.tX_NOMBREFORMULARIO_FORM;
  }

  getHistoriaClinicaAfiliado() {
    this.cargandoHistoriaClinicaAfil = true;
    this.formServ.getHcPorAfil(this.idAfil).subscribe(observer => {
      this.historiaClinica = observer;
      this.historiaClinica.sort((a,b) => new Date(b.fE_FECHA_HC).getTime() - new Date(a.fE_FECHA_HC).getTime() )
      this.cargandoHistoriaClinicaAfil = false;
    });

    this.formServ.getAll().subscribe(observer => {
      this.formularios = observer;
    });
  }

  buscarFormulario(idForm:number, idHc:number) {
    this.idHcSelected = idHc
    this.formServ.get(idForm).subscribe((observer:IFormulario) => {
      this.verHistoriaDiligenciada(observer);
    })
  }

  verHistoriaDiligenciada(form: IFormulario) {
    const config:IHistoriaSeleccionada = {
      lectura: true,
      idHc: this.idHcSelected
    }
    this.formServ.renderFormulario(form, this.cargarInfoDiligenciada.bind(this), config);
  }

  async cargarInfoDiligenciada(domHtml:Document):Promise<Document> {
    const hcSelected:IHistoriaClinica | undefined = this.historiaClinica.find(h => h.nU_IDHISTORIACLINICA_HC === this.idHcSelected);

    if(!hcSelected) return domHtml;
    
    const informacion = JSON.parse(hcSelected.tX_RESPUESTA_HC);
    console.log(informacion);

    informacion.forEach(({value, name}: {value:string, name:string}) => {
      const els:any = domHtml.getElementsByName(name);
      
      els.forEach((el:any) => {
        if(el.type === "checkbox" || el.type === "radio") {
          if(el.value === value) el.setAttribute("checked", true);
        } else if(el.nodeName === "TEXTAREA") {
          el.innerText = value;
        } else {
          el.setAttribute("value", value);
        }
      });
    });

    domHtml.querySelectorAll("[name]").forEach(el => el.setAttribute("disabled", "true"));

    return domHtml
  }

  limpiador() {
    this.afilServ.afiliadoObserver.asObservable().subscribe(observer => {
      this.historiaClinica = [];
    })
  }

}
