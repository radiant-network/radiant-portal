import{j as a,b4 as o}from"./iframe-CEIjD8md.js";import{I as r}from"./impact-indicator-BidgniOZ.js";import{a as c}from"./story-section-akNb6BHm.js";import"./preload-helper-PPVm8Dsz.js";import"./indicator-C48Hqdn0.js";import"./shape-triangle-up-icon-B-BFcX49.js";const l={title:"Features/Indicators/Impact Indicator",component:r,args:{value:"HIGH"}},t={render:()=>a.jsx(c,{title:"Impact indicator",children:a.jsx("div",{className:"flex flex-col gap-2",children:Object.keys(o).map(e=>a.jsxs("div",{children:[a.jsx(r,{value:e,children:e.toLowerCase()}),a.jsx(r,{value:e,size:"sm",children:e.toLowerCase()})]},e))})})};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  render: () => <StorySection title="Impact indicator">
      <div className="flex flex-col gap-2">
        {Object.keys(VepImpact).map(impact => <div key={impact}>
            <ImpactIndicator value={impact as VepImpact}>{impact.toLowerCase()}</ImpactIndicator>
            <ImpactIndicator value={impact as VepImpact} size="sm">
              {impact.toLowerCase()}
            </ImpactIndicator>
          </div>)}
      </div>
    </StorySection>
}`,...t.parameters?.docs?.source}}};const I=["Default"];export{t as Default,I as __namedExportsOrder,l as default};
