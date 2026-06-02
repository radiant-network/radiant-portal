import{r,j as e}from"./iframe-Cmiex3IG.js";import{C as n}from"./checkbox-BCT0M0VO.js";import"./preload-helper-PPVm8Dsz.js";import"./index-CdS5h6eN.js";import"./check-BHUZAyPW.js";const m={title:"Inputs/Checkbox",args:{size:"default",checked:!1,onCheckedChange:()=>{}},component:n},t={render:()=>{const[s,c]=r.useState(!1);return e.jsx(n,{checked:s,onCheckedChange:c})}},a={render:()=>{const[s,c]=r.useState(!1);return e.jsxs(e.Fragment,{children:[e.jsxs("div",{className:"p-4",children:[e.jsx("h3",{className:"mb-4 text-lg font-semibold",children:"Size: default"}),e.jsx(n,{size:"default",checked:s,onCheckedChange:c})]}),e.jsxs("div",{className:"p-4",children:[e.jsx("h3",{className:"mb-4 text-lg font-semibold",children:"Size: xs"}),e.jsx(n,{size:"xs",checked:s,onCheckedChange:c})]})]})}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  render: () => {
    const [checked, setChecked] = useState<CheckedState>(false);
    return <Checkbox checked={checked} onCheckedChange={setChecked} />;
  }
}`,...t.parameters?.docs?.source}}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  render: () => {
    const [checked, setChecked] = useState<CheckedState>(false);
    return <>
        <div className="p-4">
          <h3 className="mb-4 text-lg font-semibold">Size: default</h3>
          <Checkbox size="default" checked={checked} onCheckedChange={setChecked} />
        </div>
        <div className="p-4">
          <h3 className="mb-4 text-lg font-semibold">Size: xs</h3>
          <Checkbox size="xs" checked={checked} onCheckedChange={setChecked} />
        </div>
      </>;
  }
}`,...a.parameters?.docs?.source}}};const k=["Default","Sizes"];export{t as Default,a as Sizes,k as __namedExportsOrder,m as default};
