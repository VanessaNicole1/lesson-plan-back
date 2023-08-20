export class TrackingStep {
    id: string;
    name: string;
    status: string;
    date: Date;

    constructor(id: string, name: string, status: string, date: Date) {
        this.id = id;
        this.name = name;
        this.status = status;
        this.date = date;
    }
}