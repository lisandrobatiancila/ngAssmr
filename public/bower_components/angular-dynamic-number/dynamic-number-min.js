/**
 * Created by Lenovo on 7/19/2016.
 */
/**
 * Created by User-PC on 7/17/2016.
 */
!function(n,e,t){"use strict";function r(n,e,r,u){if(n===t||null===n||""===n)return 0;var o="";return o=","===e?String(n).replace(".",","):String(n),a(o,r,u)}function u(n,e,t){return","===e?String(n).replace(/['\.\s]/g,"").replace(",","."):"."===e?String(n).replace(/[',\s]/g,""):void 0}function a(n,e,t){var r=n;return t&&(r+=t),e&&(r=/^\-.+/.test(r)?r.replace("-","-"+e):/^\-/.test(r)?r:e+r),r}function o(n,e){if(n>=0){var t=parseInt(n,10);if(isNaN(t)===!1&&isFinite(t)&&t>=0)return t}return e}function i(n,e){if(n>=0){var t=parseInt(n,10);if(isNaN(t)===!1&&isFinite(t)&&t>=0)return t}return e}function c(n,e){return","===n?",":"."===n?".":e}function m(n,e){return"false"===n||n===!1?!1:"true"===n||n===!0?!0:e}function p(n,e){return"false"===n||n===!1?!1:"true"===n||n===!0?!0:e}function s(n,e){return"floor"===n?Math.floor:"ceil"===n?Math.ceil:"round"===n?Math.round:e}function d(n,e){return"false"===n||n===!1?!1:"true"===n||n===!0?!0:e}function f(n,e){return"false"===n||n===!1?!1:"true"===n||n===!0?!0:e}function g(n,e,t){if(!n)return t;var r;return r="."===e?new RegExp("^[',\\s]$"):new RegExp("^['\\.\\s]$"),r.test(n)?n:t}function l(n){var e=new RegExp("[^\\d,\\.\\s\\-]{1}");return e.test(n)?n:null}function h(n,e,t,r,u){var a="-?";r===!1&&u===!0?a="-":r===!0&&u===!1&&(a="");var o="[0-9]{0,"+n+"}";0===n&&(o="0");var i="(\\"+t+"([0-9]){0,"+e+"})";return 0===e&&(i=""),new RegExp("^"+a+o+i+"?$")}function S(n){return String(n).replace(/^0+/g,"").replace(/^-0(\d+)/g,"-$1").replace(new RegExp("^-([\\.,\\s])","g"),"-0$1").replace(new RegExp("^[\\.,\\s]","g"),"0$&")}function v(n,e,t){var r=n;return e&&(r=r.replace(new RegExp("[\\"+e+"]","g"),"")),t&&(r=r.replace(new RegExp("[\\"+t+"]","g"),"")),r}function w(n,e){return"."===e?String(n).replace(/\./g,""):","===e?String(n).replace(/,/g,""):String(n).replace(new RegExp("['\\s]","g"),"")}function $(n,e,t){return n=String(n).split(e),n[0]=n[0].replace(/\B(?=(\d{3})+(?!\d))/g,t),n.join(e)}function R(n,e,t,r){n.$setViewValue(a(e,t,r)),n.$render()}function T(n,e,u,a,o,i,c,m,p){if(""===n||n===t||null===n)return"";if(n=Number(n),!isNaN(n)&&isFinite(n)){var s=Math.pow(10,e);return n=o?r((a(n*s)/s).toFixed(e),u,m,p):r(String(a(n*s)/s),u,m,p),i&&(n=$(n,u,c)),n}return o?0..toFixed(e):"0"}function N(n){var e=0;if(document.selection){n.focus();var t=document.selection.createRange();t.moveStart("character",-n.value.length),e=t.text.length}else(n.selectionStart||"0"==n.selectionStart)&&(e="backward"==n.selectionDirection?n.selectionStart:n.selectionEnd);return e}function P(n,e){if(null!==n)if(n.createTextRange){var t=n.createTextRange();t.move("character",e),t.select()}else n.selectionStart?(n.focus(),n.setSelectionRange(e,e)):n.focus()}function x(n,e,t){for(var r=0,u=0,a=0;a<n.length;a++)if(n[a]!==e){if(r++,r>=t)break}else u++;return u}function F(n,e,t){var r={awnum:n.awnum,numInt:n.numInt,numFract:n.numFract,numSep:n.numSep,numPos:n.numPos,numNeg:n.numNeg,numRound:n.numRound,numThousand:n.numThousand,numThousandSep:n.numThousandSep,numPrepend:n.numPrepend,numAppend:n.numAppend};return e&&(r[e]=t),r}function y(n,e,r,u,a){var d={};n.awnum&&(d=a.getStrategy(n.awnum));var S=o(n.numInt!==t?n.numInt:d.numInt,6),v=i(n.numFract!==t?n.numFract:d.numFract,2),w=c(n.numSep!==t?n.numSep:d.numSep,"."),$=m(n.numPos!==t?n.numPos:d.numPos,!0),R=p(n.numNeg!==t?n.numNeg:d.numNeg,!0),T=s(n.numRound!==t?n.numRound:d.numRound,Math.round),N=f(n.numThousand!==t?n.numThousand:d.numThousand,!1),P=g(n.numThousandSep!==t?n.numThousandSep:d.numThousandSep,w,"."===w?",":"."),x=l(n.numPrepend!==t?n.numPrepend:d.numPrepend),F=l(n.numAppend!==t?n.numAppend:d.numAppend);if($===!1&&R===!1)throw new Error("Number is set to not be positive and not be negative. Change num_pos attr or/and num_neg attr to true");var y=h(S,v,w,$,R);return{element:e,attrs:r,ngModelController:u,viewRegexTest:y,integerPart:S,fractionPart:v,fractionSeparator:w,isPositiveNumber:$,isNegativeNumber:R,roundFunction:T,isThousandSeparator:N,thousandSeparator:P,prepend:x,append:F}}function E(n,e){var a=e.element,o=(e.attrs,e.ngModelController),i=e.viewRegexTest,c=(e.integerPart,e.fractionPart),m=e.fractionSeparator,p=(e.isPositiveNumber,e.isNegativeNumber),s=(e.roundFunction,e.isThousandSeparator),d=e.thousandSeparator,f=e.prepend,g=e.append,l=String(n);if(M){M=!1;var h=new RegExp("[^"+(p?"-":"")+m+d+"0-9]+","g");l=l.replace(h,""),h=new RegExp("^["+m+d+"]"),l=l.replace(h,""),h=new RegExp("["+m+d+"]([0-9]{"+c+"})$"),l=l.replace(h,m+"$1")}if(l=v(l,f,g),new RegExp("^[.,"+d+"]{2,}").test(l))return R(o,0,f,g),0;var T=N(a[0]);f&&T--;var F=l.slice(0,T);if(F=w(F,d),l=w(l,d),F=S(F),l=S(l),""===l&&"0"===String(n).charAt(0))return R(o,0,f,g),0;if(l===t||""===l)return 0;if("-"===l)return R(o,"-",f,g),0;if(i.test(l)===!1){var y=r(o.$modelValue,m,f,g);return s&&(y=$(y,m,d)),R(o,y,f,g),P(a[0],T-1),o.$modelValue}var E=0,b=F.length;return s&&(l=$(l,m,d),E=x(l,d,b)),f&&(E++,new RegExp("^(\\-\\d)$").test(l)&&(E+=2),new RegExp("^(\\d)$").test(l)&&E++),R(o,l,f,g),P(a[0],b+E),setTimeout(function(){P(a[0],b+E)},1),u(l,m,d)}function b(n,e){n.$setViewValue(""),n.$render(),n.$setViewValue(e),n.$render()}function A(n,e){var t=T(n.$modelValue,e.fractionPart,e.fractionSeparator,e.roundFunction,!1,e.isThousandSeparator,e.thousandSeparator,e.prepend,e.append);b(n,t)}function I(n){return{restrict:"A",require:"?ngModel",scope:{awnum:"@",numInt:"@",numFract:"@",numSep:"@",numPos:"@",numNeg:"@",numRound:"@",numThousand:"@",numThousandSep:"@",numPrepend:"@",numAppend:"@"},link:function(e,t,r,u){if(!t[0]||"INPUT"!==t[0].tagName||"text"!==t[0].type&&"tel"!==t[0].type)return void console.warn("Directive angular-dynamic-number works only for 'input' tag with type = 'text' or type = 'tel'");if(!u)return void console.warn("Directive angular-dynamic-number need ngModel attribute");var a=y(F(e),t,r,u,n);t.on("paste",function(){M=!0}),e.$watch("numInt",function(o,i){i!==o&&(a=y(F(e,"numInt",o),t,r,u,n),A(u,a))}),e.$watch("numFract",function(o,i){i!==o&&(a=y(F(e,"numFract",o),t,r,u,n),A(u,a))}),e.$watch("numSep",function(o,i){i!==o&&(a=y(F(e,"numSep",o),t,r,u,n),A(u,a))}),e.$watch("numPos",function(o,i){i!==o&&(a=y(F(e,"numPos",o),t,r,u,n),A(u,a))}),e.$watch("numNeg",function(o,i){i!==o&&(a=y(F(e,"numNeg",o),t,r,u,n),A(u,a))}),e.$watch("numThousand",function(o,i){i!==o&&(a=y(F(e,"numThousand",o),t,r,u,n),A(u,a))}),e.$watch("numThousandSep",function(o,i){i!==o&&(a=y(F(e,"numThousandSep",o),t,r,u,n),A(u,a))}),e.$watch("numAppend",function(o,i){i!==o&&(a=y(F(e,"numAppend",o),t,r,u,n),A(u,a))}),e.$watch("numPrepend",function(o,i){i!==o&&(a=y(F(e,"numPrepend",o),t,r,u,n),A(u,a))}),u.$parsers.unshift(function(n){return E(n,a)}),u.$formatters.push(function(n){return T(n,a.fractionPart,a.fractionSeparator,a.roundFunction,!1,a.isThousandSeparator,a.thousandSeparator,a.prepend,a.append)})}}}var M=!1;e.module("dynamicNumber",[]).provider("dynamicNumberStrategy",function(){var n={};this.addStrategy=function(e,t){n[e]=t},this.getStrategy=function(e){return n[e]},this.$get=function(){return{getStrategy:function(e){return n[e]}}}}).filter("awnum",function(n){return function(r,u,a,o,m,p,h,S,v){var w,$={};e.isString(u)&&($=n.getStrategy(u),u=$.numFract);var w=i(u,2),R=c(a!==t?a:$.numSep,"."),N=s(o!==t?o:$.numRound,Math.round),P=d(m!==t?m:$.numFixed,!1),x=f(p!==t?p:$.numThousand,!1),F=g(h!==t?h:$.numThousandSep,R,"."===R?",":"."),y=l(S!==t?S:$.numPrepend),E=l(v!==t?v:$.numAppend),b=T(r,w,R,N,P,x,F,y,E);return""===b?"0":b}}).directive("awnum",["dynamicNumberStrategy",I])}(window,window.angular);