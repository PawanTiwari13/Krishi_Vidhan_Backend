import 'reflect-metadata';
import { plainToInstance } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  Min,
  MinLength,
  validateSync,
} from 'class-validator';

export enum Environment {
  Development = 'development',
  Production = 'production',
  Test = 'test',
}

export class EnvironmentVariables {
  @IsEnum(Environment)
  @IsOptional()
  NODE_ENV: Environment = Environment.Development;

  @IsInt()
  @Min(1)
  @Max(65535)
  @IsOptional()
  PORT: number = 8080;

  @IsString()
  @IsNotEmpty()
  DATABASE_URL!: string;

  @IsString()
  @MinLength(32, {
    message: 'JWT_SECRET must be at least 32 characters long for HMAC-SHA256/512 security',
  })
  JWT_SECRET!: string;

  @IsString()
  @IsOptional()
  JWT_EXPIRES_IN: string = '7d';

  @IsString()
  @IsNotEmpty()
  FRONTEND_URL: string = 'http://localhost:3000';

  @IsString()
  @IsOptional()
  RAZORPAY_KEY_ID?: string;

  @IsString()
  @IsOptional()
  RAZORPAY_KEY_SECRET?: string;

  @IsString()
  @IsOptional()
  RAZORPAY_WEBHOOK_SECRET?: string;
}

export function validateEnvironment(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(
      `Environment variable validation failed:\n${errors
        .map((err) => Object.values(err.constraints || {}).join(', '))
        .join('\n')}`,
    );
  }

  return validatedConfig;
}

