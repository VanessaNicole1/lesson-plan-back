import {
  ArgumentMetadata,
  ValidationPipe,
} from '@nestjs/common';
import { I18nContext } from 'nestjs-i18n';
import { I18nValidationPipeOptions } from '../types/i18n-validation-pipe-options.type';
import { i18nValidationErrorFactory } from '../../..//utils/i18n-validation-pipe.utils';

export class CustomI18nValidationPipe extends ValidationPipe {
  constructor(options?: I18nValidationPipeOptions) {
    super({
      ...options,
      exceptionFactory: i18nValidationErrorFactory,
    });
  }

  protected toValidate(metadata: ArgumentMetadata): boolean {
    const { metatype } = metadata;
    return metatype !== I18nContext && super.toValidate(metadata);
  }
}
