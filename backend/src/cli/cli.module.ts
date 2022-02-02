import { Module } from '@nestjs/common';
import { TransformCommand } from './commands/transform.command';
import { ValidateCommand } from './commands/validate.command';

@Module({ providers: [TransformCommand, ValidateCommand] })
export class CliModule {}
