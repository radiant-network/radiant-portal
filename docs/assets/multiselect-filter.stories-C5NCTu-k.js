import{j as r}from"./jsx-runtime-D_zvdyIk.js";import{a as f}from"./index-B-lxVbXh.js";import{q as h}from"./query-builder-remote-DrsXIDys.js";import{M as s}from"./filter-list-CHWXnSf4.js";import{C as x}from"./applications-config-DwuB3Ut-.js";import{c as p}from"./config-mock-BXxtYAjK.js";import"./v4-CtRu48qb.js";import"./index-CGj_12n1.js";import"./api-BLBZBurO.js";import"./accordion-DPra3b9Q.js";import"./index-CcLUv2_A.js";import"./index-C8qycyLa.js";import"./index-B7CJuYpG.js";import"./index-D8dqFcAi.js";import"./index-BBPXtLXU.js";import"./index-BpLad_a1.js";import"./index-CRLeYu_h.js";import"./index-CIckazZy.js";import"./utils-D-KgF5mV.js";import"./chevron-right-CKDh57Sc.js";import"./createLucideIcon-8Lr1oLzj.js";import"./chevron-down-BLzVWgYU.js";import"./button-A48_mgaX.js";import"./action-button-DglMD9AQ.js";import"./dropdown-menu-CxUCUeqn.js";import"./index-Ch7hUksi.js";import"./Combination-DwMjbv-J.js";import"./index-DceihmLw.js";import"./index-A6VgBoaw.js";import"./check-DRc1RmCY.js";import"./separator-IJKoE26K.js";import"./button.variants-Du9eY_ux.js";import"./index-C66Dxnp2.js";import"./spinner-BMSZ66Eg.js";import"./tooltip-anNhU4TT.js";import"./index-BDsjCN7N.js";import"./i18n-C7iZtTPA.js";import"./iframe-B_WRq8P1.js";import"./i18next-DOi7g2fS.js";import"./card-CVaWHAcA.js";import"./checkbox-filter-DEDztmht.js";import"./number-format-D03oK8BY.js";import"./checkbox-CuLJw5hI.js";import"./index-qxuqJ0RB.js";import"./label-ymyzYynk.js";import"./input-Dm5winle.js";import"./skeleton-Shk8p_SP.js";import"./api-DL5z-YXi.js";import"./index-DxlLpgFR.js";import"./search-DqA1hdnz.js";import"./less-than-or-equal-operator-icon-BI5aNTvi.js";import"./select-WOQZTtP8.js";import"./chevron-up-BzG59QGX.js";const g={...p,snv_occurrence:{...p.snv_occurrence,aggregations:{variant:{items:[{key:"chromosome",type:"multiple"},{key:"filter",type:"multiple"},{key:"zygosity",type:"multiple"},{key:"impact_score",type:"multiple"},{key:"variant_class",type:"multiple"},{key:"symbol",type:"multiple"}]}}}},xr={title:"QueryBuilder/Query Filters/Multi Select",component:s,args:{field:{key:"chromosome",type:"multiple"},maxVisibleItems:10,searchVisible:!0},decorators:[e=>r.jsx(x,{config:g,children:r.jsx(e,{})})]},t={render:e=>r.jsx("div",{className:"space-y-3",children:r.jsx(s,{...e})})},i={render:e=>(f("activeQuery")(h.updateActiveQueryField(g.snv_occurrence.app_id,{field:"chromosome",value:["Option1","Option4"]})),r.jsx("div",{className:"space-y-3",children:r.jsx(s,{...e})}))},o={args:{searchVisible:!1},render:e=>r.jsx("div",{className:"space-y-3",children:r.jsx(s,{...e})})};var m,a,c;t.parameters={...t.parameters,docs:{...(m=t.parameters)==null?void 0:m.docs,source:{originalSource:`{
  render: args => {
    return <div className="space-y-3">
        <MultiSelectFilter {...args} />
      </div>;
  }
}`,...(c=(a=t.parameters)==null?void 0:a.docs)==null?void 0:c.source}}};var l,n,u;i.parameters={...i.parameters,docs:{...(l=i.parameters)==null?void 0:l.docs,source:{originalSource:`{
  render: args => {
    action('activeQuery')(queryBuilderRemote.updateActiveQueryField(config.snv_occurrence.app_id, {
      field: 'chromosome',
      value: ['Option1', 'Option4']
    }));
    return <div className="space-y-3">
        <MultiSelectFilter {...args} />
      </div>;
  }
}`,...(u=(n=i.parameters)==null?void 0:n.docs)==null?void 0:u.source}}};var d,y,v;o.parameters={...o.parameters,docs:{...(d=o.parameters)==null?void 0:d.docs,source:{originalSource:`{
  args: {
    searchVisible: false
  },
  render: args => {
    return <div className="space-y-3">
        <MultiSelectFilter {...args} />
      </div>;
  }
}`,...(v=(y=o.parameters)==null?void 0:y.docs)==null?void 0:v.source}}};const jr=["Default","DataAppliedToQueryBuilder","HiddenSearch"];export{i as DataAppliedToQueryBuilder,t as Default,o as HiddenSearch,jr as __namedExportsOrder,xr as default};
