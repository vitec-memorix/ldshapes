import { Module } from '@nestjs/common';
import { ShapeModule } from './shape/shape.module';
import { FileModule } from './file/file.module';
import { ConsoleModule } from 'nestjs-console';
import { FileService } from './file/file.service';

@Module({
  imports: [ConsoleModule, ShapeModule, FileModule],
  controllers: [],
  providers: [FileService],
})
export class AppModule {}
