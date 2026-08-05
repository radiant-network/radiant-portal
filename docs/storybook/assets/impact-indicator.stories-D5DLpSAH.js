import{j as t}from"./iframe-BzMpq4Hc.js";import{g as o}from"./api-vC-PrVf7.js";import{I as r}from"./impact-indicator-wNx5a6yt.js";import{a as c}from"./story-section-DVNANUlR.js";import"./preload-helper-PPVm8Dsz.js";import"./indicator-agFcUQq1.js";import"./shape-triangle-up-icon-C52mOrfh.js";const I={title:"Features/Indicators/Impact Indicator",component:r,args:{value:"HIGH"}},a={render:()=>t.jsx(c,{title:"Impact indicator",children:t.jsx("div",{className:"flex flex-col gap-2",children:Object.keys(o).map(e=>t.jsxs("div",{children:[t.jsx(r,{value:e,children:e.toLowerCase()}),t.jsx(r,{value:e,size:"sm",children:e.toLowerCase()})]},e))})})};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
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
