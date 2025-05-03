import{j as e}from"./jsx-runtime-Cf8x2fCZ.js";import{a as se}from"./index-B-lxVbXh.js";import{q as N,M as oe,T as O}from"./query-builder-remote-B4cmNCt2.js";import{r as o}from"./index-tvICUrOf.js";import{B as v}from"./button-UnRZVMn5.js";import{C as re}from"./checkbox-DR5AvqL2.js";import{I as ne}from"./input-BBA0CWHH.js";import{A as ae}from"./ActionButton-C_4cAaVG.js";import"./button.variants-B79LQKoe.js";import{u as ie,C as le}from"./applications-config-B4jBJrF9.js";import{n as ce}from"./number-format-BmdRvOec.js";import{u as pe}from"./i18n-B2VE3WEc.js";import{S as ue}from"./separator-yfEj2UAP.js";import{u as me,o as de}from"./api-Z6Zm4Nd5.js";import{S as w}from"./skeleton-CfkhzHGY.js";import"./index-yBjzXJbu.js";import"./v4-CtRu48qb.js";import"./api-BXyW3p6F.js";import"./index-Csi1vtvD.js";import"./index-_r67kdfS.js";import"./index-fNjTmf9T.js";import"./spinner-Bn71UZIB.js";import"./utils-CytzSlOG.js";import"./createLucideIcon-DKFpjrVJ.js";import"./index-C1xbsqtW.js";import"./index-DJkr1wGX.js";import"./index-pLOVI5Ig.js";import"./index-C66Dxnp2.js";import"./check-CfPT3E_d.js";import"./dropdown-menu-BtHca8-r.js";import"./Combination-CmKP2mMJ.js";import"./index-CueSDTQu.js";import"./ellipsis-NIzCCAdy.js";import"./iframe-CX65qRWW.js";import"./index-BNh7Aicb.js";const ye=t=>de.aggregateOccurrences(t.seqId,t.aggregationBody).then(r=>r.data);function fe(t,r=30,k=!1,l){let d;k?d={seqId:"5011",aggregationBody:{field:t,size:r}}:d=null;const u=N.getResolvedActiveQuery(l);return u&&d&&(d.aggregationBody.sqon={content:u.content,op:u.op}),me(d,ye,{revalidateOnFocus:!1})}function ke(t,r){return r.filter(k=>k.key.toLowerCase().includes(t.toLowerCase()))}function F(t,r){return r<t?r:t}function b({field:t,maxVisibleItems:r=5,searchVisible:k=!1}){const{t:l}=pe(),u=ie().variant_exploration.app_id,{data:c,isLoading:h}=fe(t.key,void 0,!0,u),[a,_]=o.useState(c||[]),[A,U]=o.useState([]),[i,y]=o.useState([]),[f,g]=o.useState(F(a.length,r)),[D,x]=o.useState(!1);o.useEffect(()=>{let n=N.getResolvedActiveQuery(u).content.find(s=>s.content.field===t.key);y(n?n.content.value:[]),c==null||c.sort((s,p)=>{const I=s.key&&i.includes(s.key),te=p.key&&i.includes(p.key);return I===te?p.count-s.count:I?-1:1}),_(c||[]),g(F((c==null?void 0:c.length)||0,r))},[c]);const H=o.useCallback(n=>{const s=ke(n,c);r>s.length?g(s.length):s.length>r&&g(r),_(s)},[a,f,c]),G=o.useCallback(()=>{g(a.length)},[f,a]),W=o.useCallback(()=>{g(r)},[f]),$=o.useCallback(()=>{i.length!==a.length&&(x(!0),y(a.map(n=>n.key)))},[a,i]),P=o.useCallback(()=>{i.length!==0&&(x(!0),y([]))},[i]),J=o.useCallback(n=>{let s=[];i.some(p=>p===n.key)?s=i.filter(p=>p!==n.key):s=[...i,n.key],x(!0),y(s)},[i]),K=o.useCallback(()=>{x(!1),y([...A])},[A]),m=o.useCallback(n=>{x(!1),U(i),N.updateActiveQueryField(u,{field:t.key,value:[...i],merge_strategy:oe.OVERRIDE_VALUES,operator:n})},[i,u,t.key]),X=o.useCallback(()=>{m(O.In)},[m]),Y=o.useCallback(()=>{m(O.NotIn)},[m]),Z=o.useCallback(()=>{m(O.All)},[m]),ee=o.useCallback(()=>{m(O.In)},[m]);return e.jsxs("div",{className:"p-2 w-full max-w-md",children:[k&&e.jsx(ne,{type:"text",placeholder:l("common.filters.search.placeholder"),className:"w-full p-2 mb-2 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500",onChange:n=>H(n.target.value)}),e.jsxs("div",{className:"flex justify-between",children:[e.jsx(v,{size:"sm",onClick:()=>$(),variant:"link",className:"px-0",children:l("common.filters.buttons.all")}),e.jsx(v,{size:"sm",onClick:()=>P(),variant:"link",className:"px-0",children:l("common.filters.buttons.none")})]}),e.jsx("div",{children:h?Array.from({length:3},(n,s)=>e.jsxs("div",{className:"flex justify-between items-center py-2 space-x-2",children:[e.jsx(w,{className:"w-full h-6 rounded"}),e.jsx(w,{className:"h-6 w-12 rounded-md"})]},`skeleton-${s}`)):a.length===0?e.jsx("div",{className:"text-muted-foreground text-center py-4",children:l("common.filters.noValuesFound")}):Array.from({length:f},(n,s)=>e.jsx("div",{className:"space-y-3 pt-2",children:e.jsxs("div",{className:"flex justify-between items-center",children:[e.jsxs("label",{className:"flex items-center space-x-2 overflow-hidden",children:[e.jsx(re,{className:"w-4 h-4",checked:i.some(p=>p===a[s].key),onCheckedChange:()=>J(a[s])}),e.jsx("div",{className:"overflow-hidden text-ellipsis text-sm",children:a[s].key}),e.jsx("span",{className:"checkmark"})]}),e.jsx("span",{className:"bg-accent px-2 py-1 rounded-md text-xs",children:ce(a[s].count||0)})]})},a[s].key))}),!h&&a.length>f&&e.jsx(v,{className:"mt-2 px-0",onClick:G,size:"sm",variant:"link",children:l("common.filters.buttons.showMore",{count:a.length-r})}),!h&&f>r&&e.jsx(v,{className:"mt-2 px-0",onClick:W,size:"sm",variant:"link",children:l("common.filters.buttons.showLess")}),e.jsx(ue,{className:"my-4 border-border",id:`${t.key}_divider`}),e.jsxs("div",{className:"flex align-right justify-end items-center space-x-2",children:[e.jsx(v,{size:"xs",variant:"ghost",onClick:K,disabled:!D||h,children:l("common.filters.buttons.clear")}),e.jsx("div",{className:"flex space-x-2",children:e.jsx(ae,{size:"xs",className:"h-7",color:"primary",actions:[{label:l("common.filters.buttons.someNotIn"),onClick:ee},{label:l("common.filters.buttons.all"),onClick:Z},{label:l("common.filters.buttons.notIn"),onClick:Y}],onDefaultAction:X,disabled:h,children:l("common.filters.buttons.apply")})})]})]})}b.__docgenInfo={description:"",methods:[],displayName:"MultiSelectFilter",props:{field:{required:!0,tsType:{name:"AggregationConfig"},description:""},maxVisibleItems:{required:!1,tsType:{name:"number"},description:"",defaultValue:{value:"5",computed:!1}},searchVisible:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"false",computed:!1}}}};const V={variant_exploration:{app_id:"variant_exploration_multi_select_filter",aggregations:[{key:"chromosome",type:"multiple"},{key:"filter",type:"multiple"},{key:"zygosity",type:"multiple"},{key:"impact_score",type:"multiple"},{key:"variant_class",type:"multiple"},{key:"symbol",type:"multiple"}]}},Ye={title:"Feature/Query Filters/Multi Select",component:b,args:{data:[],field:{key:"chromosome",type:"multiple"},maxVisibleItems:10,searchVisible:!0},decorators:[t=>e.jsx(le,{config:V,children:e.jsx(t,{})})]},j={args:{data:[{key:"Option 1",count:100},{key:"Option 2",count:200},{key:"Option 3",count:300},{key:"Option 4",count:400},{key:"Option 5",count:500},{key:"Option 6",count:600}],appliedItems:[]},render:t=>e.jsx("div",{className:"space-y-6",children:e.jsx(b,{...t})})},S={args:{data:[{key:"Option6",count:600},{key:"Option5",count:500},{key:"Option4",count:400},{key:"Option3",count:300},{key:"Option2",count:200},{key:"Option1",count:100}]},render:t=>(se("activeQuery")(N.updateActiveQueryField(V.variant_exploration.app_id,{field:"chromosome",value:["Option1","Option4"]})),e.jsx("div",{className:"space-y-6",children:e.jsx(b,{...t})}))},C={args:{data:[{key:"Option6",count:600},{key:"Option5",count:500}],searchVisible:!1},render:t=>e.jsx("div",{className:"space-y-6",children:e.jsx(b,{...t})})};var E,B,Q;j.parameters={...j.parameters,docs:{...(E=j.parameters)==null?void 0:E.docs,source:{originalSource:`{
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
    action('activeQuery')(queryBuilderRemote.updateActiveQueryField(config.variant_exploration.app_id, {
      field: 'chromosome',
      value: ['Option1', 'Option4']
    }));
    return <div className="space-y-6">
        <MultiSelectFilter {...args} />
      </div>;
  }
}`,...(q=(R=S.parameters)==null?void 0:R.docs)==null?void 0:q.source}}};var T,z,L;C.parameters={...C.parameters,docs:{...(T=C.parameters)==null?void 0:T.docs,source:{originalSource:`{
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
}`,...(L=(z=C.parameters)==null?void 0:z.docs)==null?void 0:L.source}}};const Ze=["Default","DataAppliedToQueryBuilder","HiddenSearch"];export{S as DataAppliedToQueryBuilder,j as Default,C as HiddenSearch,Ze as __namedExportsOrder,Ye as default};
