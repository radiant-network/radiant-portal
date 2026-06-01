import{r as u,j as n}from"./iframe-fZ1JU2dD.js";import{M as o}from"./multi-selector-BdFw0Bfv.js";import"./preload-helper-PPVm8Dsz.js";import"./command-CVOpzYX-.js";import"./checkbox-CmUQOKcS.js";import"./index-oBed2HXp.js";import"./check-BCrtbgAX.js";import"./dialog-1epGVCQo.js";import"./x-DMxNaVrf.js";import"./badge-_ehbmyEb.js";import"./separator-Bt15M7Wt.js";import"./index-BuixPVmM.js";import"./skeleton-BjkBYmoC.js";import"./i18n-Cu2AZSyu.js";import"./index-BsMQ4rV8.js";import"./useDebounce-DyHW3nlg.js";const{action:r}=__STORYBOOK_MODULE_ACTIONS__,f={title:"Inputs/Multi Selector",component:o,args:{value:[],onChange:()=>{},placeholder:"Placeholder"}},c=[{label:"Nextjs",value:"Nextjs"},{label:"Vite",value:"vite"},{label:"Nuxt",value:"nuxt",disable:!0},{label:"Vue",value:"vue, disable: true",disable:!0},{label:"Remix",value:"remix"},{label:"Svelte",value:"svelte",disable:!0},{label:"Angular",value:"angular",disable:!0},{label:"Ember",value:"ember",disable:!0},{label:"React",value:"react"},{label:"Gatsby",value:"gatsby",disable:!0},{label:"Astro",value:"astro",disable:!0}],a={render:()=>{const[s,t]=u.useState(["Nextjs"]);return n.jsx(o,{value:s,onChange:e=>{t(e),r("onChange")(e)},className:"max-w-[300px]",placeholder:"Placeholder",commandProps:{className:"max-w-[300px]"},defaultOptions:c,hidePlaceholderWhenSelected:!0})}},l={render:()=>{const[s,t]=u.useState(["Nextjs"]);return n.jsx(o,{value:s,onChange:e=>{t(e),r("onChange")(e)},onSearch:async e=>(r("onSearch")(e),new Promise(m=>{setTimeout(()=>m(c),1e3)})),debounceDelay:300,className:"max-w-[300px]",placeholder:"Placeholder",commandProps:{className:"max-w-[300px]"}})}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  render: () => {
    const [values, setValues] = useState<string[]>(['Nextjs']);
    return <MultiSelector value={values} onChange={newValues => {
      setValues(newValues);
      action('onChange')(newValues);
    }} className="max-w-[300px]" placeholder="Placeholder" commandProps={{
      className: 'max-w-[300px]'
    }} defaultOptions={defaultOptions} hidePlaceholderWhenSelected />;
  }
}`,...a.parameters?.docs?.source}}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
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
}`,...l.parameters?.docs?.source}}};const y=["Default","AsyncSearch"];export{l as AsyncSearch,a as Default,y as __namedExportsOrder,f as default};
