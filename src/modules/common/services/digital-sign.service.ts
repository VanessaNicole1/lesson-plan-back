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
      fs.unlinkSync(filePath);
      return signaturesData;  
    } catch (error) {
      throw new BadRequestException("No se encontraron nuevas firmas en el reporte");
    }
  }
}
