import{r as c,j as r}from"./iframe-iTti_pyP.js";import{M as n}from"./multi-selector-_KxASPgj.js";import{a as u}from"./story-section-j7yPxqOK.js";import"./preload-helper-PPVm8Dsz.js";import"./command-BI11jVcb.js";import"./checkbox-18c2Zthj.js";import"./index-BkDmPPzg.js";import"./check-6NEOXGRc.js";import"./dialog-DPzKqq5H.js";import"./x-CnmNbzCA.js";import"./badge-BVLQD79v.js";import"./separator-C80gP3l5.js";import"./index-Da66sVI7.js";import"./skeleton-jP3ldIdQ.js";import"./i18n-D7u3QZ6s.js";import"./index-DDx7eZJ9.js";import"./useDebounce-CYc8FcuW.js";const{action:o}=__STORYBOOK_MODULE_ACTIONS__,_={title:"Components/Inputs/Multi Selector",component:n,args:{value:[],onChange:()=>{},placeholder:"Placeholder"}},i=[{label:"Nextjs",value:"Nextjs"},{label:"Vite",value:"vite"},{label:"Nuxt",value:"nuxt",disable:!0},{label:"Vue",value:"vue, disable: true",disable:!0},{label:"Remix",value:"remix"},{label:"Svelte",value:"svelte",disable:!0},{label:"Angular",value:"angular",disable:!0},{label:"Ember",value:"ember",disable:!0},{label:"React",value:"react"},{label:"Gatsby",value:"gatsby",disable:!0},{label:"Astro",value:"astro",disable:!0}],a={render:()=>{const[l,s]=c.useState(["Nextjs"]);return r.jsx(u,{title:"Default",children:r.jsx(n,{value:l,onChange:e=>{s(e),o("onChange")(e)},className:"max-w-[300px]",placeholder:"Placeholder",commandProps:{className:"max-w-[300px]"},defaultOptions:i,hidePlaceholderWhenSelected:!0})})}},t={render:()=>{const[l,s]=c.useState(["Nextjs"]);return r.jsx(u,{title:"Async search",children:r.jsx(n,{value:l,onChange:e=>{s(e),o("onChange")(e)},onSearch:async e=>(o("onSearch")(e),new Promise(m=>{setTimeout(()=>m(i),1e3)})),debounceDelay:300,className:"max-w-[300px]",placeholder:"Placeholder",commandProps:{className:"max-w-[300px]"}})})}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  render: () => {
    const [values, setValues] = useState<string[]>(['Nextjs']);
    return <StorySection title="Default">
        <MultiSelector value={values} onChange={newValues => {
        setValues(newValues);
        action('onChange')(newValues);
      }} className="max-w-[300px]" placeholder="Placeholder" commandProps={{
        className: 'max-w-[300px]'
      }} defaultOptions={defaultOptions} hidePlaceholderWhenSelected />
      </StorySection>;
  }
}`,...a.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  render: () => {
    const [values, setValues] = useState<string[]>(['Nextjs']);
    return <StorySection title="Async search">
        <MultiSelector value={values} onChange={newValues => {
        setValues(newValues);
        action('onChange')(newValues);
      }} onSearch={async searchValue => {
        action('onSearch')(searchValue);
        return new Promise(resolve => {
          setTimeout(() => resolve(defaultOptions), 1000);
        });
      }} debounceDelay={300} className="max-w-[300px]" placeholder="Placeholder" commandProps={{
        className: 'max-w-[300px]'
      }} />
      </StorySection>;
  }
}`,...t.parameters?.docs?.source}}};const A=["Default","AsyncSearch"];export{t as AsyncSearch,a as Default,A as __namedExportsOrder,_ as default};
