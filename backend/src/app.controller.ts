import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  constructor() {}

  @Get()
  backendCheck(): string {
    return 'Working fine';
  }
}
