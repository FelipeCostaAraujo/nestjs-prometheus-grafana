import { Injectable } from '@nestjs/common';
import { InjectMetric } from '@willsoto/nestjs-prometheus';
import { Counter } from 'prom-client';

@Injectable()
export class AppService {
  constructor(@InjectMetric("hello_world") public counter: Counter<string>) {}
  getHello(): string {
    this.counter.inc();
    return 'Hello World!';
  }
}
