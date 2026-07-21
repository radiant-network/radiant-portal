import{r as u,j as a}from"./iframe-BOkj70l8.js";import{M as c}from"./multi-selector-C5r4zv-Q.js";import{a as i}from"./story-section-DQYgi0mB.js";import"./preload-helper-PPVm8Dsz.js";import"./command-DCJBLat9.js";import"./checkbox-Dlb-3fxY.js";import"./index-A2SqbsTG.js";import"./check-DI71rXD4.js";import"./dialog-BNVSz0vP.js";import"./x-BN09ysZY.js";import"./badge-DYJwqogr.js";import"./separator-MMk7clR0.js";import"./skeleton-yvCFhn6H.js";import"./i18n-C0VA3Pzj.js";import"./index-BiVUSCho.js";import"./useDebounce-8tsv58Jd.js";const{action:s}=__STORYBOOK_MODULE_ACTIONS__,O={title:"Components/Inputs/Multi Selector",component:c,args:{value:[],onChange:()=>{},placeholder:"Placeholder"}},d=[{label:"Nextjs",value:"Nextjs"},{label:"Vite",value:"vite"},{label:"Nuxt",value:"nuxt",disable:!0},{label:"Vue",value:"vue, disable: true",disable:!0},{label:"Remix",value:"remix"},{label:"Svelte",value:"svelte",disable:!0},{label:"Angular",value:"angular",disable:!0},{label:"Ember",value:"ember",disable:!0},{label:"React",value:"react"},{label:"Gatsby",value:"gatsby",disable:!0},{label:"Astro",value:"astro",disable:!0}],r={render:()=>{const[t,l]=u.useState(["Nextjs"]);return a.jsx(i,{title:"Default",children:a.jsx(c,{value:t,onChange:e=>{l(e),s("onChange")(e)},className:"max-w-[300px]",placeholder:"Placeholder",commandProps:{className:"max-w-[300px]"},defaultOptions:d,hidePlaceholderWhenSelected:!0})})}},o={render:()=>{const[t,l]=u.useState(["Nextjs","vite"]);return a.jsx(i,{title:"Max selected = 3 — unselected items are disabled once the cap is reached; deselect one to re-enable them.",children:a.jsx(c,{value:t,onChange:e=>{l(e),s("onChange")(e)},openOnFocus:!0,onMaxSelected:e=>s("onMaxSelected")(e),maxSelected:3,className:"max-w-[300px]",placeholder:"Placeholder",commandProps:{className:"max-w-[300px]"},defaultOptions:d,hidePlaceholderWhenSelected:!0})})}},n={render:()=>{const[t,l]=u.useState(["Nextjs"]);return a.jsx(i,{title:"Async search",children:a.jsx(c,{value:t,onChange:e=>{l(e),s("onChange")(e)},onSearch:async e=>(s("onSearch")(e),new Promise(m=>{setTimeout(()=>m(d),1e3)})),debounceDelay:300,className:"max-w-[300px]",placeholder:"Placeholder",commandProps:{className:"max-w-[300px]"}})})}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
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
