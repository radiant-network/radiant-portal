import{r as u,j as a}from"./iframe-C6MOWQMA.js";import{M as c}from"./multi-selector-CLRMp0kE.js";import{a as i}from"./story-section-_wEsjD86.js";import"./preload-helper-PPVm8Dsz.js";import"./command-sW4sbvEM.js";import"./checkbox-B6AIHIBP.js";import"./index-DWzx1LIm.js";import"./check-BS5Edn5_.js";import"./dialog-B3Fofjtq.js";import"./x-CsidU9Vl.js";import"./badge-B78r8HM9.js";import"./separator-ChOm_zYy.js";import"./skeleton-CruioE2S.js";import"./i18n-CnXb1qax.js";import"./index-DP9hQ_sa.js";import"./useDebounce-tlpYHApJ.js";const{action:s}=__STORYBOOK_MODULE_ACTIONS__,O={title:"Components/Inputs/Multi Selector",component:c,args:{value:[],onChange:()=>{},placeholder:"Placeholder"}},d=[{label:"Nextjs",value:"Nextjs"},{label:"Vite",value:"vite"},{label:"Nuxt",value:"nuxt",disable:!0},{label:"Vue",value:"vue, disable: true",disable:!0},{label:"Remix",value:"remix"},{label:"Svelte",value:"svelte",disable:!0},{label:"Angular",value:"angular",disable:!0},{label:"Ember",value:"ember",disable:!0},{label:"React",value:"react"},{label:"Gatsby",value:"gatsby",disable:!0},{label:"Astro",value:"astro",disable:!0}],r={render:()=>{const[t,l]=u.useState(["Nextjs"]);return a.jsx(i,{title:"Default",children:a.jsx(c,{value:t,onChange:e=>{l(e),s("onChange")(e)},className:"max-w-[300px]",placeholder:"Placeholder",commandProps:{className:"max-w-[300px]"},defaultOptions:d,hidePlaceholderWhenSelected:!0})})}},o={render:()=>{const[t,l]=u.useState(["Nextjs","vite"]);return a.jsx(i,{title:"Max selected = 3 — unselected items are disabled once the cap is reached; deselect one to re-enable them.",children:a.jsx(c,{value:t,onChange:e=>{l(e),s("onChange")(e)},openOnFocus:!0,onMaxSelected:e=>s("onMaxSelected")(e),maxSelected:3,className:"max-w-[300px]",placeholder:"Placeholder",commandProps:{className:"max-w-[300px]"},defaultOptions:d,hidePlaceholderWhenSelected:!0})})}},n={render:()=>{const[t,l]=u.useState(["Nextjs"]);return a.jsx(i,{title:"Async search",children:a.jsx(c,{value:t,onChange:e=>{l(e),s("onChange")(e)},onSearch:async e=>(s("onSearch")(e),new Promise(m=>{setTimeout(()=>m(d),1e3)})),debounceDelay:300,className:"max-w-[300px]",placeholder:"Placeholder",commandProps:{className:"max-w-[300px]"}})})}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
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
}`,...r.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  render: () => {
    const [values, setValues] = useState<string[]>(['Nextjs', 'vite']);
    return <StorySection title="Max selected = 3 — unselected items are disabled once the cap is reached; deselect one to re-enable them.">
        <MultiSelector value={values} onChange={newValues => {
        setValues(newValues);
        action('onChange')(newValues);
      }} openOnFocus onMaxSelected={limit => action('onMaxSelected')(limit)} maxSelected={3} className="max-w-[300px]" placeholder="Placeholder" commandProps={{
        className: 'max-w-[300px]'
      }} defaultOptions={defaultOptions} hidePlaceholderWhenSelected />
      </StorySection>;
  }
}`,...o.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
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
}`,...n.parameters?.docs?.source}}};const _=["Default","WithMaxSelected","AsyncSearch"];export{n as AsyncSearch,r as Default,o as WithMaxSelected,_ as __namedExportsOrder,O as default};
