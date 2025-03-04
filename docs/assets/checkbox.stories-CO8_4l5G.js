import{j as s}from"./jsx-runtime-D_zvdyIk.js";import{r as i}from"./index-DUAV1Q2A.js";import{f as m}from"./index-DhvbgntC.js";import{C as t}from"./checkbox-DXUvLd6r.js";import"./index-U3FPUE7W.js";import"./index-VDvXe9nZ.js";import"./index-CqVsPxxY.js";import"./index-DeoL25kd.js";import"./check-BNLNP-zw.js";import"./createLucideIcon-DirO1-NP.js";import"./utils-BNf5BS2b.js";import"./index-C66Dxnp2.js";const D={title:"Base/Data Entry/Checkbox",tags:["autodocs"],args:{size:"default",checked:!1,onCheckedChange:m()},component:t},a={render:()=>{const[e,c]=i.useState(!1);return s.jsx(t,{checked:e,onCheckedChange:c})}},n={render:()=>{const[e,c]=i.useState(!1);return s.jsxs("div",{className:"flex gap-2",children:[s.jsx(t,{size:"default",checked:e,onCheckedChange:c}),s.jsx(t,{size:"xs",checked:e,onCheckedChange:c}),s.jsx(t,{size:"sm",checked:e,onCheckedChange:c}),s.jsx(t,{size:"md",checked:e,onCheckedChange:c}),s.jsx(t,{size:"lg",checked:e,onCheckedChange:c})]})}};var o,r,d;a.parameters={...a.parameters,docs:{...(o=a.parameters)==null?void 0:o.docs,source:{originalSource:`{
  render: () => {
    const [checked, setChecked] = useState<CheckedState>(false);
    return <Checkbox checked={checked} onCheckedChange={setChecked} />;
  }
}`,...(d=(r=a.parameters)==null?void 0:r.docs)==null?void 0:d.source}}};var h,k,C;n.parameters={...n.parameters,docs:{...(h=n.parameters)==null?void 0:h.docs,source:{originalSource:`{
  render: () => {
    const [checked, setChecked] = useState<CheckedState>(false);
    return <div className="flex gap-2">
        <Checkbox size="default" checked={checked} onCheckedChange={setChecked} />
        <Checkbox size="xs" checked={checked} onCheckedChange={setChecked} />
        <Checkbox size="sm" checked={checked} onCheckedChange={setChecked} />
        <Checkbox size="md" checked={checked} onCheckedChange={setChecked} />
        <Checkbox size="lg" checked={checked} onCheckedChange={setChecked} />
      </div>;
  }
}`,...(C=(k=n.parameters)==null?void 0:k.docs)==null?void 0:C.source}}};const N=["Default","Sizes"];export{a as Default,n as Sizes,N as __namedExportsOrder,D as default};
