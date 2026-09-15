import{n as e}from"./rolldown-runtime-C0FnF6B9.js";import{t}from"./react-BRh_h4kc.js";import{t as n}from"./jsx-runtime-BdxMnOeJ.js";import{i as r,n as i,t as a}from"./story-section-DVTm6cGm.js";import{n as o,t as s}from"./story-error-field-DeLRAi8K.js";import{n as c,t as l}from"./multi-selector-C4Z7Cu6h.js";var u,d,f,p,m,h,g,_,v,y,b;function x(){return(x=e((()=>{u=t(),c(),r(),o(),d=n(),{action:f}=__STORYBOOK_MODULE_ACTIONS__,p={title:`Components/Inputs/Multi Selector`,component:l,args:{value:[],onChange:()=>{},placeholder:`Placeholder`}},m=[{label:`Nextjs`,value:`Nextjs`},{label:`Vite`,value:`vite`},{label:`Nuxt`,value:`nuxt`,disable:!0},{label:`Vue`,value:`vue, disable: true`,disable:!0},{label:`Remix`,value:`remix`},{label:`Svelte`,value:`svelte`,disable:!0},{label:`Angular`,value:`angular`,disable:!0},{label:`Ember`,value:`ember`,disable:!0},{label:`React`,value:`react`},{label:`Gatsby`,value:`gatsby`,disable:!0},{label:`Astro`,value:`astro`,disable:!0}],h={render:()=>{let[e,t]=(0,u.useState)([`Nextjs`]);return(0,d.jsx)(i,{title:`Default`,children:(0,d.jsx)(l,{value:e,onChange:e=>{t(e),f(`onChange`)(e)},className:`max-w-[300px]`,placeholder:`Placeholder`,commandProps:{className:`max-w-[300px]`},defaultOptions:m,hidePlaceholderWhenSelected:!0})})}},g={render:()=>{let[e,t]=(0,u.useState)([`Nextjs`,`vite`]);return(0,d.jsx)(i,{title:`Max selected = 3 — unselected items are disabled once the cap is reached; deselect one to re-enable them.`,children:(0,d.jsx)(l,{value:e,onChange:e=>{t(e),f(`onChange`)(e)},openOnFocus:!0,onMaxSelected:e=>f(`onMaxSelected`)(e),maxSelected:3,className:`max-w-[300px]`,placeholder:`Placeholder`,commandProps:{className:`max-w-[300px]`},defaultOptions:m,hidePlaceholderWhenSelected:!0})})}},_={render:()=>{let e=[`Nextjs`,`vite`,`remix`,`react`,`angular`,`gatsby`],[t,n]=(0,u.useState)(e),[r,o]=(0,u.useState)(e);return(0,d.jsx)(i,{title:`Multiline`,children:(0,d.jsxs)(`div`,{className:`flex flex-col gap-6`,style:{width:320},children:[(0,d.jsxs)(`div`,{className:`flex flex-col gap-3`,children:[(0,d.jsx)(a,{children:`Default — overflowing badges collapse into a “+N” on a single line`}),(0,d.jsx)(l,{value:t,onChange:e=>{n(e),f(`onChange`)(e)},openOnFocus:!0,className:`w-full`,placeholder:`Placeholder`,commandProps:{className:`w-full`},defaultOptions:m})]}),(0,d.jsxs)(`div`,{className:`flex flex-col gap-3`,children:[(0,d.jsx)(a,{children:`multiline — every badge stays visible and the control grows in height`}),(0,d.jsx)(l,{multiline:!0,value:r,onChange:e=>{o(e),f(`onChange`)(e)},openOnFocus:!0,className:`w-full`,placeholder:`Placeholder`,commandProps:{className:`w-full`},defaultOptions:m})]})]})})}},v={render:()=>{let[e,t]=(0,u.useState)([`Nextjs`]);return(0,d.jsx)(i,{title:`Async search`,children:(0,d.jsx)(l,{value:e,onChange:e=>{t(e),f(`onChange`)(e)},onSearch:async e=>(f(`onSearch`)(e),new Promise(e=>{setTimeout(()=>e(m),1e3)})),debounceDelay:300,className:`max-w-[300px]`,placeholder:`Placeholder`,commandProps:{className:`max-w-[300px]`}})})}},y={render:()=>{let[e,t]=(0,u.useState)([]);return(0,d.jsx)(i,{title:`Error`,children:(0,d.jsx)(s,{label:`Frameworks`,invalid:e.length===0,children:(0,d.jsx)(l,{"aria-invalid":e.length===0,value:e,onChange:e=>{t(e),f(`onChange`)(e)},placeholder:`Placeholder`,defaultOptions:m,hidePlaceholderWhenSelected:!0})})})}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
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
}`,...h.parameters?.docs?.source}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
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
}`,...g.parameters?.docs?.source}}},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
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
}`,..._.parameters?.docs?.source}}},v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
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
}`,...v.parameters?.docs?.source}}},y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
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
}`,...y.parameters?.docs?.source}}},b=[`Default`,`WithMaxSelected`,`Multiline`,`AsyncSearch`,`ErrorState`]})))()}x();export{v as AsyncSearch,h as Default,y as ErrorState,_ as Multiline,g as WithMaxSelected,b as __namedExportsOrder,p as default};