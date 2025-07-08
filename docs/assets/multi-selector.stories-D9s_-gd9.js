import{j as d}from"./jsx-runtime-D_zvdyIk.js";import{r as x}from"./index-DQLiH3RP.js";import{f as b}from"./index-B7YJKKKT.js";import{a as l}from"./index-B-lxVbXh.js";import{M as o}from"./multi-selector-CDb5d6wm.js";import"./v4-CtRu48qb.js";import"./command-bhyK-doV.js";import"./index-CkYa-_Ih.js";import"./index-D-AYaadb.js";import"./index-CECE1b4A.js";import"./index-CJPVTaBz.js";import"./index-Bf9LPmYV.js";import"./index-DD7n3F2b.js";import"./index-C5A_jyAq.js";import"./utils-D-KgF5mV.js";import"./dialog-tSfKNUXe.js";import"./x-ClsbQ_rO.js";import"./createLucideIcon-BMP5cxO1.js";import"./checkbox-CO27iIkV.js";import"./index-DDGWSPzp.js";import"./index-C66Dxnp2.js";import"./check-DSCf8CVO.js";import"./badge-D_UfbDzk.js";import"./useDebounce-D_2R-BOd.js";import"./skeleton-Shk8p_SP.js";const H={title:"Data Entry/Inputs/Multi Selector",component:o,args:{value:[],onChange:b(),placeholder:"Placeholder"}},v=[{label:"Nextjs",value:"Nextjs"},{label:"Vite",value:"vite"},{label:"Nuxt",value:"nuxt",disable:!0},{label:"Vue",value:"vue, disable: true",disable:!0},{label:"Remix",value:"remix"},{label:"Svelte",value:"svelte",disable:!0},{label:"Angular",value:"angular",disable:!0},{label:"Ember",value:"ember",disable:!0},{label:"React",value:"react"},{label:"Gatsby",value:"gatsby",disable:!0},{label:"Astro",value:"astro",disable:!0}],a={render:()=>{const[t,s]=x.useState(["Nextjs"]);return d.jsx(o,{value:t,onChange:e=>{s(e),l("onChange")(e)},className:"max-w-[300px]",placeholder:"Placeholder",commandProps:{className:"max-w-[300px]"},defaultOptions:v})}},r={render:()=>{const[t,s]=x.useState(["Nextjs"]);return d.jsx(o,{value:t,onChange:e=>{s(e),l("onChange")(e)},onSearch:async e=>(l("onSearch")(e),new Promise(h=>{setTimeout(()=>h(v),1e3)})),debounceDelay:300,className:"max-w-[300px]",placeholder:"Placeholder",commandProps:{className:"max-w-[300px]"}})}};var u,n,m;a.parameters={...a.parameters,docs:{...(u=a.parameters)==null?void 0:u.docs,source:{originalSource:`{
  render: () => {
    const [values, setValues] = useState<string[]>(['Nextjs']);
    return <MultiSelector value={values} onChange={newValues => {
      setValues(newValues);
      action('onChange')(newValues);
    }} className="max-w-[300px]" placeholder="Placeholder" commandProps={{
      className: 'max-w-[300px]'
    }} defaultOptions={defaultOptions} />;
  }
}`,...(m=(n=a.parameters)==null?void 0:n.docs)==null?void 0:m.source}}};var c,i,p;r.parameters={...r.parameters,docs:{...(c=r.parameters)==null?void 0:c.docs,source:{originalSource:`{
  render: () => {
    const [values, setValues] = useState<string[]>(['Nextjs']);
    return <MultiSelector value={values} onChange={newValues => {
      setValues(newValues);
      action('onChange')(newValues);
    }} onSearch={async searchValue => {
      action('onSearch')(searchValue);
      return new Promise(resolve => {
        setTimeout(() => resolve(defaultOptions), 1000);
      });
    }} debounceDelay={300} className="max-w-[300px]" placeholder="Placeholder" commandProps={{
      className: 'max-w-[300px]'
    }} />;
  }
}`,...(p=(i=r.parameters)==null?void 0:i.docs)==null?void 0:p.source}}};const J=["Default","AsyncSearch"];export{r as AsyncSearch,a as Default,J as __namedExportsOrder,H as default};
