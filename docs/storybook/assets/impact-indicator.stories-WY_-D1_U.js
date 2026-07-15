import{j as t}from"./iframe-CJwTE_QO.js";import{h as o}from"./api-DxXkaL5r.js";import{I as r}from"./impact-indicator-9A6ySjAG.js";import{a as c}from"./story-section-CeCnabVr.js";import"./preload-helper-PPVm8Dsz.js";import"./indicator-Cra0ynA5.js";import"./shape-triangle-up-icon-B8-JDDhH.js";const I={title:"Features/Indicators/Impact Indicator",component:r,args:{value:"HIGH"}},a={render:()=>t.jsx(c,{title:"Impact indicator",children:t.jsx("div",{className:"flex flex-col gap-2",children:Object.keys(o).map(e=>t.jsxs("div",{children:[t.jsx(r,{value:e,children:e.toLowerCase()}),t.jsx(r,{value:e,size:"sm",children:e.toLowerCase()})]},e))})})};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
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
