import { HttpHeaders } from "@angular/common/http";

export interface IColDefinition {
    titulo: string,
    campo: string
}

export class IFlatNode {
    expandable!: boolean;
    name!: string;
    level!: number;
    pkPadre!: number;
    pk!: number;
    create?: boolean;
    idxForm?: number
}
  
export class IRiasTreeNode {
    name!: string;
    pk!: number;
    pkPadre!: number;
    idxForm?: number
    children?: IRiasTreeNode[]
}

export const headAppJson = new HttpHeaders({
    "Content-Type": "application/json"
});