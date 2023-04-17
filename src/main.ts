import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CustomI18nValidationExceptionFilter } from './modules/common/exception-filters/custom-i18n-validation-exception.filter';
import { CustomI18nValidationPipe } from './modules/common/pipes/custom-i18n-validation.pipe';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalPipes(new CustomI18nValidationPipe());
  app.useGlobalFilters(new CustomI18nValidationExceptionFilter({ detailedErrors: false }));
  await app.listen(4000);
}
bootstrap();
