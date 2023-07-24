import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import * as puppeteer from 'puppeteer';
import * as handlebars from 'handlebars';
import * as fs from 'fs';
import { PDFDocument } from 'pdf-lib';
import { generateUniqueIdentifier } from 'src/utils/number-generator.utils';

@Injectable()
export class ReportsService {
  getImageDataURI(imagePath) {
    const image = fs.readFileSync(imagePath);
    const base64Image = image.toString('base64');
    return `data:image/jpeg;base64,${base64Image}`;
  }

  getReportDataByLessonPlan = (lessonPlan) => {
    const {
      validationsTracking,
      schedule: { teacher, subject, grade },
    } = lessonPlan;

    return {
      unlImageURL: this.getImageDataURI('./reports/images/unl-black.png'),
      cisImageURL: this.getImageDataURI('./reports/images/cis.png'),
      subjectName: subject.name,
      code: 'E2C1A1/UNESCO: 1203.99',
      cicle: grade.number,
      parallel: `"${grade.parallel}"`,
      date: 'CLASE 1: 8 DE OCTUBRE DE 2019',
      teacherName: teacher.user.displayName,
      topic: lessonPlan.topic,
      bibContent: lessonPlan.bibliography,
      objectives:
        'Evaluar los conocimientos que tienen acerca de la Auditoria \n Determinar Conceptos básicos de la asigntatura y su campo de aplicación',
      results: lessonPlan.purposeOfClass,
      activities: lessonPlan.content,
      resources:
        'Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classica',
      evaluations:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec eget magna nulla. Mauris elementum odio ipsum',
      observations:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec eget magna nulla. Mauris elementum odio ipsum',
      students: validationsTracking.map((validationTracking) => ({
        displayName: validationTracking.student.user.displayName,
      })),
    };
  };

  async mergePDFs(pdfPaths, outputPath) {
    const mergedPdf = await PDFDocument.create();

    for (const pdfPath of pdfPaths) {
      const pdfBytes = await fs.promises.readFile(pdfPath);
      const pdf = await PDFDocument.load(pdfBytes);
      const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
      copiedPages.forEach((page) => mergedPdf.addPage(page));
    }

    const mergedPdfBytes = await mergedPdf.save();
    return mergedPdfBytes;
    await fs.promises.writeFile(outputPath, mergedPdfBytes);
  }

  async generateSingleLessonPlanReport(lessonPlan: any) {
    const templatePath = './reports/template.html';
    const template = fs.readFileSync(templatePath, 'utf-8');
    const compiledTemplate = handlebars.compile(template);

    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();

    const data = this.getReportDataByLessonPlan(lessonPlan);
    const renderedHTML = compiledTemplate(data);

    await page.setContent(renderedHTML, { waitUntil: 'domcontentloaded' });
    const reportPath = `${generateUniqueIdentifier()}.pdf`;
    await page.pdf({
      path: reportPath,
      format: 'A4',
      printBackground: true,
      landscape: true,
    });

    await browser.close();
    return reportPath;
  };

  async generateMultipleLessonPlanReport(lessonPlans: any[]) {
    try {
      const singleReporPaths = [];
      const templatePath = './reports/template.html';
      const template = fs.readFileSync(templatePath, 'utf-8');
      const compiledTemplate = handlebars.compile(template);

      const browser = await puppeteer.launch({ headless: 'new' });
      const page = await browser.newPage();

      for (let i = 0; i < lessonPlans.length; i++) {
        const data = this.getReportDataByLessonPlan(lessonPlans[i]);
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

      const outputPath = `${generateUniqueIdentifier()}-merged.pdf`;
      const file = await this.mergePDFs(singleReporPaths, outputPath);

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
}
