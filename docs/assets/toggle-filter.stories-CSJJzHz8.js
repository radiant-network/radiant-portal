import{j as e}from"./jsx-runtime-D_zvdyIk.js";import{a as d}from"./index-B-lxVbXh.js";import{q as y}from"./query-builder-remote-C8T8ZF2t.js";import{T as o}from"./toggle-filter-hWezAq0t.js";import{C as g}from"./applications-config-pyPLye2e.js";import{c as a}from"./config-mock-BXxtYAjK.js";import"./v4-CtRu48qb.js";import"./api-fYFwtGmU.js";import"./index-DQLiH3RP.js";import"./button-Lb4z2BrY.js";import"./index-Dw-eQTPP.js";import"./index-CECE1b4A.js";import"./index-CJPVTaBz.js";import"./ActionButton-BqVcLudk.js";import"./dropdown-menu-Begym49V.js";import"./index-DTwDs4x6.js";import"./index-BkhUCz-k.js";import"./index-Buy_jb7k.js";import"./index-BsCFIxoT.js";import"./index-uZc0PFVk.js";import"./utils-D-KgF5mV.js";import"./check-DSCf8CVO.js";import"./createLucideIcon-BMP5cxO1.js";import"./button.variants-BQkt_1YJ.js";import"./index-C66Dxnp2.js";import"./ellipsis-BtlAG3ey.js";import"./spinner-DHVcj7-u.js";import"./tooltip-DogpHjiW.js";import"./i18n-C0c3TCKd.js";import"./iframe-Luliyu6-.js";import"./context-DNAkM4o1.js";import"./label-E-AdJZe_.js";import"./index-DDGWSPzp.js";const u={...a,variant_exploration:{...a.variant_exploration,aggregations:{variant:{items:[{key:"chromosome",type:"multiple"},{key:"filter",type:"multiple"},{key:"zygosity",type:"multiple"},{key:"impact_score",type:"multiple"},{key:"variant_class",type:"multiple"},{key:"symbol",type:"multiple"},{key:"is_canonical",type:"boolean"}]}}}},V={title:"Feature/Query Filters/Toggle Filter",component:o,args:{field:{key:"is_canonical",type:"boolean"}},decorators:[r=>e.jsx(g,{config:u,children:e.jsx(r,{})})]},t={render:r=>e.jsx("div",{className:"space-y-6",children:e.jsx(o,{...r})})},i={render:r=>(d("activeQuery")(y.updateActiveQueryField(u.variant_exploration.app_id,{field:"is_canonical",value:["true"]})),e.jsx("div",{className:"space-y-6",children:e.jsx(o,{...r})}))};var p,s,m;t.parameters={...t.parameters,docs:{...(p=t.parameters)==null?void 0:p.docs,source:{originalSource:`{
  render: args => {
    return <div className="space-y-6">
        <ToggleFilter {...args} />
      </div>;
  }
}`,...(m=(s=t.parameters)==null?void 0:s.docs)==null?void 0:m.source}}};var l,n,c;i.parameters={...i.parameters,docs:{...(l=i.parameters)==null?void 0:l.docs,source:{originalSource:`{
  render: args => {
    action('activeQuery')(queryBuilderRemote.updateActiveQueryField(config.variant_exploration.app_id, {
      field: 'is_canonical',
      value: ['true']
    }));
    return <div className="space-y-6">
        <ToggleFilter {...args} />
      </div>;
  }
}`,...(c=(n=i.parameters)==null?void 0:n.docs)==null?void 0:c.source}}};const W=["Default","DataAppliedToQueryBuilder"];export{i as DataAppliedToQueryBuilder,t as Default,W as __namedExportsOrder,V as default};
