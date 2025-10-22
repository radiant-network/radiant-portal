import{j as S}from"./jsx-runtime-D_zvdyIk.js";import{r as s}from"./index-CGj_12n1.js";import{f as A}from"./index-DtL3pAzF.js";import{a as i}from"./index-B-lxVbXh.js";import{A as u}from"./auto-complete-C7mheyH_.js";import"./v4-CtRu48qb.js";import"./command-EgOjp73N.js";import"./index-CosFuvvC.js";import"./index-CcLUv2_A.js";import"./index-B7CJuYpG.js";import"./index-D8dqFcAi.js";import"./index-BBPXtLXU.js";import"./index-CIckazZy.js";import"./index-Ch7hUksi.js";import"./Combination-DwMjbv-J.js";import"./index-CRLeYu_h.js";import"./index-C66Dxnp2.js";import"./checkbox-CuLJw5hI.js";import"./index-qxuqJ0RB.js";import"./index-A6VgBoaw.js";import"./utils-D-KgF5mV.js";import"./check-DRc1RmCY.js";import"./createLucideIcon-8Lr1oLzj.js";import"./dialog-D8H4qXag.js";import"./x-CubKniSv.js";import"./skeleton-Shk8p_SP.js";import"./useDebounce-CWd6BpJ3.js";const p=[{value:"next.js",label:"Next.js"},{value:"sveltekit",label:"SvelteKit"},{value:"nuxt.js",label:"Nuxt.js"},{value:"remix",label:"Remix"},{value:"astro",label:"Astro"},{value:"wordpress",label:"WordPress"},{value:"express.js",label:"Express.js"},{value:"nest.js",label:"Nest.js"}],X={title:"Inputs/Auto Complete",component:u,args:{value:"",options:p,onChange:A(),placeholder:"Placeholder"}},a={render:()=>{const[r,n]=s.useState("nest.js");return S.jsx(u,{value:r,onChange:e=>{n(e),i("onChange")(e)},className:"max-w-[300px]",placeholder:"Placeholder",options:p})}},o={render:()=>{const[r,n]=s.useState(""),[e,c]=s.useState(!1),[f,j]=s.useState([]),C=async t=>(c(!0),i("onSearch")(t),new Promise(l=>{setTimeout(()=>l(p),1e3)}).then(l=>j(l)).finally(()=>c(!1)));return S.jsx(u,{value:r,onChange:t=>{n(t),i("onChange")(t)},options:f,loading:e,onSearch:C,debounceDelay:300,className:"max-w-[300px]",placeholder:"Placeholder"})}};var m,d,h;a.parameters={...a.parameters,docs:{...(m=a.parameters)==null?void 0:m.docs,source:{originalSource:`{
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
