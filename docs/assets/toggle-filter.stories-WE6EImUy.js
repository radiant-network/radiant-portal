import{j as e}from"./jsx-runtime-D_zvdyIk.js";import{a as d}from"./index-B-lxVbXh.js";import{q as y}from"./query-builder-remote-CEpj2hQD.js";import{T as o}from"./toggle-filter-S-P54dma.js";import{C as g}from"./applications-config-q4OA8PiL.js";import{c as a}from"./config-mock-BXxtYAjK.js";import"./v4-CtRu48qb.js";import"./api-DNfqw_KU.js";import"./index-CGj_12n1.js";import"./button-C4nZXFML.js";import"./index-COcwYKbe.js";import"./index-D8dqFcAi.js";import"./index-BBPXtLXU.js";import"./ActionButton-CClS75b0.js";import"./dropdown-menu-DRugeY2X.js";import"./index-CcLUv2_A.js";import"./index-CphM_NEg.js";import"./Combination-Bb6GvI2f.js";import"./index-CbbSLEvm.js";import"./index-A6VgBoaw.js";import"./index-CKNrATXZ.js";import"./index-CIckazZy.js";import"./utils-D-KgF5mV.js";import"./check-DRc1RmCY.js";import"./createLucideIcon-8Lr1oLzj.js";import"./button.variants-BQkt_1YJ.js";import"./index-C66Dxnp2.js";import"./ellipsis-BM4jpslE.js";import"./spinner-BMSZ66Eg.js";import"./tooltip-Bh6uXa7k.js";import"./i18n-MOeN36sH.js";import"./iframe-CWJ_FFfP.js";import"./context-DkqwYzW-.js";import"./label-CnYaQ8j3.js";import"./index-qxuqJ0RB.js";const u={...a,variant_exploration:{...a.variant_exploration,aggregations:{variant:{items:[{key:"chromosome",type:"multiple"},{key:"filter",type:"multiple"},{key:"zygosity",type:"multiple"},{key:"impact_score",type:"multiple"},{key:"variant_class",type:"multiple"},{key:"symbol",type:"multiple"},{key:"is_canonical",type:"boolean"}]}}}},X={title:"QueryBuilder/Query Filters/Toggle Filter",component:o,args:{field:{key:"is_canonical",type:"boolean"}},decorators:[r=>e.jsx(g,{config:u,children:e.jsx(r,{})})]},t={render:r=>e.jsx("div",{className:"space-y-3",children:e.jsx(o,{...r})})},i={render:r=>(d("activeQuery")(y.updateActiveQueryField(u.variant_exploration.app_id,{field:"is_canonical",value:["true"]})),e.jsx("div",{className:"space-y-3",children:e.jsx(o,{...r})}))};var p,m,s;t.parameters={...t.parameters,docs:{...(p=t.parameters)==null?void 0:p.docs,source:{originalSource:`{
  render: args => {
    return <div className="space-y-3">
        <ToggleFilter {...args} />
      </div>;
  }
}`,...(s=(m=t.parameters)==null?void 0:m.docs)==null?void 0:s.source}}};var l,n,c;i.parameters={...i.parameters,docs:{...(l=i.parameters)==null?void 0:l.docs,source:{originalSource:`{
  render: args => {
    action('activeQuery')(queryBuilderRemote.updateActiveQueryField(config.variant_exploration.app_id, {
      field: 'is_canonical',
      value: ['true']
    }));
    return <div className="space-y-3">
        <ToggleFilter {...args} />
      </div>;
  }
}`,...(c=(n=i.parameters)==null?void 0:n.docs)==null?void 0:c.source}}};const Y=["Default","DataAppliedToQueryBuilder"];export{i as DataAppliedToQueryBuilder,t as Default,Y as __namedExportsOrder,X as default};
