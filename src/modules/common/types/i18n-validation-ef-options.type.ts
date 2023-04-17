import { I18nValidationExceptionFilterErrorFormatterOption } from "../interfaces/i18n/i18n-validation-ef-error-formatter";
import { I18nValidationExceptionFilterDetailedErrorsOption } from "../interfaces/i18n/i18n-validation-ef-filter-detailed-errors";

export type I18nValidationExceptionFilterOptions =
  | I18nValidationExceptionFilterDetailedErrorsOption
  | I18nValidationExceptionFilterErrorFormatterOption;
