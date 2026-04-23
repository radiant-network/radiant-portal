import{r as d,j as h}from"./iframe-DS1Fm7X-.js";import{M as o}from"./multi-selector-VTWh_Rg7.js";import"./preload-helper-Dp1pzeXC.js";import"./command-DgL1_b_0.js";import"./checkbox-UMrVhe44.js";import"./index-6pVpfOYW.js";import"./check-BaEquuuu.js";import"./dialog-DBmzyPfe.js";import"./x-DaBH8kTC.js";import"./badge-CYXaLEwc.js";import"./separator-Du257jra.js";import"./index-BrVm3R5S.js";import"./skeleton-CI8ZB7Zg.js";import"./i18n-D1vs1B9V.js";import"./useDebounce-5zll6TCN.js";const{action:r}=__STORYBOOK_MODULE_ACTIONS__,D={title:"Inputs/Multi Selector",component:o,args:{value:[],onChange:()=>{},placeholder:"Placeholder"}},x=[{label:"Nextjs",value:"Nextjs"},{label:"Vite",value:"vite"},{label:"Nuxt",value:"nuxt",disable:!0},{label:"Vue",value:"vue, disable: true",disable:!0},{label:"Remix",value:"remix"},{label:"Svelte",value:"svelte",disable:!0},{label:"Angular",value:"angular",disable:!0},{label:"Ember",value:"ember",disable:!0},{label:"React",value:"react"},{label:"Gatsby",value:"gatsby",disable:!0},{label:"Astro",value:"astro",disable:!0}],a={render:()=>{const[s,t]=d.useState(["Nextjs"]);return h.jsx(o,{value:s,onChange:e=>{t(e),r("onChange")(e)},className:"max-w-[300px]",placeholder:"Placeholder",commandProps:{className:"max-w-[300px]"},defaultOptions:x,hidePlaceholderWhenSelected:!0})}},l={render:()=>{const[s,t]=d.useState(["Nextjs"]);return h.jsx(o,{value:s,onChange:e=>{t(e),r("onChange")(e)},onSearch:async e=>(r("onSearch")(e),new Promise(v=>{setTimeout(()=>v(x),1e3)})),debounceDelay:300,className:"max-w-[300px]",placeholder:"Placeholder",commandProps:{className:"max-w-[300px]"}})}};var u,n,c;a.parameters={...a.parameters,docs:{...(u=a.parameters)==null?void 0:u.docs,source:{originalSource:`{
  render: () => {
    const [values, setValues] = useState<string[]>(['Nextjs']);
    return <MultiSelector value={values} onChange={newValues => {
      setValues(newValues);
      action('onChange')(newValues);
    }} className="max-w-[300px]" placeholder="Placeholder" commandProps={{
      className: 'max-w-[300px]'
    }} defaultOptions={defaultOptions} hidePlaceholderWhenSelected />;
  }
}`,...(c=(n=a.parameters)==null?void 0:n.docs)==null?void 0:c.source}}};var m,i,p;l.parameters={...l.parameters,docs:{...(m=l.parameters)==null?void 0:m.docs,source:{originalSource:`{
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
}`,...(p=(i=l.parameters)==null?void 0:i.docs)==null?void 0:p.source}}};const E=["Default","AsyncSearch"];export{l as AsyncSearch,a as Default,E as __namedExportsOrder,D as default};
