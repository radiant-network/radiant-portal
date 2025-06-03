import{j as s}from"./jsx-runtime-D_zvdyIk.js";import{r as i}from"./index-CTzypqlY.js";import{f as m}from"./index-60NixA5P.js";import{C as t}from"./checkbox-CIvjriTD.js";import"./index-DSqg7KUl.js";import"./index-8Ey6BpB7.js";import"./index-X_f_OX5J.js";import"./index-W4gAHHet.js";import"./index-Y7TeOx8d.js";import"./index-BEp8L1N2.js";import"./utils-CytzSlOG.js";import"./index-C66Dxnp2.js";import"./check-BwCYBAs1.js";import"./createLucideIcon-j2ULFFRy.js";const _={title:"Data Entry/Checkbox",args:{size:"default",checked:!1,onCheckedChange:m()},component:t},r={render:()=>{const[e,c]=i.useState(!1);return s.jsx(t,{checked:e,onCheckedChange:c})}},n={render:()=>{const[e,c]=i.useState(!1);return s.jsxs("div",{className:"flex gap-2",children:[s.jsx(t,{size:"default",checked:e,onCheckedChange:c}),s.jsx(t,{size:"xs",checked:e,onCheckedChange:c}),s.jsx(t,{size:"sm",checked:e,onCheckedChange:c}),s.jsx(t,{size:"md",checked:e,onCheckedChange:c}),s.jsx(t,{size:"lg",checked:e,onCheckedChange:c})]})}};var o,a,d;r.parameters={...r.parameters,docs:{...(o=r.parameters)==null?void 0:o.docs,source:{originalSource:`{
  render: () => {
    const [checked, setChecked] = useState<CheckedState>(false);
    return <Checkbox checked={checked} onCheckedChange={setChecked} />;
  }
}`,...(d=(a=r.parameters)==null?void 0:a.docs)==null?void 0:d.source}}};var h,k,C;n.parameters={...n.parameters,docs:{...(h=n.parameters)==null?void 0:h.docs,source:{originalSource:`{
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
}`,...(C=(k=n.parameters)==null?void 0:k.docs)==null?void 0:C.source}}};const y=["Default","Sizes"];export{r as Default,n as Sizes,y as __namedExportsOrder,_ as default};
