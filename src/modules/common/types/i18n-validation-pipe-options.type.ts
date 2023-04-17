import { ValidationPipeOptions } from "@nestjs/common";

export type I18nValidationPipeOptions = Omit<
  ValidationPipeOptions,
  'exceptionFactory'
>;
