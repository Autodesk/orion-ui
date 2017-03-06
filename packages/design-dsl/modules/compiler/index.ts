import Parser from './parser';
import Generator from './generator';

export interface CompilerOptions {
  source: string;
  filename: string;
}

export default function compiler(options: CompilerOptions): string {
  const generator = new Generator();
  const parser = new Parser();

  const ast = parser.parse(options.source)

  return generator.generate(options.filename, ast);
}