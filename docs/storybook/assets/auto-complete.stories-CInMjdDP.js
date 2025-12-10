import{j as S}from"./jsx-runtime-D_zvdyIk.js";import{r as s}from"./index-CBYaBgW8.js";import{f as A}from"./index-DPYJpPba.js";import{a as i}from"./index-B-lxVbXh.js";import{A as u}from"./auto-complete-CWczajFI.js";import"./v4-CtRu48qb.js";import"./command-BLoobKVf.js";import"./index-CYXvTLpn.js";import"./index-D9mtqW9-.js";import"./index-sTUCEGFJ.js";import"./index-BWnBDfn-.js";import"./index-Dy6y0jaD.js";import"./index-DnEzm5An.js";import"./index-BdYz8WOz.js";import"./Combination-DPhcPU0m.js";import"./index-CWHKeK-O.js";import"./index-C66Dxnp2.js";import"./checkbox-BUFo-vqr.js";import"./index-SF2qmtPV.js";import"./index-C2iKAgIe.js";import"./utils-CDN07tui.js";import"./check-DSe_yRo5.js";import"./createLucideIcon-B119WVF5.js";import"./dialog-CV5sm2qR.js";import"./x-4HkHZ1eq.js";import"./skeleton-_T1otFf0.js";import"./useDebounce-CEPqGWFj.js";const p=[{value:"next.js",label:"Next.js"},{value:"sveltekit",label:"SvelteKit"},{value:"nuxt.js",label:"Nuxt.js"},{value:"remix",label:"Remix"},{value:"astro",label:"Astro"},{value:"wordpress",label:"WordPress"},{value:"express.js",label:"Express.js"},{value:"nest.js",label:"Nest.js"}],X={title:"Inputs/Auto Complete",component:u,args:{value:"",options:p,onChange:A(),placeholder:"Placeholder"}},a={render:()=>{const[r,n]=s.useState("nest.js");return S.jsx(u,{value:r,onChange:e=>{n(e),i("onChange")(e)},className:"max-w-[300px]",placeholder:"Placeholder",options:p})}},o={render:()=>{const[r,n]=s.useState(""),[e,c]=s.useState(!1),[f,j]=s.useState([]),C=async t=>(c(!0),i("onSearch")(t),new Promise(l=>{setTimeout(()=>l(p),1e3)}).then(l=>j(l)).finally(()=>c(!1)));return S.jsx(u,{value:r,onChange:t=>{n(t),i("onChange")(t)},options:f,loading:e,onSearch:C,debounceDelay:300,className:"max-w-[300px]",placeholder:"Placeholder"})}};var m,d,h;a.parameters={...a.parameters,docs:{...(m=a.parameters)==null?void 0:m.docs,source:{originalSource:`{
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
}`,...(x=(g=o.parameters)==null?void 0:g.docs)==null?void 0:x.source}}};const Y=["Default","Async"];export{o as Async,a as Default,Y as __namedExportsOrder,X as default};
