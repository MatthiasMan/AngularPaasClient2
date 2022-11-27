import { Guid } from "guid-typescript";

export class CalculationRequest {

    constructor() {
        this.RequestId = Guid.create();

    }

    Height: number;
    Width: number;
    RequestId: Guid
    CalculationId: string
    XReminder: number;
    YReminder: number;
    MaxIterations: number;
    MaxBetrag: number;
    Step: number;
    Parts: number;
}
