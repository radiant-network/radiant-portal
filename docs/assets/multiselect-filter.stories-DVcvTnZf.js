import{j as e}from"./jsx-runtime-Cf8x2fCZ.js";import{a as oe}from"./index-B-lxVbXh.js";import{q as N,M as re,T as O}from"./query-builder-remote-BIxcuZcY.js";import{r}from"./index-tvICUrOf.js";import{B as h}from"./button-UnRZVMn5.js";import{C as ne}from"./checkbox-DR5AvqL2.js";import{I as ae}from"./input-BBA0CWHH.js";import{A as ie}from"./ActionButton-C_4cAaVG.js";import"./button.variants-B79LQKoe.js";import{u as le,C as ce}from"./applications-config-B4jBJrF9.js";import{n as ue}from"./number-format-BmdRvOec.js";import{u as pe}from"./i18n-kaxe3DHJ.js";import{S as me}from"./separator-yfEj2UAP.js";import{u as de,o as ye}from"./index-Dj_M_ICw.js";import{S as F}from"./skeleton-CfkhzHGY.js";import"./index-yBjzXJbu.js";import"./v4-CtRu48qb.js";import"./api-CkzL9HmQ.js";import"./index-Csi1vtvD.js";import"./index-_r67kdfS.js";import"./index-fNjTmf9T.js";import"./spinner-Bn71UZIB.js";import"./utils-CytzSlOG.js";import"./createLucideIcon-DKFpjrVJ.js";import"./index-C1xbsqtW.js";import"./index-DJkr1wGX.js";import"./index-pLOVI5Ig.js";import"./index-C66Dxnp2.js";import"./check-CfPT3E_d.js";import"./dropdown-menu-BtHca8-r.js";import"./Combination-CmKP2mMJ.js";import"./index-CueSDTQu.js";import"./ellipsis-NIzCCAdy.js";import"./iframe-GQC8GNlz.js";import"./index-BNh7Aicb.js";const fe=t=>ye.aggregateOccurrences(t.seqId,t.aggregationBody).then(u=>u.data);function ke(t,u=30,l=!1,_){let o;l?o={seqId:"5011",aggregationBody:{field:t,size:u}}:o=null;const v=N.getResolvedActiveQuery(_);return v&&o&&(o.aggregationBody.sqon={content:v.content,op:v.op}),de(o,fe,{revalidateOnFocus:!1})}function ge(t,u){return u.filter(l=>l.key.toLowerCase().includes(t.toLowerCase()))}function E(t,u){return u<t?u:t}function x({field:t,aggregation:u,maxVisibleItems:l=5,searchVisible:_=!1}){const{t:o}=pe(),b=le().variant_exploration.app_id,{data:c,isLoading:f}=ke(t.key,void 0,!0,b),[n,A]=r.useState(c||[]),[I,U]=r.useState([]),[i,d]=r.useState([]),[y,k]=r.useState(E(n.length,l)),[D,g]=r.useState(!1);r.useEffect(()=>{let a=N.getResolvedActiveQuery(b).content.find(s=>s.content.field===t.key);d(a?a.content.value:[]),c==null||c.sort((s,p)=>{const w=s.key&&i.includes(s.key),se=p.key&&i.includes(p.key);return w===se?p.count-s.count:w?-1:1}),A(c||[]),k(E((c==null?void 0:c.length)||0,l))},[c]);const H=r.useCallback(a=>{const s=ge(a,c);l>s.length?k(s.length):s.length>l&&k(l),A(s)},[n,y,c]),G=r.useCallback(()=>{k(n.length)},[y,n]),W=r.useCallback(()=>{k(l)},[y]),P=r.useCallback(()=>{i.length!==n.length&&(g(!0),d(n.map(a=>a.key)))},[n,i]),J=r.useCallback(()=>{i.length!==0&&(g(!0),d([]))},[i]),K=r.useCallback(a=>{let s=[];i.some(p=>p===a.key)?s=i.filter(p=>p!==a.key):s=[...i,a.key],g(!0),d(s)},[i]),X=r.useCallback(()=>{g(!1),d([...I])},[I]),m=r.useCallback(a=>{g(!1),U(i),N.updateActiveQueryField(b,{field:t.key,value:[...i],merge_strategy:re.OVERRIDE_VALUES,operator:a})},[i,b,t.key]),Y=r.useCallback(()=>{m(O.In)},[m]),Z=r.useCallback(()=>{m(O.NotIn)},[m]),ee=r.useCallback(()=>{m(O.All)},[m]),te=r.useCallback(()=>{m(O.In)},[m]);return e.jsxs("div",{className:"p-2 w-full max-w-md",children:[_&&e.jsx(ae,{type:"text",placeholder:o("common.filters.search.placeholder"),className:"w-full p-2 mb-2 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500",onChange:a=>H(a.target.value)}),e.jsxs("div",{className:"flex justify-between",children:[e.jsx(h,{size:"sm",onClick:()=>P(),variant:"link",className:"px-0",children:o("common.filters.buttons.all")}),e.jsx(h,{size:"sm",onClick:()=>J(),variant:"link",className:"px-0",children:o("common.filters.buttons.none")})]}),e.jsx("div",{children:f?Array.from({length:3},(a,s)=>e.jsxs("div",{className:"flex justify-between items-center py-2 space-x-2",children:[e.jsx(F,{className:"w-full h-6 rounded"}),e.jsx(F,{className:"h-6 w-12 rounded-md"})]},`skeleton-${s}`)):n.length===0?e.jsx("div",{className:"text-muted-foreground text-center py-4",children:o("common.filters.noValuesFound")}):Array.from({length:y},(a,s)=>e.jsx("div",{className:"space-y-3 pt-2",children:e.jsxs("div",{className:"flex justify-between items-center",children:[e.jsxs("label",{className:"flex items-center space-x-2 overflow-hidden",children:[e.jsx(ne,{className:"w-4 h-4",checked:i.some(p=>p===n[s].key),onCheckedChange:()=>K(n[s])}),e.jsx("div",{className:"overflow-hidden text-ellipsis text-sm",children:o(`common.filters.labels.${u}.${t.key}.${n[s].key}`,{defaultValue:n[s].key})}),e.jsx("span",{className:"checkmark"})]}),e.jsx("span",{className:"bg-accent px-2 py-1 rounded-md text-xs",children:ue(n[s].count||0)})]})},n[s].key))}),!f&&n.length>y&&e.jsx(h,{className:"mt-2 px-0",onClick:G,size:"sm",variant:"link",children:o("common.filters.buttons.showMore",{count:n.length-l})}),!f&&y>l&&e.jsx(h,{className:"mt-2 px-0",onClick:W,size:"sm",variant:"link",children:o("common.filters.buttons.showLess")}),e.jsx(me,{className:"my-4 border-border",id:`${t.key}_divider`}),e.jsxs("div",{className:"flex align-right justify-end items-center space-x-2",children:[e.jsx(h,{size:"xs",variant:"ghost",onClick:X,disabled:!D||f,children:o("common.filters.buttons.clear")}),e.jsx("div",{className:"flex space-x-2",children:e.jsx(ie,{size:"xs",className:"h-7",color:"primary",actions:[{label:o("common.filters.buttons.someNotIn"),onClick:te},{label:o("common.filters.buttons.all"),onClick:ee},{label:o("common.filters.buttons.notIn"),onClick:Z}],onDefaultAction:Y,disabled:f,children:o("common.filters.buttons.apply")})})]})]})}x.__docgenInfo={description:"",methods:[],displayName:"MultiSelectFilter",props:{field:{required:!0,tsType:{name:"AggregationConfig"},description:""},aggregation:{required:!0,tsType:{name:"AggregationConfig"},description:""},maxVisibleItems:{required:!1,tsType:{name:"number"},description:"",defaultValue:{value:"5",computed:!1}},searchVisible:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"false",computed:!1}}}};const $={variant_exploration:{app_id:"variant_exploration_multi_select_filter",aggregations:[{key:"chromosome",type:"multiple"},{key:"filter",type:"multiple"},{key:"zygosity",type:"multiple"},{key:"impact_score",type:"multiple"},{key:"variant_class",type:"multiple"},{key:"symbol",type:"multiple"}]}},Ze={title:"Feature/Query Filters/Multi Select",component:x,args:{data:[],field:{key:"chromosome",type:"multiple"},maxVisibleItems:10,searchVisible:!0},decorators:[t=>e.jsx(ce,{config:$,children:e.jsx(t,{})})]},j={args:{data:[{key:"Option 1",count:100},{key:"Option 2",count:200},{key:"Option 3",count:300},{key:"Option 4",count:400},{key:"Option 5",count:500},{key:"Option 6",count:600}],appliedItems:[]},render:t=>e.jsx("div",{className:"space-y-6",children:e.jsx(x,{...t})})},C={args:{data:[{key:"Option6",count:600},{key:"Option5",count:500},{key:"Option4",count:400},{key:"Option3",count:300},{key:"Option2",count:200},{key:"Option1",count:100}]},render:t=>(oe("activeQuery")(N.updateActiveQueryField($.variant_exploration.app_id,{field:"chromosome",value:["Option1","Option4"]})),e.jsx("div",{className:"space-y-6",children:e.jsx(x,{...t})}))},S={args:{data:[{key:"Option6",count:600},{key:"Option5",count:500}],searchVisible:!1},render:t=>e.jsx("div",{className:"space-y-6",children:e.jsx(x,{...t})})};var B,Q,q;j.parameters={...j.parameters,docs:{...(B=j.parameters)==null?void 0:B.docs,source:{originalSource:`{
  args: {
    data: [{
      key: 'Option 1',
      count: 100
    }, {
      key: 'Option 2',
      count: 200
    }, {
      key: 'Option 3',
      count: 300
    }, {
      key: 'Option 4',
      count: 400
    }, {
      key: 'Option 5',
      count: 500
    }, {
      key: 'Option 6',
      count: 600
    }],
    appliedItems: []
  },
  render: args => {
    return <div className="space-y-6">
        <MultiSelectFilter {...args} />
      </div>;
  }
}`,...(q=(Q=j.parameters)==null?void 0:Q.docs)==null?void 0:q.source}}};var M,R,T;C.parameters={...C.parameters,docs:{...(M=C.parameters)==null?void 0:M.docs,source:{originalSource:`{
  args: {
    data: [{
      key: 'Option6',
      count: 600
    }, {
      key: 'Option5',
      count: 500
    }, {
      key: 'Option4',
      count: 400
    }, {
      key: 'Option3',
      count: 300
    }, {
      key: 'Option2',
      count: 200
    }, {
      key: 'Option1',
      count: 100
    }]
  },
  render: args => {
    action('activeQuery')(queryBuilderRemote.updateActiveQueryField(config.variant_exploration.app_id, {
      field: 'chromosome',
      value: ['Option1', 'Option4']
    }));
    return <div className="space-y-6">
        <MultiSelectFilter {...args} />
      </div>;
  }
}`,...(T=(R=C.parameters)==null?void 0:R.docs)==null?void 0:T.source}}};var z,L,V;S.parameters={...S.parameters,docs:{...(z=S.parameters)==null?void 0:z.docs,source:{originalSource:`{
  args: {
    data: [{
      key: 'Option6',
      count: 600
    }, {
      key: 'Option5',
      count: 500
    }],
    searchVisible: false
  },
  render: args => {
    return <div className="space-y-6">
        <MultiSelectFilter {...args} />
      </div>;
  }
}`,...(V=(L=S.parameters)==null?void 0:L.docs)==null?void 0:V.source}}};const et=["Default","DataAppliedToQueryBuilder","HiddenSearch"];export{C as DataAppliedToQueryBuilder,j as Default,S as HiddenSearch,et as __namedExportsOrder,Ze as default};
