import{j as a}from"./iframe-CgYzld9M.js";import{V as s}from"./api-CNFUPySA.js";import{I as r}from"./impact-indicator-CQ-ZUei8.js";import"./preload-helper-PPVm8Dsz.js";import"./indicator-jYc-ulSh.js";import"./shape-triangle-up-icon-CEoXfZW4.js";const d={title:"Indicators/Impact Indicator",component:r,args:{value:"HIGH"}},t={render:()=>a.jsx("div",{className:"flex flex-col gap-2",children:Object.keys(s).map(e=>a.jsxs(a.Fragment,{children:[a.jsx(r,{value:e,children:e.toLowerCase()},e),a.jsx(r,{value:e,size:"sm",children:e.toLowerCase()},e)]}))})};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
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
}`,...t.parameters?.docs?.source}}};const l=["Default"];export{t as Default,l as __namedExportsOrder,d as default};
