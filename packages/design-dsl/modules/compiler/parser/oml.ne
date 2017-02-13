@builtin "whitespace.ne"

@{% function flatten(list) {return list.reduce(function (acc, val) {return acc.concat((val && val.constructor === Array) ? flatten(val) : val);}, []);} %}

RootElement -> _ Element _ {% data => data[1] %}

Element -> StartTag _ ChildElements _ EndTag {%
  (data, location, reject) => {
    const startTag = data[0].tagName;
    const attribs = data[0].attribs;
    const endTag = data[4];

    return {
      type: 'tag',
      name: startTag,
      attribs: attribs,
      children: [],
      startIndex: location
    }
  }
%}

ChildElements -> null

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

EndTag -> "</" TagName ">"
TagName -> Letter (LetterOrDigit):+ {% d => flatten(d).join('').toLowerCase() %}
AttributeName -> Letter (LetterOrDigit):+ {% d => flatten(d).join('').toLowerCase() %}

LetterOrDigit -> Letter {% id %}
  | Digit {% id %}

Letter -> [a-zA-Z]
Digit -> [0-9]

Attributes -> null
  | (__ Attribute {% data => data[1] %}):* {% id %}

Attribute -> BooleanAttribute {% id %}
  |  NumberAttribute {% id %}
#  | StringAttribute {% id %}

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

#StringAttribute -> AttributeName "=" StringValue _ {%
#  data => [data[0], data[2]]
#%}
#
#StringValue -> "\"" _stringdouble "\"" {% data => data[1] %}
#
#_stringdouble -> null
#    | _stringdouble _stringdoublechar {% d => flatten(d).join('') %}
#
#_stringdoublechar -> [^\\"] {% id %}
#    | "\\"  [^\n] {% id %}
#
#

#
#

