@builtin "whitespace.ne"

@{% function flatten(list) {return list.reduce(function (acc, val) {return acc.concat((val && val.constructor === Array) ? flatten(val) : val);}, []);} %}

Element -> StartTag _ ChildElements _ EndTag {%
  (data, location, reject) => {
    const startTag = data[0][0];
    const attributes = data[0][1].reduce((acc, memo) => {
      acc[memo[0]] = memo[1];
      return acc;
    }, {});
    const children = data[2];
    const endTag = data[4];

    return {
      type: 'tag',
      name: startTag,
      attribs: attributes,
      children: children,
      startIndex: location
    }
  }
%}

ChildElements -> null
  | ChildElements Element {% id %}

StartTag -> "<" TagName Attributes _ ">" {%
  data => [ data[1], data[2] ]
%}

Attributes -> null
  | __ Attribute:* {% data => data[1] %}

Attribute -> BooleanAttribute {% id %}
  |  NumberAttribute {% id %}
  | StringAttribute {% id %}

BooleanAttribute -> AttributeName _ {%
  (data, location, reject) => {
    return [data[0], true];
  }
%}

NumberAttribute -> AttributeName "=" Int _ {%
  (data, location, reject) => {
    const name = data[0];
    const value = data[2];

    return [name, value];
  }
%}

StringAttribute -> AttributeName "=" StringValue _ {%
  data => [data[0], data[2]]
%}

StringValue -> "\"" _stringdouble "\"" {% data => data[1] %}

_stringdouble -> null
    | _stringdouble _stringdoublechar {% d => flatten(d).join('') %}

_stringdoublechar -> [^\\"] {% id %}
    | "\\"  [^\n] {% id %}

EndTag -> "</" TagName ">"

AttributeName -> [a-zA-Z]:+ {% d => flatten(d).join('').toLowerCase() %}

Int ->  [0-9]:+ {% data => parseInt(data.join('')) %}

TagName -> [a-zA-Z]:+ {% d => flatten(d).join('').toLowerCase() %}

