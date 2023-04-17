import { iterate } from 'iterare';
import { ValidationError } from '@nestjs/common';
import { I18nService, I18nValidationError, Path, TranslateOptions } from 'nestjs-i18n';
import { I18nValidationExceptionFilterErrorFormatterOption } from '../modules/common/interfaces/i18n/i18n-validation-ef-error-formatter';
import { I18nValidationExceptionFilterOptions } from '../modules/common/types/i18n-validation-ef-options.type';

export function isWithErrorFormatter(
  options: I18nValidationExceptionFilterOptions,
): options is I18nValidationExceptionFilterErrorFormatterOption {
  return 'errorFormatter' in options;
}

export function normalizeValidationErrors(
  options: I18nValidationExceptionFilterOptions,
  validationErrors: ValidationError[],
): string[] | I18nValidationError[] | object {
  if (isWithErrorFormatter(options) && !('detailedErrors' in options))
    return options.errorFormatter(validationErrors);

  if (!isWithErrorFormatter(options) && !options.detailedErrors)
    return flattenValidationErrors(validationErrors);

  return validationErrors;
}

export function flattenValidationErrors(
  validationErrors: ValidationError[],
): string[] {
  return iterate(validationErrors)
    .map((error) => mapChildrenToValidationErrors(error))
    .flatten()
    .filter((item) => !!item.constraints)
    .map((item) => Object.values(item.constraints))
    .flatten()
    .toArray();
}

export const mapChildrenToValidationErrors = (
  error: ValidationError,
  parentPath?: string,
): ValidationError[] => {
  if (!(error.children && error.children.length)) {
    return [error];
  }
  const validationErrors = [];
  parentPath = parentPath ? `${parentPath}.${error.property}` : error.property;
  for (const item of error.children) {
    if (item.children && item.children.length) {
      validationErrors.push(...mapChildrenToValidationErrors(item, parentPath));
    }
    validationErrors.push(prependConstraintsWithParentProp(parentPath, item));
  }
  return validationErrors;
};

export const prependConstraintsWithParentProp = (
  parentPath: string,
  error: ValidationError,
): ValidationError => {
  const constraints = {};
  for (const key in error.constraints) {
    constraints[key] = `${parentPath}.${error.constraints[key]}`;
  }
  return {
    ...error,
    constraints,
  };
};

export function formatI18nErrors<K = Record<string, unknown>>(
  errors: I18nValidationError[],
  i18n: I18nService<K>,
  options?: TranslateOptions,
): I18nValidationError[] {
  return errors.map((error) => {
    error.children = formatI18nErrors(error.children ?? [], i18n, options);
    error.constraints = Object.keys(error.constraints).reduce((result, key) => {
      const [translationKey, argsString] = error.constraints[key].split('|');
      const args = !!argsString ? JSON.parse(argsString) : {};
      result[key] = i18n.translate(translationKey as Path<K>, {
        ...options,
        args: { property: error.property, ...args },
      });
      return result;
    }, {});
    return error;
  });
}
