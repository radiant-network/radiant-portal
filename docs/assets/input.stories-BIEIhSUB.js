import{j as l}from"./jsx-runtime-Cf8x2fCZ.js";import{r as p}from"./index-tvICUrOf.js";import{fn as c}from"./index-BgJgh-x_.js";import{a as m}from"./index-B-lxVbXh.js";import{I as s}from"./input-BBA0CWHH.js";import"./index-yBjzXJbu.js";import"./v4-CtRu48qb.js";import"./utils-CytzSlOG.js";const C={title:"Data Entry/Inputs/Input",component:s,args:{value:"Input value",onChange:c(),placeholder:"Placeholder"}},e={render:()=>{const[n,u]=p.useState("");return l.jsx(s,{value:n,onChange:a=>{u(a.target.value),m("onChange")(a)},className:"max-w-[300px]",placeholder:"Placeholder",autoFocus:!0})}};var t,r,o;e.parameters={...e.parameters,docs:{...(t=e.parameters)==null?void 0:t.docs,source:{originalSource:`{
  render: () => {
    const [value, setValue] = useState('');
    return <Input value={value} onChange={e => {
      setValue(e.target.value);
      action('onChange')(e);
    }} className="max-w-[300px]" placeholder="Placeholder" autoFocus />;
  }
}`,...(o=(r=e.parameters)==null?void 0:r.docs)==null?void 0:o.source}}};const E=["Default"];export{e as Default,E as __namedExportsOrder,C as default};
