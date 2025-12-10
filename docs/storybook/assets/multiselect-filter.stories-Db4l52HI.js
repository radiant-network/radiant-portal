import{j as r}from"./jsx-runtime-D_zvdyIk.js";import{a as f}from"./index-B-lxVbXh.js";import{M as p}from"./filter-list-n4unto8e.js";import{C as h}from"./applications-config-3OOAo44D.js";import{q as x}from"./query-builder-remote-D1MOyb6t.js";import{c as m}from"./config-mock-BXxtYAjK.js";import"./v4-CtRu48qb.js";import"./index-CBYaBgW8.js";import"./action-button-B61IoBol.js";import"./dropdown-menu-CvT4td-4.js";import"./index-D9mtqW9-.js";import"./index-sTUCEGFJ.js";import"./index-BWnBDfn-.js";import"./index-Dy6y0jaD.js";import"./index-BCzuw4Jg.js";import"./index-BdYz8WOz.js";import"./Combination-DPhcPU0m.js";import"./index-D6ay35fe.js";import"./index-C2iKAgIe.js";import"./index-CWHKeK-O.js";import"./index-DnEzm5An.js";import"./utils-CDN07tui.js";import"./check-DSe_yRo5.js";import"./createLucideIcon-B119WVF5.js";import"./separator-ChZWIdMg.js";import"./index-C-d7IIsQ.js";import"./button.variants-Du9eY_ux.js";import"./index-C66Dxnp2.js";import"./button-DlQhM6NA.js";import"./spinner-D7tBPZCQ.js";import"./tooltip-B_PdrVRJ.js";import"./index-CfXWnpL9.js";import"./i18n-BYhOn5Ro.js";import"./iframe-CTdhkTz1.js";import"./i18next-CYn7LYXT.js";import"./checkbox-filter-CgMxmOlu.js";import"./checkbox-BUFo-vqr.js";import"./index-SF2qmtPV.js";import"./label-BI8zg36L.js";import"./number-format-DxX1Gy7s.js";import"./card-yhTtVRJn.js";import"./input-Bj-MPxry.js";import"./skeleton-_T1otFf0.js";import"./switch-Jy17y5RA.js";import"./sqon-xFXjybh7.js";import"./api-DSP0ZUQ6.js";import"./accordion-DSXieqtP.js";import"./index-ByDNlZau.js";import"./chevron-right-BONyyZTy.js";import"./chevron-down-DOuPo75j.js";import"./api-BI7VOGfX.js";import"./index-lnksFm0-.js";import"./search-DKmUqS9g.js";import"./less-than-or-equal-operator-icon-BI5aNTvi.js";import"./select-DTmZBhH3.js";import"./chevron-up-C0Hb7JXF.js";import"./chunk-WWGJGFF6-CzYCtQDF.js";const g={...m,snv_occurrence:{...m.snv_occurrence,aggregations:{variant:{items:[{key:"chromosome",type:"multiple"},{key:"filter",type:"multiple"},{key:"zygosity",type:"multiple"},{key:"impact_score",type:"multiple"},{key:"variant_class",type:"multiple"},{key:"symbol",type:"multiple"}]}}}},Qr={title:"QueryBuilder/Query Filters/Multi Select",component:p,args:{field:{key:"chromosome",type:"multiple"},maxVisibleItems:10,searchVisible:!0},decorators:[e=>r.jsx(h,{config:g,children:r.jsx(e,{})})]},t={render:e=>r.jsx("div",{className:"space-y-3",children:r.jsx(p,{...e})})},i={render:e=>(f("activeQuery")(x.updateActiveQueryField(g.snv_occurrence.app_id,{field:"chromosome",value:["Option1","Option4"]})),r.jsx("div",{className:"space-y-3",children:r.jsx(p,{...e})}))},o={args:{searchVisible:!1},render:e=>r.jsx("div",{className:"space-y-3",children:r.jsx(p,{...e})})};var s,a,c;t.parameters={...t.parameters,docs:{...(s=t.parameters)==null?void 0:s.docs,source:{originalSource:`{
  render: args => <div className="space-y-3">
      <MultiSelectFilter {...args} />
    </div>
}`,...(c=(a=t.parameters)==null?void 0:a.docs)==null?void 0:c.source}}};var l,n,d;i.parameters={...i.parameters,docs:{...(l=i.parameters)==null?void 0:l.docs,source:{originalSource:`{
  render: args => {
    action('activeQuery')(queryBuilderRemote.updateActiveQueryField(config.snv_occurrence.app_id, {
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
  render: args => <div className="space-y-3">
      <MultiSelectFilter {...args} />
    </div>
}`,...(v=(y=o.parameters)==null?void 0:y.docs)==null?void 0:v.source}}};const kr=["Default","DataAppliedToQueryBuilder","HiddenSearch"];export{i as DataAppliedToQueryBuilder,t as Default,o as HiddenSearch,kr as __namedExportsOrder,Qr as default};
