import { HttpStatus } from "@nestjs/common";

export interface I18nValidationExceptionFilterCommonErrorsOption {
  errorHttpStatusCode?: HttpStatus | number;
}
