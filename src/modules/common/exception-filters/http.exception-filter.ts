import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const ctxResponse = ctx.getResponse<Response>();
    const rootResponse = exception.getResponse() as any;    
    const status = exception.getStatus();
    const { message } = rootResponse;
    let errorMessage = message;
    const regex = /(teachers|students)\.\d+\./

    if (typeof message !== 'string') {
      const entitiesErrors = [];
      
      message.forEach(errorMessage => {
        const studentNumber = parseInt(errorMessage.match(/\d+/)[0], 10) + 1;
        const entityIndex = entitiesErrors.findIndex(entityError => entityError.id === studentNumber);
        const cleanErrorMessage = `- ${errorMessage.replace(regex, '')}`;

        if (entityIndex !== -1) {
          entitiesErrors[entityIndex].errors.push(cleanErrorMessage);
        } else {
          entitiesErrors.push({
            id: studentNumber,
            errors: [cleanErrorMessage]
          })
        }
      });

      const formatedErrorMessage = entitiesErrors.map((entityError) => {
        return `En el registro ${entityError.id} se encontraron los siguientes errores: \n ${entityError.errors.join('\n')}`
      });
      
      errorMessage = formatedErrorMessage.join('\n');
    }

    ctxResponse
      .status(status)
      .json({
        statusCode: status,
        message: errorMessage
      });
  }
}
