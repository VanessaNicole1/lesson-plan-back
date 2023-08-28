import { BadRequestException, Injectable } from "@nestjs/common";
import { getCertificatesInfoFromPDF } from '@ninja-labs/verify-pdf';
import { SignatureInformation } from "../interfaces/signatureInformation";
import * as fs from "fs";

@Injectable()
export class DigitalSignService {
  validateDigitalSign(filePath: string): SignatureInformation[] {
    try {
      const signedPdfBuffer = fs.readFileSync(filePath);
      const pdfSignatures = getCertificatesInfoFromPDF(signedPdfBuffer);
      const signaturesData = pdfSignatures.map(([{ issuedTo: userInfo}]) => {
        return {
          signedBy: userInfo.commonName
        }
      });
      return signaturesData;  
    } catch (error) {
      throw new BadRequestException("No se encontró ninguna firma en el reporte");
    }
  }
}
