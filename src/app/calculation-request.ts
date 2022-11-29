import { Guid } from "guid-typescript";

export class CalculationRequest {

    constructor() { }

    Height: number;
    Width: number;
    RequestId: string
    CalculationId: string
    XReminder: number;
    YReminder: number;
    MaxIterations: number;
    MaxBetrag: number;
    Step: number;
    Parts: number;
}
