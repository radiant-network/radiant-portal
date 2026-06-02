import{r as u,j as n}from"./iframe-DaN5ePGy.js";import{M as o}from"./multi-selector-D2MJNUxO.js";import"./preload-helper-PPVm8Dsz.js";import"./command-Cbufo2GG.js";import"./checkbox-R3ES-PDx.js";import"./index-Bxzg_Qkc.js";import"./check-B-s7SQrr.js";import"./dialog-DbhL1w5X.js";import"./x-BX9lxs28.js";import"./badge-BE-JumNl.js";import"./separator-Dw2V0eT4.js";import"./index-buk7i43K.js";import"./skeleton-ddFZC1OR.js";import"./i18n-M9kOJp22.js";import"./index-FwWjbq00.js";import"./useDebounce-BaeYRs8l.js";const{action:r}=__STORYBOOK_MODULE_ACTIONS__,f={title:"Inputs/Multi Selector",component:o,args:{value:[],onChange:()=>{},placeholder:"Placeholder"}},c=[{label:"Nextjs",value:"Nextjs"},{label:"Vite",value:"vite"},{label:"Nuxt",value:"nuxt",disable:!0},{label:"Vue",value:"vue, disable: true",disable:!0},{label:"Remix",value:"remix"},{label:"Svelte",value:"svelte",disable:!0},{label:"Angular",value:"angular",disable:!0},{label:"Ember",value:"ember",disable:!0},{label:"React",value:"react"},{label:"Gatsby",value:"gatsby",disable:!0},{label:"Astro",value:"astro",disable:!0}],a={render:()=>{const[s,t]=u.useState(["Nextjs"]);return n.jsx(o,{value:s,onChange:e=>{t(e),r("onChange")(e)},className:"max-w-[300px]",placeholder:"Placeholder",commandProps:{className:"max-w-[300px]"},defaultOptions:c,hidePlaceholderWhenSelected:!0})}},l={render:()=>{const[s,t]=u.useState(["Nextjs"]);return n.jsx(o,{value:s,onChange:e=>{t(e),r("onChange")(e)},onSearch:async e=>(r("onSearch")(e),new Promise(m=>{setTimeout(()=>m(c),1e3)})),debounceDelay:300,className:"max-w-[300px]",placeholder:"Placeholder",commandProps:{className:"max-w-[300px]"}})}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
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
