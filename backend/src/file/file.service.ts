import { Injectable } from '@nestjs/common';
import { dirname } from 'path';
import { Observable, of } from 'rxjs';

const util = require('util');

import * as fs from 'fs';

import path = require("path");

@Injectable()
export class FileService {
  constructor() {}

  public async GetFileListing(Directory?:string) {
    const basePath = this.getBasePath();
    const Results:Array<string> = new Array<string>();
    const readdir = util.promisify(fs.readdir);
    let files = await readdir(basePath + Directory);
    files.forEach(file => {
      if(['.ttl'].indexOf(path.extname(basePath + Directory + '/' + file)) !== -1) {
        Results.push(file);
      };
    });
    return Results;
  }

  public getBasePath(): string {
    return dirname(process.cwd()) + '/resources/';
  }
}
