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
    {"name": "Element", "symbols": ["StartTag", "_", "ChildElements", "_", "EndTag"], "postprocess": 
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
        },
    {"name": "ChildElements", "symbols": []},
    {"name": "ChildElements", "symbols": ["ChildElements", "Element"], "postprocess": id},
    {"name": "StartTag", "symbols": [{"literal":"<"}, "TagName", "Attributes", "_", {"literal":">"}], "postprocess": 
        data => [ data[1], data[2] ]
        },
    {"name": "Attributes", "symbols": []},
    {"name": "Attributes$ebnf$1", "symbols": []},
    {"name": "Attributes$ebnf$1", "symbols": ["Attribute", "Attributes$ebnf$1"], "postprocess": function arrconcat(d) {return [d[0]].concat(d[1]);}},
    {"name": "Attributes", "symbols": ["__", "Attributes$ebnf$1"], "postprocess": data => data[1]},
    {"name": "Attribute", "symbols": ["BooleanAttribute"], "postprocess": id},
    {"name": "Attribute", "symbols": ["NumberAttribute"], "postprocess": id},
    {"name": "Attribute", "symbols": ["StringAttribute"], "postprocess": id},
    {"name": "BooleanAttribute", "symbols": ["AttributeName", "_"], "postprocess": 
        (data, location, reject) => {
          return [data[0], true];
        }
        },
    {"name": "NumberAttribute", "symbols": ["AttributeName", {"literal":"="}, "Int", "_"], "postprocess": 
        (data, location, reject) => {
          const name = data[0];
          const value = data[2];
        
          return [name, value];
        }
        },
    {"name": "StringAttribute", "symbols": ["AttributeName", {"literal":"="}, "StringValue", "_"], "postprocess": 
        data => [data[0], data[2]]
        },
    {"name": "StringValue", "symbols": [{"literal":"\""}, "_stringdouble", {"literal":"\""}], "postprocess": data => data[1]},
    {"name": "_stringdouble", "symbols": []},
    {"name": "_stringdouble", "symbols": ["_stringdouble", "_stringdoublechar"], "postprocess": d => flatten(d).join('')},
    {"name": "_stringdoublechar", "symbols": [/[^\\"]/], "postprocess": id},
    {"name": "_stringdoublechar", "symbols": [{"literal":"\\"}, /[^\n]/], "postprocess": id},
    {"name": "EndTag$string$1", "symbols": [{"literal":"<"}, {"literal":"/"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "EndTag", "symbols": ["EndTag$string$1", "TagName", {"literal":">"}]},
    {"name": "AttributeName$ebnf$1", "symbols": [/[a-zA-Z]/]},
    {"name": "AttributeName$ebnf$1", "symbols": [/[a-zA-Z]/, "AttributeName$ebnf$1"], "postprocess": function arrconcat(d) {return [d[0]].concat(d[1]);}},
    {"name": "AttributeName", "symbols": ["AttributeName$ebnf$1"], "postprocess": d => flatten(d).join('').toLowerCase()},
    {"name": "Int$ebnf$1", "symbols": [/[0-9]/]},
    {"name": "Int$ebnf$1", "symbols": [/[0-9]/, "Int$ebnf$1"], "postprocess": function arrconcat(d) {return [d[0]].concat(d[1]);}},
    {"name": "Int", "symbols": ["Int$ebnf$1"], "postprocess": data => parseInt(data.join(''))},
    {"name": "TagName$ebnf$1", "symbols": [/[a-zA-Z]/]},
    {"name": "TagName$ebnf$1", "symbols": [/[a-zA-Z]/, "TagName$ebnf$1"], "postprocess": function arrconcat(d) {return [d[0]].concat(d[1]);}},
    {"name": "TagName", "symbols": ["TagName$ebnf$1"], "postprocess": d => flatten(d).join('').toLowerCase()}
]
  , ParserStart: "Element"
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.grammar = grammar;
}
})();
