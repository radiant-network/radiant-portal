import{j as e}from"./iframe-fZ1JU2dD.js";import{C as a,A as d,a as o}from"./classification-badge-DW3rHJ28.js";import"./preload-helper-PPVm8Dsz.js";import"./conditional-wrapper-BBX8pIPQ.js";import"./badge-_ehbmyEb.js";import"./separator-Bt15M7Wt.js";import"./index-BuixPVmM.js";import"./x-DMxNaVrf.js";import"./i18n-Cu2AZSyu.js";import"./index-BsMQ4rV8.js";const y={title:"Badges/Classification Badge",component:a,args:{value:"other",variant:"neutral"}},t={render:()=>e.jsx("div",{className:"flex flex-col gap-2 items-start",children:Object.keys(o).map((s,i)=>e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx(a,{value:s}),e.jsx(a,{value:s,abbreviated:!0}),e.jsx(a,{value:s,count:i}),e.jsx(a,{value:s,abbreviated:!0,count:i})]},s))})},l={render:()=>e.jsx("div",{className:"flex flex-col gap-2 items-start",children:Object.keys(d).map((s,i)=>e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx(a,{value:s}),e.jsx(a,{value:s,abbreviated:!0}),e.jsx(a,{value:s,count:i}),e.jsx(a,{value:s,abbreviated:!0,count:i})]},s))})},r={render:()=>e.jsxs("div",{className:"flex flex-col gap-2 items-start",children:[e.jsx("div",{children:"Key without space or underscore e.g. likelybenign"}),Object.keys(o).map((s,i)=>e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx(a,{value:s.replaceAll("_","")}),e.jsx(a,{value:s.replaceAll("_",""),abbreviated:!0}),e.jsx(a,{value:s.replaceAll("_",""),count:i}),e.jsx(a,{value:s.replaceAll("_",""),abbreviated:!0,count:i})]},s))]})},n={render:()=>e.jsxs("div",{className:"flex flex-col gap-2 items-start",children:[e.jsx("div",{children:"Key without space or underscore e.g. _low_penetrance"}),Object.keys(o).map((s,i)=>e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx(a,{value:"_"+s}),e.jsx(a,{value:"_"+s,abbreviated:!0}),e.jsx(a,{value:"_"+s,count:i}),e.jsx(a,{value:"_"+s,abbreviated:!0,count:i})]},s))]})},c={render:()=>e.jsxs("div",{className:"flex flex-col gap-2 items-start",children:["With an empty string",e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx(a,{value:""}),e.jsx(a,{value:"",abbreviated:!0}),e.jsx(a,{value:"",count:1}),e.jsx(a,{value:"",abbreviated:!0,count:1})]}),"With an null value",e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx(a,{value:null}),e.jsx(a,{value:null,abbreviated:!0}),e.jsx(a,{value:null,count:1}),e.jsx(a,{value:null,abbreviated:!0,count:1})]})]})};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  render: () => <div className="flex flex-col gap-2 items-start">
      {Object.keys(ClassificationValueMap).map((key, index) => <div className="flex items-center gap-2" key={key}>
          <ClassificationBadge value={key} />
          <ClassificationBadge value={key} abbreviated />
          <ClassificationBadge value={key} count={index} />
          <ClassificationBadge value={key} abbreviated count={index} />
        </div>)}
    </div>
}`,...t.parameters?.docs?.source}}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  render: () => <div className="flex flex-col gap-2 items-start">
      {Object.keys(AcmgAmpClassificationMap).map((key, index) => <div className="flex items-center gap-2" key={key}>
          <ClassificationBadge value={key} />
          <ClassificationBadge value={key} abbreviated />
          <ClassificationBadge value={key} count={index} />
          <ClassificationBadge value={key} abbreviated count={index} />
        </div>)}
    </div>
}`,...l.parameters?.docs?.source}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  render: () => <div className="flex flex-col gap-2 items-start">
      <div>Key without space or underscore e.g. likelybenign</div>
      {Object.keys(ClassificationValueMap).map((key, index) => <div className="flex items-center gap-2" key={key}>
          <ClassificationBadge value={key.replaceAll('_', '')} />
          <ClassificationBadge value={key.replaceAll('_', '')} abbreviated />
          <ClassificationBadge value={key.replaceAll('_', '')} count={index} />
          <ClassificationBadge value={key.replaceAll('_', '')} abbreviated count={index} />
        </div>)}
    </div>
}`,...r.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  render: () => <div className="flex flex-col gap-2 items-start">
      <div>Key without space or underscore e.g. _low_penetrance</div>
      {Object.keys(ClassificationValueMap).map((key, index) => <div className="flex items-center gap-2" key={key}>
          <ClassificationBadge value={'_' + key} />
          <ClassificationBadge value={'_' + key} abbreviated />
          <ClassificationBadge value={'_' + key} count={index} />
          <ClassificationBadge value={'_' + key} abbreviated count={index} />
        </div>)}
    </div>
}`,...n.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  render: () => <div className="flex flex-col gap-2 items-start">
      With an empty string
      <div className="flex items-center gap-2">
        <ClassificationBadge value="" />
        <ClassificationBadge value="" abbreviated />
        <ClassificationBadge value="" count={1} />
        <ClassificationBadge value="" abbreviated count={1} />
      </div>
      With an null value
      <div className="flex items-center gap-2">
        <ClassificationBadge value={null} />
        <ClassificationBadge value={null} abbreviated />
        <ClassificationBadge value={null} count={1} />
        <ClassificationBadge value={null} abbreviated count={1} />
      </div>
    </div>
}`,...c.parameters?.docs?.source}}};const B=["Default","AcmgAmpClassification","ClassificationValueWithoutUnderscore","ClassificationValueStartingWithAnUnderscore","NoData"];export{l as AcmgAmpClassification,n as ClassificationValueStartingWithAnUnderscore,r as ClassificationValueWithoutUnderscore,t as Default,c as NoData,B as __namedExportsOrder,y as default};
