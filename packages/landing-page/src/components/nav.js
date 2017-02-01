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
