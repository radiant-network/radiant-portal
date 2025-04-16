import{j as s}from"./jsx-runtime-Cf8x2fCZ.js";import{r as i}from"./index-tvICUrOf.js";import{fn as m}from"./index-BgJgh-x_.js";import{C as t}from"./checkbox-vsQjBw__.js";import"./index-yBjzXJbu.js";import"./index-Dq5VjjLd.js";import"./index-_r67kdfS.js";import"./index-fNjTmf9T.js";import"./index-C1xbsqtW.js";import"./index-y2NRHbXQ.js";import"./index-kJTK8mBK.js";import"./utils-BNf5BS2b.js";import"./index-C66Dxnp2.js";import"./check-CfPT3E_d.js";import"./createLucideIcon-DKFpjrVJ.js";const y={title:"Data Entry/Checkbox",args:{size:"default",checked:!1,onCheckedChange:m()},component:t},r={render:()=>{const[e,c]=i.useState(!1);return s.jsx(t,{checked:e,onCheckedChange:c})}},n={render:()=>{const[e,c]=i.useState(!1);return s.jsxs("div",{className:"flex gap-2",children:[s.jsx(t,{size:"default",checked:e,onCheckedChange:c}),s.jsx(t,{size:"xs",checked:e,onCheckedChange:c}),s.jsx(t,{size:"sm",checked:e,onCheckedChange:c}),s.jsx(t,{size:"md",checked:e,onCheckedChange:c}),s.jsx(t,{size:"lg",checked:e,onCheckedChange:c})]})}};var o,a,d;r.parameters={...r.parameters,docs:{...(o=r.parameters)==null?void 0:o.docs,source:{originalSource:`{
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
}`,...(C=(k=n.parameters)==null?void 0:k.docs)==null?void 0:C.source}}};const O=["Default","Sizes"];export{r as Default,n as Sizes,O as __namedExportsOrder,y as default};
