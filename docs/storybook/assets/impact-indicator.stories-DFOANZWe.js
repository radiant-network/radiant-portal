import{j as t}from"./iframe-D7ER49TR.js";import{h as o}from"./api-V3_aiIEN.js";import{I as r}from"./impact-indicator-0oF37IAQ.js";import{a as c}from"./story-section-T7092GL1.js";import"./preload-helper-PPVm8Dsz.js";import"./indicator-mB5jO8fY.js";import"./shape-triangle-up-icon-BxlAb2GW.js";const I={title:"Features/Indicators/Impact Indicator",component:r,args:{value:"HIGH"}},a={render:()=>t.jsx(c,{title:"Impact indicator",children:t.jsx("div",{className:"flex flex-col gap-2",children:Object.keys(o).map(e=>t.jsxs("div",{children:[t.jsx(r,{value:e,children:e.toLowerCase()}),t.jsx(r,{value:e,size:"sm",children:e.toLowerCase()})]},e))})})};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
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
}`,...a.parameters?.docs?.source}}};const u=["Default"];export{a as Default,u as __namedExportsOrder,I as default};
