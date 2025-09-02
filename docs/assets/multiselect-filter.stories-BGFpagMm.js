import{j as e}from"./jsx-runtime-D_zvdyIk.js";import{a as f}from"./index-B-lxVbXh.js";import{q as x}from"./query-builder-remote-Bch3VBmc.js";import{M as a}from"./multiselect-filter-Be-FID_y.js";import{C as h}from"./applications-config-q4OA8PiL.js";import{c as s}from"./config-mock-BXxtYAjK.js";import"./v4-CtRu48qb.js";import"./api-DNfqw_KU.js";import"./index-CGj_12n1.js";import"./action-button-RO42ldpG.js";import"./utils-D-KgF5mV.js";import"./dropdown-menu-Bb-Cj6Tn.js";import"./index-CcLUv2_A.js";import"./index-COcwYKbe.js";import"./index-D8dqFcAi.js";import"./index-BBPXtLXU.js";import"./index-CphM_NEg.js";import"./Combination-Bb6GvI2f.js";import"./index-ButkbYdn.js";import"./index-A6VgBoaw.js";import"./index-BOEjv1S3.js";import"./index-CIckazZy.js";import"./check-DRc1RmCY.js";import"./createLucideIcon-8Lr1oLzj.js";import"./button.variants-Du9eY_ux.js";import"./index-C66Dxnp2.js";import"./button-BzIGdeaI.js";import"./spinner-BMSZ66Eg.js";import"./tooltip-eZCTYbea.js";import"./i18n-gP8jxa47.js";import"./iframe-DrVsasjC.js";import"./context-DkqwYzW-.js";import"./checkbox-filter-Dtk6_fg-.js";import"./number-format-DDJvc-iv.js";import"./checkbox-B0xIRynn.js";import"./index-qxuqJ0RB.js";import"./label-CnYaQ8j3.js";import"./card-BdbO89L0.js";import"./separator-6xmuS_PL.js";import"./input-CUZJ9Qyj.js";import"./skeleton-Shk8p_SP.js";import"./string-format-D2CEWHqQ.js";import"./use-aggregation-builder-rFl4o1NX.js";import"./index-DxlLpgFR.js";import"./search-DqA1hdnz.js";const g={...s,variant_exploration:{...s.variant_exploration,aggregations:{variant:{items:[{key:"chromosome",type:"multiple"},{key:"filter",type:"multiple"},{key:"zygosity",type:"multiple"},{key:"impact_score",type:"multiple"},{key:"variant_class",type:"multiple"},{key:"symbol",type:"multiple"}]}}}},ne={title:"QueryBuilder/Query Filters/Multi Select",component:a,args:{field:{key:"chromosome",type:"multiple"},maxVisibleItems:10,searchVisible:!0},decorators:[r=>e.jsx(h,{config:g,children:e.jsx(r,{})})]},t={render:r=>e.jsx("div",{className:"space-y-3",children:e.jsx(a,{...r})})},i={render:r=>(f("activeQuery")(x.updateActiveQueryField(g.variant_exploration.app_id,{field:"chromosome",value:["Option1","Option4"]})),e.jsx("div",{className:"space-y-3",children:e.jsx(a,{...r})}))},o={args:{searchVisible:!1},render:r=>e.jsx("div",{className:"space-y-3",children:e.jsx(a,{...r})})};var p,m,l;t.parameters={...t.parameters,docs:{...(p=t.parameters)==null?void 0:p.docs,source:{originalSource:`{
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
}`,...(v=(y=o.parameters)==null?void 0:y.docs)==null?void 0:v.source}}};const de=["Default","DataAppliedToQueryBuilder","HiddenSearch"];export{i as DataAppliedToQueryBuilder,t as Default,o as HiddenSearch,de as __namedExportsOrder,ne as default};
