import{r as c,j as r}from"./iframe-KxDQxQDs.js";import{M as n}from"./multi-selector-I99emHWB.js";import{a as u}from"./story-section-B6HdLg4-.js";import"./preload-helper-PPVm8Dsz.js";import"./command-CT0u8Dqv.js";import"./checkbox-CevW5JLm.js";import"./index-C-iMpffm.js";import"./check-OcLjUnTR.js";import"./dialog--60lc3us.js";import"./x-8Vd-H5Q8.js";import"./badge-C0o81Ql6.js";import"./separator-RpiEdedA.js";import"./index-DL5skkIA.js";import"./skeleton-BDS1U2kz.js";import"./i18n-BnCxB2cP.js";import"./index-CPmIy41W.js";import"./useDebounce-C-CEitxv.js";const{action:o}=__STORYBOOK_MODULE_ACTIONS__,_={title:"Components/Inputs/Multi Selector",component:n,args:{value:[],onChange:()=>{},placeholder:"Placeholder"}},i=[{label:"Nextjs",value:"Nextjs"},{label:"Vite",value:"vite"},{label:"Nuxt",value:"nuxt",disable:!0},{label:"Vue",value:"vue, disable: true",disable:!0},{label:"Remix",value:"remix"},{label:"Svelte",value:"svelte",disable:!0},{label:"Angular",value:"angular",disable:!0},{label:"Ember",value:"ember",disable:!0},{label:"React",value:"react"},{label:"Gatsby",value:"gatsby",disable:!0},{label:"Astro",value:"astro",disable:!0}],a={render:()=>{const[l,s]=c.useState(["Nextjs"]);return r.jsx(u,{title:"Default",children:r.jsx(n,{value:l,onChange:e=>{s(e),o("onChange")(e)},className:"max-w-[300px]",placeholder:"Placeholder",commandProps:{className:"max-w-[300px]"},defaultOptions:i,hidePlaceholderWhenSelected:!0})})}},t={render:()=>{const[l,s]=c.useState(["Nextjs"]);return r.jsx(u,{title:"Async search",children:r.jsx(n,{value:l,onChange:e=>{s(e),o("onChange")(e)},onSearch:async e=>(o("onSearch")(e),new Promise(m=>{setTimeout(()=>m(i),1e3)})),debounceDelay:300,className:"max-w-[300px]",placeholder:"Placeholder",commandProps:{className:"max-w-[300px]"}})})}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
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
