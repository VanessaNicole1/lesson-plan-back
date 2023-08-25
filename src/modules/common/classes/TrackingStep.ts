export class TrackingStep {
    id: number;
    name: string;
    status: string;
    description: string;
    date: string;
    icon: string;

    constructor(id: number, name: string, status: string, description: string, date: string, icon: string) {
        this.id = id;
        this.name = name;
        this.status = status;
        this.description = description;
        this.date = date;
        this.icon = icon;
    }
}
