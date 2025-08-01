import{j as d}from"./jsx-runtime-D_zvdyIk.js";import{r as x}from"./index-CGj_12n1.js";import{f as b}from"./index-B7YJKKKT.js";import{a as l}from"./index-B-lxVbXh.js";import{M as o}from"./multi-selector-C8yegqWf.js";import"./v4-CtRu48qb.js";import"./command-Brw0tXPK.js";import"./index-io6LyWnD.js";import"./index-CDVHwwC2.js";import"./index-COcwYKbe.js";import"./index-D8dqFcAi.js";import"./index-BBPXtLXU.js";import"./index-DUXZ-Llx.js";import"./index-2ptLTYfO.js";import"./index-Bp_Zkv6j.js";import"./utils-D-KgF5mV.js";import"./dialog-DkadOBmo.js";import"./x-CubKniSv.js";import"./createLucideIcon-8Lr1oLzj.js";import"./checkbox-DMd2svcp.js";import"./index-qxuqJ0RB.js";import"./index-C66Dxnp2.js";import"./check-DRc1RmCY.js";import"./badge-aQXnmXeU.js";import"./separator-6xmuS_PL.js";import"./useDebounce-CWd6BpJ3.js";import"./skeleton-Shk8p_SP.js";const K={title:"Data Entry/Inputs/Multi Selector",component:o,args:{value:[],onChange:b(),placeholder:"Placeholder"}},v=[{label:"Nextjs",value:"Nextjs"},{label:"Vite",value:"vite"},{label:"Nuxt",value:"nuxt",disable:!0},{label:"Vue",value:"vue, disable: true",disable:!0},{label:"Remix",value:"remix"},{label:"Svelte",value:"svelte",disable:!0},{label:"Angular",value:"angular",disable:!0},{label:"Ember",value:"ember",disable:!0},{label:"React",value:"react"},{label:"Gatsby",value:"gatsby",disable:!0},{label:"Astro",value:"astro",disable:!0}],a={render:()=>{const[t,s]=x.useState(["Nextjs"]);return d.jsx(o,{value:t,onChange:e=>{s(e),l("onChange")(e)},className:"max-w-[300px]",placeholder:"Placeholder",commandProps:{className:"max-w-[300px]"},defaultOptions:v})}},r={render:()=>{const[t,s]=x.useState(["Nextjs"]);return d.jsx(o,{value:t,onChange:e=>{s(e),l("onChange")(e)},onSearch:async e=>(l("onSearch")(e),new Promise(h=>{setTimeout(()=>h(v),1e3)})),debounceDelay:300,className:"max-w-[300px]",placeholder:"Placeholder",commandProps:{className:"max-w-[300px]"}})}};var u,n,m;a.parameters={...a.parameters,docs:{...(u=a.parameters)==null?void 0:u.docs,source:{originalSource:`{
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
}`,...(p=(i=r.parameters)==null?void 0:i.docs)==null?void 0:p.source}}};const L=["Default","AsyncSearch"];export{r as AsyncSearch,a as Default,L as __namedExportsOrder,K as default};
