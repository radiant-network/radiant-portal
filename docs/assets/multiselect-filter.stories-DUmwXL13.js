import{j as e}from"./jsx-runtime-Cf8x2fCZ.js";import{a as te}from"./index-B-lxVbXh.js";import{q as N,M as se,T as b}from"./query-builder-remote-4G-kxmmP.js";import{r}from"./index-tvICUrOf.js";import{B as O}from"./button-Bt0dR50w.js";import{C as oe}from"./checkbox-B_z4RER-.js";import{I as re}from"./input-aUNQvU1u.js";import{A as ne}from"./ActionButton-3jPSD3_g.js";import{u as ae,C as ie}from"./applications-config-B4jBJrF9.js";import{n as le}from"./number-format-HGT0qunz.js";import{u as ce}from"./i18n-C7oxrTKN.js";import{S as ue}from"./separator-CeuDDfbI.js";import{u as pe,o as de}from"./api-G4EBnqqg.js";import{S as w}from"./skeleton-ChuViQYQ.js";import"./index-yBjzXJbu.js";import"./v4-CtRu48qb.js";import"./index-DHoK6HQ1.js";import"./index-_r67kdfS.js";import"./index-fNjTmf9T.js";import"./utils-BNf5BS2b.js";import"./createLucideIcon-DKFpjrVJ.js";import"./index-C1xbsqtW.js";import"./index-B7VY1_KI.js";import"./index-C-096Y_y.js";import"./index-C66Dxnp2.js";import"./dropdown-menu-Df-q2eXS.js";import"./Combination-CHLpyrt-.js";import"./ellipsis-NIzCCAdy.js";import"./iframe-B2ZmP5zN.js";const me=t=>de.aggregateOccurrences(t.seqId,t.aggregationBody).then(n=>n.data);function ye(t,n=30,k=!1,l){let m;k?m={seqId:"5011",aggregationBody:{field:t,size:n}}:m=null;const p=N.getResolvedActiveQuery(l);return p&&m&&(m.aggregationBody.sqon={content:p.content,op:p.op}),pe(m,me,{revalidateOnFocus:!1})}function fe(t,n){return n.filter(k=>k.key.toLowerCase().includes(t.toLowerCase()))}function F(t,n){return n<t?n:t}function g({field:t,maxVisibleItems:n=10,searchVisible:k=!1}){const{t:l}=ce(),p=ae().variant_entity.app_id,{data:c,isLoading:x}=ye(t.key,void 0,!0,p),[a,I]=r.useState(c||[]),[_,U]=r.useState([]),[i,y]=r.useState([]),[h,v]=r.useState(F(a.length,n)),[D,f]=r.useState(!1);r.useEffect(()=>{let o=N.getResolvedActiveQuery(p).content.find(s=>s.content.field===t.key);y(o?o.content.value:[]),c==null||c.sort((s,u)=>{const A=s.key&&i.includes(s.key),ee=u.key&&i.includes(u.key);return A===ee?u.count-s.count:A?-1:1}),I(c||[]),v(F((c==null?void 0:c.length)||0,n))},[c]);const H=r.useCallback(o=>{const s=fe(o,c);n>s.length?v(s.length):s.length>n&&v(n),I(s)},[a,h,c]),G=r.useCallback(()=>{let o=h+n;f(!0),v(o>a.length?a.length:o)},[h,a]),W=r.useCallback(()=>{i.length!==a.length&&(f(!0),y(a.map(o=>o.key)))},[a,i]),$=r.useCallback(()=>{i.length!==0&&(f(!0),y([]))},[i]),P=r.useCallback(o=>{let s=[];i.some(u=>u===o.key)?s=i.filter(u=>u!==o.key):s=[...i,o.key],f(!0),y(s)},[i]),J=r.useCallback(()=>{f(!1),y([..._])},[_]),d=r.useCallback(o=>{f(!1),U(i),N.updateActiveQueryField(p,{field:t.key,value:[...i],merge_strategy:se.OVERRIDE_VALUES,operator:o})},[i,p,t.key]),K=r.useCallback(()=>{d(b.In)},[d]),X=r.useCallback(()=>{d(b.NotIn)},[d]),Y=r.useCallback(()=>{d(b.All)},[d]),Z=r.useCallback(()=>{d(b.In)},[d]);return e.jsxs("div",{className:"p-2 w-full max-w-md",children:[k&&e.jsx(re,{type:"text",placeholder:l("common.filters.search.placeholder"),className:"w-full p-2 mb-2 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500",onChange:o=>H(o.target.value)}),e.jsxs("div",{className:"flex justify-between",children:[e.jsx(O,{size:"sm",onClick:()=>W(),variant:"link",className:"px-0",children:l("common.filters.buttons.all")}),e.jsx(O,{size:"sm",onClick:()=>$(),variant:"link",className:"px-0",children:l("common.filters.buttons.none")})]}),e.jsx("div",{children:x?Array.from({length:3},(o,s)=>e.jsxs("div",{className:"flex justify-between items-center py-2 space-x-2",children:[e.jsx(w,{className:"w-full h-6 rounded"}),e.jsx(w,{className:"h-6 w-12 rounded-md"})]},`skeleton-${s}`)):a.length===0?e.jsx("div",{className:"text-muted-foreground text-center py-4",children:l("common.filters.noValuesFound")}):Array.from({length:h},(o,s)=>e.jsx("div",{className:"space-y-3 pt-2",children:e.jsxs("div",{className:"flex justify-between items-center",children:[e.jsxs("label",{className:"flex items-center space-x-2 overflow-hidden",children:[e.jsx(oe,{className:"w-4 h-4",checked:i.some(u=>u===a[s].key),onCheckedChange:()=>P(a[s])}),e.jsx("div",{className:"overflow-hidden text-ellipsis text-sm",children:a[s].key}),e.jsx("span",{className:"checkmark"})]}),e.jsx("span",{className:"bg-accent px-2 py-1 rounded-md text-xs",children:le(a[s].count||0)})]})},a[s].key))}),!x&&a.length>h&&e.jsx(O,{className:"mt-2 px-0",onClick:G,size:"sm",variant:"link",children:l("common.filters.buttons.showMore")}),e.jsx(ue,{className:"my-4 border-border",id:`${t.key}_divider`}),e.jsxs("div",{className:"flex align-right justify-end items-center space-x-2",children:[e.jsx(O,{size:"xs",variant:"ghost",onClick:J,disabled:!D||x,children:l("common.filters.buttons.clear")}),e.jsx("div",{className:"flex space-x-2",children:e.jsx(ne,{size:"xs",className:"h-7",color:"primary",actions:[{label:l("common.filters.buttons.someNotIn"),onClick:Z},{label:l("common.filters.buttons.all"),onClick:Y},{label:l("common.filters.buttons.notIn"),onClick:X}],onDefaultAction:K,disabled:x,children:l("common.filters.buttons.apply")})})]})]})}g.__docgenInfo={description:"",methods:[],displayName:"MultiSelectFilter",props:{field:{required:!0,tsType:{name:"AggregationConfig"},description:""},maxVisibleItems:{required:!1,tsType:{name:"number"},description:"",defaultValue:{value:"10",computed:!1}},searchVisible:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"false",computed:!1}}}};const L={variant_entity:{app_id:"variant_entity_multi_select_filter",aggregations:[{key:"chromosome",type:"multiple"},{key:"filter",type:"multiple"},{key:"zygosity",type:"multiple"},{key:"impact_score",type:"multiple"},{key:"variant_class",type:"multiple"},{key:"symbol",type:"multiple"}]}},Ge={title:"Feature/Query Filters/Multi Select",component:g,tags:["autodocs"],args:{data:[],field:{key:"chromosome",type:"multiple"},maxVisibleItems:10,searchVisible:!0},decorators:[t=>e.jsx(ie,{config:L,children:e.jsx(t,{})})]},j={args:{data:[{key:"Option 1",count:100},{key:"Option 2",count:200},{key:"Option 3",count:300},{key:"Option 4",count:400},{key:"Option 5",count:500},{key:"Option 6",count:600}],appliedItems:[]},render:t=>e.jsx("div",{className:"space-y-6",children:e.jsx(g,{...t})})},S={args:{data:[{key:"Option6",count:600},{key:"Option5",count:500},{key:"Option4",count:400},{key:"Option3",count:300},{key:"Option2",count:200},{key:"Option1",count:100}]},render:t=>(te("activeQuery")(N.updateActiveQueryField(L.variant_entity.app_id,{field:"chromosome",value:["Option1","Option4"]})),e.jsx("div",{className:"space-y-6",children:e.jsx(g,{...t})}))},C={args:{data:[{key:"Option6",count:600},{key:"Option5",count:500}],searchVisible:!1},render:t=>e.jsx("div",{className:"space-y-6",children:e.jsx(g,{...t})})};var E,B,Q;j.parameters={...j.parameters,docs:{...(E=j.parameters)==null?void 0:E.docs,source:{originalSource:`{
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
}`,...(Q=(B=j.parameters)==null?void 0:B.docs)==null?void 0:Q.source}}};var M,R,q;S.parameters={...S.parameters,docs:{...(M=S.parameters)==null?void 0:M.docs,source:{originalSource:`{
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
    action('activeQuery')(queryBuilderRemote.updateActiveQueryField(config.variant_entity.app_id, {
      field: 'chromosome',
      value: ['Option1', 'Option4']
    }));
    return <div className="space-y-6">
        <MultiSelectFilter {...args} />
      </div>;
  }
}`,...(q=(R=S.parameters)==null?void 0:R.docs)==null?void 0:q.source}}};var T,V,z;C.parameters={...C.parameters,docs:{...(T=C.parameters)==null?void 0:T.docs,source:{originalSource:`{
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
}`,...(z=(V=C.parameters)==null?void 0:V.docs)==null?void 0:z.source}}};const We=["Default","DataAppliedToQueryBuilder","HiddenSearch"];export{S as DataAppliedToQueryBuilder,j as Default,C as HiddenSearch,We as __namedExportsOrder,Ge as default};
