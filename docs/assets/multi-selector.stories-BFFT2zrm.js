import{j as d}from"./jsx-runtime-D_zvdyIk.js";import{r as x}from"./index-CTzypqlY.js";import{f as b}from"./index-60NixA5P.js";import{a as l}from"./index-B-lxVbXh.js";import{M as o}from"./multi-selector-CteaLvhd.js";import"./v4-CtRu48qb.js";import"./useDebounce-Dqjm5Rtc.js";import"./index-Bn1uQpHS.js";import"./index-DSqg7KUl.js";import"./index-8Ey6BpB7.js";import"./index-X_f_OX5J.js";import"./index-CqHHZPb-.js";import"./Combination-3tVHk2hX.js";import"./index-BEp8L1N2.js";import"./utils-bRKmu4jq.js";import"./dialog-DvWdWQke.js";import"./x-CjbLemEF.js";import"./createLucideIcon-j2ULFFRy.js";import"./badge-DhjusYgR.js";import"./index-C66Dxnp2.js";import"./skeleton-CncViAjR.js";import"./check-BwCYBAs1.js";const z={title:"Data Entry/Inputs/Multi Selector",component:o,args:{value:[],onChange:b(),placeholder:"Placeholder"}},v=[{label:"Nextjs",value:"Nextjs"},{label:"Vite",value:"vite"},{label:"Nuxt",value:"nuxt",disable:!0},{label:"Vue",value:"vue, disable: true",disable:!0},{label:"Remix",value:"remix"},{label:"Svelte",value:"svelte",disable:!0},{label:"Angular",value:"angular",disable:!0},{label:"Ember",value:"ember",disable:!0},{label:"React",value:"react"},{label:"Gatsby",value:"gatsby",disable:!0},{label:"Astro",value:"astro",disable:!0}],a={render:()=>{const[t,s]=x.useState(["Nextjs"]);return d.jsx(o,{value:t,onChange:e=>{s(e),l("onChange")(e)},className:"max-w-[300px]",placeholder:"Placeholder",commandProps:{className:"max-w-[300px]"},defaultOptions:v})}},r={render:()=>{const[t,s]=x.useState(["Nextjs"]);return d.jsx(o,{value:t,onChange:e=>{s(e),l("onChange")(e)},onSearch:async e=>(l("onSearch")(e),new Promise(h=>{setTimeout(()=>h(v),1e3)})),debounceDelay:300,className:"max-w-[300px]",placeholder:"Placeholder",commandProps:{className:"max-w-[300px]"}})}};var u,n,m;a.parameters={...a.parameters,docs:{...(u=a.parameters)==null?void 0:u.docs,source:{originalSource:`{
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
}`,...(p=(i=r.parameters)==null?void 0:i.docs)==null?void 0:p.source}}};const B=["Default","AsyncSearch"];export{r as AsyncSearch,a as Default,B as __namedExportsOrder,z as default};
