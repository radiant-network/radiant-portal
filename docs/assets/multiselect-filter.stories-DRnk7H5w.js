import{j as e}from"./jsx-runtime-Cf8x2fCZ.js";import{a as Z}from"./index-B-lxVbXh.js";import{q as C,M as ee,T as x}from"./query-builder-remote-Bzymk9lJ.js";import{r}from"./index-tvICUrOf.js";import{B as b}from"./button-CrKCvLOn.js";import{C as te}from"./checkbox-Yaa9_JVB.js";import{I as se}from"./input-aUNQvU1u.js";import{A as oe}from"./ActionButton-DRj5dfdv.js";import{u as re,C as ne}from"./applications-config-B4jBJrF9.js";import{n as ae}from"./number-format-HGT0qunz.js";import{u as ie}from"./i18n-BK_BOcFt.js";import{S as le}from"./separator-BGBJYV95.js";import{u as ce,o as ue}from"./api-D6S2JuOj.js";import"./index-yBjzXJbu.js";import"./v4-CtRu48qb.js";import"./api-BKFoIFaX.js";import"./index-Dq5VjjLd.js";import"./index-_r67kdfS.js";import"./index-fNjTmf9T.js";import"./utils-BNf5BS2b.js";import"./createLucideIcon-DKFpjrVJ.js";import"./index-C1xbsqtW.js";import"./index-y2NRHbXQ.js";import"./check-DKX_pDN6.js";import"./index-C66Dxnp2.js";import"./dropdown-menu-waw6TUZR.js";import"./Combination-DL__bl4O.js";import"./iframe-C8conwkP.js";const pe=t=>ue.aggregateOccurrences(t.seqId,t.aggregationBody).then(n=>n.data);function de(t,n=30,k=!1,l){let m;k?m={seqId:"5011",aggregationBody:{field:t,size:n}}:m=null;const p=C.getResolvedActiveQuery(l);return p&&m&&(m.aggregationBody.sqon={content:p.content,op:p.op}),ce(m,pe,{revalidateOnFocus:!1})}function me(t,n){return n.filter(k=>k.key.toLowerCase().includes(t.toLowerCase()))}function A(t,n){return n<t?n:t}function h({field:t,maxVisibleItems:n=10,searchVisible:k=!1}){const{t:l}=ie(),p=re().variant_entity.app_id,{data:c,isLoading:ye}=de(t.key,void 0,!0,p),[a,N]=r.useState(c||[]),[I,z]=r.useState([]),[i,y]=r.useState([]),[g,v]=r.useState(A(a.length,n)),[L,f]=r.useState(!1);r.useEffect(()=>{let o=C.getResolvedActiveQuery(p).content.find(s=>s.content.field===t.key);y(o?o.content.value:[]),c==null||c.sort((s,u)=>{const _=s.key&&i.includes(s.key),Y=u.key&&i.includes(u.key);return _===Y?u.count-s.count:_?-1:1}),N(c||[]),v(A((c==null?void 0:c.length)||0,n))},[c]);const U=r.useCallback(o=>{const s=me(o,c);n>s.length?v(s.length):s.length>n&&v(n),N(s)},[a,g,c]),D=r.useCallback(()=>{let o=g+n;f(!0),v(o>a.length?a.length:o)},[g,a]),H=r.useCallback(()=>{i.length!==a.length&&(f(!0),y(a.map(o=>o.key)))},[a,i]),G=r.useCallback(()=>{i.length!==0&&(f(!0),y([]))},[i]),W=r.useCallback(o=>{let s=[];i.some(u=>u===o.key)?s=i.filter(u=>u!==o.key):s=[...i,o.key],f(!0),y(s)},[i]),P=r.useCallback(()=>{f(!1),y([...I])},[I]),d=r.useCallback(o=>{f(!1),z(i),C.updateActiveQueryField(p,{field:t.key,value:[...i],merge_strategy:ee.OVERRIDE_VALUES,operator:o})},[i,p,t.key]),$=r.useCallback(()=>{d(x.In)},[d]),J=r.useCallback(()=>{d(x.NotIn)},[d]),K=r.useCallback(()=>{d(x.All)},[d]),X=r.useCallback(()=>{d(x.SomeNotIn)},[d]);return e.jsxs("div",{className:"p-2 w-full max-w-md",children:[k&&e.jsx(se,{type:"text",placeholder:l("common.filters.search.placeholder"),className:"w-full p-2 mb-2 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500",onChange:o=>U(o.target.value)}),e.jsxs("div",{className:"flex justify-between",children:[e.jsx(b,{size:"sm",onClick:()=>H(),variant:"link",className:"px-0",children:l("common.filters.buttons.all")}),e.jsx(b,{size:"sm",onClick:()=>G(),variant:"link",className:"px-0",children:l("common.filters.buttons.none")})]}),e.jsx("div",{children:Array.from({length:g},(o,s)=>e.jsx("div",{className:"space-y-3 pt-2",children:e.jsxs("div",{className:"flex justify-between items-center",children:[e.jsxs("label",{className:"flex items-center space-x-2 overflow-hidden",children:[e.jsx(te,{className:"w-4 h-4",checked:i.some(u=>u===a[s].key),onCheckedChange:()=>W(a[s])}),e.jsx("div",{className:"overflow-hidden text-ellipsis",children:a[s].key}),e.jsx("span",{className:"checkmark"})]}),e.jsx("span",{className:"bg-gray-200 px-2 py-1 rounded-md text-xs",children:ae(a[s].count||0)})]})},a[s].key))}),a.length>g&&e.jsx(b,{className:"mt-2 px-0",onClick:D,size:"sm",variant:"link",children:l("common.filters.buttons.showMore")}),e.jsx(le,{className:"my-4 border-border",id:`${t.key}_divider`}),e.jsxs("div",{className:"flex align-right justify-end items-center space-x-2",children:[e.jsx(b,{size:"xs",variant:"ghost",onClick:P,disabled:!L,children:l("common.filters.buttons.clear")}),e.jsx("div",{className:"flex space-x-2",children:e.jsx(oe,{size:"xs",className:"h-7",color:"primary",actions:[{label:l("common.filters.buttons.someNotIn"),onClick:X},{label:l("common.filters.buttons.all"),onClick:K},{label:l("common.filters.buttons.notIn"),onClick:J}],onDefaultAction:$,children:l("common.filters.buttons.apply")})})]})]})}h.__docgenInfo={description:"",methods:[],displayName:"MultiSelectFilter",props:{field:{required:!0,tsType:{name:"AggregationConfig"},description:""},maxVisibleItems:{required:!1,tsType:{name:"number"},description:"",defaultValue:{value:"10",computed:!1}},searchVisible:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"false",computed:!1}}}};const V={variant_entity:{app_id:"variant_entity_multi_select_filter",aggregations:[{key:"chromosome",type:"multiple"},{key:"filter",type:"multiple"},{key:"zygosity",type:"multiple"},{key:"impact_score",type:"multiple"},{key:"variant_class",type:"multiple"},{key:"symbol",type:"multiple"}]}},De={title:"Feature/Query Filters/Multi Select",component:h,tags:["autodocs"],args:{data:[],field:{key:"chromosome",type:"multiple"},maxVisibleItems:10,searchVisible:!0},decorators:[t=>e.jsx(ne,{config:V,children:e.jsx(t,{})})]},O={args:{data:[{key:"Option 1",count:100},{key:"Option 2",count:200},{key:"Option 3",count:300},{key:"Option 4",count:400},{key:"Option 5",count:500},{key:"Option 6",count:600}],appliedItems:[]},render:t=>e.jsx("div",{className:"space-y-6",children:e.jsx(h,{...t})})},S={args:{data:[{key:"Option6",count:600},{key:"Option5",count:500},{key:"Option4",count:400},{key:"Option3",count:300},{key:"Option2",count:200},{key:"Option1",count:100}]},render:t=>(Z("activeQuery")(C.updateActiveQueryField(V.variant_entity.app_id,{field:"chromosome",value:["Option1","Option4"]})),e.jsx("div",{className:"space-y-6",children:e.jsx(h,{...t})}))},j={args:{data:[{key:"Option6",count:600},{key:"Option5",count:500}],searchVisible:!1},render:t=>e.jsx("div",{className:"space-y-6",children:e.jsx(h,{...t})})};var w,E,F;O.parameters={...O.parameters,docs:{...(w=O.parameters)==null?void 0:w.docs,source:{originalSource:`{
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
}`,...(F=(E=O.parameters)==null?void 0:E.docs)==null?void 0:F.source}}};var B,Q,M;S.parameters={...S.parameters,docs:{...(B=S.parameters)==null?void 0:B.docs,source:{originalSource:`{
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
}`,...(M=(Q=S.parameters)==null?void 0:Q.docs)==null?void 0:M.source}}};var R,q,T;j.parameters={...j.parameters,docs:{...(R=j.parameters)==null?void 0:R.docs,source:{originalSource:`{
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
}`,...(T=(q=j.parameters)==null?void 0:q.docs)==null?void 0:T.source}}};const He=["Default","DataAppliedToQueryBuilder","HiddenSearch"];export{S as DataAppliedToQueryBuilder,O as Default,j as HiddenSearch,He as __namedExportsOrder,De as default};
