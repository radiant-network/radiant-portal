import{j as e}from"./jsx-runtime-D_zvdyIk.js";import{a as se}from"./index-B-lxVbXh.js";import{q as _,M as oe,T as j}from"./query-builder-remote-DtM-qwOk.js";import{r as o}from"./index-DQLiH3RP.js";import{B as v}from"./button-Bpnaj0wn.js";import{C as re}from"./checkbox-CO27iIkV.js";import{I as ae}from"./input-DyY2UfVx.js";import{A as ne}from"./ActionButton-B-iQPL2P.js";import"./button.variants-Czj0iLzG.js";import{u as le,C as ie}from"./applications-config-pyPLye2e.js";import{n as ce}from"./number-format-BmdRvOec.js";import{u as pe}from"./i18n-DgY5s2Uj.js";import{S as ue}from"./separator-DcuX0n1V.js";import{u as me,o as de}from"./index-CFg4j3eJ.js";import{S as w}from"./skeleton-Shk8p_SP.js";import"./v4-CtRu48qb.js";import"./api-BBwyx_2W.js";import"./index-D-AYaadb.js";import"./index-CECE1b4A.js";import"./index-CJPVTaBz.js";import"./spinner-DHVcj7-u.js";import"./utils-D-KgF5mV.js";import"./createLucideIcon-BMP5cxO1.js";import"./index-DDGWSPzp.js";import"./index-C5A_jyAq.js";import"./index-C66Dxnp2.js";import"./check-DSCf8CVO.js";import"./dropdown-menu-CjEDsahn.js";import"./index-ClAAgfyD.js";import"./Combination-9qYnPkZM.js";import"./index-8F5FSkgb.js";import"./ellipsis-BtlAG3ey.js";import"./iframe-C5BP4ZpV.js";import"./index-BjfAAjgr.js";const ye=s=>de.aggregateGermlineOccurrences(s.seqId,s.aggregationBody).then(r=>r.data);function fe(s,r=30,k=!1,l){let d;k?d={seqId:"1",aggregationBody:{field:s,size:r}}:d=null;const u=_.getResolvedActiveQuery(l);return u&&d&&(d.aggregationBody.sqon={content:u.content,op:u.op}),me(d,ye,{revalidateOnFocus:!1})}function ke(s,r){return r.filter(k=>k.key.toLowerCase().includes(s.toLowerCase()))}function F(s,r){return r<s?r:s}function b({field:s,maxVisibleItems:r=5,searchVisible:k=!1}){const{t:l}=pe(),u=le().variant_exploration.app_id,{data:i,isLoading:h}=fe(s.key,void 0,!0,u),[a,A]=o.useState(i||[]),[I,U]=o.useState([]),[c,y]=o.useState([]),[f,x]=o.useState(F(a.length,r)),[$,g]=o.useState(!1);o.useEffect(()=>{let n=_.getResolvedActiveQuery(u).content.find(t=>t.content.field===s.key);y(n?n.content.value:[]),i==null||i.sort((t,p)=>{const O=t.key&&c.includes(t.key),te=p.key&&c.includes(p.key);return O===te?p.count-t.count:O?-1:1}),i==null||i.forEach(t=>{var p;t.label=(p=t.key)==null?void 0:p.replace(/_/g," ").replace(/^\w/,O=>O.toUpperCase())}),A(i||[]),x(F((i==null?void 0:i.length)||0,r))},[i,a]);const G=o.useCallback(n=>{const t=ke(n,i);r>t.length?x(t.length):t.length>r&&x(r),A(t)},[a,f,i]),H=o.useCallback(()=>{x(a.length)},[f,a]),W=o.useCallback(()=>{x(r)},[f]),D=o.useCallback(()=>{c.length!==a.length&&(g(!0),y(a.map(n=>n.key)))},[a,c]),P=o.useCallback(()=>{c.length!==0&&(g(!0),y([]))},[c]),J=o.useCallback(n=>{let t=[];c.some(p=>p===n.key)?t=c.filter(p=>p!==n.key):t=[...c,n.key],g(!0),y(t)},[c]),K=o.useCallback(()=>{g(!1),y([...I])},[I]),m=o.useCallback(n=>{g(!1),U(c),_.updateActiveQueryField(u,{field:s.key,value:[...c],merge_strategy:oe.OVERRIDE_VALUES,operator:n})},[c,u,s.key]),X=o.useCallback(()=>{m(j.In)},[m]),Y=o.useCallback(()=>{m(j.NotIn)},[m]),Z=o.useCallback(()=>{m(j.All)},[m]),ee=o.useCallback(()=>{m(j.In)},[m]);return e.jsxs("div",{className:"p-2 w-full max-w-md",children:[k&&e.jsx(ae,{type:"text",placeholder:l("common.filters.search.placeholder"),className:"w-full p-2 mb-2 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500",onChange:n=>G(n.target.value),autoFocus:!0}),e.jsxs("div",{className:"flex justify-between",children:[e.jsx(v,{size:"sm",onClick:()=>D(),variant:"link",className:"px-0",children:l("common.filters.buttons.all")}),e.jsx(v,{size:"sm",onClick:()=>P(),variant:"link",className:"px-0",children:l("common.filters.buttons.none")})]}),e.jsx("div",{className:"max-h-[250px] overflow-auto",children:h?Array.from({length:3},(n,t)=>e.jsxs("div",{className:"flex justify-between items-center py-2 space-x-2",children:[e.jsx(w,{className:"w-full h-6 rounded"}),e.jsx(w,{className:"h-6 w-12 rounded-md"})]},`skeleton-${t}`)):a.length===0?e.jsx("div",{className:"text-muted-foreground text-center py-4",children:l("common.filters.noValuesFound")}):Array.from({length:f},(n,t)=>e.jsx("div",{className:"space-y-3 pt-2",children:e.jsxs("div",{className:"flex justify-between items-top",children:[e.jsxs("label",{className:"flex items-center space-x-2 overflow-hidden",children:[e.jsx(re,{className:"w-4 h-4",checked:c.some(p=>p===a[t].key),onCheckedChange:()=>J(a[t])}),e.jsx("div",{className:"overflow-hidden text-xs whitespace-normal break-words",children:l(`common.filters.labels.${s.key}_value.${a[t].key}`,{defaultValue:a[t].label})}),e.jsx("span",{className:"checkmark"})]}),e.jsx("span",{className:"bg-accent px-2 pb-1 rounded-md text-xs items-top",children:ce(a[t].count||0)})]})},a[t].key))}),!h&&a.length>f&&e.jsx(v,{className:"mt-2 px-0",onClick:H,size:"sm",variant:"link",children:l("common.filters.buttons.showMore",{count:a.length-r})}),!h&&f>r&&e.jsx(v,{className:"mt-2 px-0",onClick:W,size:"sm",variant:"link",children:l("common.filters.buttons.showLess")}),e.jsx(ue,{className:"my-4 border-border",id:`${s.key}_divider`}),e.jsxs("div",{className:"flex align-right justify-end items-center space-x-2",children:[e.jsx(v,{size:"xs",variant:"ghost",onClick:K,disabled:!$||h,children:l("common.filters.buttons.clear")}),e.jsx("div",{className:"flex space-x-2",children:e.jsx(ne,{size:"xs",className:"h-7",color:"primary",actions:[{label:l("common.filters.buttons.someNotIn"),onClick:ee},{label:l("common.filters.buttons.all"),onClick:Z},{label:l("common.filters.buttons.notIn"),onClick:Y}],onDefaultAction:X,disabled:h,children:l("common.filters.buttons.apply")})})]})]})}b.__docgenInfo={description:"",methods:[],displayName:"MultiSelectFilter",props:{field:{required:!0,tsType:{name:"AggregationConfig"},description:""},maxVisibleItems:{required:!1,tsType:{name:"number"},description:"",defaultValue:{value:"5",computed:!1}},searchVisible:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"false",computed:!1}}}};const V={variant_exploration:{app_id:"variant_exploration_multi_select_filter",aggregations:[{key:"chromosome",type:"multiple"},{key:"filter",type:"multiple"},{key:"zygosity",type:"multiple"},{key:"impact_score",type:"multiple"},{key:"variant_class",type:"multiple"},{key:"symbol",type:"multiple"}]}},Xe={title:"Feature/Query Filters/Multi Select",component:b,args:{data:[],field:{key:"chromosome",type:"multiple"},maxVisibleItems:10,searchVisible:!0},decorators:[s=>e.jsx(ie,{config:V,children:e.jsx(s,{})})]},C={args:{data:[{key:"Option 1",count:100},{key:"Option 2",count:200},{key:"Option 3",count:300},{key:"Option 4",count:400},{key:"Option 5",count:500},{key:"Option 6",count:600}],appliedItems:[]},render:s=>e.jsx("div",{className:"space-y-6",children:e.jsx(b,{...s})})},S={args:{data:[{key:"Option6",count:600},{key:"Option5",count:500},{key:"Option4",count:400},{key:"Option3",count:300},{key:"Option2",count:200},{key:"Option1",count:100}]},render:s=>(se("activeQuery")(_.updateActiveQueryField(V.variant_exploration.app_id,{field:"chromosome",value:["Option1","Option4"]})),e.jsx("div",{className:"space-y-6",children:e.jsx(b,{...s})}))},N={args:{data:[{key:"Option6",count:600},{key:"Option5",count:500}],searchVisible:!1},render:s=>e.jsx("div",{className:"space-y-6",children:e.jsx(b,{...s})})};var E,B,Q;C.parameters={...C.parameters,docs:{...(E=C.parameters)==null?void 0:E.docs,source:{originalSource:`{
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
}`,...(Q=(B=C.parameters)==null?void 0:B.docs)==null?void 0:Q.source}}};var M,R,q;S.parameters={...S.parameters,docs:{...(M=S.parameters)==null?void 0:M.docs,source:{originalSource:`{
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
}`,...(q=(R=S.parameters)==null?void 0:R.docs)==null?void 0:q.source}}};var T,z,L;N.parameters={...N.parameters,docs:{...(T=N.parameters)==null?void 0:T.docs,source:{originalSource:`{
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
}`,...(L=(z=N.parameters)==null?void 0:z.docs)==null?void 0:L.source}}};const Ye=["Default","DataAppliedToQueryBuilder","HiddenSearch"];export{S as DataAppliedToQueryBuilder,C as Default,N as HiddenSearch,Ye as __namedExportsOrder,Xe as default};
