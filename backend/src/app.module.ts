import { Module } from '@nestjs/common';
import { ShapeModule } from './shape/shape.module';
import { ConsoleModule } from 'nestjs-console';
import { FileService } from './file/file.service';

@Module({
  imports: [ConsoleModule, ShapeModule],
  controllers: [],
  providers: [FileService],
})
export class AppModule {}
