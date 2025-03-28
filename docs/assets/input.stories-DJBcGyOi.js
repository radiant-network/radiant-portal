import{j as m}from"./jsx-runtime-Cf8x2fCZ.js";import{r as l}from"./index-tvICUrOf.js";import{f as c}from"./index-BZkcKs8Z.js";import{a as i}from"./index-B-lxVbXh.js";import{u as d}from"./i18n-Ber6Uh7x.js";import{I as s}from"./input-BZ84EvCs.js";import"./index-yBjzXJbu.js";import"./v4-CtRu48qb.js";import"./iframe-DkzBV2aV.js";import"./utils-BNf5BS2b.js";const S={title:"Base/Data Entry/Inputs/Input",component:s,args:{value:"Input value",onChange:c(),placeholder:"Placeholder"}},e={render:()=>{const[n,u]=l.useState(""),{t:p}=d();return m.jsx(s,{value:n,onChange:t=>{u(t.target.value),i("onChange")(t)},className:"max-w-[300px]",placeholder:p("common.input.placeholder"),autoFocus:!0})}};var a,o,r;e.parameters={...e.parameters,docs:{...(a=e.parameters)==null?void 0:a.docs,source:{originalSource:`{
  render: () => {
    const [value, setValue] = useState("");
    const {
      t
    } = useI18n();
    return <Input value={value} onChange={e => {
      setValue(e.target.value);
      action("onChange")(e);
    }} className="max-w-[300px]" placeholder={t('common.input.placeholder')} autoFocus />;
  }
}`,...(r=(o=e.parameters)==null?void 0:o.docs)==null?void 0:r.source}}};const V=["Default"];export{e as Default,V as __namedExportsOrder,S as default};
