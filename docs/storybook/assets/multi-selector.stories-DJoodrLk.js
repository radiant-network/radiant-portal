import{r as c,j as l}from"./iframe-CdF5EYmg.js";import{M as n}from"./multi-selector-B2vT9aAV.js";import{a as u}from"./story-section-D4XYOw5I.js";import"./preload-helper-PPVm8Dsz.js";import"./command-CHQ6aFTB.js";import"./checkbox-BviUR5mO.js";import"./index-CLRHU15o.js";import"./check-DTlfPsbg.js";import"./dialog-KnAoCl-m.js";import"./x-Ka5G_vgD.js";import"./badge-B7TJrOU1.js";import"./separator-DtNz95I0.js";import"./skeleton-BdSchkuJ.js";import"./i18n-DK-5BTci.js";import"./index-Cp-tXBSJ.js";import"./useDebounce-RqLeG-A-.js";const{action:o}=__STORYBOOK_MODULE_ACTIONS__,O={title:"Components/Inputs/Multi Selector",component:n,args:{value:[],onChange:()=>{},placeholder:"Placeholder"}},i=[{label:"Nextjs",value:"Nextjs"},{label:"Vite",value:"vite"},{label:"Nuxt",value:"nuxt",disable:!0},{label:"Vue",value:"vue, disable: true",disable:!0},{label:"Remix",value:"remix"},{label:"Svelte",value:"svelte",disable:!0},{label:"Angular",value:"angular",disable:!0},{label:"Ember",value:"ember",disable:!0},{label:"React",value:"react"},{label:"Gatsby",value:"gatsby",disable:!0},{label:"Astro",value:"astro",disable:!0}],a={render:()=>{const[r,s]=c.useState(["Nextjs"]);return l.jsx(u,{title:"Default",children:l.jsx(n,{value:r,onChange:e=>{s(e),o("onChange")(e)},className:"max-w-[300px]",placeholder:"Placeholder",commandProps:{className:"max-w-[300px]"},defaultOptions:i,hidePlaceholderWhenSelected:!0})})}},t={render:()=>{const[r,s]=c.useState(["Nextjs"]);return l.jsx(u,{title:"Async search",children:l.jsx(n,{value:r,onChange:e=>{s(e),o("onChange")(e)},onSearch:async e=>(o("onSearch")(e),new Promise(m=>{setTimeout(()=>m(i),1e3)})),debounceDelay:300,className:"max-w-[300px]",placeholder:"Placeholder",commandProps:{className:"max-w-[300px]"}})})}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
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
