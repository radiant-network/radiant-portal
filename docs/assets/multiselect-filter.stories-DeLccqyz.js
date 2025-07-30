import{j as e}from"./jsx-runtime-D_zvdyIk.js";import{a as f}from"./index-B-lxVbXh.js";import{q as x}from"./query-builder-remote-C8T8ZF2t.js";import{M as a}from"./multiselect-filter-CU6s4-BZ.js";import{C as h}from"./applications-config-pyPLye2e.js";import{c as s}from"./config-mock-BXxtYAjK.js";import"./v4-CtRu48qb.js";import"./api-fYFwtGmU.js";import"./index-DQLiH3RP.js";import"./button-Lb4z2BrY.js";import"./index-Dw-eQTPP.js";import"./index-CECE1b4A.js";import"./index-CJPVTaBz.js";import"./ActionButton-BqVcLudk.js";import"./dropdown-menu-Begym49V.js";import"./index-DTwDs4x6.js";import"./index-BkhUCz-k.js";import"./index-Buy_jb7k.js";import"./index-BsCFIxoT.js";import"./index-uZc0PFVk.js";import"./utils-D-KgF5mV.js";import"./check-DSCf8CVO.js";import"./createLucideIcon-BMP5cxO1.js";import"./button.variants-BQkt_1YJ.js";import"./index-C66Dxnp2.js";import"./ellipsis-BtlAG3ey.js";import"./spinner-DHVcj7-u.js";import"./tooltip-DogpHjiW.js";import"./i18n-C0c3TCKd.js";import"./iframe-Luliyu6-.js";import"./context-DNAkM4o1.js";import"./checkbox-Ce_wbgB6.js";import"./index-DDGWSPzp.js";import"./input-DyY2UfVx.js";import"./number-format-D03oK8BY.js";import"./separator-PkW7KAol.js";import"./use-aggregation-builder-Bjoi4SW_.js";import"./index-BjfAAjgr.js";import"./skeleton-Shk8p_SP.js";import"./string-format-D2CEWHqQ.js";const g={...s,variant_exploration:{...s.variant_exploration,aggregations:{variant:{items:[{key:"chromosome",type:"multiple"},{key:"filter",type:"multiple"},{key:"zygosity",type:"multiple"},{key:"impact_score",type:"multiple"},{key:"variant_class",type:"multiple"},{key:"symbol",type:"multiple"}]}}}},se={title:"Feature/Query Filters/Multi Select",component:a,args:{field:{key:"chromosome",type:"multiple"},maxVisibleItems:10,searchVisible:!0},decorators:[r=>e.jsx(h,{config:g,children:e.jsx(r,{})})]},t={render:r=>e.jsx("div",{className:"space-y-6",children:e.jsx(a,{...r})})},i={render:r=>(f("activeQuery")(x.updateActiveQueryField(g.variant_exploration.app_id,{field:"chromosome",value:["Option1","Option4"]})),e.jsx("div",{className:"space-y-6",children:e.jsx(a,{...r})}))},o={args:{searchVisible:!1},render:r=>e.jsx("div",{className:"space-y-6",children:e.jsx(a,{...r})})};var p,m,l;t.parameters={...t.parameters,docs:{...(p=t.parameters)==null?void 0:p.docs,source:{originalSource:`{
  render: args => {
    return <div className="space-y-6">
        <MultiSelectFilter {...args} />
      </div>;
  }
}`,...(l=(m=t.parameters)==null?void 0:m.docs)==null?void 0:l.source}}};var c,n,d;i.parameters={...i.parameters,docs:{...(c=i.parameters)==null?void 0:c.docs,source:{originalSource:`{
  render: args => {
    action('activeQuery')(queryBuilderRemote.updateActiveQueryField(config.variant_exploration.app_id, {
      field: 'chromosome',
      value: ['Option1', 'Option4']
    }));
    return <div className="space-y-6">
        <MultiSelectFilter {...args} />
      </div>;
  }
}`,...(d=(n=i.parameters)==null?void 0:n.docs)==null?void 0:d.source}}};var u,y,v;o.parameters={...o.parameters,docs:{...(u=o.parameters)==null?void 0:u.docs,source:{originalSource:`{
  args: {
    searchVisible: false
  },
  render: args => {
    return <div className="space-y-6">
        <MultiSelectFilter {...args} />
      </div>;
  }
}`,...(v=(y=o.parameters)==null?void 0:y.docs)==null?void 0:v.source}}};const pe=["Default","DataAppliedToQueryBuilder","HiddenSearch"];export{i as DataAppliedToQueryBuilder,t as Default,o as HiddenSearch,pe as __namedExportsOrder,se as default};
