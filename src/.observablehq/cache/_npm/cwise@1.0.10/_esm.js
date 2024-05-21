/**
 * Bundled by jsDelivr using Rollup v2.79.1 and Terser v5.19.2.
 * Original file: /npm/cwise@1.0.10/lib/cwise-esprima.js
 *
 * Do NOT use SRI with dynamically generated files! More information: https://www.jsdelivr.com/using-sri-with-dynamic-files
 */
import e from"../cwise-parser@1.0.3/_esm.js";import r from"../cwise-compiler@1.1.3/_esm.js";var o=e,n=r,i=["args","body"],s=["pre","post","printCode","funcName","blockSize"];var a=function(e){for(var r in e)i.indexOf(r)<0&&s.indexOf(r)<0&&console.warn("cwise: Unknown argument '"+r+"' passed to expression compiler");for(var a=0;a<i.length;++a)if(!e[i[a]])throw new Error("cwise: Missing argument: "+i[a]);return n({args:e.args,pre:o(e.pre||function(){}),body:o(e.body),post:o(e.post||function(){}),debug:!!e.printCode,funcName:e.funcName||e.body.name||"cwise",blockSize:e.blockSize||64})};export{a as default};
