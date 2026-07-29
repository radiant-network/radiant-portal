import{r as n,j as a}from"./iframe-BCdw1Zpv.js";import{M as o}from"./multi-selector-CF_s3IwF.js";import{a as p,b as x}from"./story-section-DgtXw29J.js";import"./preload-helper-PPVm8Dsz.js";import"./command-X8YkT2zv.js";import"./checkbox-DMX3BjE_.js";import"./index-NqJJUEGy.js";import"./check-DAngudb0.js";import"./dialog-BKVQKwDn.js";import"./x-DwSUWTV9.js";import"./badge-BhM3_JBV.js";import"./separator-CxLC1eka.js";import"./skeleton-BC0oTTyA.js";import"./i18n-BerkWO00.js";import"./index-mpFtsMNW.js";import"./useDebounce-D7bu_lfm.js";const{action:t}=__STORYBOOK_MODULE_ACTIONS__,W={title:"Components/Inputs/Multi Selector",component:o,args:{value:[],onChange:()=>{},placeholder:"Placeholder"}},c=[{label:"Nextjs",value:"Nextjs"},{label:"Vite",value:"vite"},{label:"Nuxt",value:"nuxt",disable:!0},{label:"Vue",value:"vue, disable: true",disable:!0},{label:"Remix",value:"remix"},{label:"Svelte",value:"svelte",disable:!0},{label:"Angular",value:"angular",disable:!0},{label:"Ember",value:"ember",disable:!0},{label:"React",value:"react"},{label:"Gatsby",value:"gatsby",disable:!0},{label:"Astro",value:"astro",disable:!0}],i={render:()=>{const[l,s]=n.useState(["Nextjs"]);return a.jsx(p,{title:"Default",children:a.jsx(o,{value:l,onChange:e=>{s(e),t("onChange")(e)},className:"max-w-[300px]",placeholder:"Placeholder",commandProps:{className:"max-w-[300px]"},defaultOptions:c,hidePlaceholderWhenSelected:!0})})}},u={render:()=>{const[l,s]=n.useState(["Nextjs","vite"]);return a.jsx(p,{title:"Max selected = 3 — unselected items are disabled once the cap is reached; deselect one to re-enable them.",children:a.jsx(o,{value:l,onChange:e=>{s(e),t("onChange")(e)},openOnFocus:!0,onMaxSelected:e=>t("onMaxSelected")(e),maxSelected:3,className:"max-w-[300px]",placeholder:"Placeholder",commandProps:{className:"max-w-[300px]"},defaultOptions:c,hidePlaceholderWhenSelected:!0})})}},d={render:()=>{const l=["Nextjs","vite","remix","react","angular","gatsby"],[s,e]=n.useState(l),[h,S]=n.useState(l);return a.jsx(p,{title:"Multiline",children:a.jsxs("div",{className:"flex flex-col gap-6",style:{width:320},children:[a.jsxs("div",{className:"flex flex-col gap-3",children:[a.jsx(x,{children:"Default — overflowing badges collapse into a “+N” on a single line"}),a.jsx(o,{value:s,onChange:r=>{e(r),t("onChange")(r)},openOnFocus:!0,className:"w-full",placeholder:"Placeholder",commandProps:{className:"w-full"},defaultOptions:c})]}),a.jsxs("div",{className:"flex flex-col gap-3",children:[a.jsx(x,{children:"multiline — every badge stays visible and the control grows in height"}),a.jsx(o,{multiline:!0,value:h,onChange:r=>{S(r),t("onChange")(r)},openOnFocus:!0,className:"w-full",placeholder:"Placeholder",commandProps:{className:"w-full"},defaultOptions:c})]})]})})}},m={render:()=>{const[l,s]=n.useState(["Nextjs"]);return a.jsx(p,{title:"Async search",children:a.jsx(o,{value:l,onChange:e=>{s(e),t("onChange")(e)},onSearch:async e=>(t("onSearch")(e),new Promise(h=>{setTimeout(()=>h(c),1e3)})),debounceDelay:300,className:"max-w-[300px]",placeholder:"Placeholder",commandProps:{className:"max-w-[300px]"}})})}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
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
}`,...i.parameters?.docs?.source}}};u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
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
}`,...u.parameters?.docs?.source}}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  render: () => {
    const preselected = ['Nextjs', 'vite', 'remix', 'react', 'angular', 'gatsby'];
    const [collapsedValues, setCollapsedValues] = useState<string[]>(preselected);
    const [multilineValues, setMultilineValues] = useState<string[]>(preselected);
    return <StorySection title="Multiline">
        {/* Widths are set inline: Tailwind does not scan components/stories, so story-only arbitrary classes are never generated. */}
        <div className="flex flex-col gap-6" style={{
        width: 320
      }}>
          <div className="flex flex-col gap-3">
            <StoryLabel>Default — overflowing badges collapse into a “+N” on a single line</StoryLabel>
            <MultiSelector value={collapsedValues} onChange={newValues => {
            setCollapsedValues(newValues);
            action('onChange')(newValues);
          }} openOnFocus className="w-full" placeholder="Placeholder" commandProps={{
            className: 'w-full'
          }} defaultOptions={defaultOptions} />
          </div>
          <div className="flex flex-col gap-3">
            <StoryLabel>multiline — every badge stays visible and the control grows in height</StoryLabel>
            <MultiSelector multiline value={multilineValues} onChange={newValues => {
            setMultilineValues(newValues);
            action('onChange')(newValues);
          }} openOnFocus className="w-full" placeholder="Placeholder" commandProps={{
            className: 'w-full'
          }} defaultOptions={defaultOptions} />
          </div>
        </div>
      </StorySection>;
  }
}`,...d.parameters?.docs?.source}}};m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
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
}`,...m.parameters?.docs?.source}}};const F=["Default","WithMaxSelected","Multiline","AsyncSearch"];export{m as AsyncSearch,i as Default,d as Multiline,u as WithMaxSelected,F as __namedExportsOrder,W as default};
