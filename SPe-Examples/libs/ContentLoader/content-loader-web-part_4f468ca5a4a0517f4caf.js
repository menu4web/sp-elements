define("6b464f38-9d9a-4aee-ab54-5fc8bd7382a6_0.0.1",["@microsoft/sp-property-pane","@microsoft/sp-loader","@microsoft/sp-core-library","@microsoft/sp-webpart-base","@microsoft/sp-http"],function(n,a,i,r,o){return function(e){var t={};function n(a){if(t[a])return t[a].exports;var i=t[a]={i:a,l:!1,exports:{}};return e[a].call(i.exports,i,i.exports,n),i.l=!0,i.exports}return n.m=e,n.c=t,n.d=function(e,t,a){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:a})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var a=Object.create(null);if(n.r(a),Object.defineProperty(a,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var i in e)n.d(a,i,function(t){return e[t]}.bind(null,i));return a},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s="5HMV")}({"26ea":function(e,t){e.exports=n},"5HMV":function(e,t,n){"use strict";n.r(t);var a,i=n("UWqr"),r=n("br4S"),o=n("vlQI"),s=n("I6O9"),c=n("26ea"),d=(a=function(e,t){return a=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var n in t)Object.prototype.hasOwnProperty.call(t,n)&&(e[n]=t[n])},a(e,t)},function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Class extends value "+String(t)+" is not a constructor or null");function n(){this.constructor=e}a(e,t),e.prototype=null===t?Object.create(t):(n.prototype=t.prototype,new n)}),l=function(e){function t(){return null!==e&&e.apply(this,arguments)||this}return d(t,e),t.prototype.evalScript=function(e){var t=e.text||e.textContent||e.innerHTML||"",n=document.getElementsByTagName("head")[0]||document.documentElement,a=document.createElement("script");if(a.type="text/javascript",!(e.src&&e.src.length>0)){e.onload&&e.onload.length>0&&(a.onload=e.onload);try{a.appendChild(document.createTextNode(t))}catch(e){a.text=t}n.insertBefore(a,n.firstChild),n.removeChild(a)}},t.prototype.nodeName=function(e,t){return e.nodeName&&e.nodeName.toUpperCase()===t.toUpperCase()},t.prototype.executeScript=function(e){return t=this,void 0,a=function(){var t,n,a,i,r,o,c,d,l,u;return function(e,t){var n,a,i,r,o={label:0,sent:function(){if(1&i[0])throw i[1];return i[1]},trys:[],ops:[]};return r={next:s(0),throw:s(1),return:s(2)},"function"==typeof Symbol&&(r[Symbol.iterator]=function(){return this}),r;function s(r){return function(s){return function(r){if(n)throw new TypeError("Generator is already executing.");for(;o;)try{if(n=1,a&&(i=2&r[0]?a.return:r[0]?a.throw||((i=a.return)&&i.call(a),0):a.next)&&!(i=i.call(a,r[1])).done)return i;switch(a=0,i&&(r=[2&r[0],i.value]),r[0]){case 0:case 1:i=r;break;case 4:return o.label++,{value:r[1],done:!1};case 5:o.label++,a=r[1],r=[0];continue;case 7:r=o.ops.pop(),o.trys.pop();continue;default:if(!((i=(i=o.trys).length>0&&i[i.length-1])||6!==r[0]&&2!==r[0])){o=0;continue}if(3===r[0]&&(!i||r[1]>i[0]&&r[1]<i[3])){o.label=r[1];break}if(6===r[0]&&o.label<i[1]){o.label=i[1],i=r;break}if(i&&o.label<i[2]){o.label=i[2],o.ops.push(r);break}i[2]&&o.ops.pop(),o.trys.pop();continue}r=t.call(e,o)}catch(e){r=[6,e],a=0}finally{n=i=0}if(5&r[0])throw r[1];return{value:r[0]?r[1]:void 0,done:!0}}([r,s])}}}(this,function(f){switch(f.label){case 0:for((t=window).ScriptGlobal={},n=[],a=e.childNodes,u=0;a[u];u++)i=a[u],!this.nodeName(i,"script")||i.type&&"text/javascript"!==i.type.toLowerCase()||n.push(i);for(r=[],o=[],u=0;n[u];u++)(l=n[u]).src&&l.src.length>0&&r.push(l.src),l.onload&&l.onload.length>0&&o.push(l.onload);c=null,t.define&&t.define.amd&&(c=t.define.amd,t.define.amd=null),u=0,f.label=1;case 1:if(!(u<r.length))return[3,6];f.label=2;case 2:return f.trys.push([2,4,,5]),[4,s.SPComponentLoader.loadScript(r[u],{globalExportsName:"ScriptGlobal"})];case 3:return f.sent(),[3,5];case 4:return d=f.sent(),console.error(d),[3,5];case 5:return u++,[3,1];case 6:for(c&&(t.define.amd=c),u=0;n[u];u++)(l=n[u]).parentNode&&l.parentNode.removeChild(l),this.evalScript(n[u]);for(u=0;o[u];u++)o[u]();return[2]}})},new((n=void 0)||(n=Promise))(function(e,i){function r(e){try{s(a.next(e))}catch(e){i(e)}}function o(e){try{s(a.throw(e))}catch(e){i(e)}}function s(t){var a;t.done?e(t.value):(a=t.value,a instanceof n?a:new n(function(e){e(a)})).then(r,o)}s((a=a.apply(t,[])).next())});var t,n,a},t.prototype.render=function(){var e=this;if(this.properties.url){var t=window;this.properties.loadPC&&(t._spPageContextInfo||(t._spPageContextInfo=this.context.pageContext.legacyPageContext)),this.properties.loadSP&&(t.SP||s.SPComponentLoader.loadScript("/_layouts/15/init.js",{globalExportsName:"$_global_init"}).then(function(){return s.SPComponentLoader.loadScript("/_layouts/15/MicrosoftAjax.js",{globalExportsName:"Sys"})}).then(function(){return s.SPComponentLoader.loadScript("/_layouts/15/SP.Runtime.js",{globalExportsName:"g_all_modules"})}).then(function(){s.SPComponentLoader.loadScript("/_layouts/15/SP.js",{globalExportsName:"SP"}).catch(function(){})}).catch(function(){})),this.context.spHttpClient.get("".concat(this.properties.url),o.SPHttpClient.configurations.v1).then(function(e){return e.text()}).then(function(t){e.domElement.innerHTML=t,e.executeScript(e.domElement).catch(function(){})}).catch(function(){})}else this.domElement.innerHTML="Edit this web part and provide content URL."},t.prototype.getPropertyPaneConfiguration=function(){return{pages:[{header:{description:"Enter URL to a text file."},groups:[{groupFields:[Object(c.PropertyPaneTextField)("url",{label:"URL"}),Object(c.PropertyPaneCheckbox)("loadPC",{text:"Load page context information",checked:!1}),Object(c.PropertyPaneCheckbox)("loadSP",{text:"Load SP.js and its dependencies",checked:!1})]}]}]}},t.prototype.onInit=function(){return e.prototype.onInit.call(this)},Object.defineProperty(t.prototype,"dataVersion",{get:function(){return i.Version.parse("1.0")},enumerable:!1,configurable:!0}),t}(r.BaseClientSideWebPart);t.default=l},I6O9:function(e,t){e.exports=a},UWqr:function(e,t){e.exports=i},br4S:function(e,t){e.exports=r},vlQI:function(e,t){e.exports=o}})});