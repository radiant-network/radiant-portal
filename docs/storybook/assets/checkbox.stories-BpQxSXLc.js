import{r as m,j as e}from"./iframe-QXLGoJMs.js";import{C as n}from"./checkbox-nYH62mDI.js";import"./preload-helper-Dp1pzeXC.js";import"./index-RG2AGCvg.js";import"./check-CKSEyhAV.js";const f={title:"Inputs/Checkbox",args:{size:"default",checked:!1,onCheckedChange:()=>{}},component:n},t={render:()=>{const[s,c]=m.useState(!1);return e.jsx(n,{checked:s,onCheckedChange:c})}},a={render:()=>{const[s,c]=m.useState(!1);return e.jsxs(e.Fragment,{children:[e.jsxs("div",{className:"p-4",children:[e.jsx("h3",{className:"mb-4 text-lg font-semibold",children:"Size: default"}),e.jsx(n,{size:"default",checked:s,onCheckedChange:c})]}),e.jsxs("div",{className:"p-4",children:[e.jsx("h3",{className:"mb-4 text-lg font-semibold",children:"Size: xs"}),e.jsx(n,{size:"xs",checked:s,onCheckedChange:c})]})]})}};var r,d,o;t.parameters={...t.parameters,docs:{...(r=t.parameters)==null?void 0:r.docs,source:{originalSource:`{
  render: () => {
    const [checked, setChecked] = useState<CheckedState>(false);
    return <Checkbox checked={checked} onCheckedChange={setChecked} />;
  }
}`,...(o=(d=t.parameters)==null?void 0:d.docs)==null?void 0:o.source}}};var h,i,l;a.parameters={...a.parameters,docs:{...(h=a.parameters)==null?void 0:h.docs,source:{originalSource:`{
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
}`,...(l=(i=a.parameters)==null?void 0:i.docs)==null?void 0:l.source}}};const g=["Default","Sizes"];export{t as Default,a as Sizes,g as __namedExportsOrder,f as default};
