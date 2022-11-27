import { Guid } from "guid-typescript";

export class CalculationRequest {

    constructor() {
        this.RequestId = "3add7691-0fd5-0568-937e-6f51664ec007" + Math.floor(Math.random());

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
