import{j as e}from"./jsx-runtime-D_zvdyIk.js";import{r as l}from"./index-CBYaBgW8.js";import{C as a}from"./checkbox-BUFo-vqr.js";import"./index-Dy6y0jaD.js";import"./index-D9mtqW9-.js";import"./index-sTUCEGFJ.js";import"./index-BWnBDfn-.js";import"./index-SF2qmtPV.js";import"./index-C2iKAgIe.js";import"./index-CWHKeK-O.js";import"./index-C66Dxnp2.js";import"./utils-CDN07tui.js";import"./check-DSe_yRo5.js";import"./createLucideIcon-B119WVF5.js";const D={title:"Inputs/Checkbox",args:{size:"default",checked:!1,onCheckedChange:()=>{}},component:a},c={render:()=>{const[s,t]=l.useState(!1);return e.jsx(a,{checked:s,onCheckedChange:t})}},r={render:()=>{const[s,t]=l.useState(!1);return e.jsxs(e.Fragment,{children:[e.jsxs("div",{className:"p-4",children:[e.jsx("h3",{className:"mb-4 text-lg font-semibold",children:"Size: default"}),e.jsx(a,{size:"default",checked:s,onCheckedChange:t})]}),e.jsxs("div",{className:"p-4",children:[e.jsx("h3",{className:"mb-4 text-lg font-semibold",children:"Size: xs"}),e.jsx(a,{size:"xs",checked:s,onCheckedChange:t})]})]})}};var n,o,d;c.parameters={...c.parameters,docs:{...(n=c.parameters)==null?void 0:n.docs,source:{originalSource:`{
  render: () => {
    const [checked, setChecked] = useState<CheckedState>(false);
    return <Checkbox checked={checked} onCheckedChange={setChecked} />;
  }
}`,...(d=(o=c.parameters)==null?void 0:o.docs)==null?void 0:d.source}}};var h,i,m;r.parameters={...r.parameters,docs:{...(h=r.parameters)==null?void 0:h.docs,source:{originalSource:`{
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
}`,...(m=(i=r.parameters)==null?void 0:i.docs)==null?void 0:m.source}}};const _=["Default","Sizes"];export{c as Default,r as Sizes,_ as __namedExportsOrder,D as default};
