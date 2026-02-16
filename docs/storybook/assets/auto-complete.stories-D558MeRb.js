import{j as S}from"./jsx-runtime-D_zvdyIk.js";import{r as s}from"./index-CBYaBgW8.js";import{a as i}from"./index-B-lxVbXh.js";import{A as p}from"./auto-complete-BXgRuKOX.js";import"./v4-CtRu48qb.js";import"./command-DH6TAVdL.js";import"./index-Cq0TEE3l.js";import"./index-D9mtqW9-.js";import"./index-sTUCEGFJ.js";import"./index-BWnBDfn-.js";import"./index-Dy6y0jaD.js";import"./index-DnEzm5An.js";import"./index-C8BBKGwP.js";import"./index-BL8Z-moU.js";import"./Combination-CrkgvPnV.js";import"./index-CWHKeK-O.js";import"./index-C66Dxnp2.js";import"./checkbox-BUFo-vqr.js";import"./index-SF2qmtPV.js";import"./index-C2iKAgIe.js";import"./utils-CDN07tui.js";import"./check-DSe_yRo5.js";import"./createLucideIcon-B119WVF5.js";import"./dialog-TAP2eCwF.js";import"./x-4HkHZ1eq.js";import"./skeleton-_T1otFf0.js";import"./i18n-B58psOPr.js";import"./iframe-B59UrewR.js";import"./i18next-CYn7LYXT.js";import"./useDebounce-CEPqGWFj.js";const u=[{value:"next.js",label:"Next.js"},{value:"sveltekit",label:"SvelteKit"},{value:"nuxt.js",label:"Nuxt.js"},{value:"remix",label:"Remix"},{value:"astro",label:"Astro"},{value:"wordpress",label:"WordPress"},{value:"express.js",label:"Express.js"},{value:"nest.js",label:"Nest.js"}],Z={title:"Inputs/Auto Complete",component:p,args:{value:"",options:u,onChange:()=>{},placeholder:"Placeholder"}},o={render:()=>{const[r,n]=s.useState("nest.js");return S.jsx(p,{value:r,onChange:e=>{n(e),i("onChange")(e)},className:"max-w-[300px]",placeholder:"Placeholder",options:u})}},a={render:()=>{const[r,n]=s.useState(""),[e,m]=s.useState(!1),[f,j]=s.useState([]),C=async t=>(m(!0),i("onSearch")(t),new Promise(l=>{setTimeout(()=>l(u),1e3)}).then(l=>j(l)).finally(()=>m(!1)));return S.jsx(p,{value:r,onChange:t=>{n(t),i("onChange")(t)},options:f,loading:e,onSearch:C,debounceDelay:300,className:"max-w-[300px]",placeholder:"Placeholder"})}};var c,d,h;o.parameters={...o.parameters,docs:{...(c=o.parameters)==null?void 0:c.docs,source:{originalSource:`{
  render: () => {
    const [value, setValue] = useState<string | undefined>('nest.js');
    return <AutoComplete value={value} onChange={value => {
      setValue(value);
      action('onChange')(value);
    }} className="max-w-[300px]" placeholder="Placeholder" options={FRAMEWORKS} />;
  }
}`,...(h=(d=o.parameters)==null?void 0:d.docs)==null?void 0:h.source}}};var v,g,x;a.parameters={...a.parameters,docs:{...(v=a.parameters)==null?void 0:v.docs,source:{originalSource:`{
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
}`,...(x=(g=a.parameters)==null?void 0:g.docs)==null?void 0:x.source}}};const $=["Default","Async"];export{a as Async,o as Default,$ as __namedExportsOrder,Z as default};
