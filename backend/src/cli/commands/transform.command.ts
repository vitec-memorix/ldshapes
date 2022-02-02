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
    options: { dataSource: string; mapping: string; output: string },
  ): Promise<void> {
    this.transform(options);
  }

  @Option({
    flags: '-d --data-source <string>',
    description: 'The data you want transformed to RDF.',
  })
  parseDataSource(val: string) {
    return val;
  }

  @Option({
    flags: '-m --mapping <string>',
    description: 'The name of the mapping file.',
  })
  parseRml(val: string) {
    return val;
  }

  @Option({
    flags: '-o --output <string>',
    description: 'What the output file should be called.',
  })
  parseOutput(val: string) {
    return val;
  }

  transform = async (cliOptions) => {
    const mapping = path.join(
      __dirname,
      '../../../../resources/mappings/',
      cliOptions.mapping,
    );

    const output = path.join(
      __dirname,
      '../../../../resources/rdf/',
      cliOptions.output,
    );

    const options = {
      toRDF: false,
      functions: {
        createDescription: function (data) {
          const description =
            data[0] + ' ' + data[1] + ' is ' + data[2] + ' years old.';
          return description;
        },
        createFullName: function (data) {
          const fullName = data[1] + ', ' + data[0];
          return fullName;
        },
      },
    };

    const result = await parser
      .parseFile(mapping, output, options)
      .catch((err) => {
        console.log(err);
      });
    console.log(result);
  };
}
