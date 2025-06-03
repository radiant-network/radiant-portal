import{j as s}from"./jsx-runtime-D_zvdyIk.js";import{r as C}from"./index-CTzypqlY.js";import{f as m}from"./index-60NixA5P.js";import{S as t}from"./switch-Dfkifvoy.js";import"./index-DSqg7KUl.js";import"./index-8Ey6BpB7.js";import"./index-X_f_OX5J.js";import"./index-W4gAHHet.js";import"./index-Y7TeOx8d.js";import"./index-C66Dxnp2.js";const E={title:"Data Entry/Switch",args:{size:"default",checked:!1,onCheckedChange:m()},component:t},n={render:()=>{const[e,c]=C.useState(!1);return s.jsx(t,{checked:e,onCheckedChange:c})}},r={render:()=>{const[e,c]=C.useState(!1);return s.jsxs("div",{className:"flex gap-2",children:[s.jsx(t,{size:"default",checked:e,onCheckedChange:c}),s.jsx(t,{size:"xs",checked:e,onCheckedChange:c}),s.jsx(t,{size:"sm",checked:e,onCheckedChange:c}),s.jsx(t,{size:"md",checked:e,onCheckedChange:c}),s.jsx(t,{size:"lg",checked:e,onCheckedChange:c})]})}};var a,d,h;n.parameters={...n.parameters,docs:{...(a=n.parameters)==null?void 0:a.docs,source:{originalSource:`{
  render: () => {
    const [checked, setChecked] = useState(false);
    return <Switch checked={checked} onCheckedChange={setChecked} />;
  }
}`,...(h=(d=n.parameters)==null?void 0:d.docs)==null?void 0:h.source}}};var o,i,k;r.parameters={...r.parameters,docs:{...(o=r.parameters)==null?void 0:o.docs,source:{originalSource:`{
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
}`,...(k=(i=r.parameters)==null?void 0:i.docs)==null?void 0:k.source}}};const v=["Default","Sizes"];export{n as Default,r as Sizes,v as __namedExportsOrder,E as default};
