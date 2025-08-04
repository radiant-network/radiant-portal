import{j as e}from"./jsx-runtime-D_zvdyIk.js";import{a as f}from"./index-B-lxVbXh.js";import{q as x}from"./query-builder-remote-Cm6AMoJX.js";import{M as a}from"./multiselect-filter-ib-Jgequ.js";import{C as h}from"./applications-config-viUeW4FZ.js";import{c as s}from"./config-mock-BXxtYAjK.js";import"./v4-CtRu48qb.js";import"./api-Di5bdl6V.js";import"./index-CGj_12n1.js";import"./button-BK1RZQzq.js";import"./index-COcwYKbe.js";import"./index-D8dqFcAi.js";import"./index-BBPXtLXU.js";import"./ActionButton-B60wXCqX.js";import"./dropdown-menu-BfKDjvbV.js";import"./index-CDVHwwC2.js";import"./index-DUXZ-Llx.js";import"./index-2ptLTYfO.js";import"./index-Dd-X3grP.js";import"./index-Bp_Zkv6j.js";import"./utils-D-KgF5mV.js";import"./check-DRc1RmCY.js";import"./createLucideIcon-8Lr1oLzj.js";import"./button.variants-BQkt_1YJ.js";import"./index-C66Dxnp2.js";import"./ellipsis-BM4jpslE.js";import"./spinner-BMSZ66Eg.js";import"./tooltip-BLxBvsFO.js";import"./i18n-BCEI-fDQ.js";import"./iframe-C7J30c5N.js";import"./context-DkqwYzW-.js";import"./checkbox-DMd2svcp.js";import"./index-qxuqJ0RB.js";import"./input-DyY2UfVx.js";import"./number-format-D03oK8BY.js";import"./separator-6xmuS_PL.js";import"./use-aggregation-builder-C2omLMUf.js";import"./index-DxlLpgFR.js";import"./skeleton-Shk8p_SP.js";import"./string-format-D2CEWHqQ.js";const g={...s,variant_exploration:{...s.variant_exploration,aggregations:{variant:{items:[{key:"chromosome",type:"multiple"},{key:"filter",type:"multiple"},{key:"zygosity",type:"multiple"},{key:"impact_score",type:"multiple"},{key:"variant_class",type:"multiple"},{key:"symbol",type:"multiple"}]}}}},se={title:"Feature/Query Filters/Multi Select",component:a,args:{field:{key:"chromosome",type:"multiple"},maxVisibleItems:10,searchVisible:!0},decorators:[r=>e.jsx(h,{config:g,children:e.jsx(r,{})})]},t={render:r=>e.jsx("div",{className:"space-y-6",children:e.jsx(a,{...r})})},i={render:r=>(f("activeQuery")(x.updateActiveQueryField(g.variant_exploration.app_id,{field:"chromosome",value:["Option1","Option4"]})),e.jsx("div",{className:"space-y-6",children:e.jsx(a,{...r})}))},o={args:{searchVisible:!1},render:r=>e.jsx("div",{className:"space-y-6",children:e.jsx(a,{...r})})};var p,m,l;t.parameters={...t.parameters,docs:{...(p=t.parameters)==null?void 0:p.docs,source:{originalSource:`{
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
