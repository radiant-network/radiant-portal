import{j as e}from"./jsx-runtime-D_zvdyIk.js";import{a as P}from"./index-B-lxVbXh.js";import{q as v,M as J}from"./query-builder-remote-D2OmViZu.js";import{r as i}from"./index-DUAV1Q2A.js";import{B as f}from"./button-C8z_ftIH.js";import{C as K}from"./checkbox-CKmzQrYg.js";import{I as W}from"./input-BBoUXjlS.js";import{A as X}from"./ActionButton-Ta3-7M67.js";import"./IconButton-FTwC7G1Y.js";import"./button.variants-C_VBJA_Y.js";import{u as Y,C as Z}from"./applications-config-DDwFTzON.js";import{n as $}from"./number-format-HGT0qunz.js";import"./v4-CtRu48qb.js";import"./api-IBhAsGXh.js";import"./index-CpwtQhPK.js";import"./index-CSO_qfi8.js";import"./index-CqVsPxxY.js";import"./index-DeoL25kd.js";import"./index-D74gQ3ji.js";import"./index-DgC28C5k.js";import"./utils-BNf5BS2b.js";import"./index-C66Dxnp2.js";import"./check-D0WsHlur.js";import"./createLucideIcon-DirO1-NP.js";import"./dropdown-menu-BD7M8eM3.js";import"./Combination-BychJT1d.js";function ee(t,c){return c.filter(l=>l.key.toLowerCase().includes(t.toLowerCase()))}function b(t,c){return c<t?c:t}function m({data:t,field:c,maxVisibleItems:l=10,searchVisible:R=!1}){const[o,x]=i.useState(t||[]),[O,T]=i.useState([]),[n,p]=i.useState([]),[d,y]=i.useState(b(o.length,l)),[q,u]=i.useState(!1),j=Y().variant_entity.app_id;i.useEffect(()=>{let r=v.getResolvedActiveQuery(j).content.find(s=>s.content.field===c.key);p(r?r.content.value:[]),t==null||t.sort((s,a)=>{const S=s.key&&n.includes(s.key),G=a.key&&n.includes(a.key);return S===G?a.count-s.count:S?-1:1}),x(t||[]),y(b((t==null?void 0:t.length)||0,l))},[t]);const B=i.useCallback(r=>{const s=ee(r,t);l>s.length?y(s.length):s.length>l&&y(l),x(s)},[o,d,t]),V=i.useCallback(()=>{let r=d+l;u(!0),y(r>o.length?o.length:r)},[d,o]),D=i.useCallback(()=>{n.length!==o.length&&(u(!0),p(o.map(r=>r.key)))},[o,n]),L=i.useCallback(()=>{n.length!==0&&(u(!0),p([]))},[n]),U=i.useCallback(r=>{let s=[];n.some(a=>a===r.key)?s=n.filter(a=>a!==r.key):s=[...n,r.key],u(!0),p(s)},[n]),H=i.useCallback(()=>{u(!1),p([...O])},[O]),z=i.useCallback(()=>{u(!1),T(n),v.updateActiveQueryField(j,{field:c.key,value:[...n],merge_strategy:J.OVERRIDE_VALUES})},[n]);return e.jsxs("div",{className:"p-2 w-full max-w-md",children:[R&&e.jsx(W,{type:"text",placeholder:"Search ...",className:"w-full p-2 mb-4 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500",onChange:r=>B(r.target.value)}),e.jsxs("div",{className:"flex justify-between mb-4",children:[e.jsx(f,{className:"underline font-semibold",onClick:()=>D(),variant:"link",children:"All"}),e.jsx(f,{className:"underline font-semibold",onClick:()=>L(),variant:"link",children:"None"})]}),Array.from({length:d},(r,s)=>e.jsx("div",{className:"space-y-3 pt-2",children:e.jsxs("div",{className:"flex justify-between items-center",children:[e.jsxs("label",{className:"flex items-center space-x-2 overflow-hidden",children:[e.jsx(K,{className:"w-4 h-4",checked:n.some(a=>a===o[s].key),onCheckedChange:()=>U(o[s])}),e.jsx("div",{className:"overflow-hidden text-ellipsis",children:o[s].key}),e.jsx("span",{className:"checkmark"})]}),e.jsx("span",{className:"bg-gray-200 px-2 py-1 rounded-md text-xs",children:$(o[s].count||0)})]})},o[s].key)),o.length>d&&e.jsx(f,{className:"",onClick:V,variant:"link",children:"Show more"}),e.jsx("hr",{className:"my-4 border-border"}),e.jsxs("div",{className:"flex align-right justify-end items-center space-x-2",children:[e.jsx(f,{className:"text-gray-600",onClick:H,disabled:!q,children:"Clear"}),e.jsx("div",{className:"flex space-x-2",children:e.jsx(X,{size:"sm",className:"h-7",color:"primary",actions:[],onDefaultAction:z,children:"Apply"})})]})]})}m.__docgenInfo={description:"",methods:[],displayName:"MultiSelectFilter",props:{data:{required:!1,tsType:{name:"Array",elements:[{name:"Aggregation"}],raw:"Aggregation[]"},description:""},field:{required:!0,tsType:{name:"AggregationConfig"},description:""},maxVisibleItems:{required:!1,tsType:{name:"number"},description:"",defaultValue:{value:"10",computed:!1}},searchVisible:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"false",computed:!1}}}};const Q={variant_entity:{app_id:"variant_entity_multi_select_filter",aggregations:[{key:"chromosome",type:"multiple"},{key:"filter",type:"multiple"},{key:"zygosity",type:"multiple"},{key:"impact_score",type:"multiple"},{key:"variant_class",type:"multiple"},{key:"symbol",type:"multiple"}]}},Ae={title:"Feature/Query Filters/Multi Select",component:m,tags:["autodocs"],args:{data:[],field:{key:"chromosome",type:"multiple"},maxVisibleItems:10,searchVisible:!0},decorators:[t=>e.jsx(Z,{config:Q,children:e.jsx(t,{})})]},k={args:{data:[{key:"Option 1",count:100},{key:"Option 2",count:200},{key:"Option 3",count:300},{key:"Option 4",count:400},{key:"Option 5",count:500},{key:"Option 6",count:600}],appliedItems:[]},render:t=>e.jsx("div",{className:"space-y-6",children:e.jsx(m,{...t})})},g={args:{data:[{key:"Option6",count:600},{key:"Option5",count:500},{key:"Option4",count:400},{key:"Option3",count:300},{key:"Option2",count:200},{key:"Option1",count:100}]},render:t=>(P("activeQuery")(v.updateActiveQueryField(Q.variant_entity.app_id,{field:"chromosome",value:["Option1","Option4"]})),e.jsx("div",{className:"space-y-6",children:e.jsx(m,{...t})}))},h={args:{data:[{key:"Option6",count:600},{key:"Option5",count:500}],searchVisible:!1},render:t=>e.jsx("div",{className:"space-y-6",children:e.jsx(m,{...t})})};var C,N,_;k.parameters={...k.parameters,docs:{...(C=k.parameters)==null?void 0:C.docs,source:{originalSource:`{
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
}`,...(_=(N=k.parameters)==null?void 0:N.docs)==null?void 0:_.source}}};var A,I,w;g.parameters={...g.parameters,docs:{...(A=g.parameters)==null?void 0:A.docs,source:{originalSource:`{
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
}`,...(w=(I=g.parameters)==null?void 0:I.docs)==null?void 0:w.source}}};var E,F,M;h.parameters={...h.parameters,docs:{...(E=h.parameters)==null?void 0:E.docs,source:{originalSource:`{
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
}`,...(M=(F=h.parameters)==null?void 0:F.docs)==null?void 0:M.source}}};const Ie=["Default","DataAppliedToQueryBuilder","HiddenSearch"];export{g as DataAppliedToQueryBuilder,k as Default,h as HiddenSearch,Ie as __namedExportsOrder,Ae as default};
