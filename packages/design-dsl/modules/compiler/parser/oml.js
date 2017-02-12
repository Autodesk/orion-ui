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
    {"name": "TagName$ebnf$1", "symbols": [/[a-zA-Z]/]},
    {"name": "TagName$ebnf$1", "symbols": [/[a-zA-Z]/, "TagName$ebnf$1"], "postprocess": function arrconcat(d) {return [d[0]].concat(d[1]);}},
    {"name": "TagName", "symbols": ["TagName$ebnf$1"], "postprocess": d => flatten(d).join('').toLowerCase()},
    {"name": "AttributeName$ebnf$1", "symbols": [/[a-zA-Z]/]},
    {"name": "AttributeName$ebnf$1", "symbols": [/[a-zA-Z]/, "AttributeName$ebnf$1"], "postprocess": function arrconcat(d) {return [d[0]].concat(d[1]);}},
    {"name": "AttributeName", "symbols": ["AttributeName$ebnf$1"], "postprocess": d => flatten(d).join('').toLowerCase()},
    {"name": "Attributes", "symbols": []},
    {"name": "Attributes$ebnf$1", "symbols": []},
    {"name": "Attributes$ebnf$1$subexpression$1", "symbols": ["__", "Attribute"], "postprocess": data => data[1]},
    {"name": "Attributes$ebnf$1", "symbols": ["Attributes$ebnf$1$subexpression$1", "Attributes$ebnf$1"], "postprocess": function arrconcat(d) {return [d[0]].concat(d[1]);}},
    {"name": "Attributes", "symbols": ["Attributes$ebnf$1"], "postprocess": id},
    {"name": "Attribute", "symbols": ["BooleanAttribute"], "postprocess": id},
    {"name": "BooleanAttribute", "symbols": ["AttributeName"], "postprocess": 
        (data, location, reject) => {
          return [data[0], true];
        }
        }
]
  , ParserStart: "RootElement"
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.grammar = grammar;
}
})();
