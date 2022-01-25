import { Injectable } from '@nestjs/common';
import { dirname } from 'path';
import * as util from 'util';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class FileService {
  public async GetFileListing(Directory?: string) {
    const basePath = this.getBasePath();
    const Results: Array<string> = new Array<string>();
    const readdir = util.promisify(fs.readdir);
    const files = await readdir(basePath + Directory);
    files.forEach((file) => {
      if (
        ['.ttl'].indexOf(path.extname(basePath + Directory + '/' + file)) !== -1
      ) {
        Results.push(file);
      }
    });
    return Results;
  }

  public getBasePath(): string {
    return dirname(process.cwd()) + '/resources/';
  }
}
