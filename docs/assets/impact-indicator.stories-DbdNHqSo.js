import{j as a}from"./jsx-runtime-D_zvdyIk.js";import{V as m}from"./api-B9NZ3u_f.js";import{I as r}from"./impact-indicator-Bz9GMzby.js";import"./indicator-BmYDS5D0.js";import"./index-C66Dxnp2.js";import"./utils-D-KgF5mV.js";import"./shape-triangle-up-icon-CLEWE8Su.js";const x={title:"Indicators/Impact Indicator",component:r,args:{value:"HIGH"}},t={render:()=>a.jsx("div",{className:"flex flex-col gap-2",children:Object.keys(m).map(e=>a.jsxs(a.Fragment,{children:[a.jsx(r,{value:e,children:e.toLowerCase()},e),a.jsx(r,{value:e,size:"sm",children:e.toLowerCase()},e)]}))})};var o,s,c;t.parameters={...t.parameters,docs:{...(o=t.parameters)==null?void 0:o.docs,source:{originalSource:`{
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
}`,...(c=(s=t.parameters)==null?void 0:s.docs)==null?void 0:c.source}}};const f=["Default"];export{t as Default,f as __namedExportsOrder,x as default};
