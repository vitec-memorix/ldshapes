import { Module } from '@nestjs/common';
import { ShapeModule } from './shape/shape.module';
import { ConsoleModule } from 'nestjs-console';
import { FileService } from './file/file.service';
import { CliModule } from './cli/cli.module';

@Module({
  imports: [ConsoleModule, ShapeModule, CliModule],
  controllers: [],
  providers: [FileService],
})
export class AppModule {}
