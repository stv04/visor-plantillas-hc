export interface IHistoriaSeleccionada {
    idHc?: number,
    lectura: boolean
}

export interface IFormSeleccionado extends IHistoriaSeleccionada{
    url: string,
    titulo: string,
    idForm: number
}

export interface IFormulario {
    nU_IDFORMULARIO_FORM: number;
    tX_NOMBREFORMULARIO_FORM: string;
    tX_JSON_FORM: string;
    tX_HTML_FORM: string;
    tX_CSS_FORM: string;
    tX_JS_FORM: string;
}

export interface IMostradorFormulario {
    nU_IDFORMULARIO_FORM: number;
    tX_NOMBREFORMULARIO_FORM: string;
    nU_PK_FMCD: number;
    tX_NOMBRE_FMCD?: string;
    nU_ATENCIONES_FORM: number;
    tX_PERIODO_FORM?: string;
    tX_TIPO_FORM?: string;
}

export interface IHistoriaClinica {
    nU_IDHISTORIACLINICA_HC:number,
    nU_IDAFILIADO_HC:number,
    nU_IDFORMULARIO_HC:number,
    fE_FECHA_HC:Date,

    nU_IDLABORATORIO_HC:number,
    nU_IDESPMEDICO_HC:number,
    nU_IDMEDICO_HC:number,
    nU_ESTADO_HC:number,

    tX_RESPUESTA_HC:string
}