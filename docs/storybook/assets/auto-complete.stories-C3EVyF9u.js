import{r as s,j as n}from"./iframe-jcf7vZ_R.js";import{A as i}from"./auto-complete-CWwz6dng.js";import{a as d}from"./story-section-Cpqu6Cmt.js";import"./preload-helper-PPVm8Dsz.js";import"./command-sbJGh4Qm.js";import"./checkbox-DqoFEh4o.js";import"./index-CiCOYGE9.js";import"./check-DnaYg78d.js";import"./dialog-DUCKpv1W.js";import"./x-CsZYw6Ul.js";import"./skeleton-Dh6-RIZO.js";import"./i18n-TdHrRC51.js";import"./index-B7ISGQ50.js";import"./index-CMj8FLxF.js";import"./useDebounce-BdxdMA7w.js";const{action:u}=__STORYBOOK_MODULE_ACTIONS__,p=[{value:"next.js",label:"Next.js"},{value:"sveltekit",label:"SvelteKit"},{value:"nuxt.js",label:"Nuxt.js"},{value:"remix",label:"Remix"},{value:"astro",label:"Astro"},{value:"wordpress",label:"WordPress"},{value:"express.js",label:"Express.js"},{value:"nest.js",label:"Nest.js"}],w={title:"Components/Inputs/Auto Complete",component:i,args:{value:"",options:p,onChange:()=>{},placeholder:"Placeholder"}},a={render:()=>{const[r,l]=s.useState("nest.js");return n.jsx(d,{title:"Default",children:n.jsx(i,{value:r,onChange:e=>{l(e),u("onChange")(e)},className:"max-w-[300px]",placeholder:"Placeholder",options:p})})}},o={render:()=>{const[r,l]=s.useState(""),[e,m]=s.useState(!1),[h,S]=s.useState([]),v=async t=>(m(!0),u("onSearch")(t),new Promise(c=>{setTimeout(()=>c(p),1e3)}).then(c=>S(c)).finally(()=>m(!1)));return n.jsx(d,{title:"Async",children:n.jsx(i,{value:r,onChange:t=>{l(t),u("onChange")(t)},options:h,loading:e,onSearch:v,debounceDelay:300,className:"max-w-[300px]",placeholder:"Placeholder"})})}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  render: () => {
    const [value, setValue] = useState<string | undefined>('nest.js');
    return <StorySection title="Default">
        <AutoComplete value={value} onChange={value => {
        setValue(value);
        action('onChange')(value);
      }} className="max-w-[300px]" placeholder="Placeholder" options={FRAMEWORKS} />
      </StorySection>;
  }
}`,...a.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
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
}`,...o.parameters?.docs?.source}}};const D=["Default","Async"];export{o as Async,a as Default,D as __namedExportsOrder,w as default};
