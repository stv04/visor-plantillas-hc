export interface IArchivo {
    tX_BASE64_ARCH: string;
    nU_IDTIPOARCHIVO_ARCH: number;
    }
      
    
export interface IAfiliado {
    cotizante: ICotizante;
    beneficiario: ICotizante[];
}
    
export interface IDeclaratoriasPorAfiliado {
    nU_IDDECAFIL_DECLAFIL: number;
    nU_RESPUESTAPREGUNTA: string;
}
    
export interface ICotizante {
    nU_IDAFILIADO_AFIL: number;
    nU_IDCOTIZANTE_AFIL: number;
    nU_TIPOSOLICITUD_AFIL: number;
    nU_IDDEPENDENCIA_DM: number;
    nU_TIPOAFILIADO_AFIL: number;
    nU_TELEFONO_AFIL: number;
    nU_EXTENSION_AFIL: number;
    nU_CELULAR_AFIL?: any;
    nU_CELULARDOS_AFIL?: any;
    nU_TELEMERGEN_AFIL: number;
    nU_CELUEMERGEN_AFIL: number;
    nU_DEPAREMERGEN_AFIL: number;
    nU_CIUDADEMERGEN_AFIL: number;
    nU_ZONAEMERGEN_AFIL: number;
    nU_LOCALIEMERGEN_AFIL: number;
    nU_BARRIOEMERGEN_AFIL: number;
    nU_ESTRATEMERGEN_AFIL: number;
    nU_DOCUMEMERGEN_AFIL: number;
    nU_DECLARASALUD_AFIL: number;
    nU_PROVISIONAL_AFIL: number;
    nU_IBC_AFIL: number;
    nU_BENEFICIARIOUN_AFIL: number;
    nU_BENEFIUNIFIC_AFIL: number;
    nU_BENEFIUPC_AFIL: number;
    nU_BENEFIDENPENDI_AFIL: number;
    nU_BENEFIEXCLU_AFIL: number;
    nU_BENEFIHIJO_AFIL: number;
    nU_BENEFIMATRI_AFIL: number;
    nU_ESTADO_AFIL: number;
    tX_FORMASOLICITUD_AFIL: string;
    tX_EMPLEADOR_AFIL: string;
    tX_SEDEUNAL_DM: string;
    tX_ORIENTACIONAFIL_AFIL: string;
    tX_NOMIDENTI_AFIL: string;
    tX_PRIMAPELLI_AFIL: string;
    tX_SEGAPELLI_AFIL?: any;
    tX_PRIMNOMBRE_AFIL: string;
    tX_SEGNOMBRE_AFIL?: any;
    tX_IDENTIFICACION_AFIL: string;
    tX_DIRECCION_AFIL: string;
    tX_COMPLDIRE_AFIL: string;
    tX_VEREDA_AFIL: string;
    tX_CORREOUNAL_AFIL: string;
    tX_CORREOALTER_AFIL: string;
    tX_NOMBREEMERGENCIA_AFIL: string;
    tX_DIREMERGEN_AFIL: string;
    tX_COMPLDIREMERGEN_AFIL: string;
    tX_VEREDAEMERGEN_AFIL: string;
    tX_ACTIVIECONOMICA_AFIL: string;
    tX_CARGOACTUAL_AFIL: string;
    tX_DEDICACION_AFIL: string;
    tX_PASS_AFIL: string;
    tX_OBSERVACIONESVALIDAR_AFIL: string;
    tX_OBSERVACIONESACEPTAR_AFIL: string;
    tX_OBSERVACIONESRECHAZAR_AFIL: string;
    tX_OBSERVACIONESAPROBAR_AFIL: string;
    tX_MOTIVORECHAZO_AFIL: number;
    fE_FECHAEXPEDICION_AFIL: Date;
    fE_FECHAVENCIMIENTO_AFIL: Date;
    fE_FECHANACIMIENTO_AFIL: Date;
    fE_FECHACREACION_AFIL: Date;
    fE_FECHASOLICITUD_AFIL: Date;
    fE_FECHAINICIOSER_AFIL: Date;
    nU_IDTIPOIDEN_TIPOIDEN: number;
    nU_IDGENERO_GENEROS: number | string;
    nU_IDNACIONALI_NACIONALI: number;
    nU_IDGRUPOET_GRUPOET: number;
    nU_IDGRUPOPOBLA_GRUPOPOBL: string;
    nU_IDESTACIV_ESTADOCIV: number;
    nU_IDTIPOSANGRE_TIPOSANGRE: number;
    nU_IDRH_RHS: number;
    nU_IDEPS_EPSS: number;
    nU_IDREGIMEN_REGIMEN: number;
    nU_IDESCOLARI_ESCOLARIDAD: number;
    nU_IDOCUPACION_OCUPACION: number;
    nU_IDDEPENDENC_DEPENDENC: number;
    nU_IDFONDPENSI_FONPENSI: number;
    nU_IDTIPODISCAPA_DISCA: string;
    nU_IDDEPARTAMENTO_DEPAR: number;
    nU_CIUDAD_CIUDAD: number;
    nU_IDZONA_ZONA: number;
    nU_IDLOCALIDAD_LOCALIDAD: number;
    nU_IDBARRIO_BARRIO: number;
    nU_IDESTRATO: number;
    nU_IDPARENTESCO_PARENTESCO: number;
    nU_IDEMPLEADOR_EMPLEADOR: number;
    nU_IDRELACIONBENE_RELACION: number;
    tX_NITEMP_AFIL?: any;
    tX_NOMRAZSOCEMP_AFIL?: any;
    declaratoriasPorAfiliados: IDeclaratoriasPorAfiliado[];
    archivos: IArchivo[];

    tX_NOMCONEAPB_AFIL?: number;
    tX_ADMINEAPB_AFIL?: number;
    nU_PENSIONADO_AFIL?: number;
    
}