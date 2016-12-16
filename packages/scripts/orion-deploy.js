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

const knownPaths = require('./modules/known-paths');
const deployConfig = require('./modules/deploy-config');
const program = require('commander');
const s3 = require('s3');

program
  .description('deploy build directory')
  .option('--build-id <id>', 'Unique build id')
  .parse(process.argv);

if (!program.buildId) {
  console.error('Error missing buildId');
  program.outputHelp();
}

// Upload the root build
const localDir = knownPaths.build;

// To the cdn.web-platform.io
const s3Params = {
  Bucket: deployConfig.Bucket,
  Prefix: deployConfig.SnapshotPrefix(program.buildId),
};


const client = s3.createClient();
const uploader = client.uploadDir({ localDir, s3Params });

uploader.on('error', (err) => {
  console.error(err);
  process.exit(1);
});

uploader.on('fileUploadEnd', localFilePath => console.log(`> ${localFilePath}`));

uploader.on('end', () => {
  console.log(`Uploaded to https://${s3Params.Bucket}/${s3Params.Prefix}`);
});
