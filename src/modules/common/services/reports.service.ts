import {
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import * as puppeteer from 'puppeteer';
import * as handlebars from 'handlebars';
import * as fs from 'fs';
import { PDFDocument } from 'pdf-lib';
import { generateUniqueIdentifier } from '../../../utils/number-generator.utils';
import { convertToSpanishDate } from '../../../utils/date.utils';

@Injectable()
export class ReportsService {
  getImageDataURI(imagePath) {
    const image = fs.readFileSync(imagePath);
    const base64Image = image.toString('base64');
    return `data:image/jpeg;base64,${base64Image}`;
  }

  getReportDataByLessonPlan = (lessonPlan, period) => {      
    const {
      validationsTracking,
      schedule: { teacher, subject, grade },
    } = lessonPlan;

    return {
      unlImageURL: this.getImageDataURI('./reports/images/unl-black.png'),
      cisImageURL: this.getImageDataURI('./reports/images/cis.png'),
      period: period.displayName,
      subjectName: subject.name,
      code: 'E2C1A1/UNESCO: 1203.99',
      cicle: grade.number,
      parallel: `"${grade.parallel}"`,
      date: convertToSpanishDate(new Date(lessonPlan.date)),
      teacherName: teacher.user.displayName,
      topic: lessonPlan.topic,
      bibContent: lessonPlan.bibliography,
      objectives: lessonPlan.purposeOfClass,
      results: lessonPlan.evaluation,
      activities: lessonPlan.content,
      resources: lessonPlan.materials,
      evaluations: lessonPlan.evaluation,
      observations: lessonPlan.comments,
      students: validationsTracking.map((validationTracking) => ({
        displayName: validationTracking.student.user.displayName,
      })),
    };
  };

  async mergePDFs(pdfPaths) {
    const mergedPdf = await PDFDocument.create();

    for (const pdfPath of pdfPaths) {
      const pdfBytes = await fs.promises.readFile(pdfPath);
      const pdf = await PDFDocument.load(pdfBytes);
      const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
      copiedPages.forEach((page) => mergedPdf.addPage(page));
    }

    const mergedPdfBytes = await mergedPdf.save();
    return mergedPdfBytes;
  }

  async generateMultipleLessonPlanReport(
    lessonPlans: any[],
    period: any,
    templateName: string = 'template.html',
    managerName: string = ''
  ) {
    try {
      const singleReporPaths = [];
      const templatePath = `./reports/${templateName}`;
      const template = fs.readFileSync(templatePath, 'utf-8');
      const compiledTemplate = handlebars.compile(template);

      const browser = await puppeteer.launch({ headless: 'new' });
      const page = await browser.newPage();

      for (let i = 0; i < lessonPlans.length; i++) {
        const data = {...this.getReportDataByLessonPlan(lessonPlans[i], period), managerName, lessonPlanNumber: i + 1 };
        const renderedHTML = compiledTemplate(data);

        await page.setContent(renderedHTML, { waitUntil: 'domcontentloaded' });
        const reportPath = `${generateUniqueIdentifier()}.pdf`;
        singleReporPaths.push(reportPath);
        await page.pdf({
          path: reportPath,
          format: 'A4',
          printBackground: true,
          landscape: true,
        });
      }

      await browser.close();

      const file = await this.mergePDFs(singleReporPaths);

      this.deleteFiles(singleReporPaths);

      return file;
    } catch (error) {
      console.warn('ERROR', error);
      throw new InternalServerErrorException('El reporte no pudo ser generado');
    }
  }

  deleteFiles(paths: string[]) {
    paths.forEach(path => fs.unlinkSync(path))
  }

  async generateLessonPlanReport(
    lessonPlan: any,
    period: any,
    templateName: string = 'template.html',
    managerName = ''
  ) {
    try {
      const singleReporPaths = [];
      const templatePath = `./reports/${templateName}`;
      const template = fs.readFileSync(templatePath, 'utf-8');
      const compiledTemplate = handlebars.compile(template);

      const browser = await puppeteer.launch({ headless: 'new' });
      const page = await browser.newPage();
      
      const data = {...this.getReportDataByLessonPlan(lessonPlan, period), managerName };
      const renderedHTML = compiledTemplate(data);

      await page.setContent(renderedHTML, { waitUntil: 'domcontentloaded' });
      const reportPath = `${generateUniqueIdentifier()}.pdf`;
      singleReporPaths.push(reportPath);
      await page.pdf({
        path: reportPath,
        format: 'A4',
        printBackground: true,
        landscape: true,
      });

      await browser.close();

      const file = await this.mergePDFs(singleReporPaths);

      this.deleteFiles(singleReporPaths);

      return file;
    } catch (error) {
      console.warn('ERROR', error);
      throw new InternalServerErrorException('El reporte no pudo ser generado');
    }
  }
}
