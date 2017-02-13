// Generated automatically by nearley
// http://github.com/Hardmath123/nearley
(function () {
function id(x) {return x[0]; }
 function flatten(list) {return list.reduce(function (acc, val) {return acc.concat((val && val.constructor === Array) ? flatten(val) : val);}, []);} var grammar = {
    ParserRules: [
    {"name": "_$ebnf$1", "symbols": []},
    {"name": "_$ebnf$1", "symbols": ["wschar", "_$ebnf$1"], "postprocess": function arrconcat(d) {return [d[0]].concat(d[1]);}},
    {"name": "_", "symbols": ["_$ebnf$1"], "postprocess": function(d) {return null;}},
    {"name": "__$ebnf$1", "symbols": ["wschar"]},
    {"name": "__$ebnf$1", "symbols": ["wschar", "__$ebnf$1"], "postprocess": function arrconcat(d) {return [d[0]].concat(d[1]);}},
    {"name": "__", "symbols": ["__$ebnf$1"], "postprocess": function(d) {return null;}},
    {"name": "wschar", "symbols": [/[ \t\n\v\f]/], "postprocess": id},
    {"name": "RootElement", "symbols": ["_", "Element", "_"], "postprocess": data => data[1]},
    {"name": "Element", "symbols": ["StartTag", "_", "ChildElements", "_", "EndTag"], "postprocess": 
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
        },
    {"name": "ChildElements", "symbols": []},
    {"name": "StartTag", "symbols": [{"literal":"<"}, "TagName", "Attributes", "_", {"literal":">"}], "postprocess": 
        data => {
          return {
            tagName: data[1],
            attribs: data[2].reduce((acc, memo) => {
              acc[memo[0]] = memo[1];
              return acc;
            }, {})
          }
        }
        },
    {"name": "EndTag$string$1", "symbols": [{"literal":"<"}, {"literal":"/"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "EndTag", "symbols": ["EndTag$string$1", "TagName", {"literal":">"}]},
    {"name": "TagName$ebnf$1$subexpression$1", "symbols": ["LetterOrDigit"]},
    {"name": "TagName$ebnf$1", "symbols": ["TagName$ebnf$1$subexpression$1"]},
    {"name": "TagName$ebnf$1$subexpression$2", "symbols": ["LetterOrDigit"]},
    {"name": "TagName$ebnf$1", "symbols": ["TagName$ebnf$1$subexpression$2", "TagName$ebnf$1"], "postprocess": function arrconcat(d) {return [d[0]].concat(d[1]);}},
    {"name": "TagName", "symbols": ["Letter", "TagName$ebnf$1"], "postprocess": d => flatten(d).join('').toLowerCase()},
    {"name": "AttributeName$ebnf$1$subexpression$1", "symbols": ["LetterOrDigit"]},
    {"name": "AttributeName$ebnf$1", "symbols": ["AttributeName$ebnf$1$subexpression$1"]},
    {"name": "AttributeName$ebnf$1$subexpression$2", "symbols": ["LetterOrDigit"]},
    {"name": "AttributeName$ebnf$1", "symbols": ["AttributeName$ebnf$1$subexpression$2", "AttributeName$ebnf$1"], "postprocess": function arrconcat(d) {return [d[0]].concat(d[1]);}},
    {"name": "AttributeName", "symbols": ["Letter", "AttributeName$ebnf$1"], "postprocess": d => flatten(d).join('').toLowerCase()},
    {"name": "LetterOrDigit", "symbols": ["Letter"], "postprocess": id},
    {"name": "LetterOrDigit", "symbols": ["Digit"], "postprocess": id},
    {"name": "Letter", "symbols": [/[a-zA-Z]/]},
    {"name": "Digit", "symbols": [/[0-9]/]},
    {"name": "Attributes", "symbols": []},
    {"name": "Attributes$ebnf$1", "symbols": []},
    {"name": "Attributes$ebnf$1$subexpression$1", "symbols": ["__", "Attribute"], "postprocess": data => data[1]},
    {"name": "Attributes$ebnf$1", "symbols": ["Attributes$ebnf$1$subexpression$1", "Attributes$ebnf$1"], "postprocess": function arrconcat(d) {return [d[0]].concat(d[1]);}},
    {"name": "Attributes", "symbols": ["Attributes$ebnf$1"], "postprocess": id},
    {"name": "Attribute", "symbols": ["BooleanAttribute"], "postprocess": id},
    {"name": "Attribute", "symbols": ["NumberAttribute"], "postprocess": id},
    {"name": "BooleanAttribute", "symbols": ["AttributeName"], "postprocess": 
        (data, location, reject) => {
          return [data[0], true];
        }
        },
    {"name": "NumberAttribute", "symbols": ["AttributeName", "_", {"literal":"="}, "_", "Int"], "postprocess": 
        (data, location, reject) => {
          const name = data[0];
          const value = data[4];
        
          return [name, value];
        }
        },
    {"name": "Int$ebnf$1", "symbols": ["Digit"]},
    {"name": "Int$ebnf$1", "symbols": ["Digit", "Int$ebnf$1"], "postprocess": function arrconcat(d) {return [d[0]].concat(d[1]);}},
    {"name": "Int", "symbols": ["Int$ebnf$1"], "postprocess": data => parseInt(data[0].join(''))}
]
  , ParserStart: "RootElement"
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.grammar = grammar;
}
})();
