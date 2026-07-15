import{r as s,j as n}from"./iframe-CuWpm1qa.js";import{A as i}from"./auto-complete-BASRtPfr.js";import{a as d}from"./story-section-w3-NF7Xp.js";import"./preload-helper-PPVm8Dsz.js";import"./command-BK2w7Wgv.js";import"./checkbox-D1IGK36Y.js";import"./index-BO3dUORY.js";import"./check-j36eKSHy.js";import"./dialog-C2zHoQsb.js";import"./x-BvFgF3db.js";import"./skeleton-BQ5jhFqg.js";import"./i18n-Dk4pliQz.js";import"./index-8BZx1Yb8.js";import"./useDebounce-Cgh-Z7l2.js";const{action:u}=__STORYBOOK_MODULE_ACTIONS__,p=[{value:"next.js",label:"Next.js"},{value:"sveltekit",label:"SvelteKit"},{value:"nuxt.js",label:"Nuxt.js"},{value:"remix",label:"Remix"},{value:"astro",label:"Astro"},{value:"wordpress",label:"WordPress"},{value:"express.js",label:"Express.js"},{value:"nest.js",label:"Nest.js"}],_={title:"Components/Inputs/Auto Complete",component:i,args:{value:"",options:p,onChange:()=>{},placeholder:"Placeholder"}},a={render:()=>{const[r,l]=s.useState("nest.js");return n.jsx(d,{title:"Default",children:n.jsx(i,{value:r,onChange:e=>{l(e),u("onChange")(e)},className:"max-w-[300px]",placeholder:"Placeholder",options:p})})}},o={render:()=>{const[r,l]=s.useState(""),[e,m]=s.useState(!1),[h,S]=s.useState([]),v=async t=>(m(!0),u("onSearch")(t),new Promise(c=>{setTimeout(()=>c(p),1e3)}).then(c=>S(c)).finally(()=>m(!1)));return n.jsx(d,{title:"Async",children:n.jsx(i,{value:r,onChange:t=>{l(t),u("onChange")(t)},options:h,loading:e,onSearch:v,debounceDelay:300,className:"max-w-[300px]",placeholder:"Placeholder"})})}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
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
