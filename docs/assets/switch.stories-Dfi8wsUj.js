import{j as s}from"./jsx-runtime-D_zvdyIk.js";import{r as C}from"./index-CGj_12n1.js";import{f as m}from"./index-B7YJKKKT.js";import{S as t}from"./switch-Nvdq8GXq.js";import"./index-CcLUv2_A.js";import"./index-COcwYKbe.js";import"./index-D8dqFcAi.js";import"./index-BBPXtLXU.js";import"./index-qxuqJ0RB.js";import"./index-A6VgBoaw.js";import"./index-C66Dxnp2.js";const E={title:"Inputs/Switch",args:{size:"default",checked:!1,onCheckedChange:m()},component:t},n={render:()=>{const[e,c]=C.useState(!1);return s.jsx(t,{checked:e,onCheckedChange:c})}},r={render:()=>{const[e,c]=C.useState(!1);return s.jsxs("div",{className:"flex gap-2",children:[s.jsx(t,{size:"default",checked:e,onCheckedChange:c}),s.jsx(t,{size:"xs",checked:e,onCheckedChange:c}),s.jsx(t,{size:"sm",checked:e,onCheckedChange:c}),s.jsx(t,{size:"md",checked:e,onCheckedChange:c}),s.jsx(t,{size:"lg",checked:e,onCheckedChange:c})]})}};var d,h,a;n.parameters={...n.parameters,docs:{...(d=n.parameters)==null?void 0:d.docs,source:{originalSource:`{
  render: () => {
    const [checked, setChecked] = useState(false);
    return <Switch checked={checked} onCheckedChange={setChecked} />;
  }
}`,...(a=(h=n.parameters)==null?void 0:h.docs)==null?void 0:a.source}}};var o,i,k;r.parameters={...r.parameters,docs:{...(o=r.parameters)==null?void 0:o.docs,source:{originalSource:`{
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
}`,...(k=(i=r.parameters)==null?void 0:i.docs)==null?void 0:k.source}}};const D=["Default","Sizes"];export{n as Default,r as Sizes,D as __namedExportsOrder,E as default};
