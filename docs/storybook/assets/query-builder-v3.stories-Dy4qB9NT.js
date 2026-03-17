import{r as i,j as t,b as _e,d as Ce,f as kn,e as Ne,K as z,a6 as jn,c as te,a as An}from"./iframe-fuMeGN55.js";import{a as nt}from"./index-D-Epa_If.js";import{H as Q,h as b}from"./index-DYijPhoE.js";import{B as In,U as _n,O as Cn,F as Nn,P as Sn,G as On,V as Lt,D as En}from"./variant-icon-DIugknsD.js";import{B as C,a as wn}from"./button-Bxfmps2v.js";import{a as Tn,S as qt,c as Rt,d as Qt,e as Mt,f as Ln,g as qn,m as Ft}from"./sidebar-BFzBXaEP.js";import{u as L}from"./i18n-Cn9hqjYo.js";import{P as Rn,a as Qn}from"./panel-left-open-CXSW6_oN.js";import{T as Mn,f as Fn,p as st,U as Bn}from"./upload-id-modal-Nm_Km-Ac.js";import{S as x}from"./api-D1Ry_Ajg.js";import{L as He}from"./label-BdGlUDYs.js";import{R as Dn,a as Pn}from"./radio-group-jmupYzAd.js";import{v as P,c as Bt,q as rt}from"./query-builder-remote-CfB3_55J.js";import{A as B,F as y,u as $n,C as Vn}from"./applications-config-BpCe7aBJ.js";import{F as at}from"./isEqual-B11CO0E2.js";import{A as zn}from"./action-button-CNAnyKFq.js";import{C as Un}from"./checkbox-filter-B8lBjKd-.js";import{d as Ke,e as Dt,C as Se,a as Gn}from"./card-dzknaivw.js";import{I as Ae}from"./input-DF-R96mC.js";import{S as Pt}from"./separator-C8lzm_Mx.js";import{S as q}from"./skeleton-DT8uST8g.js";import{S as $t}from"./switch-DZHQ3p_G.js";import{t as ze,n as Hn}from"./number-format-D2EqLugV.js";import{S as Kn}from"./search-ChAK_YYo.js";import{a as Vt,c as zt,b as Ut,E as Gt,L as Ht,G as Kt}from"./less-than-or-equal-operator-icon-bfw6QXJV.js";import{S as Xn,a as Yn,b as Jn,c as Wn,d as Zn}from"./select-C84aEJgH.js";import{u as es,A as Xt,a as Yt,b as Jt,c as Wt}from"./accordion-CGBvAXmN.js";import{M as ts}from"./multi-selector-Du7v86YY.js";import{g as ot,o as Oe,j as ns,D as ss}from"./data-table-D4Ic3NJT.js";import{u as H}from"./index-D9AoZZ8d.js";import{_ as fe,a as he}from"./helper-CjJ9duZX.js";import{C as rs}from"./checkbox-Bx6WekYY.js";import{P as Ee,a as we,b as Te,c as it}from"./popover-CmbyYw3G.js";import{S as as}from"./spinner-t153YvZZ.js";import{X as Zt}from"./x-BEXx6cPD.js";import{N as os}from"./not-in-operator-icon-C1z6thdt.js";import{t as is}from"./take-c30uS6n-.js";import{C as ls}from"./chevron-left-Bs4tZVRy.js";import{C as cs}from"./chevron-right-BZxUF79M.js";import{T as ds}from"./trash-DOMQ-l3G.js";import{P as us}from"./_baseSlice-CitXmmkP.js";import{R as G}from"./sqon-Cj0d6dh3.js";import{o as ne,h as se,a as re,b as ae}from"./api-occurrence-DGm-M6d_.js";import{a as Xe,m as oe,b as ie}from"./table-mock-t2F2C3tP.js";import{M as ps,R as ms,a as fs}from"./chunk-EPOLDU6W-DRaBYFCa.js";import{d as hs}from"./delay-B4qYmvjT.js";import"./preload-helper-Dp1pzeXC.js";import"./index-xXWWjBr5.js";import"./check-BpVxTnN5.js";import"./index-CtEfIZQb.js";import"./sheet-CGYiUb76.js";import"./dialog-D9ONOdKW.js";import"./circle-Dx5yjyGq.js";import"./index-BcsYj1sj.js";import"./useDebounce-BgdGUDaA.js";import"./collapsible-card-_Y1GS-oc.js";import"./index-CjGqCjdo.js";import"./collapsible-BDL0I6gI.js";import"./chevron-up-ChnCxzkN.js";import"./chevron-down-Bkx4zkbn.js";import"./display-table-lxRDPTXX.js";import"./empty-Dky7KzRE.js";import"./hover-card-C-NHn6-I.js";import"./index-DjgIQjmx.js";import"./dropdown-menu-BWOWLXa_.js";import"./command-B53TF4nW.js";import"./badge-MAGeI3OO.js";import"./settings-C7rlt2oM.js";import"./pagination-DESz_q3Y.js";import"./ellipsis-hsH_jro1.js";import"./index-DFYN2R7l.js";import"./chunk-WWGJGFF6-C8M8FGbq.js";import"./toString-gmzxEJNG.js";import"./empty-cell-fZARQKRk.js";const ys={organization:En,variant:Lt,gene:On,pathogenicity:Sn,frequency:Nn,occurrence:Cn,parental_analysis:_n,metric_qc:In},lt=kn({base:"text-secondary dark:text-foreground",variants:{selected:{true:"bg-sidebar-brand-accent text-sidebar-brand-accent-foreground"}},defaultVariants:{selected:!1}});function en({onItemSelect:e,aggregationGroups:n,selectedItemId:s}){const{t:r}=L(),{open:a,toggleSidebar:o}=Tn(),[c,d]=i.useState(null),h=s!==void 0?s:c,p=l=>{const f=h===l?null:l;d(f),e&&e(f)};return t.jsx(qt,{variant:"sidebar",collapsible:"icon",className:"static! flex flex-col w-full bg-primary dark:bg-secondary ",children:t.jsx(Rt,{children:t.jsxs(Qt,{children:[t.jsxs(_e,{children:[t.jsx(Ce,{asChild:!0,children:t.jsx(C,{iconOnly:!0,onClick:()=>o(),className:lt({className:"mb-1 hover:bg-sidebar-brand-accent hover:text-sidebar-brand-accent-foreground"}),size:"sm",variant:"ghost",children:a?t.jsx(Rn,{}):t.jsx(Qn,{})})}),t.jsx(Ne,{side:"right",align:"center",children:r(a?"query_filters.sidebar_panel.collapse":"query_filters.sidebar_panel.expand")})]}),t.jsx(Mt,{children:Object.entries(n).map(([l])=>{const f=ys[l],_=r(`query_filters.sidebar_panel.filters.${l}`);return t.jsx(Ln,{children:t.jsx(qn,{asChild:!0,className:lt({selected:h===l}),onClick:A=>{A.preventDefault(),p(l)},tooltip:_,children:t.jsxs("div",{children:[t.jsx(f,{}),t.jsx("span",{children:_})]})})},l)})})]})})})}en.__docgenInfo={description:"",methods:[],displayName:"SidebarGroups",props:{onItemSelect:{required:!1,tsType:{name:"signature",type:"function",raw:"(itemId: string | null) => void",signature:{arguments:[{type:{name:"union",raw:"string | null",elements:[{name:"string"},{name:"null"}]},name:"itemId"}],return:{name:"void"}}},description:""},selectedItemId:{required:!1,tsType:{name:"union",raw:"string | null",elements:[{name:"string"},{name:"null"}]},description:""},aggregationGroups:{required:!0,tsType:{name:"AggregationConfig"},description:""}}};const R={GreaterThan:x.GreaterThan,LessThan:x.LessThan,Between:x.Between,GreaterThanOrEqualTo:x.GreaterThanOrEqualTo,LessThanOrEqualTo:x.LessThanOrEqualTo,In:x.In},$e={In:x.In,NotIn:x.NotIn},$={And:x.And,Or:x.Or};function gs(e){return e.content.value.every(n=>["false","true"].includes(n.toString().toLowerCase()))}function xs(e){return e.op===R.In?!1:e.op in R}function ct(e,n){if(typeof e=="object"&&e!==null&&"content"in e){const s=e.content;if("field"in s)return s.field===n}return!1}function bs(){return{content:[],op:$.And,id:P()}}function Ue(e){return e.content.length===0}function vs(e){return e.length===1?Ue(e[0]):!1}var T=(e=>(e.ADD_QUERY="add-query",e.REMOVE_QUERY="remove-query",e.DUPLICATE_QUERY="duplicate-query",e.SET_ACTIVE_QUERY="set-active-query",e.ADD_OR_UPDATE_FACET_PILL="add-or-update-facet-pill",e.REMOVE_FACET_PILL="remove-facet-pill",e.CHANGE_COMBINER_OPERATOR="change-combiner-operator",e.SET_LABELS_ENABLED="set-labels-enabled",e.REMOVE_ALL_QUERIES="remove-all-queries-all",e))(T||{});function Ge(){const e=P();return{aggregations:{},activeQueryId:e,sqons:[{content:[],id:e,op:$.And}],fetcher:{list:n=>(console.error(`fetcher.list has not been set: ${n}`),Promise.resolve([])),count:n=>(console.error(`fetcher.count has not been set: ${n}`),Promise.resolve({count:0}))},history:{type:"empty",target:"",uuid:e},settings:{labelsEnabled:!0}}}const tn=i.createContext(Ge()),nn=i.createContext(()=>{console.warn("QueryBuilderDispatchContext has been initialized without any dispatch props")});function ks(e,n){switch(n.type){case"add-query":{const s=P();return{...e,activeQueryId:s,sqons:[...e.sqons,{content:[],id:s,op:$.And}]}}case"duplicate-query":{const s=P(),{sqons:r}=e;return r.push({...n.payload,id:s}),{...e,sqons:[...r],activeQueryId:s}}case"remove-query":{const{activeQueryId:s}=e,{sqons:r}=e,a=r.findIndex(o=>o.id===n.payload.id);if(r.splice(a,1),r.length===0){const o=P();return{...e,activeQueryId:o,sqons:[{content:[],id:o,op:$.And}]}}return a<r.length?{...e,activeQueryId:n.payload.id===s?r[a].id:s,sqons:[...r]}:{...e,activeQueryId:n.payload.id===s?r[a-1].id:s,sqons:[...r]}}case"set-active-query":return{...e,activeQueryId:n.payload.id};case"remove-all-queries-all":{const s=P();return{...e,activeQueryId:s,sqons:[{content:[],id:s,op:$.And}]}}case"add-or-update-facet-pill":{const{activeQueryId:s}=e,{sqons:r}=e,a=r.findIndex(d=>d.id===s);if(a<0)return r.push({id:s,content:[n.payload],op:$.And}),{...e,sqons:[...r],history:n.payload.content.field};const o=n.payload.content.field,c=r[a].content.findIndex(d=>ct(d,o));return c<0?(r[a].content=[...r[a].content,n.payload],{...e,sqons:[...r],history:{uuid:P(),type:"add",target:o}}):n.payload.content.value.length>0?(r[a].content[c]=n.payload,{...e,sqons:Bt(r),history:{uuid:P(),type:"update",target:o}}):(r[a].content.splice(c,1),{...e,sqons:[...r],history:{uuid:P(),type:"update",target:o}})}case"remove-facet-pill":{const{activeQueryId:s}=e,{sqons:r}=e,a=r.findIndex(d=>d.id===s);if(a<0)throw Error(`Cannot remove pill from an undefined active query: ${n.type} ${s} ${n.payload}`);const o=n.payload.content.field,c=r[a].content.findIndex(d=>ct(d,o));return r[a].content.splice(c,1),{...e,sqons:[...r],history:{uuid:P(),type:"remove",target:o}}}case"change-combiner-operator":{const{activeQueryId:s}=e,{sqons:r}=e,a=r.findIndex(o=>o.id===s);if(a<0)throw Error(`ActiveQueryId does not exist in sqons: ${n.type} ${s} ${n.payload}`);return r[a].op=n.payload.operator,{...e}}case"set-labels-enabled":return{...e,settings:{labelsEnabled:n.payload.labelsEnabled}};default:throw Error(`Unknown action: ${n.type} ${JSON.stringify(n.payload)}`)}}function sn({children:e,...n}){const[s,r]=i.useReducer(ks,n);return t.jsx(tn,{value:s,children:t.jsx(nn,{value:r,children:e})})}function D(){return i.useContext(tn)}function U(){return i.useContext(nn)}function X(){const{activeQueryId:e,sqons:n}=D();return n.find(s=>s.id===e)??bs()}function js(){const{aggregations:e}=D();return e}function As(e){var r;const n=js();return(r=Object.values(n).flatMap(a=>a.items).find(a=>a.key===e))==null?void 0:r.defaults}function Le(){const e=X();return{content:e.content,op:e.op}}function Ye(){const{history:e}=D();return e}function rn(){const{settings:e}=D();return e}function Is(e){const n=X();if(n.content.length===0)return[];const s=n.content.findIndex(r=>typeof r=="object"&&r!==null&&"content"in r&&"field"in r.content&&r.content.field===e);return n.content[s]?n.content[s].content.value:[]}function _s(e){const n=X();if(n.content.length===0)return null;const s=n.content.findIndex(r=>typeof r=="object"&&r!==null&&"content"in r&&"field"in r.content&&r.content.field===e);return n.content[s]?n.content[s].content.value[0]:null}function Cs(e){const n=X();if(n.content.length===0)return;const s=n.content.findIndex(r=>typeof r=="object"&&r!==null&&"content"in r&&"field"in r.content&&r.content.field===e);if(n.content[s])return n.content[s]}sn.__docgenInfo={description:"",methods:[],displayName:"QBProvider",props:{aggregations:{required:!0,tsType:{name:"AggregationConfig"},description:""},sqons:{required:!0,tsType:{name:"Array",elements:[{name:"ISyntheticSqon"}],raw:"ISyntheticSqon[]"},description:""},activeQueryId:{required:!0,tsType:{name:"string"},description:""},fetcher:{required:!0,tsType:{name:"IQBFetcher"},description:""},history:{required:!0,tsType:{name:"IHistory"},description:""},settings:{required:!0,tsType:{name:"ISettings"},description:""},children:{required:!0,tsType:{name:"ReactReactElement",raw:"React.ReactElement"},description:""}}};const an=i.createContext({appId:B.snv_occurrence,builderFetcher:e=>{},statisticFetcher:e=>{}});function me(){const e=i.useContext(an);if(!e)throw new Error("useFilterConfig must be used within a FilterConfigProvider");return e}function Je({field:e}){const{t:n}=L(),{builderFetcher:s}=me(),{activeQueryId:r}=D(),a=U(),o=Ye(),{data:c}=s({field:e.key}),d=_s(e.key),[h,p]=i.useState(c??[]),[l,f]=i.useState(d),_=i.useCallback(m=>{m.key!==l&&m.key!==void 0&&(f(m.key??null),a({type:T.ADD_OR_UPDATE_FACET_PILL,payload:{content:{field:e.key,value:[m.key]},op:x.In}}))},[l]),A=i.useCallback(m=>l===m.key,[l]),u=i.useCallback(()=>{a({type:T.REMOVE_FACET_PILL,payload:{content:{field:e.key,value:[l]},op:x.In}}),f(null)},[l]);return i.useEffect(()=>{c&&p(c)},[c]),i.useEffect(()=>{o.target==e.key&&d!==l&&f(d)},[o.uuid]),i.useEffect(()=>{d!==l&&f(d)},[r]),t.jsxs("div",{className:"p-2 w-full max-w-md",children:[t.jsx(Dn,{children:h.map(m=>t.jsx("div",{className:"space-y-3 pt-2",children:t.jsxs("div",{className:"flex justify-between items-center",children:[t.jsxs("div",{className:"flex items-center space-x-2",children:[t.jsx(Pn,{value:m.key||"",id:m.key,checked:A(m),onClick:()=>{_(m)}}),t.jsx(He,{htmlFor:m.key,children:m.key})]}),t.jsx("span",{className:"bg-accent px-2 py-1 rounded-md font-mono text-xs",children:m.count})]})},m.key))}),l!==null&&t.jsxs(t.Fragment,{children:[t.jsx("hr",{className:"my-4 border-border"}),t.jsx("div",{className:"flex align-right justify-end items-center space-x-2",children:t.jsx(C,{onClick:u,size:"xs",children:n("common.filters.buttons.clear")})})]})]})}Je.__docgenInfo={description:"@TODO: https://d3b.atlassian.net/browse/SJRA-1241 update aggregate empty check when task is done",methods:[],displayName:"BooleanFacet",props:{field:{required:!0,tsType:{name:"AggregationConfig"},description:""}}};function on(e,n){return`facet-${e}-${n}-dictionary`}function Ns({appId:e,field:n,isDictionaryEnabled:s}){const r=on(e,n),a=localStorage.getItem(r);if(!a){console.warn(`${r} doesn't exist in locale storage; a new entry is being created; isDictionaryEnabled: ${s}`),localStorage.setItem(r,s.toString());return}const o=JSON.parse(a);console.warn(`${r} exist in locale storage: isDictionaryEnabled: ${o}`),s!==o&&(console.warn(`${r} has been updated: isDictionaryEnabled: ${o}`),localStorage.setItem(r,s.toString()))}function Ss({appId:e,field:n}){const s=on(e,n),r=localStorage.getItem(s);if(!r)return!1;const a=JSON.parse(r);return console.warn(`${s} exist in locale storage: isDictionaryEnabled: ${a}`),a}function Os(e,n){const s=e.toLowerCase().split(/\s+/).filter(Boolean);return n.filter(r=>{const a=r.key.toLowerCase(),o=r.label.toLowerCase();function c(d,h){let p=0;for(const l of h){const f=d.indexOf(l,p);if(f===-1)return!1;p=f+l.length}return!0}return c(a,s)||c(o,s)})}function Ve(e,n){return n<e?n:e}function Es(e){return(n,s)=>{const r=n.key&&e.includes(n.key),a=s.key&&e.includes(s.key);return r===a?s.count-n.count:r?-1:1}}function We({field:e,maxVisibleItems:n=5}){const{t:s,sanitize:r,lazyTranslate:a}=L(),{appId:o,builderFetcher:c}=me(),d=U(),[h,p]=i.useState(Ss({appId:o,field:e.key})),{data:l,isLoading:f}=c({field:e.key,withDictionary:h}),_=Ye(),{activeQueryId:A}=D(),u=Is(e.key),m=i.useMemo(()=>(l??[]).map(w=>({...w,label:s(`common.filters.values.${w.key}.${r(w.key)}`,{defaultValue:a(w.key)})})).sort(Es(u)),[l,u]),[g,v]=i.useState(m),[j,S]=i.useState(u),[M,O]=i.useState(Ve((l??[]).length,n)),F=i.useCallback(I=>{if(!I.trim()){v(l),O(Ve(l.length,n));return}const w=Os(I,l);v(w),n>w.length?O(w.length):w.length>n&&O(n)},[n,l]),N=i.useCallback(()=>{const I=!h;p(I),Ns({appId:o,field:e.key,isDictionaryEnabled:I})},[h]),Fe=i.useCallback(()=>{O(g.length)},[g]),ue=i.useCallback(()=>{O(n)},[n]),pe=i.useCallback(()=>{j.length!==g.length&&S(g.map(I=>I.key))},[g,j]),Z=i.useCallback(()=>{S([])},[e.key]),ee=i.useCallback(()=>{j.length!==0&&Z()},[j,Z]),Be=I=>{if(j.includes(I.key??"")){S(j.filter(w=>w!==I.key));return}S([...j,I.key])},De=i.useCallback(()=>{Z()},[Z]),V=i.useCallback(I=>{d({type:T.ADD_OR_UPDATE_FACET_PILL,payload:{content:{field:e.key,value:[...j]},op:I}})},[j,o,e.key]),k=i.useCallback(()=>{V($e.In)},[V]),E=i.useCallback(()=>{V($e.NotIn)},[V]),Pe=i.useCallback(()=>{V($e.In)},[V]);return i.useEffect(()=>{f||(v(m),O(Ve((l??[]).length,n)))},[f,l]),i.useEffect(()=>{_.target==e.key&&(v(m),at(u,j)||S(u))},[_.uuid]),i.useEffect(()=>{v(m),at(u,j)||S(u)},[A]),t.jsxs(t.Fragment,{children:[t.jsxs(Ke,{size:"sm",variant:"outline",children:[t.jsx(Ae,{startIcon:Kn,size:"xs",type:"text",placeholder:s("common.filters.search.placeholder"),className:"w-full text-xs mt-3 py-1.5 px-3 mb-4 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500",onChange:I=>F(I.target.value),autoFocus:!0}),t.jsxs("div",{className:"flex gap-2 items-center",children:[t.jsx(C,{size:"xs",onClick:()=>pe(),variant:"link",className:"px-0",children:s("common.filters.buttons.all")}),t.jsx(Pt,{orientation:"vertical",className:"h-4"}),t.jsx(C,{size:"xs",onClick:()=>ee(),variant:"link",className:"px-0",children:s("common.filters.buttons.none")}),e.withDictionary&&t.jsxs(t.Fragment,{children:[t.jsx("div",{className:"grow"}),t.jsx(He,{htmlFor:"with-dictionary-switch",className:"text-xs",children:s("common.filters.with_dictionary")}),t.jsx($t,{id:"with-dictionary-switch",checked:h,size:"xs",onCheckedChange:N})]})]}),t.jsxs("div",{className:"max-h-[250px] overflow-auto",children:[f&&Array.from({length:3},(I,w)=>t.jsxs("div",{className:"flex justify-between items-center py-2 space-x-2",children:[t.jsx(q,{className:"w-full h-6 rounded"}),t.jsx(q,{className:"h-6 w-12 rounded-md"})]},`skeleton-${w}`)),!f&&g.length===0&&t.jsx("div",{className:"text-muted-foreground py-4",children:s("common.filters.no_values_found")}),!f&&g.length>0&&g.slice(0,M).map(I=>t.jsx("div",{className:"gap-3 py-1.5",children:t.jsx(Un,{size:"xs",label:I.label,checked:j.some(w=>w===I.key),count:I.count,onCheckedChange:()=>Be(I)})},I.key))]}),!f&&g.length>M&&t.jsx(C,{className:"mt-2 px-0",onClick:Fe,size:"xs",variant:"link",children:s("common.filters.buttons.show_more",{value:ze(g.length-M)})}),!f&&M>n&&t.jsx(C,{className:"mt-2 px-0",onClick:ue,size:"xs",variant:"link",children:s("common.filters.buttons.show_less")})]}),t.jsx(Dt,{size:"sm",children:t.jsxs("div",{className:"flex align-right justify-end items-center space-x-2",children:[t.jsx(C,{size:"xxs",variant:"ghost",onClick:De,disabled:j.length===0||f,children:s("common.filters.buttons.clear")}),t.jsx("div",{className:"flex space-x-2",children:t.jsx(zn,{size:"xxs",variant:"outline",className:"h-7",color:"primary",actions:[{label:s("common.filters.buttons.some_not_in"),onClick:Pe},{label:s("common.filters.buttons.not_in"),onClick:E}],onDefaultAction:k,disabled:f,children:s("common.filters.buttons.apply")})})]})})]})}We.__docgenInfo={description:`Multi select facet
- Allow to select multi string value
@TODO: https://d3b.atlassian.net/browse/SJRA-1241 update aggregate empty check when task is done`,methods:[],displayName:"MultiSelectFacet",props:{field:{required:!0,tsType:{name:"AggregationConfig"},description:""},maxVisibleItems:{required:!1,tsType:{name:"number"},description:"",defaultValue:{value:"5",computed:!1}}}};const ws="integer";function Ts(e,n){return e.intervalDecimal!==void 0&&e.max!==void 0&&e.min!==void 0?!0:n!=null&&n.min!==void 0&&n.max!==void 0}function ln(e){return!e||e===ws?0:3}function ye({sqon:e,config:n,statistics:s}){let r=(n==null?void 0:n.defaultOperator)??R.LessThan,a="0",o="0",c="";const d=ln(s==null?void 0:s.type);return e?(e.content.value.length===2?(r=R.Between,a=Number(Number(e.content.value[0]).toFixed(d)).toLocaleString(z.language),o=Number(Number(e.content.value[1]).toFixed(d)).toLocaleString(z.language)):c=Number(e.content.value[0]).toLocaleString(z.language),e.op&&(r=e.op),{selectedRange:r,minValue:a,maxValue:o,numericalValue:c}):((s==null?void 0:s.min)!==void 0?(a=Number(s.min.toFixed(d)).toLocaleString(z.language),c=Number(s.min.toFixed(d)).toLocaleString(z.language)):n.defaultMin!==void 0&&(a=n.defaultMin.toLocaleString(z.language),c=n.defaultMin.toLocaleString(z.language)),(s==null?void 0:s.max)!==void 0?o=Number(s.max.toFixed(d)).toLocaleString(z.language):n.defaultMax!==void 0&&(o=n.defaultMax.toLocaleString(z.language)),n.defaultOperator&&(r=n.defaultOperator),{selectedRange:r,minValue:a,maxValue:o,numericalValue:c})}function Ls({isLoading:e,field:n,min:s,max:r,decimal:a}){const{t:o}=L();if(e)return t.jsxs("div",{className:"flex mb-2",children:[t.jsx(q,{className:"h-5 w-16 mr-1"}),t.jsx(q,{className:"h-5 w-32"})]});const c={minimumFractionDigits:a,maximumFractionDigits:a};return t.jsx("div",{id:`${n}_interval`,className:"mb-1",children:t.jsx(Mn,{size:"xs",children:o("common.filters.labels.actual_interval",{min:s!==void 0?ze(s,c):void 0,max:r!==void 0?ze(r,c):void 0})})})}function Ze({field:e}){var V;const{t:n}=L(),{activeQueryId:s}=D(),r=U(),a=Ye(),{appId:o}=me(),{statisticFetcher:c}=me(),d=X(),h=Cs(e.key),p=i.useMemo(()=>({[R.GreaterThan]:{display:n("common.filters.operators.greater_than"),dropdown:n("common.filters.operators.greater_than"),icon:Kt},[R.LessThan]:{display:n("common.filters.operators.less_than"),dropdown:n("common.filters.operators.less_than"),icon:Ht},[R.Between]:{display:n("common.filters.operators.between"),dropdown:n("common.filters.operators.between"),icon:Gt},[R.GreaterThanOrEqualTo]:{display:n("common.filters.operators.greater_than_or_equal"),dropdown:n("common.filters.operators.greater_than_or_equal"),icon:Ut},[R.LessThanOrEqualTo]:{display:n("common.filters.operators.less_than_or_equal"),dropdown:n("common.filters.operators.less_than_or_equal"),icon:zt},[R.In]:{display:n("common.filters.operators.in"),dropdown:n("common.filters.operators.in"),icon:Vt}}),[]),{data:l,isLoading:f}=c({field:e.key}),_=ln(l==null?void 0:l.type),[A,u]=i.useState(R.GreaterThan),[m,g]=i.useState("0"),[v,j]=i.useState("0"),[S,M]=i.useState("0"),[O,F]=i.useState(h===void 0),N=As(e.key),Fe=Ts(N,l),ue=(N==null?void 0:N.min)??(l==null?void 0:l.min)??0,pe=(N==null?void 0:N.max)??(l==null?void 0:l.max)??100,Z=i.useCallback(k=>{u(k),F(!1)},[]),ee=i.useCallback(k=>{M(k.minValue),j(k.maxValue),u(k.selectedRange),g(k.numericalValue)},[]),Be=()=>{const k=ye({sqon:void 0,config:N,statistics:l});F(!0),ee(k)},De=i.useCallback(()=>{F(!0);let k=[];A===R.Between?k=[parseFloat(S.toString()),parseFloat(v.toString())]:k=[parseFloat(m.toString())],r({type:T.ADD_OR_UPDATE_FACET_PILL,payload:{content:{field:e.key,value:k},op:A}})},[o,e.key,A,m,S,v]);return i.useEffect(()=>{if(!(d!=null&&d.content))return;const k=ye({sqon:h,config:N,statistics:l});ee(k)},[h,d,N,l]),i.useEffect(()=>{if(a.target==e.key){const k=ye({sqon:h,config:N,statistics:l});ee(k)}},[a.uuid]),i.useEffect(()=>{const k=ye({sqon:h,config:N,statistics:l});ee(k)},[s]),t.jsxs(t.Fragment,{children:[t.jsx(Ke,{id:`${e.key}_container`,size:"sm",variant:"outline",children:t.jsx("div",{className:"pt-2",children:t.jsxs("div",{className:"flex flex-col gap-3",children:[t.jsx("div",{id:`${e.key}_operator`,children:t.jsxs(Xn,{value:A,onValueChange:Z,children:[t.jsx(Yn,{size:"sm",children:t.jsx(Jn,{placeholder:n("common.filters.operators.select_operator"),children:((V=p[A])==null?void 0:V.display)||n("common.filters.operators.unknown")})}),t.jsx(Wn,{children:Object.entries(R).map(([k,E])=>{const Pe=p[E].icon;return t.jsx(Zn,{value:E,children:t.jsxs("div",{className:"flex items-center gap-2",children:[t.jsx(Pe,{size:16}),t.jsx("span",{children:p[E].dropdown})]})},E)})})]})}),A===R.Between?t.jsxs("div",{className:"flex gap-2 flex-row",children:[t.jsx(Ae,{size:"xs",className:"w-half",value:S,onChange:k=>{const E=k.target.value;isNaN(Number(E))||(M(E),F(!1))},min:ue,max:pe,id:`${e.key}_min`,"data-testid":`${e.key}_min`}),t.jsx(Ae,{size:"xs",className:"w-half",value:v,onChange:k=>{const E=k.target.value;isNaN(Number(E))||(j(E),F(!1))},min:ue,max:pe,id:`${e.key}_max`,"data-testid":`${e.key}_max`})]}):t.jsx(Ae,{size:"xs",className:"w-full",value:m,onChange:k=>{const E=k.target.value;isNaN(Number(E))||(g(E),F(!1))},min:ue,max:pe,id:`${e.key}_value`,"data-testid":`${e.key}_value`}),Fe&&t.jsx(Ls,{isLoading:f,field:e.key,min:l==null?void 0:l.min,max:l==null?void 0:l.max,decimal:_})]})})}),t.jsx(Dt,{size:"sm",children:t.jsxs("div",{className:"flex align-right justify-end items-center space-x-2",children:[t.jsx(C,{size:"xxs",variant:"ghost",onClick:Be,disabled:O,id:`${e.key}_clear`,children:n("common.filters.buttons.clear")}),t.jsx("div",{className:"flex space-x-2",children:t.jsx(C,{size:"xxs",variant:"outline",onClick:De,id:`${e.key}_apply`,children:n("common.filters.buttons.apply")})})]})})]})}Ze.__docgenInfo={description:`Numerical facet
-Use statistics API for dynamic min/max values
-Configurable decimal precision and intervals
-Unit selection for range types
-"No data" option for missing values
-Decimal is set to 3 by default (integer will be 0)

@TODO: https://d3b.atlassian.net/browse/SJRA-1241 update aggregate empty check when task is done
@TODO: no data has been removed since none of the facet needs it at the moment`,methods:[],displayName:"NumericalFacet",props:{field:{required:!0,tsType:{name:"AggregationConfig"},description:""}}};function Ie({field:e,children:n}){const{t:s}=L(),{history:r}=es(),a=s(`common.filters.labels.${e.translation_key}`,{defaultValue:e.key});let o=null;if(Fn.includes(e.key)){const d=`common.filters.labels.${e.translation_key}_tooltip`;o=s(d)===d?null:s(d)}function c(){return t.jsx("div",{className:"flex items-center justify-between w-full text-xs",children:t.jsx("span",{children:a})})}return t.jsx(Se,{size:"sm",children:t.jsxs(Xt,{value:e.key,className:"border-none",children:[t.jsx(Gn,{size:"sm",children:t.jsx(Yt,{children:o?t.jsxs(_e,{children:[t.jsx(Ce,{asChild:!0,children:t.jsx("span",{children:c()})}),t.jsx(Ne,{children:t.jsx("span",{children:o})})]}):c()})}),t.jsx(Jt,{className:"pb-0",forceMount:r.includes(e.key)?!0:void 0,children:n})]},e.key)})}function et({field:e}){const{t:n}=L();let s;switch(e.type){case y.MULTIPLE:s=t.jsx(We,{field:e});break;case y.NUMERICAL:s=t.jsx(Ze,{field:e});break;case y.BOOLEAN:s=t.jsx(Je,{field:e});break;default:s=t.jsx("div",{children:n("common.filters.unsupported_type",{type:e.type})})}return s}function cn({field:e,isOpen:n}){const{t:s}=L(),r=e.type;if(r===y.DIVIDER)return t.jsx("h4",{className:"px-2 h-8 text-sidebar-foreground/70 text-xs font-medium line-height-xs text-ellipsis overflow-hidden flex justify-between items-center",children:s(`common.filters.${e.key}`)});let a;switch(r){case y.MULTIPLE:a=t.jsx(Ie,{field:e,isOpen:n,children:t.jsx(We,{field:e})});break;case y.NUMERICAL:a=t.jsx(Ie,{field:e,isOpen:n,children:t.jsx(Ze,{field:e})});break;case y.BOOLEAN:a=t.jsx(Ie,{field:e,isOpen:n,children:t.jsx(Je,{field:e})});break;default:a=t.jsx("div",{children:s("common.filters.unsupported_type",{type:e.type})})}return a}Ie.__docgenInfo={description:"",methods:[],displayName:"AccordionContainer",props:{field:{required:!0,tsType:{name:"AggregationConfig"},description:""},isOpen:{required:!0,tsType:{name:"boolean"},description:""},searchHandler:{required:!1,tsType:{name:"signature",type:"function",raw:"(_e: React.MouseEvent<SVGElement, MouseEvent>) => void",signature:{arguments:[{type:{name:"ReactMouseEvent",raw:"React.MouseEvent<SVGElement, MouseEvent>",elements:[{name:"SVGElement"},{name:"MouseEvent"}]},name:"_e"}],return:{name:"void"}}},description:""},children:{required:!1,tsType:{name:"ReactReactNode",raw:"React.ReactNode"},description:""}}};cn.__docgenInfo={description:"To be use when the facet needs to be inside an Accordion component",methods:[],displayName:"FacetContainer",props:{field:{required:!0,tsType:{name:"AggregationConfig"},description:""},isOpen:{required:!0,tsType:{name:"boolean"},description:""},searchHandler:{required:!1,tsType:{name:"signature",type:"function",raw:"(_e: React.MouseEvent<SVGElement, MouseEvent>) => void",signature:{arguments:[{type:{name:"ReactMouseEvent",raw:"React.MouseEvent<SVGElement, MouseEvent>",elements:[{name:"SVGElement"},{name:"MouseEvent"}]},name:"_e"}],return:{name:"void"}}},description:""}}};const qs=2;function dn({search:e}){const{t:n}=L(),{appId:s}=me(),{translation_key:r,key:a}=e,o=a.replace(/search_by_/g,""),[c,d]=i.useState([]),[h,p]=i.useState([]),[l,f]=i.useState(null);i.useEffect(()=>{var v;const u=rt.getResolvedActiveQuery(s);if(JSON.stringify(u)===JSON.stringify(l))return;const m=u.content.find(j=>"content"in j&&"field"in j.content?j.content.field===o:!1),g=((v=m==null?void 0:m.content)==null?void 0:v.value)||[];Array.isArray(g)&&d(g),f(u)},[s,o,rt.getActiveQuery(s)]),i.useEffect(()=>{(async()=>{if(c.length===0){p([]);return}if(c.length>qs){const m=c.map(g=>({value:g,label:g,badgeLabel:g}));p(m);return}try{const m=c.map(async v=>{var j,S;try{const O=(await ot.geneAutoComplete(v)).data.find(F=>{var N;return((N=F.source)==null?void 0:N.name)===v});if(O)return{value:v,label:t.jsxs("div",{className:"flex flex-col gap-0.5",children:[t.jsx("span",{className:"text-sm text-foreground",children:((j=O.source)==null?void 0:j.name)||v}),t.jsx("span",{className:"text-xs text-muted-foreground",children:((S=O.source)==null?void 0:S.id)||""})]}),badgeLabel:v}}catch(M){console.error(`Error fetching gene ${v}:`,M)}return{value:v,label:v,badgeLabel:v}}),g=await Promise.all(m);p(g)}catch(m){console.error("Error fetching gene details:",m);const g=c.map(v=>({value:v,label:v,badgeLabel:v}));p(g)}})()},[c]);const _=async u=>{if(!u)return[];try{return(await ot.geneAutoComplete(u)).data.map(g=>{var v,j,S,M,O,F;return{value:((v=g.source)==null?void 0:v.name)||"",label:t.jsxs("div",{className:"flex flex-col gap-0.5",children:[t.jsx("span",{className:"text-sm text-foreground",children:st(((j=g.highlight)==null?void 0:j.name)||((S=g.source)==null?void 0:S.name)||"")}),t.jsx("span",{className:"text-xs text-muted-foreground",children:st(((M=g.highlight)==null?void 0:M.id)||((O=g.source)==null?void 0:O.id)||"")})]}),badgeLabel:((F=g.source)==null?void 0:F.name)||""}})}catch(m){return console.error("Error fetching genes:",m),[]}},A=u=>{d(u)};return t.jsxs("div",{className:"flex flex-col gap-2 ",children:[t.jsxs("div",{className:"flex items-center gap-2",children:[t.jsx(He,{children:n(`common.filters.labels.${r}`)}),t.jsxs(_e,{children:[t.jsx(Ce,{asChild:!0,children:t.jsx(jn,{size:16})}),t.jsx(Ne,{children:n(`common.filters.labels.${r}_tooltip`)})]})]}),t.jsx(ts,{value:c,defaultOptions:h,onChange:A,onSearch:_,placeholder:n(`common.filters.labels.${r}_placeholder`),className:"w-full",debounceDelay:300,maxSelected:100,hidePlaceholderWhenSelected:!0})]})}dn.__docgenInfo={description:"",methods:[],displayName:"SearchFacet",props:{search:{required:!0,tsType:{name:"AggregationConfig"},description:""}}};function un({groupKey:e,aggregations:n}){var A;const{t:s}=L(),[r,a]=i.useState(!1),[o,c]=i.useState([]),[d,h]=i.useState(e),p=e?((A=n[e])==null?void 0:A.items)||[]:Object.values(n).flatMap(u=>u.items),l=p.filter(u=>u.type===y.SEARCH_BY),f=p.filter(u=>u.type===y.UPLOAD_LIST),_=p.filter(u=>u.type!==y.SEARCH_BY&&u.type!==y.UPLOAD_LIST);return i.useEffect(()=>{a(!1),c([])},[e]),i.useEffect(()=>{h(e)},[e,d]),t.jsxs("div",{children:[t.jsxs("div",{className:"flex flex-col gap-3 mb-3",children:[l.map((u,m)=>t.jsx(dn,{search:u},`${u.key}-${m}`)),f.map((u,m)=>t.jsx(Bn,{variant:u.key.replace(/upload_list_/g,"")},`${u.key}-${m}`))]}),t.jsx("div",{className:"flex justify-end",children:t.jsx(C,{variant:"link",size:"xs",onClick:()=>{const u=!r;a(u),c(u?_.map(m=>m.key):[])},children:s(r?"common.actions.collapse_all":"common.actions.expand_all")})}),t.jsx(Wt,{className:"flex flex-col gap-1",type:"multiple",value:o,onValueChange:u=>c(u),children:_.map((u,m)=>t.jsx(cn,{isOpen:o.includes(u.key),field:u},`${u.key}-${m}`))})]})}un.__docgenInfo={description:"",methods:[],displayName:"FacetList",props:{groupKey:{required:!1,tsType:{name:"union",raw:"string | null",elements:[{name:"string"},{name:"null"}]},description:""},aggregations:{required:!0,tsType:{name:"AggregationConfig"},description:""}}};function Rs(e){switch(e){case B.snv_occurrence:return{builderFetcher:dt,statisticFetcher:ut};case B.cnv_occurrence:return{builderFetcher:Qs,statisticFetcher:Ms};default:return{builderFetcher:dt,statisticFetcher:ut}}}function dt({field:e,size:n=30,withDictionary:s=!1}){const r=Le(),a=fe(),o=he(),c={caseId:a,seqId:o,aggregationBody:{field:e,size:n,sqon:r},withDictionary:s};return H(c,async()=>Oe.aggregateGermlineSNVOccurrences(c.caseId,c.seqId,c.aggregationBody,c.withDictionary).then(d=>d.data),{revalidateOnFocus:!1})}function ut({field:e}){const n=Le(),s=fe(),r=he(),a={caseId:s,seqId:r,statisticsBody:{field:e,sqon:n}};return H(a,async()=>Oe.statisticsGermlineSNVOccurrences(a.caseId,a.seqId,a.statisticsBody).then(o=>o.data),{revalidateOnFocus:!1})}function Qs({field:e,size:n=30}){const s=Le(),r=fe(),a=he(),o={caseId:r,seqId:a,aggregationBody:{field:e,size:n,sqon:s}};return H(o,async()=>Oe.aggregateGermlineCNVOccurrences(o.caseId,o.seqId,o.aggregationBody).then(c=>c.data),{revalidateOnFocus:!1})}function Ms({field:e}){const n=Le(),s=fe(),r=he(),a={caseId:s,seqId:r,statisticsBody:{field:e,sqon:n}};return H(a,async()=>Oe.statisticsGermlineCNVOccurrences(a.caseId,a.seqId,a.statisticsBody).then(o=>o.data),{revalidateOnFocus:!1})}async function Fs(e){return(await ns.getUserPreferences(e.key)).data}function Bs({appId:e,setPreference:n}){const s=H(`query-builder-get-${e}`,()=>Fs({key:`query-builder-${e}`}),{revalidateOnMount:!0,revalidateIfStale:!1,revalidateOnFocus:!1});i.useEffect(()=>{s.data?n({...s.data,history:Ge().history}):s.error&&n(Ge())},[s.isLoading])}function Ds(e){return Object.fromEntries(Object.entries(e).map(([n,s])=>{const r={...s,items:s.items.filter(a=>a.facetHidden!==!0)};return[n,r]}).filter(([n,s])=>s.items.length>0))}function tt(e,n){let s;for(const r in e)if(s=e[r].items.find(a=>a.key===n),s)return s;return console.error(`${n} doesn't exist in aggregations`,e),{type:y.MULTIPLE,key:"error",translation_key:"error"}}function qe({children:e,onRemovePill:n}){return t.jsxs("div",{className:"flex items-center rounded-xs p-0.5 bg-muted group-data-[query-active=true]/query:bg-primary/25",children:[e,t.jsx(C,{iconOnly:!0,variant:"ghost",size:"sm",className:"mr-0.5 ml-1 py-0.5 enabled:hover:bg-transparent size-4",onClick:s=>{s.stopPropagation(),n()},children:t.jsx(Zt,{})})]})}qe.__docgenInfo={description:`Simple wrapper that:
- Add the blue background to highlight the query pill if it has been selected by the user
- Add the X button to remove query-pill

         ┌────────────────────────────┐
┌───────┌──────────────────────────────────────────┐─────────────────┐
| [] Q1 | Loremp Ipsum = [1,2, 3 >][X]      | 389K | [copy] [trash]  |
└───────└──────────────────────────────────────────┘─────────────────┘
         └────────────────────────────┘`,methods:[],displayName:"QueryPillContainer",props:{onRemovePill:{required:!0,tsType:{name:"signature",type:"function",raw:"() => void",signature:{arguments:[],return:{name:"void"}}},description:""}}};function Re({field:e,operator:n}){const{t:s,lazyTranslate:r}=L(),{labelsEnabled:a}=rn();return a?t.jsxs("div",{className:"flex items-center",children:[t.jsx("span",{className:"ml-1 mr-0.5 text-xs font-medium",children:s(`common.filters.labels.${e}`,{defaultValue:r(e)})}),t.jsx("span",{className:"ml-1 mr-0.5",children:n})]}):null}Re.__docgenInfo={description:`Label for a pill
@TODO: Change dictionary key from filters to facet

         ┌────────────┐                   ┌─────┐
┌───────┌───────────────────────────────────────────────────────────┐─────────────────┐
| [] Q1 | Loremp Ipsum = [1,2, 3 >][X] and Ipsum < 60[x]     | 389K | [copy] [trash]  |
└───────└───────────────────────────────────────────────────────────┘─────────────────┘
         └────────────┘                   └─────┘`,methods:[],displayName:"LabelOperator",props:{field:{required:!0,tsType:{name:"string"},description:""},operator:{required:!0,tsType:{name:"ReactNode"},description:""}}};function Qe({type:e,size:n,className:s}){switch(e){case x.GreaterThan:return t.jsx(Kt,{size:n,className:s});case x.GreaterThanOrEqualTo:return t.jsx(Ut,{size:n,className:s});case x.LessThan:return t.jsx(Ht,{size:n,className:s});case x.LessThanOrEqualTo:return t.jsx(zt,{size:n,className:s});case x.Between:return t.jsx(Gt,{size:n,className:s});case x.NotIn:return t.jsx(os,{size:n,className:s});default:return t.jsx(Vt,{size:n,className:s})}}Qe.__docgenInfo={description:`Return to corresponding operator for the sqon

/**
Label for a pill
@TODO: Change dictionary key from filters to facet

                      ┌─┐                       ┌─┐
┌───────┌───────────────────────────────────────────────────────────┐─────────────────┐
| [] Q1 | Loremp Ipsum = [1,2, 3 >][X] and Ipsum < 60[x]     | 389K | [copy] [trash]  |
└───────└───────────────────────────────────────────────────────────┘─────────────────┘
                      └─┘                       └─┘`,methods:[],displayName:"Operator",props:{size:{required:!1,tsType:{name:"number"},description:""},type:{required:!1,tsType:{name:"union",raw:"SqonOpEnum | (string & {})",elements:[{name:"SqonOpEnum"},{name:"unknown"}]},description:""},className:{required:!1,tsType:{name:"string"},description:""}}};function pn({canExpand:e,className:n,classNameContent:s,children:r,clickable:a,...o}){return t.jsx("div",{className:te("bg-background rounded-xs pl-2 text-xs font-medium leading-5 relative",e?"pr-[22px]":"pr-2",n),...o,children:t.jsx("div",{className:te("flex flex-wrap items-center",a?"hover:shadow-[inset_0_-4px_0_-2.5px_black] hover:cursor-pointer":"",s),children:r})})}pn.__docgenInfo={description:`Visual container for QueryPillValues. Highlight with a white background

                        ┌─────────────┐
┌───────┌──────────────────────────────────────────┐─────────────────┐
| [] Q1 | Loremp Ipsum = [1,2, 3 >][X]      | 389K | [copy] [trash]  |
└───────└──────────────────────────────────────────┘─────────────────┘
                        └─────────────┘`,methods:[],displayName:"QueryPillValuesContainer",props:{canExpand:{required:!1,tsType:{name:"boolean"},description:""},clickable:{required:!1,tsType:{name:"boolean"},description:""},classNameContent:{required:!1,tsType:{name:"string"},description:""}}};const pt=3,Ps=",",$s="&";function Me({sqon:e,...n}){const[s,r]=i.useState(!1),{t:a,sanitize:o,lazyTranslate:c}=L(),d=e.content.value.length>pt,h=s?e.content.value:is(e.content.value,pt);return t.jsxs(pn,{canExpand:d,...n,children:[e.content.overrideValuesName?t.jsx("div",{children:t.jsx("span",{children:e.content.overrideValuesName})}):h.map((p,l)=>t.jsxs("div",{children:[t.jsx("span",{children:a(`common.filters.values.${e.content.field}.${o(p)}`,{defaultValue:c(p)})}),h.length-1>l&&t.jsx("span",{className:"px-1",children:e.op===x.All?$s:Ps})]},`${p}-${l}`)),d&&t.jsx("div",{className:"absolute right-1 hover:cursor-pointer",children:s?t.jsx(ls,{size:16,onClick:p=>{p.preventDefault(),r(!1)}}):t.jsx(cs,{size:16,onClick:p=>{p.preventDefault(),r(!0)}})})]})}Me.__docgenInfo={description:`QueryPillValues display the selected values from the facets.
- Display the first 3 selected values
- Clicking on [>] or [ < ] change the expand state

                        ┌──────────┐
┌───────┌──────────────────────────────────────────┐─────────────────┐
| [] Q1 | Loremp Ipsum = [1,2, 3 >] [X]     | 389K | [copy] [trash]  |
└───────└──────────────────────────────────────────┘─────────────────┘
                        └──────────┘`,methods:[],displayName:"QueryPillValues",props:{sqon:{required:!0,tsType:{name:"IValueFacet"},description:""}}};function mn({sqon:e}){const{aggregations:n}=D(),s=tt(n,e.content.field),r=U(),a=i.useCallback(()=>{r({type:T.REMOVE_FACET_PILL,payload:e})},[e]);return t.jsx(qe,{onRemovePill:a,children:t.jsxs("div",{className:"flex gap-2",children:[t.jsx(Re,{field:e.content.field,operator:t.jsx(Qe,{size:14,type:e.op})}),t.jsxs(Ee,{children:[t.jsx(we,{children:t.jsx(Me,{sqon:e})}),t.jsx(Te,{align:"start",className:"p-2.5",children:t.jsx(et,{field:s,isOpen:!0})})]})]})})}mn.__docgenInfo={description:`┌───────────────────┐
┌───────┌──────────────────────────────────────────┐─────────────────┐
| [] Q1 | Loremp Ipsum = true [X]     | 389K | [copy] [trash]  |
└───────└──────────────────────────────────────────┘─────────────────┘
         └───────────────────┘`,methods:[],displayName:"BooleanQueryPill",props:{sqon:{required:!0,tsType:{name:"IValueFacet"},description:""}}};function fn({sqon:e}){const{aggregations:n}=D(),s=tt(n,e.content.field),r=U(),a=i.useCallback(()=>{r({type:T.REMOVE_FACET_PILL,payload:e})},[e]);return t.jsx(qe,{onRemovePill:a,children:t.jsxs("div",{className:"flex gap-2",children:[t.jsx(Re,{field:e.content.field,operator:t.jsx(Qe,{size:14,type:e.op})}),t.jsxs(Ee,{children:[t.jsx(we,{children:t.jsx(Me,{sqon:e})}),t.jsx(Te,{align:"start",className:"p-2.5",children:t.jsx(et,{field:s,isOpen:!0})})]})]})})}fn.__docgenInfo={description:`┌────────────────────────┐
┌───────┌──────────────────────────────────────────┐─────────────────┐
| [] Q1 | Loremp Ipsum = [1,2, 3 >] [X]     | 389K | [copy] [trash]  |
└───────└──────────────────────────────────────────┘─────────────────┘
         └────────────────────────┘`,methods:[],displayName:"MultiSelectQueryPill",props:{sqon:{required:!0,tsType:{name:"IValueFacet"},description:""}}};function hn({sqon:e}){const{aggregations:n}=D(),s=tt(n,e.content.field),r=U(),a=i.useCallback(()=>{r({type:T.REMOVE_FACET_PILL,payload:e})},[e]);return t.jsx(qe,{onRemovePill:a,children:t.jsxs("div",{className:"flex gap-2",children:[t.jsx(Re,{field:e.content.field,operator:t.jsx(Qe,{size:14,type:e.op})}),t.jsxs(Ee,{children:[t.jsx(we,{children:t.jsx(Me,{sqon:e})}),t.jsx(Te,{align:"start",className:"p-2.5",children:t.jsx(et,{field:s,isOpen:!0})})]})]})})}hn.__docgenInfo={description:`┌───────────────────┐
┌───────┌──────────────────────────────────────────┐─────────────────┐
| [] Q1 | Loremp Ipsum < 100  [X]     | 389K | [copy] [trash]  |
└───────└──────────────────────────────────────────┘─────────────────┘
         └───────────────────┘`,methods:[],displayName:"NumericalQueryPill",props:{sqon:{required:!0,tsType:{name:"IValueFacet"},description:""}}};function yn({sqon:e}){const{t:n}=L(),s=U(),r=i.useCallback(a=>{a.stopPropagation(),s({type:T.CHANGE_COMBINER_OPERATOR,payload:{operator:e.op===$.And?$.Or:$.And}})},[]);return t.jsx("div",{className:"px-2",children:t.jsxs(_e,{children:[t.jsx(Ce,{asChild:!0,children:t.jsx(C,{variant:"link",className:"text-current text-sm p-0 h-auto font-normal",onClick:r,children:n(`common.query_pill.operator.${e.op}`)})}),t.jsxs(Ne,{children:[n("common.query_pill.operator.change_operator_to"),e.op===$.And?n("common.query_pill.operator.or"):n("common.query_pill.operator.and")]})]})})}yn.__docgenInfo={description:`Combiner is "and" or "or" operator that link every pill

                                      ┌───┐
┌───────┌───────────────────────────────────────────────────────────┐─────────────────┐
| [] Q1 | Loremp Ipsum = [1,2, 3 >][X] and Ipsum < 60[x]     | 389K | [copy] [trash]  |
└───────└───────────────────────────────────────────────────────────┘─────────────────┘
                                      └───┘`,methods:[],displayName:"CombinerOperator",props:{sqon:{required:!0,tsType:{name:"ISyntheticSqon"},description:""}}};function Vs(e){return xs(e)?t.jsx(hn,{sqon:e}):gs(e)?t.jsx(mn,{sqon:e}):t.jsx(fn,{sqon:e})}function gn({index:e,sqon:n,active:s}){var _;const{t:r}=L(),{fetcher:a}=D(),o=U(),c=i.useMemo(()=>({"border-primary/75 bg-primary/10":s,"border-muted-foreground/20 bg-muted/35 text-muted-foreground":!s}),[s]),d=H(`${JSON.stringify(n)}-count`,()=>a.count({countBody:{sqon:{content:n.content,op:n.op}}}),{revalidateOnFocus:!1,revalidateOnMount:!0,shouldRetryOnError:!1}),h=i.useCallback(()=>{s||o({type:T.SET_ACTIVE_QUERY,payload:{id:n.id}})},[s]),p=i.useCallback(()=>{console.warn("QueryBar:handleSelection has not be implemented")},[n]),l=i.useCallback(()=>{o({type:T.DUPLICATE_QUERY,payload:Bt(n)})},[n]),f=i.useCallback(()=>{o({type:T.REMOVE_QUERY,payload:n})},[n]);return t.jsxs("div",{className:"flex flex-1 group/query","data-query-active":s,onClick:h,children:[t.jsxs("div",{className:te("flex gap-2 items-center py-4 px-4 border-l border-t border-b",c),children:[t.jsx(rs,{size:"sm",checked:!1,onClick:p}),t.jsx("span",{className:"text-xs font-medium",children:r("common.query_bar.selector",{index:e})})]}),t.jsxs("div",{className:te("flex flex-1 justify-between py-3 px-3 border",c),children:[t.jsx("div",{className:"flex flex-1 flex-wrap max-h-[30vh]",children:n.content.map((A,u)=>t.jsxs("div",{className:"flex mt-1",children:[Vs(A),u<n.content.length-1&&t.jsx(yn,{sqon:n})]},u))}),t.jsx("div",{className:"flex items-center gap-1",children:d.isLoading?t.jsx(as,{}):t.jsxs(t.Fragment,{children:[t.jsx(Lt,{size:14}),t.jsx("span",{className:"font-medium",children:Hn(((_=d.data)==null?void 0:_.count)??0)})]})})]}),t.jsxs("div",{className:te("flex items-center py-2 px-3 border-r border-t border-b",c),onClick:A=>A.stopPropagation(),children:[t.jsx(C,{iconOnly:!0,variant:"ghost",size:"sm",onClick:l,children:t.jsx(wn,{})}),t.jsxs(Ee,{children:[t.jsx(we,{asChild:!0,children:t.jsx(C,{iconOnly:!0,variant:"ghost",size:"sm",children:t.jsx(ds,{})})}),t.jsxs(Te,{side:"left",className:"w-[200px] space-y-3",children:[t.jsx("div",{className:"text-sm",children:r("common.query_bar.delete_popover.title")}),t.jsxs("div",{className:"flex gap-1 justify-end",children:[t.jsx(it,{asChild:!0,children:t.jsx(C,{size:"xs",variant:"outline",children:r("common.query_bar.delete_popover.cancel")})}),t.jsx(it,{asChild:!0,children:t.jsx(C,{size:"xs",variant:"destructive",onClick:f,children:r("common.query_bar.delete_popover.ok")})})]})]})]})]})]})}gn.__docgenInfo={description:`Represent a single query.
A query is a combinaison of multiple sqon (multi-select, numerical, boolean etc.)

┌───────┌──────────────────────────────────────────┐─────────────────┐
| [] Q1 | Loremp Ipsum = [1,2, 3 >][X]      | 389K | [copy] [trash]  |
└───────└──────────────────────────────────────────┘─────────────────┘`,methods:[],displayName:"QueryBar",props:{index:{required:!0,tsType:{name:"number"},description:""},sqon:{required:!0,tsType:{name:"ISyntheticSqon"},description:""},active:{required:!0,tsType:{name:"boolean"},description:""}}};function xn(){const{t:e}=L(),{sqons:n,activeQueryId:s}=D(),{labelsEnabled:r}=rn(),a=U(),o=X(),c=i.useCallback(()=>{a({type:T.ADD_QUERY})},[]),d=i.useCallback(p=>{a({type:T.SET_LABELS_ENABLED,payload:{labelsEnabled:p}})},[]),h=i.useCallback(()=>{An.open({type:"warning",title:e("common.toolbar.clear_all_dialog.title"),description:e("common.toolbar.clear_all_dialog.description"),cancelProps:{children:e("common.toolbar.clear_all_dialog.cancel")},actionProps:{variant:"destructive",onClick:()=>{a({type:T.REMOVE_ALL_QUERIES})},children:e("common.toolbar.clear_all_dialog.ok")}})},[]);return t.jsx(Se,{className:"py-0",children:t.jsx(Wt,{type:"multiple",defaultValue:["query-builder"],children:t.jsxs(Xt,{value:"query-builder",className:"border-none",children:[t.jsx(Yt,{className:"border-b py-0 px-6 data-[state=closed]:rounded-sm data-[state=closed]:border-none hover:cursor-pointer",asChild:!0,children:"TODO"}),t.jsxs(Jt,{className:"py-4 px-6 space-y-4",children:[t.jsxs("div",{className:"flex flex-col gap-2 max-h-[30vh] overflow-y-scroll",children:[n.filter(p=>!Ue(p)).map((p,l)=>t.jsx(gn,{index:l+1,sqon:p,active:s===p.id},p.id)),Ue(o)&&e("common.query_bar.empty")]}),t.jsxs("div",{className:"flex items-center justify-between",children:[t.jsxs("div",{className:"flex items-center gap-4",children:[t.jsxs(C,{size:"xs",disabled:vs(n),onClick:c,children:[t.jsx(us,{}),e("common.toolbar.new_query")]}),t.jsxs("div",{className:"flex items-center gap-1.5",children:[t.jsx($t,{size:"xs",checked:r,onCheckedChange:d}),e("common.toolbar.labels")]})]}),n.length>1&&t.jsx("div",{children:t.jsx(C,{variant:"ghost",size:"sm",className:"no-underline enabled:hover:no-underline",onClick:h,children:e("common.toolbar.clear_all")})})]})]})]})})})}xn.__docgenInfo={description:`Card that display all queries for query-builder

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
└─────────────────────────────────────────────────────────────────────────┘`,methods:[],displayName:"QueriesBarCard"};function bn({defaultSidebarOpen:e,aggregations:n}){return t.jsx("div",{className:"bg-muted w-full",children:t.jsxs("div",{className:"flex flex-1 h-screen overflow-hidden",children:[t.jsx("aside",{className:"w-auto min-w-fit h-full shrink-0",children:t.jsx("div",{className:"z-10",children:t.jsx(Ft,{open:e,className:"h-full flex flex-row",children:t.jsx(qt,{variant:"sidebar",collapsible:"icon",className:"static! flex flex-col w-full bg-primary dark:bg-secondary ",children:t.jsx(Rt,{children:t.jsxs(Qt,{children:[t.jsx(q,{className:"size-8 mb-1"}),t.jsx(Mt,{children:Object.keys(n).map(s=>t.jsx(q,{className:"size-8 w-full"},s))})]})})})})})}),t.jsx("main",{className:"flex-1 shrink px-3 pb-3 overflow-auto",children:t.jsx("div",{className:"py-3 space-y-2",children:t.jsx(Se,{className:"py-0",children:t.jsxs("div",{className:"flex flex-col",children:[t.jsxs("div",{className:"py-4 px-6 flex justify-between",children:[t.jsxs("div",{className:"flex gap-4",children:[t.jsx(q,{className:"h-8 w-32"}),new Array(2).fill(0).map((s,r)=>t.jsx(q,{className:"size-8"},r))]}),t.jsxs("div",{className:"flex gap-2",children:[new Array(5).fill(0).map((s,r)=>t.jsx(q,{className:"size-8"},r)),t.jsx(q,{className:"h-8 w-36"})]})]}),t.jsx(Pt,{}),t.jsxs("div",{className:"flex flex-col py-4 gap-4",children:[t.jsxs("div",{className:"px-6 flex flex-col gap-2",children:[t.jsx(q,{className:"h-[50px] w-full"}),t.jsx(q,{className:"h-[50px] w-full"})]}),t.jsxs("div",{className:"px-6 flex gap-3",children:[t.jsx(q,{className:"h-7 w-26"}),t.jsx(q,{className:"h-7 w-16"})]})]})]})})})})]})})}bn.__docgenInfo={description:"",methods:[],displayName:"QueryBuilderSkeleton",props:{aggregations:{required:!0,tsType:{name:"AggregationConfig"},description:""},defaultSidebarOpen:{required:!0,tsType:{name:"boolean"},description:""}}};function K({appId:e,defaultSidebarOpen:n=!1,fetcher:s,children:r}){const[a,o]=i.useState(n),d=$n()[e].aggregations,h=Ds(d),[p,l]=i.useState(null),[f,_]=i.useState(),A=Rs(e);return Bs({appId:e,setPreference:_}),f?t.jsx(sn,{...f,aggregations:d,fetcher:s,children:t.jsx(an,{value:{appId:e,...A},children:t.jsx("div",{className:"bg-muted w-full",children:t.jsxs("div",{className:"flex flex-1 h-screen overflow-hidden",children:[t.jsx("aside",{className:"w-auto min-w-fit h-full shrink-0",children:t.jsxs(Ft,{open:a,onOpenChange:o,className:"h-full flex flex-row",children:[t.jsx("div",{className:"z-10",children:t.jsx(en,{aggregationGroups:h,selectedItemId:p,onItemSelect:l})}),t.jsx("div",{className:te("overflow-auto mb-16 border-r transition-[width] duration-300 ease-in-out",{"w-[280px] p-4 opacity-100 relative":p,"w-0 opacity-0":!p}),children:t.jsxs("div",{className:"whitespace-nowrap",children:[t.jsx("div",{className:"flex justify-end mb-4",children:t.jsx("button",{onClick:()=>l(null),className:"text-muted-foreground hover:text-foreground",children:t.jsx(Zt,{size:16})})}),t.jsx(un,{aggregations:h,groupKey:p})]})})]})}),t.jsxs("main",{className:"flex-1 shrink px-3 pb-3 overflow-auto",children:[t.jsx("div",{className:"py-3 space-y-2",children:t.jsx(xn,{})}),r]})]})})})}):t.jsx(bn,{defaultSidebarOpen:n,aggregations:d})}K.__docgenInfo={description:"Query-Builder (facets + query-bar)",methods:[],displayName:"QueryBuilder",props:{appId:{required:!0,tsType:{name:"ApplicationId"},description:""},children:{required:!0,tsType:{name:"ReactReactElement",raw:"React.ReactElement"},description:""},defaultSidebarOpen:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"false",computed:!1}},fetcher:{required:!0,tsType:{name:"IQBFetcher"},description:""}}};function Y({...e}){var f;const n=X(),{fetcher:s}=D(),[r,a]=i.useState([]),[o,c]=i.useState({pageIndex:0,pageSize:10}),[d,h]=i.useState([]),p=H(`${JSON.stringify(n)}-list`,()=>s.list({listBody:{additional_fields:r,limit:o.pageSize,page_index:o.pageIndex,sort:d,sqon:{content:n.content,op:n.op}}}),{revalidateOnFocus:!1,revalidateOnMount:!0,shouldRetryOnError:!1}),l=H(`${JSON.stringify(n)}-count`,()=>s.count({countBody:{sqon:{content:n.content,op:n.op}}}),{revalidateOnFocus:!1,revalidateOnMount:!0,shouldRetryOnError:!1});return t.jsx(Se,{children:t.jsx(Ke,{children:t.jsx(ss,{data:p.data??[],total:((f=l.data)==null?void 0:f.count)??0,loadingStates:{list:p.isLoading,total:l.isLoading},serverOptions:{setAdditionalFields:a,onSortingChange:h},pagination:{state:o,type:"server",onPaginationChange:c},...e})})})}Y.__docgenInfo={description:`Wrapper for data-table
Used to access QBContext and create list and count query`,methods:[],displayName:"QueryBuilderDataTable"};const le="api/users/preferences/:key",J="api/mock/list",W="api/mock/count";function mt(e,n){var c;const{op:s}=n,r=n.content.field,a=n.content.value,o=(c=e[r])==null?void 0:c.toString().toLowerCase();switch(s){case x.In:return a.includes(o);case x.And:return console.warn(`mock-api:filtercontent ${s} operator has not been coded; ${r} ${o} ${s} ${a}`),!0;case x.Or:return console.warn(`mock-api:filtercontent ${s} operator has not been coded; ${r} ${o} ${s} ${a}`),!0;case x.Not:return console.warn(`mock-api:filtercontent ${s} operator has not been coded; ${r} ${o} ${s} ${a}`),!0;case x.Between:return o?parseFloat(o)>parseFloat(a[0])&&parseFloat(o)<parseFloat(a[1]):!1;case x.GreaterThan:return o?parseFloat(o)>parseFloat(a[0]):!1;case x.LessThan:return o?parseFloat(o)<parseFloat(a[0]):!1;case x.GreaterThanOrEqualTo:return o?parseFloat(o)>=parseFloat(a[0]):!1;case x.LessThanOrEqualTo:return o?parseFloat(o)<=parseFloat(a[0]):!1;case x.NotIn:return!a.includes(o);case x.All:return console.warn(`mock-api:filtercontent ${s} operator has not been coded; ${r} ${o} ${s} ${a}`),!0}return!1}function vn(e){return Xe.filter(n=>{switch(e.op){case x.Or:return e.content.map(r=>mt(n,r)).includes(!0);default:return e.content.map(r=>mt(n,r)).every(r=>r===!0)}})}async function ce({request:e}){var r;const s=(r=(await e.clone().json()).listBody)==null?void 0:r.sqon;return s&&s.content.length>0?Q.json(vn(s)):Q.json(Xe)}async function de({request:e}){var r;const s=(r=(await e.clone().json()).countBody)==null?void 0:r.sqon;if(s&&s.content.length>0){const a=vn(s);return Q.json({count:a.length})}return Q.json({count:Xe.length})}const{mocked:ft}=__STORYBOOK_MODULE_TEST__,zs={variant_entity:{app_id:B.variant_entity},snv_occurrence:{app_id:B.snv_occurrence,aggregations:{variant:{items:[{key:"firstName",translation_key:"multiple",type:y.MULTIPLE},{key:"lastName",translation_key:"multiple (with dictionary)",type:y.MULTIPLE},{key:"status",translation_key:"status (with dictionary)",type:y.MULTIPLE,withDictionary:!0},{key:"divider",translation_key:"Divider",type:y.DIVIDER},{key:"progress",translation_key:"numerical (decimal)",type:y.NUMERICAL,defaults:{min:0,max:100,defaultOperator:G.LessThan,defaultMin:0,defaultMax:100,noDataInputOption:!0}},{key:"age",translation_key:"Age (integer)",type:y.NUMERICAL,defaults:{min:0,max:100,defaultOperator:G.LessThan,defaultMin:0,defaultMax:100}},{key:"visits",translation_key:"Visits (integer)",type:y.NUMERICAL,defaults:{min:0,max:1e3,defaultOperator:G.LessThan,defaultMin:0,defaultMax:1e3}},{key:"isActive",translation_key:"isActive (boolean)",type:y.BOOLEAN}]}}},cnv_occurrence:{app_id:B.cnv_occurrence,aggregations:{pathogenicity:{items:[{key:"firstName",translation_key:"multiple",type:y.MULTIPLE},{key:"lastName",translation_key:"multiple (with dictionary)",type:y.MULTIPLE},{key:"status",translation_key:"status (with dictionary)",type:y.MULTIPLE,withDictionary:!0},{key:"divider",translation_key:"Divider",type:y.DIVIDER},{key:"progress",translation_key:"numerical (decimal)",type:y.NUMERICAL,defaults:{min:0,max:100,defaultOperator:G.LessThan,defaultMin:0,defaultMax:100}},{key:"age",translation_key:"Age (integer)",type:y.NUMERICAL,defaults:{min:0,max:100,defaultOperator:G.LessThan,defaultMin:0,defaultMax:100}},{key:"visits",translation_key:"Visits (integer)",type:y.NUMERICAL,defaults:{min:0,max:1e3,defaultOperator:G.LessThan,defaultMin:0,defaultMax:1e3}},{key:"isActive",translation_key:"isActive (boolean)",type:y.BOOLEAN}]},frequency:{items:[{key:"lastName",translation_key:"multiple (with dictionary)",type:y.MULTIPLE},{key:"progress",translation_key:"numerical (decimal)",type:y.NUMERICAL,defaults:{min:0,max:100,defaultOperator:G.LessThan,defaultMin:0,defaultMax:100}},{key:"age",translation_key:"Age (integer)",type:y.NUMERICAL,defaults:{min:0,max:100,defaultOperator:G.LessThan,defaultMin:0,defaultMax:100}},{key:"isActive",translation_key:"isActive (boolean)",type:y.BOOLEAN}]}}},admin:{admin_code:"admin",app_id:B.admin},portal:{name:"",navigation:{}}},ua={title:"QueryBuilder/QueryBuilderV3",component:K,beforeEach:async()=>{ft(fe).mockReturnValue(1),ft(he).mockReturnValue(1)},args:{fetcher:{list:async e=>nt.post(J,{listBody:e.listBody}).then(n=>n.data),count:async e=>nt.post(W,{countBody:e.countBody}).then(n=>n.data)}},decorators:[e=>t.jsx(ps,{initialEntries:["/case/1?seq_id=1"],children:t.jsx(ms,{children:t.jsx(fs,{path:"/case/:caseId",element:t.jsx(Vn,{config:zs,children:t.jsx(e,{})})})})})]},ge={parameters:{msw:{handlers:[b.post(J,ce),b.post(W,de),b.post(ne,se),b.post(re,ae),b.get(le,async()=>(await hs(1e4),new Q(null,{status:403})))]}},args:{appId:B.snv_occurrence,children:t.jsx(t.Fragment,{}),defaultSidebarOpen:!0},render:e=>t.jsxs(t.Fragment,{children:[t.jsx("div",{className:"bold font-mono text-red",children:"Do a hard refresh to reset loading state"}),t.jsx(K,{appId:e.appId,defaultSidebarOpen:e.defaultSidebarOpen,fetcher:e.fetcher,children:t.jsx(Y,{id:"storybook-query-builder",columns:[...oe,ie.accessor("isActive",{header:"Active"})],defaultColumnSettings:[]})})]})},xe={parameters:{msw:{handlers:[b.post(J,ce),b.post(W,de),b.post(ne,se),b.post(re,ae),b.get(le,()=>new Q(null,{status:404}))]}},args:{appId:B.cnv_occurrence,children:t.jsx(t.Fragment,{}),defaultSidebarOpen:!0},render:e=>t.jsx(K,{appId:e.appId,defaultSidebarOpen:e.defaultSidebarOpen,fetcher:e.fetcher,children:t.jsx(Y,{id:"storybook-query-builder",columns:[...oe,ie.accessor("isActive",{header:"Active"})],defaultColumnSettings:[]})})},be={parameters:{msw:{handlers:[b.post(J,ce),b.post(W,de),b.post(ne,se),b.post(re,ae),b.get(le,({params:e})=>e.key==="data-table-storybook-query-builder"?new Q(null,{status:404}):Q.json({activeQueryId:"3593dbdf-44e7-49c9-934a-7b10db87b603",sqons:[{id:"3593dbdf-44e7-49c9-934a-7b10db87b603",content:[{content:{field:"firstName",value:["henry","jack","irene","liam","olivia","tanner"]},op:"in"},{content:{field:"lastName",value:["tremblay","anderson","young"]},op:"in"},{content:{field:"status",value:["single"]},op:"in"}],op:"and"}],settings:{labelsEnabled:!0}}))]}},args:{appId:B.snv_occurrence,children:t.jsx(t.Fragment,{}),defaultSidebarOpen:!0},render:e=>t.jsx(K,{appId:e.appId,defaultSidebarOpen:e.defaultSidebarOpen,fetcher:e.fetcher,children:t.jsx(Y,{id:"storybook-query-builder",columns:[...oe,ie.accessor("isActive",{header:"Active"})],defaultColumnSettings:[]})})},ve={parameters:{msw:{handlers:[b.post(J,ce),b.post(W,de),b.post(ne,se),b.post(re,ae),b.get(le,({params:e})=>e.key==="data-table-storybook-query-builder"?new Q(null,{status:404}):Q.json({activeQueryId:"3593dbdf-44e7-49c9-934a-7b10db87b603",sqons:[{id:"3593dbdf-44e7-49c9-934a-7b10db87b603",content:[{content:{field:"isActive",value:["true"]},op:"in"}],op:"and"}],settings:{labelsEnabled:!0}}))]}},args:{appId:B.snv_occurrence,children:t.jsx(t.Fragment,{}),defaultSidebarOpen:!0},render:e=>t.jsx(K,{appId:e.appId,defaultSidebarOpen:e.defaultSidebarOpen,fetcher:e.fetcher,children:t.jsx(Y,{id:"storybook-query-builder",columns:[...oe,ie.accessor("isActive",{header:"Active"})],defaultColumnSettings:[]})})},ke={parameters:{msw:{handlers:[b.post(J,ce),b.post(W,de),b.post(ne,se),b.post(re,ae),b.get(le,({params:e})=>e.key==="data-table-storybook-query-builder"?new Q(null,{status:404}):Q.json({activeQueryId:"3593dbdf-44e7-49c9-934a-7b10db87b603",sqons:[{id:"3593dbdf-44e7-49c9-934a-7b10db87b603",content:[{content:{field:"progress",value:["50"]},op:"<"},{content:{field:"visits",value:["1","100"]},op:"between"}],op:"and"}],settings:{labelsEnabled:!0}}))]}},args:{appId:B.snv_occurrence,children:t.jsx(t.Fragment,{}),defaultSidebarOpen:!0},render:e=>t.jsx(K,{appId:e.appId,defaultSidebarOpen:e.defaultSidebarOpen,fetcher:e.fetcher,children:t.jsx(Y,{id:"storybook-query-builder",columns:[...oe,ie.accessor("isActive",{header:"Active"})],defaultColumnSettings:[]})})},je={parameters:{msw:{handlers:[b.post(J,ce),b.post(W,de),b.post(ne,se),b.post(re,ae),b.get(le,({params:e})=>e.key==="data-table-storybook-query-builder"?new Q(null,{status:404}):Q.json({activeQueryId:"3593dbdf-44e7-49c9-934a-7b10db87b605",sqons:[{id:"3593dbdf-44e7-49c9-934a-7b10db87b603",content:[{content:{field:"firstName",value:["jack","karen"]},op:"in"},{content:{field:"lastName",value:["tremblay"]},op:"in"}],op:"or"},{id:"3593dbdf-44e7-49c9-934a-7b10db87b605",content:[{content:{field:"firstName",value:["jack","karen"]},op:"in"},{content:{field:"lastName",value:["tremblay"]},op:"in"}],op:"and"},{id:"3593dbdf-44e7-49c9-934a-7b10db87b601",content:[{content:{field:"firstName",value:["liam","karen"]},op:"in"},{content:{field:"progress",value:["50"]},op:"<"},{content:{field:"visits",value:["1","100"]},op:"between"}],op:"or"},{id:"3593dbdf-44e7-49c9-934a-7b10db87b600",content:[{content:{field:"firstName",value:["henry","karen"]},op:"in"},{content:{field:"progress",value:["10"]},op:">"},{content:{field:"visits",value:["95"]},op:"<"},{content:{field:"isActive",value:["true"]},op:"in"}],op:"and"}],settings:{labelsEnabled:!0}}))]}},args:{appId:B.snv_occurrence,children:t.jsx(t.Fragment,{}),defaultSidebarOpen:!0},render:e=>t.jsx(K,{appId:e.appId,defaultSidebarOpen:e.defaultSidebarOpen,fetcher:e.fetcher,children:t.jsx(Y,{id:"storybook-query-builder",columns:[...oe,ie.accessor("isActive",{header:"Active"})],defaultColumnSettings:[]})})};var ht,yt,gt;ge.parameters={...ge.parameters,docs:{...(ht=ge.parameters)==null?void 0:ht.docs,source:{originalSource:`{
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
}`,...(gt=(yt=ge.parameters)==null?void 0:yt.docs)==null?void 0:gt.source}}};var xt,bt,vt;xe.parameters={...xe.parameters,docs:{...(xt=xe.parameters)==null?void 0:xt.docs,source:{originalSource:`{
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
}`,...(vt=(bt=xe.parameters)==null?void 0:bt.docs)==null?void 0:vt.source}}};var kt,jt,At;be.parameters={...be.parameters,docs:{...(kt=be.parameters)==null?void 0:kt.docs,source:{originalSource:`{
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
          }],
          settings: {
            labelsEnabled: true
          }
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
}`,...(At=(jt=be.parameters)==null?void 0:jt.docs)==null?void 0:At.source}}};var It,_t,Ct;ve.parameters={...ve.parameters,docs:{...(It=ve.parameters)==null?void 0:It.docs,source:{originalSource:`{
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
          }],
          settings: {
            labelsEnabled: true
          }
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
}`,...(Ct=(_t=ve.parameters)==null?void 0:_t.docs)==null?void 0:Ct.source}}};var Nt,St,Ot;ke.parameters={...ke.parameters,docs:{...(Nt=ke.parameters)==null?void 0:Nt.docs,source:{originalSource:`{
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
          }],
          settings: {
            labelsEnabled: true
          }
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
}`,...(Ot=(St=ke.parameters)==null?void 0:St.docs)==null?void 0:Ot.source}}};var Et,wt,Tt;je.parameters={...je.parameters,docs:{...(Et=je.parameters)==null?void 0:Et.docs,source:{originalSource:`{
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
          }],
          settings: {
            labelsEnabled: true
          }
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
}`,...(Tt=(wt=je.parameters)==null?void 0:wt.docs)==null?void 0:Tt.source}}};const pa=["Loading","Default","Multiselect","Boolean","Numerical","MultiQueries"];export{ve as Boolean,xe as Default,ge as Loading,je as MultiQueries,be as Multiselect,ke as Numerical,pa as __namedExportsOrder,ua as default};
