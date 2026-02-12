import{j as d}from"./jsx-runtime-D_zvdyIk.js";import{r as h}from"./index-CBYaBgW8.js";import{a as s}from"./index-B-lxVbXh.js";import{M as o}from"./multi-selector-Cm3Xx_NC.js";import"./v4-CtRu48qb.js";import"./command-CqDCn1-N.js";import"./index-Cq0TEE3l.js";import"./index-D9mtqW9-.js";import"./index-sTUCEGFJ.js";import"./index-BWnBDfn-.js";import"./index-Dy6y0jaD.js";import"./index-DnEzm5An.js";import"./index-C8BBKGwP.js";import"./index-BL8Z-moU.js";import"./Combination-CrkgvPnV.js";import"./index-CWHKeK-O.js";import"./index-C66Dxnp2.js";import"./checkbox-BUFo-vqr.js";import"./index-SF2qmtPV.js";import"./index-C2iKAgIe.js";import"./utils-CDN07tui.js";import"./check-DSe_yRo5.js";import"./createLucideIcon-B119WVF5.js";import"./dialog-TAP2eCwF.js";import"./x-4HkHZ1eq.js";import"./badge-B8JYzoyf.js";import"./separator-ChZWIdMg.js";import"./index-C-d7IIsQ.js";import"./skeleton-_T1otFf0.js";import"./i18n-KYmtArbx.js";import"./iframe-ULnI94sP.js";import"./i18next-CYn7LYXT.js";import"./useDebounce-CEPqGWFj.js";const X={title:"Inputs/Multi Selector",component:o,args:{value:[],onChange:()=>{},placeholder:"Placeholder"}},x=[{label:"Nextjs",value:"Nextjs"},{label:"Vite",value:"vite"},{label:"Nuxt",value:"nuxt",disable:!0},{label:"Vue",value:"vue, disable: true",disable:!0},{label:"Remix",value:"remix"},{label:"Svelte",value:"svelte",disable:!0},{label:"Angular",value:"angular",disable:!0},{label:"Ember",value:"ember",disable:!0},{label:"React",value:"react"},{label:"Gatsby",value:"gatsby",disable:!0},{label:"Astro",value:"astro",disable:!0}],a={render:()=>{const[t,l]=h.useState(["Nextjs"]);return d.jsx(o,{value:t,onChange:e=>{l(e),s("onChange")(e)},className:"max-w-[300px]",placeholder:"Placeholder",commandProps:{className:"max-w-[300px]"},defaultOptions:x,hidePlaceholderWhenSelected:!0})}},r={render:()=>{const[t,l]=h.useState(["Nextjs"]);return d.jsx(o,{value:t,onChange:e=>{l(e),s("onChange")(e)},onSearch:async e=>(s("onSearch")(e),new Promise(v=>{setTimeout(()=>v(x),1e3)})),debounceDelay:300,className:"max-w-[300px]",placeholder:"Placeholder",commandProps:{className:"max-w-[300px]"}})}};var u,m,n;a.parameters={...a.parameters,docs:{...(u=a.parameters)==null?void 0:u.docs,source:{originalSource:`{
  render: () => {
    const [values, setValues] = useState<string[]>(['Nextjs']);
    return <MultiSelector value={values} onChange={newValues => {
      setValues(newValues);
      action('onChange')(newValues);
    }} className="max-w-[300px]" placeholder="Placeholder" commandProps={{
      className: 'max-w-[300px]'
    }} defaultOptions={defaultOptions} hidePlaceholderWhenSelected />;
  }
}`,...(n=(m=a.parameters)==null?void 0:m.docs)==null?void 0:n.source}}};var c,i,p;r.parameters={...r.parameters,docs:{...(c=r.parameters)==null?void 0:c.docs,source:{originalSource:`{
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
}`,...(p=(i=r.parameters)==null?void 0:i.docs)==null?void 0:p.source}}};const Y=["Default","AsyncSearch"];export{r as AsyncSearch,a as Default,Y as __namedExportsOrder,X as default};
