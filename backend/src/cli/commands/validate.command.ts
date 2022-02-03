import { Command, CommandRunner, Option } from 'nest-commander';
import * as SHACLValidator from 'rdf-validate-shacl';
import * as ParserN3 from '@rdfjs/parser-n3';
import * as factory from 'rdf-ext';
import * as path from 'path';
import * as fs from 'fs';

@Command({
  name: 'validate',
  options: { isDefault: true },
})
export class ValidateCommand implements CommandRunner {
  async run(
    inputs: string[],
    options: { rdf: string; shape: string },
  ): Promise<void> {
    this.validate(options);
  }

  @Option({
    flags: '-r --rdf <string>',
    description: 'The RDF graphs you want to validate.',
  })
  parseRdf(val: string) {
    return path.join(__dirname, '../../../../resources/rdf/', val);
  }

  @Option({
    flags: '-s --shape <string>',
    description: 'The shape you want to validate your rdf graphs with.',
  })
  parseShape(val: string) {
    return path.join(__dirname, '../../../../resources/shapes/', val);
  }

  loadDataset = async (shapesFile) => {
    const stream = fs.createReadStream(shapesFile);
    const parser = new ParserN3({ factory });
    return factory.dataset().import(parser.import(stream));
  };

  validate = async (options) => {
    const shapes = await this.loadDataset(options.shape);
    const data = await this.loadDataset(options.rdf);

    const validator = new SHACLValidator(shapes, { factory });
    const report = await validator.validate(data);

    console.log(report.conforms);

    for (const result of report.results) {
      // See https://www.w3.org/TR/shacl/#results-validation-result for details
      // about each property
      console.log(result.message);
      console.log(result.path);
      console.log(result.focusNode);
      console.log(result.severity);
      console.log(result.sourceConstraintComponent);
      console.log(result.sourceShape);
    }

    // Validation report as RDF dataset
    console.log(report.dataset);
  };
}
