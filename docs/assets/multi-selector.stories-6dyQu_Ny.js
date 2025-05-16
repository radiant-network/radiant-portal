import{j as d}from"./jsx-runtime-Cf8x2fCZ.js";import{r as x}from"./index-tvICUrOf.js";import{f as b}from"./index-BZkcKs8Z.js";import{a as l}from"./index-B-lxVbXh.js";import{M as o}from"./multi-selector-DuhGMBPN.js";import"./index-yBjzXJbu.js";import"./v4-CtRu48qb.js";import"./useDebounce-4aLwS0To.js";import"./index-BrNmqHT9.js";import"./index-Csi1vtvD.js";import"./index-_r67kdfS.js";import"./index-fNjTmf9T.js";import"./index-CJn4dinJ.js";import"./Combination-e2pxAl-M.js";import"./index-pLOVI5Ig.js";import"./utils-CytzSlOG.js";import"./dialog-CRxNPPsg.js";import"./x-DA4wTodG.js";import"./createLucideIcon-DKFpjrVJ.js";import"./badge-DdUfarqx.js";import"./index-C66Dxnp2.js";import"./skeleton-CfkhzHGY.js";import"./check-CfPT3E_d.js";const B={title:"Data Entry/Inputs/Multi Selector",component:o,args:{value:[],onChange:b(),placeholder:"Placeholder"}},v=[{label:"Nextjs",value:"Nextjs"},{label:"Vite",value:"vite"},{label:"Nuxt",value:"nuxt",disable:!0},{label:"Vue",value:"vue, disable: true",disable:!0},{label:"Remix",value:"remix"},{label:"Svelte",value:"svelte",disable:!0},{label:"Angular",value:"angular",disable:!0},{label:"Ember",value:"ember",disable:!0},{label:"React",value:"react"},{label:"Gatsby",value:"gatsby",disable:!0},{label:"Astro",value:"astro",disable:!0}],a={render:()=>{const[t,s]=x.useState(["Nextjs"]);return d.jsx(o,{value:t,onChange:e=>{s(e),l("onChange")(e)},className:"max-w-[300px]",placeholder:"Placeholder",commandProps:{className:"max-w-[300px]"},defaultOptions:v})}},r={render:()=>{const[t,s]=x.useState(["Nextjs"]);return d.jsx(o,{value:t,onChange:e=>{s(e),l("onChange")(e)},onSearch:async e=>(l("onSearch")(e),new Promise(h=>{setTimeout(()=>h(v),1e3)})),debounceDelay:300,className:"max-w-[300px]",placeholder:"Placeholder",commandProps:{className:"max-w-[300px]"}})}};var u,n,m;a.parameters={...a.parameters,docs:{...(u=a.parameters)==null?void 0:u.docs,source:{originalSource:`{
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
}`,...(p=(i=r.parameters)==null?void 0:i.docs)==null?void 0:p.source}}};const F=["Default","AsyncSearch"];export{r as AsyncSearch,a as Default,F as __namedExportsOrder,B as default};
