import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import {
  I18nContext,
} from 'nestjs-i18n';
import { Response } from 'express';
import { I18nValidationExceptionFilterOptions } from '../types/i18n-validation-ef-options.type';
import { formatI18nErrors, normalizeValidationErrors } from '../../../utils/i18n-exception-filter.utils';
import { CustomI18nValidationException } from '../exceptions/custom-i18n-validation.exception';

@Catch(CustomI18nValidationException)
export class CustomI18nValidationExceptionFilter implements ExceptionFilter {
  constructor(
    readonly options: I18nValidationExceptionFilterOptions = {
      detailedErrors: false,
    },
  ) {}

  catch(exception: CustomI18nValidationException, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<Response>();
    const i18n = I18nContext.current();
    const status = exception.getStatus();
    const errors = formatI18nErrors(exception.errors ?? [], i18n.service, {
      lang: i18n.lang,
    });

    const message = normalizeValidationErrors(this.options, errors);
    response.status(status).json({
      statusCode: status,
      message,
    });
  }
}
