import{r as c,j as e}from"./iframe-C6MOWQMA.js";import{S as s}from"./switch-mNNMZGDv.js";import{a as l,b as a}from"./story-section-_wEsjD86.js";import"./preload-helper-PPVm8Dsz.js";import"./index-DWzx1LIm.js";const u={title:"Components/Inputs/Switch",args:{size:"default",checked:!1,onCheckedChange:()=>{}},component:s},t={render:()=>{const[n,r]=c.useState(!1),[o,d]=c.useState(!1);return e.jsxs(l,{title:"Sizes",children:[e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx(a,{children:"Default"}),e.jsx(s,{size:"default",checked:n,onCheckedChange:r})]}),e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx(a,{children:"Small"}),e.jsx(s,{size:"sm",checked:o,onCheckedChange:d})]})]})}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  render: () => {
    const [checkedDefault, setCheckedDefault] = useState(false);
    const [checkedSm, setCheckedSm] = useState(false);
    return <StorySection title="Sizes">
        <div className="flex items-center gap-2">
          <StoryLabel>Default</StoryLabel>
          <Switch size="default" checked={checkedDefault} onCheckedChange={setCheckedDefault} />
        </div>
        <div className="flex items-center gap-2">
          <StoryLabel>Small</StoryLabel>
          <Switch size="sm" checked={checkedSm} onCheckedChange={setCheckedSm} />
        </div>
      </StorySection>;
  }
}`,...t.parameters?.docs?.source}}};const k=["Sizes"];export{t as Sizes,k as __namedExportsOrder,u as default};
