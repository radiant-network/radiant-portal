import{j as t}from"./jsx-runtime-D_zvdyIk.js";import{I as m}from"./impact-icon-DF6Fxl2Y.js";import{V as o}from"./api-aNwEU8iu.js";import"./shape-circle-icon-BxJCNapB.js";import"./utils-D-KgF5mV.js";const u={title:"Feature/Variant/Impact Icon",component:m,args:{value:"HIGH"}},e={render:()=>t.jsx("div",{className:"flex flex-col gap-2",children:Object.keys(o).map(a=>t.jsxs("div",{className:"flex items-center gap-2",children:[t.jsx(m,{value:a}),a.toLowerCase()]},a))})};var r,s,c;e.parameters={...e.parameters,docs:{...(r=e.parameters)==null?void 0:r.docs,source:{originalSource:`{
  render: () => {
    return <div className="flex flex-col gap-2">
        {Object.keys(VepImpact).map(impact => <div key={impact} className="flex items-center gap-2">
            <ImpactIcon value={impact as VepImpact} />
            {impact.toLowerCase()}
          </div>)}
      </div>;
  }
}`,...(c=(s=e.parameters)==null?void 0:s.docs)==null?void 0:c.source}}};const x=["Default"];export{e as Default,x as __namedExportsOrder,u as default};
