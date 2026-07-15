import{r as m,g as ns,ab as hr,a7 as Rn,V as Et,ac as An,j as b,R as Qe,c as rs,n as pr,T as yr,f as gr,h as mr,ad as Ge}from"./iframe-kLaNX2HI.js";import{B as Kt}from"./button-lcKTI4HU.js";import{C as ss,a as is,d as os}from"./card-DM-En_BO.js";import{u as xr}from"./i18n-ZHel4DsP.js";import{G as as}from"./grip-vertical-JbYT_SuC.js";import{X as Bn}from"./x-AVvb3cMA.js";import{C as ls}from"./checkbox-BvGeGKrx.js";import{P as cs,a as us,b as ds}from"./popover-BLERJ09U.js";import{S as fs}from"./settings-PgAY7o9X.js";import{u as wr}from"./api-BjHhlcVm.js";import{w as hs,u as ps,a as ys}from"./index-DzylGbwD.js";import{S as an}from"./skeleton-DmgM1E7r.js";import{a as ut}from"./story-section-YShHgFMq.js";import{H as Ze,h as ht,m as Sn}from"./horizontal-bar-chart.stories-CB1pOOJ-.js";import{P as jt,s as Dn,a as br,e as vr,r as Rr}from"./pie-chart.stories-DgFo83sj.js";import{V as Cn,a as zn,G as Sr,b as Dr}from"./vertical-bar-chart.stories-34bEwR7W.js";import{u as Ye}from"./api-user-preference-DmA0Jk-1.js";import{h as Xe}from"./index-Dr-4_ABD.js";import{d as Pn}from"./delay-DW35g_Hs.js";import"./preload-helper-PPVm8Dsz.js";import"./action-button-D3l4bIzZ.js";import"./dropdown-menu-85xmnBFd.js";import"./index-fXaV-lio.js";import"./index-B2vLf8-Q.js";import"./check-NiNg2u4X.js";import"./circle-yHcXqLnR.js";import"./separator-BTZwSWvT.js";import"./index-BCXviJZk.js";import"./index-B8pi8AaO.js";import"./api-DxXkaL5r.js";import"./chart-palette-preview-B22EUqm4.js";import"./with-selector-DbhKiSON.js";import"./bar-rectangle-WyzXVBX8.js";import"./data-CGl4bGS9.js";function gt(e){const{margin:t,containerPadding:n,containerWidth:r,cols:s}=e;return(r-t[0]*(s-1)-n[0]*2)/s}function Ke(e,t,n){return Number.isFinite(e)?Math.round(t*e+Math.max(0,e-1)*n):e}function Lt(e,t,n,r,s,a,o){const{margin:d,containerPadding:l,rowHeight:y}=e,p=gt(e);let x,z,C,R;if(o?(x=Math.round(o.width),z=Math.round(o.height)):(x=Ke(r,p,d[0]),z=Ke(s,y,d[1])),a?(C=Math.round(a.top),R=Math.round(a.left)):o?(C=Math.round(o.top),R=Math.round(o.left)):(C=Math.round((y+d[1])*n+l[1]),R=Math.round((p+d[0])*t+l[0])),!a&&!o){if(Number.isFinite(r)){const c=Math.round((p+d[0])*(t+r)+l[0])-R-x;c!==d[0]&&(x+=c-d[0])}if(Number.isFinite(s)){const c=Math.round((y+d[1])*(n+s)+l[1])-C-z;c!==d[1]&&(z+=c-d[1])}}return{top:C,left:R,width:x,height:z}}function gs(e,t,n,r,s){const{margin:a,containerPadding:o,cols:d,rowHeight:l,maxRows:y}=e,p=gt(e);let x=Math.round((n-o[0])/(p+a[0])),z=Math.round((t-o[1])/(l+a[1]));return x=Jt(x,0,d-r),z=Jt(z,0,y-s),{x,y:z}}function Ht(e,t,n){const{margin:r,containerPadding:s,rowHeight:a}=e,o=gt(e),d=Math.round((n-s[0])/(o+r[0])),l=Math.round((t-s[1])/(a+r[1]));return{x:d,y:l}}function ms(e,t,n){const{margin:r,rowHeight:s}=e,a=gt(e),o=Math.max(1,Math.round((t+r[0])/(a+r[0]))),d=Math.max(1,Math.round((n+r[1])/(s+r[1])));return{w:o,h:d}}function Jt(e,t,n){return Math.max(Math.min(e,n),t)}function On(e,t){return!(e.i===t.i||e.x+e.w<=t.x||e.x>=t.x+t.w||e.y+e.h<=t.y||e.y>=t.y+t.h)}function yt(e,t){for(let n=0;n<e.length;n++){const r=e[n];if(r!==void 0&&On(r,t))return r}}function Cr(e,t){return e.filter(n=>On(n,t))}function xs(e,t){return t==="horizontal"?zr(e):t==="vertical"||t==="wrap"?bn(e):[...e]}function bn(e){return[...e].sort((t,n)=>t.y!==n.y?t.y-n.y:t.x-n.x)}function zr(e){return[...e].sort((t,n)=>t.x!==n.x?t.x-n.x:t.y-n.y)}function Qt(e){let t=0;for(let n=0;n<e.length;n++){const r=e[n];if(r!==void 0){const s=r.y+r.h;s>t&&(t=s)}}return t}function ft(e,t){for(let n=0;n<e.length;n++){const r=e[n];if(r!==void 0&&r.i===t)return r}}function en(e){return e.filter(t=>t.static===!0)}function mt(e){return{i:e.i,x:e.x,y:e.y,w:e.w,h:e.h,minW:e.minW,maxW:e.maxW,minH:e.minH,maxH:e.maxH,moved:!!e.moved,static:!!e.static,isDraggable:e.isDraggable,isResizable:e.isResizable,resizeHandles:e.resizeHandles,constraints:e.constraints,isBounded:e.isBounded}}function ct(e){const t=new Array(e.length);for(let n=0;n<e.length;n++){const r=e[n];r!==void 0&&(t[n]=mt(r))}return t}function ws(e,t){const n=new Array(e.length);for(let r=0;r<e.length;r++){const s=e[r];s!==void 0&&(t.i===s.i?n[r]=t:n[r]=s)}return n}function bs(e,t,n){let r=ft(e,t);return r?(r=n(mt(r)),[ws(e,r),r]):[[...e],null]}function En(e,t){const n=en(e);for(let r=0;r<e.length;r++){const s=e[r];if(s!==void 0)if(s.x+s.w>t.cols&&(s.x=t.cols-s.w),s.x<0&&(s.x=0,s.w=t.cols),!s.static)n.push(s);else for(;yt(n,s);)s.y++}return e}function pt(e,t,n,r,s,a,o,d,l){if(t.static&&t.isDraggable!==!0)return[...e];if(t.y===r&&t.x===n)return[...e];const y=t.x,p=t.y;typeof n=="number"&&(t.x=n),typeof r=="number"&&(t.y=r),t.moved=!0;let x=xs(e,o);(o==="vertical"&&typeof r=="number"?p>=r:o==="horizontal"&&typeof n=="number"&&y>=n)&&(x=x.reverse());const C=Cr(x,t),R=C.length>0;if(R&&l)return ct(e);if(R&&a)return t.x=y,t.y=p,t.moved=!1,e;let f=[...e];for(let c=0;c<C.length;c++){const g=C[c];g!==void 0&&(g.moved||(g.static?f=Wn(f,g,t,s,o):f=Wn(f,t,g,s,o)))}return f}function Wn(e,t,n,r,s,a){const o=s==="horizontal",d=s==="vertical",l=t.static;if(r){r=!1;const x={x:o?Math.max(t.x-n.w,0):n.x,y:d?Math.max(t.y-n.h,0):n.y,w:n.w,h:n.h,i:"-1"},z=yt(e,x),C=z!==void 0&&z.y+z.h>t.y,R=z!==void 0&&t.x+t.w>z.x;if(!z)return pt(e,n,o?x.x:void 0,d?x.y:void 0,r,l,s);if(C&&d)return pt(e,n,void 0,n.y+1,r,l,s);if(C&&s===null)return t.y=n.y,n.y=n.y+n.h,[...e];if(R&&o)return pt(e,t,n.x,void 0,r,l,s)}const y=o?n.x+1:void 0,p=d?n.y+1:void 0;return y===void 0&&p===void 0?[...e]:pt(e,n,y,p,r,l,s)}function wt(e,t,n){return Math.max(t,Math.min(n,e))}var vs={name:"gridBounds",constrainPosition(e,t,n,{cols:r,maxRows:s}){return{x:wt(t,0,Math.max(0,r-e.w)),y:wt(n,0,Math.max(0,s-e.h))}},constrainSize(e,t,n,r,{cols:s,maxRows:a}){const o=r==="w"||r==="nw"||r==="sw"?e.x+e.w:s-e.x,d=r==="n"||r==="nw"||r==="ne"?e.y+e.h:a-e.y;return{w:wt(t,1,Math.max(1,o)),h:wt(n,1,Math.max(1,d))}}},Rs={name:"minMaxSize",constrainSize(e,t,n){return{w:wt(t,e.minW??1,e.maxW??1/0),h:wt(n,e.minH??1,e.maxH??1/0)}}},Pr=[vs,Rs];function qt(e,t,n,r,s){let a={x:n,y:r};for(const o of e)o.constrainPosition&&(a=o.constrainPosition(t,a.x,a.y,s));if(t.constraints)for(const o of t.constraints)o.constrainPosition&&(a=o.constrainPosition(t,a.x,a.y,s));return a}function Ss(e,t,n,r,s,a){let o={w:n,h:r};for(const d of e)d.constrainSize&&(o=d.constrainSize(t,o.w,o.h,s,a));if(t.constraints)for(const d of t.constraints)d.constrainSize&&(o=d.constrainSize(t,o.w,o.h,s,a));return o}function Or({top:e,left:t,width:n,height:r}){const s=`translate(${t}px,${e}px)`;return{transform:s,WebkitTransform:s,MozTransform:s,msTransform:s,OTransform:s,width:`${n}px`,height:`${r}px`,position:"absolute"}}function Ds({top:e,left:t,width:n,height:r}){return{top:`${e}px`,left:`${t}px`,width:`${n}px`,height:`${r}px`,position:"absolute"}}function In(e){return e*100+"%"}function Cs(e,t,n,r){return e+n>r?t:n}function Er(e,t,n){return e<0?t:n}function zs(e){return Math.max(0,e)}function Zt(e){return Math.max(0,e)}var jn=(e,t,n)=>{const{left:r,height:s,width:a}=t,o=e.top-(s-e.height);return{left:r,width:a,height:Er(o,e.height,s),top:Zt(o)}},Mn=(e,t,n)=>{const{top:r,left:s,height:a,width:o}=t;return{top:r,height:a,width:Cs(e.left,e.width,o,n),left:zs(s)}},Nn=(e,t,n)=>{const{top:r,height:s,width:a}=t,o=e.left+e.width-a;return o<0?{height:s,width:e.left+e.width,top:Zt(r),left:0}:{height:s,width:a,top:Zt(r),left:o}},kn=(e,t,n)=>{const{top:r,left:s,height:a,width:o}=t;return{width:o,left:s,height:Er(r,e.height,a),top:Zt(r)}},Ps=(e,t,n)=>jn(e,Mn(e,t,n)),Os=(e,t,n)=>jn(e,Nn(e,t)),Es=(e,t,n)=>kn(e,Mn(e,t,n)),js=(e,t,n)=>kn(e,Nn(e,t)),Ms={n:jn,ne:Ps,e:Mn,se:Es,s:kn,sw:js,w:Nn,nw:Os};function Ns(e,t,n,r){const s=Ms[e];return s?s(t,{...t,...n},r):n}var ks={type:"transform",scale:1,calcStyle(e){return Or(e)}},Ts=ks,_s={cols:12,rowHeight:150,margin:[10,10],containerPadding:null,maxRows:1/0},Ls={enabled:!0,bounded:!1,threshold:3},Hs={enabled:!0,handles:["se"]},qs={enabled:!1,defaultItem:{w:1,h:1}};function Tn(e,t,n,r,s){const a=r==="x"?"w":"h";t[r]+=1;const o=e.findIndex(l=>l.i===t.i),d=s??en(e).length>0;for(let l=o+1;l<e.length;l++){const y=e[l];if(y!==void 0&&!y.static){if(!d&&y.y>t.y+t.h)break;On(t,y)&&Tn(e,y,n+t[a],r,d)}}t[r]=n}function As(e,t,n,r){for(t.x=Math.max(t.x,0),t.y=Math.max(t.y,0),t.y=Math.min(r,t.y);t.y>0&&!yt(e,t);)t.y--;let s;for(;(s=yt(e,t))!==void 0;)Tn(n,t,s.y+s.h,"y");return t.y=Math.max(t.y,0),t}function Bs(e,t,n,r){for(t.x=Math.max(t.x,0),t.y=Math.max(t.y,0);t.x>0&&!yt(e,t);)t.x--;let s;for(;(s=yt(e,t))!==void 0;)if(Tn(r,t,s.x+s.w,"x"),t.x+t.w>n)for(t.x=n-t.w,t.y++;t.x>0&&!yt(e,t);)t.x--;return t.x=Math.max(t.x,0),t}var jr={type:"vertical",allowOverlap:!1,compact(e,t){const n=en(e);let r=Qt(n);const s=bn(e),a=new Array(e.length);for(let o=0;o<s.length;o++){const d=s[o];if(d===void 0)continue;let l=mt(d);l.static||(l=As(n,l,s,r),r=Math.max(r,l.y+l.h),n.push(l));const y=e.indexOf(d);a[y]=l,l.moved=!1}return a}},Mr={type:"horizontal",allowOverlap:!1,compact(e,t){const n=en(e),r=zr(e),s=new Array(e.length);for(let a=0;a<r.length;a++){const o=r[a];if(o===void 0)continue;let d=mt(o);d.static||(d=Bs(n,d,t,r),n.push(d));const l=e.indexOf(o);s[l]=d,d.moved=!1}return s}},Nr={type:null,allowOverlap:!1,compact(e,t){return ct(e)}},Ws={...jr,allowOverlap:!0,compact(e,t){return ct(e)}},Is={...Mr,allowOverlap:!0,compact(e,t){return ct(e)}},Gs={...Nr,allowOverlap:!0};function _n(e,t=!1,n=!1){let r;return t?e==="vertical"?r=Ws:e==="horizontal"?r=Is:r=Gs:e==="vertical"?r=jr:e==="horizontal"?r=Mr:r=Nr,n?{...r,preventCollision:n}:r}function kr(e){return Object.keys(e).sort((n,r)=>e[n]-e[r])}function Gn(e,t){const n=kr(e);let r=n[0];if(r===void 0)throw new Error("No breakpoints defined");for(let s=1;s<n.length;s++){const a=n[s];if(a===void 0)continue;const o=e[a];t>o&&(r=a)}return r}function Yn(e,t){const n=t[e];if(n===void 0)throw new Error(`ResponsiveReactGridLayout: \`cols\` entry for breakpoint ${String(e)} is missing!`);return n}function ln(e,t,n,r,s,a){const o=e[n];if(o)return ct(o);let d=e[r];const l=kr(t),y=l.slice(l.indexOf(n));for(let C=0;C<y.length;C++){const R=y[C];if(R===void 0)continue;const f=e[R];if(f){d=f;break}}const p=ct(d||[]),x=En(p,{cols:s});return(typeof a=="object"&&a!==null?a:_n(a)).compact(x,s)}function At(e,t){if(Array.isArray(e))return e;const n=e,r=n[t];if(r!==void 0)return r;const s=Object.keys(n);for(const a of s){const o=n[a];if(o!==void 0)return o}return[10,10]}function Tr(e){return function(n,r,s,a,o,d,l){return e(n,r,l)}}function tn(e){return function(n,r,s,a){if(!n||!r||typeof n!="object"||typeof r!="object")return e(n,r,s,a);var o=a.get(n),d=a.get(r);if(o&&d)return o===r&&d===n;a.set(n,r),a.set(r,n);var l=e(n,r,s,a);return a.delete(n),a.delete(r),l}}function _r(e,t){var n={};for(var r in e)n[r]=e[r];for(var r in t)n[r]=t[r];return n}function Xn(e){return e.constructor===Object||e.constructor==null}function Fn(e){return typeof e.then=="function"}function nn(e,t){return e===t||e!==e&&t!==t}var Ys="[object Arguments]",Xs="[object Boolean]",Fs="[object Date]",$s="[object RegExp]",Us="[object Map]",Vs="[object Number]",Ks="[object Object]",Js="[object Set]",Zs="[object String]",$n=Object.prototype.toString;function rn(e){var t=e.areArraysEqual,n=e.areDatesEqual,r=e.areMapsEqual,s=e.areObjectsEqual,a=e.areRegExpsEqual,o=e.areSetsEqual,d=e.createIsNestedEqual,l=d(y);function y(p,x,z){if(p===x)return!0;if(!p||!x||typeof p!="object"||typeof x!="object")return p!==p&&x!==x;if(Xn(p)&&Xn(x))return s(p,x,l,z);var C=Array.isArray(p),R=Array.isArray(x);if(C||R)return C===R&&t(p,x,l,z);var f=$n.call(p);return f!==$n.call(x)?!1:f===Fs?n(p,x,l,z):f===$s?a(p,x,l,z):f===Us?r(p,x,l,z):f===Js?o(p,x,l,z):f===Ks||f===Ys?Fn(p)||Fn(x)?!1:s(p,x,l,z):f===Xs||f===Vs||f===Zs?nn(p.valueOf(),x.valueOf()):!1}return y}function Lr(e,t,n,r){var s=e.length;if(t.length!==s)return!1;for(;s-- >0;)if(!n(e[s],t[s],s,s,e,t,r))return!1;return!0}var Qs=tn(Lr);function Hr(e,t){return nn(e.valueOf(),t.valueOf())}function qr(e,t,n,r){var s=e.size===t.size;if(!s)return!1;if(!e.size)return!0;var a={},o=0;return e.forEach(function(d,l){if(s){var y=!1,p=0;t.forEach(function(x,z){!y&&!a[p]&&(y=n(l,z,o,p,e,t,r)&&n(d,x,l,z,e,t,r))&&(a[p]=!0),p++}),o++,s=y}}),s}var ei=tn(qr),ti="_owner",ni=Object.prototype.hasOwnProperty;function Ar(e,t,n,r){var s=Object.keys(e),a=s.length;if(Object.keys(t).length!==a)return!1;for(var o;a-- >0;){if(o=s[a],o===ti){var d=!!e.$$typeof,l=!!t.$$typeof;if((d||l)&&d!==l)return!1}if(!ni.call(t,o)||!n(e[o],t[o],o,o,e,t,r))return!1}return!0}var ri=tn(Ar);function Br(e,t){return e.source===t.source&&e.flags===t.flags}function Wr(e,t,n,r){var s=e.size===t.size;if(!s)return!1;if(!e.size)return!0;var a={};return e.forEach(function(o,d){if(s){var l=!1,y=0;t.forEach(function(p,x){!l&&!a[y]&&(l=n(o,p,d,x,e,t,r))&&(a[y]=!0),y++}),s=l}}),s}var si=tn(Wr),Ir=Object.freeze({areArraysEqual:Lr,areDatesEqual:Hr,areMapsEqual:qr,areObjectsEqual:Ar,areRegExpsEqual:Br,areSetsEqual:Wr,createIsNestedEqual:Tr}),Gr=Object.freeze({areArraysEqual:Qs,areDatesEqual:Hr,areMapsEqual:ei,areObjectsEqual:ri,areRegExpsEqual:Br,areSetsEqual:si,createIsNestedEqual:Tr}),ii=rn(Ir);function rt(e,t){return ii(e,t,void 0)}rn(_r(Ir,{createIsNestedEqual:function(){return nn}}));rn(Gr);rn(_r(Gr,{createIsNestedEqual:function(){return nn}}));function Yr(e={}){const{measureBeforeMount:t=!1,initialWidth:n=1280}=e,[r,s]=m.useState(n),[a,o]=m.useState(!t),d=m.useRef(null),l=m.useRef(null),y=m.useCallback(()=>{const p=d.current;if(p){const x=p.offsetWidth;s(x),a||o(!0)}},[a]);return m.useEffect(()=>{const p=d.current;if(p){if(y(),typeof ResizeObserver<"u"){let x=null;return l.current=new ResizeObserver(z=>{const C=z[0];if(C){const R=C.contentRect.width;x!==null&&cancelAnimationFrame(x),x=requestAnimationFrame(()=>{s(R),x=null})}}),l.current.observe(p),()=>{x!==null&&cancelAnimationFrame(x),l.current&&(l.current.disconnect(),l.current=null)}}return()=>{l.current&&(l.current.disconnect(),l.current=null)}}},[y]),{width:r,mounted:a,containerRef:d,measureWidth:y}}var cn={exports:{}},un,Un;function oi(){if(Un)return un;Un=1;var e="SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED";return un=e,un}var dn,Vn;function ai(){if(Vn)return dn;Vn=1;var e=oi();function t(){}function n(){}return n.resetWarningCache=t,dn=function(){function r(o,d,l,y,p,x){if(x!==e){var z=new Error("Calling PropTypes validators directly is not supported by the `prop-types` package. Use PropTypes.checkPropTypes() to call them. Read more at http://fb.me/use-check-prop-types");throw z.name="Invariant Violation",z}}r.isRequired=r;function s(){return r}var a={array:r,bigint:r,bool:r,func:r,number:r,object:r,string:r,symbol:r,any:r,arrayOf:s,element:r,elementType:r,instanceOf:s,node:r,objectOf:s,oneOf:s,oneOfType:s,shape:s,exact:s,checkPropTypes:n,resetWarningCache:t};return a.PropTypes=a,a},dn}var Kn;function Mt(){return Kn||(Kn=1,cn.exports=ai()()),cn.exports}var li=Mt();const N=ns(li);var ci={};function vn(e,t){for(let n=0,r=e.length;n<r;n++)if(t.apply(t,[e[n],n,e]))return e[n]}function Jn(e){return typeof e=="function"||Object.prototype.toString.call(e)==="[object Function]"}function Ot(e){return typeof e=="number"&&!isNaN(e)}function Oe(e){return parseInt(e,10)}function bt(e,t,n){if(e[t])return new Error(`Invalid prop ${t} passed to ${n} - do not set this, set it on the child.`)}var fn=["Moz","Webkit","O","ms"];function ui(e="transform"){var t,n;if(typeof window>"u")return"";const r=(n=(t=window.document)==null?void 0:t.documentElement)==null?void 0:n.style;if(!r||e in r)return"";for(let s=0;s<fn.length;s++)if(Xr(e,fn[s])in r)return fn[s];return""}function Xr(e,t){return t?`${t}${di(e)}`:e}function di(e){let t="",n=!0;for(let r=0;r<e.length;r++)n?(t+=e[r].toUpperCase(),n=!1):e[r]==="-"?n=!0:t+=e[r];return t}var fi=ui(),hn="";function hi(e,t){var n;hn||(hn=(n=vn(["matches","webkitMatchesSelector","mozMatchesSelector","msMatchesSelector","oMatchesSelector"],function(s){return Jn(e[s])}))!=null?n:"");const r=e[hn];return Jn(r)?!!r.call(e,t):!1}function Zn(e,t,n){let r=e;do{if(hi(r,t))return!0;if(r===n)return!1;r=r.parentNode}while(r);return!1}function pn(e,t,n,r){if(!e)return;const s={capture:!0,...r},a=n;e.addEventListener?e.addEventListener(t,a,s):e.attachEvent?e.attachEvent("on"+t,a):e["on"+t]=a}function dt(e,t,n,r){if(!e)return;const s={capture:!0,...r},a=n;e.removeEventListener?e.removeEventListener(t,a,s):e.detachEvent?e.detachEvent("on"+t,a):e["on"+t]=null}function pi(e){let t=e.clientHeight;const n=e.ownerDocument.defaultView.getComputedStyle(e);return t+=Oe(n.borderTopWidth),t+=Oe(n.borderBottomWidth),t}function yi(e){let t=e.clientWidth;const n=e.ownerDocument.defaultView.getComputedStyle(e);return t+=Oe(n.borderLeftWidth),t+=Oe(n.borderRightWidth),t}function gi(e){let t=e.clientHeight;const n=e.ownerDocument.defaultView.getComputedStyle(e);return t-=Oe(n.paddingTop),t-=Oe(n.paddingBottom),t}function mi(e){let t=e.clientWidth;const n=e.ownerDocument.defaultView.getComputedStyle(e);return t-=Oe(n.paddingLeft),t-=Oe(n.paddingRight),t}function xi(e,t,n){const s=t===t.ownerDocument.body?{left:0,top:0}:t.getBoundingClientRect(),a=(e.clientX+t.scrollLeft-s.left)/n,o=(e.clientY+t.scrollTop-s.top)/n;return{x:a,y:o}}function wi(e,t){const n=Fr(e,t,"px");return{[Xr("transform",fi)]:n}}function bi(e,t){return Fr(e,t,"")}function Fr({x:e,y:t},n,r){let s=`translate(${e}${r},${t}${r})`;if(n){const a=`${typeof n.x=="string"?n.x:n.x+r}`,o=`${typeof n.y=="string"?n.y:n.y+r}`;s=`translate(${a}, ${o})`+s}return s}function vi(e,t){return e.targetTouches&&vn(e.targetTouches,n=>t===n.identifier)||e.changedTouches&&vn(e.changedTouches,n=>t===n.identifier)}function Ri(e){if(e.targetTouches&&e.targetTouches[0])return e.targetTouches[0].identifier;if(e.changedTouches&&e.changedTouches[0])return e.changedTouches[0].identifier}function Si(){return typeof __webpack_nonce__<"u"?__webpack_nonce__:void 0}function Di(e,t){if(!e)return;let n=e.getElementById("react-draggable-style-el");if(!n){n=e.createElement("style"),n.type="text/css",n.id="react-draggable-style-el";const r=t??Si();r&&n.setAttribute("nonce",r),n.innerHTML=`.react-draggable-transparent-selection *::-moz-selection {all: inherit;}
`,n.innerHTML+=`.react-draggable-transparent-selection *::selection {all: inherit;}
`,e.getElementsByTagName("head")[0].appendChild(n)}e.body&&Ci(e.body,"react-draggable-transparent-selection")}function Qn(e){window.requestAnimationFrame?window.requestAnimationFrame(()=>{er(e)}):er(e)}function er(e){if(e)try{e.body&&zi(e.body,"react-draggable-transparent-selection");const t=e.selection;if(t)t.empty();else{const n=(e.defaultView||window).getSelection();n&&n.type!=="Caret"&&n.removeAllRanges()}}catch{}}function Ci(e,t){e.classList?e.classList.add(t):e.className.match(new RegExp(`(?:^|\\s)${t}(?!\\S)`))||(e.className+=` ${t}`)}function zi(e,t){e.classList?e.classList.remove(t):e.className=e.className.replace(new RegExp(`(?:^|\\s)${t}(?!\\S)`,"g"),"")}function Pi(e,t,n){if(!e.props.bounds)return[t,n];let{bounds:r}=e.props;r=typeof r=="string"?r:ji(r);const s=Ln(e);if(typeof r=="string"){const{ownerDocument:a}=s,o=a.defaultView;if(!o)throw new Error("Cannot resolve the owner window of the draggable node.");let d;if(r==="parent"?d=s.parentNode:d=s.getRootNode().querySelector(r),!(d instanceof o.HTMLElement))throw new Error('Bounds selector "'+r+'" could not find an element.');const l=d,y=o.getComputedStyle(s),p=o.getComputedStyle(l);r={left:-s.offsetLeft+Oe(p.paddingLeft)+Oe(y.marginLeft),top:-s.offsetTop+Oe(p.paddingTop)+Oe(y.marginTop),right:mi(l)-yi(s)-s.offsetLeft+Oe(p.paddingRight)-Oe(y.marginRight),bottom:gi(l)-pi(s)-s.offsetTop+Oe(p.paddingBottom)-Oe(y.marginBottom)}}return Ot(r.right)&&(t=Math.min(t,r.right)),Ot(r.bottom)&&(n=Math.min(n,r.bottom)),Ot(r.left)&&(t=Math.max(t,r.left)),Ot(r.top)&&(n=Math.max(n,r.top)),[t,n]}function tr(e,t,n){const r=Math.round(t/e[0])*e[0],s=Math.round(n/e[1])*e[1];return[r,s]}function Oi(e){return e.props.axis==="both"||e.props.axis==="x"}function Ei(e){return e.props.axis==="both"||e.props.axis==="y"}function yn(e,t,n){const r=typeof t=="number"?vi(e,t):null;if(typeof t=="number"&&!r)return null;const s=Ln(n),a=n.props.offsetParent||s.offsetParent||s.ownerDocument.body;return xi(r||e,a,n.props.scale)}function gn(e,t,n){const r=!Ot(e.lastX),s=Ln(e);return r?{node:s,deltaX:0,deltaY:0,lastX:t,lastY:n,x:t,y:n}:{node:s,deltaX:t-e.lastX,deltaY:n-e.lastY,lastX:e.lastX,lastY:e.lastY,x:t,y:n}}function mn(e,t){const n=e.props.scale;return{node:t.node,x:e.state.x+t.deltaX/n,y:e.state.y+t.deltaY/n,deltaX:t.deltaX/n,deltaY:t.deltaY/n,lastX:e.state.x,lastY:e.state.y}}function ji(e){return{left:e.left,top:e.top,right:e.right,bottom:e.bottom}}function Ln(e){const t=e.findDOMNode();if(!t)throw new Error("<DraggableCore>: Unmounted during event!");return t}function Je(...e){ci.DRAGGABLE_DEBUG&&console.log(...e)}var Ie={touch:{start:"touchstart",move:"touchmove",stop:"touchend"},mouse:{start:"mousedown",move:"mousemove",stop:"mouseup"}},lt=Ie.mouse,xt=class extends m.Component{constructor(){super(...arguments),this.dragging=!1,this.lastX=NaN,this.lastY=NaN,this.touchIdentifier=null,this.mounted=!1,this.handleDragStart=e=>{if(this.props.onMouseDown(e),!this.props.allowAnyClick&&(typeof e.button=="number"&&e.button!==0||e.ctrlKey))return!1;const t=this.findDOMNode();if(!t||!t.ownerDocument||!t.ownerDocument.body)throw new Error("<DraggableCore> not mounted on DragStart!");const{ownerDocument:n}=t;if(this.props.disabled||!(e.target instanceof n.defaultView.Node)||this.props.handle&&!Zn(e.target,this.props.handle,t)||this.props.cancel&&Zn(e.target,this.props.cancel,t))return;e.type==="touchstart"&&!this.props.allowMobileScroll&&e.preventDefault();const r=Ri(e);this.touchIdentifier=r;const s=yn(e,r,this);if(s==null)return;const{x:a,y:o}=s,d=gn(this,a,o);Je("DraggableCore: handleDragStart: %j",d),Je("calling",this.props.onStart),!(this.props.onStart(e,d)===!1||this.mounted===!1)&&(this.props.enableUserSelectHack&&Di(n,this.props.nonce),this.dragging=!0,this.lastX=a,this.lastY=o,pn(n,lt.move,this.handleDrag),pn(n,lt.stop,this.handleDragStop))},this.handleDrag=e=>{const t=yn(e,this.touchIdentifier,this);if(t==null)return;let{x:n,y:r}=t;if(Array.isArray(this.props.grid)){let o=n-this.lastX,d=r-this.lastY;if([o,d]=tr(this.props.grid,o,d),!o&&!d)return;n=this.lastX+o,r=this.lastY+d}const s=gn(this,n,r);if(Je("DraggableCore: handleDrag: %j",s),this.props.onDrag(e,s)===!1||this.mounted===!1){try{this.handleDragStop(new MouseEvent("mouseup"))}catch{const o=document.createEvent("MouseEvents");o.initMouseEvent("mouseup",!0,!0,window,0,0,0,0,0,!1,!1,!1,!1,0,null),this.handleDragStop(o)}return}this.lastX=n,this.lastY=r},this.handleDragStop=e=>{if(!this.dragging)return;const t=yn(e,this.touchIdentifier,this);if(t==null)return;let{x:n,y:r}=t;if(Array.isArray(this.props.grid)){let d=n-this.lastX||0,l=r-this.lastY||0;[d,l]=tr(this.props.grid,d,l),n=this.lastX+d,r=this.lastY+l}const s=gn(this,n,r);if(this.props.onStop(e,s)===!1||this.mounted===!1)return!1;const o=this.findDOMNode();o&&this.props.enableUserSelectHack&&Qn(o.ownerDocument),Je("DraggableCore: handleDragStop: %j",s),this.dragging=!1,this.lastX=NaN,this.lastY=NaN,o&&(Je("DraggableCore: Removing handlers"),dt(o.ownerDocument,lt.move,this.handleDrag),dt(o.ownerDocument,lt.stop,this.handleDragStop))},this.onMouseDown=e=>(lt=Ie.mouse,this.handleDragStart(e)),this.onMouseUp=e=>(lt=Ie.mouse,this.handleDragStop(e)),this.onTouchStart=e=>(lt=Ie.touch,this.handleDragStart(e)),this.onTouchEnd=e=>(lt=Ie.touch,this.handleDragStop(e))}componentDidMount(){this.mounted=!0;const e=this.findDOMNode();e&&pn(e,Ie.touch.start,this.onTouchStart,{passive:!1})}componentWillUnmount(){this.mounted=!1;const e=this.findDOMNode();if(e){const{ownerDocument:t}=e;dt(t,Ie.mouse.move,this.handleDrag),dt(t,Ie.touch.move,this.handleDrag),dt(t,Ie.mouse.stop,this.handleDragStop),dt(t,Ie.touch.stop,this.handleDragStop),dt(e,Ie.touch.start,this.onTouchStart,{passive:!1}),this.props.enableUserSelectHack&&Qn(t)}}findDOMNode(){var e;if((e=this.props)!=null&&e.nodeRef)return this.props.nodeRef.current;const t=hr;return typeof t.findDOMNode=="function"?t.findDOMNode(this):(Je("react-draggable: ReactDOM.findDOMNode is not available in React 19+. You must provide a nodeRef prop. See: https://github.com/react-grid-layout/react-draggable#noderef"),null)}render(){return m.cloneElement(m.Children.only(this.props.children),{onMouseDown:this.onMouseDown,onMouseUp:this.onMouseUp,onTouchEnd:this.onTouchEnd})}};xt.displayName="DraggableCore";xt.propTypes={allowAnyClick:N.bool,allowMobileScroll:N.bool,children:N.node.isRequired,disabled:N.bool,enableUserSelectHack:N.bool,offsetParent:function(e,t){if(e[t]&&e[t].nodeType!==1)throw new Error("Draggable's offsetParent must be a DOM Node.")},grid:N.arrayOf(N.number),handle:N.string,cancel:N.string,nodeRef:N.object,nonce:N.string,onStart:N.func,onDrag:N.func,onStop:N.func,onMouseDown:N.func,scale:N.number,className:bt,style:bt,transform:bt};xt.defaultProps={allowAnyClick:!1,allowMobileScroll:!1,disabled:!1,enableUserSelectHack:!0,onStart:function(){},onDrag:function(){},onStop:function(){},onMouseDown:function(){},scale:1};var Hn=class extends m.Component{constructor(e){super(e),this.onDragStart=(t,n)=>{if(Je("Draggable: onDragStart: %j",n),this.props.onStart(t,mn(this,n))===!1)return!1;this.setState({dragging:!0,dragged:!0})},this.onDrag=(t,n)=>{if(!this.state.dragging)return!1;Je("Draggable: onDrag: %j",n);const r=mn(this,n),s={x:r.x,y:r.y,slackX:0,slackY:0};if(this.props.bounds){const{x:o,y:d}=s;s.x+=this.state.slackX,s.y+=this.state.slackY;const[l,y]=Pi(this,s.x,s.y);s.x=l,s.y=y,s.slackX=this.state.slackX+(o-s.x),s.slackY=this.state.slackY+(d-s.y),r.x=s.x,r.y=s.y,r.deltaX=s.x-this.state.x,r.deltaY=s.y-this.state.y}if(this.props.onDrag(t,r)===!1)return!1;this.setState(s)},this.onDragStop=(t,n)=>{if(!this.state.dragging||this.props.onStop(t,mn(this,n))===!1)return!1;Je("Draggable: onDragStop: %j",n);const s={dragging:!1,slackX:0,slackY:0};if(!!this.props.position){const{x:o,y:d}=this.props.position;s.x=o,s.y=d}this.setState(s)},this.state={dragging:!1,dragged:!1,x:e.position?e.position.x:e.defaultPosition.x,y:e.position?e.position.y:e.defaultPosition.y,prevPropsPosition:{...e.position},slackX:0,slackY:0,isElementSVG:!1},e.position&&!(e.onDrag||e.onStop)&&console.warn("A `position` was applied to this <Draggable>, without drag handlers. This will make this component effectively undraggable. Please attach `onDrag` or `onStop` handlers so you can adjust the `position` of this element.")}static getDerivedStateFromProps({position:e},{prevPropsPosition:t}){return e&&(!t||e.x!==t.x||e.y!==t.y)?(Je("Draggable: getDerivedStateFromProps %j",{position:e,prevPropsPosition:t}),{x:e.x,y:e.y,prevPropsPosition:{...e}}):null}componentDidMount(){typeof window.SVGElement<"u"&&this.findDOMNode()instanceof window.SVGElement&&this.setState({isElementSVG:!0})}componentWillUnmount(){this.state.dragging&&this.setState({dragging:!1})}findDOMNode(){var e;if((e=this.props)!=null&&e.nodeRef)return this.props.nodeRef.current;const t=hr;return typeof t.findDOMNode=="function"?t.findDOMNode(this):null}render(){const{axis:e,bounds:t,children:n,defaultPosition:r,defaultClassName:s,defaultClassNameDragging:a,defaultClassNameDragged:o,position:d,positionOffset:l,scale:y,...p}=this.props;let x={},z=null;const R=!!!d||this.state.dragging,f=d||r,c={x:Oi(this)&&R?this.state.x:f.x,y:Ei(this)&&R?this.state.y:f.y};this.state.isElementSVG?z=bi(c,l):x=wi(c,l);const g=m.Children.only(n),S=Rn(g.props.className||"",s,{[a]:this.state.dragging,[o]:this.state.dragged});return m.createElement(xt,{...p,onStart:this.onDragStart,onDrag:this.onDrag,onStop:this.onDragStop},m.cloneElement(g,{className:S,style:{...g.props.style,...x},transform:z}))}};Hn.displayName="Draggable";Hn.propTypes={...xt.propTypes,axis:N.oneOf(["both","x","y","none"]),bounds:N.oneOfType([N.shape({left:N.number,right:N.number,top:N.number,bottom:N.number}),N.string,N.oneOf([!1])]),defaultClassName:N.string,defaultClassNameDragging:N.string,defaultClassNameDragged:N.string,defaultPosition:N.shape({x:N.number,y:N.number}),positionOffset:N.shape({x:N.oneOfType([N.number,N.string]),y:N.oneOfType([N.number,N.string])}),position:N.shape({x:N.number,y:N.number}),className:bt,style:bt,transform:bt};Hn.defaultProps={...xt.defaultProps,axis:"both",bounds:!1,defaultClassName:"react-draggable",defaultClassNameDragging:"react-draggable-dragging",defaultClassNameDragged:"react-draggable-dragged",defaultPosition:{x:0,y:0},scale:1};var St={exports:{}},Dt={},Ct={exports:{}},Bt={exports:{}},nr;function Mi(){if(nr)return Bt.exports;nr=1;function e(n){var r,s,a="";if(typeof n=="string"||typeof n=="number")a+=n;else if(typeof n=="object")if(Array.isArray(n)){var o=n.length;for(r=0;r<o;r++)n[r]&&(s=e(n[r]))&&(a&&(a+=" "),a+=s)}else for(s in n)n[s]&&(a&&(a+=" "),a+=s);return a}function t(){for(var n,r,s=0,a="",o=arguments.length;s<o;s++)(n=arguments[s])&&(r=e(n))&&(a&&(a+=" "),a+=r);return a}return Bt.exports=t,Bt.exports.clsx=t,Bt.exports}var xn,rr;function Ni(){if(rr)return xn;rr=1;var e={},t=Object.create,n=Object.defineProperty,r=Object.getOwnPropertyDescriptor,s=Object.getOwnPropertyNames,a=Object.getPrototypeOf,o=Object.prototype.hasOwnProperty,d=(i,u)=>{for(var h in u)n(i,h,{get:u[h],enumerable:!0})},l=(i,u,h,w)=>{if(u&&typeof u=="object"||typeof u=="function")for(let v of s(u))!o.call(i,v)&&v!==h&&n(i,v,{get:()=>u[v],enumerable:!(w=r(u,v))||w.enumerable});return i},y=(i,u,h)=>(h=i!=null?t(a(i)):{},l(!i||!i.__esModule?n(h,"default",{value:i,enumerable:!0}):h,i)),p=i=>l(n({},"__esModule",{value:!0}),i),x={};d(x,{DraggableCore:()=>_e,default:()=>qe}),xn=p(x);var z=y(Et()),C=y(Mt()),R=y(An()),f=Mi();function c(i,u){for(let h=0,w=i.length;h<w;h++)if(u.apply(u,[i[h],h,i]))return i[h]}function g(i){return typeof i=="function"||Object.prototype.toString.call(i)==="[object Function]"}function S(i){return typeof i=="number"&&!isNaN(i)}function P(i){return parseInt(i,10)}function H(i,u,h){if(i[u])return new Error(`Invalid prop ${u} passed to ${h} - do not set this, set it on the child.`)}var k=["Moz","Webkit","O","ms"];function D(i="transform"){var u,h;if(typeof window>"u")return"";const w=(h=(u=window.document)==null?void 0:u.documentElement)==null?void 0:h.style;if(!w||i in w)return"";for(let v=0;v<k.length;v++)if(E(i,k[v])in w)return k[v];return""}function E(i,u){return u?`${u}${j(i)}`:i}function j(i){let u="",h=!0;for(let w=0;w<i.length;w++)h?(u+=i[w].toUpperCase(),h=!1):i[w]==="-"?h=!0:u+=i[w];return u}var $=D(),ie="";function he(i,u){var h;ie||(ie=(h=c(["matches","webkitMatchesSelector","mozMatchesSelector","msMatchesSelector","oMatchesSelector"],function(v){return g(i[v])}))!=null?h:"");const w=i[ie];return g(w)?!!w.call(i,u):!1}function pe(i,u,h){let w=i;do{if(he(w,u))return!0;if(w===h)return!1;w=w.parentNode}while(w);return!1}function T(i,u,h,w){if(!i)return;const v={capture:!0,...w},U=h;i.addEventListener?i.addEventListener(u,U,v):i.attachEvent?i.attachEvent("on"+u,U):i["on"+u]=U}function q(i,u,h,w){if(!i)return;const v={capture:!0,...w},U=h;i.removeEventListener?i.removeEventListener(u,U,v):i.detachEvent?i.detachEvent("on"+u,U):i["on"+u]=null}function Ee(i){let u=i.clientHeight;const h=i.ownerDocument.defaultView.getComputedStyle(i);return u+=P(h.borderTopWidth),u+=P(h.borderBottomWidth),u}function ce(i){let u=i.clientWidth;const h=i.ownerDocument.defaultView.getComputedStyle(i);return u+=P(h.borderLeftWidth),u+=P(h.borderRightWidth),u}function ne(i){let u=i.clientHeight;const h=i.ownerDocument.defaultView.getComputedStyle(i);return u-=P(h.paddingTop),u-=P(h.paddingBottom),u}function Se(i){let u=i.clientWidth;const h=i.ownerDocument.defaultView.getComputedStyle(i);return u-=P(h.paddingLeft),u-=P(h.paddingRight),u}function He(i,u,h){const v=u===u.ownerDocument.body?{left:0,top:0}:u.getBoundingClientRect(),U=(i.clientX+u.scrollLeft-v.left)/h,L=(i.clientY+u.scrollTop-v.top)/h;return{x:U,y:L}}function re(i,u){const h=De(i,u,"px");return{[E("transform",$)]:h}}function je(i,u){return De(i,u,"")}function De({x:i,y:u},h,w){let v=`translate(${i}${w},${u}${w})`;if(h){const U=`${typeof h.x=="string"?h.x:h.x+w}`,L=`${typeof h.y=="string"?h.y:h.y+w}`;v=`translate(${U}, ${L})`+v}return v}function Fe(i,u){return i.targetTouches&&c(i.targetTouches,h=>u===h.identifier)||i.changedTouches&&c(i.changedTouches,h=>u===h.identifier)}function Te(i){if(i.targetTouches&&i.targetTouches[0])return i.targetTouches[0].identifier;if(i.changedTouches&&i.changedTouches[0])return i.changedTouches[0].identifier}function $e(){return typeof __webpack_nonce__<"u"?__webpack_nonce__:void 0}function ye(i,u){if(!i)return;let h=i.getElementById("react-draggable-style-el");if(!h){h=i.createElement("style"),h.type="text/css",h.id="react-draggable-style-el";const w=u??$e();w&&h.setAttribute("nonce",w),h.innerHTML=`.react-draggable-transparent-selection *::-moz-selection {all: inherit;}
`,h.innerHTML+=`.react-draggable-transparent-selection *::selection {all: inherit;}
`,i.getElementsByTagName("head")[0].appendChild(h)}i.body&&V(i.body,"react-draggable-transparent-selection")}function ue(i){window.requestAnimationFrame?window.requestAnimationFrame(()=>{Ce(i)}):Ce(i)}function Ce(i){if(i)try{i.body&&ge(i.body,"react-draggable-transparent-selection");const u=i.selection;if(u)u.empty();else{const h=(i.defaultView||window).getSelection();h&&h.type!=="Caret"&&h.removeAllRanges()}}catch{}}function V(i,u){i.classList?i.classList.add(u):i.className.match(new RegExp(`(?:^|\\s)${u}(?!\\S)`))||(i.className+=` ${u}`)}function ge(i,u){i.classList?i.classList.remove(u):i.className=i.className.replace(new RegExp(`(?:^|\\s)${u}(?!\\S)`,"g"),"")}function A(i,u,h){if(!i.props.bounds)return[u,h];let{bounds:w}=i.props;w=typeof w=="string"?w:st(w);const v=Z(i);if(typeof w=="string"){const{ownerDocument:U}=v,L=U.defaultView;if(!L)throw new Error("Cannot resolve the owner window of the draggable node.");let K;if(w==="parent"?K=v.parentNode:K=v.getRootNode().querySelector(w),!(K instanceof L.HTMLElement))throw new Error('Bounds selector "'+w+'" could not find an element.');const ve=K,le=L.getComputedStyle(v),Ve=L.getComputedStyle(ve);w={left:-v.offsetLeft+P(Ve.paddingLeft)+P(le.marginLeft),top:-v.offsetTop+P(Ve.paddingTop)+P(le.marginTop),right:Se(ve)-ce(v)-v.offsetLeft+P(Ve.paddingRight)-P(le.marginRight),bottom:ne(ve)-Ee(v)-v.offsetTop+P(Ve.paddingBottom)-P(le.marginBottom)}}return S(w.right)&&(u=Math.min(u,w.right)),S(w.bottom)&&(h=Math.min(h,w.bottom)),S(w.left)&&(u=Math.max(u,w.left)),S(w.top)&&(h=Math.max(h,w.top)),[u,h]}function de(i,u,h){const w=Math.round(u/i[0])*i[0],v=Math.round(h/i[1])*i[1];return[w,v]}function me(i){return i.props.axis==="both"||i.props.axis==="x"}function Ue(i){return i.props.axis==="both"||i.props.axis==="y"}function Me(i,u,h){const w=typeof u=="number"?Fe(i,u):null;if(typeof u=="number"&&!w)return null;const v=Z(h),U=h.props.offsetParent||v.offsetParent||v.ownerDocument.body;return He(w||i,U,h.props.scale)}function oe(i,u,h){const w=!S(i.lastX),v=Z(i);return w?{node:v,deltaX:0,deltaY:0,lastX:u,lastY:h,x:u,y:h}:{node:v,deltaX:u-i.lastX,deltaY:h-i.lastY,lastX:i.lastX,lastY:i.lastY,x:u,y:h}}function xe(i,u){const h=i.props.scale;return{node:u.node,x:i.state.x+u.deltaX/h,y:i.state.y+u.deltaY/h,deltaX:u.deltaX/h,deltaY:u.deltaY/h,lastX:i.state.x,lastY:i.state.y}}function st(i){return{left:i.left,top:i.top,right:i.right,bottom:i.bottom}}function Z(i){const u=i.findDOMNode();if(!u)throw new Error("<DraggableCore>: Unmounted during event!");return u}var F=y(Et()),I=y(Mt()),we=y(An());function ae(...i){e.DRAGGABLE_DEBUG&&console.log(...i)}var ze={touch:{start:"touchstart",move:"touchmove",stop:"touchend"},mouse:{start:"mousedown",move:"mousemove",stop:"mouseup"}},be=ze.mouse,_e=class extends F.Component{constructor(){super(...arguments),this.dragging=!1,this.lastX=NaN,this.lastY=NaN,this.touchIdentifier=null,this.mounted=!1,this.handleDragStart=i=>{if(this.props.onMouseDown(i),!this.props.allowAnyClick&&(typeof i.button=="number"&&i.button!==0||i.ctrlKey))return!1;const u=this.findDOMNode();if(!u||!u.ownerDocument||!u.ownerDocument.body)throw new Error("<DraggableCore> not mounted on DragStart!");const{ownerDocument:h}=u;if(this.props.disabled||!(i.target instanceof h.defaultView.Node)||this.props.handle&&!pe(i.target,this.props.handle,u)||this.props.cancel&&pe(i.target,this.props.cancel,u))return;i.type==="touchstart"&&!this.props.allowMobileScroll&&i.preventDefault();const w=Te(i);this.touchIdentifier=w;const v=Me(i,w,this);if(v==null)return;const{x:U,y:L}=v,K=oe(this,U,L);ae("DraggableCore: handleDragStart: %j",K),ae("calling",this.props.onStart),!(this.props.onStart(i,K)===!1||this.mounted===!1)&&(this.props.enableUserSelectHack&&ye(h,this.props.nonce),this.dragging=!0,this.lastX=U,this.lastY=L,T(h,be.move,this.handleDrag),T(h,be.stop,this.handleDragStop))},this.handleDrag=i=>{const u=Me(i,this.touchIdentifier,this);if(u==null)return;let{x:h,y:w}=u;if(Array.isArray(this.props.grid)){let L=h-this.lastX,K=w-this.lastY;if([L,K]=de(this.props.grid,L,K),!L&&!K)return;h=this.lastX+L,w=this.lastY+K}const v=oe(this,h,w);if(ae("DraggableCore: handleDrag: %j",v),this.props.onDrag(i,v)===!1||this.mounted===!1){try{this.handleDragStop(new MouseEvent("mouseup"))}catch{const L=document.createEvent("MouseEvents");L.initMouseEvent("mouseup",!0,!0,window,0,0,0,0,0,!1,!1,!1,!1,0,null),this.handleDragStop(L)}return}this.lastX=h,this.lastY=w},this.handleDragStop=i=>{if(!this.dragging)return;const u=Me(i,this.touchIdentifier,this);if(u==null)return;let{x:h,y:w}=u;if(Array.isArray(this.props.grid)){let K=h-this.lastX||0,ve=w-this.lastY||0;[K,ve]=de(this.props.grid,K,ve),h=this.lastX+K,w=this.lastY+ve}const v=oe(this,h,w);if(this.props.onStop(i,v)===!1||this.mounted===!1)return!1;const L=this.findDOMNode();L&&this.props.enableUserSelectHack&&ue(L.ownerDocument),ae("DraggableCore: handleDragStop: %j",v),this.dragging=!1,this.lastX=NaN,this.lastY=NaN,L&&(ae("DraggableCore: Removing handlers"),q(L.ownerDocument,be.move,this.handleDrag),q(L.ownerDocument,be.stop,this.handleDragStop))},this.onMouseDown=i=>(be=ze.mouse,this.handleDragStart(i)),this.onMouseUp=i=>(be=ze.mouse,this.handleDragStop(i)),this.onTouchStart=i=>(be=ze.touch,this.handleDragStart(i)),this.onTouchEnd=i=>(be=ze.touch,this.handleDragStop(i))}componentDidMount(){this.mounted=!0;const i=this.findDOMNode();i&&T(i,ze.touch.start,this.onTouchStart,{passive:!1})}componentWillUnmount(){this.mounted=!1;const i=this.findDOMNode();if(i){const{ownerDocument:u}=i;q(u,ze.mouse.move,this.handleDrag),q(u,ze.touch.move,this.handleDrag),q(u,ze.mouse.stop,this.handleDragStop),q(u,ze.touch.stop,this.handleDragStop),q(i,ze.touch.start,this.onTouchStart,{passive:!1}),this.props.enableUserSelectHack&&ue(u)}}findDOMNode(){var i;if((i=this.props)!=null&&i.nodeRef)return this.props.nodeRef.current;const u=we.default;return typeof u.findDOMNode=="function"?u.findDOMNode(this):(ae("react-draggable: ReactDOM.findDOMNode is not available in React 19+. You must provide a nodeRef prop. See: https://github.com/react-grid-layout/react-draggable#noderef"),null)}render(){return F.cloneElement(F.Children.only(this.props.children),{onMouseDown:this.onMouseDown,onMouseUp:this.onMouseUp,onTouchEnd:this.onTouchEnd})}};_e.displayName="DraggableCore",_e.propTypes={allowAnyClick:I.default.bool,allowMobileScroll:I.default.bool,children:I.default.node.isRequired,disabled:I.default.bool,enableUserSelectHack:I.default.bool,offsetParent:function(i,u){if(i[u]&&i[u].nodeType!==1)throw new Error("Draggable's offsetParent must be a DOM Node.")},grid:I.default.arrayOf(I.default.number),handle:I.default.string,cancel:I.default.string,nodeRef:I.default.object,nonce:I.default.string,onStart:I.default.func,onDrag:I.default.func,onStop:I.default.func,onMouseDown:I.default.func,scale:I.default.number,className:H,style:H,transform:H},_e.defaultProps={allowAnyClick:!1,allowMobileScroll:!1,disabled:!1,enableUserSelectHack:!0,onStart:function(){},onDrag:function(){},onStop:function(){},onMouseDown:function(){},scale:1};var qe=class extends z.Component{constructor(i){super(i),this.onDragStart=(u,h)=>{if(ae("Draggable: onDragStart: %j",h),this.props.onStart(u,xe(this,h))===!1)return!1;this.setState({dragging:!0,dragged:!0})},this.onDrag=(u,h)=>{if(!this.state.dragging)return!1;ae("Draggable: onDrag: %j",h);const w=xe(this,h),v={x:w.x,y:w.y,slackX:0,slackY:0};if(this.props.bounds){const{x:L,y:K}=v;v.x+=this.state.slackX,v.y+=this.state.slackY;const[ve,le]=A(this,v.x,v.y);v.x=ve,v.y=le,v.slackX=this.state.slackX+(L-v.x),v.slackY=this.state.slackY+(K-v.y),w.x=v.x,w.y=v.y,w.deltaX=v.x-this.state.x,w.deltaY=v.y-this.state.y}if(this.props.onDrag(u,w)===!1)return!1;this.setState(v)},this.onDragStop=(u,h)=>{if(!this.state.dragging||this.props.onStop(u,xe(this,h))===!1)return!1;ae("Draggable: onDragStop: %j",h);const v={dragging:!1,slackX:0,slackY:0};if(!!this.props.position){const{x:L,y:K}=this.props.position;v.x=L,v.y=K}this.setState(v)},this.state={dragging:!1,dragged:!1,x:i.position?i.position.x:i.defaultPosition.x,y:i.position?i.position.y:i.defaultPosition.y,prevPropsPosition:{...i.position},slackX:0,slackY:0,isElementSVG:!1},i.position&&!(i.onDrag||i.onStop)&&console.warn("A `position` was applied to this <Draggable>, without drag handlers. This will make this component effectively undraggable. Please attach `onDrag` or `onStop` handlers so you can adjust the `position` of this element.")}static getDerivedStateFromProps({position:i},{prevPropsPosition:u}){return i&&(!u||i.x!==u.x||i.y!==u.y)?(ae("Draggable: getDerivedStateFromProps %j",{position:i,prevPropsPosition:u}),{x:i.x,y:i.y,prevPropsPosition:{...i}}):null}componentDidMount(){typeof window.SVGElement<"u"&&this.findDOMNode()instanceof window.SVGElement&&this.setState({isElementSVG:!0})}componentWillUnmount(){this.state.dragging&&this.setState({dragging:!1})}findDOMNode(){var i;if((i=this.props)!=null&&i.nodeRef)return this.props.nodeRef.current;const u=R.default;return typeof u.findDOMNode=="function"?u.findDOMNode(this):null}render(){const{axis:i,bounds:u,children:h,defaultPosition:w,defaultClassName:v,defaultClassNameDragging:U,defaultClassNameDragged:L,position:K,positionOffset:ve,scale:le,...Ve}=this.props;let it={},We=null;const B=!!!K||this.state.dragging,W=K||w,Q={x:me(this)&&B?this.state.x:W.x,y:Ue(this)&&B?this.state.y:W.y};this.state.isElementSVG?We=je(Q,ve):it=re(Q,ve);const G=z.Children.only(h),fe=(0,f.clsx)(G.props.className||"",v,{[U]:this.state.dragging,[L]:this.state.dragged});return z.createElement(_e,{...Ve,onStart:this.onDragStart,onDrag:this.onDrag,onStop:this.onDragStop},z.cloneElement(G,{className:fe,style:{...G.props.style,...it},transform:We}))}};return qe.displayName="Draggable",qe.propTypes={..._e.propTypes,axis:C.default.oneOf(["both","x","y","none"]),bounds:C.default.oneOfType([C.default.shape({left:C.default.number,right:C.default.number,top:C.default.number,bottom:C.default.number}),C.default.string,C.default.oneOf([!1])]),defaultClassName:C.default.string,defaultClassNameDragging:C.default.string,defaultClassNameDragged:C.default.string,defaultPosition:C.default.shape({x:C.default.number,y:C.default.number}),positionOffset:C.default.shape({x:C.default.oneOfType([C.default.number,C.default.string]),y:C.default.oneOfType([C.default.number,C.default.string])}),position:C.default.shape({x:C.default.number,y:C.default.number}),className:H,style:H,transform:H},qe.defaultProps={..._e.defaultProps,axis:"both",bounds:!1,defaultClassName:"react-draggable",defaultClassNameDragging:"react-draggable-dragging",defaultClassNameDragged:"react-draggable-dragged",defaultPosition:{x:0,y:0},scale:1},xn}var sr;function $r(){if(sr)return Ct.exports;sr=1;const e=Ni(),t=e.DraggableCore,n=e.default||e;return Ct.exports=n,Ct.exports.default=n,Ct.exports.DraggableCore=t,Ct.exports}var Wt={},ir;function ki(){if(ir)return Wt;ir=1,Wt.__esModule=!0,Wt.cloneElement=d;var e=t(Et());function t(l){return l&&l.__esModule?l:{default:l}}function n(l,y){var p=Object.keys(l);if(Object.getOwnPropertySymbols){var x=Object.getOwnPropertySymbols(l);y&&(x=x.filter(function(z){return Object.getOwnPropertyDescriptor(l,z).enumerable})),p.push.apply(p,x)}return p}function r(l){for(var y=1;y<arguments.length;y++){var p=arguments[y]!=null?arguments[y]:{};y%2?n(Object(p),!0).forEach(function(x){s(l,x,p[x])}):Object.getOwnPropertyDescriptors?Object.defineProperties(l,Object.getOwnPropertyDescriptors(p)):n(Object(p)).forEach(function(x){Object.defineProperty(l,x,Object.getOwnPropertyDescriptor(p,x))})}return l}function s(l,y,p){return(y=a(y))in l?Object.defineProperty(l,y,{value:p,enumerable:!0,configurable:!0,writable:!0}):l[y]=p,l}function a(l){var y=o(l,"string");return typeof y=="symbol"?y:y+""}function o(l,y){if(typeof l!="object"||!l)return l;var p=l[Symbol.toPrimitive];if(p!==void 0){var x=p.call(l,y);if(typeof x!="object")return x;throw new TypeError("@@toPrimitive must return a primitive value.")}return(y==="string"?String:Number)(l)}function d(l,y){return y.style&&l.props.style&&(y.style=r(r({},l.props.style),y.style)),y.className&&l.props.className&&(y.className=l.props.className+" "+y.className),e.default.cloneElement(l,y)}return Wt}var zt={},or;function Ur(){if(or)return zt;or=1,zt.__esModule=!0,zt.resizableProps=void 0;var e=t(Mt());$r();function t(n){return n&&n.__esModule?n:{default:n}}return zt.resizableProps={axis:e.default.oneOf(["both","x","y","none"]),className:e.default.string,children:e.default.element.isRequired,draggableOpts:e.default.shape({allowAnyClick:e.default.bool,cancel:e.default.string,children:e.default.node,disabled:e.default.bool,enableUserSelectHack:e.default.bool,offsetParent:typeof Element<"u"?e.default.instanceOf(Element):e.default.any,grid:e.default.arrayOf(e.default.number),handle:e.default.string,nodeRef:e.default.object,onStart:e.default.func,onDrag:e.default.func,onStop:e.default.func,onMouseDown:e.default.func,scale:e.default.number}),height:function(){for(var n=arguments.length,r=new Array(n),s=0;s<n;s++)r[s]=arguments[s];const a=r[0];return a.axis==="both"||a.axis==="y"?e.default.number.isRequired(...r):e.default.number(...r)},handle:e.default.oneOfType([e.default.node,e.default.func]),handleSize:e.default.arrayOf(e.default.number),lockAspectRatio:e.default.bool,maxConstraints:e.default.arrayOf(e.default.number),minConstraints:e.default.arrayOf(e.default.number),onResizeStop:e.default.func,onResizeStart:e.default.func,onResize:e.default.func,resizeHandles:e.default.arrayOf(e.default.oneOf(["s","w","e","n","sw","nw","se","ne"])),transformScale:e.default.number,width:function(){for(var n=arguments.length,r=new Array(n),s=0;s<n;s++)r[s]=arguments[s];const a=r[0];return a.axis==="both"||a.axis==="x"?e.default.number.isRequired(...r):e.default.number(...r)}},zt}var ar;function Vr(){if(ar)return Dt;ar=1,Dt.__esModule=!0,Dt.default=void 0;var e=a(Et()),t=$r(),n=ki(),r=Ur();const s=["children","className","draggableOpts","width","height","handle","handleSize","lockAspectRatio","axis","minConstraints","maxConstraints","onResize","onResizeStop","onResizeStart","resizeHandles","transformScale"];function a(R,f){if(typeof WeakMap=="function")var c=new WeakMap,g=new WeakMap;return(a=function(S,P){if(!P&&S&&S.__esModule)return S;var H,k,D={__proto__:null,default:S};if(S===null||typeof S!="object"&&typeof S!="function")return D;if(H=P?g:c){if(H.has(S))return H.get(S);H.set(S,D)}for(const E in S)E!=="default"&&{}.hasOwnProperty.call(S,E)&&((k=(H=Object.defineProperty)&&Object.getOwnPropertyDescriptor(S,E))&&(k.get||k.set)?H(D,E,k):D[E]=S[E]);return D})(R,f)}function o(){return o=Object.assign?Object.assign.bind():function(R){for(var f=1;f<arguments.length;f++){var c=arguments[f];for(var g in c)({}).hasOwnProperty.call(c,g)&&(R[g]=c[g])}return R},o.apply(null,arguments)}function d(R,f){if(R==null)return{};var c={};for(var g in R)if({}.hasOwnProperty.call(R,g)){if(f.indexOf(g)!==-1)continue;c[g]=R[g]}return c}function l(R,f){var c=Object.keys(R);if(Object.getOwnPropertySymbols){var g=Object.getOwnPropertySymbols(R);f&&(g=g.filter(function(S){return Object.getOwnPropertyDescriptor(R,S).enumerable})),c.push.apply(c,g)}return c}function y(R){for(var f=1;f<arguments.length;f++){var c=arguments[f]!=null?arguments[f]:{};f%2?l(Object(c),!0).forEach(function(g){p(R,g,c[g])}):Object.getOwnPropertyDescriptors?Object.defineProperties(R,Object.getOwnPropertyDescriptors(c)):l(Object(c)).forEach(function(g){Object.defineProperty(R,g,Object.getOwnPropertyDescriptor(c,g))})}return R}function p(R,f,c){return(f=x(f))in R?Object.defineProperty(R,f,{value:c,enumerable:!0,configurable:!0,writable:!0}):R[f]=c,R}function x(R){var f=z(R,"string");return typeof f=="symbol"?f:f+""}function z(R,f){if(typeof R!="object"||!R)return R;var c=R[Symbol.toPrimitive];if(c!==void 0){var g=c.call(R,f);if(typeof g!="object")return g;throw new TypeError("@@toPrimitive must return a primitive value.")}return(f==="string"?String:Number)(R)}let C=class extends e.Component{constructor(){super(...arguments),this.handleRefs={},this.lastHandleRect=null,this.slack=null,this.lastSize=null}componentWillUnmount(){this.resetData()}resetData(){this.lastHandleRect=this.slack=this.lastSize=null}runConstraints(f,c){const g=this.props,S=g.minConstraints,P=g.maxConstraints,H=g.lockAspectRatio;if(!S&&!P&&!H)return[f,c];if(H){const ie=this.props.width/this.props.height,he=f-this.props.width,pe=c-this.props.height;Math.abs(he)>Math.abs(pe*ie)?c=f/ie:f=c*ie}const k=f,D=c;let E=this.slack||[0,0],j=E[0],$=E[1];return f+=j,c+=$,S&&(f=Math.max(S[0],f),c=Math.max(S[1],c)),P&&(f=Math.min(P[0],f),c=Math.min(P[1],c)),this.slack=[j+(k-f),$+(D-c)],[f,c]}resizeHandler(f,c){return(g,S)=>{var P,H,k,D;let E=S.node,j=S.deltaX,$=S.deltaY;f==="onResizeStart"&&this.resetData();const ie=(this.props.axis==="both"||this.props.axis==="x")&&c!=="n"&&c!=="s",he=(this.props.axis==="both"||this.props.axis==="y")&&c!=="e"&&c!=="w";if(!ie&&!he)return;const pe=c[0],T=c[c.length-1],q=E.getBoundingClientRect();if(this.lastHandleRect!=null){if(T==="w"){const Te=q.left-this.lastHandleRect.left;j+=Te}if(pe==="n"){const Te=q.top-this.lastHandleRect.top;$+=Te}}this.lastHandleRect=q,T==="w"&&(j=-j),pe==="n"&&($=-$);const Ee=(P=(H=this.lastSize)==null?void 0:H.width)!=null?P:this.props.width,ce=(k=(D=this.lastSize)==null?void 0:D.height)!=null?k:this.props.height;let ne=Ee+(ie?j/this.props.transformScale:0),Se=ce+(he?$/this.props.transformScale:0);var He=this.runConstraints(ne,Se);if(ne=He[0],Se=He[1],f==="onResizeStop"&&this.lastSize){var re=this.lastSize;ne=re.width,Se=re.height}const je=ne!==Ee||Se!==ce;f!=="onResizeStop"&&(this.lastSize={width:ne,height:Se});const De=typeof this.props[f]=="function"?this.props[f]:null;De&&!(f==="onResize"&&!je)&&(g.persist==null||g.persist(),De(g,{node:E,size:{width:ne,height:Se},handle:c})),f==="onResizeStop"&&this.resetData()}}renderResizeHandle(f,c){const g=this.props.handle;if(!g)return e.createElement("span",{className:"react-resizable-handle react-resizable-handle-"+f,ref:c});if(typeof g=="function")return g(f,c);const S=typeof g.type=="string",P=y({ref:c},S?{}:{handleAxis:f});return e.cloneElement(g,P)}render(){const f=this.props,c=f.children,g=f.className,S=f.draggableOpts;f.width,f.height,f.handle,f.handleSize,f.lockAspectRatio,f.axis,f.minConstraints,f.maxConstraints,f.onResize,f.onResizeStop,f.onResizeStart;const P=f.resizeHandles;f.transformScale;const H=d(f,s);return(0,n.cloneElement)(c,y(y({},H),{},{className:(g?g+" ":"")+"react-resizable",children:[...e.Children.toArray(c.props.children),...P.map(k=>{var D;const E=(D=this.handleRefs[k])!=null?D:this.handleRefs[k]=e.createRef();return e.createElement(t.DraggableCore,o({},S,{nodeRef:E,key:"resizableHandle-"+k,onStop:this.resizeHandler("onResizeStop",k),onStart:this.resizeHandler("onResizeStart",k),onDrag:this.resizeHandler("onResize",k)}),this.renderResizeHandle(k,E))})]}))}};return Dt.default=C,C.propTypes=r.resizableProps,C.defaultProps={axis:"both",handleSize:[20,20],lockAspectRatio:!1,minConstraints:[20,20],maxConstraints:[1/0,1/0],resizeHandles:["se"],transformScale:1},Dt}var Pt={},lr;function Ti(){if(lr)return Pt;lr=1,Pt.__esModule=!0,Pt.default=void 0;var e=o(Et()),t=a(Mt()),n=a(Vr()),r=Ur();const s=["handle","handleSize","onResize","onResizeStart","onResizeStop","draggableOpts","minConstraints","maxConstraints","lockAspectRatio","axis","width","height","resizeHandles","style","transformScale"];function a(f){return f&&f.__esModule?f:{default:f}}function o(f,c){if(typeof WeakMap=="function")var g=new WeakMap,S=new WeakMap;return(o=function(P,H){if(!H&&P&&P.__esModule)return P;var k,D,E={__proto__:null,default:P};if(P===null||typeof P!="object"&&typeof P!="function")return E;if(k=H?S:g){if(k.has(P))return k.get(P);k.set(P,E)}for(const j in P)j!=="default"&&{}.hasOwnProperty.call(P,j)&&((D=(k=Object.defineProperty)&&Object.getOwnPropertyDescriptor(P,j))&&(D.get||D.set)?k(E,j,D):E[j]=P[j]);return E})(f,c)}function d(){return d=Object.assign?Object.assign.bind():function(f){for(var c=1;c<arguments.length;c++){var g=arguments[c];for(var S in g)({}).hasOwnProperty.call(g,S)&&(f[S]=g[S])}return f},d.apply(null,arguments)}function l(f,c){var g=Object.keys(f);if(Object.getOwnPropertySymbols){var S=Object.getOwnPropertySymbols(f);c&&(S=S.filter(function(P){return Object.getOwnPropertyDescriptor(f,P).enumerable})),g.push.apply(g,S)}return g}function y(f){for(var c=1;c<arguments.length;c++){var g=arguments[c]!=null?arguments[c]:{};c%2?l(Object(g),!0).forEach(function(S){p(f,S,g[S])}):Object.getOwnPropertyDescriptors?Object.defineProperties(f,Object.getOwnPropertyDescriptors(g)):l(Object(g)).forEach(function(S){Object.defineProperty(f,S,Object.getOwnPropertyDescriptor(g,S))})}return f}function p(f,c,g){return(c=x(c))in f?Object.defineProperty(f,c,{value:g,enumerable:!0,configurable:!0,writable:!0}):f[c]=g,f}function x(f){var c=z(f,"string");return typeof c=="symbol"?c:c+""}function z(f,c){if(typeof f!="object"||!f)return f;var g=f[Symbol.toPrimitive];if(g!==void 0){var S=g.call(f,c);if(typeof S!="object")return S;throw new TypeError("@@toPrimitive must return a primitive value.")}return(c==="string"?String:Number)(f)}function C(f,c){if(f==null)return{};var g={};for(var S in f)if({}.hasOwnProperty.call(f,S)){if(c.indexOf(S)!==-1)continue;g[S]=f[S]}return g}let R=class extends e.Component{constructor(){super(...arguments),this.state={width:this.props.width,height:this.props.height,propsWidth:this.props.width,propsHeight:this.props.height},this.onResize=(c,g)=>{const S=g.size;this.props.onResize?(c.persist==null||c.persist(),this.setState(S,()=>this.props.onResize&&this.props.onResize(c,g))):this.setState(S)}}static getDerivedStateFromProps(c,g){return g.propsWidth!==c.width||g.propsHeight!==c.height?{width:c.width,height:c.height,propsWidth:c.width,propsHeight:c.height}:null}render(){const c=this.props,g=c.handle,S=c.handleSize;c.onResize;const P=c.onResizeStart,H=c.onResizeStop,k=c.draggableOpts,D=c.minConstraints,E=c.maxConstraints,j=c.lockAspectRatio,$=c.axis;c.width,c.height;const ie=c.resizeHandles,he=c.style,pe=c.transformScale,T=C(c,s);return e.createElement(n.default,{axis:$,draggableOpts:k,handle:g,handleSize:S,height:this.state.height,lockAspectRatio:j,maxConstraints:E,minConstraints:D,onResizeStart:P,onResize:this.onResize,onResizeStop:H,resizeHandles:ie,transformScale:pe,width:this.state.width},e.createElement("div",d({},T,{style:y(y({},he),{},{width:this.state.width+"px",height:this.state.height+"px"})})))}};return Pt.default=R,R.propTypes=y(y({},r.resizableProps),{},{children:t.default.element}),Pt}var cr;function _i(){return cr||(cr=1,St.exports=function(){throw new Error("Don't instantiate Resizable directly! Use require('react-resizable').Resizable")},St.exports.Resizable=Vr().default,St.exports.ResizableBox=Ti().default),St.exports}var Li=_i();function ur(e){const{children:t,cols:n,containerWidth:r,margin:s,containerPadding:a,rowHeight:o,maxRows:d,isDraggable:l,isResizable:y,isBounded:p,static:x,useCSSTransforms:z=!0,usePercentages:C=!1,transformScale:R=1,positionStrategy:f,dragThreshold:c=0,droppingPosition:g,className:S="",style:P,handle:H="",cancel:k="",x:D,y:E,w:j,h:$,minW:ie=1,maxW:he=1/0,minH:pe=1,maxH:T=1/0,i:q,resizeHandles:Ee,resizeHandle:ce,constraints:ne=Pr,layoutItem:Se,layout:He=[],onDragStart:re,onDrag:je,onDragStop:De,onResizeStart:Fe,onResize:Te,onResizeStop:$e}=e,[ye,ue]=m.useState(!1),[Ce,V]=m.useState(!1),ge=m.useRef(null),A=m.useRef({left:0,top:0}),de=m.useRef({top:0,left:0,width:0,height:0}),me=m.useRef(void 0),Ue=m.useRef(He);Ue.current=He;const Me=m.useRef(null),oe=m.useRef(null),xe=m.useRef(!1),st=m.useRef({x:0,y:0}),Z=m.useRef(!1),F=m.useMemo(()=>({cols:n,containerPadding:a,containerWidth:r,margin:s,maxRows:d,rowHeight:o}),[n,a,r,s,d,o]),I=m.useMemo(()=>({cols:n,maxRows:d,containerWidth:r,containerHeight:0,rowHeight:o,margin:s,layout:[]}),[n,d,r,o,s]),we=m.useCallback(()=>({...I,layout:Ue.current}),[I]),ae=m.useMemo(()=>Se??{i:q,x:D,y:E,w:j,h:$,minW:ie,maxW:he,minH:pe,maxH:T},[Se,q,D,E,j,$,ie,he,pe,T]),ze=m.useCallback(B=>{if(f?.calcStyle)return f.calcStyle(B);if(z)return Or(B);const W=Ds(B);return C?{...W,left:In(B.left/r),width:In(B.width/r)}:W},[f,z,C,r]),be=m.useCallback((B,{node:W})=>{if(!re)return;const{offsetParent:Q}=W;if(!Q)return;const G=Q.getBoundingClientRect(),fe=W.getBoundingClientRect(),Ne=fe.left/R,Le=G.left/R,ke=fe.top/R,Ae=G.top/R;let Be;if(f?.calcDragPosition){const _=B;Be=f.calcDragPosition(_.clientX,_.clientY,_.clientX-fe.left,_.clientY-fe.top)}else Be={left:Ne-Le+Q.scrollLeft,top:ke-Ae+Q.scrollTop};if(A.current=Be,c>0){const _=B;st.current={x:_.clientX,y:_.clientY},xe.current=!0,Z.current=!1,ue(!0);return}ue(!0);const ot=Ht(F,Be.top,Be.left),{x:at,y:O}=qt(ne,ae,ot.x,ot.y,we());re(q,at,O,{e:B,node:W,newPosition:Be})},[re,R,F,f,c,ne,ae,we,q]),_e=m.useCallback((B,{node:W,deltaX:Q,deltaY:G})=>{if(!je||!ye)return;const fe=B;if(xe.current&&!Z.current){const at=fe.clientX-st.current.x,O=fe.clientY-st.current.y;if(Math.hypot(at,O)<c)return;if(Z.current=!0,xe.current=!1,re){const M=Ht(F,A.current.top,A.current.left),{x:Y,y:J}=qt(ne,ae,M.x,M.y,we());re(q,Y,J,{e:B,node:W,newPosition:A.current})}}let Ne=A.current.top+G,Le=A.current.left+Q;if(p){const{offsetParent:at}=W;if(at){const O=at.clientHeight-Ke($,o,s[1]);Ne=Jt(Ne,0,O);const _=gt(F),M=r-Ke(j,_,s[0]);Le=Jt(Le,0,M)}}const ke={top:Ne,left:Le};A.current=ke;const Ae=Ht(F,Ne,Le),{x:Be,y:ot}=qt(ne,ae,Ae.x,Ae.y,we());je(q,Be,ot,{e:B,node:W,newPosition:ke})},[je,re,ye,c,p,$,o,s,F,r,j,q,ne,ae,we]),qe=m.useCallback((B,{node:W})=>{if(!De||!ye)return;const Q=xe.current;if(xe.current=!1,Z.current=!1,st.current={x:0,y:0},Q){ue(!1),A.current={left:0,top:0};return}const{left:G,top:fe}=A.current,Ne={top:fe,left:G};ue(!1),A.current={left:0,top:0};const Le=Ht(F,fe,G),{x:ke,y:Ae}=qt(ne,ae,Le.x,Le.y,we());De(q,ke,Ae,{e:B,node:W,newPosition:Ne})},[De,ye,F,ne,ae,we,q]);Me.current=be,oe.current=_e;const i=m.useCallback((B,{node:W,size:Q,handle:G},fe,Ne)=>{const Le=Ne==="onResizeStart"?Fe:Ne==="onResize"?Te:$e;if(!Le)return;let ke;W?ke=Ns(G,fe,Q,r):ke={...Q,top:fe.top,left:fe.left},de.current=ke;const Ae=ms(F,ke.width,ke.height),{w:Be,h:ot}=Ss(ne,ae,Ae.w,Ae.h,G,we());Le(q,Be,ot,{e:B.nativeEvent,node:W,size:ke,handle:G})},[Fe,Te,$e,r,F,q,ne,ae,we]),u=m.useCallback((B,W)=>{V(!0);const Q=Lt(F,D,E,j,$),G={...W,handle:W.handle};i(B,G,Q,"onResizeStart")},[i,F,D,E,j,$]),h=m.useCallback((B,W)=>{const Q=Lt(F,D,E,j,$),G={...W,handle:W.handle};i(B,G,Q,"onResize")},[i,F,D,E,j,$]),w=m.useCallback((B,W)=>{V(!1),de.current={top:0,left:0,width:0,height:0};const Q=Lt(F,D,E,j,$),G={...W,handle:W.handle};i(B,G,Q,"onResizeStop")},[i,F,D,E,j,$]);m.useEffect(()=>{if(!g)return;const B=ge.current;if(!B)return;const W=me.current||{left:0,top:0},Q=ye&&(g.left!==W.left||g.top!==W.top);if(ye){if(Q){const G=g.left-A.current.left,fe=g.top-A.current.top,Ne={node:B,deltaX:G,deltaY:fe,lastX:A.current.left,lastY:A.current.top,x:g.left,y:g.top};oe.current?.(g.e,Ne)}}else{const G={node:B,deltaX:g.left,deltaY:g.top,lastX:0,lastY:0,x:g.left,y:g.top};Me.current?.(g.e,G)}me.current=g},[g,ye,q]);const v=Lt(F,D,E,j,$,ye?A.current:null,Ce?de.current:null),U=Qe.Children.only(t),L=gt(F),K=[Ke(ie,L,s[0]),Ke(pe,o,s[1])],ve=[Ke(he,L,s[0]),Ke(T,o,s[1])],le=U.props,Ve=le.className,it=le.style;let We=Qe.cloneElement(U,{ref:ge,className:Rn("react-grid-item",Ve,S,{static:x,resizing:Ce,"react-draggable":l,"react-draggable-dragging":ye,dropping:!!g,cssTransforms:z}),style:{...P,...it,...ze(v)}});const vt=ce;return We=b.jsx(Li.Resizable,{draggableOpts:{disabled:!y},className:y?void 0:"react-resizable-hide",width:v.width,height:v.height,minConstraints:K,maxConstraints:ve,onResizeStart:u,onResize:h,onResizeStop:w,transformScale:R,resizeHandles:Ee,handle:vt,children:We}),We=b.jsx(xt,{disabled:!l,onStart:be,onDrag:_e,onStop:qe,handle:H,cancel:".react-resizable-handle"+(k?","+k:""),scale:R,nodeRef:ge,children:We}),We}var nt=()=>{},dr="react-grid-layout",Kr=!1;try{Kr=/firefox/i.test(navigator.userAgent)}catch{}function Hi(e,t){const n=Qe.Children.toArray(e),r=Qe.Children.toArray(t);if(n.length!==r.length)return!1;for(let s=0;s<n.length;s++){const a=n[s],o=r[s];if(a?.key!==o?.key)return!1}return!0}function fr(e,t,n,r){const s=[],a=new Set;Qe.Children.forEach(t,d=>{if(!Qe.isValidElement(d)||d.key===null)return;const l=String(d.key);a.add(l);const y=e.find(p=>p.i===l);if(y)s.push(mt(y));else{const x=d.props["data-grid"];x?s.push({i:l,x:x.x??0,y:x.y??0,w:x.w??1,h:x.h??1,minW:x.minW,maxW:x.maxW,minH:x.minH,maxH:x.maxH,static:x.static,isDraggable:x.isDraggable,isResizable:x.isResizable,resizeHandles:x.resizeHandles,isBounded:x.isBounded}):s.push({i:l,x:0,y:Qt(s),w:1,h:1})}});const o=En(s,{cols:n});return r.compact(o,n)}function qi(e){const{children:t,width:n,gridConfig:r,dragConfig:s,resizeConfig:a,dropConfig:o,positionStrategy:d=Ts,compactor:l,constraints:y=Pr,layout:p=[],droppingItem:x,autoSize:z=!0,className:C="",style:R={},innerRef:f,onLayoutChange:c=nt,onDragStart:g=nt,onDrag:S=nt,onDragStop:P=nt,onResizeStart:H=nt,onResize:k=nt,onResizeStop:D=nt,onDrop:E=nt,onDropDragOver:j=nt}=e,$=m.useMemo(()=>({..._s,...r}),[r]),ie=m.useMemo(()=>({...Ls,...s}),[s]),he=m.useMemo(()=>({...Hs,...a}),[a]),pe=m.useMemo(()=>({...qs,...o}),[o]),{cols:T,rowHeight:q,maxRows:Ee,margin:ce,containerPadding:ne}=$,{enabled:Se,bounded:He,handle:re,cancel:je,threshold:De}=ie,{enabled:Fe,handles:Te,handleComponent:$e}=he,{enabled:ye,defaultItem:ue,onDragOver:Ce}=pe,V=l??_n("vertical"),ge=V.type,A=V.allowOverlap,de=V.preventCollision??!1,me=m.useMemo(()=>x??{i:"__dropping-elem__",...ue},[x,ue]),Ue=d.type==="transform",Me=d.scale,oe=ne??ce,[xe,st]=m.useState(!1),[Z,F]=m.useState(()=>fr(p,t,T,V)),[I,we]=m.useState(null),[ae,ze]=m.useState(!1),[be,_e]=m.useState(null),[qe,i]=m.useState(),u=m.useRef(null),h=m.useRef(null),w=m.useRef(null),v=m.useRef(0),U=m.useRef(Z),L=m.useRef(p),K=m.useRef(t),ve=m.useRef(ge),le=m.useRef(Z);le.current=Z,m.useEffect(()=>{st(!0),rt(Z,p)||c(Z)},[]),m.useEffect(()=>{if(I||be)return;const O=!rt(p,L.current),_=!Hi(t,K.current),M=ge!==ve.current;if(O||_||M){const J=fr(O?p:Z,t,T,V);rt(J,Z)||F(J)}L.current=p,K.current=t,ve.current=ge},[p,t,T,ge,V,I,be,Z]),m.useEffect(()=>{if(!I&&!rt(Z,U.current)){U.current=Z;const O=Z.filter(_=>_.i!==me.i);c(O)}},[Z,I,c,me.i]);const Ve=m.useMemo(()=>{if(!z)return;const O=Qt(Z),_=oe[1];return O*q+(O-1)*ce[1]+_*2+"px"},[z,Z,q,ce,oe]),it=m.useCallback((O,_,M,Y)=>{const J=le.current,X=ft(J,O);if(!X)return;const ee={w:X.w,h:X.h,x:X.x,y:X.y,i:O};u.current=mt(X),w.current=J,we(ee),g(J,X,X,null,Y.e,Y.node)},[g]),We=m.useCallback((O,_,M,Y)=>{const J=le.current,X=u.current,ee=ft(J,O);if(!ee)return;const Re={w:ee.w,h:ee.h,x:ee.x,y:ee.y,i:O},te=pt(J,ee,_,M,!0,de,ge,T,A);S(te,X,ee,Re,Y.e,Y.node),F(V.compact(te,T)),we(Re)},[de,ge,T,A,V,S]),vt=m.useCallback((O,_,M,Y)=>{if(!I)return;const J=le.current,X=u.current,ee=ft(J,O);if(!ee)return;const Re=pt(J,ee,_,M,!0,de,ge,T,A),te=V.compact(Re,T);P(te,X,ee,null,Y.e,Y.node);const Pe=w.current;u.current=null,w.current=null,we(null),F(te),Pe&&!rt(Pe,te)&&c(te)},[I,de,ge,T,A,V,P,c]),B=m.useCallback((O,_,M,Y)=>{const J=le.current,X=ft(J,O);X&&(h.current=mt(X),w.current=J,ze(!0),H(J,X,X,null,Y.e,Y.node))},[H]),W=m.useCallback((O,_,M,Y)=>{const J=le.current,X=h.current,{handle:ee}=Y;let Re=!1,te,Pe;const[Nt,tt]=bs(J,O,se=>(te=se.x,Pe=se.y,["sw","w","nw","n","ne"].includes(ee)&&(["sw","nw","w"].includes(ee)&&(te=se.x+(se.w-_),_=se.x!==te&&te<0?se.w:_,te=te<0?0:te),["ne","n","nw"].includes(ee)&&(Pe=se.y+(se.h-M),M=se.y!==Pe&&Pe<0?se.h:M,Pe=Pe<0?0:Pe),Re=!0),de&&!A&&Cr(J,{...se,w:_,h:M,x:te??se.x,y:Pe??se.y}).filter(Tt=>Tt.i!==se.i).length>0&&(Pe=se.y,M=se.h,te=se.x,_=se.w,Re=!1),se.w=_,se.h=M,se));if(!tt)return;let Rt=Nt;Re&&te!==void 0&&Pe!==void 0&&(Rt=pt(Nt,tt,te,Pe,!0,de,ge,T,A));const kt={w:tt.w,h:tt.h,x:tt.x,y:tt.y,i:O,static:!0};k(Rt,X,tt,kt,Y.e,Y.node),F(V.compact(Rt,T)),we(kt)},[de,ge,T,A,V,k]),Q=m.useCallback((O,_,M,Y)=>{const J=le.current,X=h.current,ee=ft(J,O),Re=V.compact(J,T);D(Re,X,ee??null,null,Y.e,Y.node);const te=w.current;h.current=null,w.current=null,we(null),ze(!1),F(Re),te&&!rt(te,Re)&&c(Re)},[T,V,D,c]),G=m.useCallback(()=>{const O=le.current;if(!O.some(Y=>Y.i===me.i)){_e(null),we(null),i(void 0);return}const M=V.compact(O.filter(Y=>Y.i!==me.i),T);F(M),_e(null),we(null),i(void 0)},[me.i,T,V]),fe=m.useCallback(O=>{if(O.preventDefault(),O.stopPropagation(),Kr&&!O.nativeEvent.target?.classList.contains(dr))return!1;const _=Ce?Ce(O.nativeEvent):j(O);if(_===!1)return be&&G(),!1;const{dragOffsetX:M=0,dragOffsetY:Y=0,...J}=_??{},X={...me,...J},ee=O.currentTarget.getBoundingClientRect(),Re={cols:T,margin:ce,maxRows:Ee,rowHeight:q,containerWidth:n,containerPadding:oe},te=gt(Re),Pe=Ke(X.w,te,ce[0]),Nt=Ke(X.h,q,ce[1]),tt=Pe/2,Rt=Nt/2,kt=O.clientX-ee.left+M-tt,se=O.clientY-ee.top+Y-Rt,sn=Math.max(0,kt),Tt=Math.max(0,se),_t={left:sn/Me,top:Tt/Me,e:O.nativeEvent};if(be)qe&&(qe.left!==_t.left||qe.top!==_t.top)&&i(_t);else{const on=gs(Re,Tt,sn,X.w,X.h);_e(b.jsx("div",{},X.i)),i(_t);const es=le.current.filter(ts=>ts.i!==X.i);F([...es,{...X,x:on.x,y:on.y,static:!1,isDraggable:!0}])}},[be,qe,me,Ce,j,G,Me,T,ce,Ee,q,n,oe]),Ne=m.useCallback(O=>{O.preventDefault(),O.stopPropagation(),v.current--,v.current<0&&(v.current=0),v.current===0&&G()},[G]),Le=m.useCallback(O=>{O.preventDefault(),O.stopPropagation(),v.current++},[]),ke=m.useCallback(O=>{O.preventDefault(),O.stopPropagation();const _=le.current,M=_.find(Y=>Y.i===me.i);v.current=0,G(),E(_,M,O.nativeEvent)},[me.i,G,E]),Ae=m.useCallback((O,_)=>{if(!O||!O.key)return null;const M=ft(Z,String(O.key));if(!M)return null;const Y=typeof M.isDraggable=="boolean"?M.isDraggable:!M.static&&Se,J=typeof M.isResizable=="boolean"?M.isResizable:!M.static&&Fe,X=M.resizeHandles||[...Te],ee=Y&&He&&M.isBounded!==!1,Re=$e;return b.jsx(ur,{containerWidth:n,cols:T,margin:ce,containerPadding:oe,maxRows:Ee,rowHeight:q,cancel:je,handle:re,onDragStart:it,onDrag:We,onDragStop:vt,onResizeStart:B,onResize:W,onResizeStop:Q,isDraggable:Y,isResizable:J,isBounded:ee,useCSSTransforms:Ue&&xe,usePercentages:!xe,transformScale:Me,positionStrategy:d,dragThreshold:De,w:M.w,h:M.h,x:M.x,y:M.y,i:M.i,minH:M.minH,minW:M.minW,maxH:M.maxH,maxW:M.maxW,static:M.static,droppingPosition:_?qe:void 0,resizeHandles:X,resizeHandle:Re,constraints:y,layoutItem:M,layout:Z,children:O},M.i)},[Z,n,T,ce,oe,Ee,q,je,re,it,We,vt,B,W,Q,Se,Fe,He,Ue,xe,Me,d,De,qe,Te,$e,y]),Be=()=>I?b.jsx(ur,{w:I.w,h:I.h,x:I.x,y:I.y,i:I.i,className:`react-grid-placeholder ${ae?"placeholder-resizing":""}`,containerWidth:n,cols:T,margin:ce,containerPadding:oe,maxRows:Ee,rowHeight:q,isDraggable:!1,isResizable:!1,isBounded:!1,useCSSTransforms:Ue,transformScale:Me,constraints:y,layout:Z,children:b.jsx("div",{})}):null,ot=Rn(dr,C),at={height:Ve,...R};return b.jsxs("div",{ref:f,className:ot,style:at,onDrop:ye?ke:void 0,onDragLeave:ye?Ne:void 0,onDragEnter:ye?Le:void 0,onDragOver:ye?fe:void 0,children:[Qe.Children.map(t,O=>Qe.isValidElement(O)?Ae(O):null),ye&&be&&Ae(be,!0),Be()]})}var Ai={lg:1200,md:996,sm:768,xs:480,xxs:0},Bi={lg:12,md:10,sm:6,xs:4,xxs:2},wn=()=>{};function Wi(e,t,n,r){const s=[];Qe.Children.forEach(t,o=>{if(!Qe.isValidElement(o)||o.key===null)return;const d=String(o.key),l=e.find(y=>y.i===d);if(l)s.push({...l,i:d});else{const p=o.props["data-grid"];p?s.push({i:d,x:p.x??0,y:p.y??0,w:p.w??1,h:p.h??1,minW:p.minW,maxW:p.maxW,minH:p.minH,maxH:p.maxH,static:p.static,isDraggable:p.isDraggable,isResizable:p.isResizable,resizeHandles:p.resizeHandles,isBounded:p.isBounded}):s.push({i:d,x:0,y:Qt(s),w:1,h:1})}});const a=En(s,{cols:n});return r.compact(a,n)}function Jr(e){const{children:t,width:n,breakpoint:r,breakpoints:s=Ai,cols:a=Bi,layouts:o={},rowHeight:d=150,maxRows:l=1/0,margin:y=[10,10],containerPadding:p=null,compactor:x,onBreakpointChange:z=wn,onLayoutChange:C=wn,onWidthChange:R=wn,...f}=e,c=x??_n("vertical"),g=c.type,S=c.allowOverlap,P=m.useMemo(()=>r??Gn(s,n),[]),H=m.useMemo(()=>Yn(P,a),[P,a]),k=m.useMemo(()=>ln(o,s,P,P,H,g),[]),[D,E]=m.useState(P),[j,$]=m.useState(H),[ie,he]=m.useState(k),[pe,T]=m.useState(o),q=m.useRef(n),Ee=m.useRef(r),ce=m.useRef(s),ne=m.useRef(a),Se=m.useRef(o),He=m.useRef(g),re=m.useRef(pe);m.useEffect(()=>{re.current=pe},[pe]);const je=m.useMemo(()=>rt(o,Se.current)?null:ln(o,s,D,D,j,c),[o,s,D,j,c]),De=je??ie;m.useEffect(()=>{je!==null&&(he(je),T(o),re.current=o,Se.current=o)},[je,o]),m.useEffect(()=>{if(g!==He.current){const ue=c.compact(ct(De),j),Ce={...re.current,[D]:ue};he(ue),T(Ce),re.current=Ce,C(ue,Ce),He.current=g}},[g,c,De,j,S,D,C]),m.useEffect(()=>{const ue=n!==q.current,Ce=r!==Ee.current,V=!rt(s,ce.current),ge=!rt(a,ne.current);if(ue||Ce||V||ge){const A=r??Gn(s,n),de=Yn(A,a),me=D;if(me!==A||V||ge){const oe={...re.current};oe[me]||(oe[me]=ct(ie));let xe=ln(oe,s,A,me,de,c);xe=Wi(xe,t,de,c),oe[A]=xe,E(A),$(de),he(xe),T(oe),re.current=oe,z(A,de),C(xe,oe)}const Ue=At(y,A),Me=p?At(p,A):null;R(n,Ue,de,Me),q.current=n,Ee.current=r,ce.current=s,ne.current=a}},[n,r,s,a,D,j,ie,t,c,g,S,y,p,z,C,R]);const Fe=m.useCallback(ue=>{const V={...re.current,[D]:ue};he(ue),T(V),re.current=V,C(ue,V)},[D,C]),Te=m.useMemo(()=>At(y,D),[y,D]),$e=m.useMemo(()=>p===null?null:At(p,D),[p,D]),ye=m.useMemo(()=>({cols:j,rowHeight:d,maxRows:l,margin:Te,containerPadding:$e}),[j,d,l,Te,$e]);return b.jsx(qi,{...f,width:n,gridConfig:ye,compactor:c,onLayoutChange:Fe,layout:De,children:t})}function Ii({id:e,onClose:t,closeText:n}){const{t:r}=xr();return n?b.jsx(pr,{children:b.jsxs(yr,{children:[b.jsx(gr,{asChild:!0,children:b.jsx(Kt,{type:"button",variant:"ghost",size:"2xs",iconOnly:!0,"aria-label":n,onClick:s=>{s.preventDefault(),t(e)},children:b.jsx(Bn,{})})}),b.jsx(mr,{children:n})]})}):b.jsx(Kt,{type:"button",variant:"ghost",size:"2xs",iconOnly:!0,"aria-label":r("common.close"),onClick:s=>{s.preventDefault(),t(e)},children:b.jsx(Bn,{})})}const qn=m.forwardRef(function({title:t,content:n,onClose:r,closeText:s,children:a,id:o,isStatic:d,isDraggable:l,...y},p){const x=!d&&l,z=!d;return b.jsxs("div",{ref:p,className:"h-full w-full",...y,children:[b.jsxs(ss,{size:"sm",className:"h-full w-full overflow-hidden",children:[b.jsxs(is,{size:"sm",className:rs("flex flex-row items-center gap-2 py-1",{"rgl-drag-zone cursor-move":x}),children:[x&&b.jsx(as,{size:16}),b.jsx("span",{className:"flex-1 truncate text-sm font-semibold",children:t}),z&&b.jsx(Ii,{id:o,onClose:r,closeText:s})]}),b.jsx(os,{className:"flex-1 min-h-0 p-2 overflow-hidden **:data-[slot=chart]:aspect-auto! **:data-[slot=chart]:h-full **:data-[slot=chart]:w-full",children:n})]}),a]})});qn.__docgenInfo={description:`forwardRef is needed for react-grid-layout
children: used by react-grid-layout to add resize handle`,methods:[],displayName:"GridCard",props:{title:{required:!0,tsType:{name:"ReactNode"},description:""},content:{required:!0,tsType:{name:"ReactNode"},description:""},children:{required:!1,tsType:{name:"ReactNode"},description:""},id:{required:!0,tsType:{name:"string"},description:""},isStatic:{required:!0,tsType:{name:"boolean"},description:""},isDraggable:{required:!0,tsType:{name:"boolean"},description:""},isResizable:{required:!0,tsType:{name:"boolean"},description:""},onClose:{required:!0,tsType:{name:"signature",type:"function",raw:"(id: string) => void",signature:{arguments:[{type:{name:"string"},name:"id"}],return:{name:"void"}}},description:""},closeText:{required:!1,tsType:{name:"string"},description:""}}};function Zr({cards:e,activeCards:t,isPristine:n,tooltipText:r,onCheckedChange:s,onReset:a}){const{t:o}=xr();return b.jsxs(cs,{children:[b.jsx(pr,{children:b.jsxs(yr,{children:[b.jsx(us,{asChild:!0,children:b.jsx(gr,{asChild:!0,children:b.jsx(Kt,{type:"button",variant:"ghost",size:"2xs",iconOnly:!0,"aria-label":r,children:b.jsx(fs,{})})})}),b.jsx(mr,{children:r})]})}),b.jsx(ds,{align:"start",sideOffset:4,className:"w-auto p-3",children:b.jsxs("div",{className:"flex flex-col gap-2",children:[b.jsx("div",{className:"flex max-h-78.75 flex-col gap-2 overflow-auto",children:e.map(d=>b.jsxs("label",{className:"flex cursor-pointer items-center gap-2 text-sm",children:[b.jsx(ls,{checked:t.includes(d.id),onCheckedChange:l=>s(d.id,l)}),d.title]},d.id))}),b.jsx("div",{className:"text-right",children:b.jsx(Kt,{type:"button",variant:"link",size:"xs",className:"h-auto p-0",disabled:n,onClick:a,children:o("common.grid.reset")})})]})})]})}Zr.__docgenInfo={description:"",methods:[],displayName:"GridOptionsMenuSettings",props:{activeCards:{required:!0,tsType:{name:"Array",elements:[{name:"string"}],raw:"string[]"},description:""},cards:{required:!0,tsType:{name:"Array",elements:[{name:"signature",type:"object",raw:`{
  id: string;
  content: React.ReactNode;
  title: string | React.ReactNode;
}`,signature:{properties:[{key:"id",value:{name:"string",required:!0}},{key:"content",value:{name:"ReactReactNode",raw:"React.ReactNode",required:!0}},{key:"title",value:{name:"union",raw:"string | React.ReactNode",elements:[{name:"string"},{name:"ReactReactNode",raw:"React.ReactNode"}],required:!0}}]}}],raw:`{
  id: string;
  content: React.ReactNode;
  title: string | React.ReactNode;
}[]`},description:""},tooltipText:{required:!0,tsType:{name:"string"},description:""},isPristine:{required:!0,tsType:{name:"boolean"},description:""},onCheckedChange:{required:!0,tsType:{name:"signature",type:"function",raw:"(id: string, checked: boolean) => void",signature:{arguments:[{type:{name:"string"},name:"id"},{type:{name:"boolean"},name:"checked"}],return:{name:"void"}}},description:""},onReset:{required:!0,tsType:{name:"signature",type:"function",raw:"() => void",signature:{arguments:[],return:{name:"void"}}},description:""}}};const Gi=e=>(t,n,r)=>(r.revalidateOnFocus=!1,r.revalidateIfStale=!1,r.revalidateOnReconnect=!1,r.refreshInterval=0,e(t,n,r)),Yi=hs(ps,Gi);function Qr({defaultLayouts:e,cards:t,hasMenuOptionsSettings:n}){const{width:r,containerRef:s,mounted:a}=Yr(),o=m.useMemo(()=>Object.fromEntries(Object.entries(e).map(([d,l])=>[d,(l??[]).map(y=>({...y,static:!0}))])),[e]);return b.jsx("div",{ref:s,className:"w-full",children:a&&b.jsxs("div",{children:[n&&b.jsx("div",{className:"flex justify-end",children:b.jsx(an,{className:"h-8 w-8"})}),b.jsx(Jr,{layouts:o,width:r,children:t.map(d=>b.jsx(qn,{id:d.id,title:b.jsx(an,{className:"h-4 w-32"}),content:b.jsx(an,{className:"h-full w-full"}),onClose:()=>{},isStatic:!0,isResizable:!1,isDraggable:!1},d.id))})]})})}Qr.__docgenInfo={description:"In loading state, disable drag and resize by forcing static to every card.",methods:[],displayName:"GridSkeleton",props:{cards:{required:!0,tsType:{name:"Array",elements:[{name:"signature",type:"object",raw:`{
  id: string;
  content: React.ReactNode;
  title: string | React.ReactNode;
}`,signature:{properties:[{key:"id",value:{name:"string",required:!0}},{key:"content",value:{name:"ReactReactNode",raw:"React.ReactNode",required:!0}},{key:"title",value:{name:"union",raw:"string | React.ReactNode",elements:[{name:"string"},{name:"ReactReactNode",raw:"React.ReactNode"}],required:!0}}]}}],raw:`{
  id: string;
  content: React.ReactNode;
  title: string | React.ReactNode;
}[]`},description:""},defaultLayouts:{required:!0,tsType:{name:"ResponsiveLayouts"},description:""},hasMenuOptionsSettings:{required:!0,tsType:{name:"boolean"},description:""}}};async function Xi(e){return(await wr.getUserPreferences(e.key)).data}async function Fi(e,{arg:t}){return(await wr.postUserPreferences(t.key,t.userPreference)).data}function $i(e,t){const n=Object.keys(e),r={id:t,isStatic:!1,isDraggable:!0,isResizable:!0};for(const s of n){const a=(e[s]??[]).find(o=>o.i===t);if(a)return{id:t,isStatic:a.static??r.isStatic,isDraggable:a.isDraggable??r.isDraggable,isResizable:a.isResizable??r.isResizable}}return console.warn(`grid: ${t} has not been found in layouts`),r}function Ui(e,t){const n=Object.keys(e),r={};for(const s of n)r[s]=(e[s]??[]).filter(a=>t.includes(a.i));return r}function Vi(e,t){const n={},r=Object.keys(t);for(const s of r){const a=t[s]??[],o=a.map(l=>l.i),d=(e[s]??[]).filter(l=>!o.includes(l.i));n[s]=[...a,...d]}return n}function Ki(e,t){const n=Object.keys(t);for(const r of n){const s=t[r]??[],a=e[r]??[];if(s.length!==a.length)return!0;for(const o of s){const d=a.find(p=>p.i===o.i);if(!d)return!0;const l=d.x===o.x&&d.y===o.y,y=d.w===o.w&&d.h===o.h;if(!l||!y)return!0}}return!1}function Ji(e,t,n){const r=Object.keys(t);for(const s of r){const a=t[s]??[],o=e[s]??[];if(a.length!==o.length||o.length!==n.length)return!1;for(const d of a){const l=o.find(x=>x.i===d.i);if(!l)return!1;const y=l.x===d.x&&l.y===d.y,p=l.w===d.w&&l.h===d.h;if(!y||!p)return!1}}return!0}function et({id:e,defaultLayouts:t,optionsMenuSettings:n,cards:r,gridCardProps:s}){const a=m.useMemo(()=>`resizable-grid-${e}`,[e]),o=m.useMemo(()=>r.map(D=>D.id),[r]),{width:d,containerRef:l,mounted:y}=Yr(),[p,x]=m.useState(o),[z,C]=m.useState(t),[R,f]=m.useState(!1),c=Yi(a,()=>Xi({key:a}),{shouldRetryOnError:!1}),{trigger:g}=ys(a,Fi,{revalidate:!1,populateCache:!1}),S=m.useCallback((D,E)=>{C(j=>Vi(j,E))},[]),P=m.useCallback(()=>{C(t),x(o)},[t,o]),H=m.useCallback(D=>{x(E=>E.filter(j=>j!==D))},[]),k=m.useCallback((D,E)=>{x(j=>E?[...j,D]:j.filter($=>$!==D))},[]);return m.useEffect(()=>{if(R||c.isLoading)return;const D=c.data?.content;D?.defaultLayouts&&Ki(D.defaultLayouts,t)||(D?.layouts&&C(D.layouts),D?.activeCards&&x(D.activeCards)),f(!0)},[R,c.isLoading,c.data,p]),m.useEffect(()=>{if(!R)return;const D=setTimeout(()=>{g({key:a,userPreference:{key:a,content:{layouts:z,defaultLayouts:t,activeCards:p}}})},350);return()=>{D&&clearTimeout(D)}},[z,p,R]),b.jsx("div",{ref:l,className:"w-full",children:!R||c.isLoading?b.jsx(Qr,{defaultLayouts:t,cards:r,hasMenuOptionsSettings:n.visible}):y&&b.jsxs("div",{children:[n.visible&&b.jsx("div",{className:"flex justify-end",children:b.jsx(Zr,{cards:r,activeCards:p,isPristine:Ji(z,t,p),onCheckedChange:k,onReset:P,tooltipText:n.tooltipText})}),b.jsx(Jr,{layouts:Ui(z,p),width:d,onLayoutChange:S,children:r.filter(D=>p.includes(D.id)).map(D=>{const E=$i(z,D.id);return b.jsx(qn,{id:E.id,content:D.content,title:D.title,onClose:H,closeText:s?.closeText,isStatic:E.isStatic,isDraggable:E.isDraggable,isResizable:E.isResizable},D.id)})})]})})}et.__docgenInfo={description:`React-grid-layout default values
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
 isBounded?: boolean; Override grid isBounded`,methods:[],displayName:"Grid",props:{id:{required:!0,tsType:{name:"string"},description:""},cards:{required:!0,tsType:{name:"Array",elements:[{name:"signature",type:"object",raw:`{
  id: string;
  content: React.ReactNode;
  title: string | React.ReactNode;
}`,signature:{properties:[{key:"id",value:{name:"string",required:!0}},{key:"content",value:{name:"ReactReactNode",raw:"React.ReactNode",required:!0}},{key:"title",value:{name:"union",raw:"string | React.ReactNode",elements:[{name:"string"},{name:"ReactReactNode",raw:"React.ReactNode"}],required:!0}}]}}],raw:`{
  id: string;
  content: React.ReactNode;
  title: string | React.ReactNode;
}[]`},description:""},defaultLayouts:{required:!0,tsType:{name:"ResponsiveLayouts"},description:""},optionsMenuSettings:{required:!0,tsType:{name:"union",raw:"{ visible: true; tooltipText: string } | { visible: false; tooltipText?: string }",elements:[{name:"signature",type:"object",raw:"{ visible: true; tooltipText: string }",signature:{properties:[{key:"visible",value:{name:"literal",value:"true",required:!0}},{key:"tooltipText",value:{name:"string",required:!0}}]}},{name:"signature",type:"object",raw:"{ visible: false; tooltipText?: string }",signature:{properties:[{key:"visible",value:{name:"literal",value:"false",required:!0}},{key:"tooltipText",value:{name:"string",required:!1}}]}}]},description:""},gridCardProps:{required:!1,tsType:{name:"signature",type:"object",raw:`{
  closeText: string;
}`,signature:{properties:[{key:"closeText",value:{name:"string",required:!0}}]}},description:""}}};const _o={title:"Components/Grids/Grid",component:et,args:{id:"storybook-default",cards:[{id:"1",title:"Most Frequent Phenotype (HPO)",content:b.jsx(Ze,{...ht})},{id:"2",title:"Most Frequent Diagnoses (MONDO)",content:b.jsx(Ze,{...Sn})},{id:"3",title:"Demographics",content:b.jsx("div",{className:"flex gap-2 h-full p-2",children:[br,vr,Rr].map((e,t)=>b.jsx("div",{className:"flex-1 min-w-0 h-full",children:b.jsx(jt,{...e})},t))})},{id:"4",title:"Studies",content:b.jsx(jt,{...Dn})},{id:"5",title:"Age at First Patient Engagement (years)",content:b.jsx(Cn,{...zn})},{id:"6",title:"Age at First Patient Engagement (years) (Include)",content:b.jsx(Sr,{...Dr})}],defaultLayouts:{lg:[{i:"1",x:0,y:0,w:6,h:3},{i:"2",x:6,y:0,w:6,h:3},{i:"3",x:0,y:3,w:4,h:2},{i:"4",x:4,y:3,w:2,h:2},{i:"5",x:6,y:3,w:6,h:2},{i:"6",x:0,y:5,w:6,h:3}],md:[{i:"1",x:0,y:0,w:5,h:3},{i:"2",x:5,y:0,w:5,h:3},{i:"3",x:0,y:3,w:3,h:2},{i:"4",x:3,y:3,w:2,h:2},{i:"5",x:5,y:3,w:5,h:2},{i:"6",x:0,y:5,w:5,h:3}],sm:[{i:"1",x:0,y:0,w:3,h:3},{i:"2",x:3,y:0,w:3,h:3},{i:"3",x:0,y:3,w:4,h:2},{i:"4",x:4,y:3,w:2,h:2},{i:"5",x:0,y:5,w:3,h:2},{i:"6",x:3,y:5,w:3,h:2}],xs:[{i:"1",x:0,y:0,w:4,h:3},{i:"2",x:0,y:3,w:4,h:3},{i:"3",x:0,y:6,w:4,h:2},{i:"4",x:0,y:8,w:4,h:2},{i:"5",x:0,y:10,w:4,h:2},{i:"6",x:0,y:12,w:4,h:3}],xxs:[{i:"1",x:0,y:0,w:2,h:3},{i:"2",x:0,y:3,w:2,h:3},{i:"3",x:0,y:6,w:2,h:2},{i:"4",x:0,y:8,w:2,h:2},{i:"5",x:0,y:10,w:2,h:2},{i:"6",x:0,y:12,w:2,h:3}]},optionsMenuSettings:{visible:!0,tooltipText:"Charts"},gridCardProps:{closeText:"Remove Chart"}}},It={parameters:{msw:{handlers:[Xe.get(Ye,async()=>(await Pn(1e4),Ge.json({content:{layouts:{lg:[{i:"1",x:0,y:0,w:4,h:4},{i:"2",x:4,y:0,w:8,h:2},{i:"3",x:4,y:2,w:8,h:2},{i:"4",x:0,y:4,w:3,h:2},{i:"5",x:3,y:4,w:9,h:3},{i:"6",x:0,y:7,w:12,h:4}],md:[{i:"1",x:0,y:0,w:4,h:4},{i:"2",x:4,y:0,w:6,h:2},{i:"3",x:4,y:2,w:6,h:2},{i:"4",x:0,y:4,w:3,h:2},{i:"5",x:3,y:4,w:7,h:3},{i:"6",x:0,y:7,w:10,h:4}],sm:[{i:"1",x:0,y:0,w:6,h:3},{i:"2",x:0,y:3,w:3,h:2},{i:"3",x:3,y:3,w:3,h:2},{i:"4",x:0,y:5,w:2,h:2},{i:"5",x:2,y:5,w:4,h:3},{i:"6",x:0,y:8,w:6,h:4}],xs:[{i:"1",x:0,y:0,w:4,h:4},{i:"2",x:0,y:4,w:4,h:2},{i:"3",x:0,y:6,w:4,h:2},{i:"4",x:0,y:8,w:4,h:2},{i:"5",x:0,y:10,w:4,h:3},{i:"6",x:0,y:13,w:4,h:4}],xxs:[{i:"1",x:0,y:0,w:2,h:4},{i:"2",x:0,y:4,w:2,h:2},{i:"3",x:0,y:6,w:2,h:2},{i:"4",x:0,y:8,w:2,h:2},{i:"5",x:0,y:10,w:2,h:3},{i:"6",x:0,y:13,w:2,h:4}]}}}))),Xe.post(Ye,async()=>new Ge({status:200}))]}},args:{id:"storybook-loading"},render:e=>b.jsx(ut,{title:"Grid - Loading state: skeleton is shown while user preferences are being fetched (10s delay). Refresh to replay.",children:b.jsx(et,{...e})})},Gt={parameters:{msw:{handlers:[Xe.post(Ye,async()=>new Ge({status:200}))]}},render:e=>b.jsx(ut,{title:"Grid - Fresh state: no saved user preferences, so the grid renders from the defaultLayouts prop with every card active.",children:b.jsx(et,{...e})})},Yt={parameters:{msw:{handlers:[Xe.get(Ye,async()=>(await Pn(250),Ge.json({content:{layouts:{lg:[{i:"1",x:0,y:0,w:4,h:4},{i:"2",x:4,y:0,w:8,h:2},{i:"3",x:4,y:2,w:8,h:2},{i:"4",x:0,y:4,w:3,h:2},{i:"5",x:3,y:4,w:9,h:3},{i:"6",x:0,y:7,w:12,h:4}],md:[{i:"1",x:0,y:0,w:4,h:4},{i:"2",x:4,y:0,w:6,h:2},{i:"3",x:4,y:2,w:6,h:2},{i:"4",x:0,y:4,w:3,h:2},{i:"5",x:3,y:4,w:7,h:3},{i:"6",x:0,y:7,w:10,h:4}],sm:[{i:"1",x:0,y:0,w:6,h:3},{i:"2",x:0,y:3,w:3,h:2},{i:"3",x:3,y:3,w:3,h:2},{i:"4",x:0,y:5,w:2,h:2},{i:"5",x:2,y:5,w:4,h:3},{i:"6",x:0,y:8,w:6,h:4}],xs:[{i:"1",x:0,y:0,w:4,h:4},{i:"2",x:0,y:4,w:4,h:2},{i:"3",x:0,y:6,w:4,h:2},{i:"4",x:0,y:8,w:4,h:2},{i:"5",x:0,y:10,w:4,h:3},{i:"6",x:0,y:13,w:4,h:4}],xxs:[{i:"1",x:0,y:0,w:2,h:4},{i:"2",x:0,y:4,w:2,h:2},{i:"3",x:0,y:6,w:2,h:2},{i:"4",x:0,y:8,w:2,h:2},{i:"5",x:0,y:10,w:2,h:3},{i:"6",x:0,y:13,w:2,h:4}]},defaultLayouts:{lg:[{i:"1",x:0,y:0,w:6,h:3},{i:"2",x:6,y:0,w:6,h:3},{i:"3",x:0,y:3,w:4,h:2},{i:"4",x:4,y:3,w:2,h:2},{i:"5",x:6,y:3,w:6,h:2},{i:"6",x:0,y:5,w:6,h:3}],md:[{i:"1",x:0,y:0,w:5,h:3},{i:"2",x:5,y:0,w:5,h:3},{i:"3",x:0,y:3,w:3,h:2},{i:"4",x:3,y:3,w:2,h:2},{i:"5",x:5,y:3,w:5,h:2},{i:"6",x:0,y:5,w:5,h:3}],sm:[{i:"1",x:0,y:0,w:3,h:3},{i:"2",x:3,y:0,w:3,h:3},{i:"3",x:0,y:3,w:4,h:2},{i:"4",x:4,y:3,w:2,h:2},{i:"5",x:0,y:5,w:3,h:2},{i:"6",x:3,y:5,w:3,h:2}],xs:[{i:"1",x:0,y:0,w:4,h:3},{i:"2",x:0,y:3,w:4,h:3},{i:"3",x:0,y:6,w:4,h:2},{i:"4",x:0,y:8,w:4,h:2},{i:"5",x:0,y:10,w:4,h:2},{i:"6",x:0,y:12,w:4,h:3}],xxs:[{i:"1",x:0,y:0,w:2,h:3},{i:"2",x:0,y:3,w:2,h:3},{i:"3",x:0,y:6,w:2,h:2},{i:"4",x:0,y:8,w:2,h:2},{i:"5",x:0,y:10,w:2,h:2},{i:"6",x:0,y:12,w:2,h:3}]},activeCards:["1","2","4","5","6"]}}))),Xe.post(Ye,async()=>new Ge({status:200}))]}},args:{id:"storybook-edited"},render:e=>b.jsx(ut,{title:"Grid - Restored state: saved defaultLayouts match the current config, so the user's custom layouts and activeCards are loaded from preferences (Demographics is inactive).",children:b.jsx(et,{...e})})},Xt={parameters:{msw:{handlers:[Xe.get(Ye,async()=>(await Pn(250),Ge.json({content:{layouts:{lg:[{i:"1",x:0,y:0,w:4,h:4},{i:"2",x:4,y:0,w:8,h:2},{i:"3",x:4,y:2,w:8,h:2},{i:"4",x:0,y:4,w:3,h:2},{i:"5",x:3,y:4,w:9,h:3}],md:[{i:"1",x:0,y:0,w:4,h:4},{i:"2",x:4,y:0,w:6,h:2},{i:"3",x:4,y:2,w:6,h:2},{i:"4",x:0,y:4,w:3,h:2},{i:"5",x:3,y:4,w:7,h:3}],sm:[{i:"1",x:0,y:0,w:6,h:3},{i:"2",x:0,y:3,w:3,h:2},{i:"3",x:3,y:3,w:3,h:2},{i:"4",x:0,y:5,w:2,h:2},{i:"5",x:2,y:5,w:4,h:3}],xs:[{i:"1",x:0,y:0,w:4,h:4},{i:"2",x:0,y:4,w:4,h:2},{i:"3",x:0,y:6,w:4,h:2},{i:"4",x:0,y:8,w:4,h:2},{i:"5",x:0,y:10,w:4,h:3}],xxs:[{i:"1",x:0,y:0,w:2,h:4},{i:"2",x:0,y:4,w:2,h:2},{i:"3",x:0,y:6,w:2,h:2},{i:"4",x:0,y:8,w:2,h:2},{i:"5",x:0,y:10,w:2,h:3}]},defaultLayouts:{lg:[{i:"1",x:0,y:0,w:6,h:3},{i:"2",x:6,y:0,w:6,h:3},{i:"3",x:0,y:3,w:4,h:2},{i:"4",x:4,y:3,w:2,h:2},{i:"5",x:6,y:3,w:6,h:2}],md:[{i:"1",x:0,y:0,w:5,h:3},{i:"2",x:5,y:0,w:5,h:3},{i:"3",x:0,y:3,w:3,h:2},{i:"4",x:3,y:3,w:2,h:2},{i:"5",x:5,y:3,w:5,h:2}],sm:[{i:"1",x:0,y:0,w:3,h:3},{i:"2",x:3,y:0,w:3,h:3},{i:"3",x:0,y:3,w:4,h:2},{i:"4",x:4,y:3,w:2,h:2},{i:"5",x:0,y:5,w:3,h:2}],xs:[{i:"1",x:0,y:0,w:4,h:3},{i:"2",x:0,y:3,w:4,h:3},{i:"3",x:0,y:6,w:4,h:2},{i:"4",x:0,y:8,w:4,h:2},{i:"5",x:0,y:10,w:4,h:2}],xxs:[{i:"1",x:0,y:0,w:2,h:3},{i:"2",x:0,y:3,w:2,h:3},{i:"3",x:0,y:6,w:2,h:2},{i:"4",x:0,y:8,w:2,h:2},{i:"5",x:0,y:10,w:2,h:2}]},activeCards:["1","2","4","5"]}}))),Xe.post(Ye,async()=>new Ge({status:200}))]}},args:{id:"storybook-default-layouts-updated"},render:e=>b.jsx(ut,{title:"Grid - Conflict recovery: saved defaultLayouts are stale (missing card '6'), so the local defaultLayouts win and the saved layouts/activeCards are discarded to prevent inconsistencies.",children:b.jsx(et,{...e})})},Ft={parameters:{msw:{handlers:[Xe.post(Ye,async()=>new Ge({status:200}))]}},args:{id:"storybook-hidden",cards:[{id:"1",title:"Most Frequent Phenotype (HPO)",content:b.jsx(Ze,{...ht})},{id:"2",title:"Most Frequent Diagnoses (MONDO)",content:b.jsx(Ze,{...Sn})},{id:"3",title:"Demographics",content:b.jsx("div",{className:"flex gap-2 h-full p-2",children:[br,vr,Rr].map((e,t)=>b.jsx("div",{className:"flex-1 min-w-0 h-full",children:b.jsx(jt,{...e})},t))})},{id:"4",title:"Studies",content:b.jsx(jt,{...Dn})},{id:"5",title:"Age at First Patient Engagement (years)",content:b.jsx(Cn,{...zn})},{id:"6",title:"Age at First Patient Engagement (years) (Include)",content:b.jsx(Sr,{...Dr})}],optionsMenuSettings:{visible:!1}},render:e=>b.jsx(ut,{title:"Grid - optionsMenuSettings.visible is false: the top-right settings menu (toggle cards, reset layout) is hidden — cards can still be closed individually.",children:b.jsx(et,{...e})})},$t={parameters:{msw:{handlers:[Xe.post(Ye,async()=>new Ge({status:200}))]}},args:{id:"storybook-all-static",cards:[{id:"1",title:"Most Frequent Phenotype (HPO)",content:b.jsx(Ze,{...ht})},{id:"2",title:"Most Frequent Diagnoses (MONDO)",content:b.jsx(Ze,{...Sn})},{id:"3",title:"Studies",content:b.jsx(jt,{...Dn})},{id:"4",title:"Age at First Patient Engagement (years)",content:b.jsx(Cn,{...zn})}],defaultLayouts:{lg:[{i:"1",x:0,y:0,w:6,h:3,static:!0},{i:"2",x:6,y:0,w:6,h:3,static:!0},{i:"3",x:0,y:3,w:6,h:3,static:!0},{i:"4",x:6,y:3,w:6,h:3,static:!0}],md:[{i:"1",x:0,y:0,w:5,h:3,static:!0},{i:"2",x:5,y:0,w:5,h:3,static:!0},{i:"3",x:0,y:3,w:5,h:3,static:!0},{i:"4",x:5,y:3,w:5,h:3,static:!0}],sm:[{i:"1",x:0,y:0,w:3,h:3,static:!0},{i:"2",x:3,y:0,w:3,h:3,static:!0},{i:"3",x:0,y:3,w:3,h:3,static:!0},{i:"4",x:3,y:3,w:3,h:3,static:!0}],xs:[{i:"1",x:0,y:0,w:4,h:3,static:!0},{i:"2",x:0,y:3,w:4,h:3,static:!0},{i:"3",x:0,y:6,w:4,h:3,static:!0},{i:"4",x:0,y:9,w:4,h:3,static:!0}],xxs:[{i:"1",x:0,y:0,w:2,h:3,static:!0},{i:"2",x:0,y:3,w:2,h:3,static:!0},{i:"3",x:0,y:6,w:2,h:3,static:!0},{i:"4",x:0,y:9,w:2,h:3,static:!0}]}},render:e=>b.jsx(ut,{title:"Grid - Fully static grid: every card shares the same width/height, and no card can be dragged or resized.",children:b.jsx(et,{...e})})},Ut={parameters:{msw:{handlers:[Xe.post(Ye,async()=>new Ge({status:200}))]}},args:{id:"storybook-draggable-only",defaultLayouts:{lg:[{i:"1",x:0,y:0,w:4,h:3,isResizable:!1},{i:"2",x:4,y:0,w:4,h:3,isResizable:!1},{i:"3",x:8,y:0,w:4,h:3,isResizable:!1},{i:"4",x:0,y:3,w:4,h:3,isResizable:!1},{i:"5",x:4,y:3,w:4,h:3,isResizable:!1},{i:"6",x:8,y:3,w:4,h:3,isResizable:!1}],md:[{i:"1",x:0,y:0,w:3,h:3,isResizable:!1},{i:"2",x:3,y:0,w:3,h:3,isResizable:!1},{i:"3",x:6,y:0,w:3,h:3,isResizable:!1},{i:"4",x:0,y:3,w:3,h:3,isResizable:!1},{i:"5",x:3,y:3,w:3,h:3,isResizable:!1},{i:"6",x:6,y:3,w:3,h:3,isResizable:!1}],sm:[{i:"1",x:0,y:0,w:2,h:3,isResizable:!1},{i:"2",x:2,y:0,w:2,h:3,isResizable:!1},{i:"3",x:4,y:0,w:2,h:3,isResizable:!1},{i:"4",x:0,y:3,w:2,h:3,isResizable:!1},{i:"5",x:2,y:3,w:2,h:3,isResizable:!1},{i:"6",x:4,y:3,w:2,h:3,isResizable:!1}],xs:[{i:"1",x:0,y:0,w:4,h:3,isResizable:!1},{i:"2",x:0,y:3,w:4,h:3,isResizable:!1},{i:"3",x:0,y:6,w:4,h:3,isResizable:!1},{i:"4",x:0,y:9,w:4,h:3,isResizable:!1},{i:"5",x:0,y:12,w:4,h:3,isResizable:!1},{i:"6",x:0,y:15,w:4,h:3,isResizable:!1}],xxs:[{i:"1",x:0,y:0,w:2,h:3,isResizable:!1},{i:"2",x:0,y:3,w:2,h:3,isResizable:!1},{i:"3",x:0,y:6,w:2,h:3,isResizable:!1},{i:"4",x:0,y:9,w:2,h:3,isResizable:!1},{i:"5",x:0,y:12,w:2,h:3,isResizable:!1},{i:"6",x:0,y:15,w:2,h:3,isResizable:!1}]}},render:e=>b.jsx(ut,{title:"Grid - Draggable only: cards keep their fixed width/height (isResizable: false), but can still be dragged to reorder the grid.",children:b.jsx(et,{...e})})},Vt={parameters:{msw:{handlers:[Xe.post(Ye,async()=>new Ge({status:200}))]}},args:{id:"storybook-resizable-card",gridCardProps:{closeText:"Remove Card"},cards:[{id:"1",title:"static: true",content:b.jsx(Ze,{...ht})},{id:"2",title:"isDraggable: false",content:b.jsx(Ze,{...ht})},{id:"3",title:"isResizable: false",content:b.jsx(Ze,{...ht})},{id:"4",title:"isBounded: false",content:b.jsx(Ze,{...ht})}],defaultLayouts:{lg:[{i:"1",x:0,y:0,w:6,h:3,static:!0},{i:"2",x:6,y:0,w:6,h:3,isDraggable:!1},{i:"3",x:0,y:3,w:6,h:3,isResizable:!1},{i:"4",x:6,y:3,w:6,h:3,isBounded:!1}],md:[{i:"1",x:0,y:0,w:5,h:3,static:!0},{i:"2",x:5,y:0,w:5,h:3,isDraggable:!1},{i:"3",x:0,y:3,w:5,h:3,isResizable:!1},{i:"4",x:5,y:3,w:5,h:3,isBounded:!1}],sm:[{i:"1",x:0,y:0,w:3,h:3,static:!0},{i:"2",x:3,y:0,w:3,h:3,isDraggable:!1},{i:"3",x:0,y:3,w:4,h:3,isResizable:!1},{i:"4",x:4,y:3,w:4,h:3,isBounded:!1}],xs:[{i:"1",x:0,y:0,w:4,h:3,static:!0},{i:"2",x:0,y:3,w:4,h:3,isDraggable:!1},{i:"3",x:0,y:6,w:4,h:3,isResizable:!1},{i:"4",x:0,y:9,w:4,h:3,isBounded:!1}],xxs:[{i:"1",x:0,y:0,w:2,h:3,static:!0},{i:"2",x:0,y:3,w:2,h:3,isDraggable:!1},{i:"3",x:0,y:6,w:2,h:3,isResizable:!1},{i:"4",x:0,y:9,w:2,h:3,isBounded:!1}]}},render:e=>b.jsx(ut,{title:"Grid - Per-card LayoutItem flags: each card demonstrates a different behavior (static, isDraggable: false, isResizable: false, isBounded: false). Close text has been changed.",children:b.jsx(et,{...e})})};It.parameters={...It.parameters,docs:{...It.parameters?.docs,source:{originalSource:`{
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
}`,...It.parameters?.docs?.source}}};Gt.parameters={...Gt.parameters,docs:{...Gt.parameters?.docs,source:{originalSource:`{
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
}`,...Gt.parameters?.docs?.source}}};Yt.parameters={...Yt.parameters,docs:{...Yt.parameters?.docs,source:{originalSource:`{
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
}`,...Yt.parameters?.docs?.source}}};Xt.parameters={...Xt.parameters,docs:{...Xt.parameters?.docs,source:{originalSource:`{
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
}`,...Xt.parameters?.docs?.source}}};Ft.parameters={...Ft.parameters,docs:{...Ft.parameters?.docs,source:{originalSource:`{
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
}`,...Ft.parameters?.docs?.source}}};$t.parameters={...$t.parameters,docs:{...$t.parameters?.docs,source:{originalSource:`{
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
}`,...$t.parameters?.docs?.source}}};Ut.parameters={...Ut.parameters,docs:{...Ut.parameters?.docs,source:{originalSource:`{
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
}`,...Ut.parameters?.docs?.source}}};Vt.parameters={...Vt.parameters,docs:{...Vt.parameters?.docs,source:{originalSource:`{
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
}`,...Vt.parameters?.docs?.source}}};const Lo=["Loading","Default","Edited","OutdatedLayouts","WithoutOptionsMenuSettings","StaticGrid","DraggableGrid","GridCard"];export{Gt as Default,Ut as DraggableGrid,Yt as Edited,Vt as GridCard,It as Loading,Xt as OutdatedLayouts,$t as StaticGrid,Ft as WithoutOptionsMenuSettings,Lo as __namedExportsOrder,_o as default};
