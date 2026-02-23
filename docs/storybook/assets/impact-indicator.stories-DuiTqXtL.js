import{j as a}from"./iframe-ZUKLh1y0.js";import{V as m}from"./api-Bd3rgHIX.js";import{I as r}from"./impact-indicator-B1XbpdjI.js";import"./preload-helper-Dp1pzeXC.js";import"./indicator-DQpCKcmj.js";import"./shape-triangle-up-icon-Bqfx6Apw.js";const u={title:"Indicators/Impact Indicator",component:r,args:{value:"HIGH"}},t={render:()=>a.jsx("div",{className:"flex flex-col gap-2",children:Object.keys(m).map(e=>a.jsxs(a.Fragment,{children:[a.jsx(r,{value:e,children:e.toLowerCase()},e),a.jsx(r,{value:e,size:"sm",children:e.toLowerCase()},e)]}))})};var s,o,c;t.parameters={...t.parameters,docs:{...(s=t.parameters)==null?void 0:s.docs,source:{originalSource:`{
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
