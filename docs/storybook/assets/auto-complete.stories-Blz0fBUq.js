import{n as e}from"./rolldown-runtime-C0FnF6B9.js";import{t}from"./react-BRh_h4kc.js";import{t as n}from"./jsx-runtime-BdxMnOeJ.js";import{i as r,n as i}from"./story-section-DVTm6cGm.js";import{n as a,t as o}from"./story-error-field-DeLRAi8K.js";import{n as s,t as c}from"./auto-complete-4oE5T48Y.js";var l,u,d,f,p,m,h,g,_;function v(){return(v=e((()=>{l=t(),s(),r(),a(),u=n(),{action:d}=__STORYBOOK_MODULE_ACTIONS__,f=[{value:`next.js`,label:`Next.js`},{value:`sveltekit`,label:`SvelteKit`},{value:`nuxt.js`,label:`Nuxt.js`},{value:`remix`,label:`Remix`},{value:`astro`,label:`Astro`},{value:`wordpress`,label:`WordPress`},{value:`express.js`,label:`Express.js`},{value:`nest.js`,label:`Nest.js`}],p={title:`Components/Inputs/Auto Complete`,component:c,args:{value:``,options:f,onChange:()=>{},placeholder:`Placeholder`}},m={render:()=>{let[e,t]=(0,l.useState)(`nest.js`);return(0,u.jsx)(i,{title:`Default`,children:(0,u.jsx)(c,{value:e,onChange:e=>{t(e),d(`onChange`)(e)},className:`max-w-[300px]`,placeholder:`Placeholder`,options:f})})}},h={render:()=>{let[e,t]=(0,l.useState)(``),[n,r]=(0,l.useState)(!1),[a,o]=(0,l.useState)([]);return(0,u.jsx)(i,{title:`Async`,children:(0,u.jsx)(c,{value:e,onChange:e=>{t(e),d(`onChange`)(e)},options:a,loading:n,onSearch:async e=>(r(!0),d(`onSearch`)(e),new Promise(e=>{setTimeout(()=>e(f),1e3)}).then(e=>o(e)).finally(()=>r(!1))),debounceDelay:300,className:`max-w-[300px]`,placeholder:`Placeholder`})})}},g={render:()=>{let[e,t]=(0,l.useState)(``);return(0,u.jsx)(i,{title:`Error`,children:(0,u.jsx)(o,{label:`Framework`,invalid:!e,children:(0,u.jsx)(c,{"aria-invalid":!e,value:e,onChange:e=>{t(e),d(`onChange`)(e)},placeholder:`Placeholder`,options:f})})})}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  render: () => {
    const [value, setValue] = useState<string | undefined>('nest.js');
    return <StorySection title="Default">
        <AutoComplete value={value} onChange={value => {
        setValue(value);
        action('onChange')(value);
      }} className="max-w-[300px]" placeholder="Placeholder" options={FRAMEWORKS} />
      </StorySection>;
  }
}`,...m.parameters?.docs?.source}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  render: () => {
    const [value, setValue] = useState<string | undefined>('');
    const [loading, setLoading] = useState(false);
    const [options, setOptions] = useState<Option[]>([]);
    const handleSearch = async (searchValue: string) => {
      setLoading(true);
      action('onSearch')(searchValue);
      return new Promise<Option[]>(resolve => {
        setTimeout(() => resolve(FRAMEWORKS), 1000);
      }).then(results => setOptions(results)).finally(() => setLoading(false));
    };
    return <StorySection title="Async">
        <AutoComplete value={value} onChange={value => {
        setValue(value);
        action('onChange')(value);
      }} options={options} loading={loading} onSearch={handleSearch} debounceDelay={300} className="max-w-[300px]" placeholder="Placeholder" />
      </StorySection>;
  }
}`,...h.parameters?.docs?.source}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  render: () => {
    const [value, setValue] = useState<string | undefined>('');
    return <StorySection title="Error">
        <StoryErrorField label="Framework" invalid={!value}>
          <AutoComplete aria-invalid={!value} value={value} onChange={value => {
          setValue(value);
          action('onChange')(value);
        }} placeholder="Placeholder" options={FRAMEWORKS} />
        </StoryErrorField>
      </StorySection>;
  }
}`,...g.parameters?.docs?.source}}},_=[`Default`,`Async`,`ErrorState`]})))()}v();export{h as Async,m as Default,g as ErrorState,_ as __namedExportsOrder,p as default};