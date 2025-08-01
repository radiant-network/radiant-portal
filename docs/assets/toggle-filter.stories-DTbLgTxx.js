import{j as e}from"./jsx-runtime-D_zvdyIk.js";import{a as d}from"./index-B-lxVbXh.js";import{q as y}from"./query-builder-remote-Cm6AMoJX.js";import{T as o}from"./toggle-filter-C9R15XmM.js";import{C as g}from"./applications-config-viUeW4FZ.js";import{c as a}from"./config-mock-BXxtYAjK.js";import"./v4-CtRu48qb.js";import"./api-Di5bdl6V.js";import"./index-CGj_12n1.js";import"./button-BJPe2k2B.js";import"./index-COcwYKbe.js";import"./index-D8dqFcAi.js";import"./index-BBPXtLXU.js";import"./ActionButton-B60wXCqX.js";import"./dropdown-menu-BfKDjvbV.js";import"./index-CDVHwwC2.js";import"./index-DUXZ-Llx.js";import"./index-2ptLTYfO.js";import"./index-Dd-X3grP.js";import"./index-Bp_Zkv6j.js";import"./utils-D-KgF5mV.js";import"./check-DRc1RmCY.js";import"./createLucideIcon-8Lr1oLzj.js";import"./button.variants-BQkt_1YJ.js";import"./index-C66Dxnp2.js";import"./ellipsis-BM4jpslE.js";import"./spinner-BMSZ66Eg.js";import"./tooltip-BLxBvsFO.js";import"./i18n-BNmDg3oO.js";import"./iframe-D6lUxKRu.js";import"./context-DkqwYzW-.js";import"./label-DII0GlAa.js";import"./index-qxuqJ0RB.js";const u={...a,variant_exploration:{...a.variant_exploration,aggregations:{variant:{items:[{key:"chromosome",type:"multiple"},{key:"filter",type:"multiple"},{key:"zygosity",type:"multiple"},{key:"impact_score",type:"multiple"},{key:"variant_class",type:"multiple"},{key:"symbol",type:"multiple"},{key:"is_canonical",type:"boolean"}]}}}},V={title:"Feature/Query Filters/Toggle Filter",component:o,args:{field:{key:"is_canonical",type:"boolean"}},decorators:[r=>e.jsx(g,{config:u,children:e.jsx(r,{})})]},t={render:r=>e.jsx("div",{className:"space-y-6",children:e.jsx(o,{...r})})},i={render:r=>(d("activeQuery")(y.updateActiveQueryField(u.variant_exploration.app_id,{field:"is_canonical",value:["true"]})),e.jsx("div",{className:"space-y-6",children:e.jsx(o,{...r})}))};var p,s,m;t.parameters={...t.parameters,docs:{...(p=t.parameters)==null?void 0:p.docs,source:{originalSource:`{
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
