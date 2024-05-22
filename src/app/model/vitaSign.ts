import { Patient } from "./patient";

export class VitalSign {
    idSign: number;
    patient: Patient;
    date: string;
    temperature: string;
    pulse: string;
    rateRespiratory: string;
}