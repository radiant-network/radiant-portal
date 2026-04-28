import{r as d,j as h}from"./iframe-BzPXB4sC.js";import{M as o}from"./multi-selector-DClg5Oup.js";import"./preload-helper-Dp1pzeXC.js";import"./command-BvXjL45y.js";import"./checkbox-CTcufNLQ.js";import"./index-BxlgodF6.js";import"./check-N4EqZ0NE.js";import"./dialog-AYh26kwc.js";import"./x-GpHZLcX6.js";import"./badge-Bkyg6NYQ.js";import"./separator-CrPHIJDG.js";import"./index-95tL82tM.js";import"./skeleton-BsdIzALQ.js";import"./i18n-BfGFGaNE.js";import"./useDebounce-BvkyfMEc.js";const{action:r}=__STORYBOOK_MODULE_ACTIONS__,D={title:"Inputs/Multi Selector",component:o,args:{value:[],onChange:()=>{},placeholder:"Placeholder"}},x=[{label:"Nextjs",value:"Nextjs"},{label:"Vite",value:"vite"},{label:"Nuxt",value:"nuxt",disable:!0},{label:"Vue",value:"vue, disable: true",disable:!0},{label:"Remix",value:"remix"},{label:"Svelte",value:"svelte",disable:!0},{label:"Angular",value:"angular",disable:!0},{label:"Ember",value:"ember",disable:!0},{label:"React",value:"react"},{label:"Gatsby",value:"gatsby",disable:!0},{label:"Astro",value:"astro",disable:!0}],a={render:()=>{const[s,t]=d.useState(["Nextjs"]);return h.jsx(o,{value:s,onChange:e=>{t(e),r("onChange")(e)},className:"max-w-[300px]",placeholder:"Placeholder",commandProps:{className:"max-w-[300px]"},defaultOptions:x,hidePlaceholderWhenSelected:!0})}},l={render:()=>{const[s,t]=d.useState(["Nextjs"]);return h.jsx(o,{value:s,onChange:e=>{t(e),r("onChange")(e)},onSearch:async e=>(r("onSearch")(e),new Promise(v=>{setTimeout(()=>v(x),1e3)})),debounceDelay:300,className:"max-w-[300px]",placeholder:"Placeholder",commandProps:{className:"max-w-[300px]"}})}};var u,n,c;a.parameters={...a.parameters,docs:{...(u=a.parameters)==null?void 0:u.docs,source:{originalSource:`{
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
