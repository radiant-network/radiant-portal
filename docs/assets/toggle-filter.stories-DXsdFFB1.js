import{j as r}from"./jsx-runtime-D_zvdyIk.js";import{a as d}from"./index-B-lxVbXh.js";import{q as y}from"./query-builder-remote-DnAI0UbO.js";import{T as o}from"./filter-list-D_amJM2d.js";import{C as g}from"./applications-config-DwuB3Ut-.js";import{c as p}from"./config-mock-BXxtYAjK.js";import"./v4-CtRu48qb.js";import"./index-CGj_12n1.js";import"./api-Ah5TJ5hY.js";import"./accordion-DPra3b9Q.js";import"./index-CcLUv2_A.js";import"./index-C8qycyLa.js";import"./index-B7CJuYpG.js";import"./index-D8dqFcAi.js";import"./index-BBPXtLXU.js";import"./index-BpLad_a1.js";import"./index-CRLeYu_h.js";import"./index-CIckazZy.js";import"./utils-D-KgF5mV.js";import"./chevron-right-CKDh57Sc.js";import"./createLucideIcon-8Lr1oLzj.js";import"./chevron-down-BLzVWgYU.js";import"./button-BDncBsTP.js";import"./action-button-DglMD9AQ.js";import"./dropdown-menu-CxUCUeqn.js";import"./index-Ch7hUksi.js";import"./Combination-DwMjbv-J.js";import"./index-DceihmLw.js";import"./index-A6VgBoaw.js";import"./check-DRc1RmCY.js";import"./separator-IJKoE26K.js";import"./button.variants-Du9eY_ux.js";import"./index-C66Dxnp2.js";import"./spinner-BMSZ66Eg.js";import"./tooltip-anNhU4TT.js";import"./index-BDsjCN7N.js";import"./i18n-CbvocMFw.js";import"./iframe-4i3Wl_LT.js";import"./i18next-DOi7g2fS.js";import"./card-CVaWHAcA.js";import"./checkbox-filter-DhnKxBlu.js";import"./number-format-DxX1Gy7s.js";import"./checkbox-CuLJw5hI.js";import"./index-qxuqJ0RB.js";import"./label-ymyzYynk.js";import"./input-Dm5winle.js";import"./skeleton-Shk8p_SP.js";import"./api-CvZQK6W_.js";import"./index-DxlLpgFR.js";import"./search-DqA1hdnz.js";import"./less-than-or-equal-operator-icon-BI5aNTvi.js";import"./select-WOQZTtP8.js";import"./chevron-up-BzG59QGX.js";const u={...p,snv_occurrence:{...p.snv_occurrence,aggregations:{variant:{items:[{key:"chromosome",type:"multiple"},{key:"filter",type:"multiple"},{key:"zygosity",type:"multiple"},{key:"impact_score",type:"multiple"},{key:"variant_class",type:"multiple"},{key:"symbol",type:"multiple"},{key:"is_canonical",type:"boolean"}]}}}},gr={title:"QueryBuilder/Query Filters/Toggle Filter",component:o,args:{field:{key:"is_canonical",type:"boolean"}},decorators:[e=>r.jsx(g,{config:u,children:r.jsx(e,{})})]},t={render:e=>r.jsx("div",{className:"space-y-3",children:r.jsx(o,{...e})})},i={render:e=>(d("activeQuery")(y.updateActiveQueryField(u.snv_occurrence.app_id,{field:"is_canonical",value:["true"]})),r.jsx("div",{className:"space-y-3",children:r.jsx(o,{...e})}))};var m,a,s;t.parameters={...t.parameters,docs:{...(m=t.parameters)==null?void 0:m.docs,source:{originalSource:`{
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
