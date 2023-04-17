import { ValidationError } from "@nestjs/common";
import { I18nValidationExceptionFilterCommonErrorsOption } from "./i18n-validation-ef-commom-errors";

export interface I18nValidationExceptionFilterErrorFormatterOption extends I18nValidationExceptionFilterCommonErrorsOption {
  errorFormatter?: (errors: ValidationError[]) => object;
}
