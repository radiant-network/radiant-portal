import{j as e}from"./iframe-BOkj70l8.js";import{C as a,A as v,a as d}from"./classification-badge-CO_48zrI.js";import{a as t,b as u}from"./story-section-DQYgi0mB.js";import"./preload-helper-PPVm8Dsz.js";import"./conditional-wrapper-BBX8pIPQ.js";import"./badge-DYJwqogr.js";import"./separator-MMk7clR0.js";import"./x-BN09ysZY.js";import"./i18n-C0VA3Pzj.js";import"./index-BiVUSCho.js";const S={title:"Components/Badges/Classification Badge",component:a,args:{value:"other",variant:"neutral"}},l={render:()=>e.jsx(t,{title:"Default",children:e.jsx("div",{className:"flex flex-col gap-2 items-start",children:Object.keys(d).map((i,s)=>e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx(a,{value:i}),e.jsx(a,{value:i,abbreviated:!0}),e.jsx(a,{value:i,count:s}),e.jsx(a,{value:i,abbreviated:!0,count:s})]},i))})})},n={render:()=>e.jsx(t,{title:"ACMG/AMP classification",children:e.jsx("div",{className:"flex flex-col gap-2 items-start",children:Object.keys(v).map((i,s)=>e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx(a,{value:i}),e.jsx(a,{value:i,abbreviated:!0}),e.jsx(a,{value:i,count:s}),e.jsx(a,{value:i,abbreviated:!0,count:s})]},i))})})},r={render:()=>e.jsx(t,{title:"Classification value without underscore",description:"Key without space or underscore, e.g. likelybenign",children:e.jsx("div",{className:"flex flex-col gap-2 items-start",children:Object.keys(d).map((i,s)=>e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx(a,{value:i.replaceAll("_","")}),e.jsx(a,{value:i.replaceAll("_",""),abbreviated:!0}),e.jsx(a,{value:i.replaceAll("_",""),count:s}),e.jsx(a,{value:i.replaceAll("_",""),abbreviated:!0,count:s})]},i))})})},c={render:()=>e.jsx(t,{title:"Classification value starting with an underscore",description:"Key starting with an underscore, e.g. _low_penetrance",children:e.jsx("div",{className:"flex flex-col gap-2 items-start",children:Object.keys(d).map((i,s)=>e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx(a,{value:"_"+i}),e.jsx(a,{value:"_"+i,abbreviated:!0}),e.jsx(a,{value:"_"+i,count:s}),e.jsx(a,{value:"_"+i,abbreviated:!0,count:s})]},i))})})},o={render:()=>e.jsxs(t,{title:"No data",children:[e.jsxs("div",{className:"space-y-2",children:[e.jsx(u,{children:"With an empty string"}),e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx(a,{value:""}),e.jsx(a,{value:"",abbreviated:!0}),e.jsx(a,{value:"",count:1}),e.jsx(a,{value:"",abbreviated:!0,count:1})]})]}),e.jsxs("div",{className:"space-y-2",children:[e.jsx(u,{children:"With a null value"}),e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx(a,{value:null}),e.jsx(a,{value:null,abbreviated:!0}),e.jsx(a,{value:null,count:1}),e.jsx(a,{value:null,abbreviated:!0,count:1})]})]})]})};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  render: () => <StorySection title="Default">
      <div className="flex flex-col gap-2 items-start">
        {Object.keys(ClassificationValueMap).map((key, index) => <div className="flex items-center gap-2" key={key}>
            <ClassificationBadge value={key} />
            <ClassificationBadge value={key} abbreviated />
            <ClassificationBadge value={key} count={index} />
            <ClassificationBadge value={key} abbreviated count={index} />
          </div>)}
      </div>
    </StorySection>
}`,...l.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  render: () => <StorySection title="ACMG/AMP classification">
      <div className="flex flex-col gap-2 items-start">
        {Object.keys(AcmgAmpClassificationMap).map((key, index) => <div className="flex items-center gap-2" key={key}>
            <ClassificationBadge value={key} />
            <ClassificationBadge value={key} abbreviated />
            <ClassificationBadge value={key} count={index} />
            <ClassificationBadge value={key} abbreviated count={index} />
          </div>)}
      </div>
    </StorySection>
}`,...n.parameters?.docs?.source}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  render: () => <StorySection title="Classification value without underscore" description="Key without space or underscore, e.g. likelybenign">
      <div className="flex flex-col gap-2 items-start">
        {Object.keys(ClassificationValueMap).map((key, index) => <div className="flex items-center gap-2" key={key}>
            <ClassificationBadge value={key.replaceAll('_', '')} />
            <ClassificationBadge value={key.replaceAll('_', '')} abbreviated />
            <ClassificationBadge value={key.replaceAll('_', '')} count={index} />
            <ClassificationBadge value={key.replaceAll('_', '')} abbreviated count={index} />
          </div>)}
      </div>
    </StorySection>
}`,...r.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  render: () => <StorySection title="Classification value starting with an underscore" description="Key starting with an underscore, e.g. _low_penetrance">
      <div className="flex flex-col gap-2 items-start">
        {Object.keys(ClassificationValueMap).map((key, index) => <div className="flex items-center gap-2" key={key}>
            <ClassificationBadge value={'_' + key} />
            <ClassificationBadge value={'_' + key} abbreviated />
            <ClassificationBadge value={'_' + key} count={index} />
            <ClassificationBadge value={'_' + key} abbreviated count={index} />
          </div>)}
      </div>
    </StorySection>
}`,...c.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  render: () => <StorySection title="No data">
      <div className="space-y-2">
        <StoryLabel>With an empty string</StoryLabel>
        <div className="flex items-center gap-2">
          <ClassificationBadge value="" />
          <ClassificationBadge value="" abbreviated />
          <ClassificationBadge value="" count={1} />
          <ClassificationBadge value="" abbreviated count={1} />
        </div>
      </div>

      <div className="space-y-2">
        <StoryLabel>With a null value</StoryLabel>
        <div className="flex items-center gap-2">
          <ClassificationBadge value={null} />
          <ClassificationBadge value={null} abbreviated />
          <ClassificationBadge value={null} count={1} />
          <ClassificationBadge value={null} abbreviated count={1} />
        </div>
      </div>
    </StorySection>
}`,...o.parameters?.docs?.source}}};const N=["Default","AcmgAmpClassification","ClassificationValueWithoutUnderscore","ClassificationValueStartingWithAnUnderscore","NoData"];export{n as AcmgAmpClassification,c as ClassificationValueStartingWithAnUnderscore,r as ClassificationValueWithoutUnderscore,l as Default,o as NoData,N as __namedExportsOrder,S as default};
