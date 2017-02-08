import * as path from 'path';

const Host = {
  basename: (filename: string) => {
    return path.basename(filename, '.oml');
  }
}

export default Host;