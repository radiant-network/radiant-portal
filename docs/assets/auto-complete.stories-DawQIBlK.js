import{j as S}from"./jsx-runtime-D_zvdyIk.js";import{r as s}from"./index-DQLiH3RP.js";import{f as A}from"./index-B7YJKKKT.js";import{a as i}from"./index-B-lxVbXh.js";import{A as u}from"./auto-complete-gENjSPeU.js";import"./v4-CtRu48qb.js";import"./command-0QRaRtXP.js";import"./index-DYxu_S6A.js";import"./index-DTwDs4x6.js";import"./index-Dw-eQTPP.js";import"./index-CECE1b4A.js";import"./index-CJPVTaBz.js";import"./index-BkhUCz-k.js";import"./index-Buy_jb7k.js";import"./index-uZc0PFVk.js";import"./utils-D-KgF5mV.js";import"./dialog-H5nkUZvT.js";import"./x-ClsbQ_rO.js";import"./createLucideIcon-BMP5cxO1.js";import"./checkbox-Ce_wbgB6.js";import"./index-DDGWSPzp.js";import"./index-C66Dxnp2.js";import"./check-DSCf8CVO.js";import"./skeleton-Shk8p_SP.js";import"./useDebounce-D_2R-BOd.js";const p=[{value:"next.js",label:"Next.js"},{value:"sveltekit",label:"SvelteKit"},{value:"nuxt.js",label:"Nuxt.js"},{value:"remix",label:"Remix"},{value:"astro",label:"Astro"},{value:"wordpress",label:"WordPress"},{value:"express.js",label:"Express.js"},{value:"nest.js",label:"Nest.js"}],Q={title:"Data Entry/Inputs/Auto Complete",component:u,args:{value:"",options:p,onChange:A(),placeholder:"Placeholder"}},a={render:()=>{const[r,n]=s.useState("nest.js");return S.jsx(u,{value:r,onChange:e=>{n(e),i("onChange")(e)},className:"max-w-[300px]",placeholder:"Placeholder",options:p})}},o={render:()=>{const[r,n]=s.useState(""),[e,c]=s.useState(!1),[f,j]=s.useState([]),C=async t=>(c(!0),i("onSearch")(t),new Promise(l=>{setTimeout(()=>l(p),1e3)}).then(l=>j(l)).finally(()=>c(!1)));return S.jsx(u,{value:r,onChange:t=>{n(t),i("onChange")(t)},options:f,loading:e,onSearch:C,debounceDelay:300,className:"max-w-[300px]",placeholder:"Placeholder"})}};var m,d,h;a.parameters={...a.parameters,docs:{...(m=a.parameters)==null?void 0:m.docs,source:{originalSource:`{
  render: () => {
    const [value, setValue] = useState<string | undefined>('nest.js');
    return <AutoComplete value={value} onChange={value => {
      setValue(value);
      action('onChange')(value);
    }} className="max-w-[300px]" placeholder="Placeholder" options={FRAMEWORKS} />;
  }
}`,...(h=(d=a.parameters)==null?void 0:d.docs)==null?void 0:h.source}}};var v,g,x;o.parameters={...o.parameters,docs:{...(v=o.parameters)==null?void 0:v.docs,source:{originalSource:`{
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
}`,...(x=(g=o.parameters)==null?void 0:g.docs)==null?void 0:x.source}}};const U=["Default","Async"];export{o as Async,a as Default,U as __namedExportsOrder,Q as default};
