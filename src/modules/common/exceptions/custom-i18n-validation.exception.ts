// @ts-nocheck
import { HttpException, HttpStatus, ValidationError } from '@nestjs/common';

export class CustomI18nValidationException extends HttpException {
  constructor(public errors: ValidationError[]) {
    super(errors, HttpStatus.BAD_REQUEST);
  }
}
