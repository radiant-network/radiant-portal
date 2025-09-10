import{j as r}from"./jsx-runtime-D_zvdyIk.js";import{a as f}from"./index-B-lxVbXh.js";import{q as x}from"./query-builder-remote-CKam2jCw.js";import{M as a}from"./multiselect-filter-C8g8i1Gl.js";import{C as h}from"./applications-config-q4OA8PiL.js";import{c as p}from"./config-mock-BXxtYAjK.js";import"./v4-CtRu48qb.js";import"./api-BYPCWrIS.js";import"./index-CGj_12n1.js";import"./action-button-DDdwU0ca.js";import"./utils-D-KgF5mV.js";import"./dropdown-menu-CFPCuvYI.js";import"./index-CcLUv2_A.js";import"./index-COcwYKbe.js";import"./index-D8dqFcAi.js";import"./index-BBPXtLXU.js";import"./index-CphM_NEg.js";import"./Combination-Bb6GvI2f.js";import"./index-ButkbYdn.js";import"./index-A6VgBoaw.js";import"./index-BOEjv1S3.js";import"./index-CIckazZy.js";import"./check-DRc1RmCY.js";import"./createLucideIcon-8Lr1oLzj.js";import"./button.variants-Du9eY_ux.js";import"./index-C66Dxnp2.js";import"./button-jgjpf3em.js";import"./spinner-BMSZ66Eg.js";import"./tooltip-eZCTYbea.js";import"./i18n-CX2-m22N.js";import"./iframe-Bvuy7NgA.js";import"./context-DkqwYzW-.js";import"./checkbox-filter-FhWs9zxi.js";import"./number-format-D03oK8BY.js";import"./checkbox-B0xIRynn.js";import"./index-qxuqJ0RB.js";import"./label-CnYaQ8j3.js";import"./card-BdbO89L0.js";import"./separator-6xmuS_PL.js";import"./input-CUZJ9Qyj.js";import"./skeleton-Shk8p_SP.js";import"./string-format-D2CEWHqQ.js";import"./use-aggregation-builder-M8Os28Pp.js";import"./api-Bgk4f9pC.js";import"./index-DxlLpgFR.js";import"./search-DqA1hdnz.js";const g={...p,variant_exploration:{...p.variant_exploration,aggregations:{variant:{items:[{key:"chromosome",type:"multiple"},{key:"filter",type:"multiple"},{key:"zygosity",type:"multiple"},{key:"impact_score",type:"multiple"},{key:"variant_class",type:"multiple"},{key:"symbol",type:"multiple"}]}}}},dr={title:"QueryBuilder/Query Filters/Multi Select",component:a,args:{field:{key:"chromosome",type:"multiple"},maxVisibleItems:10,searchVisible:!0},decorators:[e=>r.jsx(h,{config:g,children:r.jsx(e,{})})]},t={render:e=>r.jsx("div",{className:"space-y-3",children:r.jsx(a,{...e})})},i={render:e=>(f("activeQuery")(x.updateActiveQueryField(g.variant_exploration.app_id,{field:"chromosome",value:["Option1","Option4"]})),r.jsx("div",{className:"space-y-3",children:r.jsx(a,{...e})}))},o={args:{searchVisible:!1},render:e=>r.jsx("div",{className:"space-y-3",children:r.jsx(a,{...e})})};var s,m,l;t.parameters={...t.parameters,docs:{...(s=t.parameters)==null?void 0:s.docs,source:{originalSource:`{
  render: args => {
    return <div className="space-y-3">
        <MultiSelectFilter {...args} />
      </div>;
  }
}`,...(l=(m=t.parameters)==null?void 0:m.docs)==null?void 0:l.source}}};var c,n,d;i.parameters={...i.parameters,docs:{...(c=i.parameters)==null?void 0:c.docs,source:{originalSource:`{
  render: args => {
    action('activeQuery')(queryBuilderRemote.updateActiveQueryField(config.variant_exploration.app_id, {
      field: 'chromosome',
      value: ['Option1', 'Option4']
    }));
    return <div className="space-y-3">
        <MultiSelectFilter {...args} />
      </div>;
  }
}`,...(d=(n=i.parameters)==null?void 0:n.docs)==null?void 0:d.source}}};var u,y,v;o.parameters={...o.parameters,docs:{...(u=o.parameters)==null?void 0:u.docs,source:{originalSource:`{
  args: {
    searchVisible: false
  },
  render: args => {
    return <div className="space-y-3">
        <MultiSelectFilter {...args} />
      </div>;
  }
}`,...(v=(y=o.parameters)==null?void 0:y.docs)==null?void 0:v.source}}};const ur=["Default","DataAppliedToQueryBuilder","HiddenSearch"];export{i as DataAppliedToQueryBuilder,t as Default,o as HiddenSearch,ur as __namedExportsOrder,dr as default};
