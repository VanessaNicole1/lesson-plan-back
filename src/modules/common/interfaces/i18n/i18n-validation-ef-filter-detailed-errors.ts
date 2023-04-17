import { I18nValidationExceptionFilterCommonErrorsOption } from "./i18n-validation-ef-commom-errors";

export interface I18nValidationExceptionFilterDetailedErrorsOption
  extends I18nValidationExceptionFilterCommonErrorsOption {
  detailedErrors?: boolean;
}
