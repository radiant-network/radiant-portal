import{r as a,j as e}from"./iframe-CeWulF4T.js";import{C as c}from"./checkbox-CI-w0ilu.js";import{a as d,b as n}from"./story-section-H6_Fle6z.js";import{S as i}from"./story-error-field-DSPWHYPt.js";import"./preload-helper-PPVm8Dsz.js";import"./index-BI3vdd7S.js";import"./check-HHIYmnL4.js";import"./index-C0gnKytj.js";import"./label-D1HwKpbR.js";import"./separator-CfpQj-nU.js";const f={title:"Components/Inputs/Checkbox",args:{size:"default",checked:!1,onCheckedChange:()=>{}},component:c},o={render:()=>{const[r,t]=a.useState(!1);return e.jsxs(d,{title:"Sizes",children:[e.jsxs("div",{className:"flex flex-col gap-2",children:[e.jsx(n,{children:"default"}),e.jsx(c,{size:"default",checked:r,onCheckedChange:t})]}),e.jsxs("div",{className:"flex flex-col gap-2",children:[e.jsx(n,{children:"xs"}),e.jsx(c,{size:"xs",checked:r,onCheckedChange:t})]})]})}},s={render:()=>{const[r,t]=a.useState(!1);return e.jsx(d,{title:"Error",description:"No red border on the box: by design, a checkbox in error shows the red label and the message only.",children:e.jsx(i,{label:"I accept the terms",error:"You must accept the terms to continue",layout:"inline",invalid:r!==!0,children:e.jsx(c,{checked:r,onCheckedChange:t})})})}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  render: () => {
    const [checked, setChecked] = useState<CheckedState>(false);
    return <StorySection title="Sizes">
        <div className="flex flex-col gap-2">
          <StoryLabel>default</StoryLabel>
          <Checkbox size="default" checked={checked} onCheckedChange={setChecked} />
        </div>
        <div className="flex flex-col gap-2">
          <StoryLabel>xs</StoryLabel>
          <Checkbox size="xs" checked={checked} onCheckedChange={setChecked} />
        </div>
      </StorySection>;
  }
}`,...o.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  render: () => {
    const [checked, setChecked] = useState<CheckedState>(false);
    return <StorySection title="Error" description="No red border on the box: by design, a checkbox in error shows the red label and the message only.">
        <StoryErrorField label="I accept the terms" error="You must accept the terms to continue" layout="inline" invalid={checked !== true}>
          <Checkbox checked={checked} onCheckedChange={setChecked} />
        </StoryErrorField>
      </StorySection>;
  }
}`,...s.parameters?.docs?.source}}};const y=["Sizes","ErrorState"];export{s as ErrorState,o as Sizes,y as __namedExportsOrder,f as default};
