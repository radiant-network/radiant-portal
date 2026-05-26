import{r as o,j as S}from"./iframe-BIVZNcDx.js";import{A as c}from"./auto-complete-16T48Fsy.js";import"./preload-helper-Dp1pzeXC.js";import"./command-DEfX_Shg.js";import"./checkbox-CHCcThK3.js";import"./index-L5EIAPnE.js";import"./check-oh_5MiUz.js";import"./dialog-D3kht_4h.js";import"./x-CM_jdjpH.js";import"./skeleton-BGpQmToc.js";import"./i18n-BkDRdn4X.js";import"./useDebounce-Yg2CZJI_.js";const{action:u}=__STORYBOOK_MODULE_ACTIONS__,i=[{value:"next.js",label:"Next.js"},{value:"sveltekit",label:"SvelteKit"},{value:"nuxt.js",label:"Nuxt.js"},{value:"remix",label:"Remix"},{value:"astro",label:"Astro"},{value:"wordpress",label:"WordPress"},{value:"express.js",label:"Express.js"},{value:"nest.js",label:"Nest.js"}],K={title:"Inputs/Auto Complete",component:c,args:{value:"",options:i,onChange:()=>{},placeholder:"Placeholder"}},t={render:()=>{const[n,r]=o.useState("nest.js");return S.jsx(c,{value:n,onChange:e=>{r(e),u("onChange")(e)},className:"max-w-[300px]",placeholder:"Placeholder",options:i})}},s={render:()=>{const[n,r]=o.useState(""),[e,p]=o.useState(!1),[j,C]=o.useState([]),O=async a=>(p(!0),u("onSearch")(a),new Promise(l=>{setTimeout(()=>l(i),1e3)}).then(l=>C(l)).finally(()=>p(!1)));return S.jsx(c,{value:n,onChange:a=>{r(a),u("onChange")(a)},options:j,loading:e,onSearch:O,debounceDelay:300,className:"max-w-[300px]",placeholder:"Placeholder"})}};var m,d,h;t.parameters={...t.parameters,docs:{...(m=t.parameters)==null?void 0:m.docs,source:{originalSource:`{
  render: () => {
    const [value, setValue] = useState<string | undefined>('nest.js');
    return <AutoComplete value={value} onChange={value => {
      setValue(value);
      action('onChange')(value);
    }} className="max-w-[300px]" placeholder="Placeholder" options={FRAMEWORKS} />;
  }
}`,...(h=(d=t.parameters)==null?void 0:d.docs)==null?void 0:h.source}}};var v,g,x;s.parameters={...s.parameters,docs:{...(v=s.parameters)==null?void 0:v.docs,source:{originalSource:`{
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
}`,...(x=(g=s.parameters)==null?void 0:g.docs)==null?void 0:x.source}}};const L=["Default","Async"];export{s as Async,t as Default,L as __namedExportsOrder,K as default};
