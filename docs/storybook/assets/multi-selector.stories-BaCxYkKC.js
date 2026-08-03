import{r as o,j as a}from"./iframe-_3pDU_m1.js";import{M as r}from"./multi-selector-J-BakCMu.js";import{a as i,b as S}from"./story-section-9tet9DgD.js";import{S as g}from"./story-error-field-BNsG3pzf.js";import"./preload-helper-PPVm8Dsz.js";import"./command-Cgfwth51.js";import"./checkbox-CCZlNr5m.js";import"./index-C0F2G25o.js";import"./check-DZQ1hz2N.js";import"./dialog-CdcezJmm.js";import"./x-5OkV8dD4.js";import"./badge-DR8BLU8a.js";import"./separator-CIL6Up82.js";import"./skeleton-BgQ_oooK.js";import"./i18n-DIfamP6U.js";import"./index-D93W_M_b.js";import"./useDebounce-iOgfUuRC.js";import"./index-DSZtqkGG.js";import"./label-C7drXKr7.js";const{action:s}=__STORYBOOK_MODULE_ACTIONS__,R={title:"Components/Inputs/Multi Selector",component:r,args:{value:[],onChange:()=>{},placeholder:"Placeholder"}},n=[{label:"Nextjs",value:"Nextjs"},{label:"Vite",value:"vite"},{label:"Nuxt",value:"nuxt",disable:!0},{label:"Vue",value:"vue, disable: true",disable:!0},{label:"Remix",value:"remix"},{label:"Svelte",value:"svelte",disable:!0},{label:"Angular",value:"angular",disable:!0},{label:"Ember",value:"ember",disable:!0},{label:"React",value:"react"},{label:"Gatsby",value:"gatsby",disable:!0},{label:"Astro",value:"astro",disable:!0}],u={render:()=>{const[l,t]=o.useState(["Nextjs"]);return a.jsx(i,{title:"Default",children:a.jsx(r,{value:l,onChange:e=>{t(e),s("onChange")(e)},className:"max-w-[300px]",placeholder:"Placeholder",commandProps:{className:"max-w-[300px]"},defaultOptions:n,hidePlaceholderWhenSelected:!0})})}},d={render:()=>{const[l,t]=o.useState(["Nextjs","vite"]);return a.jsx(i,{title:"Max selected = 3 — unselected items are disabled once the cap is reached; deselect one to re-enable them.",children:a.jsx(r,{value:l,onChange:e=>{t(e),s("onChange")(e)},openOnFocus:!0,onMaxSelected:e=>s("onMaxSelected")(e),maxSelected:3,className:"max-w-[300px]",placeholder:"Placeholder",commandProps:{className:"max-w-[300px]"},defaultOptions:n,hidePlaceholderWhenSelected:!0})})}},m={render:()=>{const l=["Nextjs","vite","remix","react","angular","gatsby"],[t,e]=o.useState(l),[x,v]=o.useState(l);return a.jsx(i,{title:"Multiline",children:a.jsxs("div",{className:"flex flex-col gap-6",style:{width:320},children:[a.jsxs("div",{className:"flex flex-col gap-3",children:[a.jsx(S,{children:"Default — overflowing badges collapse into a “+N” on a single line"}),a.jsx(r,{value:t,onChange:c=>{e(c),s("onChange")(c)},openOnFocus:!0,className:"w-full",placeholder:"Placeholder",commandProps:{className:"w-full"},defaultOptions:n})]}),a.jsxs("div",{className:"flex flex-col gap-3",children:[a.jsx(S,{children:"multiline — every badge stays visible and the control grows in height"}),a.jsx(r,{multiline:!0,value:x,onChange:c=>{v(c),s("onChange")(c)},openOnFocus:!0,className:"w-full",placeholder:"Placeholder",commandProps:{className:"w-full"},defaultOptions:n})]})]})})}},p={render:()=>{const[l,t]=o.useState(["Nextjs"]);return a.jsx(i,{title:"Async search",children:a.jsx(r,{value:l,onChange:e=>{t(e),s("onChange")(e)},onSearch:async e=>(s("onSearch")(e),new Promise(x=>{setTimeout(()=>x(n),1e3)})),debounceDelay:300,className:"max-w-[300px]",placeholder:"Placeholder",commandProps:{className:"max-w-[300px]"}})})}},h={render:()=>{const[l,t]=o.useState([]);return a.jsx(i,{title:"Error",children:a.jsx(g,{label:"Frameworks",invalid:l.length===0,children:a.jsx(r,{"aria-invalid":l.length===0,value:l,onChange:e=>{t(e),s("onChange")(e)},placeholder:"Placeholder",defaultOptions:n,hidePlaceholderWhenSelected:!0})})})}};u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
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
}`,...u.parameters?.docs?.source}}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
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
}`,...d.parameters?.docs?.source}}};m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
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
}`,...m.parameters?.docs?.source}}};p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
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
}`,...p.parameters?.docs?.source}}};h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  render: () => {
    const [values, setValues] = useState<string[]>([]);
    return <StorySection title="Error">
        <StoryErrorField label="Frameworks" invalid={values.length === 0}>
          <MultiSelector aria-invalid={values.length === 0} value={values} onChange={newValues => {
          setValues(newValues);
          action('onChange')(newValues);
        }} placeholder="Placeholder" defaultOptions={defaultOptions} hidePlaceholderWhenSelected />
        </StoryErrorField>
      </StorySection>;
  }
}`,...h.parameters?.docs?.source}}};const k=["Default","WithMaxSelected","Multiline","AsyncSearch","ErrorState"];export{p as AsyncSearch,u as Default,h as ErrorState,m as Multiline,d as WithMaxSelected,k as __namedExportsOrder,R as default};
