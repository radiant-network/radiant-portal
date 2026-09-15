import{n as e,o as t,t as n}from"./rolldown-runtime-C0FnF6B9.js";import{t as r}from"./react-BRh_h4kc.js";import{a as i,o as a}from"./cookieStore-DFp5m_DY.js";import{n as o,t as s}from"./http-BQTtTyo4.js";import{t as c}from"./react-dom-B6mrIuN4.js";import{t as l}from"./jsx-runtime-BdxMnOeJ.js";import{n as u,t as d}from"./checkbox--Wdc3fbi.js";import{a as f,i as p,r as m,t as h}from"./popover-UCzqOcX6.js";import{a as g,i as _,n as v,r as y,t as ee}from"./tooltip-CfAUv4AB.js";import{i as b,n as x,r as te,t as S}from"./utils-hYbUpBR2.js";import{n as C,t as w}from"./button-Cn480Lud.js";import{n as ne,t as re}from"./grip-vertical-BiMQgOvM.js";import{n as ie,t as T}from"./settings-CoBxXs2v.js";import{n as E,t as D}from"./x-H4Ywn8aG.js";import{n as O,t as k}from"./i18n-87HgNCfy.js";import{_ as ae,a as A,g as oe,h as se,p as ce,y as le}from"./api-BEmUmIgf.js";import{i as ue,n as j}from"./story-section-DVTm6cGm.js";import{a as M,n as de,s as fe,t as N}from"./card-lDj02HnZ.js";import{a as P,i as F,n as I,o as pe,r as me}from"./horizontal-bar-chart.stories-DYk3bSLt.js";import{a as he,c as ge,i as _e,n as ve,o as L,s as R,t as z}from"./pie-chart.stories-B-N9YIIy.js";import{n as B,t as V}from"./skeleton-CYetxZ-F.js";import{n as ye,t as H}from"./mutation-DFDrZLjH.js";import{a as U,c as W,n as G,o as be,r as xe,s as Se,t as Ce}from"./vertical-bar-chart.stories-ByZiHD92.js";import{n as K,t as we}from"./api-user-preference-DU1L2oJJ.js";import{n as Te,t as Ee}from"./delay-BUO-phQa.js";function De(e){let{margin:t,containerPadding:n,containerWidth:r,cols:i}=e;return(r-t[0]*(i-1)-n[0]*2)/i}function Oe(e,t,n){return Number.isFinite(e)?Math.round(t*e+Math.max(0,e-1)*n):e}function ke(e,t,n,r,i,a,o){let{margin:s,containerPadding:c,rowHeight:l}=e,u=De(e),d,f,p,m;if(o?(d=Math.round(o.width),f=Math.round(o.height)):(d=Oe(r,u,s[0]),f=Oe(i,l,s[1])),a?(p=Math.round(a.top),m=Math.round(a.left)):o?(p=Math.round(o.top),m=Math.round(o.left)):(p=Math.round((l+s[1])*n+c[1]),m=Math.round((u+s[0])*t+c[0])),!a&&!o){if(Number.isFinite(r)){let e=Math.round((u+s[0])*(t+r)+c[0])-m-d;e!==s[0]&&(d+=e-s[0])}if(Number.isFinite(i)){let e=Math.round((l+s[1])*(n+i)+c[1])-p-f;e!==s[1]&&(f+=e-s[1])}}return{top:p,left:m,width:d,height:f}}function Ae(e,t,n,r,i){let{margin:a,containerPadding:o,cols:s,rowHeight:c,maxRows:l}=e,u=De(e),d=Math.round((n-o[0])/(u+a[0])),f=Math.round((t-o[1])/(c+a[1]));return d=Ne(d,0,s-r),f=Ne(f,0,l-i),{x:d,y:f}}function je(e,t,n){let{margin:r,containerPadding:i,rowHeight:a}=e,o=De(e);return{x:Math.round((n-i[0])/(o+r[0])),y:Math.round((t-i[1])/(a+r[1]))}}function Me(e,t,n){let{margin:r,rowHeight:i}=e,a=De(e);return{w:Math.max(1,Math.round((t+r[0])/(a+r[0]))),h:Math.max(1,Math.round((n+r[1])/(i+r[1])))}}function Ne(e,t,n){return Math.max(Math.min(e,n),t)}function Pe(e,t){return!(e.i===t.i||e.x+e.w<=t.x||e.x>=t.x+t.w||e.y+e.h<=t.y||e.y>=t.y+t.h)}function Fe(e,t){for(let n=0;n<e.length;n++){let r=e[n];if(r!==void 0&&Pe(r,t))return r}}function Ie(e,t){return e.filter(e=>Pe(e,t))}function Le(e,t){return t===`horizontal`?ze(e):t===`vertical`||t===`wrap`?Re(e):[...e]}function Re(e){return[...e].sort((e,t)=>e.y===t.y?e.x-t.x:e.y-t.y)}function ze(e){return[...e].sort((e,t)=>e.x===t.x?e.y-t.y:e.x-t.x)}function Be(e){let t=0;for(let n=0;n<e.length;n++){let r=e[n];if(r!==void 0){let e=r.y+r.h;e>t&&(t=e)}}return t}function Ve(e,t){for(let n=0;n<e.length;n++){let r=e[n];if(r!==void 0&&r.i===t)return r}}function He(e){return e.filter(e=>e.static===!0)}function Ue(e){return{i:e.i,x:e.x,y:e.y,w:e.w,h:e.h,minW:e.minW,maxW:e.maxW,minH:e.minH,maxH:e.maxH,moved:!!e.moved,static:!!e.static,isDraggable:e.isDraggable,isResizable:e.isResizable,resizeHandles:e.resizeHandles,constraints:e.constraints,isBounded:e.isBounded}}function We(e){let t=Array(e.length);for(let n=0;n<e.length;n++){let r=e[n];r!==void 0&&(t[n]=Ue(r))}return t}function Ge(e,t){let n=Array(e.length);for(let r=0;r<e.length;r++){let i=e[r];i!==void 0&&(t.i===i.i?n[r]=t:n[r]=i)}return n}function Ke(e,t,n){let r=Ve(e,t);return r?(r=n(Ue(r)),[Ge(e,r),r]):[[...e],null]}function qe(e,t){let n=He(e);for(let r=0;r<e.length;r++){let i=e[r];if(i!==void 0){if(i.x+i.w>t.cols&&(i.x=t.cols-i.w),i.x<0&&(i.x=0,i.w=t.cols),!i.static)n.push(i);else for(;Fe(n,i);)i.y++}}return e}function Je(e,t,n,r,i,a,o,s,c){if(t.static&&t.isDraggable!==!0||t.y===r&&t.x===n)return[...e];let l=t.x,u=t.y;typeof n==`number`&&(t.x=n),typeof r==`number`&&(t.y=r),t.moved=!0;let d=Le(e,o);(o===`vertical`&&typeof r==`number`?u>=r:o===`horizontal`&&typeof n==`number`&&l>=n)&&(d=d.reverse());let f=Ie(d,t),p=f.length>0;if(p&&c)return We(e);if(p&&a)return t.x=l,t.y=u,t.moved=!1,e;let m=[...e];for(let e=0;e<f.length;e++){let n=f[e];n!==void 0&&(n.moved||(m=n.static?Ye(m,n,t,i,o):Ye(m,t,n,i,o)))}return m}function Ye(e,t,n,r,i,a){let o=i===`horizontal`,s=i===`vertical`,c=t.static;if(r){r=!1;let a={x:o?Math.max(t.x-n.w,0):n.x,y:s?Math.max(t.y-n.h,0):n.y,w:n.w,h:n.h,i:`-1`},l=Fe(e,a),u=l!==void 0&&l.y+l.h>t.y,d=l!==void 0&&t.x+t.w>l.x;if(!l)return Je(e,n,o?a.x:void 0,s?a.y:void 0,r,c,i);if(u&&s)return Je(e,n,void 0,n.y+1,r,c,i);if(u&&i===null)return t.y=n.y,n.y+=n.h,[...e];if(d&&o)return Je(e,t,n.x,void 0,r,c,i)}let l=o?n.x+1:void 0,u=s?n.y+1:void 0;return l===void 0&&u===void 0?[...e]:Je(e,n,l,u,r,c,i)}function Xe(e,t,n){return Math.max(t,Math.min(n,e))}function Ze(e,t,n,r,i){let a={x:n,y:r};for(let n of e)n.constrainPosition&&(a=n.constrainPosition(t,a.x,a.y,i));if(t.constraints)for(let e of t.constraints)e.constrainPosition&&(a=e.constrainPosition(t,a.x,a.y,i));return a}function Qe(e,t,n,r,i,a){let o={w:n,h:r};for(let n of e)n.constrainSize&&(o=n.constrainSize(t,o.w,o.h,i,a));if(t.constraints)for(let e of t.constraints)e.constrainSize&&(o=e.constrainSize(t,o.w,o.h,i,a));return o}function $e({top:e,left:t,width:n,height:r}){let i=`translate(${t}px,${e}px)`;return{transform:i,WebkitTransform:i,MozTransform:i,msTransform:i,OTransform:i,width:`${n}px`,height:`${r}px`,position:`absolute`}}function et({top:e,left:t,width:n,height:r}){return{top:`${e}px`,left:`${t}px`,width:`${n}px`,height:`${r}px`,position:`absolute`}}function tt(e){return e*100+`%`}function nt(e,t,n,r){return e+n>r?t:n}function rt(e,t,n){return e<0?t:n}function it(e){return Math.max(0,e)}function at(e){return Math.max(0,e)}function ot(e,t,n,r){let i=Dt[e];return i?i(t,{...t,...n},r):n}function st(e,t,n,r,i){let a=r===`x`?`w`:`h`;t[r]+=1;let o=e.findIndex(e=>e.i===t.i),s=i??He(e).length>0;for(let i=o+1;i<e.length;i++){let o=e[i];if(o!==void 0&&!o.static){if(!s&&o.y>t.y+t.h)break;Pe(t,o)&&st(e,o,n+t[a],r,s)}}t[r]=n}function ct(e,t,n,r){for(t.x=Math.max(t.x,0),t.y=Math.max(t.y,0),t.y=Math.min(r,t.y);t.y>0&&!Fe(e,t);)t.y--;let i;for(;(i=Fe(e,t))!==void 0;)st(n,t,i.y+i.h,`y`);return t.y=Math.max(t.y,0),t}function lt(e,t,n,r){for(t.x=Math.max(t.x,0),t.y=Math.max(t.y,0);t.x>0&&!Fe(e,t);)t.x--;let i;for(;(i=Fe(e,t))!==void 0;)if(st(r,t,i.x+i.w,`x`),t.x+t.w>n)for(t.x=n-t.w,t.y++;t.x>0&&!Fe(e,t);)t.x--;return t.x=Math.max(t.x,0),t}function ut(e,t=!1,n=!1){let r;return r=t?e===`vertical`?Lt:e===`horizontal`?Rt:zt:e===`vertical`?Pt:e===`horizontal`?Ft:It,n?{...r,preventCollision:n}:r}function dt(e){return Object.keys(e).sort((t,n)=>e[t]-e[n])}function ft(e,t){let n=dt(e),r=n[0];if(r===void 0)throw Error(`No breakpoints defined`);for(let i=1;i<n.length;i++){let a=n[i];a!==void 0&&t>e[a]&&(r=a)}return r}function pt(e,t){let n=t[e];if(n===void 0)throw Error(`ResponsiveReactGridLayout: \`cols\` entry for breakpoint ${String(e)} is missing!`);return n}function mt(e,t,n,r,i,a){let o=e[n];if(o)return We(o);let s=e[r],c=dt(t),l=c.slice(c.indexOf(n));for(let t=0;t<l.length;t++){let n=l[t];if(n===void 0)continue;let r=e[n];if(r){s=r;break}}let u=qe(We(s||[]),{cols:i});return(typeof a==`object`&&a?a:ut(a)).compact(u,i)}function ht(e,t){if(Array.isArray(e))return e;let n=e,r=n[t];if(r!==void 0)return r;let i=Object.keys(n);for(let e of i){let t=n[e];if(t!==void 0)return t}return[10,10]}var gt,_t,vt,yt,bt,xt,St,Ct,wt,Tt,Et,Dt,Ot,kt,At,jt,Mt,Nt,Pt,Ft,It,Lt,Rt,zt;function Bt(){return(Bt=e((()=>{gt={name:`gridBounds`,constrainPosition(e,t,n,{cols:r,maxRows:i}){return{x:Xe(t,0,Math.max(0,r-e.w)),y:Xe(n,0,Math.max(0,i-e.h))}},constrainSize(e,t,n,r,{cols:i,maxRows:a}){let o=r===`w`||r===`nw`||r===`sw`?e.x+e.w:i-e.x,s=r===`n`||r===`nw`||r===`ne`?e.y+e.h:a-e.y;return{w:Xe(t,1,Math.max(1,o)),h:Xe(n,1,Math.max(1,s))}}},_t={name:`minMaxSize`,constrainSize(e,t,n){return{w:Xe(t,e.minW??1,e.maxW??1/0),h:Xe(n,e.minH??1,e.maxH??1/0)}}},vt=[gt,_t],yt=(e,t,n)=>{let{left:r,height:i,width:a}=t,o=e.top-(i-e.height);return{left:r,width:a,height:rt(o,e.height,i),top:at(o)}},bt=(e,t,n)=>{let{top:r,left:i,height:a,width:o}=t;return{top:r,height:a,width:nt(e.left,e.width,o,n),left:it(i)}},xt=(e,t,n)=>{let{top:r,height:i,width:a}=t,o=e.left+e.width-a;return o<0?{height:i,width:e.left+e.width,top:at(r),left:0}:{height:i,width:a,top:at(r),left:o}},St=(e,t,n)=>{let{top:r,left:i,height:a,width:o}=t;return{width:o,left:i,height:rt(r,e.height,a),top:at(r)}},Ct=(e,t,n)=>yt(e,bt(e,t,n)),wt=(e,t,n)=>yt(e,xt(e,t)),Tt=(e,t,n)=>St(e,bt(e,t,n)),Et=(e,t,n)=>St(e,xt(e,t)),Dt={n:yt,ne:Ct,e:bt,se:Tt,s:St,sw:Et,w:xt,nw:wt},Ot={type:`transform`,scale:1,calcStyle(e){return $e(e)}},kt=Ot,At={cols:12,rowHeight:150,margin:[10,10],containerPadding:null,maxRows:1/0},jt={enabled:!0,bounded:!1,threshold:3},Mt={enabled:!0,handles:[`se`]},Nt={enabled:!1,defaultItem:{w:1,h:1}},Pt={type:`vertical`,allowOverlap:!1,compact(e,t){let n=He(e),r=Be(n),i=Re(e),a=Array(e.length);for(let t=0;t<i.length;t++){let o=i[t];if(o===void 0)continue;let s=Ue(o);s.static||(s=ct(n,s,i,r),r=Math.max(r,s.y+s.h),n.push(s));let c=e.indexOf(o);a[c]=s,s.moved=!1}return a}},Ft={type:`horizontal`,allowOverlap:!1,compact(e,t){let n=He(e),r=ze(e),i=Array(e.length);for(let a=0;a<r.length;a++){let o=r[a];if(o===void 0)continue;let s=Ue(o);s.static||(s=lt(n,s,t,r),n.push(s));let c=e.indexOf(o);i[c]=s,s.moved=!1}return i}},It={type:null,allowOverlap:!1,compact(e,t){return We(e)}},Lt={...Pt,allowOverlap:!0,compact(e,t){return We(e)}},Rt={...Ft,allowOverlap:!0,compact(e,t){return We(e)}},zt={...It,allowOverlap:!0}})))()}var Vt=n(((e,t)=>{(function(n,r){typeof e==`object`&&t!==void 0?r(e):typeof define==`function`&&define.amd?define([`exports`],r):(n=typeof globalThis<`u`?globalThis:n||self,r(n[`fast-equals`]={}))})(e,(function(e){function t(e){return function(t,n,r,i,a,o,s){return e(t,n,s)}}function n(e){return function(t,n,r,i){if(!t||!n||typeof t!=`object`||typeof n!=`object`)return e(t,n,r,i);var a=i.get(t),o=i.get(n);if(a&&o)return a===n&&o===t;i.set(t,n),i.set(n,t);var s=e(t,n,r,i);return i.delete(t),i.delete(n),s}}function r(e,t){var n={};for(var r in e)n[r]=e[r];for(var r in t)n[r]=t[r];return n}function i(e){return e.constructor===Object||e.constructor==null}function a(e){return typeof e.then==`function`}function o(e,t){return e===t||e!==e&&t!==t}var s=Object.prototype.toString;function c(e){var t=e.areArraysEqual,n=e.areDatesEqual,r=e.areMapsEqual,c=e.areObjectsEqual,l=e.areRegExpsEqual,u=e.areSetsEqual,d=e.createIsNestedEqual,f=d(p);function p(e,d,p){if(e===d)return!0;if(!e||!d||typeof e!=`object`||typeof d!=`object`)return e!==e&&d!==d;if(i(e)&&i(d))return c(e,d,f,p);var m=Array.isArray(e),h=Array.isArray(d);if(m||h)return m===h&&t(e,d,f,p);var g=s.call(e);return g===s.call(d)?g===`[object Date]`?n(e,d,f,p):g===`[object RegExp]`?l(e,d,f,p):g===`[object Map]`?r(e,d,f,p):g===`[object Set]`?u(e,d,f,p):g===`[object Object]`||g===`[object Arguments]`?a(e)||a(d)?!1:c(e,d,f,p):g===`[object Boolean]`||g===`[object Number]`||g===`[object String]`?o(e.valueOf(),d.valueOf()):!1:!1}return p}function l(e,t,n,r){var i=e.length;if(t.length!==i)return!1;for(;i-->0;)if(!n(e[i],t[i],i,i,e,t,r))return!1;return!0}var u=n(l);function d(e,t){return o(e.valueOf(),t.valueOf())}function f(e,t,n,r){var i=e.size===t.size;if(!i)return!1;if(!e.size)return!0;var a={},o=0;return e.forEach(function(s,c){if(i){var l=!1,u=0;t.forEach(function(i,d){!l&&!a[u]&&(l=n(c,d,o,u,e,t,r)&&n(s,i,c,d,e,t,r))&&(a[u]=!0),u++}),o++,i=l}}),i}var p=n(f),m=`_owner`,h=Object.prototype.hasOwnProperty;function g(e,t,n,r){var i=Object.keys(e),a=i.length;if(Object.keys(t).length!==a)return!1;for(var o;a-->0;){if(o=i[a],o===m){var s=!!e.$$typeof,c=!!t.$$typeof;if((s||c)&&s!==c)return!1}if(!h.call(t,o)||!n(e[o],t[o],o,o,e,t,r))return!1}return!0}var _=n(g);function v(e,t){return e.source===t.source&&e.flags===t.flags}function y(e,t,n,r){var i=e.size===t.size;if(!i)return!1;if(!e.size)return!0;var a={};return e.forEach(function(o,s){if(i){var c=!1,l=0;t.forEach(function(i,u){!c&&!a[l]&&(c=n(o,i,s,u,e,t,r))&&(a[l]=!0),l++}),i=c}}),i}var ee=n(y),b=Object.freeze({areArraysEqual:l,areDatesEqual:d,areMapsEqual:f,areObjectsEqual:g,areRegExpsEqual:v,areSetsEqual:y,createIsNestedEqual:t}),x=Object.freeze({areArraysEqual:u,areDatesEqual:d,areMapsEqual:p,areObjectsEqual:_,areRegExpsEqual:v,areSetsEqual:ee,createIsNestedEqual:t}),te=c(b);function S(e,t){return te(e,t,void 0)}var C=c(r(b,{createIsNestedEqual:function(){return o}}));function w(e,t){return C(e,t,void 0)}var ne=c(x);function re(e,t){return ne(e,t,new WeakMap)}var ie=c(r(x,{createIsNestedEqual:function(){return o}}));function T(e,t){return ie(e,t,new WeakMap)}function E(e){return c(r(b,e(b)))}function D(e){var t=c(r(x,e(x)));return(function(e,n,r){return r===void 0&&(r=new WeakMap),t(e,n,r)})}e.circularDeepEqual=re,e.circularShallowEqual=T,e.createCustomCircularEqual=D,e.createCustomEqual=E,e.deepEqual=S,e.sameValueZeroEqual=o,e.shallowEqual=w,Object.defineProperty(e,"__esModule",{value:!0})}))}));function Ht(e={}){let{measureBeforeMount:t=!1,initialWidth:n=1280}=e,[r,i]=(0,Ut.useState)(n),[a,o]=(0,Ut.useState)(!t),s=(0,Ut.useRef)(null),c=(0,Ut.useRef)(null),l=(0,Ut.useCallback)(()=>{let e=s.current;if(e){let t=e.offsetWidth;i(t),a||o(!0)}},[a]);return(0,Ut.useEffect)(()=>{let e=s.current;if(e){if(l(),typeof ResizeObserver<`u`){let t=null;return c.current=new ResizeObserver(e=>{let n=e[0];if(n){let e=n.contentRect.width;t!==null&&cancelAnimationFrame(t),t=requestAnimationFrame(()=>{i(e),t=null})}}),c.current.observe(e),()=>{t!==null&&cancelAnimationFrame(t),c.current&&=(c.current.disconnect(),null)}}return()=>{c.current&&=(c.current.disconnect(),null)}}},[l]),{width:r,mounted:a,containerRef:s,measureWidth:l}}var Ut;function Wt(){return(Wt=e((()=>{Ut=r()})))()}var Gt=n(((e,t)=>{t.exports=`SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED`})),Kt=n(((e,t)=>{var n=Gt();function r(){}function i(){}i.resetWarningCache=r,t.exports=function(){function e(e,t,r,i,a,o){if(o!==n){var s=Error("Calling PropTypes validators directly is not supported by the `prop-types` package. Use PropTypes.checkPropTypes() to call them. Read more at http://fb.me/use-check-prop-types");throw s.name=`Invariant Violation`,s}}e.isRequired=e;function t(){return e}var a={array:e,bigint:e,bool:e,func:e,number:e,object:e,string:e,symbol:e,any:e,arrayOf:t,element:e,elementType:e,instanceOf:t,node:e,objectOf:t,oneOf:t,oneOfType:t,shape:t,exact:t,checkPropTypes:i,resetWarningCache:r};return a.PropTypes=a,a}})),qt=n(((e,t)=>{t.exports=Kt()()}));function Jt(e,t){for(let n=0,r=e.length;n<r;n++)if(t.apply(t,[e[n],n,e]))return e[n]}function Yt(e){return typeof e==`function`||Object.prototype.toString.call(e)===`[object Function]`}function Xt(e){return typeof e==`number`&&!isNaN(e)}function q(e){return parseInt(e,10)}function Zt(e,t,n){if(e[t])return Error(`Invalid prop ${t} passed to ${n} - do not set this, set it on the child.`)}function Qt(e=`transform`){if(typeof window>`u`)return``;let t=window.document?.documentElement?.style;if(!t||e in t)return``;for(let n=0;n<In.length;n++)if($t(e,In[n])in t)return In[n];return``}function $t(e,t){return t?`${t}${en(e)}`:e}function en(e){let t=``,n=!0;for(let r=0;r<e.length;r++)n?(t+=e[r].toUpperCase(),n=!1):e[r]===`-`?n=!0:t+=e[r];return t}function tn(e,t){Rn||=Jt([`matches`,`webkitMatchesSelector`,`mozMatchesSelector`,`msMatchesSelector`,`oMatchesSelector`],function(t){return Yt(e[t])})??``;let n=e[Rn];return Yt(n)?!!n.call(e,t):!1}function nn(e,t,n){let r=e;do{if(tn(r,t))return!0;if(r===n)return!1;r=r.parentNode}while(r);return!1}function rn(e,t,n,r){if(!e)return;let i={capture:!0,...r},a=n;e.addEventListener?e.addEventListener(t,a,i):e.attachEvent?e.attachEvent(`on`+t,a):e[`on`+t]=a}function an(e,t,n,r){if(!e)return;let i={capture:!0,...r},a=n;e.removeEventListener?e.removeEventListener(t,a,i):e.detachEvent?e.detachEvent(`on`+t,a):e[`on`+t]=null}function on(e){let t=e.clientHeight,n=e.ownerDocument.defaultView.getComputedStyle(e);return t+=q(n.borderTopWidth),t+=q(n.borderBottomWidth),t}function sn(e){let t=e.clientWidth,n=e.ownerDocument.defaultView.getComputedStyle(e);return t+=q(n.borderLeftWidth),t+=q(n.borderRightWidth),t}function cn(e){let t=e.clientHeight,n=e.ownerDocument.defaultView.getComputedStyle(e);return t-=q(n.paddingTop),t-=q(n.paddingBottom),t}function ln(e){let t=e.clientWidth,n=e.ownerDocument.defaultView.getComputedStyle(e);return t-=q(n.paddingLeft),t-=q(n.paddingRight),t}function un(e,t,n){let r=t===t.ownerDocument.body?{left:0,top:0}:t.getBoundingClientRect();return{x:(e.clientX+t.scrollLeft-r.left)/n,y:(e.clientY+t.scrollTop-r.top)/n}}function dn(e,t){let n=pn(e,t,`px`);return{[$t(`transform`,Ln)]:n}}function fn(e,t){return pn(e,t,``)}function pn({x:e,y:t},n,r){let i=`translate(${e}${r},${t}${r})`;return n&&(i=`translate(${`${typeof n.x==`string`?n.x:n.x+r}`}, ${`${typeof n.y==`string`?n.y:n.y+r}`})`+i),i}function mn(e,t){return e.targetTouches&&Jt(e.targetTouches,e=>t===e.identifier)||e.changedTouches&&Jt(e.changedTouches,e=>t===e.identifier)}function hn(e){if(e.targetTouches&&e.targetTouches[0])return e.targetTouches[0].identifier;if(e.changedTouches&&e.changedTouches[0])return e.changedTouches[0].identifier}function gn(){return typeof __webpack_nonce__<`u`?__webpack_nonce__:void 0}function _n(e,t){if(!e)return;let n=e.getElementById(`react-draggable-style-el`);if(!n){n=e.createElement(`style`),n.type=`text/css`,n.id=`react-draggable-style-el`;let r=t??gn();r&&n.setAttribute(`nonce`,r),n.innerHTML=`.react-draggable-transparent-selection *::-moz-selection {all: inherit;}
`,n.innerHTML+=`.react-draggable-transparent-selection *::selection {all: inherit;}
`,e.getElementsByTagName(`head`)[0].appendChild(n)}e.body&&bn(e.body,`react-draggable-transparent-selection`)}function vn(e){window.requestAnimationFrame?window.requestAnimationFrame(()=>{yn(e)}):yn(e)}function yn(e){if(e)try{e.body&&xn(e.body,`react-draggable-transparent-selection`);let t=e.selection;if(t)t.empty();else{let t=(e.defaultView||window).getSelection();t&&t.type!==`Caret`&&t.removeAllRanges()}}catch{}}function bn(e,t){e.classList?e.classList.add(t):e.className.match(RegExp(`(?:^|\\s)${t}(?!\\S)`))||(e.className+=` ${t}`)}function xn(e,t){e.classList?e.classList.remove(t):e.className=e.className.replace(RegExp(`(?:^|\\s)${t}(?!\\S)`,`g`),``)}function Sn(e,t,n){if(!e.props.bounds)return[t,n];let{bounds:r}=e.props;r=typeof r==`string`?r:kn(r);let i=An(e);if(typeof r==`string`){let{ownerDocument:e}=i,t=e.defaultView;if(!t)throw Error(`Cannot resolve the owner window of the draggable node.`);let n;if(n=r===`parent`?i.parentNode:i.getRootNode().querySelector(r),!(n instanceof t.HTMLElement))throw Error(`Bounds selector "`+r+`" could not find an element.`);let a=n,o=t.getComputedStyle(i),s=t.getComputedStyle(a);r={left:-i.offsetLeft+q(s.paddingLeft)+q(o.marginLeft),top:-i.offsetTop+q(s.paddingTop)+q(o.marginTop),right:ln(a)-sn(i)-i.offsetLeft+q(s.paddingRight)-q(o.marginRight),bottom:cn(a)-on(i)-i.offsetTop+q(s.paddingBottom)-q(o.marginBottom)}}return Xt(r.right)&&(t=Math.min(t,r.right)),Xt(r.bottom)&&(n=Math.min(n,r.bottom)),Xt(r.left)&&(t=Math.max(t,r.left)),Xt(r.top)&&(n=Math.max(n,r.top)),[t,n]}function Cn(e,t,n){return[Math.round(t/e[0])*e[0],Math.round(n/e[1])*e[1]]}function wn(e){return e.props.axis===`both`||e.props.axis===`x`}function Tn(e){return e.props.axis===`both`||e.props.axis===`y`}function En(e,t,n){let r=typeof t==`number`?mn(e,t):null;if(typeof t==`number`&&!r)return null;let i=An(n),a=n.props.offsetParent||i.offsetParent||i.ownerDocument.body;return un(r||e,a,n.props.scale)}function Dn(e,t,n){let r=!Xt(e.lastX),i=An(e);return r?{node:i,deltaX:0,deltaY:0,lastX:t,lastY:n,x:t,y:n}:{node:i,deltaX:t-e.lastX,deltaY:n-e.lastY,lastX:e.lastX,lastY:e.lastY,x:t,y:n}}function On(e,t){let n=e.props.scale;return{node:t.node,x:e.state.x+t.deltaX/n,y:e.state.y+t.deltaY/n,deltaX:t.deltaX/n,deltaY:t.deltaY/n,lastX:e.state.x,lastY:e.state.y}}function kn(e){return{left:e.left,top:e.top,right:e.right,bottom:e.bottom}}function An(e){let t=e.findDOMNode();if(!t)throw Error(`<DraggableCore>: Unmounted during event!`);return t}function jn(...e){({}).DRAGGABLE_DEBUG&&console.log(...e)}var Mn,J,Nn,Pn,Y,Fn,In,Ln,Rn,zn,Bn,Vn,Hn;function Un(){return(Un=e((()=>{Mn=t(r(),1),J=t(qt(),1),Nn=t(c(),1),b(),Pn=t(r(),1),Y=t(qt(),1),Fn=t(c(),1),In=[`Moz`,`Webkit`,`O`,`ms`],Ln=Qt(),Rn=``,zn={touch:{start:`touchstart`,move:`touchmove`,stop:`touchend`},mouse:{start:`mousedown`,move:`mousemove`,stop:`mouseup`}},Bn=zn.mouse,Vn=class extends Pn.Component{constructor(){super(...arguments),this.dragging=!1,this.lastX=NaN,this.lastY=NaN,this.touchIdentifier=null,this.mounted=!1,this.handleDragStart=e=>{if(this.props.onMouseDown(e),!this.props.allowAnyClick&&(typeof e.button==`number`&&e.button!==0||e.ctrlKey))return!1;let t=this.findDOMNode();if(!t||!t.ownerDocument||!t.ownerDocument.body)throw Error(`<DraggableCore> not mounted on DragStart!`);let{ownerDocument:n}=t;if(this.props.disabled||!(e.target instanceof n.defaultView.Node)||this.props.handle&&!nn(e.target,this.props.handle,t)||this.props.cancel&&nn(e.target,this.props.cancel,t))return;e.type===`touchstart`&&!this.props.allowMobileScroll&&e.preventDefault();let r=hn(e);this.touchIdentifier=r;let i=En(e,r,this);if(i==null)return;let{x:a,y:o}=i,s=Dn(this,a,o);jn(`DraggableCore: handleDragStart: %j`,s),jn(`calling`,this.props.onStart),this.props.onStart(e,s)!==!1&&this.mounted!==!1&&(this.props.enableUserSelectHack&&_n(n,this.props.nonce),this.dragging=!0,this.lastX=a,this.lastY=o,rn(n,Bn.move,this.handleDrag),rn(n,Bn.stop,this.handleDragStop))},this.handleDrag=e=>{let t=En(e,this.touchIdentifier,this);if(t==null)return;let{x:n,y:r}=t;if(Array.isArray(this.props.grid)){let e=n-this.lastX,t=r-this.lastY;if([e,t]=Cn(this.props.grid,e,t),!e&&!t)return;n=this.lastX+e,r=this.lastY+t}let i=Dn(this,n,r);if(jn(`DraggableCore: handleDrag: %j`,i),this.props.onDrag(e,i)===!1||this.mounted===!1){try{this.handleDragStop(new MouseEvent(`mouseup`))}catch{let e=document.createEvent(`MouseEvents`);e.initMouseEvent(`mouseup`,!0,!0,window,0,0,0,0,0,!1,!1,!1,!1,0,null),this.handleDragStop(e)}return}this.lastX=n,this.lastY=r},this.handleDragStop=e=>{if(!this.dragging)return;let t=En(e,this.touchIdentifier,this);if(t==null)return;let{x:n,y:r}=t;if(Array.isArray(this.props.grid)){let e=n-this.lastX||0,t=r-this.lastY||0;[e,t]=Cn(this.props.grid,e,t),n=this.lastX+e,r=this.lastY+t}let i=Dn(this,n,r);if(this.props.onStop(e,i)===!1||this.mounted===!1)return!1;let a=this.findDOMNode();a&&this.props.enableUserSelectHack&&vn(a.ownerDocument),jn(`DraggableCore: handleDragStop: %j`,i),this.dragging=!1,this.lastX=NaN,this.lastY=NaN,a&&(jn(`DraggableCore: Removing handlers`),an(a.ownerDocument,Bn.move,this.handleDrag),an(a.ownerDocument,Bn.stop,this.handleDragStop))},this.onMouseDown=e=>(Bn=zn.mouse,this.handleDragStart(e)),this.onMouseUp=e=>(Bn=zn.mouse,this.handleDragStop(e)),this.onTouchStart=e=>(Bn=zn.touch,this.handleDragStart(e)),this.onTouchEnd=e=>(Bn=zn.touch,this.handleDragStop(e))}componentDidMount(){this.mounted=!0;let e=this.findDOMNode();e&&rn(e,zn.touch.start,this.onTouchStart,{passive:!1})}componentWillUnmount(){this.mounted=!1;let e=this.findDOMNode();if(e){let{ownerDocument:t}=e;an(t,zn.mouse.move,this.handleDrag),an(t,zn.touch.move,this.handleDrag),an(t,zn.mouse.stop,this.handleDragStop),an(t,zn.touch.stop,this.handleDragStop),an(e,zn.touch.start,this.onTouchStart,{passive:!1}),this.props.enableUserSelectHack&&vn(t)}}findDOMNode(){if(this.props?.nodeRef)return this.props.nodeRef.current;let e=Fn.default;return typeof e.findDOMNode==`function`?e.findDOMNode(this):(jn(`react-draggable: ReactDOM.findDOMNode is not available in React 19+. You must provide a nodeRef prop. See: https://github.com/react-grid-layout/react-draggable#noderef`),null)}render(){return Pn.cloneElement(Pn.Children.only(this.props.children),{onMouseDown:this.onMouseDown,onMouseUp:this.onMouseUp,onTouchEnd:this.onTouchEnd})}},Vn.displayName=`DraggableCore`,Vn.propTypes={allowAnyClick:Y.default.bool,allowMobileScroll:Y.default.bool,children:Y.default.node.isRequired,disabled:Y.default.bool,enableUserSelectHack:Y.default.bool,offsetParent:function(e,t){if(e[t]&&e[t].nodeType!==1)throw Error(`Draggable's offsetParent must be a DOM Node.`)},grid:Y.default.arrayOf(Y.default.number),handle:Y.default.string,cancel:Y.default.string,nodeRef:Y.default.object,nonce:Y.default.string,onStart:Y.default.func,onDrag:Y.default.func,onStop:Y.default.func,onMouseDown:Y.default.func,scale:Y.default.number,className:Zt,style:Zt,transform:Zt},Vn.defaultProps={allowAnyClick:!1,allowMobileScroll:!1,disabled:!1,enableUserSelectHack:!0,onStart:function(){},onDrag:function(){},onStop:function(){},onMouseDown:function(){},scale:1},Hn=class extends Mn.Component{constructor(e){super(e),this.onDragStart=(e,t)=>{if(jn(`Draggable: onDragStart: %j`,t),this.props.onStart(e,On(this,t))===!1)return!1;this.setState({dragging:!0,dragged:!0})},this.onDrag=(e,t)=>{if(!this.state.dragging)return!1;jn(`Draggable: onDrag: %j`,t);let n=On(this,t),r={x:n.x,y:n.y,slackX:0,slackY:0};if(this.props.bounds){let{x:e,y:t}=r;r.x+=this.state.slackX,r.y+=this.state.slackY;let[i,a]=Sn(this,r.x,r.y);r.x=i,r.y=a,r.slackX=this.state.slackX+(e-r.x),r.slackY=this.state.slackY+(t-r.y),n.x=r.x,n.y=r.y,n.deltaX=r.x-this.state.x,n.deltaY=r.y-this.state.y}if(this.props.onDrag(e,n)===!1)return!1;this.setState(r)},this.onDragStop=(e,t)=>{if(!this.state.dragging||this.props.onStop(e,On(this,t))===!1)return!1;jn(`Draggable: onDragStop: %j`,t);let n={dragging:!1,slackX:0,slackY:0};if(this.props.position){let{x:e,y:t}=this.props.position;n.x=e,n.y=t}this.setState(n)},this.state={dragging:!1,dragged:!1,x:e.position?e.position.x:e.defaultPosition.x,y:e.position?e.position.y:e.defaultPosition.y,prevPropsPosition:{...e.position},slackX:0,slackY:0,isElementSVG:!1},e.position&&!(e.onDrag||e.onStop)&&console.warn("A `position` was applied to this <Draggable>, without drag handlers. This will make this component effectively undraggable. Please attach `onDrag` or `onStop` handlers so you can adjust the `position` of this element.")}static getDerivedStateFromProps({position:e},{prevPropsPosition:t}){return e&&(!t||e.x!==t.x||e.y!==t.y)?(jn(`Draggable: getDerivedStateFromProps %j`,{position:e,prevPropsPosition:t}),{x:e.x,y:e.y,prevPropsPosition:{...e}}):null}componentDidMount(){window.SVGElement!==void 0&&this.findDOMNode()instanceof window.SVGElement&&this.setState({isElementSVG:!0})}componentWillUnmount(){this.state.dragging&&this.setState({dragging:!1})}findDOMNode(){if(this.props?.nodeRef)return this.props.nodeRef.current;let e=Nn.default;return typeof e.findDOMNode==`function`?e.findDOMNode(this):null}render(){let{axis:e,bounds:t,children:n,defaultPosition:r,defaultClassName:i,defaultClassNameDragging:a,defaultClassNameDragged:o,position:s,positionOffset:c,scale:l,...u}=this.props,d={},f=null,p=!s||this.state.dragging,m=s||r,h={x:wn(this)&&p?this.state.x:m.x,y:Tn(this)&&p?this.state.y:m.y};this.state.isElementSVG?f=fn(h,c):d=dn(h,c);let g=Mn.Children.only(n),_=te(g.props.className||``,i,{[a]:this.state.dragging,[o]:this.state.dragged});return Mn.createElement(Vn,{...u,onStart:this.onDragStart,onDrag:this.onDrag,onStop:this.onDragStop},Mn.cloneElement(g,{className:_,style:{...g.props.style,...d},transform:f}))}},Hn.displayName=`Draggable`,Hn.propTypes={...Vn.propTypes,axis:J.default.oneOf([`both`,`x`,`y`,`none`]),bounds:J.default.oneOfType([J.default.shape({left:J.default.number,right:J.default.number,top:J.default.number,bottom:J.default.number}),J.default.string,J.default.oneOf([!1])]),defaultClassName:J.default.string,defaultClassNameDragging:J.default.string,defaultClassNameDragged:J.default.string,defaultPosition:J.default.shape({x:J.default.number,y:J.default.number}),positionOffset:J.default.shape({x:J.default.oneOfType([J.default.number,J.default.string]),y:J.default.oneOfType([J.default.number,J.default.string])}),position:J.default.shape({x:J.default.number,y:J.default.number}),className:Zt,style:Zt,transform:Zt},Hn.defaultProps={...Vn.defaultProps,axis:`both`,bounds:!1,defaultClassName:`react-draggable`,defaultClassNameDragging:`react-draggable-dragging`,defaultClassNameDragged:`react-draggable-dragged`,defaultPosition:{x:0,y:0},scale:1}})))()}function Wn(){return(Wn=e((()=>{Un()})))()}var Gn=n(((e,t)=>{function n(e){var t,r,i=``;if(typeof e==`string`||typeof e==`number`)i+=e;else if(typeof e==`object`){if(Array.isArray(e)){var a=e.length;for(t=0;t<a;t++)e[t]&&(r=n(e[t]))&&(i&&(i+=` `),i+=r)}else for(r in e)e[r]&&(i&&(i+=` `),i+=r)}return i}function r(){for(var e,t,r=0,i=``,a=arguments.length;r<a;r++)(e=arguments[r])&&(t=n(e))&&(i&&(i+=` `),i+=t);return i}t.exports=r,t.exports.clsx=r})),Kn=n(((e,t)=>{var n=Object.create,i=Object.defineProperty,a=Object.getOwnPropertyDescriptor,o=Object.getOwnPropertyNames,s=Object.getPrototypeOf,l=Object.prototype.hasOwnProperty,u=(e,t)=>{for(var n in t)i(e,n,{get:t[n],enumerable:!0})},d=(e,t,n,r)=>{if(t&&typeof t==`object`||typeof t==`function`)for(let s of o(t))!l.call(e,s)&&s!==n&&i(e,s,{get:()=>t[s],enumerable:!(r=a(t,s))||r.enumerable});return e},f=(e,t,r)=>(r=e==null?{}:n(s(e)),d(t||!e||!e.__esModule?i(r,`default`,{value:e,enumerable:!0}):r,e)),p=e=>d(i({},`__esModule`,{value:!0}),e),m={};u(m,{DraggableCore:()=>G,default:()=>be}),t.exports=p(m);var h=f(r()),g=f(qt()),_=f(c()),v=Gn();function y(e,t){for(let n=0,r=e.length;n<r;n++)if(t.apply(t,[e[n],n,e]))return e[n]}function ee(e){return typeof e==`function`||Object.prototype.toString.call(e)===`[object Function]`}function b(e){return typeof e==`number`&&!isNaN(e)}function x(e){return parseInt(e,10)}function te(e,t,n){if(e[t])return Error(`Invalid prop ${t} passed to ${n} - do not set this, set it on the child.`)}var S=[`Moz`,`Webkit`,`O`,`ms`];function C(e=`transform`){if(typeof window>`u`)return``;let t=window.document?.documentElement?.style;if(!t||e in t)return``;for(let n=0;n<S.length;n++)if(w(e,S[n])in t)return S[n];return``}function w(e,t){return t?`${t}${ne(e)}`:e}function ne(e){let t=``,n=!0;for(let r=0;r<e.length;r++)n?(t+=e[r].toUpperCase(),n=!1):e[r]===`-`?n=!0:t+=e[r];return t}var re=C(),ie=``;function T(e,t){ie||=y([`matches`,`webkitMatchesSelector`,`mozMatchesSelector`,`msMatchesSelector`,`oMatchesSelector`],function(t){return ee(e[t])})??``;let n=e[ie];return ee(n)?!!n.call(e,t):!1}function E(e,t,n){let r=e;do{if(T(r,t))return!0;if(r===n)return!1;r=r.parentNode}while(r);return!1}function D(e,t,n,r){if(!e)return;let i={capture:!0,...r},a=n;e.addEventListener?e.addEventListener(t,a,i):e.attachEvent?e.attachEvent(`on`+t,a):e[`on`+t]=a}function O(e,t,n,r){if(!e)return;let i={capture:!0,...r},a=n;e.removeEventListener?e.removeEventListener(t,a,i):e.detachEvent?e.detachEvent(`on`+t,a):e[`on`+t]=null}function k(e){let t=e.clientHeight,n=e.ownerDocument.defaultView.getComputedStyle(e);return t+=x(n.borderTopWidth),t+=x(n.borderBottomWidth),t}function ae(e){let t=e.clientWidth,n=e.ownerDocument.defaultView.getComputedStyle(e);return t+=x(n.borderLeftWidth),t+=x(n.borderRightWidth),t}function A(e){let t=e.clientHeight,n=e.ownerDocument.defaultView.getComputedStyle(e);return t-=x(n.paddingTop),t-=x(n.paddingBottom),t}function oe(e){let t=e.clientWidth,n=e.ownerDocument.defaultView.getComputedStyle(e);return t-=x(n.paddingLeft),t-=x(n.paddingRight),t}function se(e,t,n){let r=t===t.ownerDocument.body?{left:0,top:0}:t.getBoundingClientRect();return{x:(e.clientX+t.scrollLeft-r.left)/n,y:(e.clientY+t.scrollTop-r.top)/n}}function ce(e,t){let n=ue(e,t,`px`);return{[w(`transform`,re)]:n}}function le(e,t){return ue(e,t,``)}function ue({x:e,y:t},n,r){let i=`translate(${e}${r},${t}${r})`;return n&&(i=`translate(${`${typeof n.x==`string`?n.x:n.x+r}`}, ${`${typeof n.y==`string`?n.y:n.y+r}`})`+i),i}function j(e,t){return e.targetTouches&&y(e.targetTouches,e=>t===e.identifier)||e.changedTouches&&y(e.changedTouches,e=>t===e.identifier)}function M(e){if(e.targetTouches&&e.targetTouches[0])return e.targetTouches[0].identifier;if(e.changedTouches&&e.changedTouches[0])return e.changedTouches[0].identifier}function de(){return typeof __webpack_nonce__<`u`?__webpack_nonce__:void 0}function fe(e,t){if(!e)return;let n=e.getElementById(`react-draggable-style-el`);if(!n){n=e.createElement(`style`),n.type=`text/css`,n.id=`react-draggable-style-el`;let r=t??de();r&&n.setAttribute(`nonce`,r),n.innerHTML=`.react-draggable-transparent-selection *::-moz-selection {all: inherit;}
`,n.innerHTML+=`.react-draggable-transparent-selection *::selection {all: inherit;}
`,e.getElementsByTagName(`head`)[0].appendChild(n)}e.body&&F(e.body,`react-draggable-transparent-selection`)}function N(e){window.requestAnimationFrame?window.requestAnimationFrame(()=>{P(e)}):P(e)}function P(e){if(e)try{e.body&&I(e.body,`react-draggable-transparent-selection`);let t=e.selection;if(t)t.empty();else{let t=(e.defaultView||window).getSelection();t&&t.type!==`Caret`&&t.removeAllRanges()}}catch{}}function F(e,t){e.classList?e.classList.add(t):e.className.match(RegExp(`(?:^|\\s)${t}(?!\\S)`))||(e.className+=` ${t}`)}function I(e,t){e.classList?e.classList.remove(t):e.className=e.className.replace(RegExp(`(?:^|\\s)${t}(?!\\S)`,`g`),``)}function pe(e,t,n){if(!e.props.bounds)return[t,n];let{bounds:r}=e.props;r=typeof r==`string`?r:R(r);let i=z(e);if(typeof r==`string`){let{ownerDocument:e}=i,t=e.defaultView;if(!t)throw Error(`Cannot resolve the owner window of the draggable node.`);let n;if(n=r===`parent`?i.parentNode:i.getRootNode().querySelector(r),!(n instanceof t.HTMLElement))throw Error(`Bounds selector "`+r+`" could not find an element.`);let a=n,o=t.getComputedStyle(i),s=t.getComputedStyle(a);r={left:-i.offsetLeft+x(s.paddingLeft)+x(o.marginLeft),top:-i.offsetTop+x(s.paddingTop)+x(o.marginTop),right:oe(a)-ae(i)-i.offsetLeft+x(s.paddingRight)-x(o.marginRight),bottom:A(a)-k(i)-i.offsetTop+x(s.paddingBottom)-x(o.marginBottom)}}return b(r.right)&&(t=Math.min(t,r.right)),b(r.bottom)&&(n=Math.min(n,r.bottom)),b(r.left)&&(t=Math.max(t,r.left)),b(r.top)&&(n=Math.max(n,r.top)),[t,n]}function me(e,t,n){return[Math.round(t/e[0])*e[0],Math.round(n/e[1])*e[1]]}function he(e){return e.props.axis===`both`||e.props.axis===`x`}function ge(e){return e.props.axis===`both`||e.props.axis===`y`}function _e(e,t,n){let r=typeof t==`number`?j(e,t):null;if(typeof t==`number`&&!r)return null;let i=z(n),a=n.props.offsetParent||i.offsetParent||i.ownerDocument.body;return se(r||e,a,n.props.scale)}function ve(e,t,n){let r=!b(e.lastX),i=z(e);return r?{node:i,deltaX:0,deltaY:0,lastX:t,lastY:n,x:t,y:n}:{node:i,deltaX:t-e.lastX,deltaY:n-e.lastY,lastX:e.lastX,lastY:e.lastY,x:t,y:n}}function L(e,t){let n=e.props.scale;return{node:t.node,x:e.state.x+t.deltaX/n,y:e.state.y+t.deltaY/n,deltaX:t.deltaX/n,deltaY:t.deltaY/n,lastX:e.state.x,lastY:e.state.y}}function R(e){return{left:e.left,top:e.top,right:e.right,bottom:e.bottom}}function z(e){let t=e.findDOMNode();if(!t)throw Error(`<DraggableCore>: Unmounted during event!`);return t}var B=f(r()),V=f(qt()),ye=f(c());function H(...e){({}).DRAGGABLE_DEBUG&&console.log(...e)}var U={touch:{start:`touchstart`,move:`touchmove`,stop:`touchend`},mouse:{start:`mousedown`,move:`mousemove`,stop:`mouseup`}},W=U.mouse,G=class extends B.Component{constructor(){super(...arguments),this.dragging=!1,this.lastX=NaN,this.lastY=NaN,this.touchIdentifier=null,this.mounted=!1,this.handleDragStart=e=>{if(this.props.onMouseDown(e),!this.props.allowAnyClick&&(typeof e.button==`number`&&e.button!==0||e.ctrlKey))return!1;let t=this.findDOMNode();if(!t||!t.ownerDocument||!t.ownerDocument.body)throw Error(`<DraggableCore> not mounted on DragStart!`);let{ownerDocument:n}=t;if(this.props.disabled||!(e.target instanceof n.defaultView.Node)||this.props.handle&&!E(e.target,this.props.handle,t)||this.props.cancel&&E(e.target,this.props.cancel,t))return;e.type===`touchstart`&&!this.props.allowMobileScroll&&e.preventDefault();let r=M(e);this.touchIdentifier=r;let i=_e(e,r,this);if(i==null)return;let{x:a,y:o}=i,s=ve(this,a,o);H(`DraggableCore: handleDragStart: %j`,s),H(`calling`,this.props.onStart),this.props.onStart(e,s)!==!1&&this.mounted!==!1&&(this.props.enableUserSelectHack&&fe(n,this.props.nonce),this.dragging=!0,this.lastX=a,this.lastY=o,D(n,W.move,this.handleDrag),D(n,W.stop,this.handleDragStop))},this.handleDrag=e=>{let t=_e(e,this.touchIdentifier,this);if(t==null)return;let{x:n,y:r}=t;if(Array.isArray(this.props.grid)){let e=n-this.lastX,t=r-this.lastY;if([e,t]=me(this.props.grid,e,t),!e&&!t)return;n=this.lastX+e,r=this.lastY+t}let i=ve(this,n,r);if(H(`DraggableCore: handleDrag: %j`,i),this.props.onDrag(e,i)===!1||this.mounted===!1){try{this.handleDragStop(new MouseEvent(`mouseup`))}catch{let e=document.createEvent(`MouseEvents`);e.initMouseEvent(`mouseup`,!0,!0,window,0,0,0,0,0,!1,!1,!1,!1,0,null),this.handleDragStop(e)}return}this.lastX=n,this.lastY=r},this.handleDragStop=e=>{if(!this.dragging)return;let t=_e(e,this.touchIdentifier,this);if(t==null)return;let{x:n,y:r}=t;if(Array.isArray(this.props.grid)){let e=n-this.lastX||0,t=r-this.lastY||0;[e,t]=me(this.props.grid,e,t),n=this.lastX+e,r=this.lastY+t}let i=ve(this,n,r);if(this.props.onStop(e,i)===!1||this.mounted===!1)return!1;let a=this.findDOMNode();a&&this.props.enableUserSelectHack&&N(a.ownerDocument),H(`DraggableCore: handleDragStop: %j`,i),this.dragging=!1,this.lastX=NaN,this.lastY=NaN,a&&(H(`DraggableCore: Removing handlers`),O(a.ownerDocument,W.move,this.handleDrag),O(a.ownerDocument,W.stop,this.handleDragStop))},this.onMouseDown=e=>(W=U.mouse,this.handleDragStart(e)),this.onMouseUp=e=>(W=U.mouse,this.handleDragStop(e)),this.onTouchStart=e=>(W=U.touch,this.handleDragStart(e)),this.onTouchEnd=e=>(W=U.touch,this.handleDragStop(e))}componentDidMount(){this.mounted=!0;let e=this.findDOMNode();e&&D(e,U.touch.start,this.onTouchStart,{passive:!1})}componentWillUnmount(){this.mounted=!1;let e=this.findDOMNode();if(e){let{ownerDocument:t}=e;O(t,U.mouse.move,this.handleDrag),O(t,U.touch.move,this.handleDrag),O(t,U.mouse.stop,this.handleDragStop),O(t,U.touch.stop,this.handleDragStop),O(e,U.touch.start,this.onTouchStart,{passive:!1}),this.props.enableUserSelectHack&&N(t)}}findDOMNode(){if(this.props?.nodeRef)return this.props.nodeRef.current;let e=ye.default;return typeof e.findDOMNode==`function`?e.findDOMNode(this):(H(`react-draggable: ReactDOM.findDOMNode is not available in React 19+. You must provide a nodeRef prop. See: https://github.com/react-grid-layout/react-draggable#noderef`),null)}render(){return B.cloneElement(B.Children.only(this.props.children),{onMouseDown:this.onMouseDown,onMouseUp:this.onMouseUp,onTouchEnd:this.onTouchEnd})}};G.displayName=`DraggableCore`,G.propTypes={allowAnyClick:V.default.bool,allowMobileScroll:V.default.bool,children:V.default.node.isRequired,disabled:V.default.bool,enableUserSelectHack:V.default.bool,offsetParent:function(e,t){if(e[t]&&e[t].nodeType!==1)throw Error(`Draggable's offsetParent must be a DOM Node.`)},grid:V.default.arrayOf(V.default.number),handle:V.default.string,cancel:V.default.string,nodeRef:V.default.object,nonce:V.default.string,onStart:V.default.func,onDrag:V.default.func,onStop:V.default.func,onMouseDown:V.default.func,scale:V.default.number,className:te,style:te,transform:te},G.defaultProps={allowAnyClick:!1,allowMobileScroll:!1,disabled:!1,enableUserSelectHack:!0,onStart:function(){},onDrag:function(){},onStop:function(){},onMouseDown:function(){},scale:1};var be=class extends h.Component{constructor(e){super(e),this.onDragStart=(e,t)=>{if(H(`Draggable: onDragStart: %j`,t),this.props.onStart(e,L(this,t))===!1)return!1;this.setState({dragging:!0,dragged:!0})},this.onDrag=(e,t)=>{if(!this.state.dragging)return!1;H(`Draggable: onDrag: %j`,t);let n=L(this,t),r={x:n.x,y:n.y,slackX:0,slackY:0};if(this.props.bounds){let{x:e,y:t}=r;r.x+=this.state.slackX,r.y+=this.state.slackY;let[i,a]=pe(this,r.x,r.y);r.x=i,r.y=a,r.slackX=this.state.slackX+(e-r.x),r.slackY=this.state.slackY+(t-r.y),n.x=r.x,n.y=r.y,n.deltaX=r.x-this.state.x,n.deltaY=r.y-this.state.y}if(this.props.onDrag(e,n)===!1)return!1;this.setState(r)},this.onDragStop=(e,t)=>{if(!this.state.dragging||this.props.onStop(e,L(this,t))===!1)return!1;H(`Draggable: onDragStop: %j`,t);let n={dragging:!1,slackX:0,slackY:0};if(this.props.position){let{x:e,y:t}=this.props.position;n.x=e,n.y=t}this.setState(n)},this.state={dragging:!1,dragged:!1,x:e.position?e.position.x:e.defaultPosition.x,y:e.position?e.position.y:e.defaultPosition.y,prevPropsPosition:{...e.position},slackX:0,slackY:0,isElementSVG:!1},e.position&&!(e.onDrag||e.onStop)&&console.warn("A `position` was applied to this <Draggable>, without drag handlers. This will make this component effectively undraggable. Please attach `onDrag` or `onStop` handlers so you can adjust the `position` of this element.")}static getDerivedStateFromProps({position:e},{prevPropsPosition:t}){return e&&(!t||e.x!==t.x||e.y!==t.y)?(H(`Draggable: getDerivedStateFromProps %j`,{position:e,prevPropsPosition:t}),{x:e.x,y:e.y,prevPropsPosition:{...e}}):null}componentDidMount(){window.SVGElement!==void 0&&this.findDOMNode()instanceof window.SVGElement&&this.setState({isElementSVG:!0})}componentWillUnmount(){this.state.dragging&&this.setState({dragging:!1})}findDOMNode(){if(this.props?.nodeRef)return this.props.nodeRef.current;let e=_.default;return typeof e.findDOMNode==`function`?e.findDOMNode(this):null}render(){let{axis:e,bounds:t,children:n,defaultPosition:r,defaultClassName:i,defaultClassNameDragging:a,defaultClassNameDragged:o,position:s,positionOffset:c,scale:l,...u}=this.props,d={},f=null,p=!s||this.state.dragging,m=s||r,g={x:he(this)&&p?this.state.x:m.x,y:ge(this)&&p?this.state.y:m.y};this.state.isElementSVG?f=le(g,c):d=ce(g,c);let _=h.Children.only(n),y=(0,v.clsx)(_.props.className||``,i,{[a]:this.state.dragging,[o]:this.state.dragged});return h.createElement(G,{...u,onStart:this.onDragStart,onDrag:this.onDrag,onStop:this.onDragStop},h.cloneElement(_,{className:y,style:{..._.props.style,...d},transform:f}))}};be.displayName=`Draggable`,be.propTypes={...G.propTypes,axis:g.default.oneOf([`both`,`x`,`y`,`none`]),bounds:g.default.oneOfType([g.default.shape({left:g.default.number,right:g.default.number,top:g.default.number,bottom:g.default.number}),g.default.string,g.default.oneOf([!1])]),defaultClassName:g.default.string,defaultClassNameDragging:g.default.string,defaultClassNameDragged:g.default.string,defaultPosition:g.default.shape({x:g.default.number,y:g.default.number}),positionOffset:g.default.shape({x:g.default.oneOfType([g.default.number,g.default.string]),y:g.default.oneOfType([g.default.number,g.default.string])}),position:g.default.shape({x:g.default.number,y:g.default.number}),className:te,style:te,transform:te},be.defaultProps={...G.defaultProps,axis:`both`,bounds:!1,defaultClassName:`react-draggable`,defaultClassNameDragging:`react-draggable-dragging`,defaultClassNameDragged:`react-draggable-dragged`,defaultPosition:{x:0,y:0},scale:1},0&&(t.exports={DraggableCore:G})})),qn=n(((e,t)=>{var n=Kn(),r=n.DraggableCore,i=n.default||n;t.exports=i,t.exports.default=i,t.exports.DraggableCore=r})),Jn=n((e=>{e.__esModule=!0,e.cloneElement=l;var t=n(r());function n(e){return e&&e.__esModule?e:{default:e}}function i(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable})),n.push.apply(n,r)}return n}function a(e){for(var t=1;t<arguments.length;t++){var n=arguments[t]==null?{}:arguments[t];t%2?i(Object(n),!0).forEach(function(t){o(e,t,n[t])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):i(Object(n)).forEach(function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))})}return e}function o(e,t,n){return(t=s(t))in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function s(e){var t=c(e,`string`);return typeof t==`symbol`?t:t+``}function c(e,t){if(typeof e!=`object`||!e)return e;var n=e[Symbol.toPrimitive];if(n!==void 0){var r=n.call(e,t||`default`);if(typeof r!=`object`)return r;throw TypeError(`@@toPrimitive must return a primitive value.`)}return(t===`string`?String:Number)(e)}function l(e,n){return n.style&&e.props.style&&(n.style=a(a({},e.props.style),n.style)),n.className&&e.props.className&&(n.className=e.props.className+` `+n.className),t.default.cloneElement(e,n)}})),Yn=n((e=>{e.__esModule=!0,e.resizableProps=void 0;var t=n(qt());qn();function n(e){return e&&e.__esModule?e:{default:e}}e.resizableProps={axis:t.default.oneOf([`both`,`x`,`y`,`none`]),className:t.default.string,children:t.default.element.isRequired,draggableOpts:t.default.shape({allowAnyClick:t.default.bool,cancel:t.default.string,children:t.default.node,disabled:t.default.bool,enableUserSelectHack:t.default.bool,offsetParent:typeof Element<`u`?t.default.instanceOf(Element):t.default.any,grid:t.default.arrayOf(t.default.number),handle:t.default.string,nodeRef:t.default.object,onStart:t.default.func,onDrag:t.default.func,onStop:t.default.func,onMouseDown:t.default.func,scale:t.default.number}),height:function(){var e=[...arguments];let n=e[0];return n.axis===`both`||n.axis===`y`?t.default.number.isRequired(...e):t.default.number(...e)},handle:t.default.oneOfType([t.default.node,t.default.func]),handleSize:t.default.arrayOf(t.default.number),lockAspectRatio:t.default.bool,maxConstraints:t.default.arrayOf(t.default.number),minConstraints:t.default.arrayOf(t.default.number),onResizeStop:t.default.func,onResizeStart:t.default.func,onResize:t.default.func,resizeHandles:t.default.arrayOf(t.default.oneOf([`s`,`w`,`e`,`n`,`sw`,`nw`,`se`,`ne`])),transformScale:t.default.number,width:function(){var e=[...arguments];let n=e[0];return n.axis===`both`||n.axis===`x`?t.default.number.isRequired(...e):t.default.number(...e)}}})),Xn=n((e=>{e.__esModule=!0,e.default=void 0;var t=s(r()),n=qn(),i=Jn(),a=Yn(),o=[`children`,`className`,`draggableOpts`,`width`,`height`,`handle`,`handleSize`,`lockAspectRatio`,`axis`,`minConstraints`,`maxConstraints`,`onResize`,`onResizeStop`,`onResizeStart`,`resizeHandles`,`transformScale`];function s(e,t){if(typeof WeakMap==`function`)var n=new WeakMap,r=new WeakMap;return(s=function(e,t){if(!t&&e&&e.__esModule)return e;var i,a,o={__proto__:null,default:e};if(e===null||typeof e!=`object`&&typeof e!=`function`)return o;if(i=t?r:n){if(i.has(e))return i.get(e);i.set(e,o)}for(let t in e)t!=="default"&&{}.hasOwnProperty.call(e,t)&&((a=(i=Object.defineProperty)&&Object.getOwnPropertyDescriptor(e,t))&&(a.get||a.set)?i(o,t,a):o[t]=e[t]);return o})(e,t)}function c(){return c=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)({}).hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},c.apply(null,arguments)}function l(e,t){if(e==null)return{};var n={};for(var r in e)if({}.hasOwnProperty.call(e,r)){if(t.indexOf(r)!==-1)continue;n[r]=e[r]}return n}function u(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable})),n.push.apply(n,r)}return n}function d(e){for(var t=1;t<arguments.length;t++){var n=arguments[t]==null?{}:arguments[t];t%2?u(Object(n),!0).forEach(function(t){f(e,t,n[t])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):u(Object(n)).forEach(function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))})}return e}function f(e,t,n){return(t=p(t))in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function p(e){var t=m(e,`string`);return typeof t==`symbol`?t:t+``}function m(e,t){if(typeof e!=`object`||!e)return e;var n=e[Symbol.toPrimitive];if(n!==void 0){var r=n.call(e,t||`default`);if(typeof r!=`object`)return r;throw TypeError(`@@toPrimitive must return a primitive value.`)}return(t===`string`?String:Number)(e)}var h=class extends t.Component{constructor(){super(...arguments),this.handleRefs={},this.lastHandleRect=null,this.slack=null,this.lastSize=null}componentWillUnmount(){this.resetData()}resetData(){this.lastHandleRect=this.slack=this.lastSize=null}runConstraints(e,t){let n=this.props,r=n.minConstraints,i=n.maxConstraints,a=n.lockAspectRatio;if(!r&&!i&&!a)return[e,t];if(a){let n=this.props.width/this.props.height,r=e-this.props.width,i=t-this.props.height;Math.abs(r)>Math.abs(i*n)?t=e/n:e=t*n}let o=e,s=t,c=this.slack||[0,0],l=c[0],u=c[1];return e+=l,t+=u,r&&(e=Math.max(r[0],e),t=Math.max(r[1],t)),i&&(e=Math.min(i[0],e),t=Math.min(i[1],t)),this.slack=[l+(o-e),u+(s-t)],[e,t]}resizeHandler(e,t){return(n,r)=>{let i=r.node,a=r.deltaX,o=r.deltaY;e===`onResizeStart`&&this.resetData();let s=(this.props.axis===`both`||this.props.axis===`x`)&&t!==`n`&&t!==`s`,c=(this.props.axis===`both`||this.props.axis===`y`)&&t!==`e`&&t!==`w`;if(!s&&!c)return;let l=t[0],u=t[t.length-1],d=i.getBoundingClientRect();if(this.lastHandleRect!=null){if(u===`w`){let e=d.left-this.lastHandleRect.left;a+=e}if(l===`n`){let e=d.top-this.lastHandleRect.top;o+=e}}this.lastHandleRect=d,u===`w`&&(a=-a),l===`n`&&(o=-o);let f=this.lastSize?.width??this.props.width,p=this.lastSize?.height??this.props.height,m=f+(s?a/this.props.transformScale:0),h=p+(c?o/this.props.transformScale:0);var g=this.runConstraints(m,h);if(m=g[0],h=g[1],e===`onResizeStop`&&this.lastSize){var _=this.lastSize;m=_.width,h=_.height}let v=m!==f||h!==p;e!==`onResizeStop`&&(this.lastSize={width:m,height:h});let y=typeof this.props[e]==`function`?this.props[e]:null;y&&(e!==`onResize`||v)&&(n.persist==null||n.persist(),y(n,{node:i,size:{width:m,height:h},handle:t})),e===`onResizeStop`&&this.resetData()}}renderResizeHandle(e,n){let r=this.props.handle;if(!r)return t.createElement(`span`,{className:`react-resizable-handle react-resizable-handle-`+e,ref:n});if(typeof r==`function`)return r(e,n);let i=typeof r.type==`string`,a=d({ref:n},i?{}:{handleAxis:e});return t.cloneElement(r,a)}render(){let e=this.props,r=e.children,a=e.className,s=e.draggableOpts;e.width,e.height,e.handle,e.handleSize,e.lockAspectRatio,e.axis,e.minConstraints,e.maxConstraints,e.onResize,e.onResizeStop,e.onResizeStart;let u=e.resizeHandles;e.transformScale;let f=l(e,o);return(0,i.cloneElement)(r,d(d({},f),{},{className:(a?a+` `:``)+`react-resizable`,children:[...t.Children.toArray(r.props.children),...u.map(e=>{let r=this.handleRefs[e]??(this.handleRefs[e]=t.createRef());return t.createElement(n.DraggableCore,c({},s,{nodeRef:r,key:`resizableHandle-`+e,onStop:this.resizeHandler(`onResizeStop`,e),onStart:this.resizeHandler(`onResizeStart`,e),onDrag:this.resizeHandler(`onResize`,e)}),this.renderResizeHandle(e,r))})]}))}};e.default=h,h.propTypes=a.resizableProps,h.defaultProps={axis:`both`,handleSize:[20,20],lockAspectRatio:!1,minConstraints:[20,20],maxConstraints:[1/0,1/0],resizeHandles:[`se`],transformScale:1}})),Zn=n((e=>{e.__esModule=!0,e.default=void 0;var t=c(r()),n=s(qt()),i=s(Xn()),a=Yn(),o=[`handle`,`handleSize`,`onResize`,`onResizeStart`,`onResizeStop`,`draggableOpts`,`minConstraints`,`maxConstraints`,`lockAspectRatio`,`axis`,`width`,`height`,`resizeHandles`,`style`,`transformScale`];function s(e){return e&&e.__esModule?e:{default:e}}function c(e,t){if(typeof WeakMap==`function`)var n=new WeakMap,r=new WeakMap;return(c=function(e,t){if(!t&&e&&e.__esModule)return e;var i,a,o={__proto__:null,default:e};if(e===null||typeof e!=`object`&&typeof e!=`function`)return o;if(i=t?r:n){if(i.has(e))return i.get(e);i.set(e,o)}for(let t in e)t!=="default"&&{}.hasOwnProperty.call(e,t)&&((a=(i=Object.defineProperty)&&Object.getOwnPropertyDescriptor(e,t))&&(a.get||a.set)?i(o,t,a):o[t]=e[t]);return o})(e,t)}function l(){return l=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)({}).hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},l.apply(null,arguments)}function u(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable})),n.push.apply(n,r)}return n}function d(e){for(var t=1;t<arguments.length;t++){var n=arguments[t]==null?{}:arguments[t];t%2?u(Object(n),!0).forEach(function(t){f(e,t,n[t])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):u(Object(n)).forEach(function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))})}return e}function f(e,t,n){return(t=p(t))in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function p(e){var t=m(e,`string`);return typeof t==`symbol`?t:t+``}function m(e,t){if(typeof e!=`object`||!e)return e;var n=e[Symbol.toPrimitive];if(n!==void 0){var r=n.call(e,t||`default`);if(typeof r!=`object`)return r;throw TypeError(`@@toPrimitive must return a primitive value.`)}return(t===`string`?String:Number)(e)}function h(e,t){if(e==null)return{};var n={};for(var r in e)if({}.hasOwnProperty.call(e,r)){if(t.indexOf(r)!==-1)continue;n[r]=e[r]}return n}var g=class extends t.Component{constructor(){super(...arguments),this.state={width:this.props.width,height:this.props.height,propsWidth:this.props.width,propsHeight:this.props.height},this.onResize=(e,t)=>{let n=t.size;this.props.onResize?(e.persist==null||e.persist(),this.setState(n,()=>this.props.onResize&&this.props.onResize(e,t))):this.setState(n)}}static getDerivedStateFromProps(e,t){return t.propsWidth!==e.width||t.propsHeight!==e.height?{width:e.width,height:e.height,propsWidth:e.width,propsHeight:e.height}:null}render(){let e=this.props,n=e.handle,r=e.handleSize;e.onResize;let a=e.onResizeStart,s=e.onResizeStop,c=e.draggableOpts,u=e.minConstraints,f=e.maxConstraints,p=e.lockAspectRatio,m=e.axis;e.width,e.height;let g=e.resizeHandles,_=e.style,v=e.transformScale,y=h(e,o);return t.createElement(i.default,{axis:m,draggableOpts:c,handle:n,handleSize:r,height:this.state.height,lockAspectRatio:p,maxConstraints:f,minConstraints:u,onResizeStart:a,onResize:this.onResize,onResizeStop:s,resizeHandles:g,transformScale:v,width:this.state.width},t.createElement(`div`,l({},y,{style:d(d({},_),{},{width:this.state.width+`px`,height:this.state.height+`px`})})))}};e.default=g,g.propTypes=d(d({},a.resizableProps),{},{children:n.default.element})})),Qn=n(((e,t)=>{t.exports=function(){throw Error(`Don't instantiate Resizable directly! Use require('react-resizable').Resizable`)},t.exports.Resizable=Xn().default,t.exports.ResizableBox=Zn().default}));function $n(e){let{children:t,cols:n,containerWidth:r,margin:i,containerPadding:a,rowHeight:o,maxRows:s,isDraggable:c,isResizable:l,isBounded:u,static:d,useCSSTransforms:f=!0,usePercentages:p=!1,transformScale:m=1,positionStrategy:h,dragThreshold:g=0,droppingPosition:_,className:v=``,style:y,handle:ee=``,cancel:b=``,x,y:S,w:C,h:w,minW:ne=1,maxW:re=1/0,minH:ie=1,maxH:T=1/0,i:E,resizeHandles:D,resizeHandle:O,constraints:k=vt,layoutItem:ae,layout:A=[],onDragStart:oe,onDrag:se,onDragStop:ce,onResizeStart:le,onResize:ue,onResizeStop:j}=e,[M,de]=(0,X.useState)(!1),[fe,N]=(0,X.useState)(!1),P=(0,X.useRef)(null),F=(0,X.useRef)({left:0,top:0}),I=(0,X.useRef)({top:0,left:0,width:0,height:0}),pe=(0,X.useRef)(void 0),me=(0,X.useRef)(A);me.current=A;let he=(0,X.useRef)(null),ge=(0,X.useRef)(null),_e=(0,X.useRef)(!1),ve=(0,X.useRef)({x:0,y:0}),L=(0,X.useRef)(!1),R=(0,X.useMemo)(()=>({cols:n,containerPadding:a,containerWidth:r,margin:i,maxRows:s,rowHeight:o}),[n,a,r,i,s,o]),z=(0,X.useMemo)(()=>({cols:n,maxRows:s,containerWidth:r,containerHeight:0,rowHeight:o,margin:i,layout:[]}),[n,s,r,o,i]),B=(0,X.useCallback)(()=>({...z,layout:me.current}),[z]),V=(0,X.useMemo)(()=>ae??{i:E,x,y:S,w:C,h:w,minW:ne,maxW:re,minH:ie,maxH:T},[ae,E,x,S,C,w,ne,re,ie,T]),ye=(0,X.useCallback)(e=>{if(h?.calcStyle)return h.calcStyle(e);if(f)return $e(e);let t=et(e);return p?{...t,left:tt(e.left/r),width:tt(e.width/r)}:t},[h,f,p,r]),H=(0,X.useCallback)((e,{node:t})=>{if(!oe)return;let{offsetParent:n}=t;if(!n)return;let r=n.getBoundingClientRect(),i=t.getBoundingClientRect(),a=i.left/m,o=r.left/m,s=i.top/m,c=r.top/m,l;if(h?.calcDragPosition){let t=e;l=h.calcDragPosition(t.clientX,t.clientY,t.clientX-i.left,t.clientY-i.top)}else l={left:a-o+n.scrollLeft,top:s-c+n.scrollTop};if(F.current=l,g>0){let t=e;ve.current={x:t.clientX,y:t.clientY},_e.current=!0,L.current=!1,de(!0);return}de(!0);let u=je(R,l.top,l.left),{x:d,y:f}=Ze(k,V,u.x,u.y,B());oe(E,d,f,{e,node:t,newPosition:l})},[oe,m,R,h,g,k,V,B,E]),U=(0,X.useCallback)((e,{node:t,deltaX:n,deltaY:a})=>{if(!se||!M)return;let s=e;if(_e.current&&!L.current){let n=s.clientX-ve.current.x,r=s.clientY-ve.current.y;if(Math.hypot(n,r)<g)return;if(L.current=!0,_e.current=!1,oe){let n=je(R,F.current.top,F.current.left),{x:r,y:i}=Ze(k,V,n.x,n.y,B());oe(E,r,i,{e,node:t,newPosition:F.current})}}let c=F.current.top+a,l=F.current.left+n;if(u){let{offsetParent:e}=t;if(e){let t=e.clientHeight-Oe(w,o,i[1]);c=Ne(c,0,t);let n=De(R),a=r-Oe(C,n,i[0]);l=Ne(l,0,a)}}let d={top:c,left:l};F.current=d;let f=je(R,c,l),{x:p,y:m}=Ze(k,V,f.x,f.y,B());se(E,p,m,{e,node:t,newPosition:d})},[se,oe,M,g,u,w,o,i,R,r,C,E,k,V,B]),W=(0,X.useCallback)((e,{node:t})=>{if(!ce||!M)return;let n=_e.current;if(_e.current=!1,L.current=!1,ve.current={x:0,y:0},n){de(!1),F.current={left:0,top:0};return}let{left:r,top:i}=F.current,a={top:i,left:r};de(!1),F.current={left:0,top:0};let o=je(R,i,r),{x:s,y:c}=Ze(k,V,o.x,o.y,B());ce(E,s,c,{e,node:t,newPosition:a})},[ce,M,R,k,V,B,E]);he.current=H,ge.current=U;let G=(0,X.useCallback)((e,{node:t,size:n,handle:i},a,o)=>{let s=o===`onResizeStart`?le:o===`onResize`?ue:j;if(!s)return;let c;c=t?ot(i,a,n,r):{...n,top:a.top,left:a.left},I.current=c;let l=Me(R,c.width,c.height),{w:u,h:d}=Qe(k,V,l.w,l.h,i,B());s(E,u,d,{e:e.nativeEvent,node:t,size:c,handle:i})},[le,ue,j,r,R,E,k,V,B]),be=(0,X.useCallback)((e,t)=>{N(!0);let n=ke(R,x,S,C,w),r={...t,handle:t.handle};G(e,r,n,`onResizeStart`)},[G,R,x,S,C,w]),xe=(0,X.useCallback)((e,t)=>{let n=ke(R,x,S,C,w),r={...t,handle:t.handle};G(e,r,n,`onResize`)},[G,R,x,S,C,w]),Se=(0,X.useCallback)((e,t)=>{N(!1),I.current={top:0,left:0,width:0,height:0};let n=ke(R,x,S,C,w),r={...t,handle:t.handle};G(e,r,n,`onResizeStop`)},[G,R,x,S,C,w]);(0,X.useEffect)(()=>{if(!_)return;let e=P.current;if(!e)return;let t=pe.current||{left:0,top:0},n=M&&(_.left!==t.left||_.top!==t.top);if(!M){let t={node:e,deltaX:_.left,deltaY:_.top,lastX:0,lastY:0,x:_.left,y:_.top};he.current?.(_.e,t)}else if(n){let t={node:e,deltaX:_.left-F.current.left,deltaY:_.top-F.current.top,lastX:F.current.left,lastY:F.current.top,x:_.left,y:_.top};ge.current?.(_.e,t)}pe.current=_},[_,M,E]);let Ce=ke(R,x,S,C,w,M?F.current:null,fe?I.current:null),K=X.Children.only(t),we=De(R),Te=[Oe(ne,we,i[0]),Oe(ie,o,i[1])],Ee=[Oe(re,we,i[0]),Oe(T,o,i[1])],Ae=K.props,Pe=Ae.className,Fe=Ae.style,Ie=X.cloneElement(K,{ref:P,className:te(`react-grid-item`,Pe,v,{static:d,resizing:fe,"react-draggable":c,"react-draggable-dragging":M,dropping:!!_,cssTransforms:f}),style:{...y,...Fe,...ye(Ce)}}),Le=O;return Ie=(0,or.jsx)(ar.Resizable,{draggableOpts:{disabled:!l},className:l?void 0:`react-resizable-hide`,width:Ce.width,height:Ce.height,minConstraints:Te,maxConstraints:Ee,onResizeStart:be,onResize:xe,onResizeStop:Se,transformScale:m,resizeHandles:D,handle:Le,children:Ie}),Ie=(0,or.jsx)(Vn,{disabled:!c,onStart:H,onDrag:U,onStop:W,handle:ee,cancel:`.react-resizable-handle`+(b?`,`+b:``),scale:m,nodeRef:P,children:Ie}),Ie}function er(e,t){let n=X.Children.toArray(e),r=X.Children.toArray(t);if(n.length!==r.length)return!1;for(let e=0;e<n.length;e++){let t=n[e],i=r[e];if(t?.key!==i?.key)return!1}return!0}function tr(e,t,n,r){let i=[],a=new Set;X.Children.forEach(t,t=>{if(!X.isValidElement(t)||t.key===null)return;let n=String(t.key);a.add(n);let r=e.find(e=>e.i===n);if(r)i.push(Ue(r));else{let e=t.props[`data-grid`];e?i.push({i:n,x:e.x??0,y:e.y??0,w:e.w??1,h:e.h??1,minW:e.minW,maxW:e.maxW,minH:e.minH,maxH:e.maxH,static:e.static,isDraggable:e.isDraggable,isResizable:e.isResizable,resizeHandles:e.resizeHandles,isBounded:e.isBounded}):i.push({i:n,x:0,y:Be(i),w:1,h:1})}});let o=qe(i,{cols:n});return r.compact(o,n)}function nr(e){let{children:t,width:n,gridConfig:r,dragConfig:i,resizeConfig:a,dropConfig:o,positionStrategy:s=kt,compactor:c,constraints:l=vt,layout:u=[],droppingItem:d,autoSize:f=!0,className:p=``,style:m={},innerRef:h,onLayoutChange:g=cr,onDragStart:_=cr,onDrag:v=cr,onDragStop:y=cr,onResizeStart:ee=cr,onResize:b=cr,onResizeStop:x=cr,onDrop:S=cr,onDropDragOver:C=cr}=e,w=(0,X.useMemo)(()=>({...At,...r}),[r]),ne=(0,X.useMemo)(()=>({...jt,...i}),[i]),re=(0,X.useMemo)(()=>({...Mt,...a}),[a]),ie=(0,X.useMemo)(()=>({...Nt,...o}),[o]),{cols:T,rowHeight:E,maxRows:D,margin:O,containerPadding:k}=w,{enabled:ae,bounded:A,handle:oe,cancel:se,threshold:ce}=ne,{enabled:le,handles:ue,handleComponent:j}=re,{enabled:M,defaultItem:de,onDragOver:fe}=ie,N=c??ut(`vertical`),P=N.type,F=N.allowOverlap,I=N.preventCollision??!1,pe=(0,X.useMemo)(()=>d??{i:`__dropping-elem__`,...de},[d,de]),me=s.type===`transform`,he=s.scale,ge=k??O,[_e,ve]=(0,X.useState)(!1),[L,R]=(0,X.useState)(()=>tr(u,t,T,N)),[z,B]=(0,X.useState)(null),[V,ye]=(0,X.useState)(!1),[H,U]=(0,X.useState)(null),[W,G]=(0,X.useState)(),be=(0,X.useRef)(null),xe=(0,X.useRef)(null),Se=(0,X.useRef)(null),Ce=(0,X.useRef)(0),K=(0,X.useRef)(L),we=(0,X.useRef)(u),Te=(0,X.useRef)(t),Ee=(0,X.useRef)(P),ke=(0,X.useRef)(L);ke.current=L,(0,X.useEffect)(()=>{ve(!0),(0,sr.deepEqual)(L,u)||g(L)},[]),(0,X.useEffect)(()=>{if(z||H)return;let e=!(0,sr.deepEqual)(u,we.current),n=!er(t,Te.current),r=P!==Ee.current;if(e||n||r){let n=tr(e?u:L,t,T,N);(0,sr.deepEqual)(n,L)||R(n)}we.current=u,Te.current=t,Ee.current=P},[u,t,T,P,N,z,H,L]),(0,X.useEffect)(()=>{if(!z&&!(0,sr.deepEqual)(L,K.current)){K.current=L;let e=L.filter(e=>e.i!==pe.i);g(e)}},[L,z,g,pe.i]);let je=(0,X.useMemo)(()=>{if(!f)return;let e=Be(L),t=ge[1];return e*E+(e-1)*O[1]+t*2+`px`},[f,L,E,O,ge]),Me=(0,X.useCallback)((e,t,n,r)=>{let i=ke.current,a=Ve(i,e);if(!a)return;let o={w:a.w,h:a.h,x:a.x,y:a.y,i:e};be.current=Ue(a),Se.current=i,B(o),_(i,a,a,null,r.e,r.node)},[_]),Ne=(0,X.useCallback)((e,t,n,r)=>{let i=ke.current,a=be.current,o=Ve(i,e);if(!o)return;let s={w:o.w,h:o.h,x:o.x,y:o.y,i:e},c=Je(i,o,t,n,!0,I,P,T,F);v(c,a,o,s,r.e,r.node),R(N.compact(c,T)),B(s)},[I,P,T,F,N,v]),Pe=(0,X.useCallback)((e,t,n,r)=>{if(!z)return;let i=ke.current,a=be.current,o=Ve(i,e);if(!o)return;let s=Je(i,o,t,n,!0,I,P,T,F),c=N.compact(s,T);y(c,a,o,null,r.e,r.node);let l=Se.current;be.current=null,Se.current=null,B(null),R(c),l&&!(0,sr.deepEqual)(l,c)&&g(c)},[z,I,P,T,F,N,y,g]),Fe=(0,X.useCallback)((e,t,n,r)=>{let i=ke.current,a=Ve(i,e);a&&(xe.current=Ue(a),Se.current=i,ye(!0),ee(i,a,a,null,r.e,r.node))},[ee]),Le=(0,X.useCallback)((e,t,n,r)=>{let i=ke.current,a=xe.current,{handle:o}=r,s=!1,c,l,[u,d]=Ke(i,e,e=>(c=e.x,l=e.y,[`sw`,`w`,`nw`,`n`,`ne`].includes(o)&&([`sw`,`nw`,`w`].includes(o)&&(c=e.x+(e.w-t),t=e.x!==c&&c<0?e.w:t,c=c<0?0:c),[`ne`,`n`,`nw`].includes(o)&&(l=e.y+(e.h-n),n=e.y!==l&&l<0?e.h:n,l=l<0?0:l),s=!0),I&&!F&&Ie(i,{...e,w:t,h:n,x:c??e.x,y:l??e.y}).filter(t=>t.i!==e.i).length>0&&(l=e.y,n=e.h,c=e.x,t=e.w,s=!1),e.w=t,e.h=n,e));if(!d)return;let f=u;s&&c!==void 0&&l!==void 0&&(f=Je(u,d,c,l,!0,I,P,T,F));let p={w:d.w,h:d.h,x:d.x,y:d.y,i:e,static:!0};b(f,a,d,p,r.e,r.node),R(N.compact(f,T)),B(p)},[I,P,T,F,N,b]),Re=(0,X.useCallback)((e,t,n,r)=>{let i=ke.current,a=xe.current,o=Ve(i,e),s=N.compact(i,T);x(s,a,o??null,null,r.e,r.node);let c=Se.current;xe.current=null,Se.current=null,B(null),ye(!1),R(s),c&&!(0,sr.deepEqual)(c,s)&&g(s)},[T,N,x,g]),ze=(0,X.useCallback)(()=>{let e=ke.current;if(!e.some(e=>e.i===pe.i)){U(null),B(null),G(void 0);return}let t=N.compact(e.filter(e=>e.i!==pe.i),T);R(t),U(null),B(null),G(void 0)},[pe.i,T,N]),He=(0,X.useCallback)(e=>{if(e.preventDefault(),e.stopPropagation(),ur&&!e.nativeEvent.target?.classList.contains(lr))return!1;let t=fe?fe(e.nativeEvent):C(e);if(t===!1)return H&&ze(),!1;let{dragOffsetX:r=0,dragOffsetY:i=0,...a}=t??{},o={...pe,...a},s=e.currentTarget.getBoundingClientRect(),c={cols:T,margin:O,maxRows:D,rowHeight:E,containerWidth:n,containerPadding:ge},l=De(c),u=Oe(o.w,l,O[0]),d=Oe(o.h,E,O[1]),f=u/2,p=d/2,m=e.clientX-s.left+r-f,h=e.clientY-s.top+i-p,g=Math.max(0,m),_=Math.max(0,h),v={left:g/he,top:_/he,e:e.nativeEvent};if(H)W&&(W.left!==v.left||W.top!==v.top)&&G(v);else{let e=Ae(c,_,g,o.w,o.h);U((0,or.jsx)(`div`,{},o.i)),G(v);let t=ke.current.filter(e=>e.i!==o.i);R([...t,{...o,x:e.x,y:e.y,static:!1,isDraggable:!0}])}},[H,W,pe,fe,C,ze,he,T,O,D,E,n,ge]),We=(0,X.useCallback)(e=>{e.preventDefault(),e.stopPropagation(),Ce.current--,Ce.current<0&&(Ce.current=0),Ce.current===0&&ze()},[ze]),Ge=(0,X.useCallback)(e=>{e.preventDefault(),e.stopPropagation(),Ce.current++},[]),qe=(0,X.useCallback)(e=>{e.preventDefault(),e.stopPropagation();let t=ke.current,n=t.find(e=>e.i===pe.i);Ce.current=0,ze(),S(t,n,e.nativeEvent)},[pe.i,ze,S]),Ye=(0,X.useCallback)((e,t)=>{if(!e||!e.key)return null;let r=Ve(L,String(e.key));if(!r)return null;let i=typeof r.isDraggable==`boolean`?r.isDraggable:!r.static&&ae,a=typeof r.isResizable==`boolean`?r.isResizable:!r.static&&le,o=r.resizeHandles||[...ue],c=i&&A&&r.isBounded!==!1,u=j;return(0,or.jsx)($n,{containerWidth:n,cols:T,margin:O,containerPadding:ge,maxRows:D,rowHeight:E,cancel:se,handle:oe,onDragStart:Me,onDrag:Ne,onDragStop:Pe,onResizeStart:Fe,onResize:Le,onResizeStop:Re,isDraggable:i,isResizable:a,isBounded:c,useCSSTransforms:me&&_e,usePercentages:!_e,transformScale:he,positionStrategy:s,dragThreshold:ce,w:r.w,h:r.h,x:r.x,y:r.y,i:r.i,minH:r.minH,minW:r.minW,maxH:r.maxH,maxW:r.maxW,static:r.static,droppingPosition:t?W:void 0,resizeHandles:o,resizeHandle:u,constraints:l,layoutItem:r,layout:L,children:e},r.i)},[L,n,T,O,ge,D,E,se,oe,Me,Ne,Pe,Fe,Le,Re,ae,le,A,me,_e,he,s,ce,W,ue,j,l]),Xe=()=>z?(0,or.jsx)($n,{w:z.w,h:z.h,x:z.x,y:z.y,i:z.i,className:`react-grid-placeholder ${V?`placeholder-resizing`:``}`,containerWidth:n,cols:T,margin:O,containerPadding:ge,maxRows:D,rowHeight:E,isDraggable:!1,isResizable:!1,isBounded:!1,useCSSTransforms:me,transformScale:he,constraints:l,layout:L,children:(0,or.jsx)(`div`,{})}):null,Ze=te(lr,p),Qe={height:je,...m};return(0,or.jsxs)(`div`,{ref:h,className:Ze,style:Qe,onDrop:M?qe:void 0,onDragLeave:M?We:void 0,onDragEnter:M?Ge:void 0,onDragOver:M?He:void 0,children:[X.Children.map(t,e=>X.isValidElement(e)?Ye(e):null),M&&H&&Ye(H,!0),Xe()]})}function rr(e,t,n,r){let i=[];X.Children.forEach(t,t=>{if(!X.isValidElement(t)||t.key===null)return;let n=String(t.key),r=e.find(e=>e.i===n);if(r)i.push({...r,i:n});else{let e=t.props[`data-grid`];e?i.push({i:n,x:e.x??0,y:e.y??0,w:e.w??1,h:e.h??1,minW:e.minW,maxW:e.maxW,minH:e.minH,maxH:e.maxH,static:e.static,isDraggable:e.isDraggable,isResizable:e.isResizable,resizeHandles:e.resizeHandles,isBounded:e.isBounded}):i.push({i:n,x:0,y:Be(i),w:1,h:1})}});let a=qe(i,{cols:n});return r.compact(a,n)}function ir(e){let{children:t,width:n,breakpoint:r,breakpoints:i=dr,cols:a=fr,layouts:o={},rowHeight:s=150,maxRows:c=1/0,margin:l=[10,10],containerPadding:u=null,compactor:d,onBreakpointChange:f=pr,onLayoutChange:p=pr,onWidthChange:m=pr,...h}=e,g=d??ut(`vertical`),_=g.type,v=g.allowOverlap,y=(0,X.useMemo)(()=>r??ft(i,n),[]),ee=(0,X.useMemo)(()=>pt(y,a),[y,a]),b=(0,X.useMemo)(()=>mt(o,i,y,y,ee,_),[]),[x,te]=(0,X.useState)(y),[S,C]=(0,X.useState)(ee),[w,ne]=(0,X.useState)(b),[re,ie]=(0,X.useState)(o),T=(0,X.useRef)(n),E=(0,X.useRef)(r),D=(0,X.useRef)(i),O=(0,X.useRef)(a),k=(0,X.useRef)(o),ae=(0,X.useRef)(_),A=(0,X.useRef)(re);(0,X.useEffect)(()=>{A.current=re},[re]);let oe=(0,X.useMemo)(()=>(0,sr.deepEqual)(o,k.current)?null:mt(o,i,x,x,S,g),[o,i,x,S,g]),se=oe??w;(0,X.useEffect)(()=>{oe!==null&&(ne(oe),ie(o),A.current=o,k.current=o)},[oe,o]),(0,X.useEffect)(()=>{if(_!==ae.current){let e=g.compact(We(se),S),t={...A.current,[x]:e};ne(e),ie(t),A.current=t,p(e,t),ae.current=_}},[_,g,se,S,v,x,p]),(0,X.useEffect)(()=>{let e=n!==T.current,o=r!==E.current,s=!(0,sr.deepEqual)(i,D.current),c=!(0,sr.deepEqual)(a,O.current);if(e||o||s||c){let e=r??ft(i,n),o=pt(e,a),d=x;if(d!==e||s||c){let n={...A.current};n[d]||(n[d]=We(w));let r=mt(n,i,e,d,o,g);r=rr(r,t,o,g),n[e]=r,te(e),C(o),ne(r),ie(n),A.current=n,f(e,o),p(r,n)}let h=ht(l,e),_=u?ht(u,e):null;m(n,h,o,_),T.current=n,E.current=r,D.current=i,O.current=a}},[n,r,i,a,x,S,w,t,g,_,v,l,u,f,p,m]);let ce=(0,X.useCallback)(e=>{let t={...A.current,[x]:e};ne(e),ie(t),A.current=t,p(e,t)},[x,p]),le=(0,X.useMemo)(()=>ht(l,x),[l,x]),ue=(0,X.useMemo)(()=>u===null?null:ht(u,x),[u,x]),j=(0,X.useMemo)(()=>({cols:S,rowHeight:s,maxRows:c,margin:le,containerPadding:ue}),[S,s,c,le,ue]);return(0,or.jsx)(nr,{...h,width:n,gridConfig:j,compactor:g,onLayoutChange:ce,layout:se,children:t})}var X,ar,or,sr,cr,lr,ur,dr,fr,pr;function mr(){return(mr=e((()=>{Bt(),X=t(r(),1),Wn(),ar=Qn(),b(),or=l(),sr=Vt(),cr=()=>{},lr=`react-grid-layout`,ur=!1;try{ur=/firefox/i.test(navigator.userAgent)}catch{}dr={lg:1200,md:996,sm:768,xs:480,xxs:0},fr={lg:12,md:10,sm:6,xs:4,xxs:2},pr=()=>{}})))()}var hr,gr;function _r(){return(_r=e((()=>{se(),ae(),hr=e=>(t,n,r)=>(r.revalidateOnFocus=!1,r.revalidateIfStale=!1,r.revalidateOnReconnect=!1,r.refreshInterval=0,e(t,n,r)),gr=le(oe,hr)})))()}function vr({id:e,onClose:t,closeText:n}){let{t:r}=O();return n?(0,Z.jsx)(y,{children:(0,Z.jsxs)(ee,{children:[(0,Z.jsx)(_,{asChild:!0,children:(0,Z.jsx)(w,{type:`button`,variant:`ghost`,size:`2xs`,iconOnly:!0,"aria-label":n,onClick:n=>{n.preventDefault(),t(e)},children:(0,Z.jsx)(D,{})})}),(0,Z.jsx)(v,{children:n})]})}):(0,Z.jsx)(w,{type:`button`,variant:`ghost`,size:`2xs`,iconOnly:!0,"aria-label":r(`common.close`),onClick:n=>{n.preventDefault(),t(e)},children:(0,Z.jsx)(D,{})})}var yr,Z,br;function xr(){return(xr=e((()=>{yr=r(),ne(),E(),x(),C(),fe(),g(),k(),Z=l(),br=(0,yr.forwardRef)(function({title:e,content:t,onClose:n,closeText:r,children:i,id:a,isStatic:o,isDraggable:s,...c},l){let u=!o&&s,d=!o;return(0,Z.jsxs)(`div`,{ref:l,className:`h-full w-full`,...c,children:[(0,Z.jsxs)(N,{size:`sm`,className:`h-full w-full overflow-hidden`,children:[(0,Z.jsxs)(M,{size:`sm`,className:S(`flex flex-row items-center gap-2 py-1`,{"rgl-drag-zone cursor-move":u}),children:[u&&(0,Z.jsx)(re,{size:16}),(0,Z.jsx)(`span`,{className:`flex-1 truncate text-sm font-semibold`,children:e}),d&&(0,Z.jsx)(vr,{id:a,onClose:n,closeText:r})]}),(0,Z.jsx)(de,{className:`flex-1 min-h-0 p-2 overflow-hidden **:data-[slot=chart]:aspect-auto! **:data-[slot=chart]:h-full **:data-[slot=chart]:w-full`,children:t})]}),i]})}),br.__docgenInfo={description:`forwardRef is needed for react-grid-layout
children: used by react-grid-layout to add resize handle`,methods:[],displayName:`GridCard`,props:{title:{required:!0,tsType:{name:`ReactNode`},description:``},content:{required:!0,tsType:{name:`ReactNode`},description:``},children:{required:!1,tsType:{name:`ReactNode`},description:``},id:{required:!0,tsType:{name:`string`},description:``},isStatic:{required:!0,tsType:{name:`boolean`},description:``},isDraggable:{required:!0,tsType:{name:`boolean`},description:``},isResizable:{required:!0,tsType:{name:`boolean`},description:``},onClose:{required:!0,tsType:{name:`signature`,type:`function`,raw:`(id: string) => void`,signature:{arguments:[{type:{name:`string`},name:`id`}],return:{name:`void`}}},description:``},closeText:{required:!1,tsType:{name:`string`},description:``}}}})))()}function Sr({cards:e,activeCards:t,isPristine:n,tooltipText:r,onCheckedChange:i,onReset:a}){let{t:o}=O();return(0,Q.jsxs)(h,{children:[(0,Q.jsx)(y,{children:(0,Q.jsxs)(ee,{children:[(0,Q.jsx)(p,{asChild:!0,children:(0,Q.jsx)(_,{asChild:!0,children:(0,Q.jsx)(w,{type:`button`,variant:`ghost`,size:`2xs`,iconOnly:!0,"aria-label":r,children:(0,Q.jsx)(T,{})})})}),(0,Q.jsx)(v,{children:r})]})}),(0,Q.jsx)(m,{align:`start`,sideOffset:4,className:`w-auto p-3`,children:(0,Q.jsxs)(`div`,{className:`flex flex-col gap-2`,children:[(0,Q.jsx)(`div`,{className:`flex max-h-78.75 flex-col gap-2 overflow-auto`,children:e.map(e=>(0,Q.jsxs)(`label`,{className:`flex cursor-pointer items-center gap-2 text-sm`,children:[(0,Q.jsx)(d,{checked:t.includes(e.id),onCheckedChange:t=>i(e.id,t)}),e.title]},e.id))}),(0,Q.jsx)(`div`,{className:`text-right`,children:(0,Q.jsx)(w,{type:`button`,variant:`link`,size:`xs`,className:`h-auto p-0`,disabled:n,onClick:a,children:o(`common.grid.reset`)})})]})})]})}var Q;function Cr(){return(Cr=e((()=>{ie(),k(),C(),u(),f(),g(),Q=l(),Sr.__docgenInfo={description:``,methods:[],displayName:`GridOptionsMenuSettings`,props:{activeCards:{required:!0,tsType:{name:`Array`,elements:[{name:`string`}],raw:`string[]`},description:``},cards:{required:!0,tsType:{name:`Array`,elements:[{name:`signature`,type:`object`,raw:`{
  id: string;
  content: React.ReactNode;
  title: string | React.ReactNode;
}`,signature:{properties:[{key:`id`,value:{name:`string`,required:!0}},{key:`content`,value:{name:`ReactReactNode`,raw:`React.ReactNode`,required:!0}},{key:`title`,value:{name:`union`,raw:`string | React.ReactNode`,elements:[{name:`string`},{name:`ReactReactNode`,raw:`React.ReactNode`}],required:!0}}]}}],raw:`{
  id: string;
  content: React.ReactNode;
  title: string | React.ReactNode;
}[]`},description:``},tooltipText:{required:!0,tsType:{name:`string`},description:``},isPristine:{required:!0,tsType:{name:`boolean`},description:``},onCheckedChange:{required:!0,tsType:{name:`signature`,type:`function`,raw:`(id: string, checked: boolean) => void`,signature:{arguments:[{type:{name:`string`},name:`id`},{type:{name:`boolean`},name:`checked`}],return:{name:`void`}}},description:``},onReset:{required:!0,tsType:{name:`signature`,type:`function`,raw:`() => void`,signature:{arguments:[],return:{name:`void`}}},description:``}}}})))()}function wr({defaultLayouts:e,cards:t,hasMenuOptionsSettings:n}){let{width:r,containerRef:i,mounted:a}=Ht(),o=(0,Tr.useMemo)(()=>Object.fromEntries(Object.entries(e).map(([e,t])=>[e,(t??[]).map(e=>({...e,static:!0}))])),[e]);return(0,Er.jsx)(`div`,{ref:i,className:`w-full`,children:a&&(0,Er.jsxs)(`div`,{children:[n&&(0,Er.jsx)(`div`,{className:`flex justify-end`,children:(0,Er.jsx)(V,{className:`h-8 w-8`})}),(0,Er.jsx)(ir,{layouts:o,width:r,children:t.map(e=>(0,Er.jsx)(br,{id:e.id,title:(0,Er.jsx)(V,{className:`h-4 w-32`}),content:(0,Er.jsx)(V,{className:`h-full w-full`}),onClose:()=>{},isStatic:!0,isResizable:!1,isDraggable:!1},e.id))})]})})}var Tr,Er;function Dr(){return(Dr=e((()=>{Tr=r(),mr(),Wt(),B(),xr(),Er=l(),wr.__docgenInfo={description:`In loading state, disable drag and resize by forcing static to every card.`,methods:[],displayName:`GridSkeleton`,props:{cards:{required:!0,tsType:{name:`Array`,elements:[{name:`signature`,type:`object`,raw:`{
  id: string;
  content: React.ReactNode;
  title: string | React.ReactNode;
}`,signature:{properties:[{key:`id`,value:{name:`string`,required:!0}},{key:`content`,value:{name:`ReactReactNode`,raw:`React.ReactNode`,required:!0}},{key:`title`,value:{name:`union`,raw:`string | React.ReactNode`,elements:[{name:`string`},{name:`ReactReactNode`,raw:`React.ReactNode`}],required:!0}}]}}],raw:`{
  id: string;
  content: React.ReactNode;
  title: string | React.ReactNode;
}[]`},description:``},defaultLayouts:{required:!0,tsType:{name:`ResponsiveLayouts`},description:``},hasMenuOptionsSettings:{required:!0,tsType:{name:`boolean`},description:``}}}})))()}async function Or(e){return(await ce.getUserPreferences(e.key)).data}async function kr(e,{arg:t}){return(await ce.postUserPreferences(t.key,t.userPreference)).data}function Ar(e,t){let n=Object.keys(e),r={id:t,isStatic:!1,isDraggable:!0,isResizable:!0};for(let i of n){let n=(e[i]??[]).find(e=>e.i===t);if(n)return{id:t,isStatic:n.static??r.isStatic,isDraggable:n.isDraggable??r.isDraggable,isResizable:n.isResizable??r.isResizable}}return console.warn(`grid: ${t} has not been found in layouts`),r}function jr(e,t){let n=Object.keys(e),r={};for(let i of n)r[i]=(e[i]??[]).filter(e=>t.includes(e.i));return r}function Mr(e,t){let n={},r=Object.keys(t);for(let i of r){let r=t[i]??[],a=r.map(e=>e.i),o=(e[i]??[]).filter(e=>!a.includes(e.i));n[i]=[...r,...o]}return n}function Nr(e,t){let n=Object.keys(t);for(let r of n){let n=t[r]??[],i=e[r]??[];if(n.length!==i.length)return!0;for(let e of n){let t=i.find(t=>t.i===e.i);if(!t)return!0;let n=t.x===e.x&&t.y===e.y,r=t.w===e.w&&t.h===e.h;if(!n||!r)return!0}}return!1}function Pr(e,t,n){let r=Object.keys(t);for(let i of r){let r=t[i]??[],a=e[i]??[];if(r.length!==a.length||a.length!==n.length)return!1;for(let e of r){let t=a.find(t=>t.i===e.i);if(!t)return!1;let n=t.x===e.x&&t.y===e.y,r=t.w===e.w&&t.h===e.h;if(!n||!r)return!1}}return!0}function Fr({id:e,defaultLayouts:t,optionsMenuSettings:n,cards:r,gridCardProps:i}){let a=(0,Ir.useMemo)(()=>`resizable-grid-${e}`,[e]),o=(0,Ir.useMemo)(()=>r.map(e=>e.id),[r]),{width:s,containerRef:c,mounted:l}=Ht(),[u,d]=(0,Ir.useState)(o),[f,p]=(0,Ir.useState)(t),[m,h]=(0,Ir.useState)(!1),g=gr(a,()=>Or({key:a}),{shouldRetryOnError:!1}),{trigger:_}=ye(a,kr,{revalidate:!1,populateCache:!1}),v=(0,Ir.useCallback)((e,t)=>{p(e=>Mr(e,t))},[]),y=(0,Ir.useCallback)(()=>{p(t),d(o)},[t,o]),ee=(0,Ir.useCallback)(e=>{d(t=>t.filter(t=>t!==e))},[]),b=(0,Ir.useCallback)((e,t)=>{d(n=>t?[...n,e]:n.filter(t=>t!==e))},[]);return(0,Ir.useEffect)(()=>{if(m||g.isLoading)return;let e=g.data?.content;e?.defaultLayouts&&Nr(e.defaultLayouts,t)||(e?.layouts&&p(e.layouts),e?.activeCards&&d(e.activeCards)),h(!0)},[m,g.isLoading,g.data,u]),(0,Ir.useEffect)(()=>{if(!m)return;let e=setTimeout(()=>{_({key:a,userPreference:{key:a,content:{layouts:f,defaultLayouts:t,activeCards:u}}})},350);return()=>{e&&clearTimeout(e)}},[f,u,m]),(0,Lr.jsx)(`div`,{ref:c,className:`w-full`,children:!m||g.isLoading?(0,Lr.jsx)(wr,{defaultLayouts:t,cards:r,hasMenuOptionsSettings:n.visible}):l&&(0,Lr.jsxs)(`div`,{children:[n.visible&&(0,Lr.jsx)(`div`,{className:`flex justify-end`,children:(0,Lr.jsx)(Sr,{cards:r,activeCards:u,isPristine:Pr(f,t,u),onCheckedChange:b,onReset:y,tooltipText:n.tooltipText})}),(0,Lr.jsx)(ir,{layouts:jr(f,u),width:s,onLayoutChange:v,children:r.filter(e=>u.includes(e.id)).map(e=>{let t=Ar(f,e.id);return(0,Lr.jsx)(br,{id:t.id,content:e.content,title:e.title,onClose:ee,closeText:i?.closeText,isStatic:t.isStatic,isDraggable:t.isDraggable,isResizable:t.isResizable},e.id)})})]})})}var Ir,Lr;function Rr(){return(Rr=e((()=>{Ir=r(),mr(),Wt(),_r(),H(),A(),xr(),Cr(),Dr(),Lr=l(),Fr.__docgenInfo={description:`React-grid-layout default values
Breakpoints
 lg: 12 cols
 md: 10 cols
 sm: 6 cols
 xs: 4 cols
 xxs: 2 cols

Layout
 i: string; Unique identifier (must match child key)
 x: number; X position in grid units
 y: number; Y position in grid units
 w: number; Width in grid units
 h: number; Height in grid units
 minW?: number; Minimum width (default: 0)
 maxW?: number; Maximum width (default: Infinity)
 minH?: number; Minimum height (default: 0)
 maxH?: number; Maximum height (default: Infinity)
 static?: boolean; If true, not draggable or resizable
 isDraggable?: boolean; Override grid isDraggable
 isResizable?: boolean; Override grid isResizable
 isBounded?: boolean; Override grid isBounded`,methods:[],displayName:`Grid`,props:{id:{required:!0,tsType:{name:`string`},description:``},cards:{required:!0,tsType:{name:`Array`,elements:[{name:`signature`,type:`object`,raw:`{
  id: string;
  content: React.ReactNode;
  title: string | React.ReactNode;
}`,signature:{properties:[{key:`id`,value:{name:`string`,required:!0}},{key:`content`,value:{name:`ReactReactNode`,raw:`React.ReactNode`,required:!0}},{key:`title`,value:{name:`union`,raw:`string | React.ReactNode`,elements:[{name:`string`},{name:`ReactReactNode`,raw:`React.ReactNode`}],required:!0}}]}}],raw:`{
  id: string;
  content: React.ReactNode;
  title: string | React.ReactNode;
}[]`},description:``},defaultLayouts:{required:!0,tsType:{name:`ResponsiveLayouts`},description:``},optionsMenuSettings:{required:!0,tsType:{name:`union`,raw:`{ visible: true; tooltipText: string } | { visible: false; tooltipText?: string }`,elements:[{name:`signature`,type:`object`,raw:`{ visible: true; tooltipText: string }`,signature:{properties:[{key:`visible`,value:{name:`literal`,value:`true`,required:!0}},{key:`tooltipText`,value:{name:`string`,required:!0}}]}},{name:`signature`,type:`object`,raw:`{ visible: false; tooltipText?: string }`,signature:{properties:[{key:`visible`,value:{name:`literal`,value:`false`,required:!0}},{key:`tooltipText`,value:{name:`string`,required:!1}}]}}]},description:``},gridCardProps:{required:!1,tsType:{name:`signature`,type:`object`,raw:`{
  closeText: string;
}`,signature:{properties:[{key:`closeText`,value:{name:`string`,required:!0}}]}},description:``}}}})))()}var $,zr,Br,Vr,Hr,Ur,Wr,Gr,Kr,qr,Jr;function Yr(){return(Yr=e((()=>{Rr(),ue(),me(),pe(),ve(),ge(),be(),xe(),W(),we(),Te(),o(),a(),$=l(),zr={title:`Components/Grids/Grid`,component:Fr,args:{id:`storybook-default`,cards:[{id:`1`,title:`Most Frequent Phenotype (HPO)`,content:(0,$.jsx)(P,{...I})},{id:`2`,title:`Most Frequent Diagnoses (MONDO)`,content:(0,$.jsx)(P,{...F})},{id:`3`,title:`Demographics`,content:(0,$.jsx)(`div`,{className:`flex gap-2 h-full p-2`,children:[he,z,_e].map((e,t)=>(0,$.jsx)(`div`,{className:`flex-1 min-w-0 h-full`,children:(0,$.jsx)(R,{...e})},t))})},{id:`4`,title:`Studies`,content:(0,$.jsx)(R,{...L})},{id:`5`,title:`Age at First Patient Engagement (years)`,content:(0,$.jsx)(U,{...Ce})},{id:`6`,title:`Age at First Patient Engagement (years) (Include)`,content:(0,$.jsx)(Se,{...G})}],defaultLayouts:{lg:[{i:`1`,x:0,y:0,w:6,h:3},{i:`2`,x:6,y:0,w:6,h:3},{i:`3`,x:0,y:3,w:4,h:2},{i:`4`,x:4,y:3,w:2,h:2},{i:`5`,x:6,y:3,w:6,h:2},{i:`6`,x:0,y:5,w:6,h:3}],md:[{i:`1`,x:0,y:0,w:5,h:3},{i:`2`,x:5,y:0,w:5,h:3},{i:`3`,x:0,y:3,w:3,h:2},{i:`4`,x:3,y:3,w:2,h:2},{i:`5`,x:5,y:3,w:5,h:2},{i:`6`,x:0,y:5,w:5,h:3}],sm:[{i:`1`,x:0,y:0,w:3,h:3},{i:`2`,x:3,y:0,w:3,h:3},{i:`3`,x:0,y:3,w:4,h:2},{i:`4`,x:4,y:3,w:2,h:2},{i:`5`,x:0,y:5,w:3,h:2},{i:`6`,x:3,y:5,w:3,h:2}],xs:[{i:`1`,x:0,y:0,w:4,h:3},{i:`2`,x:0,y:3,w:4,h:3},{i:`3`,x:0,y:6,w:4,h:2},{i:`4`,x:0,y:8,w:4,h:2},{i:`5`,x:0,y:10,w:4,h:2},{i:`6`,x:0,y:12,w:4,h:3}],xxs:[{i:`1`,x:0,y:0,w:2,h:3},{i:`2`,x:0,y:3,w:2,h:3},{i:`3`,x:0,y:6,w:2,h:2},{i:`4`,x:0,y:8,w:2,h:2},{i:`5`,x:0,y:10,w:2,h:2},{i:`6`,x:0,y:12,w:2,h:3}]},optionsMenuSettings:{visible:!0,tooltipText:`Charts`},gridCardProps:{closeText:`Remove Chart`}}},Br={parameters:{msw:{handlers:[s.get(K,async()=>(await Ee(1e4),i.json({content:{layouts:{lg:[{i:`1`,x:0,y:0,w:4,h:4},{i:`2`,x:4,y:0,w:8,h:2},{i:`3`,x:4,y:2,w:8,h:2},{i:`4`,x:0,y:4,w:3,h:2},{i:`5`,x:3,y:4,w:9,h:3},{i:`6`,x:0,y:7,w:12,h:4}],md:[{i:`1`,x:0,y:0,w:4,h:4},{i:`2`,x:4,y:0,w:6,h:2},{i:`3`,x:4,y:2,w:6,h:2},{i:`4`,x:0,y:4,w:3,h:2},{i:`5`,x:3,y:4,w:7,h:3},{i:`6`,x:0,y:7,w:10,h:4}],sm:[{i:`1`,x:0,y:0,w:6,h:3},{i:`2`,x:0,y:3,w:3,h:2},{i:`3`,x:3,y:3,w:3,h:2},{i:`4`,x:0,y:5,w:2,h:2},{i:`5`,x:2,y:5,w:4,h:3},{i:`6`,x:0,y:8,w:6,h:4}],xs:[{i:`1`,x:0,y:0,w:4,h:4},{i:`2`,x:0,y:4,w:4,h:2},{i:`3`,x:0,y:6,w:4,h:2},{i:`4`,x:0,y:8,w:4,h:2},{i:`5`,x:0,y:10,w:4,h:3},{i:`6`,x:0,y:13,w:4,h:4}],xxs:[{i:`1`,x:0,y:0,w:2,h:4},{i:`2`,x:0,y:4,w:2,h:2},{i:`3`,x:0,y:6,w:2,h:2},{i:`4`,x:0,y:8,w:2,h:2},{i:`5`,x:0,y:10,w:2,h:3},{i:`6`,x:0,y:13,w:2,h:4}]}}}))),s.post(K,async()=>new i({status:200}))]}},args:{id:`storybook-loading`},render:e=>(0,$.jsx)(j,{title:`Grid - Loading state: skeleton is shown while user preferences are being fetched (10s delay). Refresh to replay.`,children:(0,$.jsx)(Fr,{...e})})},Vr={parameters:{msw:{handlers:[s.post(K,async()=>new i({status:200}))]}},render:e=>(0,$.jsx)(j,{title:`Grid - Fresh state: no saved user preferences, so the grid renders from the defaultLayouts prop with every card active.`,children:(0,$.jsx)(Fr,{...e})})},Hr={parameters:{msw:{handlers:[s.get(K,async()=>(await Ee(250),i.json({content:{layouts:{lg:[{i:`1`,x:0,y:0,w:4,h:4},{i:`2`,x:4,y:0,w:8,h:2},{i:`3`,x:4,y:2,w:8,h:2},{i:`4`,x:0,y:4,w:3,h:2},{i:`5`,x:3,y:4,w:9,h:3},{i:`6`,x:0,y:7,w:12,h:4}],md:[{i:`1`,x:0,y:0,w:4,h:4},{i:`2`,x:4,y:0,w:6,h:2},{i:`3`,x:4,y:2,w:6,h:2},{i:`4`,x:0,y:4,w:3,h:2},{i:`5`,x:3,y:4,w:7,h:3},{i:`6`,x:0,y:7,w:10,h:4}],sm:[{i:`1`,x:0,y:0,w:6,h:3},{i:`2`,x:0,y:3,w:3,h:2},{i:`3`,x:3,y:3,w:3,h:2},{i:`4`,x:0,y:5,w:2,h:2},{i:`5`,x:2,y:5,w:4,h:3},{i:`6`,x:0,y:8,w:6,h:4}],xs:[{i:`1`,x:0,y:0,w:4,h:4},{i:`2`,x:0,y:4,w:4,h:2},{i:`3`,x:0,y:6,w:4,h:2},{i:`4`,x:0,y:8,w:4,h:2},{i:`5`,x:0,y:10,w:4,h:3},{i:`6`,x:0,y:13,w:4,h:4}],xxs:[{i:`1`,x:0,y:0,w:2,h:4},{i:`2`,x:0,y:4,w:2,h:2},{i:`3`,x:0,y:6,w:2,h:2},{i:`4`,x:0,y:8,w:2,h:2},{i:`5`,x:0,y:10,w:2,h:3},{i:`6`,x:0,y:13,w:2,h:4}]},defaultLayouts:{lg:[{i:`1`,x:0,y:0,w:6,h:3},{i:`2`,x:6,y:0,w:6,h:3},{i:`3`,x:0,y:3,w:4,h:2},{i:`4`,x:4,y:3,w:2,h:2},{i:`5`,x:6,y:3,w:6,h:2},{i:`6`,x:0,y:5,w:6,h:3}],md:[{i:`1`,x:0,y:0,w:5,h:3},{i:`2`,x:5,y:0,w:5,h:3},{i:`3`,x:0,y:3,w:3,h:2},{i:`4`,x:3,y:3,w:2,h:2},{i:`5`,x:5,y:3,w:5,h:2},{i:`6`,x:0,y:5,w:5,h:3}],sm:[{i:`1`,x:0,y:0,w:3,h:3},{i:`2`,x:3,y:0,w:3,h:3},{i:`3`,x:0,y:3,w:4,h:2},{i:`4`,x:4,y:3,w:2,h:2},{i:`5`,x:0,y:5,w:3,h:2},{i:`6`,x:3,y:5,w:3,h:2}],xs:[{i:`1`,x:0,y:0,w:4,h:3},{i:`2`,x:0,y:3,w:4,h:3},{i:`3`,x:0,y:6,w:4,h:2},{i:`4`,x:0,y:8,w:4,h:2},{i:`5`,x:0,y:10,w:4,h:2},{i:`6`,x:0,y:12,w:4,h:3}],xxs:[{i:`1`,x:0,y:0,w:2,h:3},{i:`2`,x:0,y:3,w:2,h:3},{i:`3`,x:0,y:6,w:2,h:2},{i:`4`,x:0,y:8,w:2,h:2},{i:`5`,x:0,y:10,w:2,h:2},{i:`6`,x:0,y:12,w:2,h:3}]},activeCards:[`1`,`2`,`4`,`5`,`6`]}}))),s.post(K,async()=>new i({status:200}))]}},args:{id:`storybook-edited`},render:e=>(0,$.jsx)(j,{title:`Grid - Restored state: saved defaultLayouts match the current config, so the user's custom layouts and activeCards are loaded from preferences (Demographics is inactive).`,children:(0,$.jsx)(Fr,{...e})})},Ur={parameters:{msw:{handlers:[s.get(K,async()=>(await Ee(250),i.json({content:{layouts:{lg:[{i:`1`,x:0,y:0,w:4,h:4},{i:`2`,x:4,y:0,w:8,h:2},{i:`3`,x:4,y:2,w:8,h:2},{i:`4`,x:0,y:4,w:3,h:2},{i:`5`,x:3,y:4,w:9,h:3}],md:[{i:`1`,x:0,y:0,w:4,h:4},{i:`2`,x:4,y:0,w:6,h:2},{i:`3`,x:4,y:2,w:6,h:2},{i:`4`,x:0,y:4,w:3,h:2},{i:`5`,x:3,y:4,w:7,h:3}],sm:[{i:`1`,x:0,y:0,w:6,h:3},{i:`2`,x:0,y:3,w:3,h:2},{i:`3`,x:3,y:3,w:3,h:2},{i:`4`,x:0,y:5,w:2,h:2},{i:`5`,x:2,y:5,w:4,h:3}],xs:[{i:`1`,x:0,y:0,w:4,h:4},{i:`2`,x:0,y:4,w:4,h:2},{i:`3`,x:0,y:6,w:4,h:2},{i:`4`,x:0,y:8,w:4,h:2},{i:`5`,x:0,y:10,w:4,h:3}],xxs:[{i:`1`,x:0,y:0,w:2,h:4},{i:`2`,x:0,y:4,w:2,h:2},{i:`3`,x:0,y:6,w:2,h:2},{i:`4`,x:0,y:8,w:2,h:2},{i:`5`,x:0,y:10,w:2,h:3}]},defaultLayouts:{lg:[{i:`1`,x:0,y:0,w:6,h:3},{i:`2`,x:6,y:0,w:6,h:3},{i:`3`,x:0,y:3,w:4,h:2},{i:`4`,x:4,y:3,w:2,h:2},{i:`5`,x:6,y:3,w:6,h:2}],md:[{i:`1`,x:0,y:0,w:5,h:3},{i:`2`,x:5,y:0,w:5,h:3},{i:`3`,x:0,y:3,w:3,h:2},{i:`4`,x:3,y:3,w:2,h:2},{i:`5`,x:5,y:3,w:5,h:2}],sm:[{i:`1`,x:0,y:0,w:3,h:3},{i:`2`,x:3,y:0,w:3,h:3},{i:`3`,x:0,y:3,w:4,h:2},{i:`4`,x:4,y:3,w:2,h:2},{i:`5`,x:0,y:5,w:3,h:2}],xs:[{i:`1`,x:0,y:0,w:4,h:3},{i:`2`,x:0,y:3,w:4,h:3},{i:`3`,x:0,y:6,w:4,h:2},{i:`4`,x:0,y:8,w:4,h:2},{i:`5`,x:0,y:10,w:4,h:2}],xxs:[{i:`1`,x:0,y:0,w:2,h:3},{i:`2`,x:0,y:3,w:2,h:3},{i:`3`,x:0,y:6,w:2,h:2},{i:`4`,x:0,y:8,w:2,h:2},{i:`5`,x:0,y:10,w:2,h:2}]},activeCards:[`1`,`2`,`4`,`5`]}}))),s.post(K,async()=>new i({status:200}))]}},args:{id:`storybook-default-layouts-updated`},render:e=>(0,$.jsx)(j,{title:`Grid - Conflict recovery: saved defaultLayouts are stale (missing card '6'), so the local defaultLayouts win and the saved layouts/activeCards are discarded to prevent inconsistencies.`,children:(0,$.jsx)(Fr,{...e})})},Wr={parameters:{msw:{handlers:[s.post(K,async()=>new i({status:200}))]}},args:{id:`storybook-hidden`,cards:[{id:`1`,title:`Most Frequent Phenotype (HPO)`,content:(0,$.jsx)(P,{...I})},{id:`2`,title:`Most Frequent Diagnoses (MONDO)`,content:(0,$.jsx)(P,{...F})},{id:`3`,title:`Demographics`,content:(0,$.jsx)(`div`,{className:`flex gap-2 h-full p-2`,children:[he,z,_e].map((e,t)=>(0,$.jsx)(`div`,{className:`flex-1 min-w-0 h-full`,children:(0,$.jsx)(R,{...e})},t))})},{id:`4`,title:`Studies`,content:(0,$.jsx)(R,{...L})},{id:`5`,title:`Age at First Patient Engagement (years)`,content:(0,$.jsx)(U,{...Ce})},{id:`6`,title:`Age at First Patient Engagement (years) (Include)`,content:(0,$.jsx)(Se,{...G})}],optionsMenuSettings:{visible:!1}},render:e=>(0,$.jsx)(j,{title:`Grid - optionsMenuSettings.visible is false: the top-right settings menu (toggle cards, reset layout) is hidden — cards can still be closed individually.`,children:(0,$.jsx)(Fr,{...e})})},Gr={parameters:{msw:{handlers:[s.post(K,async()=>new i({status:200}))]}},args:{id:`storybook-all-static`,cards:[{id:`1`,title:`Most Frequent Phenotype (HPO)`,content:(0,$.jsx)(P,{...I})},{id:`2`,title:`Most Frequent Diagnoses (MONDO)`,content:(0,$.jsx)(P,{...F})},{id:`3`,title:`Studies`,content:(0,$.jsx)(R,{...L})},{id:`4`,title:`Age at First Patient Engagement (years)`,content:(0,$.jsx)(U,{...Ce})}],defaultLayouts:{lg:[{i:`1`,x:0,y:0,w:6,h:3,static:!0},{i:`2`,x:6,y:0,w:6,h:3,static:!0},{i:`3`,x:0,y:3,w:6,h:3,static:!0},{i:`4`,x:6,y:3,w:6,h:3,static:!0}],md:[{i:`1`,x:0,y:0,w:5,h:3,static:!0},{i:`2`,x:5,y:0,w:5,h:3,static:!0},{i:`3`,x:0,y:3,w:5,h:3,static:!0},{i:`4`,x:5,y:3,w:5,h:3,static:!0}],sm:[{i:`1`,x:0,y:0,w:3,h:3,static:!0},{i:`2`,x:3,y:0,w:3,h:3,static:!0},{i:`3`,x:0,y:3,w:3,h:3,static:!0},{i:`4`,x:3,y:3,w:3,h:3,static:!0}],xs:[{i:`1`,x:0,y:0,w:4,h:3,static:!0},{i:`2`,x:0,y:3,w:4,h:3,static:!0},{i:`3`,x:0,y:6,w:4,h:3,static:!0},{i:`4`,x:0,y:9,w:4,h:3,static:!0}],xxs:[{i:`1`,x:0,y:0,w:2,h:3,static:!0},{i:`2`,x:0,y:3,w:2,h:3,static:!0},{i:`3`,x:0,y:6,w:2,h:3,static:!0},{i:`4`,x:0,y:9,w:2,h:3,static:!0}]}},render:e=>(0,$.jsx)(j,{title:`Grid - Fully static grid: every card shares the same width/height, and no card can be dragged or resized.`,children:(0,$.jsx)(Fr,{...e})})},Kr={parameters:{msw:{handlers:[s.post(K,async()=>new i({status:200}))]}},args:{id:`storybook-draggable-only`,defaultLayouts:{lg:[{i:`1`,x:0,y:0,w:4,h:3,isResizable:!1},{i:`2`,x:4,y:0,w:4,h:3,isResizable:!1},{i:`3`,x:8,y:0,w:4,h:3,isResizable:!1},{i:`4`,x:0,y:3,w:4,h:3,isResizable:!1},{i:`5`,x:4,y:3,w:4,h:3,isResizable:!1},{i:`6`,x:8,y:3,w:4,h:3,isResizable:!1}],md:[{i:`1`,x:0,y:0,w:3,h:3,isResizable:!1},{i:`2`,x:3,y:0,w:3,h:3,isResizable:!1},{i:`3`,x:6,y:0,w:3,h:3,isResizable:!1},{i:`4`,x:0,y:3,w:3,h:3,isResizable:!1},{i:`5`,x:3,y:3,w:3,h:3,isResizable:!1},{i:`6`,x:6,y:3,w:3,h:3,isResizable:!1}],sm:[{i:`1`,x:0,y:0,w:2,h:3,isResizable:!1},{i:`2`,x:2,y:0,w:2,h:3,isResizable:!1},{i:`3`,x:4,y:0,w:2,h:3,isResizable:!1},{i:`4`,x:0,y:3,w:2,h:3,isResizable:!1},{i:`5`,x:2,y:3,w:2,h:3,isResizable:!1},{i:`6`,x:4,y:3,w:2,h:3,isResizable:!1}],xs:[{i:`1`,x:0,y:0,w:4,h:3,isResizable:!1},{i:`2`,x:0,y:3,w:4,h:3,isResizable:!1},{i:`3`,x:0,y:6,w:4,h:3,isResizable:!1},{i:`4`,x:0,y:9,w:4,h:3,isResizable:!1},{i:`5`,x:0,y:12,w:4,h:3,isResizable:!1},{i:`6`,x:0,y:15,w:4,h:3,isResizable:!1}],xxs:[{i:`1`,x:0,y:0,w:2,h:3,isResizable:!1},{i:`2`,x:0,y:3,w:2,h:3,isResizable:!1},{i:`3`,x:0,y:6,w:2,h:3,isResizable:!1},{i:`4`,x:0,y:9,w:2,h:3,isResizable:!1},{i:`5`,x:0,y:12,w:2,h:3,isResizable:!1},{i:`6`,x:0,y:15,w:2,h:3,isResizable:!1}]}},render:e=>(0,$.jsx)(j,{title:`Grid - Draggable only: cards keep their fixed width/height (isResizable: false), but can still be dragged to reorder the grid.`,children:(0,$.jsx)(Fr,{...e})})},qr={parameters:{msw:{handlers:[s.post(K,async()=>new i({status:200}))]}},args:{id:`storybook-resizable-card`,gridCardProps:{closeText:`Remove Card`},cards:[{id:`1`,title:`static: true`,content:(0,$.jsx)(P,{...I})},{id:`2`,title:`isDraggable: false`,content:(0,$.jsx)(P,{...I})},{id:`3`,title:`isResizable: false`,content:(0,$.jsx)(P,{...I})},{id:`4`,title:`isBounded: false`,content:(0,$.jsx)(P,{...I})}],defaultLayouts:{lg:[{i:`1`,x:0,y:0,w:6,h:3,static:!0},{i:`2`,x:6,y:0,w:6,h:3,isDraggable:!1},{i:`3`,x:0,y:3,w:6,h:3,isResizable:!1},{i:`4`,x:6,y:3,w:6,h:3,isBounded:!1}],md:[{i:`1`,x:0,y:0,w:5,h:3,static:!0},{i:`2`,x:5,y:0,w:5,h:3,isDraggable:!1},{i:`3`,x:0,y:3,w:5,h:3,isResizable:!1},{i:`4`,x:5,y:3,w:5,h:3,isBounded:!1}],sm:[{i:`1`,x:0,y:0,w:3,h:3,static:!0},{i:`2`,x:3,y:0,w:3,h:3,isDraggable:!1},{i:`3`,x:0,y:3,w:4,h:3,isResizable:!1},{i:`4`,x:4,y:3,w:4,h:3,isBounded:!1}],xs:[{i:`1`,x:0,y:0,w:4,h:3,static:!0},{i:`2`,x:0,y:3,w:4,h:3,isDraggable:!1},{i:`3`,x:0,y:6,w:4,h:3,isResizable:!1},{i:`4`,x:0,y:9,w:4,h:3,isBounded:!1}],xxs:[{i:`1`,x:0,y:0,w:2,h:3,static:!0},{i:`2`,x:0,y:3,w:2,h:3,isDraggable:!1},{i:`3`,x:0,y:6,w:2,h:3,isResizable:!1},{i:`4`,x:0,y:9,w:2,h:3,isBounded:!1}]}},render:e=>(0,$.jsx)(j,{title:`Grid - Per-card LayoutItem flags: each card demonstrates a different behavior (static, isDraggable: false, isResizable: false, isBounded: false). Close text has been changed.`,children:(0,$.jsx)(Fr,{...e})})},Br.parameters={...Br.parameters,docs:{...Br.parameters?.docs,source:{originalSource:`{
  parameters: {
    msw: {
      handlers: [http.get(userPreferenceApi, async () => {
        await delay(10000);
        return HttpResponse.json({
          content: {
            layouts: {
              lg: [{
                i: '1',
                x: 0,
                y: 0,
                w: 4,
                h: 4
              }, {
                i: '2',
                x: 4,
                y: 0,
                w: 8,
                h: 2
              }, {
                i: '3',
                x: 4,
                y: 2,
                w: 8,
                h: 2
              }, {
                i: '4',
                x: 0,
                y: 4,
                w: 3,
                h: 2
              }, {
                i: '5',
                x: 3,
                y: 4,
                w: 9,
                h: 3
              }, {
                i: '6',
                x: 0,
                y: 7,
                w: 12,
                h: 4
              }],
              md: [{
                i: '1',
                x: 0,
                y: 0,
                w: 4,
                h: 4
              }, {
                i: '2',
                x: 4,
                y: 0,
                w: 6,
                h: 2
              }, {
                i: '3',
                x: 4,
                y: 2,
                w: 6,
                h: 2
              }, {
                i: '4',
                x: 0,
                y: 4,
                w: 3,
                h: 2
              }, {
                i: '5',
                x: 3,
                y: 4,
                w: 7,
                h: 3
              }, {
                i: '6',
                x: 0,
                y: 7,
                w: 10,
                h: 4
              }],
              sm: [{
                i: '1',
                x: 0,
                y: 0,
                w: 6,
                h: 3
              }, {
                i: '2',
                x: 0,
                y: 3,
                w: 3,
                h: 2
              }, {
                i: '3',
                x: 3,
                y: 3,
                w: 3,
                h: 2
              }, {
                i: '4',
                x: 0,
                y: 5,
                w: 2,
                h: 2
              }, {
                i: '5',
                x: 2,
                y: 5,
                w: 4,
                h: 3
              }, {
                i: '6',
                x: 0,
                y: 8,
                w: 6,
                h: 4
              }],
              xs: [{
                i: '1',
                x: 0,
                y: 0,
                w: 4,
                h: 4
              }, {
                i: '2',
                x: 0,
                y: 4,
                w: 4,
                h: 2
              }, {
                i: '3',
                x: 0,
                y: 6,
                w: 4,
                h: 2
              }, {
                i: '4',
                x: 0,
                y: 8,
                w: 4,
                h: 2
              }, {
                i: '5',
                x: 0,
                y: 10,
                w: 4,
                h: 3
              }, {
                i: '6',
                x: 0,
                y: 13,
                w: 4,
                h: 4
              }],
              xxs: [{
                i: '1',
                x: 0,
                y: 0,
                w: 2,
                h: 4
              }, {
                i: '2',
                x: 0,
                y: 4,
                w: 2,
                h: 2
              }, {
                i: '3',
                x: 0,
                y: 6,
                w: 2,
                h: 2
              }, {
                i: '4',
                x: 0,
                y: 8,
                w: 2,
                h: 2
              }, {
                i: '5',
                x: 0,
                y: 10,
                w: 2,
                h: 3
              }, {
                i: '6',
                x: 0,
                y: 13,
                w: 2,
                h: 4
              }]
            }
          }
        });
      }), http.post(userPreferenceApi, async () => {
        return new HttpResponse({
          status: 200
        });
      })]
    }
  },
  args: {
    id: 'storybook-loading'
  },
  render: args => <StorySection title="Grid - Loading state: skeleton is shown while user preferences are being fetched (10s delay). Refresh to replay.">
      <Grid {...args} />
    </StorySection>
}`,...Br.parameters?.docs?.source}}},Vr.parameters={...Vr.parameters,docs:{...Vr.parameters?.docs,source:{originalSource:`{
  parameters: {
    msw: {
      handlers: [http.post(userPreferenceApi, async () => {
        return new HttpResponse({
          status: 200
        });
      })]
    }
  },
  render: args => <StorySection title="Grid - Fresh state: no saved user preferences, so the grid renders from the defaultLayouts prop with every card active.">
      <Grid {...args} />
    </StorySection>
}`,...Vr.parameters?.docs?.source}}},Hr.parameters={...Hr.parameters,docs:{...Hr.parameters?.docs,source:{originalSource:`{
  parameters: {
    msw: {
      handlers: [http.get(userPreferenceApi, async () => {
        await delay(250);
        return HttpResponse.json({
          content: {
            layouts: {
              lg: [{
                i: '1',
                x: 0,
                y: 0,
                w: 4,
                h: 4
              }, {
                i: '2',
                x: 4,
                y: 0,
                w: 8,
                h: 2
              }, {
                i: '3',
                x: 4,
                y: 2,
                w: 8,
                h: 2
              }, {
                i: '4',
                x: 0,
                y: 4,
                w: 3,
                h: 2
              }, {
                i: '5',
                x: 3,
                y: 4,
                w: 9,
                h: 3
              }, {
                i: '6',
                x: 0,
                y: 7,
                w: 12,
                h: 4
              }],
              md: [{
                i: '1',
                x: 0,
                y: 0,
                w: 4,
                h: 4
              }, {
                i: '2',
                x: 4,
                y: 0,
                w: 6,
                h: 2
              }, {
                i: '3',
                x: 4,
                y: 2,
                w: 6,
                h: 2
              }, {
                i: '4',
                x: 0,
                y: 4,
                w: 3,
                h: 2
              }, {
                i: '5',
                x: 3,
                y: 4,
                w: 7,
                h: 3
              }, {
                i: '6',
                x: 0,
                y: 7,
                w: 10,
                h: 4
              }],
              sm: [{
                i: '1',
                x: 0,
                y: 0,
                w: 6,
                h: 3
              }, {
                i: '2',
                x: 0,
                y: 3,
                w: 3,
                h: 2
              }, {
                i: '3',
                x: 3,
                y: 3,
                w: 3,
                h: 2
              }, {
                i: '4',
                x: 0,
                y: 5,
                w: 2,
                h: 2
              }, {
                i: '5',
                x: 2,
                y: 5,
                w: 4,
                h: 3
              }, {
                i: '6',
                x: 0,
                y: 8,
                w: 6,
                h: 4
              }],
              xs: [{
                i: '1',
                x: 0,
                y: 0,
                w: 4,
                h: 4
              }, {
                i: '2',
                x: 0,
                y: 4,
                w: 4,
                h: 2
              }, {
                i: '3',
                x: 0,
                y: 6,
                w: 4,
                h: 2
              }, {
                i: '4',
                x: 0,
                y: 8,
                w: 4,
                h: 2
              }, {
                i: '5',
                x: 0,
                y: 10,
                w: 4,
                h: 3
              }, {
                i: '6',
                x: 0,
                y: 13,
                w: 4,
                h: 4
              }],
              xxs: [{
                i: '1',
                x: 0,
                y: 0,
                w: 2,
                h: 4
              }, {
                i: '2',
                x: 0,
                y: 4,
                w: 2,
                h: 2
              }, {
                i: '3',
                x: 0,
                y: 6,
                w: 2,
                h: 2
              }, {
                i: '4',
                x: 0,
                y: 8,
                w: 2,
                h: 2
              }, {
                i: '5',
                x: 0,
                y: 10,
                w: 2,
                h: 3
              }, {
                i: '6',
                x: 0,
                y: 13,
                w: 2,
                h: 4
              }]
            },
            defaultLayouts: {
              lg: [{
                i: '1',
                x: 0,
                y: 0,
                w: 6,
                h: 3
              }, {
                i: '2',
                x: 6,
                y: 0,
                w: 6,
                h: 3
              }, {
                i: '3',
                x: 0,
                y: 3,
                w: 4,
                h: 2
              }, {
                i: '4',
                x: 4,
                y: 3,
                w: 2,
                h: 2
              }, {
                i: '5',
                x: 6,
                y: 3,
                w: 6,
                h: 2
              }, {
                i: '6',
                x: 0,
                y: 5,
                w: 6,
                h: 3
              }],
              md: [{
                i: '1',
                x: 0,
                y: 0,
                w: 5,
                h: 3
              }, {
                i: '2',
                x: 5,
                y: 0,
                w: 5,
                h: 3
              }, {
                i: '3',
                x: 0,
                y: 3,
                w: 3,
                h: 2
              }, {
                i: '4',
                x: 3,
                y: 3,
                w: 2,
                h: 2
              }, {
                i: '5',
                x: 5,
                y: 3,
                w: 5,
                h: 2
              }, {
                i: '6',
                x: 0,
                y: 5,
                w: 5,
                h: 3
              }],
              sm: [{
                i: '1',
                x: 0,
                y: 0,
                w: 3,
                h: 3
              }, {
                i: '2',
                x: 3,
                y: 0,
                w: 3,
                h: 3
              }, {
                i: '3',
                x: 0,
                y: 3,
                w: 4,
                h: 2
              }, {
                i: '4',
                x: 4,
                y: 3,
                w: 2,
                h: 2
              }, {
                i: '5',
                x: 0,
                y: 5,
                w: 3,
                h: 2
              }, {
                i: '6',
                x: 3,
                y: 5,
                w: 3,
                h: 2
              }],
              xs: [{
                i: '1',
                x: 0,
                y: 0,
                w: 4,
                h: 3
              }, {
                i: '2',
                x: 0,
                y: 3,
                w: 4,
                h: 3
              }, {
                i: '3',
                x: 0,
                y: 6,
                w: 4,
                h: 2
              }, {
                i: '4',
                x: 0,
                y: 8,
                w: 4,
                h: 2
              }, {
                i: '5',
                x: 0,
                y: 10,
                w: 4,
                h: 2
              }, {
                i: '6',
                x: 0,
                y: 12,
                w: 4,
                h: 3
              }],
              xxs: [{
                i: '1',
                x: 0,
                y: 0,
                w: 2,
                h: 3
              }, {
                i: '2',
                x: 0,
                y: 3,
                w: 2,
                h: 3
              }, {
                i: '3',
                x: 0,
                y: 6,
                w: 2,
                h: 2
              }, {
                i: '4',
                x: 0,
                y: 8,
                w: 2,
                h: 2
              }, {
                i: '5',
                x: 0,
                y: 10,
                w: 2,
                h: 2
              }, {
                i: '6',
                x: 0,
                y: 12,
                w: 2,
                h: 3
              }]
            },
            activeCards: ['1', '2', '4', '5', '6']
          }
        });
      }), http.post(userPreferenceApi, async () => {
        return new HttpResponse({
          status: 200
        });
      })]
    }
  },
  args: {
    id: 'storybook-edited'
  },
  render: args => <StorySection title="Grid - Restored state: saved defaultLayouts match the current config, so the user's custom layouts and activeCards are loaded from preferences (Demographics is inactive).">
      <Grid {...args} />
    </StorySection>
}`,...Hr.parameters?.docs?.source}}},Ur.parameters={...Ur.parameters,docs:{...Ur.parameters?.docs,source:{originalSource:`{
  parameters: {
    msw: {
      handlers: [http.get(userPreferenceApi, async () => {
        await delay(250);
        return HttpResponse.json({
          content: {
            layouts: {
              lg: [{
                i: '1',
                x: 0,
                y: 0,
                w: 4,
                h: 4
              }, {
                i: '2',
                x: 4,
                y: 0,
                w: 8,
                h: 2
              }, {
                i: '3',
                x: 4,
                y: 2,
                w: 8,
                h: 2
              }, {
                i: '4',
                x: 0,
                y: 4,
                w: 3,
                h: 2
              }, {
                i: '5',
                x: 3,
                y: 4,
                w: 9,
                h: 3
              }],
              md: [{
                i: '1',
                x: 0,
                y: 0,
                w: 4,
                h: 4
              }, {
                i: '2',
                x: 4,
                y: 0,
                w: 6,
                h: 2
              }, {
                i: '3',
                x: 4,
                y: 2,
                w: 6,
                h: 2
              }, {
                i: '4',
                x: 0,
                y: 4,
                w: 3,
                h: 2
              }, {
                i: '5',
                x: 3,
                y: 4,
                w: 7,
                h: 3
              }],
              sm: [{
                i: '1',
                x: 0,
                y: 0,
                w: 6,
                h: 3
              }, {
                i: '2',
                x: 0,
                y: 3,
                w: 3,
                h: 2
              }, {
                i: '3',
                x: 3,
                y: 3,
                w: 3,
                h: 2
              }, {
                i: '4',
                x: 0,
                y: 5,
                w: 2,
                h: 2
              }, {
                i: '5',
                x: 2,
                y: 5,
                w: 4,
                h: 3
              }],
              xs: [{
                i: '1',
                x: 0,
                y: 0,
                w: 4,
                h: 4
              }, {
                i: '2',
                x: 0,
                y: 4,
                w: 4,
                h: 2
              }, {
                i: '3',
                x: 0,
                y: 6,
                w: 4,
                h: 2
              }, {
                i: '4',
                x: 0,
                y: 8,
                w: 4,
                h: 2
              }, {
                i: '5',
                x: 0,
                y: 10,
                w: 4,
                h: 3
              }],
              xxs: [{
                i: '1',
                x: 0,
                y: 0,
                w: 2,
                h: 4
              }, {
                i: '2',
                x: 0,
                y: 4,
                w: 2,
                h: 2
              }, {
                i: '3',
                x: 0,
                y: 6,
                w: 2,
                h: 2
              }, {
                i: '4',
                x: 0,
                y: 8,
                w: 2,
                h: 2
              }, {
                i: '5',
                x: 0,
                y: 10,
                w: 2,
                h: 3
              }]
            },
            defaultLayouts: {
              lg: [{
                i: '1',
                x: 0,
                y: 0,
                w: 6,
                h: 3
              }, {
                i: '2',
                x: 6,
                y: 0,
                w: 6,
                h: 3
              }, {
                i: '3',
                x: 0,
                y: 3,
                w: 4,
                h: 2
              }, {
                i: '4',
                x: 4,
                y: 3,
                w: 2,
                h: 2
              }, {
                i: '5',
                x: 6,
                y: 3,
                w: 6,
                h: 2
              }],
              md: [{
                i: '1',
                x: 0,
                y: 0,
                w: 5,
                h: 3
              }, {
                i: '2',
                x: 5,
                y: 0,
                w: 5,
                h: 3
              }, {
                i: '3',
                x: 0,
                y: 3,
                w: 3,
                h: 2
              }, {
                i: '4',
                x: 3,
                y: 3,
                w: 2,
                h: 2
              }, {
                i: '5',
                x: 5,
                y: 3,
                w: 5,
                h: 2
              }],
              sm: [{
                i: '1',
                x: 0,
                y: 0,
                w: 3,
                h: 3
              }, {
                i: '2',
                x: 3,
                y: 0,
                w: 3,
                h: 3
              }, {
                i: '3',
                x: 0,
                y: 3,
                w: 4,
                h: 2
              }, {
                i: '4',
                x: 4,
                y: 3,
                w: 2,
                h: 2
              }, {
                i: '5',
                x: 0,
                y: 5,
                w: 3,
                h: 2
              }],
              xs: [{
                i: '1',
                x: 0,
                y: 0,
                w: 4,
                h: 3
              }, {
                i: '2',
                x: 0,
                y: 3,
                w: 4,
                h: 3
              }, {
                i: '3',
                x: 0,
                y: 6,
                w: 4,
                h: 2
              }, {
                i: '4',
                x: 0,
                y: 8,
                w: 4,
                h: 2
              }, {
                i: '5',
                x: 0,
                y: 10,
                w: 4,
                h: 2
              }],
              xxs: [{
                i: '1',
                x: 0,
                y: 0,
                w: 2,
                h: 3
              }, {
                i: '2',
                x: 0,
                y: 3,
                w: 2,
                h: 3
              }, {
                i: '3',
                x: 0,
                y: 6,
                w: 2,
                h: 2
              }, {
                i: '4',
                x: 0,
                y: 8,
                w: 2,
                h: 2
              }, {
                i: '5',
                x: 0,
                y: 10,
                w: 2,
                h: 2
              }]
            },
            activeCards: ['1', '2', '4', '5']
          }
        });
      }), http.post(userPreferenceApi, async () => {
        return new HttpResponse({
          status: 200
        });
      })]
    }
  },
  args: {
    id: 'storybook-default-layouts-updated'
  },
  render: args => <StorySection title="Grid - Conflict recovery: saved defaultLayouts are stale (missing card '6'), so the local defaultLayouts win and the saved layouts/activeCards are discarded to prevent inconsistencies.">
      <Grid {...args} />
    </StorySection>
}`,...Ur.parameters?.docs?.source}}},Wr.parameters={...Wr.parameters,docs:{...Wr.parameters?.docs,source:{originalSource:`{
  parameters: {
    msw: {
      handlers: [http.post(userPreferenceApi, async () => {
        return new HttpResponse({
          status: 200
        });
      })]
    }
  },
  args: {
    id: 'storybook-hidden',
    cards: [{
      id: '1',
      title: 'Most Frequent Phenotype (HPO)',
      content: <HorizontalBarChart {...hpoProps} />
    }, {
      id: '2',
      title: 'Most Frequent Diagnoses (MONDO)',
      content: <HorizontalBarChart {...mondoProps} />
    }, {
      id: '3',
      title: 'Demographics',
      content: <div className="flex gap-2 h-full p-2">
            {[sexProps, ethnicityProps, raceProps].map((props, i) => <div key={i} className="flex-1 min-w-0 h-full">
                <PieChart {...props} />
              </div>)}
          </div>
    }, {
      id: '4',
      title: 'Studies',
      content: <PieChart {...studiesProps} />
    }, {
      id: '5',
      title: 'Age at First Patient Engagement (years)',
      content: <VerticalBarChart {...ageAtFirstEngagementFKProps} />
    }, {
      id: '6',
      title: 'Age at First Patient Engagement (years) (Include)',
      content: <GroupedVerticalBarChart {...ageAtFirstEngagementIncludeProps} />
    }],
    optionsMenuSettings: {
      visible: false
    }
  },
  render: args => <StorySection title="Grid - optionsMenuSettings.visible is false: the top-right settings menu (toggle cards, reset layout) is hidden — cards can still be closed individually.">
      <Grid {...args} />
    </StorySection>
}`,...Wr.parameters?.docs?.source}}},Gr.parameters={...Gr.parameters,docs:{...Gr.parameters?.docs,source:{originalSource:`{
  parameters: {
    msw: {
      handlers: [http.post(userPreferenceApi, async () => {
        return new HttpResponse({
          status: 200
        });
      })]
    }
  },
  args: {
    id: 'storybook-all-static',
    cards: [{
      id: '1',
      title: 'Most Frequent Phenotype (HPO)',
      content: <HorizontalBarChart {...hpoProps} />
    }, {
      id: '2',
      title: 'Most Frequent Diagnoses (MONDO)',
      content: <HorizontalBarChart {...mondoProps} />
    }, {
      id: '3',
      title: 'Studies',
      content: <PieChart {...studiesProps} />
    }, {
      id: '4',
      title: 'Age at First Patient Engagement (years)',
      content: <VerticalBarChart {...ageAtFirstEngagementFKProps} />
    }],
    defaultLayouts: {
      lg: [{
        i: '1',
        x: 0,
        y: 0,
        w: 6,
        h: 3,
        static: true
      }, {
        i: '2',
        x: 6,
        y: 0,
        w: 6,
        h: 3,
        static: true
      }, {
        i: '3',
        x: 0,
        y: 3,
        w: 6,
        h: 3,
        static: true
      }, {
        i: '4',
        x: 6,
        y: 3,
        w: 6,
        h: 3,
        static: true
      }],
      md: [{
        i: '1',
        x: 0,
        y: 0,
        w: 5,
        h: 3,
        static: true
      }, {
        i: '2',
        x: 5,
        y: 0,
        w: 5,
        h: 3,
        static: true
      }, {
        i: '3',
        x: 0,
        y: 3,
        w: 5,
        h: 3,
        static: true
      }, {
        i: '4',
        x: 5,
        y: 3,
        w: 5,
        h: 3,
        static: true
      }],
      sm: [{
        i: '1',
        x: 0,
        y: 0,
        w: 3,
        h: 3,
        static: true
      }, {
        i: '2',
        x: 3,
        y: 0,
        w: 3,
        h: 3,
        static: true
      }, {
        i: '3',
        x: 0,
        y: 3,
        w: 3,
        h: 3,
        static: true
      }, {
        i: '4',
        x: 3,
        y: 3,
        w: 3,
        h: 3,
        static: true
      }],
      xs: [{
        i: '1',
        x: 0,
        y: 0,
        w: 4,
        h: 3,
        static: true
      }, {
        i: '2',
        x: 0,
        y: 3,
        w: 4,
        h: 3,
        static: true
      }, {
        i: '3',
        x: 0,
        y: 6,
        w: 4,
        h: 3,
        static: true
      }, {
        i: '4',
        x: 0,
        y: 9,
        w: 4,
        h: 3,
        static: true
      }],
      xxs: [{
        i: '1',
        x: 0,
        y: 0,
        w: 2,
        h: 3,
        static: true
      }, {
        i: '2',
        x: 0,
        y: 3,
        w: 2,
        h: 3,
        static: true
      }, {
        i: '3',
        x: 0,
        y: 6,
        w: 2,
        h: 3,
        static: true
      }, {
        i: '4',
        x: 0,
        y: 9,
        w: 2,
        h: 3,
        static: true
      }]
    }
  },
  render: args => <StorySection title="Grid - Fully static grid: every card shares the same width/height, and no card can be dragged or resized.">
      <Grid {...args} />
    </StorySection>
}`,...Gr.parameters?.docs?.source}}},Kr.parameters={...Kr.parameters,docs:{...Kr.parameters?.docs,source:{originalSource:`{
  parameters: {
    msw: {
      handlers: [http.post(userPreferenceApi, async () => {
        return new HttpResponse({
          status: 200
        });
      })]
    }
  },
  args: {
    id: 'storybook-draggable-only',
    defaultLayouts: {
      lg: [{
        i: '1',
        x: 0,
        y: 0,
        w: 4,
        h: 3,
        isResizable: false
      }, {
        i: '2',
        x: 4,
        y: 0,
        w: 4,
        h: 3,
        isResizable: false
      }, {
        i: '3',
        x: 8,
        y: 0,
        w: 4,
        h: 3,
        isResizable: false
      }, {
        i: '4',
        x: 0,
        y: 3,
        w: 4,
        h: 3,
        isResizable: false
      }, {
        i: '5',
        x: 4,
        y: 3,
        w: 4,
        h: 3,
        isResizable: false
      }, {
        i: '6',
        x: 8,
        y: 3,
        w: 4,
        h: 3,
        isResizable: false
      }],
      md: [{
        i: '1',
        x: 0,
        y: 0,
        w: 3,
        h: 3,
        isResizable: false
      }, {
        i: '2',
        x: 3,
        y: 0,
        w: 3,
        h: 3,
        isResizable: false
      }, {
        i: '3',
        x: 6,
        y: 0,
        w: 3,
        h: 3,
        isResizable: false
      }, {
        i: '4',
        x: 0,
        y: 3,
        w: 3,
        h: 3,
        isResizable: false
      }, {
        i: '5',
        x: 3,
        y: 3,
        w: 3,
        h: 3,
        isResizable: false
      }, {
        i: '6',
        x: 6,
        y: 3,
        w: 3,
        h: 3,
        isResizable: false
      }],
      sm: [{
        i: '1',
        x: 0,
        y: 0,
        w: 2,
        h: 3,
        isResizable: false
      }, {
        i: '2',
        x: 2,
        y: 0,
        w: 2,
        h: 3,
        isResizable: false
      }, {
        i: '3',
        x: 4,
        y: 0,
        w: 2,
        h: 3,
        isResizable: false
      }, {
        i: '4',
        x: 0,
        y: 3,
        w: 2,
        h: 3,
        isResizable: false
      }, {
        i: '5',
        x: 2,
        y: 3,
        w: 2,
        h: 3,
        isResizable: false
      }, {
        i: '6',
        x: 4,
        y: 3,
        w: 2,
        h: 3,
        isResizable: false
      }],
      xs: [{
        i: '1',
        x: 0,
        y: 0,
        w: 4,
        h: 3,
        isResizable: false
      }, {
        i: '2',
        x: 0,
        y: 3,
        w: 4,
        h: 3,
        isResizable: false
      }, {
        i: '3',
        x: 0,
        y: 6,
        w: 4,
        h: 3,
        isResizable: false
      }, {
        i: '4',
        x: 0,
        y: 9,
        w: 4,
        h: 3,
        isResizable: false
      }, {
        i: '5',
        x: 0,
        y: 12,
        w: 4,
        h: 3,
        isResizable: false
      }, {
        i: '6',
        x: 0,
        y: 15,
        w: 4,
        h: 3,
        isResizable: false
      }],
      xxs: [{
        i: '1',
        x: 0,
        y: 0,
        w: 2,
        h: 3,
        isResizable: false
      }, {
        i: '2',
        x: 0,
        y: 3,
        w: 2,
        h: 3,
        isResizable: false
      }, {
        i: '3',
        x: 0,
        y: 6,
        w: 2,
        h: 3,
        isResizable: false
      }, {
        i: '4',
        x: 0,
        y: 9,
        w: 2,
        h: 3,
        isResizable: false
      }, {
        i: '5',
        x: 0,
        y: 12,
        w: 2,
        h: 3,
        isResizable: false
      }, {
        i: '6',
        x: 0,
        y: 15,
        w: 2,
        h: 3,
        isResizable: false
      }]
    }
  },
  render: args => <StorySection title="Grid - Draggable only: cards keep their fixed width/height (isResizable: false), but can still be dragged to reorder the grid.">
      <Grid {...args} />
    </StorySection>
}`,...Kr.parameters?.docs?.source}}},qr.parameters={...qr.parameters,docs:{...qr.parameters?.docs,source:{originalSource:`{
  parameters: {
    msw: {
      handlers: [http.post(userPreferenceApi, async () => {
        return new HttpResponse({
          status: 200
        });
      })]
    }
  },
  args: {
    id: 'storybook-resizable-card',
    gridCardProps: {
      closeText: 'Remove Card'
    },
    cards: [{
      id: '1',
      title: 'static: true',
      content: <HorizontalBarChart {...hpoProps} />
    }, {
      id: '2',
      title: 'isDraggable: false',
      content: <HorizontalBarChart {...hpoProps} />
    }, {
      id: '3',
      title: 'isResizable: false',
      content: <HorizontalBarChart {...hpoProps} />
    }, {
      id: '4',
      title: 'isBounded: false',
      content: <HorizontalBarChart {...hpoProps} />
    }],
    defaultLayouts: {
      lg: [{
        i: '1',
        x: 0,
        y: 0,
        w: 6,
        h: 3,
        static: true
      }, {
        i: '2',
        x: 6,
        y: 0,
        w: 6,
        h: 3,
        isDraggable: false
      }, {
        i: '3',
        x: 0,
        y: 3,
        w: 6,
        h: 3,
        isResizable: false
      }, {
        i: '4',
        x: 6,
        y: 3,
        w: 6,
        h: 3,
        isBounded: false
      }],
      md: [{
        i: '1',
        x: 0,
        y: 0,
        w: 5,
        h: 3,
        static: true
      }, {
        i: '2',
        x: 5,
        y: 0,
        w: 5,
        h: 3,
        isDraggable: false
      }, {
        i: '3',
        x: 0,
        y: 3,
        w: 5,
        h: 3,
        isResizable: false
      }, {
        i: '4',
        x: 5,
        y: 3,
        w: 5,
        h: 3,
        isBounded: false
      }],
      sm: [{
        i: '1',
        x: 0,
        y: 0,
        w: 3,
        h: 3,
        static: true
      }, {
        i: '2',
        x: 3,
        y: 0,
        w: 3,
        h: 3,
        isDraggable: false
      }, {
        i: '3',
        x: 0,
        y: 3,
        w: 4,
        h: 3,
        isResizable: false
      }, {
        i: '4',
        x: 4,
        y: 3,
        w: 4,
        h: 3,
        isBounded: false
      }],
      xs: [{
        i: '1',
        x: 0,
        y: 0,
        w: 4,
        h: 3,
        static: true
      }, {
        i: '2',
        x: 0,
        y: 3,
        w: 4,
        h: 3,
        isDraggable: false
      }, {
        i: '3',
        x: 0,
        y: 6,
        w: 4,
        h: 3,
        isResizable: false
      }, {
        i: '4',
        x: 0,
        y: 9,
        w: 4,
        h: 3,
        isBounded: false
      }],
      xxs: [{
        i: '1',
        x: 0,
        y: 0,
        w: 2,
        h: 3,
        static: true
      }, {
        i: '2',
        x: 0,
        y: 3,
        w: 2,
        h: 3,
        isDraggable: false
      }, {
        i: '3',
        x: 0,
        y: 6,
        w: 2,
        h: 3,
        isResizable: false
      }, {
        i: '4',
        x: 0,
        y: 9,
        w: 2,
        h: 3,
        isBounded: false
      }]
    }
  },
  render: args => <StorySection title="Grid - Per-card LayoutItem flags: each card demonstrates a different behavior (static, isDraggable: false, isResizable: false, isBounded: false). Close text has been changed.">
      <Grid {...args} />
    </StorySection>
}`,...qr.parameters?.docs?.source}}},Jr=[`Loading`,`Default`,`Edited`,`OutdatedLayouts`,`WithoutOptionsMenuSettings`,`StaticGrid`,`DraggableGrid`,`GridCard`]})))()}Yr();export{Vr as Default,Kr as DraggableGrid,Hr as Edited,qr as GridCard,Br as Loading,Ur as OutdatedLayouts,Gr as StaticGrid,Wr as WithoutOptionsMenuSettings,Jr as __namedExportsOrder,zr as default};