@{% function flatten(list) {return list.reduce(function (acc, val) {return acc.concat((val && val.constructor === Array) ? flatten(val) : val);}, []);} %}

# TOKENS

@{%
var START_TAG = { test: x => x.type === 'start-tag' }
var END_TAG = { test: x => x.type === 'end-tag' }
var WS = { test: x => x.type === 'character' && x.data.match(/\s/) }
var EOF = { test: x => x.type === 'eof' }
%}

# MAIN DOCUMENT

Document -> __ Element __ %EOF {% data => data[1] %}

# WHITESPACE

__ -> %WS:*

Element -> %START_TAG Contents %END_TAG {%
  (data, location, reject) => {
    const startTag = data[0];
    const children = data[1];
    const endTag = data[2];

    const attribs = startTag.attributes.reduce((acc, memo) => {
      const key = memo.name;
      const value = (memo.value == "") ? true : JSON.parse(memo.value);

      acc[key] = value;

      return acc;
    }, {});

    if (startTag.tagName !== endTag.tagName) {
      return reject;
    }

    return {
      type: 'tag',
      name: startTag.tagName,
      attribs: attribs,
      children: children
    }
  }
%}

Contents -> (
      %WS {% d => [] %}
    | Element {% id %}
  ):* {% d => flatten(d) %}