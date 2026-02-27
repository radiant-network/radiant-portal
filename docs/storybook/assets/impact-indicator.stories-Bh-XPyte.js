import{j as a}from"./iframe-DQ1t6oJB.js";import{V as m}from"./api-BYcQ-ONY.js";import{I as r}from"./impact-indicator-CtklASay.js";import"./preload-helper-Dp1pzeXC.js";import"./indicator-BOZPyu1D.js";import"./shape-triangle-up-icon-CDWZFTJC.js";const u={title:"Indicators/Impact Indicator",component:r,args:{value:"HIGH"}},t={render:()=>a.jsx("div",{className:"flex flex-col gap-2",children:Object.keys(m).map(e=>a.jsxs(a.Fragment,{children:[a.jsx(r,{value:e,children:e.toLowerCase()},e),a.jsx(r,{value:e,size:"sm",children:e.toLowerCase()},e)]}))})};var s,o,c;t.parameters={...t.parameters,docs:{...(s=t.parameters)==null?void 0:s.docs,source:{originalSource:`{
  render: () => <div className="flex flex-col gap-2">
      {Object.keys(VepImpact).map(impact => <>
          <ImpactIndicator key={impact} value={impact as VepImpact}>
            {impact.toLowerCase()}
          </ImpactIndicator>
          <ImpactIndicator key={impact} value={impact as VepImpact} size="sm">
            {impact.toLowerCase()}
          </ImpactIndicator>
        </>)}
    </div>
}`,...(c=(o=t.parameters)==null?void 0:o.docs)==null?void 0:c.source}}};const x=["Default"];export{t as Default,x as __namedExportsOrder,u as default};
