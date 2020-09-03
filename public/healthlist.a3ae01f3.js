!function(e){var t={};function r(n){if(t[n])return t[n].exports;var o=t[n]={i:n,l:!1,exports:{}};return e[n].call(o.exports,o,o.exports,r),o.l=!0,o.exports}r.m=e,r.c=t,r.d=function(e,t,n){r.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},r.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},r.t=function(e,t){if(1&t&&(e=r(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(r.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var o in e)r.d(n,o,function(t){return e[t]}.bind(null,o));return n},r.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return r.d(t,"a",t),t},r.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},r.p="",r(r.s=114)}({0:function(e,t){e.exports=window.$},1:function(module,__webpack_exports__,__webpack_require__){"use strict";function checkName(e,t){var r=/^[\u4E00-\u9FA5\uf900-\ufa2d·\.s]{2,20}$/.test(e);if(!r)throw t;return r}function checkPhone(e,t){if(!/^1[3456789]\d{9}$/.test(e))throw t}function checkCode(e,t){var r=[7,9,10,5,8,4,2,1,6,3,7,9,10,5,8,4,2],n=e.substring(17);if(/^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/.test(e)){for(var o=0,a=0;a<17;a++)o+=e[a]*r[a];if([1,0,"X",9,8,7,6,5,4,3,2][o%11]==n.toUpperCase())return!0}throw t}function checkEmpty(e,t){if(!e)throw t;if(""===String(e).trim())throw t}function checkCarId(e,t){e=e.toUpperCase();var r=/^(([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领][A-Z](([0-9]{5}[DF])|([DF]([A-HJ-NP-Z0-9])[0-9]{4})))|([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领][A-Z][A-HJ-NP-Z0-9]{4}[A-HJ-NP-Z0-9挂学警港澳使领]))$/.test(e);if(!r)throw t;return r}function trim(e){return"string"!=typeof e?e:e.replace(/\s*/g,"")}__webpack_require__.d(__webpack_exports__,"f",(function(){return checkName})),__webpack_require__.d(__webpack_exports__,"i",(function(){return checkPhone})),__webpack_require__.d(__webpack_exports__,"c",(function(){return checkCode})),__webpack_require__.d(__webpack_exports__,"d",(function(){return checkEmpty})),__webpack_require__.d(__webpack_exports__,"b",(function(){return checkCarId})),__webpack_require__.d(__webpack_exports__,"B",(function(){return trim})),__webpack_require__.d(__webpack_exports__,"t",(function(){return qs})),__webpack_require__.d(__webpack_exports__,"r",(function(){return getNowFormatDate})),__webpack_require__.d(__webpack_exports__,"m",(function(){return fillFormField})),__webpack_require__.d(__webpack_exports__,"s",(function(){return getSessionStorage})),__webpack_require__.d(__webpack_exports__,"A",(function(){return setSessionStorage})),__webpack_require__.d(__webpack_exports__,"u",(function(){return removeSessionItem})),__webpack_require__.d(__webpack_exports__,"z",(function(){return setLocalStorageWithExpiredTime})),__webpack_require__.d(__webpack_exports__,"q",(function(){return getLocalStorageWithExpiredTime})),__webpack_require__.d(__webpack_exports__,"p",(function(){return getLocalStorage})),__webpack_require__.d(__webpack_exports__,"y",(function(){return setLocalStorage})),__webpack_require__.d(__webpack_exports__,"v",(function(){return removeStorage})),__webpack_require__.d(__webpack_exports__,"e",(function(){return checkIsDateSince})),__webpack_require__.d(__webpack_exports__,"x",(function(){return setForRequestHeaders})),__webpack_require__.d(__webpack_exports__,"w",(function(){return setCookie})),__webpack_require__.d(__webpack_exports__,"o",(function(){return getForRequestHeaders})),__webpack_require__.d(__webpack_exports__,"l",(function(){return delCookie})),__webpack_require__.d(__webpack_exports__,"j",(function(){return checkReturnPermit})),__webpack_require__.d(__webpack_exports__,"k",(function(){return checkTaiWanCode})),__webpack_require__.d(__webpack_exports__,"h",(function(){return checkPassPort})),__webpack_require__.d(__webpack_exports__,"g",(function(){return checkNormalIdCard})),__webpack_require__.d(__webpack_exports__,"n",(function(){return getAgeByIDCard})),__webpack_require__.d(__webpack_exports__,"a",(function(){return changeURLArg}));var qs={parse:function(e){var t={};return e?(e.split("&").map((function(e){var r=e.split("=")[0],n=decodeURIComponent(e.split("=")[1]);t[r]=n})),t):t}};function getNowFormatDate(e){var t=e||0,r=new Date,n=new Date(r);n.setDate(n.getDate()+t);var o=n.getFullYear(),a=n.getMonth()+1,c=n.getDate();return a>=1&&a<=9&&(a="0"+a),c>=0&&c<=9&&(c="0"+c),o+"-"+a+"-"+c}function fillFormField(e,t){var r=$(e);$.each(t,(function(e,t){var n=r.find("input[name="+e+"]");if("checkbox"==n.attr("type")){if(null!==t)for(var o=r.find("[name="+e+"]"),a=t.split(";"),c=0;c<o.length;c++)for(var i=0;i<a.length;i++)o[c].value==a[i]&&$(o[c]).click()}else"radio"==n.attr("type")?n.each((function(){for(var n=r.find("[name="+e+"]"),o=0;o<n.length;o++)n[o].value==t&&$(n[o]).click()})):"textarea"==n.attr("type")?r.find("[name="+e+"]").html(t):(t||0===t)&&r.find("[name="+e+"]").val(t)}))}function getSessionStorage(e){var t=window.sessionStorage.getItem(e);if(t)return t=JSON.parse(t)}function setSessionStorage(e,t){t&&window.sessionStorage.setItem(e,JSON.stringify(t))}function getSessionValueFromKey(e,t){var r=window.sessionStorage.getItem(e);if(r)return(r=JSON.parse(r))[t]}function removeSessionItem(e){window.sessionStorage.removeItem(e)}function checkLng(e,t){var r=Number(e);if(!(r>=-180&&r<=180))throw t}function setLocalStorageWithExpiredTime(e,t,r){if(e&&t&&r){var n=new Date,o=24*r*60*60*1e3,a=new Date(n.setTime(n.getTime()+o)),c="".concat(a.getFullYear(),"-").concat(a.getMonth()+1,"-").concat(a.getDate()," ").concat(a.getHours(),":").concat(a.getMinutes(),":").concat(a.getSeconds());setLocalStorage(e,"".concat(t,",").concat(c))}}function getLocalStorageWithExpiredTime(e){var t=getLocalStorage(e).split(","),r=t[1],n=new Date,o=new Date(r)-n;return Math.floor(o/864e5)<=-1?(removeStorage(e),""):t[0]}function getLocalStorage(e){var t=window.localStorage.getItem(e);return t?t=JSON.parse(t):""}function setLocalStorage(e,t){t&&window.localStorage.setItem(e,JSON.stringify(t))}function removeStorage(e){window.localStorage.removeItem(e)}function checkIsDateSince(e,t,r){if(new Date(e)<t)throw r}function isAlipayNavigator(){return navigator.userAgent.search("Alipay")>-1||navigator.userAgent.search("alipay")>-1}function setForRequestHeaders(e,t){setSessionStorage(e,t)}function checkLat(e,t){var r=Number(e);if(!(r>=-90&&r<=90))throw t}function setCookie(e,t,r){if(0!==r){var n=24*r*60*60*1e3,o=new Date(+new Date+n);document.cookie=e+"="+escape(t)+";expires="+o.toUTCString()+";path=/"}else document.cookie=e+"="+escape(t)}function getCookie(e){var t=new RegExp("(^| )"+e+"=([^;]*)(;|$)"),r=document.cookie.match(t);return r&&r.length>0?unescape(r[2]):null}function getForRequestHeaders(e){var t="";return e?t=getSessionStorage(e):t}function delCookie(e){setCookit(e,"1",-1)}function setCookit(e,t,r){var n=new Date;n.setDate(n.getDate()+r),document.cookie=e+"="+t+";expires="+n}function checkReturnPermit(e,t){if(/^H\d{10}$/g.test(e)||/^M\d{10}$/g.test(e))return!0;throw t}function checkTaiWanCode(e,t){if(/^\d{10}$/.test(e))return!0;throw t}function checkPassPort(e,t){if(/^[A-Z0-9]+$/g.test(e))return!0;throw t}function checkNormalIdCard(e,t){if(/^[a-zA-Z0-9]+$/g.test(e))return!0;throw t}function getAgeByIDCard(e){var t=e.slice(6,14),r=Number(t.slice(0,4)),n=Number(t.slice(4,6)),o=Number(t.slice(6)),a=new Date,c=a.getFullYear(),i=a.getMonth()+1,u=a.getDate();return n<i||n===i&&o<u?c-r:c-r-1}function changeURLArg(url,arg,arg_val){var pattern=arg+"=([^&]*)",replaceText=arg+"="+arg_val;if(url.match(pattern)){var tmp="/("+arg+"=)([^&]*)/gi";return tmp=url.replace(eval(tmp),replaceText),tmp}return url.match("[?]")?url+"&"+replaceText:url+"?"+replaceText}},114:function(e,t,r){"use strict";r.r(t);var n=r(0),o=r.n(n),a=r(2),c=r(4),i=r.n(c),u=r(47),s=r.n(u),_=i.a.parse(location.search);var p=new function(){this.infoList=[],this.renderAt=function(e){!this.el&&e&&(this.el=e);var t=s()({list:this.infoList}),r=o()(t);r.find(".item-link").click((function(){var e=o()(this).data("id");location.assign("/healthcheck.html?recordCode="+_.recordCode+"&id="+e)})),r.find("#return_result").click((function(){var e=i.a.stringify({phone:_.phone,personType:_.personType,recordCode:_.parentRecordCode});location.assign("/qrcode.html?".concat(e))})),o()(this.el).html(r)},this.update=function(){this.renderAt(this.el)}};Object(a.a)("/api/dailyHealthDeclaration/list",{recordCode:_.recordCode}).then((function(e){p.infoList=e.data,p.update()}));var l=p;r(64);l.renderAt("#health")},2:function(e,t,r){"use strict";r.d(t,"a",(function(){return l})),r.d(t,"b",(function(){return f}));var n=r(5),o=r.n(n),a=r(0),c=r.n(a),i=r(3),u=r(1);function s(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function _(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?s(Object(r),!0).forEach((function(t){o()(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):s(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}var p=function(e,t,r,n){var o={url:e,type:t,dataType:"json",cache:!1,xhrFields:{withCredentials:!0},headers:{phone:Object(u.o)("phone")}};return"POST"===t&&(o.contentType="application/json"),r&&(o.data=r),n&&(o.headers=_({},o.headers,{},n)),i.a.show(),new Promise((function(e,t){c.a.ajax(_({},o,{success:function(t){e(t),i.a.hide()},error:function(e){t(e),i.a.hide()}}))}))},l=function(e,t){var r=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{};return p(e,"GET",t,r)},f=function(e,t){var r=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{};return p(e,"POST",JSON.stringify(t),r)}},3:function(e,t,r){"use strict";function n(){this.count=0}n.prototype.show=function(){this.count++,this.count>0&&$.showIndicator&&$.showIndicator()},n.prototype.hide=function(){this.count--,this.count<1&&$.hideIndicator&&$.hideIndicator()},t.a=new n},4:function(e,t,r){"use strict";const n=r(7),o=r(8),a=r(9);function c(e){if("string"!=typeof e||1!==e.length)throw new TypeError("arrayFormatSeparator must be single character string")}function i(e,t){return t.encode?t.strict?n(e):encodeURIComponent(e):e}function u(e,t){return t.decode?o(e):e}function s(e){const t=e.indexOf("#");return-1!==t&&(e=e.slice(0,t)),e}function _(e){const t=(e=s(e)).indexOf("?");return-1===t?"":e.slice(t+1)}function p(e,t){return t.parseNumbers&&!Number.isNaN(Number(e))&&"string"==typeof e&&""!==e.trim()?e=Number(e):!t.parseBooleans||null===e||"true"!==e.toLowerCase()&&"false"!==e.toLowerCase()||(e="true"===e.toLowerCase()),e}function l(e,t){c((t=Object.assign({decode:!0,sort:!0,arrayFormat:"none",arrayFormatSeparator:",",parseNumbers:!1,parseBooleans:!1},t)).arrayFormatSeparator);const r=function(e){let t;switch(e.arrayFormat){case"index":return(e,r,n)=>{t=/\[(\d*)\]$/.exec(e),e=e.replace(/\[\d*\]$/,""),t?(void 0===n[e]&&(n[e]={}),n[e][t[1]]=r):n[e]=r};case"bracket":return(e,r,n)=>{t=/(\[\])$/.exec(e),e=e.replace(/\[\]$/,""),t?void 0!==n[e]?n[e]=[].concat(n[e],r):n[e]=[r]:n[e]=r};case"comma":case"separator":return(t,r,n)=>{const o="string"==typeof r&&r.split("").indexOf(e.arrayFormatSeparator)>-1?r.split(e.arrayFormatSeparator).map(t=>u(t,e)):null===r?r:u(r,e);n[t]=o};default:return(e,t,r)=>{void 0!==r[e]?r[e]=[].concat(r[e],t):r[e]=t}}}(t),n=Object.create(null);if("string"!=typeof e)return n;if(!(e=e.trim().replace(/^[?#&]/,"")))return n;for(const o of e.split("&")){let[e,c]=a(t.decode?o.replace(/\+/g," "):o,"=");c=void 0===c?null:"comma"===t.arrayFormat?c:u(c,t),r(u(e,t),c,n)}for(const e of Object.keys(n)){const r=n[e];if("object"==typeof r&&null!==r)for(const e of Object.keys(r))r[e]=p(r[e],t);else n[e]=p(r,t)}return!1===t.sort?n:(!0===t.sort?Object.keys(n).sort():Object.keys(n).sort(t.sort)).reduce((e,t)=>{const r=n[t];return Boolean(r)&&"object"==typeof r&&!Array.isArray(r)?e[t]=function e(t){return Array.isArray(t)?t.sort():"object"==typeof t?e(Object.keys(t)).sort((e,t)=>Number(e)-Number(t)).map(e=>t[e]):t}(r):e[t]=r,e},Object.create(null))}t.extract=_,t.parse=l,t.stringify=(e,t)=>{if(!e)return"";c((t=Object.assign({encode:!0,strict:!0,arrayFormat:"none",arrayFormatSeparator:","},t)).arrayFormatSeparator);const r=function(e){switch(e.arrayFormat){case"index":return t=>(r,n)=>{const o=r.length;return void 0===n||e.skipNull&&null===n?r:null===n?[...r,[i(t,e),"[",o,"]"].join("")]:[...r,[i(t,e),"[",i(o,e),"]=",i(n,e)].join("")]};case"bracket":return t=>(r,n)=>void 0===n||e.skipNull&&null===n?r:null===n?[...r,[i(t,e),"[]"].join("")]:[...r,[i(t,e),"[]=",i(n,e)].join("")];case"comma":case"separator":return t=>(r,n)=>null==n||0===n.length?r:0===r.length?[[i(t,e),"=",i(n,e)].join("")]:[[r,i(n,e)].join(e.arrayFormatSeparator)];default:return t=>(r,n)=>void 0===n||e.skipNull&&null===n?r:null===n?[...r,i(t,e)]:[...r,[i(t,e),"=",i(n,e)].join("")]}}(t),n=Object.assign({},e);if(t.skipNull)for(const e of Object.keys(n))void 0!==n[e]&&null!==n[e]||delete n[e];const o=Object.keys(n);return!1!==t.sort&&o.sort(t.sort),o.map(n=>{const o=e[n];return void 0===o?"":null===o?i(n,t):Array.isArray(o)?o.reduce(r(n),[]).join("&"):i(n,t)+"="+i(o,t)}).filter(e=>e.length>0).join("&")},t.parseUrl=(e,t)=>({url:s(e).split("?")[0]||"",query:l(_(e),t)}),t.stringifyUrl=(e,r)=>{const n=s(e.url).split("?")[0]||"",o=t.extract(e.url),a=t.parse(o),c=function(e){let t="";const r=e.indexOf("#");return-1!==r&&(t=e.slice(r)),t}(e.url),i=Object.assign(a,e.query);let u=t.stringify(i,r);return u&&(u=`?${u}`),`${n}${u}${c}`}},47:function(module,exports){module.exports=function(obj){obj||(obj={});var __t,__p="",__j=Array.prototype.join;function print(){__p+=__j.call(arguments,"")}with(obj)__p+='<div class="list-block media-list clock-list">\n  <ul id="clock-ul" class="clock-ul">\n    ',list.forEach(e=>{__p+='\n    <li class="clock-item">\n      <a class="item-link item-content" data-id="'+(null==(__t=e.id)?"":__t)+'">\n        <div class="item-inner">\n          <span>'+(null==(__t=e.declareDate)?"":__t)+"</span>\n          <span>"+(null==(__t=e.declareTime)?"":__t)+'</span>\n          <div class="item-text">\n            <span class="temperature">体温：'+(null==(__t=e.temperature)?"":__t)+"</span>\n            <span>状况："+(null==(__t=e.healthStatus)?"":__t)+"</span>\n          </div>\n        </div>\n      </a>\n    </li>\n    "}),__p+='\n  </ul>\n  <div class="footer">\n    <a id="return_result" class="button button-big button-fill">返回</a>\n  </div>\n</div>\n';return __p}},5:function(e,t){e.exports=function(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}},64:function(e,t,r){},7:function(e,t,r){"use strict";e.exports=e=>encodeURIComponent(e).replace(/[!'()*]/g,e=>`%${e.charCodeAt(0).toString(16).toUpperCase()}`)},8:function(e,t,r){"use strict";var n=new RegExp("%[a-f0-9]{2}","gi"),o=new RegExp("(%[a-f0-9]{2})+","gi");function a(e,t){try{return decodeURIComponent(e.join(""))}catch(e){}if(1===e.length)return e;t=t||1;var r=e.slice(0,t),n=e.slice(t);return Array.prototype.concat.call([],a(r),a(n))}function c(e){try{return decodeURIComponent(e)}catch(o){for(var t=e.match(n),r=1;r<t.length;r++)t=(e=a(t,r).join("")).match(n);return e}}e.exports=function(e){if("string"!=typeof e)throw new TypeError("Expected `encodedURI` to be of type `string`, got `"+typeof e+"`");try{return e=e.replace(/\+/g," "),decodeURIComponent(e)}catch(t){return function(e){for(var t={"%FE%FF":"��","%FF%FE":"��"},r=o.exec(e);r;){try{t[r[0]]=decodeURIComponent(r[0])}catch(e){var n=c(r[0]);n!==r[0]&&(t[r[0]]=n)}r=o.exec(e)}t["%C2"]="�";for(var a=Object.keys(t),i=0;i<a.length;i++){var u=a[i];e=e.replace(new RegExp(u,"g"),t[u])}return e}(e)}}},9:function(e,t,r){"use strict";e.exports=(e,t)=>{if("string"!=typeof e||"string"!=typeof t)throw new TypeError("Expected the arguments to be of type `string`");if(""===t)return[e];const r=e.indexOf(t);return-1===r?[e]:[e.slice(0,r),e.slice(r+t.length)]}}});