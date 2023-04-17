import { ValidationError } from "@nestjs/common";
import { CustomI18nValidationException } from "../modules/common/exceptions/custom-i18n-validation.exception";

export function validationErrorToI18n(e: ValidationError): ValidationError {
  return {
    property: e.property,
    children: e?.children?.map(validationErrorToI18n),
    constraints: !!e.constraints
      ? Object.keys(e.constraints).reduce((result, key) => {
          result[key] = e.constraints[key];
          return result;
        }, {})
      : {},
  };
}

export function i18nValidationErrorFactory(
  errors: ValidationError[],
): CustomI18nValidationException {
  return new CustomI18nValidationException(
    errors.map((e) => {
      return validationErrorToI18n(e);
    }),
  );
}
