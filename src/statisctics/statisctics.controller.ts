import { Controller, Get } from '@nestjs/common';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { CurrentUser } from 'src/auth/decorators/user.decorator';
import { StatiscticsService } from './statisctics.service';

@Controller('statisctics')
export class StatiscticsController {
  constructor(private readonly statiscticsService: StatiscticsService) {}

  @Get('main')
  @Auth()
  getMainStatisctics(@CurrentUser('id') id: number) {
    return this.statiscticsService.getMain(id);
  }
}
