import{j as l}from"./jsx-runtime-D_zvdyIk.js";import{r as c}from"./index-DUAV1Q2A.js";import{f as p}from"./index-DZ0MIZXx.js";import{a as m}from"./index-B-lxVbXh.js";import{I as n}from"./input-BBoUXjlS.js";import"./v4-CtRu48qb.js";import"./utils-BNf5BS2b.js";const C={title:"Base/Data Entry/Inputs/Input",component:n,args:{value:"value",onChange:p(),placeholder:"Placeholder"}},e={render:()=>{const[s,u]=c.useState("");return l.jsx(n,{value:s,onChange:a=>{u(a.target.value),m("onChange")(a)},className:"max-w-[300px]",placeholder:"Placeholder",autoFocus:!0})}};var t,r,o;e.parameters={...e.parameters,docs:{...(t=e.parameters)==null?void 0:t.docs,source:{originalSource:`{
  render: () => {
    const [value, setValue] = useState("");
    return <Input value={value} onChange={e => {
      setValue(e.target.value);
      action("onChange")(e);
    }} className="max-w-[300px]" placeholder="Placeholder" autoFocus />;
  }
}`,...(o=(r=e.parameters)==null?void 0:r.docs)==null?void 0:o.source}}};const I=["Default"];export{e as Default,I as __namedExportsOrder,C as default};
