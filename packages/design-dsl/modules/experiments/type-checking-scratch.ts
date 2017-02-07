import * as ts from 'typescript';

// How can we determine the type of label below?

// Given this source
const omlSrc = `
<orion => Alert>
  <component => label>
    <Alert label={label} />
  </component>
</orion>
`

// label is applied to in Alert#label... what type is that?

// Sample transpiled Alert.oml > Alert.js
const Alert = `
  import * as o from 'orion-primitives';

  export default ({ label }) => [
    o.container({ background: 'red' }, () => [
      o.label({ text: label })
    ]);
  ]);
`

// Alert#label is used in o.label#text... what type is that?

interface ContainerProps {
  background: 'red' | 'black';
}

interface LabelProps {
  text: string; // It's a string... therefore the initial type is a string
}

// We can bottom-out on primitives which are written with TypeScript interfaces
// then back-up to the component and generate an interface before compiling

// If we transform our tokens to a the following source
const source = `
  import Alert from './Alert.oml';

  export default ({ label }) => [
    Alert({ label: label })
  ];
`;

// We can feed it to the TypeScript compiler to get type checking
// https://github.com/Microsoft/TypeScript/wiki/Using-the-Compiler-API

/**
 * High level tasks to get type checking
 *
 * - implement tree construction after tokenizer
 * - implement typescript-generate which takes the tree and generates the format above
 * - implement a custom TypeScript compiler host which overrides
 *   - module resolution, we want to avoid having the module resolver talk to the filesystem
 * - write interfaces for the standard orion-primitives
 *   - structural elements will probably have static interfaces
 *   - drawable element interfaces will be generated based on the supported values
 *     in the design system - generateInterface(designSystem)
 * - implement generateInterface(oml) which generates a TypeScript interface from an
 *   OML component definition (using primitives to infer types)
 * - Create a TypeScript program using ts.createProgram which understands the scope
 *   of the source file, it's dependencies, and the primitives
 * - Use the type checker to validate the OML component
 */

const sourceFile = ts.createSourceFile('somefile.ts', source, ts.ScriptTarget.ES2015, /*setParentNodes*/ true);

function visit(node: ts.Node) {
  console.log(node);
  const exported = isNodeExported(node);

  ts.forEachChild(node, visit);
}

function isNodeExported(node: ts.Node): boolean {
  let exported = (node.flags & ts.NodeFlags.ExportContext) !== 0 || node.parent && node.parent.kind === ts.SyntaxKind.SourceFile;

  if (exported) {
    return true;
  } {
    return false;
  }
}


visit(sourceFile);
