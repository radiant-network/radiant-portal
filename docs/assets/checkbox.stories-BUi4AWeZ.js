import{j as s}from"./jsx-runtime-D_zvdyIk.js";import{r as i}from"./index-DUAV1Q2A.js";import{f as m}from"./index-DZ0MIZXx.js";import{C as t}from"./checkbox-C5px12ct.js";import"./index-CpwtQhPK.js";import"./index-CSO_qfi8.js";import"./index-CqVsPxxY.js";import"./index-DeoL25kd.js";import"./index-D74gQ3ji.js";import"./check-CSglOr1T.js";import"./createLucideIcon-BJ1WAg3L.js";import"./utils-BNf5BS2b.js";import"./index-C66Dxnp2.js";const N={title:"Base/Data Entry/Checkbox",tags:["autodocs"],args:{size:"default",checked:!1,onCheckedChange:m()},component:t},a={render:()=>{const[e,c]=i.useState(!1);return s.jsx(t,{checked:e,onCheckedChange:c})}},o={render:()=>{const[e,c]=i.useState(!1);return s.jsxs("div",{className:"flex gap-2",children:[s.jsx(t,{size:"default",checked:e,onCheckedChange:c}),s.jsx(t,{size:"xs",checked:e,onCheckedChange:c}),s.jsx(t,{size:"sm",checked:e,onCheckedChange:c}),s.jsx(t,{size:"md",checked:e,onCheckedChange:c}),s.jsx(t,{size:"lg",checked:e,onCheckedChange:c})]})}};var r,n,d;a.parameters={...a.parameters,docs:{...(r=a.parameters)==null?void 0:r.docs,source:{originalSource:`{
  render: () => {
    const [checked, setChecked] = useState<CheckedState>(false);
    return <Checkbox checked={checked} onCheckedChange={setChecked} />;
  }
}`,...(d=(n=a.parameters)==null?void 0:n.docs)==null?void 0:d.source}}};var h,k,C;o.parameters={...o.parameters,docs:{...(h=o.parameters)==null?void 0:h.docs,source:{originalSource:`{
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
}`,...(C=(k=o.parameters)==null?void 0:k.docs)==null?void 0:C.source}}};const _=["Default","Sizes"];export{a as Default,o as Sizes,_ as __namedExportsOrder,N as default};
