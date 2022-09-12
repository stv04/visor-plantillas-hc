import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { SummernoteOptions } from 'ngx-summernote/lib/summernote-options';
import { IncapacidadesComponent } from '../incapacidades/incapacidades.component';
import { OrdenesMedicasComponent } from '../ordenes-medicas/ordenes-medicas.component';
import { IFormSeleccionado, IHistoriaClinica, IHistoriaSeleccionada } from '../../../interfaces/formularios';
import { IHistClinPorDocExt, ITempAudioria } from '../../../interfaces/historiaClinica';
import { AfiliadosService } from '../../../services/afiliados.service';
import { FormulariosService } from '../../../services/formularios.service';
import { combineLatest, Observable, tap } from 'rxjs';
import { IFormatoAuditoria } from 'src/app/interfaces/microServices';
import { DatePipe } from '@angular/common';
import { MicroServiciosService } from 'src/app/services/micro-servicios.service';

declare var $:any;
const ID_INDIMANEJO:number = 2;

@Component({
  selector: 'app-formatos',
  templateUrl: './formatos.component.html',
  styleUrls: ['./formatos.component.css']
})
export class FormatosComponent implements OnInit {

  @Input() sidebarOpen = false;
  private iFrame:HTMLIFrameElement|null = null
  private idDocumentosExternos: number[] = [];
  private documentosExternos:any = [];

  public ID_ORDENESMEDICAS:number = 1;
  public ID_INDICACIONESMANEJO:number = 2;
  public ID_INCAPACIDADES:number = 3;
  public ID_CONSENTIMIENTOSINFORMADOS:number = 4;

  public title:string = "";
  public idForm:number = 0;

  public lectura:boolean = false;

  public config:SummernoteOptions = {
    tabsize: 2,
    height: 200,
    toolbar: [
      ['style', ['bold', 'italic', 'underline', 'fontsize']]
    ],
  }

  private temporalesAud:ITempAudioria[] = [];

  @ViewChild(OrdenesMedicasComponent) private ordenesMedicas: any;
  @ViewChild(IncapacidadesComponent) private incapacidades!: IncapacidadesComponent;
  constructor(
    private formularioService: FormulariosService,
    private afilServ: AfiliadosService,
    private dp: DatePipe,
    private ms: MicroServiciosService
  ) {

  }

  ngOnInit(): void {
    this.initFormulario();
    this.cargarTemporales();
  }

  get indicacionesManejoDiligenciada():string {
    const documento = this.documentosExternos.find((doc:any) => doc.nU_IDDOCEXTERNO_HCXDE === ID_INDIMANEJO);

    if(documento) {
      const informacion = documento.tX_INFODILIGENCIADA_HCXDE;
      return informacion
    }

    return "";
  }

  get cargando():Boolean {
    return this.formularioService.cargando;
  }

  initFormulario():void {
    if(!this.iFrame) this.iFrame = document.querySelector("#iframe-visor");
    this.formularioService.selected.subscribe((res:IFormSeleccionado) => {
      if(res.url && this.iFrame) {
        this.iFrame.src = res.url;
      }

      if(!res.url) return;

      this.title = res.titulo;

      this.idDocumentosExternos = [];

      if(res.lectura && res.idHc) {
        this.buscarDocumentosDiligenciados(res.idHc);
      } else {
        this.buscarDocExt(res.idForm);
      }
      this.idForm = res.idForm;

      const formatoAtencion:HTMLLinkElement = document.querySelector<HTMLLinkElement>("#formatos-atencion-tab")!;
      if(formatoAtencion) formatoAtencion.click();

    })
  }

  cargarTemporales() {
    this.formularioService.temporalesAuditoria.subscribe(t => this.temporalesAud = t);
  }

  buscarDocExt(idForm: number) {
    this.lectura = false;
    this.formularioService.obtenerDocumentosAsociados(idForm).subscribe(res => {
      this.idDocumentosExternos = res.map((doc:any) => doc.nU_IDDOCUMENTO_FORMXDOC);
    })
  }

  buscarDocumentosDiligenciados(idHc: number) {
    this.lectura = true;
    this.formularioService.getDocumentosDiligenciados(idHc).subscribe(observer => {
      console.log(observer);
      this.idDocumentosExternos = observer.map((doc:any) => doc.nU_IDDOCEXTERNO_HCXDE);
      this.documentosExternos = observer;
      console.log(this.idDocumentosExternos);
    })
  }

  generarTemporal = (hc:IHistoriaClinica) => {
    let temporalFormulario = this.temporalesAud.find(t => t.nU_IDFORMULARIO_FORM === this.idForm);
    const formulario = this.formularioService.allFormsFinded.find(f => f.nU_IDFORMULARIO_FORM === this.idForm);
    const observadores:any = [];
    
    if(!formulario) {
      console.warn("no se encuenra el formulario para asociar el temporal ( error desconocido )");
      return;
    }

    console.log(formulario);

    const maxSesiones = formulario.nU_ATENCIONES_FORM;

    if(!temporalFormulario) {
      temporalFormulario = {
        nU_PK_TPAUDHC: 0,
        nU_IDFORMULARIO_FORM: this.idForm,
        nU_ESTADOACTUAL_TPAUDHC: maxSesiones,
      }
    }

    temporalFormulario.nU_ESTADOACTUAL_TPAUDHC --;
    
    let formatoAud:IFormatoAuditoria|undefined;
    if(maxSesiones && temporalFormulario.nU_ESTADOACTUAL_TPAUDHC < 0) {
      temporalFormulario.nU_ESTADOACTUAL_TPAUDHC = maxSesiones;
      console.warn("Aquí se debería guardar en auditoria");
      const {tX_PRIMNOMBRE_AFIL, tX_PRIMAPELLI_AFIL, tX_SEGNOMBRE_AFIL, tX_SEGAPELLI_AFIL} = this.afilServ.afiliado;
      formatoAud = {
        nU_FORMATOCD_AUDCDHC: formulario.nU_PK_FMCD, // pk formato de auditoria
        nU_IDHISTCLINIC_AUDCDHC: hc.nU_IDHISTORIACLINICA_HC, // id de la historia clínica
        cL_HISTORIACLINICA_AUDCDHC: hc.tX_RESPUESTA_HC, // respuesta de historia clínica
        tX_PERIODO_AUDCDHC: formulario.tX_PERIODO_FORM || "", // cantidad de atenciones (Crear campo periodo auditoría)
        nU_IDPROFMED_AUDCDHC: 123, // id profesional
        fE_FECHAENVIO_AUDCDHC: this.dp.transform(new Date(), "yyyy-MM-ddTHH:mm:ss") || new Date(), // fecha actual
        tX_PROFMED_AUDCDHC: "Profesional", // nombre del profesional
        nU_IDAFILIADO_AFIL: this.afilServ.afiliado.nU_IDAFILIADO_AFIL, // id del afiliado
        tX_IDENTIFICACION_AFIL: this.afilServ.afiliado.tX_IDENTIFICACION_AFIL, // documento de identificación dle afiliado
        tX_NOMBREAFIL_AUDCDHC: tX_PRIMNOMBRE_AFIL + " " + tX_PRIMAPELLI_AFIL, // nombre del afiliado
      }
    }

    observadores.push(this.formularioService.postTemporalAuditoria(temporalFormulario));

    console.log(formatoAud);
    if(formatoAud) observadores.push(this.ms.postAuditarHc(formatoAud));

    // return;
    combineLatest(observadores).subscribe(res => {
      this.cargarTemporales();
      console.log(res);
    });


    

    console.log(temporalFormulario);
  }

  @ViewChild("errorSwal")
  public errorSwal!: SwalComponent;
  @ViewChild("swalFinalizado")
  public swalFinalizado!: SwalComponent;
  // Función principal involucrada en el guardado
  guardarHistoriaClinica() {
    try {
      console.log($("#editor-indManejo").summernote("code"));
      const respuesta = this.validarHistoriaClinica();

      //Se la validan los dumentos que requieran validación, si es invalido arroja una excepción
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

      // this.generarTemporal(historiaClinica);
      // return;

      //Guardamoss la historia clínica seguida de los documentos
      this.formularioService.enviarHistoriaClinica(historiaClinica)
      .pipe(tap(this.generarTemporal))
      .subscribe(res => {
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
    const dom = this.iFrame.contentDocument
    const form = dom?.forms[0];
    if(!form || !dom) throw new Error("Error al conseguir un formulario");

    form.onsubmit = e => e.preventDefault();

    form.requestSubmit();

    // if(!form.checkValidity()) throw new Error("El formulario no ha sido diligenciado correctamente, por favor, verifique e intente nuevamente");

    const formData:FormData = new FormData(form);
    const els = dom.querySelectorAll<HTMLInputElement>("[name]");

    // Revisamos el FormData
    formData.forEach((value, name) => {
      respuesta.push({name, value});
    });

    const errores: string[] =[];

    // Revisamos el valor de todos los elementos para asegurar el guardado
    els.forEach((el:HTMLInputElement) => {
      el.classList.remove("border-danger");
      const name = el.getAttribute("name");
      const exists = respuesta.some(v => v.name === name);

      console.log(el.checkValidity())
      
      if(!el.checkValidity()) {
        errores.push("Falta llenar el campo " + el.name);
        el.title = el.validationMessage;
        el.classList.add("border-danger");
      }

      if(exists) return;
      
      const respIndividual = {
        name,
        value: el.value
      }

      respuesta.push(respIndividual);
    });

    console.log(errores);

    if(errores.length) throw new Error("Validar el formulario llenado.");

    return respuesta;
  }

  validarDocumentos() {
    const validInc:boolean = this.incapacidades?.validarIncapacidades;

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
    return this.idDocumentosExternos.some(d => d === id);
  }

  informacionDiligenciada(id: number) {
    const documento = this.documentosExternos.find((doc:any) => doc.nU_IDDOCEXTERNO_HCXDE === id);

    if(documento) {
      const informacion = JSON.parse(documento.tX_INFODILIGENCIADA_HCXDE);
      return informacion
    }

    return null;
  }
}
