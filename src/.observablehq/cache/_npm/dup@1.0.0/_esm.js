/**
 * Bundled by jsDelivr using Rollup v2.79.1 and Terser v5.19.2.
 * Original file: /npm/dup@1.0.0/dup.js
 *
 * Do NOT use SRI with dynamically generated files! More information: https://www.jsdelivr.com/using-sri-with-dynamic-files
 */
function r(e,n,t){var f=0|e[t];if(f<=0)return[];var u,a=new Array(f);if(t===e.length-1)for(u=0;u<f;++u)a[u]=n;else for(u=0;u<f;++u)a[u]=r(e,n,t+1);return a}var e=function(e,n){switch(void 0===n&&(n=0),typeof e){case"number":if(e>0)return function(r,e){var n,t;for(n=new Array(r),t=0;t<r;++t)n[t]=e;return n}(0|e,n);break;case"object":if("number"==typeof e.length)return r(e,n,0)}return[]};export{e as default};
