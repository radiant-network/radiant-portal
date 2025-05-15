import{j as e}from"./jsx-runtime-Cf8x2fCZ.js";import{V as n}from"./api-CkzL9HmQ.js";import{C as c}from"./consequence-label-D7lFMWT8.js";import"./index-yBjzXJbu.js";import"./impact-icon-CMuztWA6.js";import"./shape-circle-icon-CMMXr8pB.js";import"./utils-CytzSlOG.js";import"./i18n-CFwvkZ6K.js";import"./iframe-D_n-fb5z.js";import"./index-tvICUrOf.js";import"./index-C66Dxnp2.js";const x={title:"Feature/Variant/Consequence Label",component:c,args:{vepImpact:"HIGH",consequence:"missense_variant",size:"default"}},a={render:()=>e.jsxs("div",{className:"space-y-6",children:[e.jsxs("div",{className:"space-y-2",children:[e.jsx("label",{children:"Size: default"}),Object.keys(n).map(s=>e.jsx(c,{vepImpact:s,consequence:"Consequence"},s))]}),e.jsxs("div",{className:"space-y-2",children:[e.jsx("label",{children:"Size: sm"}),Object.keys(n).map(s=>e.jsx(c,{size:"sm",vepImpact:s,consequence:"Consequence"},s))]})]})};var t,p,m;a.parameters={...a.parameters,docs:{...(t=a.parameters)==null?void 0:t.docs,source:{originalSource:`{
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
