import { Command, CommandRunner, Option } from 'nest-commander';
import * as parser from 'rocketrml';
import * as path from 'path';

@Command({
  name: 'transform',
  options: { isDefault: true },
})
export class TransformCommand implements CommandRunner {
  async run(
    inputs: string[],
    options: { mapping: string; output: string },
  ): Promise<void> {
    this.transform(options);
  }

  @Option({
    flags: '-m --mapping <string>',
    description: 'The name of the mapping file.',
  })
  parseMapping(val: string) {
    return path.join(__dirname, '../../../../resources/mappings/', val);
  }

  @Option({
    flags: '-o --output <string>',
    description: 'What the output file should be called.',
  })
  parseOutput(val: string) {
    return path.join(__dirname, '../../../../resources/rdf/', val);
  }

  transform = async (cliOptions) => {
    const options = {
      /*
      If you want n-quads instead of json as output,
      you need to define toRDF to true in the options parameter
      */
      toRDF: true,
      functions: {
        combineFields: function (data: string[]) {
          let combined = '';

          data.forEach((field: string) => {
            combined += ' ' + field;
          });

          return combined.trimStart();
        },
      },
    };

    const result = await parser
      .parseFile(cliOptions.mapping, cliOptions.output, options)
      .catch((err) => {
        console.log(err);
      });
    console.log(result);
  };
}
