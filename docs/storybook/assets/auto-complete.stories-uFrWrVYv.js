import{r as o,j as m}from"./iframe-X1FdiBKE.js";import{A as c}from"./auto-complete-YpNT7-I3.js";import"./preload-helper-PPVm8Dsz.js";import"./command-ChuZoNNZ.js";import"./checkbox-DHqhLv6e.js";import"./index-BjLlGfE7.js";import"./check-CpvZoXR-.js";import"./dialog-h83xAsXy.js";import"./x-CT6RiXhO.js";import"./skeleton-UMhyrLm4.js";import"./i18n-DsLlobA0.js";import"./index-BoMd93ow.js";import"./useDebounce-Cs2ID8yH.js";const{action:u}=__STORYBOOK_MODULE_ACTIONS__,i=[{value:"next.js",label:"Next.js"},{value:"sveltekit",label:"SvelteKit"},{value:"nuxt.js",label:"Nuxt.js"},{value:"remix",label:"Remix"},{value:"astro",label:"Astro"},{value:"wordpress",label:"WordPress"},{value:"express.js",label:"Express.js"},{value:"nest.js",label:"Nest.js"}],P={title:"Inputs/Auto Complete",component:c,args:{value:"",options:i,onChange:()=>{},placeholder:"Placeholder"}},t={render:()=>{const[r,n]=o.useState("nest.js");return m.jsx(c,{value:r,onChange:e=>{n(e),u("onChange")(e)},className:"max-w-[300px]",placeholder:"Placeholder",options:i})}},s={render:()=>{const[r,n]=o.useState(""),[e,p]=o.useState(!1),[d,h]=o.useState([]),v=async a=>(p(!0),u("onSearch")(a),new Promise(l=>{setTimeout(()=>l(i),1e3)}).then(l=>h(l)).finally(()=>p(!1)));return m.jsx(c,{value:r,onChange:a=>{n(a),u("onChange")(a)},options:d,loading:e,onSearch:v,debounceDelay:300,className:"max-w-[300px]",placeholder:"Placeholder"})}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  render: () => {
    const [value, setValue] = useState<string | undefined>('nest.js');
    return <AutoComplete value={value} onChange={value => {
      setValue(value);
      action('onChange')(value);
    }} className="max-w-[300px]" placeholder="Placeholder" options={FRAMEWORKS} />;
  }
}`,...t.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
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
    return <AutoComplete value={value} onChange={value => {
      setValue(value);
      action('onChange')(value);
    }} options={options} loading={loading} onSearch={handleSearch} debounceDelay={300} className="max-w-[300px]" placeholder="Placeholder" />;
  }
}`,...s.parameters?.docs?.source}}};const V=["Default","Async"];export{s as Async,t as Default,V as __namedExportsOrder,P as default};
