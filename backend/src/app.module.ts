import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ShapeModule } from './shape/shape.module';
import { ConsoleModule } from 'nestjs-console';
import { FileService } from './file/file.service';


@Module({
  imports: [
	ConsoleModule,
    ShapeModule,
  ],
  controllers: [AppController],
  providers: [AppService, FileService],
})
export class AppModule {}
