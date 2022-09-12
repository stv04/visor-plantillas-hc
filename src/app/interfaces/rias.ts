export interface IRias {
    nU_PK_RIAS: number;
    tX_TIPOATENCION_RIAS: string;
    tX_ATENCION_RIAS: string;
    nU_PADREATENCION_RIAS: number;
    nU_PK_TIPRIA: number;
}

export interface IGrupoEtareo {
    nU_PK_GRET: number;
    tX_NOMBRE_GRET: string;
    tX_GENERO_GRET: string;
    nU_EDADINICIAL_GRET: number;
    nU_EDADFINAL_GRET: number;
    nU_UNIDADMEDIDA_GRET: number;
    tX_AUTOMATICO_GRET: number;
}

export interface IGrupEtPorRias {
    nU_PK_GRERI: number;
    nU_PK_RIAS: number;
    nU_PK_GRET: number;
}

export interface IGrupEtPorRiasVisual extends IGrupEtPorRias{
    tX_TIPOATENCION_RIAS?: string;
    tX_ATENCION_RIAS?: string;
    tX_NOMBRE_GRET?: string;
}