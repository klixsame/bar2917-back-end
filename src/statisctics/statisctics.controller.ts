import { Controller, Get } from '@nestjs/common';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { StatiscticsService } from './statisctics.service';

@Controller('statistics')
export class StatiscticsController {
  constructor(private readonly statiscticsService: StatiscticsService) {}

  @Get('main')
  @Auth('admin')
  getMainStatisctics() {
    return this.statiscticsService.getMain();
  }
}
