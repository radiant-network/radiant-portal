import{j as e}from"./jsx-runtime-Cf8x2fCZ.js";import{a as se}from"./index-B-lxVbXh.js";import{q as N,M as oe,T as O}from"./query-builder-remote-CS3_tUp_.js";import{r as o}from"./index-tvICUrOf.js";import{B as v}from"./button-68tiabAR.js";import{C as re}from"./checkbox-DR5AvqL2.js";import{I as ne}from"./input-OUxWDfFO.js";import{A as ae}from"./ActionButton-B7qNdG6r.js";import"./button.variants-B79LQKoe.js";import{u as ie,C as le}from"./applications-config-B4jBJrF9.js";import{n as ce}from"./number-format-BmdRvOec.js";import{u as ue}from"./i18n-MggCXO7A.js";import{S as pe}from"./separator-yfEj2UAP.js";import{u as me,o as de}from"./index-Dj_M_ICw.js";import{S as w}from"./skeleton-CfkhzHGY.js";import"./index-yBjzXJbu.js";import"./v4-CtRu48qb.js";import"./api-CkzL9HmQ.js";import"./index-Csi1vtvD.js";import"./index-_r67kdfS.js";import"./index-fNjTmf9T.js";import"./spinner-Bn71UZIB.js";import"./utils-CytzSlOG.js";import"./createLucideIcon-DKFpjrVJ.js";import"./index-C1xbsqtW.js";import"./index-DJkr1wGX.js";import"./index-pLOVI5Ig.js";import"./index-C66Dxnp2.js";import"./check-CfPT3E_d.js";import"./dropdown-menu-It6xAzeJ.js";import"./index-CJn4dinJ.js";import"./Combination-e2pxAl-M.js";import"./index-D-y1Urua.js";import"./ellipsis-NIzCCAdy.js";import"./iframe-BFNJTLRN.js";import"./index-BNh7Aicb.js";const ye=t=>de.aggregateOccurrences(t.seqId,t.aggregationBody).then(r=>r.data);function fe(t,r=30,k=!1,i){let d;k?d={seqId:"1",aggregationBody:{field:t,size:r}}:d=null;const p=N.getResolvedActiveQuery(i);return p&&d&&(d.aggregationBody.sqon={content:p.content,op:p.op}),me(d,ye,{revalidateOnFocus:!1})}function ke(t,r){return r.filter(k=>k.key.toLowerCase().includes(t.toLowerCase()))}function F(t,r){return r<t?r:t}function b({field:t,maxVisibleItems:r=5,searchVisible:k=!1}){const{t:i}=ue(),p=ie().variant_exploration.app_id,{data:c,isLoading:g}=fe(t.key,void 0,!0,p),[n,_]=o.useState(c||[]),[A,U]=o.useState([]),[l,y]=o.useState([]),[f,h]=o.useState(F(n.length,r)),[$,x]=o.useState(!1);o.useEffect(()=>{let a=N.getResolvedActiveQuery(p).content.find(s=>s.content.field===t.key);y(a?a.content.value:[]),c==null||c.sort((s,u)=>{const I=s.key&&l.includes(s.key),te=u.key&&l.includes(u.key);return I===te?u.count-s.count:I?-1:1}),_(c||[]),h(F((c==null?void 0:c.length)||0,r))},[c]);const D=o.useCallback(a=>{const s=ke(a,c);r>s.length?h(s.length):s.length>r&&h(r),_(s)},[n,f,c]),H=o.useCallback(()=>{h(n.length)},[f,n]),G=o.useCallback(()=>{h(r)},[f]),W=o.useCallback(()=>{l.length!==n.length&&(x(!0),y(n.map(a=>a.key)))},[n,l]),P=o.useCallback(()=>{l.length!==0&&(x(!0),y([]))},[l]),J=o.useCallback(a=>{let s=[];l.some(u=>u===a.key)?s=l.filter(u=>u!==a.key):s=[...l,a.key],x(!0),y(s)},[l]),K=o.useCallback(()=>{x(!1),y([...A])},[A]),m=o.useCallback(a=>{x(!1),U(l),N.updateActiveQueryField(p,{field:t.key,value:[...l],merge_strategy:oe.OVERRIDE_VALUES,operator:a})},[l,p,t.key]),X=o.useCallback(()=>{m(O.In)},[m]),Y=o.useCallback(()=>{m(O.NotIn)},[m]),Z=o.useCallback(()=>{m(O.All)},[m]),ee=o.useCallback(()=>{m(O.In)},[m]);return e.jsxs("div",{className:"p-2 w-full max-w-md",children:[k&&e.jsx(ne,{type:"text",placeholder:i("common.filters.search.placeholder"),className:"w-full p-2 mb-2 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500",onChange:a=>D(a.target.value),autoFocus:!0}),e.jsxs("div",{className:"flex justify-between",children:[e.jsx(v,{size:"sm",onClick:()=>W(),variant:"link",className:"px-0",children:i("common.filters.buttons.all")}),e.jsx(v,{size:"sm",onClick:()=>P(),variant:"link",className:"px-0",children:i("common.filters.buttons.none")})]}),e.jsx("div",{children:g?Array.from({length:3},(a,s)=>e.jsxs("div",{className:"flex justify-between items-center py-2 space-x-2",children:[e.jsx(w,{className:"w-full h-6 rounded"}),e.jsx(w,{className:"h-6 w-12 rounded-md"})]},`skeleton-${s}`)):n.length===0?e.jsx("div",{className:"text-muted-foreground text-center py-4",children:i("common.filters.noValuesFound")}):Array.from({length:f},(a,s)=>e.jsx("div",{className:"space-y-3 pt-2",children:e.jsxs("div",{className:"flex justify-between items-center",children:[e.jsxs("label",{className:"flex items-center space-x-2 overflow-hidden",children:[e.jsx(re,{className:"w-4 h-4",checked:l.some(u=>u===n[s].key),onCheckedChange:()=>J(n[s])}),e.jsx("div",{className:"overflow-hidden text-ellipsis text-sm",children:i(`common.filters.labels.${t.key}_value.${n[s].key}`,{defaultValue:n[s].key})}),e.jsx("span",{className:"checkmark"})]}),e.jsx("span",{className:"bg-accent px-2 py-1 rounded-md text-xs",children:ce(n[s].count||0)})]})},n[s].key))}),!g&&n.length>f&&e.jsx(v,{className:"mt-2 px-0",onClick:H,size:"sm",variant:"link",children:i("common.filters.buttons.showMore",{count:n.length-r})}),!g&&f>r&&e.jsx(v,{className:"mt-2 px-0",onClick:G,size:"sm",variant:"link",children:i("common.filters.buttons.showLess")}),e.jsx(pe,{className:"my-4 border-border",id:`${t.key}_divider`}),e.jsxs("div",{className:"flex align-right justify-end items-center space-x-2",children:[e.jsx(v,{size:"xs",variant:"ghost",onClick:K,disabled:!$||g,children:i("common.filters.buttons.clear")}),e.jsx("div",{className:"flex space-x-2",children:e.jsx(ae,{size:"xs",className:"h-7",color:"primary",actions:[{label:i("common.filters.buttons.someNotIn"),onClick:ee},{label:i("common.filters.buttons.all"),onClick:Z},{label:i("common.filters.buttons.notIn"),onClick:Y}],onDefaultAction:X,disabled:g,children:i("common.filters.buttons.apply")})})]})]})}b.__docgenInfo={description:"",methods:[],displayName:"MultiSelectFilter",props:{field:{required:!0,tsType:{name:"AggregationConfig"},description:""},aggregation:{required:!0,tsType:{name:"AggregationConfig"},description:""},maxVisibleItems:{required:!1,tsType:{name:"number"},description:"",defaultValue:{value:"5",computed:!1}},searchVisible:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"false",computed:!1}}}};const V={variant_exploration:{app_id:"variant_exploration_multi_select_filter",aggregations:[{key:"chromosome",type:"multiple"},{key:"filter",type:"multiple"},{key:"zygosity",type:"multiple"},{key:"impact_score",type:"multiple"},{key:"variant_class",type:"multiple"},{key:"symbol",type:"multiple"}]}},Ze={title:"Feature/Query Filters/Multi Select",component:b,args:{data:[],field:{key:"chromosome",type:"multiple"},maxVisibleItems:10,searchVisible:!0},decorators:[t=>e.jsx(le,{config:V,children:e.jsx(t,{})})]},j={args:{data:[{key:"Option 1",count:100},{key:"Option 2",count:200},{key:"Option 3",count:300},{key:"Option 4",count:400},{key:"Option 5",count:500},{key:"Option 6",count:600}],appliedItems:[]},render:t=>e.jsx("div",{className:"space-y-6",children:e.jsx(b,{...t})})},C={args:{data:[{key:"Option6",count:600},{key:"Option5",count:500},{key:"Option4",count:400},{key:"Option3",count:300},{key:"Option2",count:200},{key:"Option1",count:100}]},render:t=>(se("activeQuery")(N.updateActiveQueryField(V.variant_exploration.app_id,{field:"chromosome",value:["Option1","Option4"]})),e.jsx("div",{className:"space-y-6",children:e.jsx(b,{...t})}))},S={args:{data:[{key:"Option6",count:600},{key:"Option5",count:500}],searchVisible:!1},render:t=>e.jsx("div",{className:"space-y-6",children:e.jsx(b,{...t})})};var E,B,Q;j.parameters={...j.parameters,docs:{...(E=j.parameters)==null?void 0:E.docs,source:{originalSource:`{
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
}`,...(Q=(B=j.parameters)==null?void 0:B.docs)==null?void 0:Q.source}}};var q,M,R;C.parameters={...C.parameters,docs:{...(q=C.parameters)==null?void 0:q.docs,source:{originalSource:`{
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
}`,...(R=(M=C.parameters)==null?void 0:M.docs)==null?void 0:R.source}}};var T,z,L;S.parameters={...S.parameters,docs:{...(T=S.parameters)==null?void 0:T.docs,source:{originalSource:`{
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
}`,...(L=(z=S.parameters)==null?void 0:z.docs)==null?void 0:L.source}}};const et=["Default","DataAppliedToQueryBuilder","HiddenSearch"];export{C as DataAppliedToQueryBuilder,j as Default,S as HiddenSearch,et as __namedExportsOrder,Ze as default};
