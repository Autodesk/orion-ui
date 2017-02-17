@{% function flatten(list) {return list.reduce(function (acc, val) {return acc.concat((val && val.constructor === Array) ? flatten(val) : val);}, []);} %}

# TOKENS

@{%
var SELF_CLOSING_TAG = { test: x => x.type === 'start-tag' && x.selfClosing === true }
var START_TAG = { test: x => x.type === 'start-tag' }
var END_TAG = { test: x => x.type === 'end-tag' }
var WS = { test: x => x.type === 'character' && x.data.match(/\s/) }
var EOF = { test: x => x.type === 'eof' }

function handleSelfClosingTag(data, location, reject) {
  const startTag = data[0];

  const attribs = startTag.attributes.reduce((acc, memo) => {
    const key = memo.name;
    const value = (memo.value == "") ? true : JSON.parse(memo.value);

    acc[key] = value;

    return acc;
  }, {});

  return {
    type: 'tag',
    name: startTag.tagName,
    attribs: attribs,

    // Self closing tags cannot have block-params or children
    blockParameters: [],
    children: []
  }
}

function handleStandardTag(data, location, reject) {
  const startTag = data[0];
  const children = data[1];
  const endTag = data[2];

  if (startTag.tagName !== endTag.tagName) {
    return reject;
  }

  const attribs = startTag.attributes.reduce((acc, memo) => {
    const key = memo.name;
    const value = (memo.value == "") ? true : JSON.parse(memo.value);

    acc[key] = value;

    return acc;
  }, {});

  return {
    type: 'tag',
    name: startTag.tagName,
    attribs: attribs,
    blockParameters: startTag.blockParameters,
    children: children
  }
}

%}

# MAIN DOCUMENT

Document -> __ Element __ %EOF {% data => data[1] %}

# WHITESPACE

__ -> %WS:*

Element -> %SELF_CLOSING_TAG {% handleSelfClosingTag %}
  | %START_TAG Contents %END_TAG {% handleStandardTag %}

Contents -> (
      %WS {% d => [] %}
    | Element {% id %}
  ):* {% d => flatten(d) %}