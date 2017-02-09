import * as path from 'path';
import * as prettier from 'prettier';
import * as fs from 'fs';

import {IAtomDb} from './types';

const Host = {
  basename(filename: string) {
    return path.basename(filename, '.oml');
  },

  /**
   * Format the source nicely
   */
  format(source: string): string {
    return prettier.format(source);
  },

  getAtomDb(): IAtomDb {
    return JSON.parse(
      fs.readFileSync(
        path.join(__dirname, 'atoms.json')
      ).toString()
    );
  }
}

export default Host;





