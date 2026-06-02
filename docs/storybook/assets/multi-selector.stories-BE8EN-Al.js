import{r as u,j as n}from"./iframe-X1FdiBKE.js";import{M as o}from"./multi-selector-BUW20JpP.js";import"./preload-helper-PPVm8Dsz.js";import"./command-ChuZoNNZ.js";import"./checkbox-DHqhLv6e.js";import"./index-BjLlGfE7.js";import"./check-CpvZoXR-.js";import"./dialog-h83xAsXy.js";import"./x-CT6RiXhO.js";import"./badge-B50hIUkw.js";import"./separator-BcF0hBxw.js";import"./index-BerhZw8G.js";import"./skeleton-UMhyrLm4.js";import"./i18n-DsLlobA0.js";import"./index-BoMd93ow.js";import"./useDebounce-Cs2ID8yH.js";const{action:r}=__STORYBOOK_MODULE_ACTIONS__,f={title:"Inputs/Multi Selector",component:o,args:{value:[],onChange:()=>{},placeholder:"Placeholder"}},c=[{label:"Nextjs",value:"Nextjs"},{label:"Vite",value:"vite"},{label:"Nuxt",value:"nuxt",disable:!0},{label:"Vue",value:"vue, disable: true",disable:!0},{label:"Remix",value:"remix"},{label:"Svelte",value:"svelte",disable:!0},{label:"Angular",value:"angular",disable:!0},{label:"Ember",value:"ember",disable:!0},{label:"React",value:"react"},{label:"Gatsby",value:"gatsby",disable:!0},{label:"Astro",value:"astro",disable:!0}],a={render:()=>{const[s,t]=u.useState(["Nextjs"]);return n.jsx(o,{value:s,onChange:e=>{t(e),r("onChange")(e)},className:"max-w-[300px]",placeholder:"Placeholder",commandProps:{className:"max-w-[300px]"},defaultOptions:c,hidePlaceholderWhenSelected:!0})}},l={render:()=>{const[s,t]=u.useState(["Nextjs"]);return n.jsx(o,{value:s,onChange:e=>{t(e),r("onChange")(e)},onSearch:async e=>(r("onSearch")(e),new Promise(m=>{setTimeout(()=>m(c),1e3)})),debounceDelay:300,className:"max-w-[300px]",placeholder:"Placeholder",commandProps:{className:"max-w-[300px]"}})}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
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
