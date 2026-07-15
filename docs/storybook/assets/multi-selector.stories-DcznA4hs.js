import{r as c,j as l}from"./iframe-kLaNX2HI.js";import{M as n}from"./multi-selector-Oz_FZ-lG.js";import{a as u}from"./story-section-YShHgFMq.js";import"./preload-helper-PPVm8Dsz.js";import"./command-9_KFPD2M.js";import"./checkbox-BvGeGKrx.js";import"./index-B8pi8AaO.js";import"./check-NiNg2u4X.js";import"./dialog-DBq4pjD_.js";import"./x-AVvb3cMA.js";import"./badge-BBff1bAs.js";import"./separator-BTZwSWvT.js";import"./skeleton-DmgM1E7r.js";import"./i18n-ZHel4DsP.js";import"./index-BCXviJZk.js";import"./useDebounce-5-CJ8lzR.js";const{action:o}=__STORYBOOK_MODULE_ACTIONS__,O={title:"Components/Inputs/Multi Selector",component:n,args:{value:[],onChange:()=>{},placeholder:"Placeholder"}},i=[{label:"Nextjs",value:"Nextjs"},{label:"Vite",value:"vite"},{label:"Nuxt",value:"nuxt",disable:!0},{label:"Vue",value:"vue, disable: true",disable:!0},{label:"Remix",value:"remix"},{label:"Svelte",value:"svelte",disable:!0},{label:"Angular",value:"angular",disable:!0},{label:"Ember",value:"ember",disable:!0},{label:"React",value:"react"},{label:"Gatsby",value:"gatsby",disable:!0},{label:"Astro",value:"astro",disable:!0}],a={render:()=>{const[r,s]=c.useState(["Nextjs"]);return l.jsx(u,{title:"Default",children:l.jsx(n,{value:r,onChange:e=>{s(e),o("onChange")(e)},className:"max-w-[300px]",placeholder:"Placeholder",commandProps:{className:"max-w-[300px]"},defaultOptions:i,hidePlaceholderWhenSelected:!0})})}},t={render:()=>{const[r,s]=c.useState(["Nextjs"]);return l.jsx(u,{title:"Async search",children:l.jsx(n,{value:r,onChange:e=>{s(e),o("onChange")(e)},onSearch:async e=>(o("onSearch")(e),new Promise(m=>{setTimeout(()=>m(i),1e3)})),debounceDelay:300,className:"max-w-[300px]",placeholder:"Placeholder",commandProps:{className:"max-w-[300px]"}})})}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
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
}`,...t.parameters?.docs?.source}}};const _=["Default","AsyncSearch"];export{t as AsyncSearch,a as Default,_ as __namedExportsOrder,O as default};
