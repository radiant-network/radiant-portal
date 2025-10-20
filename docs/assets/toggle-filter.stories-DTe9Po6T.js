import{j as r}from"./jsx-runtime-D_zvdyIk.js";import{a as d}from"./index-B-lxVbXh.js";import{q as y}from"./query-builder-remote-D-ktMVpU.js";import{T as o}from"./filter-list-B2EZKdT2.js";import{C as g}from"./applications-config-DwuB3Ut-.js";import{c as p}from"./config-mock-BXxtYAjK.js";import"./v4-CtRu48qb.js";import"./index-CGj_12n1.js";import"./api-CLxggLZG.js";import"./accordion-BWvWyO3m.js";import"./index-CcLUv2_A.js";import"./index-Dmw9mmVb.js";import"./index-COcwYKbe.js";import"./index-D8dqFcAi.js";import"./index-BBPXtLXU.js";import"./index-DBGPD7F6.js";import"./index-BOEjv1S3.js";import"./index-CIckazZy.js";import"./utils-D-KgF5mV.js";import"./chevron-right-CKDh57Sc.js";import"./createLucideIcon-8Lr1oLzj.js";import"./chevron-down-BLzVWgYU.js";import"./button-CSvHYG3S.js";import"./action-button-CiOB9jQw.js";import"./dropdown-menu-CgwMUYBh.js";import"./index-CphM_NEg.js";import"./Combination-Bb6GvI2f.js";import"./index-ButkbYdn.js";import"./index-A6VgBoaw.js";import"./check-DRc1RmCY.js";import"./separator-6xmuS_PL.js";import"./button.variants-Du9eY_ux.js";import"./index-C66Dxnp2.js";import"./spinner-BMSZ66Eg.js";import"./tooltip-CU4v6KP8.js";import"./index-BGxt8iJ2.js";import"./i18n-Bgxc7_py.js";import"./iframe-Cji9YcRM.js";import"./i18next-DOi7g2fS.js";import"./card-BdbO89L0.js";import"./checkbox-filter-DLXakNDu.js";import"./number-format-D03oK8BY.js";import"./checkbox-B0xIRynn.js";import"./index-qxuqJ0RB.js";import"./label-CnYaQ8j3.js";import"./input-Dm5winle.js";import"./skeleton-Shk8p_SP.js";import"./api-CmVjSeVt.js";import"./index-DxlLpgFR.js";import"./search-DqA1hdnz.js";import"./less-than-or-equal-operator-icon-BI5aNTvi.js";import"./select-DHqrYng3.js";import"./chevron-up-BzG59QGX.js";const u={...p,snv_occurrence:{...p.snv_occurrence,aggregations:{variant:{items:[{key:"chromosome",type:"multiple"},{key:"filter",type:"multiple"},{key:"zygosity",type:"multiple"},{key:"impact_score",type:"multiple"},{key:"variant_class",type:"multiple"},{key:"symbol",type:"multiple"},{key:"is_canonical",type:"boolean"}]}}}},gr={title:"QueryBuilder/Query Filters/Toggle Filter",component:o,args:{field:{key:"is_canonical",type:"boolean"}},decorators:[e=>r.jsx(g,{config:u,children:r.jsx(e,{})})]},t={render:e=>r.jsx("div",{className:"space-y-3",children:r.jsx(o,{...e})})},i={render:e=>(d("activeQuery")(y.updateActiveQueryField(u.snv_occurrence.app_id,{field:"is_canonical",value:["true"]})),r.jsx("div",{className:"space-y-3",children:r.jsx(o,{...e})}))};var m,a,s;t.parameters={...t.parameters,docs:{...(m=t.parameters)==null?void 0:m.docs,source:{originalSource:`{
  render: args => {
    return <div className="space-y-3">
        <ToggleFilter {...args} />
      </div>;
  }
}`,...(s=(a=t.parameters)==null?void 0:a.docs)==null?void 0:s.source}}};var c,l,n;i.parameters={...i.parameters,docs:{...(c=i.parameters)==null?void 0:c.docs,source:{originalSource:`{
  render: args => {
    action('activeQuery')(queryBuilderRemote.updateActiveQueryField(config.snv_occurrence.app_id, {
      field: 'is_canonical',
      value: ['true']
    }));
    return <div className="space-y-3">
        <ToggleFilter {...args} />
      </div>;
  }
}`,...(n=(l=i.parameters)==null?void 0:l.docs)==null?void 0:n.source}}};const vr=["Default","DataAppliedToQueryBuilder"];export{i as DataAppliedToQueryBuilder,t as Default,vr as __namedExportsOrder,gr as default};
