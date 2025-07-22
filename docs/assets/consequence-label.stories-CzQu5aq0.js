import{j as e}from"./jsx-runtime-D_zvdyIk.js";import{V as n}from"./api-fYFwtGmU.js";import{C as c}from"./consequence-label-DKzPDQfn.js";import"./impact-icon-KInDIG-7.js";import"./shape-circle-icon-BxJCNapB.js";import"./utils-D-KgF5mV.js";import"./i18n-nK4zJx9i.js";import"./iframe-szmZ-SCp.js";import"./index-DQLiH3RP.js";import"./index-C66Dxnp2.js";import"./string-format-D2CEWHqQ.js";const x={title:"Feature/Variant/Consequence Label",component:c,args:{vepImpact:"HIGH",consequence:"missense_variant",size:"default"}},a={render:()=>e.jsxs("div",{className:"space-y-6",children:[e.jsxs("div",{className:"space-y-2",children:[e.jsx("label",{children:"Size: default"}),Object.keys(n).map(s=>e.jsx(c,{vepImpact:s,consequence:"Consequence"},s))]}),e.jsxs("div",{className:"space-y-2",children:[e.jsx("label",{children:"Size: sm"}),Object.keys(n).map(s=>e.jsx(c,{size:"sm",vepImpact:s,consequence:"Consequence"},s))]})]})};var t,p,m;a.parameters={...a.parameters,docs:{...(t=a.parameters)==null?void 0:t.docs,source:{originalSource:`{
  render: () => {
    return <div className="space-y-6">
        <div className="space-y-2">
          <label>Size: default</label>
          {Object.keys(VepImpact).map(impact => <ConsequenceLabel key={impact} vepImpact={impact as VepImpact} consequence="Consequence" />)}
        </div>
        <div className="space-y-2">
          <label>Size: sm</label>
          {Object.keys(VepImpact).map(impact => <ConsequenceLabel key={impact} size="sm" vepImpact={impact as VepImpact} consequence="Consequence" />)}
        </div>
      </div>;
  }
}`,...(m=(p=a.parameters)==null?void 0:p.docs)==null?void 0:m.source}}};const I=["Default"];export{a as Default,I as __namedExportsOrder,x as default};
