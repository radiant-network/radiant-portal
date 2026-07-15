import{r,j as e}from"./iframe-BJ0KBJU7.js";import{C as t}from"./checkbox-Ho9kG9Wm.js";import{a as n,b as o}from"./story-section-BU2eJCi3.js";import"./preload-helper-PPVm8Dsz.js";import"./index-CaZkY5dK.js";import"./check-Dg29415_.js";const k={title:"Components/Inputs/Checkbox",args:{size:"default",checked:!1,onCheckedChange:()=>{}},component:t},s={render:()=>{const[c,a]=r.useState(!1);return e.jsxs(n,{title:"Sizes",children:[e.jsxs("div",{className:"flex flex-col gap-2",children:[e.jsx(o,{children:"default"}),e.jsx(t,{size:"default",checked:c,onCheckedChange:a})]}),e.jsxs("div",{className:"flex flex-col gap-2",children:[e.jsx(o,{children:"xs"}),e.jsx(t,{size:"xs",checked:c,onCheckedChange:a})]})]})}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
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
}`,...s.parameters?.docs?.source}}};const p=["Sizes"];export{s as Sizes,p as __namedExportsOrder,k as default};
