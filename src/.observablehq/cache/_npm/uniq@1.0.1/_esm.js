/**
 * Bundled by jsDelivr using Rollup v2.79.1 and Terser v5.19.2.
 * Original file: /npm/uniq@1.0.1/uniq.js
 *
 * Do NOT use SRI with dynamically generated files! More information: https://www.jsdelivr.com/using-sri-with-dynamic-files
 */
var n=function(n,t,r){return 0===n.length?n:t?(r||n.sort(t),function(n,t){for(var r=1,e=n.length,f=n[0],o=n[0],i=1;i<e;++i)if(o=f,t(f=n[i],o)){if(i===r){r++;continue}n[r++]=f}return n.length=r,n}(n,t)):(r||n.sort(),function(n){for(var t=1,r=n.length,e=n[0],f=n[0],o=1;o<r;++o,f=e)if(f=e,(e=n[o])!==f){if(o===t){t++;continue}n[t++]=e}return n.length=t,n}(n))};export{n as default};
