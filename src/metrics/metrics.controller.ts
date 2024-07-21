import { Controller, Get, Res } from '@nestjs/common';
import { PrometheusController } from '@willsoto/nestjs-prometheus';
import { Public } from 'src/auth/auth.guard';

@Controller()
export class MetricsController extends PrometheusController {
    @Get()
    @Public()
    async index(@Res({ passthrough: true }) response: Response) {
      return super.index(response);
    }
}
