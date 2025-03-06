import{j as u}from"./jsx-runtime-D_zvdyIk.js";import{r as c}from"./index-DUAV1Q2A.js";import{f as m}from"./index-DhvbgntC.js";import{a as p}from"./index-B-lxVbXh.js";import{I as n}from"./input-B2gjFgpo.js";import"./v4-CtRu48qb.js";import"./utils-BNf5BS2b.js";const C={title:"Base/Data Entry/Input",component:n,args:{value:"value",onChange:m(),placeholder:"Placeholder"}},e={render:()=>{const[s,l]=c.useState("");return u.jsx(n,{value:s,onChange:a=>{l(a.target.value),p("onChange")(a)},className:"max-w-[300px]",placeholder:"Placeholder",autoFocus:!0})}};var t,r,o;e.parameters={...e.parameters,docs:{...(t=e.parameters)==null?void 0:t.docs,source:{originalSource:`{
  render: () => {
    const [value, setValue] = useState("");
    return <Input value={value} onChange={e => {
      setValue(e.target.value);
      action("onChange")(e);
    }} className="max-w-[300px]" placeholder="Placeholder" autoFocus />;
  }
}`,...(o=(r=e.parameters)==null?void 0:r.docs)==null?void 0:o.source}}};const E=["Default"];export{e as Default,E as __namedExportsOrder,C as default};
