import{r as d,j as t,b as Me,d as De,e as Pe,f as en,a5 as tn,c as fe,a as Yn}from"./iframe-Bo5RHwEg.js";import{S as E,a as ct}from"./api-D4LlywOg.js";import{H as O,h}from"./index-BE7hhu-0.js";import{v as U,c as dt,h as ut}from"./sqon-Br6pMqGQ.js";import{B as G,R as B,g as Xe,T as Xn,f as Jn,p as pt,U as Wn,a as Zn,P as es,b as ts,c as ns,d as mt,e as ft,h as tt,j as ss}from"./index-DhzEKUQV.js";import{F as v,A as M,u as rs,C as as}from"./applications-config-1KjFvSzf.js";import{B as os,U as is,O as ls,F as cs,P as ds,G as us,V as nn,D as ps}from"./variant-icon-BQ_SIEFp.js";import{B as w,a as ms}from"./button-LL67ycaC.js";import{a as fs,S as sn,c as rn,d as an,e as on,f as hs,g as gs,m as ln}from"./sidebar-DcSuYqp7.js";import{u as P}from"./i18n-DKJ_1r2e.js";import{P as ys,a as bs}from"./panel-left-open-FXBVmYng.js";import{L as he}from"./label-LCgU3cFV.js";import{R as xs,a as vs}from"./radio-group-9irYciQF.js";import{i as ht}from"./isEqual--8XOxEnU.js";import{A as cn}from"./action-button-AqBXW0n2.js";import{C as js}from"./checkbox-filter-CKODEMDF.js";import{d as nt,e as dn,C as Fe,a as ks}from"./card-BqwL6W5R.js";import{I as be}from"./input-BAiag9qQ.js";import{S as un}from"./separator-BQApiWN0.js";import{S as V}from"./skeleton-CMK30Ylq.js";import{S as pn}from"./switch-DCBxB_Ke.js";import{t as W,n as Cs}from"./number-format-C7arjtbT.js";import{S as _s}from"./search-uEi_CIGR.js";import{a as mn,c as fn,b as hn,E as gn,L as yn,G as bn}from"./less-than-or-equal-operator-icon-CQD4jNv0.js";import{S as As,a as Ns,b as Is,c as Ss,d as Es}from"./select-Dz-cScQY.js";import{u as ws,A as xn,a as vn,b as jn,c as kn}from"./accordion-BWO5jRv6.js";import{M as Os}from"./multi-selector-C19IPbjr.js";import{g as et,u as pe,o as $e,b as Rs}from"./index-CNE4WKYh.js";import{D as Ts,a as Ls,b as Qs,c as qs,d as Bs,f as Ms,g as Ds,h as gt}from"./dialog-BmdRYmJj.js";import{u as Ps}from"./useDebounce-1uQwPG-Y.js";import{C as Fs}from"./collapsible-card-CAFO92AU.js";import{D as yt}from"./display-table-nRiWnP_O.js";import{H as $s,a as Vs,b as Gs}from"./hover-card-DNqptEbq.js";import{c as Us,D as zs}from"./data-table-BHFS5p2l.js";import{_ as ve,a as je}from"./helper-DY4cgWaC.js";import{c as bt,P as Hs}from"./capitalize-eiSrAwjA.js";import{C as Ks}from"./checkbox-1s58fICg.js";import{P as Ve,a as Ge,b as Ue,c as xt}from"./popover-wUkN3Gmi.js";import{S as Ys}from"./spinner-BHnbmZYd.js";import{X as Cn}from"./x-8yNW3_6e.js";import{N as Xs}from"./not-in-operator-icon-CyJ3I9TW.js";import{t as Js}from"./take-bcYAXzMZ.js";import{C as Ws}from"./chevron-left-CAYn-o8w.js";import{C as Zs}from"./chevron-right-C96-fGAu.js";import{T as er}from"./trash-B9h7ibPf.js";import{R as ue}from"./sqon-DDKZFRlj.js";import{o as ee,h as te,a as ne,b as se}from"./api-occurrence-D6wbjo8N.js";import{a as st,m as re,b as ae}from"./table-mock-GhrYp0Hz.js";import{d as tr}from"./delay-60Si-nmH.js";import{M as nr,R as sr,a as rr}from"./chunk-UVKPFVEO-BkyeNUaq.js";import"./preload-helper-Dp1pzeXC.js";import"./circle-DGpyzQaM.js";import"./index-BPXwU9V8.js";import"./index-RbvwN6yS.js";import"./check-BTUcXPXF.js";import"./index-DxYPoQ9Q.js";import"./sheet-BChN-n04.js";import"./index-CVme9-v_.js";import"./dropdown-menu-CNHMOBVX.js";import"./chevron-down-CdYojbEI.js";import"./chevron-up-CB7bZ0Yp.js";import"./index-Ci7jkLw-.js";import"./command-BwpdXRUT.js";import"./badge-DdBcc0vZ.js";import"./index-BEwrDLtU.js";import"./collapsible-B6zIlBqx.js";import"./empty-DNX6Mwiv.js";import"./settings-CitW0AZv.js";import"./pagination-BPPhTjpq.js";import"./ellipsis-IiHkbkmY.js";import"./toString-CGsRiB-7.js";import"./empty-cell-CGZv2gMz.js";function ar(e){return Array.isArray(e.content)}function or(e){return e.content.value.every(n=>["false","true"].includes(n.toString().toLowerCase()))}function ir(e){return e.op===B.In?!1:e.op in B}function lr(e,n){const s=e.content.field,r=`${v.SEARCH_BY}_${s}`;return Object.values(n).flatMap(o=>o.items).some(o=>o.key===r&&o.type===v.SEARCH_BY)}function Ne(e,n){if(typeof e=="object"&&e!==null&&"content"in e){const s=e.content;if("field"in s)return s.field===n}return!1}function _n(){return{content:[],op:G.And,id:U()}}function An(e){return e.some(n=>n.content.length===0)}var T=(e=>(e.ADD_QUERY="add-query",e.SELECT_QUERY="select-query",e.REMOVE_QUERY="remove-query",e.DUPLICATE_QUERY="duplicate-query",e.SET_ACTIVE_QUERY="set-active-query",e.ADD_OR_UPDATE_FACET_PILL="add-or-update-facet-pill",e.REMOVE_FACET_PILL="remove-facet-pill",e.REMOVE_COMBINED_PILL="remove-combined-pill",e.CHANGE_COMBINER_OPERATOR="change-combiner-operator",e.SET_LABELS_ENABLED="set-labels-enabled",e.REMOVE_ALL_QUERIES="remove-all-queries-all",e.COMBINE_QUERIES="combine-queries",e))(T||{});function Z(){const e=U();return{aggregations:{},activeQueryId:e,sqons:[{content:[],id:e,op:G.And}],fetcher:{list:n=>(console.error(`fetcher.list has not been set: ${n}`),Promise.resolve([])),count:n=>(console.error(`fetcher.count has not been set: ${n}`),Promise.resolve({count:0}))},history:{type:"empty",target:"",uuid:e},settings:{labelsEnabled:!0,selectedQueries:[],combinedQueries:{}}}}const Nn=d.createContext(Z()),In=d.createContext(()=>{console.warn("QueryBuilderDispatchContext has been initialized without any dispatch props")});function cr(e,n){switch(n.type){case"add-query":{if(An(e.sqons))return e;const s=U();return{...e,activeQueryId:s,sqons:[...e.sqons,{content:[],id:s,op:G.And}]}}case"duplicate-query":{const s=U(),{sqons:r}=e;return{...e,activeQueryId:s,sqons:[...dt(r),{...dt(n.payload),id:s}]}}case"remove-query":{const{activeQueryId:s}=e;let r=e.sqons.findIndex(c=>c.id===n.payload.id),a=e.sqons.filter(c=>c.id!==n.payload.id);const o={...e.settings.combinedQueries};if(o[n.payload.id]&&delete o[n.payload.id],Object.keys(o).forEach(c=>{o[c]=o[c].filter(u=>u!=n.payload.id)}),a=a.map(c=>({...c,content:c.content.filter(u=>u.id!==n.payload.id)})),r=r<a.length?r:r-1,a.length===0){const c=U();return{...e,activeQueryId:c,sqons:[{content:[],id:c,op:G.And}],settings:{...e.settings,combinedQueries:o}}}return{...e,activeQueryId:n.payload.id===s?a[r].id:s,sqons:a,settings:{...e.settings,combinedQueries:o}}}case"set-active-query":return{...e,activeQueryId:n.payload.id};case"select-query":{const{isSelected:s}=n.payload;return s?{...e,settings:{...e.settings,selectedQueries:[...e.settings.selectedQueries,n.payload.uuid]}}:{...e,settings:{...e.settings,selectedQueries:e.settings.selectedQueries.filter(r=>r!=n.payload.uuid)}}}case"combine-queries":{const s=U(),{selectedQueries:r}=e.settings,a=e.sqons.filter(o=>r.includes(o.id));return{...e,activeQueryId:s,sqons:[...e.sqons,{id:s,content:a,op:n.payload}],settings:{...e.settings,combinedQueries:{...e.settings.combinedQueries,[s]:a.map(o=>o.id)},selectedQueries:[]}}}case"remove-all-queries-all":{const s=U();return{...e,activeQueryId:s,sqons:[{content:[],id:s,op:G.And}]}}case"add-or-update-facet-pill":{const s=e.activeQueryId,r=e.sqons.findIndex(l=>l.id===s);if(r<0)return{...e,sqons:[...e.sqons,{id:e.activeQueryId,content:[n.payload],op:G.And}]};const a=n.payload.content.field,o=e.sqons[r].content.findIndex(l=>Ne(l,a)),c={...e.settings.combinedQueries},u=Object.keys(c).filter(l=>c[l].includes(s));return o<0?{...e,sqons:e.sqons.map(l=>l.id!==s?l:{...l,content:[...l.content,n.payload]}),history:{uuid:U(),type:"add",target:a}}:n.payload.content.value.length>0?{...e,sqons:e.sqons.map(l=>{if(u.includes(l.id)){const p=(l.content??[]).map(i=>i.id!==s?i:{...i,content:i.content.map((f,_)=>_!=o?f:n.payload)});return{...l,content:p}}else if(l.id!=s)return l;return{...l,content:l.content.map((p,i)=>i!=o?p:n.payload)}}),history:{uuid:U(),type:"update",target:a}}:{...e,sqons:e.sqons.map(l=>l.id!==s?l:{...l,content:l.content.filter((p,i)=>i!==o)}),history:{uuid:U(),type:"update",target:a}}}case"remove-facet-pill":{const{activeQueryId:s}=e,r=e.sqons.findIndex(l=>l.id===s);if(!e.sqons.some(l=>l.id===s))throw new Error(`Cannot remove pill: ${n.type} ${s} ${n.payload}`);const a={...e.settings.combinedQueries},o=Object.keys(a).filter(l=>a[l].includes(s));let c=!1;const u=e.sqons.map(l=>{if(l.id===s){const p=(l.content??[]).filter(i=>!Ne(i,n.payload.content.field));if(p.length>0)return{...l,content:p};c=!0;return}if(o.includes(l.id)){const p=(l.content??[]).map(i=>{if(i.id!==s)return i;const f=i.content.filter(_=>!Ne(_,n.payload.content.field));if(f.length>0)return{...i,content:f.filter(_=>!Ne(_,n.payload.content.field))}}).filter(i=>i!==void 0);return{...l,content:p}}return l}).filter(l=>l!=null);if(c&&Object.keys(a).forEach(l=>{a[l]=a[l].filter(p=>p!=n.payload.id)}),c&&u.length===0){const l=U();return{...e,activeQueryId:l,sqons:[{content:[],id:l,op:G.And}],settings:{...e.settings,combinedQueries:a},history:{uuid:U(),type:"remove",target:n.payload.content.field}}}return{...e,activeQueryId:r<u.length?u[r].id:u[r-1].id,sqons:u,settings:{...e.settings,combinedQueries:a},history:{uuid:U(),type:"remove",target:n.payload.content.field}}}case"remove-combined-pill":{const{activeQueryId:s}=e;if(!e.sqons.some(u=>u.id===s))throw new Error(`Cannot remove combined pill: ${n.type} ${s} ${n.payload}`);const r=e.sqons.findIndex(u=>u.id===s),a={...e.settings.combinedQueries};a[s]=a[s].filter(u=>u!==n.payload.id);let o=!1;const c=e.sqons.map(u=>{if(u.id===s){const l=(u.content??[]).filter(p=>p.id!==n.payload.id);if(l.length>0)return{...u,content:l};o=!0;return}return u}).filter(u=>u!=null);return{...e,activeQueryId:o?e.sqons[r-1].id:s,sqons:c,settings:{...e.settings,combinedQueries:a}}}case"change-combiner-operator":{const{activeQueryId:s}=e;if(e.sqons.findIndex(a=>a.id===s)<0)throw Error(`ActiveQueryId does not exist in sqons: ${n.type} ${s} ${n.payload}`);return{...e,sqons:e.sqons.map(a=>a.id===s?{...a,op:n.payload.operator}:a)}}case"set-labels-enabled":return{...e,settings:{...e.settings,labelsEnabled:n.payload.labelsEnabled}};default:throw Error(`Unknown action: ${n.type} ${JSON.stringify(n.payload)}`)}}function Sn({children:e,...n}){const[s,r]=d.useReducer(cr,n);return t.jsx(Nn,{value:s,children:t.jsx(In,{value:r,children:e})})}function D(){return d.useContext(Nn)}function z(){return d.useContext(In)}function me(){const{activeQueryId:e,sqons:n}=D();return n.find(s=>s.id===e)??_n()}function En(){const{aggregations:e}=D();return e}function dr(e){var r;const n=En();return(r=Object.values(n).flatMap(a=>a.items).find(a=>a.key===e))==null?void 0:r.defaults}function ze(){const e=me();return{content:e.content,op:e.op}}function ur(){const{sqons:e}=D();return e}function pr(){const{sqons:e}=D();return e.length}function He(){const{history:e}=D();return e}function xe(){const{settings:e}=D();return e}function mr(e){const n=me();if(n.content.length===0)return[];const s=n.content.findIndex(r=>typeof r=="object"&&r!==null&&"content"in r&&"field"in r.content&&r.content.field===e);return n.content[s]?n.content[s].content.value:[]}function fr(e){const n=me();if(n.content.length===0)return null;const s=n.content.findIndex(r=>typeof r=="object"&&r!==null&&"content"in r&&"field"in r.content&&r.content.field===e);return n.content[s]?n.content[s].content.value[0]:null}function hr(e){const n=me();if(n.content.length===0)return;const s=n.content.findIndex(r=>typeof r=="object"&&r!==null&&"content"in r&&"field"in r.content&&r.content.field===e);if(n.content[s])return n.content[s]}function gr(e){const n=me();if(n.content.length===0)return[];const s=n.content.findIndex(r=>typeof r=="object"&&r!==null&&"content"in r&&"field"in r.content&&r.content.field===e);return n.content[s]?n.content[s].content.value:[]}Sn.__docgenInfo={description:"",methods:[],displayName:"QBProvider",props:{aggregations:{required:!0,tsType:{name:"AggregationConfig"},description:""},sqons:{required:!0,tsType:{name:"Array",elements:[{name:"ISyntheticSqon"}],raw:"ISyntheticSqon[]"},description:""},activeQueryId:{required:!0,tsType:{name:"string"},description:""},fetcher:{required:!0,tsType:{name:"IQBFetcher"},description:""},history:{required:!0,tsType:{name:"IHistory"},description:""},settings:{required:!0,tsType:{name:"ISettings"},description:""},children:{required:!0,tsType:{name:"ReactReactElement",raw:"React.ReactElement"},description:""}}};const yr={organization:ps,variant:nn,gene:us,pathogenicity:ds,frequency:cs,occurrence:ls,parental_analysis:is,metric_qc:os},vt=en({base:"text-secondary dark:text-foreground",variants:{selected:{true:"bg-sidebar-brand-accent text-sidebar-brand-accent-foreground"}},defaultVariants:{selected:!1}});function wn({onItemSelect:e,aggregationGroups:n,selectedItemId:s}){const{t:r}=P(),{open:a,toggleSidebar:o}=fs(),[c,u]=d.useState(null),l=s!==void 0?s:c,p=i=>{const f=l===i?null:i;u(f),e&&e(f)};return t.jsx(sn,{variant:"sidebar",collapsible:"icon",className:"static! flex flex-col w-full bg-primary dark:bg-secondary ",children:t.jsx(rn,{children:t.jsxs(an,{children:[t.jsxs(Me,{children:[t.jsx(De,{asChild:!0,children:t.jsx(w,{iconOnly:!0,onClick:()=>o(),className:vt({className:"mb-1 hover:bg-sidebar-brand-accent hover:text-sidebar-brand-accent-foreground"}),size:"sm",variant:"ghost",children:a?t.jsx(ys,{}):t.jsx(bs,{})})}),t.jsx(Pe,{side:"right",align:"center",children:r(a?"query_filters.sidebar_panel.collapse":"query_filters.sidebar_panel.expand")})]}),t.jsx(on,{children:Object.entries(n).map(([i])=>{const f=yr[i],_=r(`query_filters.sidebar_panel.filters.${i}`);return t.jsx(hs,{children:t.jsx(gs,{asChild:!0,className:vt({selected:l===i}),onClick:j=>{j.preventDefault(),p(i)},tooltip:_,children:t.jsxs("div",{children:[t.jsx(f,{}),t.jsx("span",{children:_})]})})},i)})})]})})})}wn.__docgenInfo={description:"",methods:[],displayName:"SidebarGroups",props:{onItemSelect:{required:!1,tsType:{name:"signature",type:"function",raw:"(itemId: string | null) => void",signature:{arguments:[{type:{name:"union",raw:"string | null",elements:[{name:"string"},{name:"null"}]},name:"itemId"}],return:{name:"void"}}},description:""},selectedItemId:{required:!1,tsType:{name:"union",raw:"string | null",elements:[{name:"string"},{name:"null"}]},description:""},aggregationGroups:{required:!0,tsType:{name:"AggregationConfig"},description:""}}};const On=d.createContext({appId:M.snv_occurrence,builderFetcher:e=>{},statisticFetcher:e=>{}});function Be(){const e=d.useContext(On);if(!e)throw new Error("useFilterConfig must be used within a FilterConfigProvider");return e}function rt({field:e}){const{t:n}=P(),{builderFetcher:s}=Be(),{activeQueryId:r}=D(),a=z(),o=He(),{data:c}=s({field:e.key}),u=fr(e.key),[l,p]=d.useState(c??[]),[i,f]=d.useState(u),_=d.useCallback(m=>{m.key!==i&&m.key!==void 0&&(f(m.key??null),a({type:T.ADD_OR_UPDATE_FACET_PILL,payload:{content:{field:e.key,value:[m.key]},op:E.In}}))},[i]),j=d.useCallback(m=>i===m.key,[i]),g=d.useCallback(()=>{a({type:T.REMOVE_FACET_PILL,payload:{content:{field:e.key,value:[i]},op:E.In}}),f(null)},[i]);return d.useEffect(()=>{c&&p(c)},[c]),d.useEffect(()=>{o.target==e.key&&u!==i&&f(u)},[o.uuid]),d.useEffect(()=>{u!==i&&f(u)},[r]),t.jsxs("div",{className:"p-2 w-full max-w-md",children:[t.jsx(xs,{children:l.map(m=>t.jsx("div",{className:"space-y-3 pt-2",children:t.jsxs("div",{className:"flex justify-between items-center",children:[t.jsxs("div",{className:"flex items-center space-x-2",children:[t.jsx(vs,{value:m.key||"",id:m.key,checked:j(m),onClick:()=>{_(m)}}),t.jsx(he,{htmlFor:m.key,children:m.key})]}),t.jsx("span",{className:"bg-accent px-2 py-1 rounded-md font-mono text-xs",children:m.count})]})},m.key))}),i!==null&&t.jsxs(t.Fragment,{children:[t.jsx("hr",{className:"my-4 border-border"}),t.jsx("div",{className:"flex align-right justify-end items-center space-x-2",children:t.jsx(w,{onClick:g,size:"xs",children:n("common.filters.buttons.clear")})})]})]})}rt.__docgenInfo={description:"@TODO: https://d3b.atlassian.net/browse/SJRA-1241 update aggregate empty check when task is done",methods:[],displayName:"BooleanFacet",props:{field:{required:!0,tsType:{name:"AggregationConfig"},description:""}}};function Rn(e,n){return`facet-${e}-${n}-dictionary`}function br({appId:e,field:n,isDictionaryEnabled:s}){const r=Rn(e,n),a=localStorage.getItem(r);if(!a){console.warn(`${r} doesn't exist in locale storage; a new entry is being created; isDictionaryEnabled: ${s}`),localStorage.setItem(r,s.toString());return}const o=JSON.parse(a);console.warn(`${r} exist in locale storage: isDictionaryEnabled: ${o}`),s!==o&&(console.warn(`${r} has been updated: isDictionaryEnabled: ${o}`),localStorage.setItem(r,s.toString()))}function xr({appId:e,field:n}){const s=Rn(e,n),r=localStorage.getItem(s);if(!r)return!1;const a=JSON.parse(r);return console.warn(`${s} exist in locale storage: isDictionaryEnabled: ${a}`),a}function vr(e,n){const s=e.toLowerCase().split(/\s+/).filter(Boolean);return n.filter(r=>{const a=r.key.toLowerCase(),o=r.label.toLowerCase();function c(u,l){let p=0;for(const i of l){const f=u.indexOf(i,p);if(f===-1)return!1;p=f+i.length}return!0}return c(a,s)||c(o,s)})}function Je(e,n){return n<e?n:e}function jr(e){return(n,s)=>{const r=n.key&&e.includes(n.key),a=s.key&&e.includes(s.key);return r===a?s.count-n.count:r?-1:1}}function at({field:e,maxVisibleItems:n=5}){const{t:s,sanitize:r,lazyTranslate:a}=P(),{appId:o,builderFetcher:c}=Be(),u=z(),[l,p]=d.useState(xr({appId:o,field:e.key})),{data:i,isLoading:f}=c({field:e.key,withDictionary:l}),_=He(),{activeQueryId:j}=D(),g=mr(e.key),m=d.useMemo(()=>(i??[]).map(F=>({...F,label:s(`common.filters.values.${F.key}.${r(F.key)}`,{defaultValue:a(F.key)})})).sort(jr(g)),[i,g]),[A,b]=d.useState(m),[y,x]=d.useState(g),[Q,k]=d.useState(Je((i??[]).length,n)),N=d.useCallback(I=>{if(!I.trim()){b(i),k(Je(i.length,n));return}const F=vr(I,i);b(F),n>F.length?k(F.length):F.length>n&&k(n)},[n,i]),C=d.useCallback(()=>{const I=!l;p(I),br({appId:o,field:e.key,isDictionaryEnabled:I})},[l]),K=d.useCallback(()=>{k(A.length)},[A]),R=d.useCallback(()=>{k(n)},[n]),q=d.useCallback(()=>{y.length!==A.length&&x(A.map(I=>I.key))},[A,y]),$=d.useCallback(()=>{x([])},[e.key]),ce=d.useCallback(()=>{y.length!==0&&$()},[y,$]),Ke=I=>{if(y.includes(I.key??"")){x(y.filter(F=>F!==I.key));return}x([...y,I.key])},Ye=d.useCallback(()=>{$()},[$]),de=d.useCallback(I=>{u({type:T.ADD_OR_UPDATE_FACET_PILL,payload:{content:{field:e.key,value:[...y]},op:I}})},[y,o,e.key]),Ae=d.useCallback(()=>{de(Xe.In)},[de]),S=d.useCallback(()=>{de(Xe.NotIn)},[de]),L=d.useCallback(()=>{de(Xe.In)},[de]);return d.useEffect(()=>{f||(b(m),k(Je((i??[]).length,n)))},[f,i]),d.useEffect(()=>{_.target==e.key&&(b(m),ht(g,y)||x(g))},[_.uuid]),d.useEffect(()=>{b(m),ht(g,y)||x(g)},[j]),t.jsxs(t.Fragment,{children:[t.jsxs(nt,{size:"sm",variant:"outline",children:[t.jsx(be,{startIcon:_s,size:"xs",type:"text",placeholder:s("common.filters.search.placeholder"),className:"w-full text-xs mt-3 py-1.5 px-3 mb-4 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500",onChange:I=>N(I.target.value),autoFocus:!0}),t.jsxs("div",{className:"flex gap-2 items-center",children:[t.jsx(w,{size:"xs",onClick:()=>q(),variant:"link",className:"px-0",children:s("common.filters.buttons.all")}),t.jsx(un,{orientation:"vertical",className:"h-4"}),t.jsx(w,{size:"xs",onClick:()=>ce(),variant:"link",className:"px-0",children:s("common.filters.buttons.none")}),e.withDictionary&&t.jsxs(t.Fragment,{children:[t.jsx("div",{className:"grow"}),t.jsx(he,{htmlFor:"with-dictionary-switch",className:"text-xs",children:s("common.filters.with_dictionary")}),t.jsx(pn,{id:"with-dictionary-switch",checked:l,size:"xs",onCheckedChange:C})]})]}),t.jsxs("div",{className:"max-h-[250px] overflow-auto",children:[f&&Array.from({length:3},(I,F)=>t.jsxs("div",{className:"flex justify-between items-center py-2 space-x-2",children:[t.jsx(V,{className:"w-full h-6 rounded"}),t.jsx(V,{className:"h-6 w-12 rounded-md"})]},`skeleton-${F}`)),!f&&A.length===0&&t.jsx("div",{className:"text-muted-foreground py-4",children:s("common.filters.no_values_found")}),!f&&A.length>0&&A.slice(0,Q).map(I=>t.jsx("div",{className:"gap-3 py-1.5",children:t.jsx(js,{size:"xs",label:I.label,checked:y.some(F=>F===I.key),count:I.count,onCheckedChange:()=>Ke(I)})},I.key))]}),!f&&A.length>Q&&t.jsx(w,{className:"mt-2 px-0",onClick:K,size:"xs",variant:"link",children:s("common.filters.buttons.show_more",{value:W(A.length-Q)})}),!f&&Q>n&&t.jsx(w,{className:"mt-2 px-0",onClick:R,size:"xs",variant:"link",children:s("common.filters.buttons.show_less")})]}),t.jsx(dn,{size:"sm",children:t.jsxs("div",{className:"flex align-right justify-end items-center space-x-2",children:[t.jsx(w,{size:"2xs",variant:"ghost",onClick:Ye,disabled:y.length===0||f,children:s("common.filters.buttons.clear")}),t.jsx("div",{className:"flex space-x-2",children:t.jsx(cn,{size:"2xs",variant:"outline",className:"h-7",color:"primary",actions:[{label:s("common.filters.buttons.some_not_in"),onClick:L},{label:s("common.filters.buttons.not_in"),onClick:S}],onDefaultAction:Ae,disabled:f,children:s("common.filters.buttons.apply")})})]})})]})}at.__docgenInfo={description:`Multi select facet
- Allow to select multi string value
@TODO: https://d3b.atlassian.net/browse/SJRA-1241 update aggregate empty check when task is done`,methods:[],displayName:"MultiSelectFacet",props:{field:{required:!0,tsType:{name:"AggregationConfig"},description:""},maxVisibleItems:{required:!1,tsType:{name:"number"},description:"",defaultValue:{value:"5",computed:!1}}}};const kr="integer";function Cr(e,n){return e.intervalDecimal!==void 0&&e.max!==void 0&&e.min!==void 0?!0:n!=null&&n.min!==void 0&&n.max!==void 0}function Tn(e){return!e||e===kr?0:3}function We({sqon:e,config:n,statistics:s}){let r=(n==null?void 0:n.defaultOperator)??B.LessThan,a="0",o="0",c="";const u=Tn(s==null?void 0:s.type);return e?(e.content.value.length===2?(r=B.Between,a=Number(Number(e.content.value[0]).toFixed(u)).toString(),o=Number(Number(e.content.value[1]).toFixed(u)).toString()):c=Number(e.content.value[0]).toString(),e.op&&(r=e.op),{selectedRange:r,minValue:a,maxValue:o,numericalValue:c}):((s==null?void 0:s.min)!==void 0?(a=Number(s.min.toFixed(u)).toString(),c=Number(s.min.toFixed(u)).toString()):n.defaultMin!==void 0&&(a=n.defaultMin.toString(),c=n.defaultMin.toString()),(s==null?void 0:s.max)!==void 0?o=Number(s.max.toFixed(u)).toString():n.defaultMax!==void 0&&(o=n.defaultMax.toString()),n.defaultOperator&&(r=n.defaultOperator),{selectedRange:r,minValue:a,maxValue:o,numericalValue:c})}function _r({isLoading:e,field:n,min:s,max:r,decimal:a}){const{t:o}=P();if(e)return t.jsxs("div",{className:"flex mb-2",children:[t.jsx(V,{className:"h-5 w-16 mr-1"}),t.jsx(V,{className:"h-5 w-32"})]});const c={minimumFractionDigits:a,maximumFractionDigits:a};return t.jsx("div",{id:`${n}_interval`,className:"mb-1",children:t.jsx(Xn,{size:"xs",children:o("common.filters.labels.actual_interval",{min:s!==void 0?W(s,c):void 0,max:r!==void 0?W(r,c):void 0})})})}function Ze(e,n,s,r){return e===B.Between?!n||n.trim()===""||!s||s.trim()==="":!r||r.trim()===""}function ot({field:e}){var Ae;const{t:n}=P(),{activeQueryId:s}=D(),r=z(),a=He(),{appId:o}=Be(),{statisticFetcher:c}=Be(),u=me(),l=hr(e.key),p=d.useMemo(()=>({[B.GreaterThan]:{display:n("common.filters.operators.greater_than"),dropdown:n("common.filters.operators.greater_than"),icon:bn},[B.LessThan]:{display:n("common.filters.operators.less_than"),dropdown:n("common.filters.operators.less_than"),icon:yn},[B.Between]:{display:n("common.filters.operators.between"),dropdown:n("common.filters.operators.between"),icon:gn},[B.GreaterThanOrEqualTo]:{display:n("common.filters.operators.greater_than_or_equal"),dropdown:n("common.filters.operators.greater_than_or_equal"),icon:hn},[B.LessThanOrEqualTo]:{display:n("common.filters.operators.less_than_or_equal"),dropdown:n("common.filters.operators.less_than_or_equal"),icon:fn},[B.In]:{display:n("common.filters.operators.in"),dropdown:n("common.filters.operators.in"),icon:mn}}),[]),{data:i,isLoading:f}=c({field:e.key}),_=Tn(i==null?void 0:i.type),[j,g]=d.useState(B.GreaterThan),[m,A]=d.useState(""),[b,y]=d.useState(""),[x,Q]=d.useState(""),[k,N]=d.useState(!Ze(j,x,b,m)),C=dr(e.key),K=Cr(C,i),R=(C==null?void 0:C.min)??(i==null?void 0:i.min)??0,q=(C==null?void 0:C.max)??(i==null?void 0:i.max)??100,$=d.useCallback(S=>{g(S),N(Ze(j,x,b,m))},[]),ce=d.useCallback((S,L=!1)=>{L?(Q(S.minValue),y(S.maxValue),A(S.numericalValue)):(Q(""),y(""),A(""),N(!0)),g(S.selectedRange)},[]),Ke=()=>{Q(""),y(""),A(""),g((C==null?void 0:C.defaultOperator)??B.LessThan),N(!0)},Ye=d.useCallback(()=>{const S=Ze(j,x,b,m);if(N(S),S)r({type:T.REMOVE_FACET_PILL,payload:l||_n()});else{let L=[];j===B.Between?L=[parseFloat(x),parseFloat(b)]:L=[parseFloat(m)],r({type:T.ADD_OR_UPDATE_FACET_PILL,payload:{content:{field:e.key,value:L},op:j}})}},[o,e.key,j,m,x,b]),de=d.useMemo(()=>l?!1:j===B.Between?!x||!b||x.trim()===""||b.trim()===""||isNaN(Number(x))||isNaN(Number(b)):!m||m.trim()===""||isNaN(Number(m)),[j,x,b,m,l]);return d.useEffect(()=>{if(!(u!=null&&u.content))return;const S=We({sqon:l,config:C,statistics:i});ce(S,!!l)},[l,u,C,i]),d.useEffect(()=>{if(a.target==e.key){const S=We({sqon:l,config:C,statistics:i});ce(S,!!l)}},[a.uuid]),d.useEffect(()=>{const S=We({sqon:l,config:C,statistics:i});ce(S,!!l)},[s]),t.jsxs(t.Fragment,{children:[t.jsx(nt,{id:`${e.key}_container`,size:"sm",variant:"outline",children:t.jsx("div",{className:"pt-2",children:t.jsxs("div",{className:"flex flex-col gap-3",children:[t.jsx("div",{id:`${e.key}_operator`,children:t.jsxs(As,{value:j,onValueChange:$,children:[t.jsx(Ns,{size:"sm",children:t.jsx(Is,{placeholder:n("common.filters.operators.select_operator"),children:((Ae=p[j])==null?void 0:Ae.display)||n("common.filters.operators.unknown")})}),t.jsx(Ss,{children:Object.entries(B).map(([S,L])=>{const I=p[L].icon;return t.jsx(Es,{value:L,children:t.jsxs("div",{className:"flex items-center gap-2",children:[t.jsx(I,{size:16}),t.jsx("span",{children:p[L].dropdown})]})},L)})})]})}),j===B.Between?t.jsxs("div",{className:"flex gap-2 flex-row",children:[t.jsx(be,{size:"xs",className:"w-half",value:x,onChange:S=>{const L=S.target.value;isNaN(Number(L))||(Q(L),N(!1))},min:R,max:q,id:`${e.key}_min`,"data-testid":`${e.key}_min`}),t.jsx(be,{size:"xs",className:"w-half",value:b,onChange:S=>{const L=S.target.value;isNaN(Number(L))||(y(L),N(!1))},min:R,max:q,id:`${e.key}_max`,"data-testid":`${e.key}_max`})]}):t.jsx(be,{size:"xs",className:"w-full",value:m,onChange:S=>{const L=S.target.value;isNaN(Number(L))||(A(L),N(!1))},min:R,max:q,id:`${e.key}_value`,"data-testid":`${e.key}_value`}),K&&t.jsx(_r,{isLoading:f,field:e.key,min:i==null?void 0:i.min,max:i==null?void 0:i.max,decimal:_})]})})}),t.jsx(dn,{size:"sm",children:t.jsxs("div",{className:"flex align-right justify-end items-center space-x-2",children:[t.jsx(w,{size:"2xs",variant:"ghost",onClick:Ke,disabled:k,id:`${e.key}_clear`,children:n("common.filters.buttons.clear")}),t.jsx("div",{className:"flex space-x-2",children:t.jsx(w,{size:"2xs",variant:"outline",onClick:Ye,id:`${e.key}_apply`,disabled:de,children:n("common.filters.buttons.apply")})})]})})]})}ot.__docgenInfo={description:`Numerical facet
-Use statistics API for dynamic min/max values
-Configurable decimal precision and intervals
-Unit selection for range types
-"No data" option for missing values
-Decimal is set to 3 by default (integer will be 0)

@TODO: https://d3b.atlassian.net/browse/SJRA-1241 update aggregate empty check when task is done
@TODO: no data has been removed since none of the facet needs it at the moment`,methods:[],displayName:"NumericalFacet",props:{field:{required:!0,tsType:{name:"AggregationConfig"},description:""}}};function qe({field:e,children:n}){const{t:s}=P(),{history:r}=ws(),a=s(`common.filters.labels.${e.translation_key}`,{defaultValue:e.key});let o=null;if(Jn.includes(e.key)){const u=`common.filters.labels.${e.translation_key}_tooltip`;o=s(u)===u?null:s(u)}function c(){return t.jsx("div",{className:"flex items-center justify-between w-full text-xs",children:t.jsx("span",{children:a})})}return t.jsx(Fe,{size:"sm",children:t.jsxs(xn,{value:e.key,className:"border-none",children:[t.jsx(ks,{size:"sm",children:t.jsx(vn,{children:o?t.jsxs(Me,{children:[t.jsx(De,{asChild:!0,children:t.jsx("span",{children:c()})}),t.jsx(Pe,{children:t.jsx("span",{children:o})})]}):c()})}),t.jsx(jn,{className:"pb-0",forceMount:r.includes(e.key)?!0:void 0,children:n})]},e.key)})}function it({field:e}){const{t:n}=P();let s;switch(e.type){case v.MULTIPLE:s=t.jsx(at,{field:e});break;case v.NUMERICAL:s=t.jsx(ot,{field:e});break;case v.BOOLEAN:s=t.jsx(rt,{field:e});break;default:s=t.jsx("div",{children:n("common.filters.unsupported_type",{type:e.type})})}return s}function Ln({field:e,isOpen:n}){const{t:s}=P(),r=e.type;if(r===v.DIVIDER)return t.jsx("h4",{className:"px-2 h-8 text-sidebar-foreground/70 text-xs font-medium line-height-xs text-ellipsis overflow-hidden flex justify-between items-center",children:s(`common.filters.${e.key}`)});let a;switch(r){case v.MULTIPLE:a=t.jsx(qe,{field:e,isOpen:n,children:t.jsx(at,{field:e})});break;case v.NUMERICAL:a=t.jsx(qe,{field:e,isOpen:n,children:t.jsx(ot,{field:e})});break;case v.BOOLEAN:a=t.jsx(qe,{field:e,isOpen:n,children:t.jsx(rt,{field:e})});break;default:a=t.jsx("div",{children:s("common.filters.unsupported_type",{type:e.type})})}return a}qe.__docgenInfo={description:"",methods:[],displayName:"AccordionContainer",props:{field:{required:!0,tsType:{name:"AggregationConfig"},description:""},isOpen:{required:!0,tsType:{name:"boolean"},description:""},searchHandler:{required:!1,tsType:{name:"signature",type:"function",raw:"(_e: React.MouseEvent<SVGElement, MouseEvent>) => void",signature:{arguments:[{type:{name:"ReactMouseEvent",raw:"React.MouseEvent<SVGElement, MouseEvent>",elements:[{name:"SVGElement"},{name:"MouseEvent"}]},name:"_e"}],return:{name:"void"}}},description:""},children:{required:!1,tsType:{name:"ReactReactNode",raw:"React.ReactNode"},description:""}}};Ln.__docgenInfo={description:"To be use when the facet needs to be inside an Accordion component",methods:[],displayName:"FacetContainer",props:{field:{required:!0,tsType:{name:"AggregationConfig"},description:""},isOpen:{required:!0,tsType:{name:"boolean"},description:""},searchHandler:{required:!1,tsType:{name:"signature",type:"function",raw:"(_e: React.MouseEvent<SVGElement, MouseEvent>) => void",signature:{arguments:[{type:{name:"ReactMouseEvent",raw:"React.MouseEvent<SVGElement, MouseEvent>",elements:[{name:"SVGElement"},{name:"MouseEvent"}]},name:"_e"}],return:{name:"void"}}},description:""}}};const Ar=2;function Qn({search:e}){const{t:n}=P(),s=z(),r=me(),a=He(),{translation_key:o,key:c}=e,u=c.replace(/search_by_/g,""),[l,p]=d.useState([]),[i,f]=d.useState([]),_=gr(u);d.useEffect(()=>{Array.isArray(_)?p(_):p([])},[u,r]),d.useEffect(()=>{a.target===u&&(Array.isArray(_)?p(_):p([]))},[a.uuid,u,r]),d.useEffect(()=>{(async()=>{if(l.length===0){f([]);return}if(l.length>Ar){const A=l.map(b=>({value:b,label:b,badgeLabel:b}));f(A);return}try{const A=l.map(async y=>{var x,Q;try{const N=(await et.geneAutoComplete(y)).data.find(C=>{var K;return((K=C.source)==null?void 0:K.name)===y});if(N)return{value:y,label:t.jsxs("div",{className:"flex flex-col gap-0.5",children:[t.jsx("span",{className:"text-sm text-foreground",children:((x=N.source)==null?void 0:x.name)||y}),t.jsx("span",{className:"text-xs text-muted-foreground",children:((Q=N.source)==null?void 0:Q.id)||""})]}),badgeLabel:y}}catch(k){console.error(`Error fetching gene ${y}:`,k)}return{value:y,label:y,badgeLabel:y}}),b=await Promise.all(A);f(b)}catch(A){console.error("Error fetching gene details:",A);const b=l.map(y=>({value:y,label:y,badgeLabel:y}));f(b)}})()},[l]);const j=async m=>{if(!m)return[];try{return(await et.geneAutoComplete(m)).data.map(b=>{var y,x,Q,k,N,C;return{value:((y=b.source)==null?void 0:y.name)||"",label:t.jsxs("div",{className:"flex flex-col gap-0.5",children:[t.jsx("span",{className:"text-sm text-foreground",children:pt(((x=b.highlight)==null?void 0:x.name)||((Q=b.source)==null?void 0:Q.name)||"")}),t.jsx("span",{className:"text-xs text-muted-foreground",children:pt(((k=b.highlight)==null?void 0:k.id)||((N=b.source)==null?void 0:N.id)||"")})]}),badgeLabel:((C=b.source)==null?void 0:C.name)||""}})}catch(A){return console.error("Error fetching genes:",A),[]}},g=m=>{p(m),s({type:T.ADD_OR_UPDATE_FACET_PILL,payload:{content:{field:u,value:m},op:E.In}})};return t.jsxs("div",{className:"flex flex-col gap-2 ",children:[t.jsxs("div",{className:"flex items-center gap-2",children:[t.jsx(he,{children:n(`common.filters.labels.${o}`)}),t.jsxs(Me,{children:[t.jsx(De,{asChild:!0,children:t.jsx(tn,{size:16})}),t.jsx(Pe,{children:n(`common.filters.labels.${o}_tooltip`)})]})]}),t.jsx(Os,{value:l,defaultOptions:i,onChange:g,onSearch:j,placeholder:n(`common.filters.labels.${o}_placeholder`),className:"w-full",debounceDelay:300,maxSelected:100,hidePlaceholderWhenSelected:!0})]})}Qn.__docgenInfo={description:"",methods:[],displayName:"SearchFacet",props:{search:{required:!0,tsType:{name:"AggregationConfig"},description:""}}};const ye=Us(),Nr=(e,n)=>[ye.accessor("entry",{cell:s=>s.getValue(),header:n(`common.upload_id.${e}.submitted_identifier`)}),ye.group({id:"mapped_to",header:()=>t.jsx("span",{className:"flex justify-center w-full",children:n("common.upload_id.mapped_to")}),columns:[ye.accessor("omim_gene_id",{header:n(`common.upload_id.${e}.omim_gene_id`),cell:s=>s.getValue()}),ye.accessor("symbol",{header:n(`common.upload_id.${e}.symbol`),cell:s=>s.getValue()})]})],Ir=(e,n)=>[ye.accessor("entry",{cell:s=>s.getValue(),header:n(`common.upload_id.${e}.submitted_identifier`)})];async function Sr(e){return new Promise((n,s)=>{const r=new FileReader;r.onload=a=>{if(!a.target||typeof a.target.result!="string"){s(new Error("Failed to read file content."));return}n(a.target.result)},r.onerror=a=>{s(a)},r.readAsText(e)})}function qn({variant:e}){const{t:n}=P(),s=z(),[r,a]=d.useState(""),[o,c]=d.useState(!1),[u,l]=d.useState([]),[p,i]=d.useState([]),[f,_]=d.useState([]),j=d.useRef(null),g=Ps(r,500),m=()=>r.split(/[\n,\r ]/).filter(k=>!!k),A=()=>new Set(m()),b=k=>{const N=m(),C=new Set(k.flatMap(R=>{var q,$;return[(q=R.symbol)==null?void 0:q.toLowerCase(),($=R.ensembl_gene_id)==null?void 0:$.toLowerCase()].filter(Boolean)}));return Array.from(A()).filter(R=>!C.has(R.toLowerCase())).map((R,q)=>({key:q,submittedId:R})).map(R=>({entry:N.find($=>{var ce;return $.toLowerCase()===((ce=R.submittedId)==null?void 0:ce.toLowerCase())})??R.submittedId,symbol:"",omim_gene_id:""}))},y=k=>{const N=m();return k.map(C=>({entry:N.find(R=>{var q,$;return R.toLowerCase()===((q=C.symbol)==null?void 0:q.toLowerCase())||R.toLowerCase()===(($=C.ensembl_gene_id)==null?void 0:$.toLowerCase())})??C.symbol??"",symbol:C.symbol??"",omim_gene_id:C.ensembl_gene_id??""}))},x=()=>{_([]),i([]),a(""),l([])};d.useEffect(()=>{g?(async()=>{c(!0);const k=await et.geneSearch({inputs:g.split(/[\n,\r ]/).filter(N=>!!N)});i(y(k.data)),_(b(k.data)),c(!1)})():x()},[g]);const Q=async k=>{if(!k.target.files)return;c(!0);const N=Array.from(k.target.files);try{const K=(await Promise.all(N.map(Sr))).flatMap(R=>R.split(/[\n,]+/).map(q=>q.trim()).map(q=>q.replace(/^"+|"+$/g,""))).filter(R=>R.length>0);a(K.join(`
`)),l(N)}catch(C){console.error("Error processing files:",C)}finally{c(!1)}};return t.jsxs(Ts,{onOpenChange:x,children:[t.jsx(Ls,{asChild:!0,children:t.jsxs(w,{size:"sm",className:"w-full mb-2",children:[t.jsx(Wn,{}),n(`common.upload_id.${e}.button`)]})}),t.jsxs(Qs,{size:"lg",variant:"stickyBoth",children:[t.jsx(qs,{children:t.jsx(Bs,{children:n(`common.upload_id.${e}.dialog_title`)})}),t.jsxs(Ms,{className:"flex flex-col gap-3 max-h-[80vh] overflow-y-auto",children:[t.jsxs("div",{className:"flex gap-2",children:[t.jsx(he,{children:n("common.upload_id.input_label")}),t.jsxs($s,{children:[t.jsx(Vs,{asChild:!0,children:t.jsx(tn,{size:16})}),t.jsxs(Gs,{className:"w-full",children:[t.jsx("h4",{className:"font-semibold mb-3",children:n("common.upload_id.popover_title")}),t.jsxs("div",{className:"flex gap-2 items-center",children:[t.jsx(he,{className:"font-semibold",children:n("common.upload_id.popover_identifiers")}),t.jsx("span",{className:"text-sm text-muted-foreground",children:n(`common.upload_id.${e}.popover_identifiers_values`)})]}),t.jsxs("div",{className:"flex gap-2 items-center",children:[t.jsx(he,{className:"font-semibold",children:n("common.upload_id.popover_separators")}),t.jsx("span",{className:"text-sm text-muted-foreground",children:n("common.upload_id.popover_separators_values")})]}),t.jsxs("div",{className:"flex gap-2 items-center",children:[t.jsx(he,{className:"font-semibold",children:n("common.upload_id.popover_file_formats")}),t.jsx("span",{className:"text-sm text-muted-foreground",children:n("common.upload_id.popover_file_formats_values")})]})]})]})]}),t.jsx(Zn,{id:"upload-id-textarea",onChange:k=>a(k.target.value),placeholder:n(`common.upload_id.${e}.input_placeholder`),rows:5,value:r,className:"flex-shrink-0"}),t.jsxs("div",{className:"flex gap-1",children:[t.jsxs(t.Fragment,{children:[t.jsx(w,{loading:o,variant:"outline",onClick:()=>(j==null?void 0:j.current)&&j.current.click(),children:n("common.upload_id.upload_a_file")}),t.jsx(be,{id:"file",type:"file",ref:j,accept:".txt,.csv,.tsv",className:"hidden",multiple:!0,onChange:Q})]}),(f.length>0||p.length>0)&&t.jsx(w,{variant:"ghost",onClick:x,children:n("common.upload_id.clear")})]}),u.length>0&&t.jsx("div",{className:"flex flex-col gap-1",children:u.map((k,N)=>t.jsxs("div",{className:"flex items-center gap-1",children:[t.jsx(es,{size:14})," ",k.name]},N))}),(f.length>0||p.length>0)&&t.jsx("div",{className:"mt-6",children:t.jsx(Fs,{title:n("common.upload_id.summary_table",{matched:W(p.length),unmatched:W(f.length)}),cardClassName:"py-4",cardHeaderClassName:"px-4 !gap-0",children:t.jsxs("div",{className:"flex flex-col gap-3 mt-3",children:[t.jsx("span",{children:n("common.upload_id.resume",{total:W(m().length),unique:W(p.length)})}),t.jsxs(ts,{defaultValue:"matched",children:[t.jsxs(ns,{children:[t.jsx(mt,{value:"matched",children:n("common.upload_id.matched",{total:W(p.length)})}),t.jsx(mt,{value:"unmatched",children:n("common.upload_id.unmatched",{total:W(f.length)})})]}),t.jsx(ft,{value:"matched",children:t.jsx(yt,{data:p,columns:Nr(e,n),dataCy:"matched-table"})}),t.jsx(ft,{value:"unmatched",children:t.jsx(yt,{data:f,columns:Ir(e,n),dataCy:"unmatched-table"})})]})]})})})]}),t.jsxs(Ds,{children:[t.jsx(gt,{asChild:!0,children:t.jsx(w,{variant:"outline",children:n("common.actions.cancel")})}),t.jsx(gt,{asChild:!0,children:t.jsx(w,{disabled:p.length===0,onClick:()=>{s({type:T.ADD_OR_UPDATE_FACET_PILL,payload:{content:{field:e,value:p.map(k=>k.symbol)},op:E.In}})},children:n("common.actions.upload")})})]})]})]})}qn.__docgenInfo={description:"",methods:[],displayName:"UploadIdModal",props:{variant:{required:!0,tsType:{name:"string"},description:""}}};function Bn({groupKey:e,aggregations:n}){var j;const{t:s}=P(),[r,a]=d.useState(!1),[o,c]=d.useState([]),[u,l]=d.useState(e),p=e?((j=n[e])==null?void 0:j.items)||[]:Object.values(n).flatMap(g=>g.items),i=p.filter(g=>g.type===v.SEARCH_BY),f=p.filter(g=>g.type===v.UPLOAD_LIST),_=p.filter(g=>g.type!==v.SEARCH_BY&&g.type!==v.UPLOAD_LIST);return d.useEffect(()=>{a(!1),c([])},[e]),d.useEffect(()=>{l(e)},[e,u]),t.jsxs("div",{children:[t.jsxs("div",{className:"flex flex-col gap-3 mb-3",children:[i.map((g,m)=>t.jsx(Qn,{search:g},`${g.key}-${m}`)),f.map((g,m)=>t.jsx(qn,{variant:g.key.replace(/upload_list_/g,"")},`${g.key}-${m}`))]}),t.jsx("div",{className:"flex justify-end",children:t.jsx(w,{variant:"link",size:"xs",onClick:()=>{const g=!r;a(g),c(g?_.map(m=>m.key):[])},children:s(r?"common.actions.collapse_all":"common.actions.expand_all")})}),t.jsx(kn,{className:"flex flex-col gap-1",type:"multiple",value:o,onValueChange:g=>c(g),children:_.map((g,m)=>t.jsx(Ln,{isOpen:o.includes(g.key),field:g},`${g.key}-${m}`))})]})}Bn.__docgenInfo={description:"",methods:[],displayName:"FacetList",props:{groupKey:{required:!1,tsType:{name:"union",raw:"string | null",elements:[{name:"string"},{name:"null"}]},description:""},aggregations:{required:!0,tsType:{name:"AggregationConfig"},description:""}}};function Er(e){switch(e){case M.snv_occurrence:return{builderFetcher:jt,statisticFetcher:kt};case M.cnv_occurrence:return{builderFetcher:wr,statisticFetcher:Or};default:return{builderFetcher:jt,statisticFetcher:kt}}}function jt({field:e,size:n=30,withDictionary:s=!1}){const r=ze(),a=ve(),o=je(),c={caseId:a,seqId:o,aggregationBody:{field:e,size:n,sqon:r},withDictionary:s};return pe(c,async()=>$e.aggregateGermlineSNVOccurrences(c.caseId,c.seqId,c.aggregationBody,c.withDictionary).then(u=>u.data),{revalidateOnFocus:!1})}function kt({field:e}){const n=ze(),s=ve(),r=je(),a={caseId:s,seqId:r,statisticsBody:{field:e,sqon:n}};return pe(a,async()=>$e.statisticsGermlineSNVOccurrences(a.caseId,a.seqId,a.statisticsBody).then(o=>o.data),{revalidateOnFocus:!1})}function wr({field:e,size:n=30}){const s=ze(),r=ve(),a=je(),o={caseId:r,seqId:a,aggregationBody:{field:e,size:n,sqon:s}};return pe(o,async()=>$e.aggregateGermlineCNVOccurrences(o.caseId,o.seqId,o.aggregationBody).then(c=>c.data),{revalidateOnFocus:!1})}function Or({field:e}){const n=ze(),s=ve(),r=je(),a={caseId:s,seqId:r,statisticsBody:{field:e,sqon:n}};return pe(a,async()=>$e.statisticsGermlineCNVOccurrences(a.caseId,a.seqId,a.statisticsBody).then(o=>o.data),{revalidateOnFocus:!1})}async function Rr(e){return(await Rs.getUserPreferences(e.key)).data}function Tr({appId:e,setPreference:n}){const s=pe(`query-builder-get-${e}`,()=>Rr({key:`query-builder-${e}`}),{revalidateOnMount:!0,revalidateIfStale:!1,revalidateOnFocus:!1});d.useEffect(()=>{s.data?n({...Z(),...s.data}):s.error&&n(Z())},[s.isLoading])}const Ct=["#C31D7E","#328536","#AA00FF","#C2410C","#047ABE","#E5231F","#007D85","#C51162","#7B5A90","#B85C00","#722ED1","#4D7C0F","#9F1239","#2D7D9A","#847545"];function Mn(e){return Ct[e%Ct.length]}function ge({children:e,onRemovePill:n}){return t.jsxs("div",{className:"flex items-center rounded-xs p-0.5 bg-muted group-data-[query-active=true]/query:bg-primary/25",children:[e,t.jsx(w,{iconOnly:!0,variant:"ghost",size:"sm",className:"mr-0.5 ml-1 py-0.5 enabled:hover:bg-transparent size-4",onClick:s=>{s.stopPropagation(),n()},children:t.jsx(Cn,{})})]})}ge.__docgenInfo={description:`Simple wrapper that:
- Add the blue background to highlight the query pill if it has been selected by the user
- Add the X button to remove query-pill

         ┌────────────────────────────┐
┌───────┌──────────────────────────────────────────┐─────────────────┐
| [] Q1 | Loremp Ipsum = [1,2, 3 >][X]      | 389K | [copy] [trash]  |
└───────└──────────────────────────────────────────┘─────────────────┘
         └────────────────────────────┘`,methods:[],displayName:"QueryPillContainer",props:{onRemovePill:{required:!0,tsType:{name:"signature",type:"function",raw:"() => void",signature:{arguments:[],return:{name:"void"}}},description:""}}};function ke({field:e,operator:n}){const{t:s,lazyTranslate:r}=P(),{labelsEnabled:a}=xe();return a?t.jsxs("div",{className:"flex items-center",children:[t.jsx("span",{className:"ml-1 mr-0.5 text-xs font-medium",children:s(`common.filters.labels.${e}`,{defaultValue:r(e)})}),t.jsx("span",{className:"ml-1 mr-0.5",children:n})]}):null}ke.__docgenInfo={description:`Label for a pill
@TODO: Change dictionary key from filters to facet

         ┌────────────┐                   ┌─────┐
┌───────┌───────────────────────────────────────────────────────────┐─────────────────┐
| [] Q1 | Loremp Ipsum = [1,2, 3 >][X] and Ipsum < 60[x]     | 389K | [copy] [trash]  |
└───────└───────────────────────────────────────────────────────────┘─────────────────┘
         └────────────┘                   └─────┘`,methods:[],displayName:"LabelOperator",props:{field:{required:!0,tsType:{name:"string"},description:""},operator:{required:!0,tsType:{name:"ReactNode"},description:""}}};function Ce({type:e,size:n,className:s}){switch(e){case E.GreaterThan:return t.jsx(bn,{size:n,className:s});case E.GreaterThanOrEqualTo:return t.jsx(hn,{size:n,className:s});case E.LessThan:return t.jsx(yn,{size:n,className:s});case E.LessThanOrEqualTo:return t.jsx(fn,{size:n,className:s});case E.Between:return t.jsx(gn,{size:n,className:s});case E.NotIn:return t.jsx(Xs,{size:n,className:s});default:return t.jsx(mn,{size:n,className:s})}}Ce.__docgenInfo={description:`Return to corresponding operator for the sqon

/**
Label for a pill
@TODO: Change dictionary key from filters to facet

                      ┌─┐                       ┌─┐
┌───────┌───────────────────────────────────────────────────────────┐─────────────────┐
| [] Q1 | Loremp Ipsum = [1,2, 3 >][X] and Ipsum < 60[x]     | 389K | [copy] [trash]  |
└───────└───────────────────────────────────────────────────────────┘─────────────────┘
                      └─┘                       └─┘`,methods:[],displayName:"Operator",props:{size:{required:!1,tsType:{name:"number"},description:""},type:{required:!1,tsType:{name:"union",raw:"SqonOpEnum | (string & {})",elements:[{name:"SqonOpEnum"},{name:"unknown"}]},description:""},className:{required:!1,tsType:{name:"string"},description:""}}};function lt({canExpand:e,className:n,classNameContent:s,children:r,clickable:a,...o}){return t.jsx("div",{className:fe("bg-background rounded-xs pl-2 text-xs font-medium leading-5 relative",e?"pr-[22px]":"pr-2",n),...o,children:t.jsx("div",{className:fe("flex flex-wrap items-center",a?"hover:shadow-[inset_0_-4px_0_-2.5px_black] hover:cursor-pointer":"",s),children:r})})}lt.__docgenInfo={description:`Visual container for QueryPillValues. Highlight with a white background

                        ┌─────────────┐
┌───────┌──────────────────────────────────────────┐─────────────────┐
| [] Q1 | Loremp Ipsum = [1,2, 3 >][X]      | 389K | [copy] [trash]  |
└───────└──────────────────────────────────────────┘─────────────────┘
                        └─────────────┘`,methods:[],displayName:"QueryPillValuesContainer",props:{canExpand:{required:!1,tsType:{name:"boolean"},description:""},clickable:{required:!1,tsType:{name:"boolean"},description:""},classNameContent:{required:!1,tsType:{name:"string"},description:""}}};const _t=3,Lr=",",Qr="&";function _e({sqon:e,...n}){const[s,r]=d.useState(!1),{t:a,sanitize:o,lazyTranslate:c}=P(),u=e.content.value.length>_t,l=s?e.content.value:Js(e.content.value,_t);return t.jsxs(lt,{canExpand:u,...n,children:[e.content.overrideValuesName?t.jsx("div",{children:t.jsx("span",{children:e.content.overrideValuesName})}):l.map((p,i)=>t.jsxs("div",{children:[t.jsx("span",{children:a(`common.filters.values.${e.content.field}.${o(p)}`,{defaultValue:c(p)})}),l.length-1>i&&t.jsx("span",{className:"px-1",children:e.op===E.All?Qr:Lr})]},`${p}-${i}`)),u&&t.jsx("div",{className:"absolute right-1 hover:cursor-pointer",children:s?t.jsx(Ws,{size:16,onClick:p=>{p.preventDefault(),r(!1)}}):t.jsx(Zs,{size:16,onClick:p=>{p.preventDefault(),r(!0)}})})]})}_e.__docgenInfo={description:`QueryPillValues display the selected values from the facets.
- Display the first 3 selected values
- Clicking on [>] or [ < ] change the expand state

                        ┌──────────┐
┌───────┌──────────────────────────────────────────┐─────────────────┐
| [] Q1 | Loremp Ipsum = [1,2, 3 >] [X]     | 389K | [copy] [trash]  |
└───────└──────────────────────────────────────────┘─────────────────┘
                        └──────────┘`,methods:[],displayName:"QueryPillValues",props:{sqon:{required:!0,tsType:{name:"IValueFacet"},description:""}}};function Dn({sqon:e}){const{aggregations:n}=D(),s=tt(n,e.content.field),r=z(),a=d.useCallback(()=>{r({type:T.REMOVE_FACET_PILL,payload:e})},[r,e]);return t.jsx(ge,{onRemovePill:a,children:t.jsxs("div",{className:"flex gap-2",children:[t.jsx(ke,{field:e.content.field,operator:t.jsx(Ce,{size:14,type:e.op})}),t.jsxs(Ve,{children:[t.jsx(Ge,{children:t.jsx(_e,{sqon:e})}),t.jsx(Ue,{align:"start",className:"p-2.5",children:t.jsx(it,{field:s,isOpen:!0})})]})]})})}Dn.__docgenInfo={description:`┌───────────────────┐
┌───────┌──────────────────────────────────────────┐─────────────────┐
| [] Q1 | Loremp Ipsum = true [X]     | 389K | [copy] [trash]  |
└───────└──────────────────────────────────────────┘─────────────────┘
         └───────────────────┘`,methods:[],displayName:"BooleanQueryPill",props:{sqon:{required:!0,tsType:{name:"IValueFacet"},description:""}}};function Pn({sqon:e}){const n=ur(),s=z(),r=n.findIndex(o=>o.id===e.id),a=d.useCallback(()=>{s({type:T.REMOVE_COMBINED_PILL,payload:e})},[s,e]);return t.jsx(ge,{onRemovePill:a,children:t.jsx("div",{className:"flex gap-2",style:{color:Mn(r)},children:t.jsxs(lt,{children:["Q",r+1]})})})}Pn.__docgenInfo={description:"",methods:[],displayName:"CombinedQueryPill",props:{sqon:{required:!0,tsType:{name:"ISyntheticSqon"},description:""}}};function Fn({sqon:e}){const{aggregations:n}=D(),s=tt(n,e.content.field),r=z(),a=d.useCallback(()=>{r({type:T.REMOVE_FACET_PILL,payload:e})},[r,e]);return t.jsx(ge,{onRemovePill:a,children:t.jsxs("div",{className:"flex gap-2",children:[t.jsx(ke,{field:e.content.field,operator:t.jsx(Ce,{size:14,type:e.op})}),t.jsxs(Ve,{children:[t.jsx(Ge,{children:t.jsx(_e,{sqon:e})}),t.jsx(Ue,{align:"start",className:"p-2.5",children:t.jsx(it,{field:s,isOpen:!0})})]})]})})}Fn.__docgenInfo={description:`┌────────────────────────┐
┌───────┌──────────────────────────────────────────┐─────────────────┐
| [] Q1 | Loremp Ipsum = [1,2, 3 >] [X]     | 389K | [copy] [trash]  |
└───────└──────────────────────────────────────────┘─────────────────┘
         └────────────────────────┘`,methods:[],displayName:"MultiSelectQueryPill",props:{sqon:{required:!0,tsType:{name:"IValueFacet"},description:""}}};function $n({sqon:e}){const{aggregations:n}=D(),s=tt(n,e.content.field),r=z(),a=d.useCallback(()=>{r({type:T.REMOVE_FACET_PILL,payload:e})},[r,e]);return t.jsx(ge,{onRemovePill:a,children:t.jsxs("div",{className:"flex gap-2",children:[t.jsx(ke,{field:e.content.field,operator:t.jsx(Ce,{size:14,type:e.op})}),t.jsxs(Ve,{children:[t.jsx(Ge,{children:t.jsx(_e,{sqon:e})}),t.jsx(Ue,{align:"start",className:"p-2.5",children:t.jsx(it,{field:s,isOpen:!0})})]})]})})}$n.__docgenInfo={description:`┌───────────────────┐
┌───────┌──────────────────────────────────────────┐─────────────────┐
| [] Q1 | Loremp Ipsum < 100  [X]     | 389K | [copy] [trash]  |
└───────└──────────────────────────────────────────┘─────────────────┘
         └───────────────────┘`,methods:[],displayName:"NumericalQueryPill",props:{sqon:{required:!0,tsType:{name:"IValueFacet"},description:""}}};function Vn({sqon:e}){const{t:n}=P(),s=z(),r=d.useCallback(a=>{a.stopPropagation(),s({type:T.CHANGE_COMBINER_OPERATOR,payload:{operator:e.op===G.And?G.Or:G.And}})},[s,e]);return t.jsx("div",{className:"px-2",children:t.jsxs(Me,{children:[t.jsx(De,{asChild:!0,children:t.jsx(w,{variant:"link",className:"text-current text-sm p-0 h-auto font-normal",onClick:r,children:n(`common.query_pill.operator.${e.op}`)})}),t.jsxs(Pe,{children:[n("common.query_pill.operator.change_operator_to"),e.op===G.And?n("common.query_pill.operator.or"):n("common.query_pill.operator.and")]})]})})}Vn.__docgenInfo={description:`Combiner is "and" or "or" operator that link every pill

                                      ┌───┐
┌───────┌───────────────────────────────────────────────────────────┐─────────────────┐
| [] Q1 | Loremp Ipsum = [1,2, 3 >][X] and Ipsum < 60[x]     | 389K | [copy] [trash]  |
└───────└───────────────────────────────────────────────────────────┘─────────────────┘
                                      └───┘`,methods:[],displayName:"CombinerOperator",props:{sqon:{required:!0,tsType:{name:"ISyntheticSqon"},description:""}}};function Gn({sqon:e}){const n=z(),s=d.useCallback(()=>{n({type:T.REMOVE_FACET_PILL,payload:e})},[n,e]);return t.jsx(ge,{onRemovePill:s,children:t.jsxs("div",{className:"flex gap-2",children:[t.jsx(ke,{field:e.content.field,operator:t.jsx(Ce,{size:14,type:e.op})}),t.jsx(_e,{sqon:e})]})})}Gn.__docgenInfo={description:`┌────────────────────────┐
┌───────┌──────────────────────────────────────────┐─────────────────┐
| [] Q1 | Loremp Ipsum = [1,2, 3 >] [X]     | 389K | [copy] [trash]  |
└───────└──────────────────────────────────────────┘─────────────────┘
         └────────────────────────┘`,methods:[],displayName:"SearchQueryPill",props:{sqon:{required:!0,tsType:{name:"IValueFacet"},description:""}}};const qr=en({base:"flex flex-1 py-2 px-3 border ",variants:{active:{true:["border-primary/75 bg-primary/10"],false:["border-muted-foreground/20 bg-muted/35 text-muted-foreground"]}},defaultVariants:{active:!1}});function Br(e,n){return ar(e)?t.jsx(Pn,{sqon:e}):lr(e,n)?t.jsx(Gn,{sqon:e}):ir(e)?t.jsx($n,{sqon:e}):or(e)?t.jsx(Dn,{sqon:e}):t.jsx(Fn,{sqon:e})}function Un({index:e,sqon:n}){var y;const{t:s}=P(),r=z(),a=pr(),{activeQueryId:o}=D(),{combinedQueries:c}=xe(),{fetcher:u}=D(),{selectedQueries:l}=xe(),p=En(),i=d.useMemo(()=>o===n.id,[o]),f=d.useMemo(()=>({"border-primary/75 bg-primary/10":i,"border-muted-foreground/20 bg-muted/35 text-muted-foreground":!i}),[i]),_=d.useMemo(()=>!i&&c[o]!==void 0&&Object.keys(c).includes(o)&&c[o].includes(n.id)?{backgroundColor:Mn(e)}:{},[o,i,c]),j=pe(`${JSON.stringify(n)}-count`,()=>u.count({countBody:{sqon:{content:n.content,op:n.op}}}),{revalidateOnFocus:!1,revalidateOnMount:!0,shouldRetryOnError:!1}),g=d.useCallback(()=>{i||r({type:T.SET_ACTIVE_QUERY,payload:{id:n.id}})},[r,i]),m=d.useCallback(x=>{r({type:T.SELECT_QUERY,payload:{uuid:n.id,isSelected:x}})},[r,n]),A=d.useCallback(x=>{x.stopPropagation(),r({type:T.DUPLICATE_QUERY,payload:n})},[r,n]),b=d.useCallback(x=>{x.stopPropagation(),r({type:T.REMOVE_QUERY,payload:n})},[r,n]);return t.jsxs("div",{className:"flex flex-1 group/query","data-query-active":i,onClick:g,children:[t.jsx("div",{className:fe("w-1 rounded-s-sm bg-muted-foreground",{"bg-primary":i}),style:_}),ut(n)&&t.jsx("div",{className:qr({active:i}),children:s("common.query_bar.empty")}),!ut(n)&&t.jsxs(t.Fragment,{children:[t.jsxs("div",{className:fe("flex gap-2 items-center py-4 px-4 border-l border-t border-b",f,{hidden:a<=1}),children:[t.jsx(Ks,{size:"sm",defaultChecked:!1,checked:l.includes(n.id),onCheckedChange:m}),t.jsx("span",{className:"text-xs font-medium",children:s("common.query_bar.selector",{index:e+1})})]}),t.jsxs("div",{className:fe("flex flex-1 justify-between py-3 px-3 border",f),children:[t.jsx("div",{className:"flex flex-1 flex-wrap max-h-[30vh]",children:n.content.map((x,Q)=>t.jsxs("div",{className:"flex mt-1",children:[Br(x,p),Q<n.content.length-1&&t.jsx(Vn,{sqon:n})]},Q))}),t.jsx("div",{className:"flex items-center gap-1",children:j.isLoading?t.jsx(Ys,{}):t.jsxs(t.Fragment,{children:[t.jsx(nn,{size:14}),t.jsx("span",{className:"font-medium",children:Cs(((y=j.data)==null?void 0:y.count)??0)})]})})]}),t.jsxs("div",{className:fe("flex items-center py-2 px-3 border-r border-t border-b",f),children:[t.jsx(w,{iconOnly:!0,variant:"ghost",size:"sm",onClick:A,children:t.jsx(ms,{})}),t.jsxs(Ve,{children:[t.jsx(Ge,{asChild:!0,children:t.jsx(w,{iconOnly:!0,variant:"ghost",size:"sm",children:t.jsx(er,{})})}),t.jsxs(Ue,{side:"left",className:"w-[200px] space-y-3",children:[t.jsx("div",{className:"text-sm",children:s("common.query_bar.delete_popover.title")}),t.jsxs("div",{className:"flex gap-1 justify-end",children:[t.jsx(xt,{asChild:!0,children:t.jsx(w,{size:"xs",variant:"outline",children:s("common.query_bar.delete_popover.cancel")})}),t.jsx(xt,{asChild:!0,children:t.jsx(w,{size:"xs",variant:"destructive",onClick:b,children:s("common.query_bar.delete_popover.ok")})})]})]})]})]})]})]})}Un.__docgenInfo={description:`Represent a single query.
A query is a combinaison of multiple sqon (multi-select, numerical, boolean etc.)

┌───────┌──────────────────────────────────────────┐─────────────────┐
| [] Q1 | Loremp Ipsum = [1,2, 3 >][X]      | 389K | [copy] [trash]  |
└───────└──────────────────────────────────────────┘─────────────────┘`,methods:[],displayName:"QueryBar",props:{index:{required:!0,tsType:{name:"number"},description:""},sqon:{required:!0,tsType:{name:"ISyntheticSqon"},description:""}}};function zn(){const{t:e}=P(),n=xe(),{sqons:s}=D(),{labelsEnabled:r}=xe(),a=z(),o=d.useCallback(()=>{a({type:T.ADD_QUERY})},[a]),c=d.useCallback(p=>function(){a({type:T.COMBINE_QUERIES,payload:p})},[a]),u=d.useCallback(p=>{a({type:T.SET_LABELS_ENABLED,payload:{labelsEnabled:p}})},[a]),l=d.useCallback(()=>{Yn.open({type:"warning",title:e("common.toolbar.clear_all_dialog.title"),description:e("common.toolbar.clear_all_dialog.description"),cancelProps:{children:e("common.toolbar.clear_all_dialog.cancel")},actionProps:{variant:"destructive",onClick:()=>{a({type:T.REMOVE_ALL_QUERIES})},children:e("common.toolbar.clear_all_dialog.ok")}})},[]);return t.jsx(Fe,{className:"py-0",children:t.jsx(kn,{type:"multiple",defaultValue:["query-builder"],children:t.jsxs(xn,{value:"query-builder",className:"border-none",children:[t.jsx(vn,{className:"border-b py-0 px-6 data-[state=closed]:rounded-sm data-[state=closed]:border-none hover:cursor-pointer",children:"TODO"}),t.jsxs(jn,{className:"py-4 px-6 space-y-4",children:[t.jsx("div",{className:"flex flex-col gap-2 max-h-[30vh] overflow-y-scroll",children:s.map((p,i)=>t.jsx(Un,{index:i,sqon:p},p.id))}),t.jsxs("div",{className:"flex items-center justify-between",children:[t.jsx("div",{className:"flex items-center gap-4",children:n.selectedQueries.length>1?t.jsx(t.Fragment,{children:t.jsx(cn,{size:"xs",actions:[{label:bt(e("common.query_pill.operator.and")),onClick:c(G.And)},{label:bt(e("common.query_pill.operator.or")),onClick:c(G.Or)}],onDefaultAction:c(G.And),children:e("common.toolbar.combine")})}):t.jsxs(t.Fragment,{children:[t.jsxs(w,{size:"xs",disabled:An(s),onClick:o,children:[t.jsx(Hs,{}),e("common.toolbar.new_query")]}),t.jsxs("div",{className:"flex items-center gap-1.5",children:[t.jsx(pn,{size:"xs",checked:r,onCheckedChange:u}),e("common.toolbar.labels")]})]})}),s.length>1&&t.jsx("div",{children:t.jsx(w,{variant:"ghost",size:"sm",className:"no-underline enabled:hover:no-underline",onClick:l,children:e("common.toolbar.clear_all")})})]})]})]})})})}zn.__docgenInfo={description:`Card that display all queries for query-builder

┌─────────────────────────────────────────────────────────────────────────┐
| Title                                                                   |
|─────────────────────────────────────────────────────────────────────────|
|  ┌───────┌──────────────────────────────────────────┐─────────────────┐ |
|  | [] Q1 | Loremp Ipsum = [1,2, 3 >][X]      | 389K | [copy] [trash]  | |
|  └───────└──────────────────────────────────────────┘─────────────────┘ |
|  ┌───────┌──────────────────────────────────────────┐─────────────────┐ |
|  | [] Q2 | Ipsum > 60 [X]                  | 389K | [copy] [trash]  | |
|  └───────└──────────────────────────────────────────┘─────────────────┘ |
|  [New Query] (*) Label                                                  |
└─────────────────────────────────────────────────────────────────────────┘`,methods:[],displayName:"QueriesBarCard"};function Hn({defaultSidebarOpen:e,aggregations:n}){return t.jsx("div",{className:"bg-muted w-full",children:t.jsxs("div",{className:"flex flex-1 h-screen overflow-hidden",children:[t.jsx("aside",{className:"w-auto min-w-fit h-full shrink-0",children:t.jsx("div",{className:"z-10",children:t.jsx(ln,{open:e,className:"h-full flex flex-row",children:t.jsx(sn,{variant:"sidebar",collapsible:"icon",className:"static! flex flex-col w-full bg-primary dark:bg-secondary ",children:t.jsx(rn,{children:t.jsxs(an,{children:[t.jsx(V,{className:"size-8 mb-1"}),t.jsx(on,{children:Object.keys(n).map(s=>t.jsx(V,{className:"size-8 w-full"},s))})]})})})})})}),t.jsx("main",{className:"flex-1 shrink px-3 pb-3 overflow-auto",children:t.jsx("div",{className:"py-3 space-y-2",children:t.jsx(Fe,{className:"py-0",children:t.jsxs("div",{className:"flex flex-col",children:[t.jsxs("div",{className:"py-4 px-6 flex justify-between",children:[t.jsxs("div",{className:"flex gap-4",children:[t.jsx(V,{className:"h-8 w-32"}),new Array(2).fill(0).map((s,r)=>t.jsx(V,{className:"size-8"},r))]}),t.jsxs("div",{className:"flex gap-2",children:[new Array(5).fill(0).map((s,r)=>t.jsx(V,{className:"size-8"},r)),t.jsx(V,{className:"h-8 w-36"})]})]}),t.jsx(un,{}),t.jsxs("div",{className:"flex flex-col py-4 gap-4",children:[t.jsxs("div",{className:"px-6 flex flex-col gap-2",children:[t.jsx(V,{className:"h-[50px] w-full"}),t.jsx(V,{className:"h-[50px] w-full"})]}),t.jsxs("div",{className:"px-6 flex gap-3",children:[t.jsx(V,{className:"h-7 w-26"}),t.jsx(V,{className:"h-7 w-16"})]})]})]})})})})]})})}Hn.__docgenInfo={description:"",methods:[],displayName:"QueryBuilderSkeleton",props:{aggregations:{required:!0,tsType:{name:"AggregationConfig"},description:""},defaultSidebarOpen:{required:!0,tsType:{name:"boolean"},description:""}}};function H({appId:e,defaultSidebarOpen:n=!1,fetcher:s,children:r}){const[a,o]=d.useState(n),u=rs()[e].aggregations,l=ss(u),[p,i]=d.useState(null),[f,_]=d.useState(),j=Er(e);return Tr({appId:e,setPreference:_}),f?t.jsx(Sn,{...f,aggregations:u,fetcher:s,children:t.jsx(On,{value:{appId:e,...j},children:t.jsx("div",{className:"bg-muted w-full",children:t.jsxs("div",{className:"flex flex-1 h-screen overflow-hidden",children:[t.jsx("aside",{className:"w-auto min-w-fit h-full shrink-0",children:t.jsxs(ln,{open:a,onOpenChange:o,className:"h-full flex flex-row",children:[t.jsx("div",{className:"z-10",children:t.jsx(wn,{aggregationGroups:l,selectedItemId:p,onItemSelect:i})}),t.jsx("div",{className:fe("overflow-auto mb-16 border-r transition-[width] duration-300 ease-in-out",{"w-[280px] p-4 opacity-100 relative":p,"w-0 opacity-0":!p}),children:t.jsxs("div",{className:"whitespace-nowrap",children:[t.jsx("div",{className:"flex justify-end mb-4",children:t.jsx("button",{onClick:()=>i(null),className:"text-muted-foreground hover:text-foreground",children:t.jsx(Cn,{size:16})})}),t.jsx(Bn,{aggregations:l,groupKey:p})]})})]})}),t.jsxs("main",{className:"flex-1 shrink px-3 pb-3 overflow-auto",children:[t.jsx("div",{className:"py-3 space-y-2",children:t.jsx(zn,{})}),r]})]})})})}):t.jsx(Hn,{defaultSidebarOpen:n,aggregations:u})}H.__docgenInfo={description:"Query-Builder (facets + query-bar)",methods:[],displayName:"QueryBuilder",props:{appId:{required:!0,tsType:{name:"ApplicationId"},description:""},children:{required:!0,tsType:{name:"ReactReactElement",raw:"React.ReactElement"},description:""},defaultSidebarOpen:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"false",computed:!1}},fetcher:{required:!0,tsType:{name:"IQBFetcher"},description:""}}};function Y({...e}){var f;const n=me(),{fetcher:s}=D(),[r,a]=d.useState([]),[o,c]=d.useState({pageIndex:0,pageSize:10}),[u,l]=d.useState([]),p=pe(`${JSON.stringify(n)}-list`,()=>s.list({listBody:{additional_fields:r,limit:o.pageSize,page_index:o.pageIndex,sort:u,sqon:{content:n.content,op:n.op}}}),{revalidateOnFocus:!1,revalidateOnMount:!0,shouldRetryOnError:!1}),i=pe(`${JSON.stringify(n)}-count`,()=>s.count({countBody:{sqon:{content:n.content,op:n.op}}}),{revalidateOnFocus:!1,revalidateOnMount:!0,shouldRetryOnError:!1});return t.jsx(Fe,{children:t.jsx(nt,{children:t.jsx(zs,{data:p.data??[],total:((f=i.data)==null?void 0:f.count)??0,loadingStates:{list:p.isLoading,total:i.isLoading},serverOptions:{setAdditionalFields:a,onSortingChange:l},pagination:{state:o,type:"server",onPaginationChange:c},...e})})})}Y.__docgenInfo={description:`Wrapper for data-table
Used to access QBContext and create list and count query`,methods:[],displayName:"QueryBuilderDataTable"};const oe="api/users/preferences/:key",X="api/mock/list",J="api/mock/count";function At(e,n){var c;const{op:s}=n,r=n.content.field,a=n.content.value,o=(c=e[r])==null?void 0:c.toString().toLowerCase();switch(s){case E.In:return a.includes(o);case E.And:return console.warn(`mock-api:filtercontent ${s} operator has not been coded; ${r} ${o} ${s} ${a}`),!0;case E.Or:return console.warn(`mock-api:filtercontent ${s} operator has not been coded; ${r} ${o} ${s} ${a}`),!0;case E.Not:return console.warn(`mock-api:filtercontent ${s} operator has not been coded; ${r} ${o} ${s} ${a}`),!0;case E.Between:return o?parseFloat(o)>parseFloat(a[0])&&parseFloat(o)<parseFloat(a[1]):!1;case E.GreaterThan:return o?parseFloat(o)>parseFloat(a[0]):!1;case E.LessThan:return o?parseFloat(o)<parseFloat(a[0]):!1;case E.GreaterThanOrEqualTo:return o?parseFloat(o)>=parseFloat(a[0]):!1;case E.LessThanOrEqualTo:return o?parseFloat(o)<=parseFloat(a[0]):!1;case E.NotIn:return!a.includes(o);case E.All:return console.warn(`mock-api:filtercontent ${s} operator has not been coded; ${r} ${o} ${s} ${a}`),!0}return!1}function Kn(e){return st.filter(n=>{switch(e.op){case E.Or:return e.content.map(r=>At(n,r)).includes(!0);default:return e.content.map(r=>At(n,r)).every(r=>r===!0)}})}async function ie({request:e}){var r;const s=(r=(await e.clone().json()).listBody)==null?void 0:r.sqon;return s&&s.content.length>0?O.json(Kn(s)):O.json(st)}async function le({request:e}){var r;const s=(r=(await e.clone().json()).countBody)==null?void 0:r.sqon;if(s&&s.content.length>0){const a=Kn(s);return O.json({count:a.length})}return O.json({count:st.length})}const{mocked:Nt}=__STORYBOOK_MODULE_TEST__,Mr={variant_entity:{app_id:M.variant_entity},snv_occurrence:{app_id:M.snv_occurrence,aggregations:{variant:{items:[{key:"firstName",translation_key:"multiple",type:v.MULTIPLE},{key:"lastName",translation_key:"multiple (with dictionary)",type:v.MULTIPLE},{key:"status",translation_key:"status (with dictionary)",type:v.MULTIPLE,withDictionary:!0},{key:"divider",translation_key:"Divider",type:v.DIVIDER},{key:"progress",translation_key:"numerical (decimal)",type:v.NUMERICAL,defaults:{min:0,max:100,defaultOperator:ue.LessThan,defaultMin:0,defaultMax:100,noDataInputOption:!0}},{key:"age",translation_key:"Age (integer)",type:v.NUMERICAL,defaults:{min:0,max:100,defaultOperator:ue.LessThan,defaultMin:0,defaultMax:100}},{key:"visits",translation_key:"Visits (integer)",type:v.NUMERICAL,defaults:{min:0,max:1e3,defaultOperator:ue.LessThan,defaultMin:0,defaultMax:1e3}},{key:"isActive",translation_key:"isActive (boolean)",type:v.BOOLEAN},{key:"search_by_symbol",translation_key:"search_by_symbol",type:v.SEARCH_BY},{key:"upload_list_symbol",translation_key:"upload",type:v.UPLOAD_LIST}]}}},cnv_occurrence:{app_id:M.cnv_occurrence,aggregations:{pathogenicity:{items:[{key:"firstName",translation_key:"multiple",type:v.MULTIPLE},{key:"lastName",translation_key:"multiple (with dictionary)",type:v.MULTIPLE},{key:"status",translation_key:"status (with dictionary)",type:v.MULTIPLE,withDictionary:!0},{key:"divider",translation_key:"Divider",type:v.DIVIDER},{key:"progress",translation_key:"numerical (decimal)",type:v.NUMERICAL,defaults:{min:0,max:100,defaultOperator:ue.LessThan,defaultMin:0,defaultMax:100}},{key:"age",translation_key:"Age (integer)",type:v.NUMERICAL,defaults:{min:0,max:100,defaultOperator:ue.LessThan,defaultMin:0,defaultMax:100}},{key:"visits",translation_key:"Visits (integer)",type:v.NUMERICAL,defaults:{min:0,max:1e3,defaultOperator:ue.LessThan,defaultMin:0,defaultMax:1e3}},{key:"isActive",translation_key:"isActive (boolean)",type:v.BOOLEAN}]},frequency:{items:[{key:"lastName",translation_key:"multiple (with dictionary)",type:v.MULTIPLE},{key:"progress",translation_key:"numerical (decimal)",type:v.NUMERICAL,defaults:{min:0,max:100,defaultOperator:ue.LessThan,defaultMin:0,defaultMax:100}},{key:"age",translation_key:"Age (integer)",type:v.NUMERICAL,defaults:{min:0,max:100,defaultOperator:ue.LessThan,defaultMin:0,defaultMax:100}},{key:"isActive",translation_key:"isActive (boolean)",type:v.BOOLEAN}]}}},admin:{admin_code:"admin",app_id:M.admin},portal:{name:"",navigation:{}}},so={title:"QueryBuilder/QueryBuilderV3",component:H,beforeEach:async()=>{Nt(ve).mockReturnValue(1),Nt(je).mockReturnValue(1)},args:{fetcher:{list:async e=>ct.post(X,{listBody:e.listBody}).then(n=>n.data),count:async e=>ct.post(J,{countBody:e.countBody}).then(n=>n.data)}},decorators:[e=>t.jsx(nr,{initialEntries:["/case/1?seq_id=1"],children:t.jsx(sr,{children:t.jsx(rr,{path:"/case/:caseId",element:t.jsx(as,{config:Mr,children:t.jsx(e,{})})})})})]},Ie={parameters:{msw:{handlers:[h.post(X,ie),h.post(J,le),h.post(ee,te),h.post(ne,se),h.get(oe,async()=>(await tr(1e4),new O(null,{status:403})))]}},args:{appId:M.snv_occurrence,children:t.jsx(t.Fragment,{}),defaultSidebarOpen:!0},render:e=>t.jsxs(t.Fragment,{children:[t.jsx("div",{className:"bold font-mono text-red",children:"Do a hard refresh to reset loading state"}),t.jsx(H,{appId:e.appId,defaultSidebarOpen:e.defaultSidebarOpen,fetcher:e.fetcher,children:t.jsx(Y,{id:"storybook-query-builder",columns:[...re,ae.accessor("isActive",{header:"Active"})],defaultColumnSettings:[]})})]})},Se={parameters:{msw:{handlers:[h.post(X,ie),h.post(J,le),h.post(ee,te),h.post(ne,se),h.get(oe,()=>new O(null,{status:404}))]}},args:{appId:M.cnv_occurrence,children:t.jsx(t.Fragment,{}),defaultSidebarOpen:!0},render:e=>t.jsx(H,{appId:e.appId,defaultSidebarOpen:e.defaultSidebarOpen,fetcher:e.fetcher,children:t.jsx(Y,{id:"storybook-query-builder",columns:[...re,ae.accessor("isActive",{header:"Active"})],defaultColumnSettings:[]})})},Ee={parameters:{msw:{handlers:[h.post(X,ie),h.post(J,le),h.post(ee,te),h.post(ne,se),h.get(oe,({params:e})=>e.key==="data-table-storybook-query-builder"?new O(null,{status:404}):O.json({...Z(),activeQueryId:"3593dbdf-44e7-49c9-934a-7b10db87b603",sqons:[{id:"3593dbdf-44e7-49c9-934a-7b10db87b603",content:[{content:{field:"firstName",value:["henry","jack","irene","liam","olivia","tanner"]},op:"in"},{content:{field:"lastName",value:["tremblay","anderson","young"]},op:"in"},{content:{field:"status",value:["single"]},op:"in"}],op:"and"}]}))]}},args:{appId:M.snv_occurrence,children:t.jsx(t.Fragment,{}),defaultSidebarOpen:!0},render:e=>t.jsx(H,{appId:e.appId,defaultSidebarOpen:e.defaultSidebarOpen,fetcher:e.fetcher,children:t.jsx(Y,{id:"storybook-query-builder",columns:[...re,ae.accessor("isActive",{header:"Active"})],defaultColumnSettings:[]})})},we={parameters:{msw:{handlers:[h.post(X,ie),h.post(J,le),h.post(ee,te),h.post(ne,se),h.get(oe,({params:e})=>e.key==="data-table-storybook-query-builder"?new O(null,{status:404}):O.json({...Z(),activeQueryId:"3593dbdf-44e7-49c9-934a-7b10db87b603",sqons:[{id:"3593dbdf-44e7-49c9-934a-7b10db87b603",content:[{content:{field:"isActive",value:["true"]},op:"in"}],op:"and"}]}))]}},args:{appId:M.snv_occurrence,children:t.jsx(t.Fragment,{}),defaultSidebarOpen:!0},render:e=>t.jsx(H,{appId:e.appId,defaultSidebarOpen:e.defaultSidebarOpen,fetcher:e.fetcher,children:t.jsx(Y,{id:"storybook-query-builder",columns:[...re,ae.accessor("isActive",{header:"Active"})],defaultColumnSettings:[]})})},Oe={parameters:{msw:{handlers:[h.post(X,ie),h.post(J,le),h.post(ee,te),h.post(ne,se),h.get(oe,({params:e})=>e.key==="data-table-storybook-query-builder"?new O(null,{status:404}):O.json({...Z(),activeQueryId:"3593dbdf-44e7-49c9-934a-7b10db87b603",sqons:[{id:"3593dbdf-44e7-49c9-934a-7b10db87b603",content:[{content:{field:"progress",value:["50"]},op:"<"},{content:{field:"visits",value:["1","100"]},op:"between"}],op:"and"}]}))]}},args:{appId:M.snv_occurrence,children:t.jsx(t.Fragment,{}),defaultSidebarOpen:!0},render:e=>t.jsx(H,{appId:e.appId,defaultSidebarOpen:e.defaultSidebarOpen,fetcher:e.fetcher,children:t.jsx(Y,{id:"storybook-query-builder",columns:[...re,ae.accessor("isActive",{header:"Active"})],defaultColumnSettings:[]})})},Re={parameters:{msw:{handlers:[h.post(X,ie),h.post(J,le),h.post(ee,te),h.post(ne,se),h.get(oe,({params:e})=>e.key==="data-table-storybook-query-builder"?new O(null,{status:404}):O.json({...Z(),activeQueryId:"3593dbdf-44e7-49c9-934a-7b10db87b605",sqons:[{id:"3593dbdf-44e7-49c9-934a-7b10db87b603",content:[{content:{field:"firstName",value:["jack","karen"]},op:"in"},{content:{field:"lastName",value:["tremblay"]},op:"in"}],op:"or"},{id:"3593dbdf-44e7-49c9-934a-7b10db87b605",content:[{content:{field:"firstName",value:["jack","karen"]},op:"in"},{content:{field:"lastName",value:["tremblay"]},op:"in"}],op:"and"},{id:"3593dbdf-44e7-49c9-934a-7b10db87b601",content:[{content:{field:"firstName",value:["liam","karen"]},op:"in"},{content:{field:"progress",value:["50"]},op:"<"},{content:{field:"visits",value:["1","100"]},op:"between"}],op:"or"},{id:"3593dbdf-44e7-49c9-934a-7b10db87b600",content:[{content:{field:"firstName",value:["henry","karen"]},op:"in"},{content:{field:"progress",value:["10"]},op:">"},{content:{field:"visits",value:["95"]},op:"<"},{content:{field:"isActive",value:["true"]},op:"in"}],op:"and"}]}))]}},args:{appId:M.snv_occurrence,children:t.jsx(t.Fragment,{}),defaultSidebarOpen:!0},render:e=>t.jsx(H,{appId:e.appId,defaultSidebarOpen:e.defaultSidebarOpen,fetcher:e.fetcher,children:t.jsx(Y,{id:"storybook-query-builder",columns:[...re,ae.accessor("isActive",{header:"Active"})],defaultColumnSettings:[]})})},Te={parameters:{msw:{handlers:[h.post(X,ie),h.post(J,le),h.post(ee,te),h.post(ne,se),h.get(oe,({params:e})=>e.key==="data-table-storybook-query-builder"?new O(null,{status:404}):O.json({...Z(),activeQueryId:"3593dbdf-44e7-49c9-934a-7b10db87b601",sqons:[{id:"3593dbdf-44e7-49c9-934a-7b10db87b601",content:[{content:{field:"firstName",value:["jack","karen"]},op:"in"},{content:{field:"lastName",value:["tremblay"]},op:"in"}],op:"or"},{id:"3593dbdf-44e7-49c9-934a-7b10db87b602",content:[{content:{field:"firstName",value:["jack","karen"]},op:"in"},{content:{field:"lastName",value:["tremblay"]},op:"in"},{content:{field:"progress",value:["50"]},op:"<"},{content:{field:"visits",value:["1","100"]},op:"between"}],op:"and"},{id:"3593dbdf-44e7-49c9-934a-7b10db87b603",content:[{content:{field:"firstName",value:["jack"]},op:"in"}],op:"or"},{id:"3593dbdf-44e7-49c9-934a-7b10db87b604",content:[{content:{field:"lastName",value:["miller"]},op:"in"}],op:"or"}]}))]}},args:{appId:M.snv_occurrence,children:t.jsx(t.Fragment,{}),defaultSidebarOpen:!0},render:e=>t.jsx(H,{appId:e.appId,defaultSidebarOpen:e.defaultSidebarOpen,fetcher:e.fetcher,children:t.jsx(Y,{id:"storybook-query-builder",columns:[...re,ae.accessor("isActive",{header:"Active"})],defaultColumnSettings:[]})})},Le={parameters:{msw:{handlers:[h.post(X,ie),h.post(J,le),h.post(ee,te),h.post(ne,se),h.get("*/genes/autocomplete",({request:e})=>{const s=new URL(e.url).searchParams.get("prefix")||"",r=[{name:"BRCA1",id:"ENSG00000012048"},{name:"BRCA2",id:"ENSG00000139618"},{name:"TP53",id:"ENSG00000141510"}];return O.json(r.filter(a=>a.name.toLowerCase().includes(s.toLowerCase())).map(a=>{const o=new RegExp(`(${s})`,"gi"),c=a.name.replace(o,"<strong>$1</strong>");return{source:{name:a.name,id:a.id},highlight:{name:c,id:a.id}}}))}),h.get(oe,({params:e})=>e.key==="data-table-storybook-query-builder"?new O(null,{status:404}):O.json({...Z(),activeQueryId:"3593dbdf-44e7-49c9-934a-7b10db87b603",sqons:[{id:"3593dbdf-44e7-49c9-934a-7b10db87b603",content:[{content:{field:"gene_symbol",value:["BRCA1","TP53"]},op:"in"}],op:"and"}]}))]}},args:{appId:M.snv_occurrence,children:t.jsx(t.Fragment,{}),defaultSidebarOpen:!0},render:e=>t.jsxs(t.Fragment,{children:[t.jsx("div",{className:"flex flex-col gap-2 p-4 mb-4 bg-muted rounded-lg",children:t.jsxs("div",{className:"font-mono text-sm",children:[t.jsx("strong",{children:"Test genes available:"})," BRCA1, BRCA2, TP53."]})}),t.jsx(H,{appId:e.appId,defaultSidebarOpen:e.defaultSidebarOpen,fetcher:e.fetcher,children:t.jsx(Y,{id:"storybook-query-builder",columns:[...re,ae.accessor("isActive",{header:"Active"})],defaultColumnSettings:[]})})]})},Qe={parameters:{msw:{handlers:[h.post(X,ie),h.post(J,le),h.post(ee,te),h.post(ne,se),h.get("*/genes/autocomplete",({request:e})=>{const s=new URL(e.url).searchParams.get("prefix")||"",r=[{name:"BRCA1",id:"ENSG00000012048"},{name:"BRCA2",id:"ENSG00000139618"},{name:"TP53",id:"ENSG00000141510"}];return O.json(r.filter(a=>a.name.toLowerCase().includes(s.toLowerCase())).map(a=>{const o=new RegExp(`(${s})`,"gi"),c=a.name.replace(o,"<strong>$1</strong>");return{source:{name:a.name,id:a.id},highlight:{name:c,id:a.id}}}))}),h.post("*/genes/search",async({request:e})=>{try{const s=(await e.json()).inputs||[],a=[{symbol:"BRCA1",ensembl_gene_id:"ENSG00000012048"},{symbol:"BRCA2",ensembl_gene_id:"ENSG00000139618"},{symbol:"TP53",ensembl_gene_id:"ENSG00000141510"},{symbol:"EGFR",ensembl_gene_id:"ENSG00000146648"},{symbol:"PTEN",ensembl_gene_id:"ENSG00000171862"},{symbol:"MYC",ensembl_gene_id:"ENSG00000136997"},{symbol:"KRAS",ensembl_gene_id:"ENSG00000133703"}].filter(o=>s.some(c=>o.symbol.toLowerCase()===c.toLowerCase()||o.ensembl_gene_id.toLowerCase()===c.toLowerCase()));return await new Promise(o=>setTimeout(o,300)),O.json(a)}catch(n){return console.error("🧬 Gene search error:",n),O.json([],{status:500})}}),h.get(oe,()=>new O(null,{status:404}))]}},args:{appId:M.snv_occurrence,children:t.jsx(t.Fragment,{}),defaultSidebarOpen:!0},render:e=>t.jsxs(t.Fragment,{children:[t.jsxs("div",{className:"flex flex-col gap-2 p-4 mb-4 bg-muted rounded-lg",children:[t.jsxs("div",{className:"font-mono text-sm",children:[t.jsx("strong",{children:"Test genes available:"})," BRCA1, BRCA2, TP53, EGFR, PTEN, MYC, KRAS."]}),t.jsx("div",{className:"text-sm text-muted-foreground",children:"Try uploading a text file with gene names/IDs or paste them in the textarea."})]}),t.jsx(H,{appId:e.appId,defaultSidebarOpen:e.defaultSidebarOpen,fetcher:e.fetcher,children:t.jsx(Y,{id:"storybook-query-builder",columns:[...re,ae.accessor("isActive",{header:"Active"})],defaultColumnSettings:[]})})]})};var It,St,Et;Ie.parameters={...Ie.parameters,docs:{...(It=Ie.parameters)==null?void 0:It.docs,source:{originalSource:`{
  parameters: {
    msw: {
      handlers: [http.post(mockListApi, httpMockListApiResponse), http.post(mockCountApi, httpMockCountApiResponse), http.post(occurrenceAggregateApi, httpOccurrenceAggregateApiResponse), http.post(occurrenceAggregateStatisticApi, httpOccurrenceAggregateStatisticsApiResponse), http.get(userPreferenceApi, async () => {
        await delay(10000);
        return new HttpResponse(null, {
          status: 403
        });
      })]
    }
  },
  args: {
    appId: ApplicationId.snv_occurrence,
    children: <></>,
    // unused
    defaultSidebarOpen: true
  },
  render: args => <>
      <div className="bold font-mono text-red">Do a hard refresh to reset loading state</div>
      <QueryBuilder appId={args.appId} defaultSidebarOpen={args.defaultSidebarOpen} fetcher={args.fetcher}>
        <QueryBuilderDataTable id="storybook-query-builder" columns={[...mockColumns, mockColumnHelper.accessor('isActive', {
        header: 'Active'
      })] as TableColumnDef<TableMockData, any>[]} defaultColumnSettings={[]} />
      </QueryBuilder>
    </>
}`,...(Et=(St=Ie.parameters)==null?void 0:St.docs)==null?void 0:Et.source}}};var wt,Ot,Rt;Se.parameters={...Se.parameters,docs:{...(wt=Se.parameters)==null?void 0:wt.docs,source:{originalSource:`{
  parameters: {
    msw: {
      handlers: [http.post(mockListApi, httpMockListApiResponse), http.post(mockCountApi, httpMockCountApiResponse), http.post(occurrenceAggregateApi, httpOccurrenceAggregateApiResponse), http.post(occurrenceAggregateStatisticApi, httpOccurrenceAggregateStatisticsApiResponse), http.get(userPreferenceApi, () => new HttpResponse(null, {
        status: 404
      }))]
    }
  },
  args: {
    appId: ApplicationId.cnv_occurrence,
    children: <></>,
    // unused
    defaultSidebarOpen: true
  },
  render: args => <QueryBuilder appId={args.appId} defaultSidebarOpen={args.defaultSidebarOpen} fetcher={args.fetcher}>
      <QueryBuilderDataTable id="storybook-query-builder" columns={[...mockColumns, mockColumnHelper.accessor('isActive', {
      header: 'Active'
    })] as TableColumnDef<TableMockData, any>[]} defaultColumnSettings={[]} />
    </QueryBuilder>
}`,...(Rt=(Ot=Se.parameters)==null?void 0:Ot.docs)==null?void 0:Rt.source}}};var Tt,Lt,Qt;Ee.parameters={...Ee.parameters,docs:{...(Tt=Ee.parameters)==null?void 0:Tt.docs,source:{originalSource:`{
  parameters: {
    msw: {
      handlers: [http.post(mockListApi, httpMockListApiResponse), http.post(mockCountApi, httpMockCountApiResponse), http.post(occurrenceAggregateApi, httpOccurrenceAggregateApiResponse), http.post(occurrenceAggregateStatisticApi, httpOccurrenceAggregateStatisticsApiResponse), http.get(userPreferenceApi, ({
        params
      }: any) => {
        const key = params.key;
        if (key === 'data-table-storybook-query-builder') {
          return new HttpResponse(null, {
            status: 404
          });
        }
        return HttpResponse.json({
          ...getDefaultQBContext(),
          activeQueryId: '3593dbdf-44e7-49c9-934a-7b10db87b603',
          sqons: [{
            id: '3593dbdf-44e7-49c9-934a-7b10db87b603',
            content: [{
              content: {
                field: 'firstName',
                value: ['henry', 'jack', 'irene', 'liam', 'olivia', 'tanner']
              },
              op: 'in'
            }, {
              content: {
                field: 'lastName',
                value: ['tremblay', 'anderson', 'young']
              },
              op: 'in'
            }, {
              content: {
                field: 'status',
                value: ['single']
              },
              op: 'in'
            }],
            op: 'and'
          }]
        });
      })]
    }
  },
  args: {
    appId: ApplicationId.snv_occurrence,
    children: <></>,
    // unused
    defaultSidebarOpen: true
  },
  render: args => <QueryBuilder appId={args.appId} defaultSidebarOpen={args.defaultSidebarOpen} fetcher={args.fetcher}>
      <QueryBuilderDataTable id="storybook-query-builder" columns={[...mockColumns, mockColumnHelper.accessor('isActive', {
      header: 'Active'
    })] as TableColumnDef<TableMockData, any>[]} defaultColumnSettings={[]} />
    </QueryBuilder>
}`,...(Qt=(Lt=Ee.parameters)==null?void 0:Lt.docs)==null?void 0:Qt.source}}};var qt,Bt,Mt;we.parameters={...we.parameters,docs:{...(qt=we.parameters)==null?void 0:qt.docs,source:{originalSource:`{
  parameters: {
    msw: {
      handlers: [http.post(mockListApi, httpMockListApiResponse), http.post(mockCountApi, httpMockCountApiResponse), http.post(occurrenceAggregateApi, httpOccurrenceAggregateApiResponse), http.post(occurrenceAggregateStatisticApi, httpOccurrenceAggregateStatisticsApiResponse), http.get(userPreferenceApi, ({
        params
      }: any) => {
        const key = params.key;
        if (key === 'data-table-storybook-query-builder') {
          return new HttpResponse(null, {
            status: 404
          });
        }
        return HttpResponse.json({
          ...getDefaultQBContext(),
          activeQueryId: '3593dbdf-44e7-49c9-934a-7b10db87b603',
          sqons: [{
            id: '3593dbdf-44e7-49c9-934a-7b10db87b603',
            content: [{
              content: {
                field: 'isActive',
                value: ['true']
              },
              op: 'in'
            }],
            op: 'and'
          }]
        });
      })]
    }
  },
  args: {
    appId: ApplicationId.snv_occurrence,
    children: <></>,
    // unused
    defaultSidebarOpen: true
  },
  render: args => <QueryBuilder appId={args.appId} defaultSidebarOpen={args.defaultSidebarOpen} fetcher={args.fetcher}>
      <QueryBuilderDataTable id="storybook-query-builder" columns={[...mockColumns, mockColumnHelper.accessor('isActive', {
      header: 'Active'
    })] as TableColumnDef<TableMockData, any>[]} defaultColumnSettings={[]} />
    </QueryBuilder>
}`,...(Mt=(Bt=we.parameters)==null?void 0:Bt.docs)==null?void 0:Mt.source}}};var Dt,Pt,Ft;Oe.parameters={...Oe.parameters,docs:{...(Dt=Oe.parameters)==null?void 0:Dt.docs,source:{originalSource:`{
  parameters: {
    msw: {
      handlers: [http.post(mockListApi, httpMockListApiResponse), http.post(mockCountApi, httpMockCountApiResponse), http.post(occurrenceAggregateApi, httpOccurrenceAggregateApiResponse), http.post(occurrenceAggregateStatisticApi, httpOccurrenceAggregateStatisticsApiResponse), http.get(userPreferenceApi, ({
        params
      }: any) => {
        const key = params.key;
        if (key === 'data-table-storybook-query-builder') {
          return new HttpResponse(null, {
            status: 404
          });
        }
        return HttpResponse.json({
          ...getDefaultQBContext(),
          activeQueryId: '3593dbdf-44e7-49c9-934a-7b10db87b603',
          sqons: [{
            id: '3593dbdf-44e7-49c9-934a-7b10db87b603',
            content: [{
              content: {
                field: 'progress',
                value: ['50']
              },
              op: '<'
            }, {
              content: {
                field: 'visits',
                value: ['1', '100']
              },
              op: 'between'
            }],
            op: 'and'
          }]
        });
      })]
    }
  },
  args: {
    appId: ApplicationId.snv_occurrence,
    children: <></>,
    // unused
    defaultSidebarOpen: true
  },
  render: args => <QueryBuilder appId={args.appId} defaultSidebarOpen={args.defaultSidebarOpen} fetcher={args.fetcher}>
      <QueryBuilderDataTable id="storybook-query-builder" columns={[...mockColumns, mockColumnHelper.accessor('isActive', {
      header: 'Active'
    })] as TableColumnDef<TableMockData, any>[]} defaultColumnSettings={[]} />
    </QueryBuilder>
}`,...(Ft=(Pt=Oe.parameters)==null?void 0:Pt.docs)==null?void 0:Ft.source}}};var $t,Vt,Gt;Re.parameters={...Re.parameters,docs:{...($t=Re.parameters)==null?void 0:$t.docs,source:{originalSource:`{
  parameters: {
    msw: {
      handlers: [http.post(mockListApi, httpMockListApiResponse), http.post(mockCountApi, httpMockCountApiResponse), http.post(occurrenceAggregateApi, httpOccurrenceAggregateApiResponse), http.post(occurrenceAggregateStatisticApi, httpOccurrenceAggregateStatisticsApiResponse), http.get(userPreferenceApi, ({
        params
      }: any) => {
        const key = params.key;
        if (key === 'data-table-storybook-query-builder') {
          return new HttpResponse(null, {
            status: 404
          });
        }
        return HttpResponse.json({
          ...getDefaultQBContext(),
          activeQueryId: '3593dbdf-44e7-49c9-934a-7b10db87b605',
          sqons: [{
            id: '3593dbdf-44e7-49c9-934a-7b10db87b603',
            content: [{
              content: {
                field: 'firstName',
                value: ['jack', 'karen']
              },
              op: 'in'
            }, {
              content: {
                field: 'lastName',
                value: ['tremblay']
              },
              op: 'in'
            }],
            op: 'or'
          }, {
            id: '3593dbdf-44e7-49c9-934a-7b10db87b605',
            content: [{
              content: {
                field: 'firstName',
                value: ['jack', 'karen']
              },
              op: 'in'
            }, {
              content: {
                field: 'lastName',
                value: ['tremblay']
              },
              op: 'in'
            }],
            op: 'and'
          }, {
            id: '3593dbdf-44e7-49c9-934a-7b10db87b601',
            content: [{
              content: {
                field: 'firstName',
                value: ['liam', 'karen']
              },
              op: 'in'
            }, {
              content: {
                field: 'progress',
                value: ['50']
              },
              op: '<'
            }, {
              content: {
                field: 'visits',
                value: ['1', '100']
              },
              op: 'between'
            }],
            op: 'or'
          }, {
            id: '3593dbdf-44e7-49c9-934a-7b10db87b600',
            content: [{
              content: {
                field: 'firstName',
                value: ['henry', 'karen']
              },
              op: 'in'
            }, {
              content: {
                field: 'progress',
                value: ['10']
              },
              op: '>'
            }, {
              content: {
                field: 'visits',
                value: ['95']
              },
              op: '<'
            }, {
              content: {
                field: 'isActive',
                value: ['true']
              },
              op: 'in'
            }],
            op: 'and'
          }]
        });
      })]
    }
  },
  args: {
    appId: ApplicationId.snv_occurrence,
    children: <></>,
    // unused
    defaultSidebarOpen: true
  },
  render: args => <QueryBuilder appId={args.appId} defaultSidebarOpen={args.defaultSidebarOpen} fetcher={args.fetcher}>
      <QueryBuilderDataTable id="storybook-query-builder" columns={[...mockColumns, mockColumnHelper.accessor('isActive', {
      header: 'Active'
    })] as TableColumnDef<TableMockData, any>[]} defaultColumnSettings={[]} />
    </QueryBuilder>
}`,...(Gt=(Vt=Re.parameters)==null?void 0:Vt.docs)==null?void 0:Gt.source}}};var Ut,zt,Ht;Te.parameters={...Te.parameters,docs:{...(Ut=Te.parameters)==null?void 0:Ut.docs,source:{originalSource:`{
  parameters: {
    msw: {
      handlers: [http.post(mockListApi, httpMockListApiResponse), http.post(mockCountApi, httpMockCountApiResponse), http.post(occurrenceAggregateApi, httpOccurrenceAggregateApiResponse), http.post(occurrenceAggregateStatisticApi, httpOccurrenceAggregateStatisticsApiResponse), http.get(userPreferenceApi, ({
        params
      }: any) => {
        const key = params.key;
        if (key === 'data-table-storybook-query-builder') {
          return new HttpResponse(null, {
            status: 404
          });
        }
        return HttpResponse.json({
          ...getDefaultQBContext(),
          activeQueryId: '3593dbdf-44e7-49c9-934a-7b10db87b601',
          sqons: [{
            id: '3593dbdf-44e7-49c9-934a-7b10db87b601',
            content: [{
              content: {
                field: 'firstName',
                value: ['jack', 'karen']
              },
              op: 'in'
            }, {
              content: {
                field: 'lastName',
                value: ['tremblay']
              },
              op: 'in'
            }],
            op: 'or'
          }, {
            id: '3593dbdf-44e7-49c9-934a-7b10db87b602',
            content: [{
              content: {
                field: 'firstName',
                value: ['jack', 'karen']
              },
              op: 'in'
            }, {
              content: {
                field: 'lastName',
                value: ['tremblay']
              },
              op: 'in'
            }, {
              content: {
                field: 'progress',
                value: ['50']
              },
              op: '<'
            }, {
              content: {
                field: 'visits',
                value: ['1', '100']
              },
              op: 'between'
            }],
            op: 'and'
          }, {
            id: '3593dbdf-44e7-49c9-934a-7b10db87b603',
            content: [{
              content: {
                field: 'firstName',
                value: ['jack']
              },
              op: 'in'
            }],
            op: 'or'
          }, {
            id: '3593dbdf-44e7-49c9-934a-7b10db87b604',
            content: [{
              content: {
                field: 'lastName',
                value: ['miller']
              },
              op: 'in'
            }],
            op: 'or'
          }]
        });
      })]
    }
  },
  args: {
    appId: ApplicationId.snv_occurrence,
    children: <></>,
    // unused
    defaultSidebarOpen: true
  },
  render: args => <QueryBuilder appId={args.appId} defaultSidebarOpen={args.defaultSidebarOpen} fetcher={args.fetcher}>
      <QueryBuilderDataTable id="storybook-query-builder" columns={[...mockColumns, mockColumnHelper.accessor('isActive', {
      header: 'Active'
    })] as TableColumnDef<TableMockData, any>[]} defaultColumnSettings={[]} />
    </QueryBuilder>
}`,...(Ht=(zt=Te.parameters)==null?void 0:zt.docs)==null?void 0:Ht.source}}};var Kt,Yt,Xt;Le.parameters={...Le.parameters,docs:{...(Kt=Le.parameters)==null?void 0:Kt.docs,source:{originalSource:`{
  parameters: {
    msw: {
      handlers: [http.post(mockListApi, httpMockListApiResponse), http.post(mockCountApi, httpMockCountApiResponse), http.post(occurrenceAggregateApi, httpOccurrenceAggregateApiResponse), http.post(occurrenceAggregateStatisticApi, httpOccurrenceAggregateStatisticsApiResponse),
      // Mock for gene autoComplete API
      http.get('*/genes/autocomplete', ({
        request
      }) => {
        const url = new URL(request.url);
        const prefix = url.searchParams.get('prefix') || '';
        const genes = [{
          name: 'BRCA1',
          id: 'ENSG00000012048'
        }, {
          name: 'BRCA2',
          id: 'ENSG00000139618'
        }, {
          name: 'TP53',
          id: 'ENSG00000141510'
        }];
        return HttpResponse.json(genes.filter(gene => gene.name.toLowerCase().includes(prefix.toLowerCase())).map(gene => {
          const nameRegex = new RegExp(\`(\${prefix})\`, 'gi');
          const highlightedName = gene.name.replace(nameRegex, '<strong>$1</strong>');
          return {
            source: {
              name: gene.name,
              id: gene.id
            },
            highlight: {
              name: highlightedName,
              id: gene.id
            }
          };
        }));
      }), http.get(userPreferenceApi, ({
        params
      }: any) => {
        const key = params.key;
        if (key === 'data-table-storybook-query-builder') {
          return new HttpResponse(null, {
            status: 404
          });
        }
        return HttpResponse.json({
          ...getDefaultQBContext(),
          activeQueryId: '3593dbdf-44e7-49c9-934a-7b10db87b603',
          sqons: [{
            id: '3593dbdf-44e7-49c9-934a-7b10db87b603',
            content: [{
              content: {
                field: 'gene_symbol',
                value: ['BRCA1', 'TP53']
              },
              op: 'in'
            }],
            op: 'and'
          }]
        });
      })]
    }
  },
  args: {
    appId: ApplicationId.snv_occurrence,
    children: <></>,
    // unused
    defaultSidebarOpen: true
  },
  render: args => <>
      <div className="flex flex-col gap-2 p-4 mb-4 bg-muted rounded-lg">
        <div className="font-mono text-sm">
          <strong>Test genes available:</strong> BRCA1, BRCA2, TP53.
        </div>
      </div>
      <QueryBuilder appId={args.appId} defaultSidebarOpen={args.defaultSidebarOpen} fetcher={args.fetcher}>
        <QueryBuilderDataTable id="storybook-query-builder" columns={[...mockColumns, mockColumnHelper.accessor('isActive', {
        header: 'Active'
      })] as TableColumnDef<TableMockData, any>[]} defaultColumnSettings={[]} />
      </QueryBuilder>
    </>
}`,...(Xt=(Yt=Le.parameters)==null?void 0:Yt.docs)==null?void 0:Xt.source}}};var Jt,Wt,Zt;Qe.parameters={...Qe.parameters,docs:{...(Jt=Qe.parameters)==null?void 0:Jt.docs,source:{originalSource:`{
  parameters: {
    msw: {
      handlers: [http.post(mockListApi, httpMockListApiResponse), http.post(mockCountApi, httpMockCountApiResponse), http.post(occurrenceAggregateApi, httpOccurrenceAggregateApiResponse), http.post(occurrenceAggregateStatisticApi, httpOccurrenceAggregateStatisticsApiResponse),
      // Mock for gene autoComplete API
      http.get('*/genes/autocomplete', ({
        request
      }) => {
        const url = new URL(request.url);
        const prefix = url.searchParams.get('prefix') || '';
        const genes = [{
          name: 'BRCA1',
          id: 'ENSG00000012048'
        }, {
          name: 'BRCA2',
          id: 'ENSG00000139618'
        }, {
          name: 'TP53',
          id: 'ENSG00000141510'
        }];
        return HttpResponse.json(genes.filter(gene => gene.name.toLowerCase().includes(prefix.toLowerCase())).map(gene => {
          const nameRegex = new RegExp(\`(\${prefix})\`, 'gi');
          const highlightedName = gene.name.replace(nameRegex, '<strong>$1</strong>');
          return {
            source: {
              name: gene.name,
              id: gene.id
            },
            highlight: {
              name: highlightedName,
              id: gene.id
            }
          };
        }));
      }),
      // Mock for gene search API (used by upload modal)
      http.post('*/genes/search', async ({
        request
      }) => {
        try {
          const body = (await request.json()) as any;
          const inputs = body.inputs || [];
          const geneDatabase = [{
            symbol: 'BRCA1',
            ensembl_gene_id: 'ENSG00000012048'
          }, {
            symbol: 'BRCA2',
            ensembl_gene_id: 'ENSG00000139618'
          }, {
            symbol: 'TP53',
            ensembl_gene_id: 'ENSG00000141510'
          }, {
            symbol: 'EGFR',
            ensembl_gene_id: 'ENSG00000146648'
          }, {
            symbol: 'PTEN',
            ensembl_gene_id: 'ENSG00000171862'
          }, {
            symbol: 'MYC',
            ensembl_gene_id: 'ENSG00000136997'
          }, {
            symbol: 'KRAS',
            ensembl_gene_id: 'ENSG00000133703'
          }];
          const results = geneDatabase.filter(gene => inputs.some((input: string) => gene.symbol.toLowerCase() === input.toLowerCase() || gene.ensembl_gene_id.toLowerCase() === input.toLowerCase()));

          // Simulate API delay
          await new Promise(resolve => setTimeout(resolve, 300));
          return HttpResponse.json(results);
        } catch (error) {
          console.error('🧬 Gene search error:', error);
          return HttpResponse.json([], {
            status: 500
          });
        }
      }), http.get(userPreferenceApi, () => new HttpResponse(null, {
        status: 404
      }))]
    }
  },
  args: {
    appId: ApplicationId.snv_occurrence,
    children: <></>,
    // unused
    defaultSidebarOpen: true
  },
  render: args => <>
      <div className="flex flex-col gap-2 p-4 mb-4 bg-muted rounded-lg">
        <div className="font-mono text-sm">
          <strong>Test genes available:</strong> BRCA1, BRCA2, TP53, EGFR, PTEN, MYC, KRAS.
        </div>
        <div className="text-sm text-muted-foreground">
          Try uploading a text file with gene names/IDs or paste them in the textarea.
        </div>
      </div>
      <QueryBuilder appId={args.appId} defaultSidebarOpen={args.defaultSidebarOpen} fetcher={args.fetcher}>
        <QueryBuilderDataTable id="storybook-query-builder" columns={[...mockColumns, mockColumnHelper.accessor('isActive', {
        header: 'Active'
      })] as TableColumnDef<TableMockData, any>[]} defaultColumnSettings={[]} />
      </QueryBuilder>
    </>
}`,...(Zt=(Wt=Qe.parameters)==null?void 0:Wt.docs)==null?void 0:Zt.source}}};const ro=["Loading","Default","Multiselect","Boolean","Numerical","MultiQueries","CombinedQueries","SearchFacet","UploadIdModal"];export{we as Boolean,Te as CombinedQueries,Se as Default,Ie as Loading,Re as MultiQueries,Ee as Multiselect,Oe as Numerical,Le as SearchFacet,Qe as UploadIdModal,ro as __namedExportsOrder,so as default};
