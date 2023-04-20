export interface EmailStrategy {
  getData(): any;
  getTemplate(data: any);
  getSubject(): string;
}
