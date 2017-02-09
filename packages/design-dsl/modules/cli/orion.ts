#!/usr/bin/env node
/**
Copyright 2016 Autodesk,Inc.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

*/

import * as program from 'commander';
import * as fs from 'fs';
import * as path from 'path';

import compile from '../compiler';

export default function cli(argv: string[]): void {
  program
    .command('compile <file>')
    .description('compiles an OML file to JavaScript')
    .action((file: string) => {
      const source = path.join(process.cwd(), file);

      // const results = compile(
        // fs.readFileSync(source).toString()
      // )

      console.log('TODO');
    });

  program.parse(process.argv);
}