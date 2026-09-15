import{n as e}from"./rolldown-runtime-C0FnF6B9.js";import{t}from"./jsx-runtime-BdxMnOeJ.js";import{i as n,n as r,t as i}from"./story-section-DVTm6cGm.js";import{i as a,n as o,r as s,t as c}from"./classification-badge-CNhzYzzC.js";var l,u,d,f,p,m,h,g;function _(){return(_=e((()=>{a(),n(),l=t(),u={title:`Components/Badges/Classification Badge`,component:o,args:{value:`other`,variant:`neutral`}},d={render:()=>(0,l.jsx)(r,{title:`Default`,children:(0,l.jsx)(`div`,{className:`flex flex-col gap-2 items-start`,children:Object.keys(s).map((e,t)=>(0,l.jsxs)(`div`,{className:`flex items-center gap-2`,children:[(0,l.jsx)(o,{value:e}),(0,l.jsx)(o,{value:e,abbreviated:!0}),(0,l.jsx)(o,{value:e,count:t}),(0,l.jsx)(o,{value:e,abbreviated:!0,count:t})]},e))})})},f={render:()=>(0,l.jsx)(r,{title:`ACMG/AMP classification`,children:(0,l.jsx)(`div`,{className:`flex flex-col gap-2 items-start`,children:Object.keys(c).map((e,t)=>(0,l.jsxs)(`div`,{className:`flex items-center gap-2`,children:[(0,l.jsx)(o,{value:e}),(0,l.jsx)(o,{value:e,abbreviated:!0}),(0,l.jsx)(o,{value:e,count:t}),(0,l.jsx)(o,{value:e,abbreviated:!0,count:t})]},e))})})},p={render:()=>(0,l.jsx)(r,{title:`Classification value without underscore`,description:`Key without space or underscore, e.g. likelybenign`,children:(0,l.jsx)(`div`,{className:`flex flex-col gap-2 items-start`,children:Object.keys(s).map((e,t)=>(0,l.jsxs)(`div`,{className:`flex items-center gap-2`,children:[(0,l.jsx)(o,{value:e.replaceAll(`_`,``)}),(0,l.jsx)(o,{value:e.replaceAll(`_`,``),abbreviated:!0}),(0,l.jsx)(o,{value:e.replaceAll(`_`,``),count:t}),(0,l.jsx)(o,{value:e.replaceAll(`_`,``),abbreviated:!0,count:t})]},e))})})},m={render:()=>(0,l.jsx)(r,{title:`Classification value starting with an underscore`,description:`Key starting with an underscore, e.g. _low_penetrance`,children:(0,l.jsx)(`div`,{className:`flex flex-col gap-2 items-start`,children:Object.keys(s).map((e,t)=>(0,l.jsxs)(`div`,{className:`flex items-center gap-2`,children:[(0,l.jsx)(o,{value:`_`+e}),(0,l.jsx)(o,{value:`_`+e,abbreviated:!0}),(0,l.jsx)(o,{value:`_`+e,count:t}),(0,l.jsx)(o,{value:`_`+e,abbreviated:!0,count:t})]},e))})})},h={render:()=>(0,l.jsxs)(r,{title:`No data`,children:[(0,l.jsxs)(`div`,{className:`space-y-2`,children:[(0,l.jsx)(i,{children:`With an empty string`}),(0,l.jsxs)(`div`,{className:`flex items-center gap-2`,children:[(0,l.jsx)(o,{value:``}),(0,l.jsx)(o,{value:``,abbreviated:!0}),(0,l.jsx)(o,{value:``,count:1}),(0,l.jsx)(o,{value:``,abbreviated:!0,count:1})]})]}),(0,l.jsxs)(`div`,{className:`space-y-2`,children:[(0,l.jsx)(i,{children:`With a null value`}),(0,l.jsxs)(`div`,{className:`flex items-center gap-2`,children:[(0,l.jsx)(o,{value:null}),(0,l.jsx)(o,{value:null,abbreviated:!0}),(0,l.jsx)(o,{value:null,count:1}),(0,l.jsx)(o,{value:null,abbreviated:!0,count:1})]})]})]})},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
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
}`,...d.parameters?.docs?.source}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
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
}`,...f.parameters?.docs?.source}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
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
}`,...p.parameters?.docs?.source}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
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
}`,...m.parameters?.docs?.source}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
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
}`,...h.parameters?.docs?.source}}},g=[`Default`,`AcmgAmpClassification`,`ClassificationValueWithoutUnderscore`,`ClassificationValueStartingWithAnUnderscore`,`NoData`]})))()}_();export{f as AcmgAmpClassification,m as ClassificationValueStartingWithAnUnderscore,p as ClassificationValueWithoutUnderscore,d as Default,h as NoData,g as __namedExportsOrder,u as default};