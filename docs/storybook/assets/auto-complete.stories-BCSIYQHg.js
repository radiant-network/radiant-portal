import{j as S}from"./jsx-runtime-D_zvdyIk.js";import{r as s}from"./index-CBYaBgW8.js";import{f as A}from"./index-FPNDRHs_.js";import{a as i}from"./index-B-lxVbXh.js";import{A as p}from"./auto-complete-DhHq70PF.js";import"./v4-CtRu48qb.js";import"./command-BTfYnDb0.js";import"./index-Cq0TEE3l.js";import"./index-D9mtqW9-.js";import"./index-sTUCEGFJ.js";import"./index-BWnBDfn-.js";import"./index-Dy6y0jaD.js";import"./index-DnEzm5An.js";import"./index-C8BBKGwP.js";import"./index-BL8Z-moU.js";import"./Combination-CrkgvPnV.js";import"./index-CWHKeK-O.js";import"./index-C66Dxnp2.js";import"./checkbox-BUFo-vqr.js";import"./index-SF2qmtPV.js";import"./index-C2iKAgIe.js";import"./utils-CDN07tui.js";import"./check-DSe_yRo5.js";import"./createLucideIcon-B119WVF5.js";import"./dialog-OdqgjKr7.js";import"./x-4HkHZ1eq.js";import"./skeleton-_T1otFf0.js";import"./useDebounce-CEPqGWFj.js";const u=[{value:"next.js",label:"Next.js"},{value:"sveltekit",label:"SvelteKit"},{value:"nuxt.js",label:"Nuxt.js"},{value:"remix",label:"Remix"},{value:"astro",label:"Astro"},{value:"wordpress",label:"WordPress"},{value:"express.js",label:"Express.js"},{value:"nest.js",label:"Nest.js"}],Y={title:"Inputs/Auto Complete",component:p,args:{value:"",options:u,onChange:A(),placeholder:"Placeholder"}},a={render:()=>{const[r,n]=s.useState("nest.js");return S.jsx(p,{value:r,onChange:e=>{n(e),i("onChange")(e)},className:"max-w-[300px]",placeholder:"Placeholder",options:u})}},o={render:()=>{const[r,n]=s.useState(""),[e,m]=s.useState(!1),[f,j]=s.useState([]),C=async t=>(m(!0),i("onSearch")(t),new Promise(l=>{setTimeout(()=>l(u),1e3)}).then(l=>j(l)).finally(()=>m(!1)));return S.jsx(p,{value:r,onChange:t=>{n(t),i("onChange")(t)},options:f,loading:e,onSearch:C,debounceDelay:300,className:"max-w-[300px]",placeholder:"Placeholder"})}};var c,d,h;a.parameters={...a.parameters,docs:{...(c=a.parameters)==null?void 0:c.docs,source:{originalSource:`{
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
}`,...(x=(g=o.parameters)==null?void 0:g.docs)==null?void 0:x.source}}};const Z=["Default","Async"];export{o as Async,a as Default,Z as __namedExportsOrder,Y as default};
