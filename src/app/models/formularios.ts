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