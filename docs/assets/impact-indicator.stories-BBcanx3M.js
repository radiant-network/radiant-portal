import{j as r}from"./jsx-runtime-D_zvdyIk.js";import{I as s}from"./impact-indicator-CmP3pYdU.js";import{V as m}from"./api-DNfqw_KU.js";import"./indicator-D1ULF4b9.js";import"./utils-D-KgF5mV.js";import"./index-C66Dxnp2.js";import"./shape-circle-icon-BxJCNapB.js";const f={title:"Indicators/Impact Indicator",component:s,args:{value:"HIGH"}},e={render:()=>r.jsx("div",{className:"flex flex-col gap-2",children:Object.keys(m).map(a=>r.jsx(s,{value:a,children:a.toLowerCase()},a))})};var t,o,c;e.parameters={...e.parameters,docs:{...(t=e.parameters)==null?void 0:t.docs,source:{originalSource:`{
  render: () => {
    return <div className="flex flex-col gap-2">
        {Object.keys(VepImpact).map(impact => <ImpactIndicator key={impact} value={impact as VepImpact}>
            {impact.toLowerCase()}
          </ImpactIndicator>)}
      </div>;
  }
}`,...(c=(o=e.parameters)==null?void 0:o.docs)==null?void 0:c.source}}};const x=["Default"];export{e as Default,x as __namedExportsOrder,f as default};
