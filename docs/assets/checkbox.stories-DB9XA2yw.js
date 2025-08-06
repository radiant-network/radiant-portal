import{j as s}from"./jsx-runtime-D_zvdyIk.js";import{r as i}from"./index-CGj_12n1.js";import{f as m}from"./index-B7YJKKKT.js";import{C as t}from"./checkbox-CZhHNwpD.js";import"./index-COcwYKbe.js";import"./index-D8dqFcAi.js";import"./index-BBPXtLXU.js";import"./index-CcLUv2_A.js";import"./index-qxuqJ0RB.js";import"./index-A6VgBoaw.js";import"./index-CKNrATXZ.js";import"./utils-D-KgF5mV.js";import"./index-C66Dxnp2.js";import"./check-DRc1RmCY.js";import"./createLucideIcon-8Lr1oLzj.js";const I={title:"Inputs/Checkbox",args:{size:"default",checked:!1,onCheckedChange:m()},component:t},r={render:()=>{const[e,c]=i.useState(!1);return s.jsx(t,{checked:e,onCheckedChange:c})}},o={render:()=>{const[e,c]=i.useState(!1);return s.jsxs("div",{className:"flex gap-2",children:[s.jsx(t,{size:"default",checked:e,onCheckedChange:c}),s.jsx(t,{size:"xs",checked:e,onCheckedChange:c}),s.jsx(t,{size:"sm",checked:e,onCheckedChange:c}),s.jsx(t,{size:"md",checked:e,onCheckedChange:c}),s.jsx(t,{size:"lg",checked:e,onCheckedChange:c})]})}};var n,d,h;r.parameters={...r.parameters,docs:{...(n=r.parameters)==null?void 0:n.docs,source:{originalSource:`{
  render: () => {
    const [checked, setChecked] = useState<CheckedState>(false);
    return <Checkbox checked={checked} onCheckedChange={setChecked} />;
  }
}`,...(h=(d=r.parameters)==null?void 0:d.docs)==null?void 0:h.source}}};var a,k,C;o.parameters={...o.parameters,docs:{...(a=o.parameters)==null?void 0:a.docs,source:{originalSource:`{
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
}`,...(C=(k=o.parameters)==null?void 0:k.docs)==null?void 0:C.source}}};const O=["Default","Sizes"];export{r as Default,o as Sizes,O as __namedExportsOrder,I as default};
