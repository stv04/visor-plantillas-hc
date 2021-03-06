import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { SummernoteOptions } from 'ngx-summernote/lib/summernote-options';
import { IncapacidadesComponent } from '../documentos-externos/components/incapacidades/incapacidades.component';
import { OrdenesMedicasComponent } from '../documentos-externos/components/ordenes-medicas/ordenes-medicas.component';
import { IHistoriaClinica } from '../interfaces/formularios';
import { IHistClinPorDocExt } from '../interfaces/historiaClinica';
import { AfiliadosService } from '../services/afiliados.service';
import { FormulariosService } from '../services/formularios.service';

declare var $:any;
const ID_INDIMANEJO:number = 2;

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

  @ViewChild(OrdenesMedicasComponent) private ordenesMedicas: any;
  @ViewChild(IncapacidadesComponent) private incapacidades!: IncapacidadesComponent;
  constructor(
    private formularioService: FormulariosService,
    private afilServ: AfiliadosService,
  ) {

  }

  ngOnInit(): void {
    this.initFormulario();
  }

  initFormulario():void {
    if(!this.iFrame) this.iFrame = document.querySelector("#iframe-visor");
    this.formularioService.selected.subscribe((res:any) => {
      if(res.url && this.iFrame) {
        this.iFrame.src = res.url;
      }

      if(res.titulo) this.title = res.titulo;
      if(res.id) {
        this.idForm = res.id;
        this.buscarDocExt(res.id);
      }

      const formatoAtencion:HTMLLinkElement = document.querySelector<HTMLLinkElement>("#formatos-atencion-tab")!;
      if(formatoAtencion) formatoAtencion.click();

    })
  }

  buscarDocExt(id: number) {
    this.documentosExternos = [];
    this.formularioService.obtenerDocumentosAsociados(id).subscribe(res => {
      this.documentosExternos = res.map((doc:any) => doc.nU_IDDOCUMENTO_FORMXDOC);
    })
  }

  @ViewChild("errorSwal")
  public errorSwal!: SwalComponent;
  @ViewChild("swalFinalizado")
  public swalFinalizado!: SwalComponent;
  // Funci??n principal involucrada en el guardado
  guardarHistoriaClinica() {
    try {
      console.log($("#editor-indManejo").summernote("code"));
      const respuesta = this.validarHistoriaClinica();

      //Se la validan los dumentos que requieran validaci??n, si es invalido arroja una excepci??n
      this.validarDocumentos();
      
      // return;
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

      //Guardamoss la historia cl??nica seguida de los documentos
      this.formularioService.enviarHistoriaClinica(historiaClinica).subscribe(res => {
        const idHistoriaClinica = res.nU_IDHISTORIACLINICA_HC;
        console.log(res);
        this.guardarDocumentos(idHistoriaClinica);
        this.swalFinalizado.fire();
      })
    } catch (e) {
      this.errorSwal.swalOptions = {text: (<Error>e).message};
      this.errorSwal.fire()
    }
  }

  validarHistoriaClinica():any {
    if(!this.iFrame) throw new Error("Error en la lectura del formato");

    const respuesta:any[] = [];
    const form = this.iFrame.contentDocument?.forms[0];
    if(!form) throw new Error("Error al conseguir un formulario");;

    // if(!form.checkValidity()) throw new Error("El formulario no ha sido diligenciado correctamente, por favor, verifique e intente nuevamente");

    const formData:FormData = new FormData(form);
    const els = form.querySelectorAll<HTMLInputElement>("input[name]");

    // Revisamos el FormData
    formData.forEach((value, name) => {
      respuesta.push({name, value});
    });

    // Revisamos el valor de todos los elementos para asegurar el guardado
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

    return respuesta;
  }

  validarDocumentos() {
    const validInc:boolean = this.incapacidades.validarIncapacidades;

    if(!validInc && this.revisarDocumentoAsociado(3)) throw new Error("Las incapacidades han sido diligenciadas, pero no se ha llenado correctamente. Por favor, verifique y vuelva a intentar.");
  }

  guardarDocumentos(idHc: number) {
    const docExtMedicamentos:IHistClinPorDocExt = this.ordenesMedicas?.guardarOrdenesMedicas();
    const docExtIndManejos:IHistClinPorDocExt = this.guardarIndicacionDeManejo();
    const docExtIncapacidades: IHistClinPorDocExt = this.incapacidades?.incapacidades;

    const documentosExt:IHistClinPorDocExt[] = [docExtMedicamentos, docExtIndManejos, docExtIncapacidades];
    
    console.log(documentosExt);
    documentosExt
    .filter(doc => doc && this.revisarDocumentoAsociado(doc.nU_IDDOCEXTERNO_HCXDE))
    .forEach(doc => {
      doc.nU_IDHISTORIACLINICA_HCXDE = idHc;
      console.log(doc);
      // return

      this.formularioService.agregarDocumentoExterno(doc)
      .subscribe(res => console.log(res));
    })
  }

  guardarIndicacionDeManejo() {
    const indicaciones = $("#editor-indManejo").summernote("code");
    const estado = indicaciones === "<p><br></p>" ? 0 : 1;

    const guardado:IHistClinPorDocExt = {
      nU_ESTADO_HCXDE: estado,
      nU_IDHISTORIACLINICA_HCXDE: 0,
      nU_IDDOCEXTERNO_HCXDE: ID_INDIMANEJO,
      tX_INFODILIGENCIADA_HCXDE: indicaciones,
      nU_IDHCXDC_HCXDE: 0
    }

    return guardado;
  }

  revisarDocumentoAsociado(id: number): boolean {
    if(id === 0) return true;
    return this.documentosExternos.some(d => d === id);
  }

}
