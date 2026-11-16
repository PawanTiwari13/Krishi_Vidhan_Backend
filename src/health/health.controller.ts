import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from '../common/decorators/public.decorator';
import { PrismaService } from '../database/prisma.service';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(private readonly prisma: PrismaService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Verify API and PostgreSQL database connectivity' })
  async checkHealth() {
    await this.prisma.$queryRaw`SELECT 1`;
    return {
      status: 'UP',
      service: 'Krishi Vidhan API Gateway',
      database: 'CONNECTED',
      timestamp: new Date().toISOString(),
    };
  }
}

