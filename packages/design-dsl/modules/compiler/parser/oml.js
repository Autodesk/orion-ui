// Generated automatically by nearley
// http://github.com/Hardmath123/nearley
(function () {
function id(x) {return x[0]; }
 function flatten(list) {return list.reduce(function (acc, val) {return acc.concat((val && val.constructor === Array) ? flatten(val) : val);}, []);} 

var START_TAG = { test: x => x.type === 'start-tag' }
var END_TAG = { test: x => x.type === 'end-tag' }
var WS = { test: x => x.type === 'character' && x.data.match(/\s/) }
var EOF = { test: x => x.type === 'eof' }
var grammar = {
    ParserRules: [
    {"name": "Document", "symbols": ["__", "Element", "__", EOF], "postprocess": data => data[1]},
    {"name": "__$ebnf$1", "symbols": []},
    {"name": "__$ebnf$1", "symbols": [WS, "__$ebnf$1"], "postprocess": function arrconcat(d) {return [d[0]].concat(d[1]);}},
    {"name": "__", "symbols": ["__$ebnf$1"]},
    {"name": "Element", "symbols": [START_TAG, "Contents", END_TAG], "postprocess": 
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
        },
    {"name": "Contents$ebnf$1", "symbols": []},
    {"name": "Contents$ebnf$1$subexpression$1", "symbols": [WS], "postprocess": d => []},
    {"name": "Contents$ebnf$1$subexpression$1", "symbols": ["Element"], "postprocess": id},
    {"name": "Contents$ebnf$1", "symbols": ["Contents$ebnf$1$subexpression$1", "Contents$ebnf$1"], "postprocess": function arrconcat(d) {return [d[0]].concat(d[1]);}},
    {"name": "Contents", "symbols": ["Contents$ebnf$1"], "postprocess": d => flatten(d)}
]
  , ParserStart: "Document"
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.grammar = grammar;
}
})();
