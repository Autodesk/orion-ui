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

import React from 'react';

module.exports = function Nav() {
  const links = [
    { label: 'See All Components', url: '/storybook' },
    { label: 'GitHub', url: 'https://github.com/orion-ui/orion' },
  ];

  const linkNodes = links.map((link) => {
    return (
      <li key={link.label} className="fl">
        <a href={link.url} className="pl3">{link.label}</a>
      </li>
    )
  })

  return (
    <ul className="fr mt3">{linkNodes}</ul>
  );
}
