import{r as s,j as n}from"./iframe-B_cUq_Z_.js";import{A as i}from"./auto-complete-CEr4sY3w.js";import{a as d}from"./story-section-ClDCqoX4.js";import"./preload-helper-PPVm8Dsz.js";import"./command-D7nxayvM.js";import"./checkbox-Cs3ZPAIY.js";import"./index-BAayUSpm.js";import"./check-Co9nfzYN.js";import"./dialog-D5Y5T8WH.js";import"./x-BMqHCxKs.js";import"./skeleton-du8NMDDw.js";import"./i18n-y5n1cA5u.js";import"./index-CRHX0MN7.js";import"./useDebounce-DRxd4Pyl.js";const{action:u}=__STORYBOOK_MODULE_ACTIONS__,p=[{value:"next.js",label:"Next.js"},{value:"sveltekit",label:"SvelteKit"},{value:"nuxt.js",label:"Nuxt.js"},{value:"remix",label:"Remix"},{value:"astro",label:"Astro"},{value:"wordpress",label:"WordPress"},{value:"express.js",label:"Express.js"},{value:"nest.js",label:"Nest.js"}],_={title:"Components/Inputs/Auto Complete",component:i,args:{value:"",options:p,onChange:()=>{},placeholder:"Placeholder"}},a={render:()=>{const[r,l]=s.useState("nest.js");return n.jsx(d,{title:"Default",children:n.jsx(i,{value:r,onChange:e=>{l(e),u("onChange")(e)},className:"max-w-[300px]",placeholder:"Placeholder",options:p})})}},o={render:()=>{const[r,l]=s.useState(""),[e,m]=s.useState(!1),[h,S]=s.useState([]),v=async t=>(m(!0),u("onSearch")(t),new Promise(c=>{setTimeout(()=>c(p),1e3)}).then(c=>S(c)).finally(()=>m(!1)));return n.jsx(d,{title:"Async",children:n.jsx(i,{value:r,onChange:t=>{l(t),u("onChange")(t)},options:h,loading:e,onSearch:v,debounceDelay:300,className:"max-w-[300px]",placeholder:"Placeholder"})})}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
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
}`,...o.parameters?.docs?.source}}};const w=["Default","Async"];export{o as Async,a as Default,w as __namedExportsOrder,_ as default};
