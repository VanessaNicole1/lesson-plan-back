// @ts-nocheck
import { ArgumentsHost, Catch } from '@nestjs/common';
import { CustomI18nValidationException } from '../exceptions/custom-i18n-validation.exception';
import { CustomI18nValidationExceptionFilter } from './custom-i18n-validation-exception.filter';
import { I18nContext } from 'nestjs-i18n';
import { formatI18nErrors, normalizeValidationErrors } from '../../../utils/i18n-exception-filter.utils';
import { Response } from 'express';

@Catch(CustomI18nValidationException)
export class DtoArrayErrorExceptionFilter extends CustomI18nValidationExceptionFilter {

  constructor(private formatErrorRegex) {
    super();
  }

  catch(exception: CustomI18nValidationException, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<Response>();
    const i18n = I18nContext.current();
    const status = exception.getStatus();
    const errors = formatI18nErrors(exception.errors ?? [], i18n.service, {
      lang: i18n.lang,
    });
    const message = normalizeValidationErrors(this.options, errors) as string[];
    const entitiesErrors = [];
    const existRegexMatch = this.formatErrorRegex.test(message[0]);
    let errorMessage: string = message[0];

    if (existRegexMatch) {
      message.forEach(errorMessage => {
        const studentNumber = parseInt(errorMessage.match(/\d+/)[0], 10) + 1;
        const entityIndex = entitiesErrors.findIndex(entityError => entityError.id === studentNumber);
        const cleanErrorMessage = `- ${errorMessage.replace(this.formatErrorRegex, '')}`;
  
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
        const baseMessage = i18n.t(
          'common.ERROR_FOUND_IN_RECORD', 
          { 
            args: {
              recordNumber: entityError.id 
            }
          }
        );
      
        return `${baseMessage} \n ${entityError.errors.join('\n')}`;
      });

      errorMessage = formatedErrorMessage.join('\n');
    }
    
    response.status(status).json({
      statusCode: status,
      message: errorMessage,
    });
  }
}
