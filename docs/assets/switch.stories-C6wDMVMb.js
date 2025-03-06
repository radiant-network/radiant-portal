import{j as s}from"./jsx-runtime-D_zvdyIk.js";import{r as C}from"./index-DUAV1Q2A.js";import{f as m}from"./index-DhvbgntC.js";import{S as t}from"./switch-Dibfz1el.js";import"./index-aKoabQ1X.js";import"./index-VDvXe9nZ.js";import"./index-CqVsPxxY.js";import"./index-DeoL25kd.js";import"./index-BXOWtdLR.js";import"./index-C66Dxnp2.js";const E={title:"Base/Data Entry/Switch",tags:["autodocs"],args:{size:"default",checked:!1,onCheckedChange:m()},component:t},n={render:()=>{const[e,c]=C.useState(!1);return s.jsx(t,{checked:e,onCheckedChange:c})}},a={render:()=>{const[e,c]=C.useState(!1);return s.jsxs("div",{className:"flex gap-2",children:[s.jsx(t,{size:"default",checked:e,onCheckedChange:c}),s.jsx(t,{size:"xs",checked:e,onCheckedChange:c}),s.jsx(t,{size:"sm",checked:e,onCheckedChange:c}),s.jsx(t,{size:"md",checked:e,onCheckedChange:c}),s.jsx(t,{size:"lg",checked:e,onCheckedChange:c})]})}};var r,d,h;n.parameters={...n.parameters,docs:{...(r=n.parameters)==null?void 0:r.docs,source:{originalSource:`{
  render: () => {
    const [checked, setChecked] = useState(false);
    return <Switch checked={checked} onCheckedChange={setChecked} />;
  }
}`,...(h=(d=n.parameters)==null?void 0:d.docs)==null?void 0:h.source}}};var o,i,k;a.parameters={...a.parameters,docs:{...(o=a.parameters)==null?void 0:o.docs,source:{originalSource:`{
  render: () => {
    const [checked, setChecked] = useState(false);
    return <div className="flex gap-2">
        <Switch size="default" checked={checked} onCheckedChange={setChecked} />
        <Switch size="xs" checked={checked} onCheckedChange={setChecked} />
        <Switch size="sm" checked={checked} onCheckedChange={setChecked} />
        <Switch size="md" checked={checked} onCheckedChange={setChecked} />
        <Switch size="lg" checked={checked} onCheckedChange={setChecked} />
      </div>;
  }
}`,...(k=(i=a.parameters)==null?void 0:i.docs)==null?void 0:k.source}}};const v=["Default","Sizes"];export{n as Default,a as Sizes,v as __namedExportsOrder,E as default};
