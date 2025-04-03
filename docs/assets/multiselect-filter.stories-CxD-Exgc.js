import{j as e}from"./jsx-runtime-Cf8x2fCZ.js";import{a as J}from"./index-B-lxVbXh.js";import{q as v,M as K}from"./query-builder-remote-CX5M1tSo.js";import{r as i}from"./index-tvICUrOf.js";import{B as k}from"./button-CrKCvLOn.js";import{C as W}from"./checkbox-Yaa9_JVB.js";import{I as X}from"./input-aUNQvU1u.js";import{A as Y}from"./ActionButton-DRj5dfdv.js";import{u as Z,C as $}from"./applications-config-B4jBJrF9.js";import{n as ee}from"./number-format-HGT0qunz.js";import{u as te}from"./i18n-ZdiEvoeq.js";import{S as se}from"./separator-BGBJYV95.js";import"./index-yBjzXJbu.js";import"./v4-CtRu48qb.js";import"./api-BKFoIFaX.js";import"./index-Dq5VjjLd.js";import"./index-_r67kdfS.js";import"./index-fNjTmf9T.js";import"./utils-BNf5BS2b.js";import"./createLucideIcon-DKFpjrVJ.js";import"./index-C1xbsqtW.js";import"./index-y2NRHbXQ.js";import"./check-DKX_pDN6.js";import"./index-C66Dxnp2.js";import"./dropdown-menu-waw6TUZR.js";import"./Combination-DL__bl4O.js";import"./iframe-Dl-FHSss.js";function re(t,c){return c.filter(l=>l.key.toLowerCase().includes(t.toLowerCase()))}function C(t,c){return c<t?c:t}function y({data:t,field:c,maxVisibleItems:l=10,searchVisible:T=!1}){const{t:p}=te(),[o,O]=i.useState(t||[]),[j,q]=i.useState([]),[n,u]=i.useState([]),[d,f]=i.useState(C(o.length,l)),[B,m]=i.useState(!1),S=Z().variant_entity.app_id;i.useEffect(()=>{let r=v.getResolvedActiveQuery(S).content.find(s=>s.content.field===c.key);u(r?r.content.value:[]),t==null||t.sort((s,a)=>{const b=s.key&&n.includes(s.key),P=a.key&&n.includes(a.key);return b===P?a.count-s.count:b?-1:1}),O(t||[]),f(C((t==null?void 0:t.length)||0,l))},[t]);const V=i.useCallback(r=>{const s=re(r,t);l>s.length?f(s.length):s.length>l&&f(l),O(s)},[o,d,t]),z=i.useCallback(()=>{let r=d+l;m(!0),f(r>o.length?o.length:r)},[d,o]),D=i.useCallback(()=>{n.length!==o.length&&(m(!0),u(o.map(r=>r.key)))},[o,n]),L=i.useCallback(()=>{n.length!==0&&(m(!0),u([]))},[n]),U=i.useCallback(r=>{let s=[];n.some(a=>a===r.key)?s=n.filter(a=>a!==r.key):s=[...n,r.key],m(!0),u(s)},[n]),H=i.useCallback(()=>{m(!1),u([...j])},[j]),G=i.useCallback(()=>{m(!1),q(n),v.updateActiveQueryField(S,{field:c.key,value:[...n],merge_strategy:K.OVERRIDE_VALUES})},[n]);return e.jsxs("div",{className:"p-2 w-full max-w-md",children:[T&&e.jsx(X,{type:"text",placeholder:p("common.filters.search.placeholder"),className:"w-full p-2 mb-2 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500",onChange:r=>V(r.target.value)}),e.jsxs("div",{className:"flex justify-between",children:[e.jsx(k,{size:"sm",onClick:()=>D(),variant:"link",className:"px-0",children:p("common.filters.buttons.all")}),e.jsx(k,{size:"sm",onClick:()=>L(),variant:"link",className:"px-0",children:p("common.filters.buttons.none")})]}),e.jsx("div",{children:Array.from({length:d},(r,s)=>e.jsx("div",{className:"space-y-3 pt-2",children:e.jsxs("div",{className:"flex justify-between items-center",children:[e.jsxs("label",{className:"flex items-center space-x-2 overflow-hidden",children:[e.jsx(W,{className:"w-4 h-4",checked:n.some(a=>a===o[s].key),onCheckedChange:()=>U(o[s])}),e.jsx("div",{className:"overflow-hidden text-ellipsis",children:o[s].key}),e.jsx("span",{className:"checkmark"})]}),e.jsx("span",{className:"bg-gray-200 px-2 py-1 rounded-md text-xs",children:ee(o[s].count||0)})]})},o[s].key))}),o.length>d&&e.jsx(k,{className:"mt-2 px-0",onClick:z,size:"sm",variant:"link",children:p("common.filters.buttons.showMore")}),e.jsx(se,{className:"my-2.5"}),e.jsxs("div",{className:"flex align-right justify-end items-center space-x-2",children:[e.jsx(k,{size:"xs",variant:"ghost",onClick:H,disabled:!B,children:p("common.filters.buttons.clear")}),e.jsx("div",{className:"flex space-x-2",children:e.jsx(Y,{size:"xs",className:"h-7",color:"primary",actions:[],onDefaultAction:G,children:p("common.filters.buttons.apply")})})]})]})}y.__docgenInfo={description:"",methods:[],displayName:"MultiSelectFilter",props:{data:{required:!1,tsType:{name:"Array",elements:[{name:"Aggregation"}],raw:"Aggregation[]"},description:""},field:{required:!0,tsType:{name:"AggregationConfig"},description:""},maxVisibleItems:{required:!1,tsType:{name:"number"},description:"",defaultValue:{value:"10",computed:!1}},searchVisible:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"false",computed:!1}}}};const R={variant_entity:{app_id:"variant_entity_multi_select_filter",aggregations:[{key:"chromosome",type:"multiple"},{key:"filter",type:"multiple"},{key:"zygosity",type:"multiple"},{key:"impact_score",type:"multiple"},{key:"variant_class",type:"multiple"},{key:"symbol",type:"multiple"}]}},Fe={title:"Feature/Query Filters/Multi Select",component:y,tags:["autodocs"],args:{data:[],field:{key:"chromosome",type:"multiple"},maxVisibleItems:10,searchVisible:!0},decorators:[t=>e.jsx($,{config:R,children:e.jsx(t,{})})]},g={args:{data:[{key:"Option 1",count:100},{key:"Option 2",count:200},{key:"Option 3",count:300},{key:"Option 4",count:400},{key:"Option 5",count:500},{key:"Option 6",count:600}],appliedItems:[]},render:t=>e.jsx("div",{className:"space-y-6",children:e.jsx(y,{...t})})},h={args:{data:[{key:"Option6",count:600},{key:"Option5",count:500},{key:"Option4",count:400},{key:"Option3",count:300},{key:"Option2",count:200},{key:"Option1",count:100}]},render:t=>(J("activeQuery")(v.updateActiveQueryField(R.variant_entity.app_id,{field:"chromosome",value:["Option1","Option4"]})),e.jsx("div",{className:"space-y-6",children:e.jsx(y,{...t})}))},x={args:{data:[{key:"Option6",count:600},{key:"Option5",count:500}],searchVisible:!1},render:t=>e.jsx("div",{className:"space-y-6",children:e.jsx(y,{...t})})};var N,_,A;g.parameters={...g.parameters,docs:{...(N=g.parameters)==null?void 0:N.docs,source:{originalSource:`{
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
}`,...(A=(_=g.parameters)==null?void 0:_.docs)==null?void 0:A.source}}};var I,w,E;h.parameters={...h.parameters,docs:{...(I=h.parameters)==null?void 0:I.docs,source:{originalSource:`{
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
}`,...(E=(w=h.parameters)==null?void 0:w.docs)==null?void 0:E.source}}};var F,M,Q;x.parameters={...x.parameters,docs:{...(F=x.parameters)==null?void 0:F.docs,source:{originalSource:`{
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
}`,...(Q=(M=x.parameters)==null?void 0:M.docs)==null?void 0:Q.source}}};const Me=["Default","DataAppliedToQueryBuilder","HiddenSearch"];export{h as DataAppliedToQueryBuilder,g as Default,x as HiddenSearch,Me as __namedExportsOrder,Fe as default};
