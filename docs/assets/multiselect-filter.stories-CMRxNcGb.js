import{j as e}from"./jsx-runtime-Cf8x2fCZ.js";import{a as J}from"./index-B-lxVbXh.js";import{q as S,M as K}from"./query-builder-remote-CX5M1tSo.js";import{r as i}from"./index-tvICUrOf.js";import{B as v}from"./button-CrKCvLOn.js";import{C as X}from"./checkbox-Yaa9_JVB.js";import{I as Y}from"./input-aUNQvU1u.js";import{A as Z}from"./ActionButton-DRj5dfdv.js";import{u as $,C as ee}from"./applications-config-B4jBJrF9.js";import{n as te}from"./number-format-HGT0qunz.js";import{u as se}from"./i18n-is2QXAJD.js";import{S as oe}from"./separator-BGBJYV95.js";import{u as re,o as ne}from"./api-D6S2JuOj.js";import"./index-yBjzXJbu.js";import"./v4-CtRu48qb.js";import"./api-BKFoIFaX.js";import"./index-Dq5VjjLd.js";import"./index-_r67kdfS.js";import"./index-fNjTmf9T.js";import"./utils-BNf5BS2b.js";import"./createLucideIcon-DKFpjrVJ.js";import"./index-C1xbsqtW.js";import"./index-y2NRHbXQ.js";import"./check-DKX_pDN6.js";import"./index-C66Dxnp2.js";import"./dropdown-menu-waw6TUZR.js";import"./Combination-DL__bl4O.js";import"./iframe-B2ZpRwO2.js";const ae=t=>ne.aggregateOccurrences(t.seqId,t.aggregationBody).then(r=>r.data);function ie(t,r=30,f=!1,u){let d;f?d={seqId:"5011",aggregationBody:{field:t,size:r}}:d=null;const p=S.getResolvedActiveQuery(u);return p&&d&&(d.aggregationBody.sqon={content:p.content,op:p.op}),re(d,ae,{revalidateOnFocus:!1})}function ce(t,r){return r.filter(f=>f.key.toLowerCase().includes(t.toLowerCase()))}function _(t,r){return r<t?r:t}function g({field:t,maxVisibleItems:r=10,searchVisible:f=!1}){const{t:u}=se(),p=$().variant_entity.app_id,{data:c,isLoading:le}=ie(t.key,void 0,!0,p),[n,b]=i.useState(c||[]),[C,T]=i.useState([]),[a,m]=i.useState([]),[k,h]=i.useState(_(n.length,r)),[V,y]=i.useState(!1);i.useEffect(()=>{let o=S.getResolvedActiveQuery(p).content.find(s=>s.content.field===t.key);m(o?o.content.value:[]),c==null||c.sort((s,l)=>{const N=s.key&&a.includes(s.key),W=l.key&&a.includes(l.key);return N===W?l.count-s.count:N?-1:1}),b(c||[]),h(_((c==null?void 0:c.length)||0,r))},[c]);const z=i.useCallback(o=>{const s=ce(o,c);r>s.length?h(s.length):s.length>r&&h(r),b(s)},[n,k,c]),L=i.useCallback(()=>{let o=k+r;y(!0),h(o>n.length?n.length:o)},[k,n]),U=i.useCallback(()=>{a.length!==n.length&&(y(!0),m(n.map(o=>o.key)))},[n,a]),D=i.useCallback(()=>{a.length!==0&&(y(!0),m([]))},[a]),H=i.useCallback(o=>{let s=[];a.some(l=>l===o.key)?s=a.filter(l=>l!==o.key):s=[...a,o.key],y(!0),m(s)},[a]),G=i.useCallback(()=>{y(!1),m([...C])},[C]),P=i.useCallback(()=>{y(!1),T(a),S.updateActiveQueryField(p,{field:t.key,value:[...a],merge_strategy:K.OVERRIDE_VALUES})},[a]);return e.jsxs("div",{className:"p-2 w-full max-w-md",children:[f&&e.jsx(Y,{type:"text",placeholder:u("common.filters.search.placeholder"),className:"w-full p-2 mb-2 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500",onChange:o=>z(o.target.value)}),e.jsxs("div",{className:"flex justify-between",children:[e.jsx(v,{size:"sm",onClick:()=>U(),variant:"link",className:"px-0",children:u("common.filters.buttons.all")}),e.jsx(v,{size:"sm",onClick:()=>D(),variant:"link",className:"px-0",children:u("common.filters.buttons.none")})]}),e.jsx("div",{children:Array.from({length:k},(o,s)=>e.jsx("div",{className:"space-y-3 pt-2",children:e.jsxs("div",{className:"flex justify-between items-center",children:[e.jsxs("label",{className:"flex items-center space-x-2 overflow-hidden",children:[e.jsx(X,{className:"w-4 h-4",checked:a.some(l=>l===n[s].key),onCheckedChange:()=>H(n[s])}),e.jsx("div",{className:"overflow-hidden text-ellipsis",children:n[s].key}),e.jsx("span",{className:"checkmark"})]}),e.jsx("span",{className:"bg-gray-200 px-2 py-1 rounded-md text-xs",children:te(n[s].count||0)})]})},n[s].key))}),n.length>k&&e.jsx(v,{className:"mt-2 px-0",onClick:L,size:"sm",variant:"link",children:u("common.filters.buttons.showMore")}),e.jsx(oe,{className:"my-2.5"}),e.jsxs("div",{className:"flex align-right justify-end items-center space-x-2",children:[e.jsx(v,{size:"xs",variant:"ghost",onClick:G,disabled:!V,children:u("common.filters.buttons.clear")}),e.jsx("div",{className:"flex space-x-2",children:e.jsx(Z,{size:"xs",className:"h-7",color:"primary",actions:[],onDefaultAction:P,children:u("common.filters.buttons.apply")})})]})]})}g.__docgenInfo={description:"",methods:[],displayName:"MultiSelectFilter",props:{field:{required:!0,tsType:{name:"AggregationConfig"},description:""},maxVisibleItems:{required:!1,tsType:{name:"number"},description:"",defaultValue:{value:"10",computed:!1}},searchVisible:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"false",computed:!1}}}};const q={variant_entity:{app_id:"variant_entity_multi_select_filter",aggregations:[{key:"chromosome",type:"multiple"},{key:"filter",type:"multiple"},{key:"zygosity",type:"multiple"},{key:"impact_score",type:"multiple"},{key:"variant_class",type:"multiple"},{key:"symbol",type:"multiple"}]}},Te={title:"Feature/Query Filters/Multi Select",component:g,tags:["autodocs"],args:{data:[],field:{key:"chromosome",type:"multiple"},maxVisibleItems:10,searchVisible:!0},decorators:[t=>e.jsx(ee,{config:q,children:e.jsx(t,{})})]},x={args:{data:[{key:"Option 1",count:100},{key:"Option 2",count:200},{key:"Option 3",count:300},{key:"Option 4",count:400},{key:"Option 5",count:500},{key:"Option 6",count:600}],appliedItems:[]},render:t=>e.jsx("div",{className:"space-y-6",children:e.jsx(g,{...t})})},O={args:{data:[{key:"Option6",count:600},{key:"Option5",count:500},{key:"Option4",count:400},{key:"Option3",count:300},{key:"Option2",count:200},{key:"Option1",count:100}]},render:t=>(J("activeQuery")(S.updateActiveQueryField(q.variant_entity.app_id,{field:"chromosome",value:["Option1","Option4"]})),e.jsx("div",{className:"space-y-6",children:e.jsx(g,{...t})}))},j={args:{data:[{key:"Option6",count:600},{key:"Option5",count:500}],searchVisible:!1},render:t=>e.jsx("div",{className:"space-y-6",children:e.jsx(g,{...t})})};var A,I,w;x.parameters={...x.parameters,docs:{...(A=x.parameters)==null?void 0:A.docs,source:{originalSource:`{
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
}`,...(w=(I=x.parameters)==null?void 0:I.docs)==null?void 0:w.source}}};var E,F,B;O.parameters={...O.parameters,docs:{...(E=O.parameters)==null?void 0:E.docs,source:{originalSource:`{
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
}`,...(B=(F=O.parameters)==null?void 0:F.docs)==null?void 0:B.source}}};var Q,M,R;j.parameters={...j.parameters,docs:{...(Q=j.parameters)==null?void 0:Q.docs,source:{originalSource:`{
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
}`,...(R=(M=j.parameters)==null?void 0:M.docs)==null?void 0:R.source}}};const Ve=["Default","DataAppliedToQueryBuilder","HiddenSearch"];export{O as DataAppliedToQueryBuilder,x as Default,j as HiddenSearch,Ve as __namedExportsOrder,Te as default};
