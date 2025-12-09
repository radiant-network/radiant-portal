import{j as r}from"./jsx-runtime-D_zvdyIk.js";import{a as f}from"./index-B-lxVbXh.js";import{q as h}from"./query-builder-remote-B0Xukk6A.js";import{M as p}from"./filter-list-B0l6Mdqt.js";import{C as x}from"./applications-config-3OOAo44D.js";import{c as m}from"./config-mock-BXxtYAjK.js";import"./v4-CtRu48qb.js";import"./index-CBYaBgW8.js";import"./sqon-xFXjybh7.js";import"./api-DSP0ZUQ6.js";import"./accordion-CtRRXK5y.js";import"./index-Ba5mf8A5.js";import"./index-C6lL4ijz.js";import"./index-Dut9wsGU.js";import"./index-sTUCEGFJ.js";import"./index-BWnBDfn-.js";import"./index-C1adakYs.js";import"./index-BZEiv_1o.js";import"./index-ycEarWk3.js";import"./utils-D-KgF5mV.js";import"./chevron-right-BONyyZTy.js";import"./createLucideIcon-B119WVF5.js";import"./chevron-down-DOuPo75j.js";import"./button-pzkp80Kr.js";import"./action-button-KkvxmIWD.js";import"./dropdown-menu-BJyjb2OL.js";import"./index-CJAxgcjH.js";import"./Combination-B-dCT06H.js";import"./index-DrGCp3O6.js";import"./index-BtWW-1ow.js";import"./check-DSe_yRo5.js";import"./separator-B36Ht569.js";import"./button.variants-Du9eY_ux.js";import"./index-C66Dxnp2.js";import"./spinner-CKwzofCp.js";import"./tooltip-BjBxR1Ac.js";import"./index-BiH9rn-5.js";import"./i18n-D69N6MIH.js";import"./iframe-CBhLDB2j.js";import"./i18next-CYn7LYXT.js";import"./card-CV4HB3NY.js";import"./checkbox-filter-Dg7BtyeC.js";import"./number-format-DxX1Gy7s.js";import"./checkbox-B4fiCiBj.js";import"./index-SF2qmtPV.js";import"./label-C8KZOh3h.js";import"./input-Dm5winle.js";import"./skeleton-Shk8p_SP.js";import"./switch-SfbwGtii.js";import"./api-boGUK73W.js";import"./index-lnksFm0-.js";import"./search-DKmUqS9g.js";import"./less-than-or-equal-operator-icon-BI5aNTvi.js";import"./select-DMB6Vi4A.js";import"./chevron-up-C0Hb7JXF.js";import"./chunk-PVWAREVJ-ZXULl1h5.js";const g={...m,snv_occurrence:{...m.snv_occurrence,aggregations:{variant:{items:[{key:"chromosome",type:"multiple"},{key:"filter",type:"multiple"},{key:"zygosity",type:"multiple"},{key:"impact_score",type:"multiple"},{key:"variant_class",type:"multiple"},{key:"symbol",type:"multiple"}]}}}},_r={title:"QueryBuilder/Query Filters/Multi Select",component:p,args:{field:{key:"chromosome",type:"multiple"},maxVisibleItems:10,searchVisible:!0},decorators:[e=>r.jsx(x,{config:g,children:r.jsx(e,{})})]},t={render:e=>r.jsx("div",{className:"space-y-3",children:r.jsx(p,{...e})})},i={render:e=>(f("activeQuery")(h.updateActiveQueryField(g.snv_occurrence.app_id,{field:"chromosome",value:["Option1","Option4"]})),r.jsx("div",{className:"space-y-3",children:r.jsx(p,{...e})}))},o={args:{searchVisible:!1},render:e=>r.jsx("div",{className:"space-y-3",children:r.jsx(p,{...e})})};var s,a,c;t.parameters={...t.parameters,docs:{...(s=t.parameters)==null?void 0:s.docs,source:{originalSource:`{
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
}`,...(v=(y=o.parameters)==null?void 0:y.docs)==null?void 0:v.source}}};const Qr=["Default","DataAppliedToQueryBuilder","HiddenSearch"];export{i as DataAppliedToQueryBuilder,t as Default,o as HiddenSearch,Qr as __namedExportsOrder,_r as default};
