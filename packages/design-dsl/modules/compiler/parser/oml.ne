@builtin "whitespace.ne"
@{% function flatten(list) {return list.reduce(function (acc, val) {return acc.concat((val && val.constructor === Array) ? flatten(val) : val);}, []);} %}

RootElement -> _ Element _ {% data => data[1] %}

Element -> StartTag ChildElements EndTag {%
  (data, location, reject) => {
    const startTag = data[0].tagName;
    const attribs = data[0].attribs;
    const children = data[1];
    const endTag = data[2];

    if (startTag !== endTag) {
      return reject;
    }

    return {
      type: 'tag',
      name: startTag,
      attribs: attribs,
      children: children || [],
      startIndex: location
    }
  }
%}

StartTag -> "<" TagName Attributes _ ">" {%
  data => {
    return {
      tagName: data[1],
      attribs: data[2].reduce((acc, memo) => {
        acc[memo[0]] = memo[1];
        return acc;
      }, {})
    }
  }
%}

ChildElements -> null
  | ChildElements __ {% id %}
  | ChildElements Element {%
  (data) => {
    const rest = data[0] || [];
    const next = data[1];
    return rest.concat(next);
  }
%}

_ChildElements -> null
  | Element {% id %}
  | ChildElements _ Element {% d => flatten([d[0], d[2]]) %}

EndTag -> "</" TagName _ ">" {% d => d[1] %}
TagName -> Letter (LetterOrDigit):* {% d => flatten(d).join('').toLowerCase() %}

AttributeName -> Letter (LetterOrDigit):* {% d => flatten(d).join('').toLowerCase() %}

LetterOrDigit -> Letter {% id %}
  | Digit {% id %}

Letter -> [a-zA-Z]
Digit -> [0-9]

Attributes -> (__ Attribute {% data => data[1] %}):* {% id %}

Attribute -> BooleanAttribute {% id %}
  | NumberAttribute {% id %}
  | StringAttribute {% id %}

BooleanAttribute -> AttributeName {%
  (data, location, reject) => {
    return [data[0], true];
  }
%}

NumberAttribute -> AttributeName _ "=" _ Int {%
  (data, location, reject) => {
    const name = data[0];
    const value = data[4];

    return [name, value];
  }
%}

Int -> Digit:+ {% data => parseInt(data[0].join('')) %}

StringAttribute -> AttributeName _ "=" _ StringValue {%
  data => [data[0], data[4]]
%}

StringValue -> "\"" _stringdouble "\"" {% data => data[1] %}

_stringdouble -> null
  | _stringdouble _stringdoublechar {% d => flatten(d).join('') %}

_stringdoublechar -> [^\\"] {% id %}
  | "\\"  [^\n] {% id %}