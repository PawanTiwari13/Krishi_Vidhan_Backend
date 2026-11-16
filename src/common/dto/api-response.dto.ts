import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ApiErrorDetail {
  @ApiProperty({ example: 'VALIDATION_ERROR' })
  code!: string;

  @ApiProperty({
    oneOf: [{ type: 'string' }, { type: 'array', items: { type: 'string' } }],
  })
  details!: string | string[];
}

export class ApiResponse<T> {
  @ApiProperty({ example: true })
  success!: boolean;

  @ApiProperty({ example: 200 })
  statusCode!: number;

  @ApiPropertyOptional({ example: 'Operation completed successfully' })
  message?: string;

  @ApiPropertyOptional()
  data?: T;

  @ApiPropertyOptional({ type: ApiErrorDetail })
  error?: ApiErrorDetail;

  @ApiProperty({ example: '2026-11-16T22:50:00.000Z' })
  timestamp!: string;
}

