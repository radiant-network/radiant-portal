import{j as c}from"./jsx-runtime-Cf8x2fCZ.js";import{a as ze}from"./index-B-lxVbXh.js";import{R as j,q as ne,M as je}from"./query-builder-remote-CX5M1tSo.js";import{r as h,R as Ke}from"./index-tvICUrOf.js";import{B as it}from"./button-CrKCvLOn.js";import{a as Ct,H as Wt,O as Qt,B as Je,I as Gt,M as Yt,S as zt}from"./api-BKFoIFaX.js";import{u as Kt,C as Jt}from"./applications-config-B4jBJrF9.js";import{d as ot,S as ct,a as lt,b as ut,c as dt}from"./select-Cu07QDAL.js";import{I as Ae}from"./input-aUNQvU1u.js";import{C as Xt}from"./checkbox-Yaa9_JVB.js";import{L as Zt}from"./label-DJRwmf0z.js";import{a as en,c as tn,b as nn,E as an,L as rn,G as sn}from"./less-than-or-equal-operator-icon-DY2uWcgl.js";import{u as on}from"./i18n-ZdiEvoeq.js";import{r as cn}from"./index-yBjzXJbu.js";import{w as Xe,u as pe,e as M}from"./index-BZkcKs8Z.js";import"./v4-CtRu48qb.js";import"./index-Dq5VjjLd.js";import"./index-_r67kdfS.js";import"./index-fNjTmf9T.js";import"./ActionButton-DRj5dfdv.js";import"./dropdown-menu-waw6TUZR.js";import"./Combination-DL__bl4O.js";import"./index-y2NRHbXQ.js";import"./check-DKX_pDN6.js";import"./createLucideIcon-DKFpjrVJ.js";import"./utils-BNf5BS2b.js";import"./index-C66Dxnp2.js";import"./index-C1xbsqtW.js";import"./index-sxzTQ1UW.js";import"./chevron-down-D97Dr_NX.js";import"./iframe-Dl-FHSss.js";function Ft({children:e}){return c.jsx("p",{className:"text-sm text-muted-foreground",children:e})}Ft.__docgenInfo={description:"",methods:[],displayName:"TextMuted",props:{children:{required:!1,tsType:{name:"ReactNode"},description:""}}};var Be={exports:{}},Ce={};/**
 * @license React
 * use-sync-external-store-shim.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var ft;function ln(){if(ft)return Ce;ft=1;var e=cn();function t(u,f){return u===f&&(u!==0||1/u===1/f)||u!==u&&f!==f}var n=typeof Object.is=="function"?Object.is:t,r=e.useState,s=e.useEffect,o=e.useLayoutEffect,a=e.useDebugValue;function _(u,f){var m=f(),I=r({inst:{value:m,getSnapshot:f}}),y=I[0].inst,q=I[1];return o(function(){y.value=m,y.getSnapshot=f,v(y)&&q({inst:y})},[u,m,f]),s(function(){return v(y)&&q({inst:y}),u(function(){v(y)&&q({inst:y})})},[u]),a(m),m}function v(u){var f=u.getSnapshot;u=u.value;try{var m=f();return!n(u,m)}catch{return!0}}function O(u,f){return f()}var S=typeof window>"u"||typeof window.document>"u"||typeof window.document.createElement>"u"?O:_;return Ce.useSyncExternalStore=e.useSyncExternalStore!==void 0?e.useSyncExternalStore:S,Ce}var pt;function un(){return pt||(pt=1,Be.exports=ln()),Be.exports}var dn=un();const Vt=0,kt=1,Lt=2,mt=3;var yt=Object.prototype.hasOwnProperty;function $e(e,t){var n,r;if(e===t)return!0;if(e&&t&&(n=e.constructor)===t.constructor){if(n===Date)return e.getTime()===t.getTime();if(n===RegExp)return e.toString()===t.toString();if(n===Array){if((r=e.length)===t.length)for(;r--&&$e(e[r],t[r]););return r===-1}if(!n||typeof e=="object"){r=0;for(n in e)if(yt.call(e,n)&&++r&&!yt.call(t,n)||!(n in t)||!$e(e[n],t[n]))return!1;return Object.keys(t).length===r}}return e!==e&&t!==t}const X=new WeakMap,ae=()=>{},B=ae(),Pe=Object,p=e=>e===B,Q=e=>typeof e=="function",re=(e,t)=>({...e,...t}),Mt=e=>Q(e.then),Fe={},xe={},Ze="undefined",ye=typeof window!=Ze,Ue=typeof document!=Ze,fn=ye&&"Deno"in window,pn=()=>ye&&typeof window.requestAnimationFrame!=Ze,qt=(e,t)=>{const n=X.get(e);return[()=>!p(t)&&e.get(t)||Fe,r=>{if(!p(t)){const s=e.get(t);t in xe||(xe[t]=s),n[5](t,re(s,r),s||Fe)}},n[6],()=>!p(t)&&t in xe?xe[t]:!p(t)&&e.get(t)||Fe]};let He=!0;const mn=()=>He,[We,Qe]=ye&&window.addEventListener?[window.addEventListener.bind(window),window.removeEventListener.bind(window)]:[ae,ae],yn=()=>{const e=Ue&&document.visibilityState;return p(e)||e!=="hidden"},hn=e=>(Ue&&document.addEventListener("visibilitychange",e),We("focus",e),()=>{Ue&&document.removeEventListener("visibilitychange",e),Qe("focus",e)}),vn=e=>{const t=()=>{He=!0,e()},n=()=>{He=!1};return We("online",t),We("offline",n),()=>{Qe("online",t),Qe("offline",n)}},gn={isOnline:mn,isVisible:yn},xn={initFocus:hn,initReconnect:vn},ht=!Ke.useId,me=!ye||fn,En=e=>pn()?window.requestAnimationFrame(e):setTimeout(e,1),Ve=me?h.useEffect:h.useLayoutEffect,ke=typeof navigator<"u"&&navigator.connection,vt=!me&&ke&&(["slow-2g","2g"].includes(ke.effectiveType)||ke.saveData),Ee=new WeakMap,Le=(e,t)=>Pe.prototype.toString.call(e)===`[object ${t}]`;let _n=0;const Ge=e=>{const t=typeof e,n=Le(e,"Date"),r=Le(e,"RegExp"),s=Le(e,"Object");let o,a;if(Pe(e)===e&&!n&&!r){if(o=Ee.get(e),o)return o;if(o=++_n+"~",Ee.set(e,o),Array.isArray(e)){for(o="@",a=0;a<e.length;a++)o+=Ge(e[a])+",";Ee.set(e,o)}if(s){o="#";const _=Pe.keys(e).sort();for(;!p(a=_.pop());)p(e[a])||(o+=a+":"+Ge(e[a])+",");Ee.set(e,o)}}else o=n?e.toJSON():t=="symbol"?e.toString():t=="string"?JSON.stringify(e):""+e;return o},et=e=>{if(Q(e))try{e=e()}catch{e=""}const t=e;return e=typeof e=="string"?e:(Array.isArray(e)?e.length:e)?Ge(e):"",[e,t]};let Tn=0;const Ye=()=>++Tn;async function $t(...e){const[t,n,r,s]=e,o=re({populateCache:!0,throwOnError:!0},typeof s=="boolean"?{revalidate:s}:s||{});let a=o.populateCache;const _=o.rollbackOnError;let v=o.optimisticData;const O=f=>typeof _=="function"?_(f):_!==!1,S=o.throwOnError;if(Q(n)){const f=n,m=[],I=t.keys();for(const y of I)!/^\$(inf|sub)\$/.test(y)&&f(t.get(y)._k)&&m.push(y);return Promise.all(m.map(u))}return u(n);async function u(f){const[m]=et(f);if(!m)return;const[I,y]=qt(t,m),[q,l,P,Z]=X.get(t),U=()=>{const V=q[m];return(Q(o.revalidate)?o.revalidate(I().data,f):o.revalidate!==!1)&&(delete P[m],delete Z[m],V&&V[0])?V[0](Lt).then(()=>I().data):I().data};if(e.length<3)return U();let x=r,C;const i=Ye();l[m]=[i,0];const T=!p(v),G=I(),F=G.data,H=G._c,k=p(H)?F:H;if(T&&(v=Q(v)?v(k,F):v,y({data:v,_c:k})),Q(x))try{x=x(k)}catch(V){C=V}if(x&&Mt(x))if(x=await x.catch(V=>{C=V}),i!==l[m][0]){if(C)throw C;return x}else C&&T&&O(C)&&(a=!0,y({data:k,_c:B}));if(a&&!C)if(Q(a)){const V=a(x,k);y({data:V,error:B,_c:B})}else y({data:x,error:B,_c:B});if(l[m][1]=Ye(),Promise.resolve(U()).then(()=>{y({_c:B})}),C){if(S)throw C;return}return x}}const gt=(e,t)=>{for(const n in e)e[n][0]&&e[n][0](t)},wn=(e,t)=>{if(!X.has(e)){const n=re(xn,t),r=Object.create(null),s=$t.bind(B,e);let o=ae;const a=Object.create(null),_=(S,u)=>{const f=a[S]||[];return a[S]=f,f.push(u),()=>f.splice(f.indexOf(u),1)},v=(S,u,f)=>{e.set(S,u);const m=a[S];if(m)for(const I of m)I(u,f)},O=()=>{if(!X.has(e)&&(X.set(e,[r,Object.create(null),Object.create(null),Object.create(null),s,v,_]),!me)){const S=n.initFocus(setTimeout.bind(B,gt.bind(B,r,Vt))),u=n.initReconnect(setTimeout.bind(B,gt.bind(B,r,kt)));o=()=>{S&&S(),u&&u(),X.delete(e)}}};return O(),[e,s,O,o]}return[e,X.get(e)[4]]},Sn=(e,t,n,r,s)=>{const o=n.errorRetryCount,a=s.retryCount,_=~~((Math.random()+.5)*(1<<(a<8?a:8)))*n.errorRetryInterval;!p(o)&&a>o||setTimeout(r,_,s)},Rn=$e,[Pt,On]=wn(new Map),In=re({onLoadingSlow:ae,onSuccess:ae,onError:ae,onErrorRetry:Sn,onDiscarded:ae,revalidateOnFocus:!0,revalidateOnReconnect:!0,revalidateIfStale:!0,shouldRetryOnError:!0,errorRetryInterval:vt?1e4:5e3,focusThrottleInterval:5*1e3,dedupingInterval:2*1e3,loadingTimeout:vt?5e3:3e3,compare:Rn,isPaused:()=>!1,cache:Pt,mutate:On,fallback:{}},gn),bn=(e,t)=>{const n=re(e,t);if(t){const{use:r,fallback:s}=e,{use:o,fallback:a}=t;r&&o&&(n.use=r.concat(o)),s&&a&&(n.fallback=re(s,a))}return n},Dn=h.createContext({}),Nn="$inf$",Ut=ye&&window.__SWR_DEVTOOLS_USE__,jn=Ut?window.__SWR_DEVTOOLS_USE__:[],An=()=>{Ut&&(window.__SWR_DEVTOOLS_REACT__=Ke)},Bn=e=>Q(e[1])?[e[0],e[1],e[2]||{}]:[e[0],null,(e[1]===null?e[2]:e[1])||{}],Cn=()=>re(In,h.useContext(Dn)),Fn=e=>(t,n,r)=>e(t,n&&((...o)=>{const[a]=et(t),[,,,_]=X.get(Pt);if(a.startsWith(Nn))return n(...o);const v=_[a];return p(v)?n(...o):(delete _[a],v)}),r),Vn=jn.concat(Fn),kn=e=>function(...n){const r=Cn(),[s,o,a]=Bn(n),_=bn(r,a);let v=e;const{use:O}=_,S=(O||[]).concat(Vn);for(let u=S.length;u--;)v=S[u](v);return v(s,o||_.fetcher||null,_)},Ln=(e,t,n)=>{const r=t[e]||(t[e]=[]);return r.push(n),()=>{const s=r.indexOf(n);s>=0&&(r[s]=r[r.length-1],r.pop())}};An();const Me=Ke.use||(e=>{switch(e.status){case"pending":throw e;case"fulfilled":return e.value;case"rejected":throw e.reason;default:throw e.status="pending",e.then(t=>{e.status="fulfilled",e.value=t},t=>{e.status="rejected",e.reason=t}),e}}),qe={dedupe:!0},Mn=(e,t,n)=>{const{cache:r,compare:s,suspense:o,fallbackData:a,revalidateOnMount:_,revalidateIfStale:v,refreshInterval:O,refreshWhenHidden:S,refreshWhenOffline:u,keepPreviousData:f}=n,[m,I,y,q]=X.get(r),[l,P]=et(e),Z=h.useRef(!1),U=h.useRef(!1),x=h.useRef(l),C=h.useRef(t),i=h.useRef(n),T=()=>i.current,G=()=>T().isVisible()&&T().isOnline(),[F,H,k,V]=qt(r,l),ee=h.useRef({}).current,ie=p(a)?p(n.fallback)?B:n.fallback[l]:a,he=(E,g)=>{for(const N in ee){const R=N;if(R==="data"){if(!s(E[R],g[R])&&(!p(E[R])||!s(z,g[R])))return!1}else if(g[R]!==E[R])return!1}return!0},ve=h.useMemo(()=>{const E=!l||!t?!1:p(_)?T().isPaused()||o?!1:v!==!1:_,g=A=>{const K=re(A);return delete K._k,E?{isValidating:!0,isLoading:!0,...K}:K},N=F(),R=V(),$=g(N),oe=N===R?$:g(R);let b=$;return[()=>{const A=g(F());return he(A,b)?(b.data=A.data,b.isLoading=A.isLoading,b.isValidating=A.isValidating,b.error=A.error,b):(b=A,A)},()=>oe]},[r,l]),te=dn.useSyncExternalStore(h.useCallback(E=>k(l,(g,N)=>{he(N,g)||E()}),[r,l]),ve[0],ve[1]),le=!Z.current,ge=m[l]&&m[l].length>0,Y=te.data,W=p(Y)?ie&&Mt(ie)?Me(ie):ie:Y,d=te.error,w=h.useRef(W),z=f?p(Y)?p(w.current)?W:w.current:Y:W,ue=ge&&!p(d)?!1:le&&!p(_)?_:T().isPaused()?!1:o?p(W)?!1:v:p(W)||v,D=!!(l&&t&&le&&ue),Ie=p(te.isValidating)?D:te.isValidating,be=p(te.isLoading)?D:te.isLoading,de=h.useCallback(async E=>{const g=C.current;if(!l||!g||U.current||T().isPaused())return!1;let N,R,$=!0;const oe=E||{},b=!y[l]||!oe.dedupe,A=()=>ht?!U.current&&l===x.current&&Z.current:l===x.current,K={isValidating:!1,isLoading:!1},at=()=>{H(K)},rt=()=>{const L=y[l];L&&L[1]===R&&delete y[l]},st={isValidating:!0};p(F().data)&&(st.isLoading=!0);try{if(b&&(H(st),n.loadingTimeout&&p(F().data)&&setTimeout(()=>{$&&A()&&T().onLoadingSlow(l,n)},n.loadingTimeout),y[l]=[g(P),Ye()]),[N,R]=y[l],N=await N,b&&setTimeout(rt,n.dedupingInterval),!y[l]||y[l][1]!==R)return b&&A()&&T().onDiscarded(l),!1;K.error=B;const L=I[l];if(!p(L)&&(R<=L[0]||R<=L[1]||L[1]===0))return at(),b&&A()&&T().onDiscarded(l),!1;const J=F().data;K.data=s(J,N)?J:N,b&&A()&&T().onSuccess(N,l,n)}catch(L){rt();const J=T(),{shouldRetryOnError:De}=J;J.isPaused()||(K.error=L,b&&A()&&(J.onError(L,l,J),(De===!0||Q(De)&&De(L))&&(!T().revalidateOnFocus||!T().revalidateOnReconnect||G())&&J.onErrorRetry(L,l,J,Ht=>{const Ne=m[l];Ne&&Ne[0]&&Ne[0](mt,Ht)},{retryCount:(oe.retryCount||0)+1,dedupe:!0})))}return $=!1,at(),!0},[l,r]),nt=h.useCallback((...E)=>$t(r,x.current,...E),[]);if(Ve(()=>{C.current=t,i.current=n,p(Y)||(w.current=Y)}),Ve(()=>{if(!l)return;const E=de.bind(B,qe);let g=0;T().revalidateOnFocus&&(g=Date.now()+T().focusThrottleInterval);const R=Ln(l,m,($,oe={})=>{if($==Vt){const b=Date.now();T().revalidateOnFocus&&b>g&&G()&&(g=b+T().focusThrottleInterval,E())}else if($==kt)T().revalidateOnReconnect&&G()&&E();else{if($==Lt)return de();if($==mt)return de(oe)}});return U.current=!1,x.current=l,Z.current=!0,H({_k:P}),ue&&(p(W)||me?E():En(E)),()=>{U.current=!0,R()}},[l]),Ve(()=>{let E;function g(){const R=Q(O)?O(F().data):O;R&&E!==-1&&(E=setTimeout(N,R))}function N(){!F().error&&(S||T().isVisible())&&(u||T().isOnline())?de(qe).then(g):g()}return g(),()=>{E&&(clearTimeout(E),E=-1)}},[O,S,u,l]),h.useDebugValue(z),o&&p(W)&&l){if(!ht&&me)throw new Error("Fallback data is required when using Suspense in SSR.");C.current=t,i.current=n,U.current=!1;const E=q[l];if(!p(E)){const g=nt(E);Me(g)}if(p(d)){const g=de(qe);p(z)||(g.status="fulfilled",g.value=!0),Me(g)}else throw d}return{mutate:nt,get data(){return ee.data=!0,z},get error(){return ee.error=!0,d},get isValidating(){return ee.isValidating=!0,Ie},get isLoading(){return ee.isLoading=!0,be}}},qn=kn(Mn);class $n{constructor(t={}){var n;this.apiKey=t.apiKey,this.username=t.username,this.password=t.password,this.accessToken=t.accessToken,this.basePath=t.basePath,this.serverIndex=t.serverIndex,this.baseOptions={headers:{...(n=t.baseOptions)==null?void 0:n.headers,"User-Agent":"OpenAPI-Generator/typescript-axios"},...t.baseOptions},this.formDataCtor=t.formDataCtor}isJsonMime(t){const n=new RegExp("^(application/json|[^;/ 	]+/[^;/ 	]+[+]json)[ 	]*(;.*)?$","i");return t!==null&&(n.test(t)||t.toLowerCase()==="application/json-patch+json")}}const ce=Ct.create({baseURL:"/api",headers:{"Content-Type":"application/json"}});let fe=null;ce.interceptors.response.use(e=>e,async e=>{const t=e.config;if(fe)return await fe,ce(t);if(e.response.status===Wt.Unauthorized&&!t._retry){t._retry=!0;try{return fe=Ct.post("/auth/refresh-token").finally(()=>{fe=null}),await fe,ce(t)}catch(n){return window.location.href="/auth/logout",Promise.reject(n)}}return Promise.reject(e)});const tt=new $n({basePath:"/api"}),Pn=new Qt(tt,Je,ce);new Gt(tt,Je,ce);new Yt(tt,Je,ce);const Un=e=>Pn.statisticsOccurrences(e.seqId,e.statisticsBody).then(t=>t.data);function Hn(e,t=!1,n){let r;t?r={seqId:"5011",statisticsBody:{field:e}}:r=null;const s=ne.getResolvedActiveQuery(n);return s&&r&&(r.statisticsBody.sqon={content:s.content,op:s.op}),qn(r,Un,{revalidateOnFocus:!1})}function se({field:e}){var le,ge,Y,W;const{t}=on(),n=Kt(),r=n.variant_entity.app_id,s=e.key,o={[j.GreaterThan]:{display:t("common.filters.operators.greaterThan"),dropdown:t("common.filters.operators.greaterThan"),icon:sn},[j.LessThan]:{display:t("common.filters.operators.lessThan"),dropdown:t("common.filters.operators.lessThan"),icon:rn},[j.Between]:{display:t("common.filters.operators.between"),dropdown:t("common.filters.operators.between"),icon:an},[j.GreaterThanOrEqualTo]:{display:t("common.filters.operators.greaterThanOrEqual"),dropdown:t("common.filters.operators.greaterThanOrEqual"),icon:nn},[j.LessThanOrEqualTo]:{display:t("common.filters.operators.lessThanOrEqual"),dropdown:t("common.filters.operators.lessThanOrEqual"),icon:tn},[j.In]:{display:t("common.filters.operators.in"),dropdown:t("common.filters.operators.in"),icon:en}},{data:a,isLoading:_}=Hn(s,!0,r),[v,O]=h.useState(j.GreaterThan),[S,u]=h.useState("0"),[f,m]=h.useState("0"),[I,y]=h.useState("0"),[q,l]=h.useState(!1),[P,Z]=h.useState(),[U,x]=h.useState(!1),i=(le=n.variant_entity.aggregations.find(d=>d.key===s))==null?void 0:le.defaults,T=e.type==="numerical"&&(i==null?void 0:i.noDataInputOption),G=(i==null?void 0:i.intervalDecimal)!==void 0&&((i==null?void 0:i.max)!==void 0||(i==null?void 0:i.min)!==void 0)||a&&(a.min!==void 0||a.max!==void 0),F=(i==null?void 0:i.min)??(a==null?void 0:a.min)??0,H=(i==null?void 0:i.max)??(a==null?void 0:a.max)??100,k=h.useCallback(()=>{var ue;const d=ne.getResolvedActiveQuery(r);if(!(d!=null&&d.content))return;const w=d.content.find(D=>"content"in D&&"field"in D.content?D.content.field===s:!1),z=d.content.find(D=>"content"in D&&"field"in D.content?D.content.field===`${s}_unit`:!1);if(w){const D=w.content.value;if(D.includes("__missing__")){l(!0);return}if(D.length===2){O(j.Between);const Ie=Number(D[0]).toFixed(3),be=Number(D[1]).toFixed(3);y(Ie),m(be)}else u(D[0]);w.op&&!(i!=null&&i.defaultOperator)&&O(w.op)}else l(!1),(i==null?void 0:i.defaultMin)!==void 0?(y(i.defaultMin.toString()),u(i.defaultMin.toString())):(a==null?void 0:a.min)!==void 0&&(y(Number(a.min.toFixed(3)).toString()),u(Number(a.min.toFixed(3)).toString())),(i==null?void 0:i.defaultMax)!==void 0?m(i.defaultMax.toString()):(a==null?void 0:a.max)!==void 0&&m(Number(a.max.toFixed(3)).toString()),i!=null&&i.defaultOperator&&O(i.defaultOperator);Z(z?z.content.value[0]:(ue=i==null?void 0:i.rangeTypes)!=null&&ue.length?i.rangeTypes[0].key:void 0)},[r,s,i,a]);h.useEffect(()=>{k()},[k]);const V=h.useCallback(d=>{O(d),x(!0)},[]),ee=h.useCallback(d=>{l(d),x(!0)},[]),ie=h.useCallback(d=>{Z(d),x(!0)},[]),he=h.useCallback(()=>{x(!1),k()},[k]),ve=h.useCallback(()=>{if(x(!1),q){ne.updateActiveQueryField(r,{field:s,value:["__missing__"],merge_strategy:je.OVERRIDE_VALUES});return}let d=[];d=v===j.Between?[parseFloat(I.toString()),parseFloat(f.toString())]:[parseFloat(S.toString())],ne.updateActiveQueryField(r,{field:s,value:d,merge_strategy:je.OVERRIDE_VALUES,operator:v}),P&&ne.updateActiveQueryField(r,{field:`${s}_unit`,value:[P],merge_strategy:je.OVERRIDE_VALUES})},[r,s,v,S,I,f,q,P]),te=Object.entries(j).map(([d,w])=>{if(w in o){const z=o[w].icon;return c.jsx(ot,{value:w,children:c.jsxs("div",{className:"flex items-center gap-2",children:[c.jsx(z,{size:16}),c.jsx("span",{children:o[w].dropdown})]})},w)}return null}).filter(Boolean);return c.jsxs("div",{className:"p-2 w-full max-w-md",id:`${s}_container`,children:[c.jsxs("div",{className:"space-y-3 pt-2",children:[c.jsxs("div",{className:"flex flex-col gap-3",children:[c.jsx("div",{id:`${s}_operator`,children:c.jsxs(ct,{defaultValue:`${zt.GreaterThan}`,onValueChange:V,children:[c.jsx(lt,{children:c.jsx(ut,{placeholder:t("common.filters.operators.selectOperator"),children:o[v].display})}),c.jsx(dt,{children:te})]})}),v===j.Between?c.jsxs("div",{className:"flex gap-2 flex-row",children:[c.jsx(Ae,{className:"w-half",value:I,onChange:d=>{const w=d.target.value;console.log("value",w),!isNaN(Number(w))&&(y(w),x(!0))},min:F,max:H,id:`${s}_min`,"data-testid":`${s}_min`}),c.jsx(Ae,{className:"w-half",value:f,onChange:d=>{const w=d.target.value;isNaN(Number(w))||(m(w),x(!0))},min:F,max:H,id:`${s}_max`,"data-testid":`${s}_max`})]}):c.jsx(Ae,{className:"w-full",value:S,onChange:d=>{const w=d.target.value;isNaN(Number(w))||(u(w),x(!0))},min:F,max:H,id:`${s}_value`,"data-testid":`${s}_value`}),G&&c.jsx("div",{id:`${s}_interval`,children:c.jsxs(Ft,{children:[t("common.filters.labels.actualInterval")," : ",(ge=a==null?void 0:a.min)==null?void 0:ge.toFixed(3)," -"," ",(Y=a==null?void 0:a.max)==null?void 0:Y.toFixed(3)]})})]}),(i==null?void 0:i.rangeTypes)&&i.rangeTypes.length>0&&c.jsxs("div",{id:`${s}_range_type_container`,children:[c.jsx(Zt,{className:"text-sm",id:`${s}_unit_label`,children:t("common.filters.labels.unit")}),c.jsxs(ct,{defaultValue:P||i.rangeTypes[0].key,onValueChange:ie,children:[c.jsx(lt,{children:c.jsx(ut,{placeholder:t("common.filters.labels.selectUnit"),children:((W=i.rangeTypes.find(d=>d.key===P))==null?void 0:W.name)||t("common.filters.labels.selectUnit")})}),c.jsx(dt,{children:i.rangeTypes.map(d=>c.jsx(ot,{value:d.key,children:d.name},d.key))})]})]}),T&&!G&&c.jsxs("label",{className:"flex items-center space-x-2 overflow-hidden",id:`${s}_no_data_label`,children:[c.jsx(Xt,{checked:q,onCheckedChange:ee,id:`${s}_no_data`}),c.jsx("span",{children:t("common.filters.labels.noData")})]})]}),c.jsx("hr",{className:"my-4 border-border",id:`${s}_divider`}),c.jsxs("div",{className:"flex align-right justify-end items-center space-x-2",children:[c.jsx(it,{size:"sm",className:"text-gray-400 h-7",onClick:he,disabled:!U,id:`${s}_clear`,children:t("common.filters.buttons.clear")}),c.jsx("div",{className:"flex space-x-2",children:c.jsx(it,{size:"sm",className:"h-7",color:"primary",onClick:ve,id:`${s}_apply`,children:t("common.filters.buttons.apply")})})]})]})}se.__docgenInfo={description:"",methods:[],displayName:"NumericalFilter",props:{field:{required:!0,tsType:{name:"AggregationConfig"},description:""}}};const Oe={variant_entity:{app_id:"variant_entity_toggle_filter",aggregations:[{key:"impact_score",type:"numerical",defaults:{min:0,max:100,defaultMin:0,defaultMax:100,intervalDecimal:2,defaultOperator:j.GreaterThan}},{key:"age",type:"numerical",defaults:{min:0,max:120,defaultMin:0,defaultMax:120,intervalDecimal:0,defaultOperator:j.Between,rangeTypes:[{key:"year",name:"Year"},{key:"month",name:"Month"},{key:"day",name:"Day"}]}}]}},wa={title:"Feature/Query Filters/Numerical Filter",component:se,tags:["autodocs"],args:{field:{key:"impact_score",type:"numerical",defaults:{min:0,max:100,defaultMin:0,defaultMax:100,intervalDecimal:2,defaultOperator:j.GreaterThan}}},decorators:[e=>c.jsx(Jt,{config:Oe,children:c.jsx(e,{})})]},_e={render:e=>c.jsx("div",{className:"space-y-6",children:c.jsx(se,{...e})}),play:async({canvasElement:e})=>{const t=Xe(e),n=t.getByTestId("impact_score_value");await pe.type(n,"75"),M(n).toHaveValue(75);const r=t.getByRole("button",{name:/apply/i});M(r).toBeEnabled(),await pe.click(r)}},Te={render:e=>(ze("activeQuery")(ne.updateActiveQueryField(Oe.variant_entity.app_id,{field:"impact_score",value:[]})),c.jsx("div",{className:"space-y-6",children:c.jsx(se,{...e})})),play:async({canvasElement:e})=>{const n=await Xe(e).findByText("No data");await pe.click(n),M(n.previousElementSibling).toBeChecked()}},we={args:{field:{key:"impact_score",type:"multiple"}},render:e=>c.jsx("div",{className:"space-y-6",children:c.jsx(se,{...e})})},Se={args:{field:{key:"age",type:"numerical",defaults:{min:0,max:120,defaultMin:0,defaultMax:120,intervalDecimal:0,defaultOperator:j.Between}}},render:e=>(ze("activeQuery")(ne.updateActiveQueryField(Oe.variant_entity.app_id,{field:"age",value:[]})),c.jsx("div",{className:"space-y-6",children:c.jsx(se,{...e})})),parameters:{docs:{description:{story:'A numerical filter with range constraints. Note: Shows ">" operator by default due to global config override.'}}}},Re={args:{field:{key:"age",type:"numerical",defaults:{min:0,max:120,defaultMin:0,defaultMax:120,intervalDecimal:0,defaultOperator:j.Between,rangeTypes:[{key:"year",name:"Year"},{key:"month",name:"Month"},{key:"day",name:"Day"}]}}},render:e=>(ze("activeQuery")(ne.updateActiveQueryField(Oe.variant_entity.app_id,{field:"age_unit",value:[]})),c.jsx("div",{className:"space-y-6",children:c.jsx(se,{...e})})),play:async({canvasElement:e})=>{const t=Xe(e),n=t.getByText("Between");M(n).toBeInTheDocument();const r=t.getByTestId("age_min"),s=t.getByTestId("age_max");M(r).toBeInTheDocument(),M(s).toBeInTheDocument();const o=t.getByText("Year");M(o).toBeInTheDocument();const a=t.getByText("Clear");M(a).toBeDisabled(),await pe.type(r,"50"),M(a).toBeEnabled(),await pe.click(a),M(r).toHaveValue(0),M(s).toHaveValue(120),M(o).toHaveTextContent("Year")},parameters:{docs:{description:{story:"A numerical filter with range type options (Year, Month, Day) and unit selection. Tests validate range operator changes, unit selection, no data visibility, and clear functionality."}}}};var xt,Et,_t;_e.parameters={..._e.parameters,docs:{...(xt=_e.parameters)==null?void 0:xt.docs,source:{originalSource:`{
  render: args => {
    return <div className="space-y-6">
        <NumericalFilter {...args} />
      </div>;
  },
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);

    // Test numeric input
    const numericInput = canvas.getByTestId('impact_score_value');
    await userEvent.type(numericInput, '75');
    expect(numericInput).toHaveValue(75);

    // Test apply button
    const applyButton = canvas.getByRole('button', {
      name: /apply/i
    });
    expect(applyButton).toBeEnabled();
    await userEvent.click(applyButton);
  }
}`,...(_t=(Et=_e.parameters)==null?void 0:Et.docs)==null?void 0:_t.source}}};var Tt,wt,St;Te.parameters={...Te.parameters,docs:{...(Tt=Te.parameters)==null?void 0:Tt.docs,source:{originalSource:`{
  render: args => {
    action('activeQuery')(queryBuilderRemote.updateActiveQueryField(config.variant_entity.app_id, {
      field: 'impact_score',
      value: []
    }));
    return <div className="space-y-6">
        <NumericalFilter {...args} />
      </div>;
  },
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    const noDataToggle = await canvas.findByText('No data');
    await userEvent.click(noDataToggle);
    expect(noDataToggle.previousElementSibling).toBeChecked();
  }
}`,...(St=(wt=Te.parameters)==null?void 0:wt.docs)==null?void 0:St.source}}};var Rt,Ot,It;we.parameters={...we.parameters,docs:{...(Rt=we.parameters)==null?void 0:Rt.docs,source:{originalSource:`{
  args: {
    field: {
      key: 'impact_score',
      type: 'multiple'
    }
  },
  render: args => {
    return <div className="space-y-6">
        <NumericalFilter {...args} />
      </div>;
  }
}`,...(It=(Ot=we.parameters)==null?void 0:Ot.docs)==null?void 0:It.source}}};var bt,Dt,Nt;Se.parameters={...Se.parameters,docs:{...(bt=Se.parameters)==null?void 0:bt.docs,source:{originalSource:`{
  args: {
    field: {
      key: 'age',
      type: 'numerical',
      defaults: {
        min: 0,
        max: 120,
        defaultMin: 0,
        defaultMax: 120,
        intervalDecimal: 0,
        defaultOperator: RangeOperators.Between
      }
    }
  },
  render: args => {
    action('activeQuery')(queryBuilderRemote.updateActiveQueryField(config.variant_entity.app_id, {
      field: 'age',
      value: []
    }));
    return <div className="space-y-6">
        <NumericalFilter {...args} />
      </div>;
  },
  parameters: {
    docs: {
      description: {
        story: 'A numerical filter with range constraints. Note: Shows ">" operator by default due to global config override.'
      }
    }
  }
}`,...(Nt=(Dt=Se.parameters)==null?void 0:Dt.docs)==null?void 0:Nt.source}}};var jt,At,Bt;Re.parameters={...Re.parameters,docs:{...(jt=Re.parameters)==null?void 0:jt.docs,source:{originalSource:`{
  args: {
    field: {
      key: 'age',
      type: 'numerical',
      defaults: {
        min: 0,
        max: 120,
        defaultMin: 0,
        defaultMax: 120,
        intervalDecimal: 0,
        defaultOperator: RangeOperators.Between,
        rangeTypes: [{
          key: 'year',
          name: 'Year'
        }, {
          key: 'month',
          name: 'Month'
        }, {
          key: 'day',
          name: 'Day'
        }]
      }
    }
  },
  render: args => {
    action('activeQuery')(queryBuilderRemote.updateActiveQueryField(config.variant_entity.app_id, {
      field: 'age_unit',
      value: []
    }));
    return <div className="space-y-6">
        <NumericalFilter {...args} />
      </div>;
  },
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);

    // Test initial state
    const operatorSelect = canvas.getByText('Between');
    expect(operatorSelect).toBeInTheDocument();

    // Verify both inputs are visible with "Between" operator
    const minInput = canvas.getByTestId('age_min');
    const maxInput = canvas.getByTestId('age_max');
    expect(minInput).toBeInTheDocument();
    expect(maxInput).toBeInTheDocument();

    // Test unit type selection
    const unitSelect = canvas.getByText('Year');
    expect(unitSelect).toBeInTheDocument();

    // Test clear functionality
    const clearButton = canvas.getByText('Clear');
    expect(clearButton).toBeDisabled();
    await userEvent.type(minInput, '50');
    expect(clearButton).toBeEnabled();
    await userEvent.click(clearButton);
    expect(minInput).toHaveValue(0);
    expect(maxInput).toHaveValue(120);
    expect(unitSelect).toHaveTextContent('Year');
  },
  parameters: {
    docs: {
      description: {
        story: 'A numerical filter with range type options (Year, Month, Day) and unit selection. Tests validate range operator changes, unit selection, no data visibility, and clear functionality.'
      }
    }
  }
}`,...(Bt=(At=Re.parameters)==null?void 0:At.docs)==null?void 0:Bt.source}}};const Sa=["Default","NoDataToggle","NoDataToggleHidden","RangeFilterWithInterval","RangeFilterWithRangeTypes"];export{_e as Default,Te as NoDataToggle,we as NoDataToggleHidden,Se as RangeFilterWithInterval,Re as RangeFilterWithRangeTypes,Sa as __namedExportsOrder,wa as default};
