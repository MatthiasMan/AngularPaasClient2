import { Guid } from "guid-typescript";

export class CalculationRequest {

    constructor() {
        var l =  Guid.create();
        this.RequestId = l.toString();

    }

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
