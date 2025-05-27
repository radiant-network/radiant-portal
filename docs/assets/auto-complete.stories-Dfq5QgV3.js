import{j as S}from"./jsx-runtime-Cf8x2fCZ.js";import{r as s}from"./index-t5q4d8OJ.js";import{fn as A}from"./index-Cf3xVBfy.js";import{a as u}from"./index-B-lxVbXh.js";import{A as i}from"./auto-complete-uKrr_USB.js";import"./index-yBjzXJbu.js";import"./v4-CtRu48qb.js";import"./useDebounce-zphzDq9b.js";import"./index-w83wLIv_.js";import"./index-Bjkhh2p3.js";import"./index-CC5eZYhG.js";import"./index-fNjTmf9T.js";import"./index-KhTUl610.js";import"./Combination-CdAak5pT.js";import"./index-V1T-MO6M.js";import"./utils-CytzSlOG.js";import"./dialog-DVZakI6I.js";import"./x-Bt7o6wSZ.js";import"./createLucideIcon-BOZfVBeY.js";import"./skeleton-CfkhzHGY.js";import"./check-1JYhj4AL.js";const p=[{value:"next.js",label:"Next.js"},{value:"sveltekit",label:"SvelteKit"},{value:"nuxt.js",label:"Nuxt.js"},{value:"remix",label:"Remix"},{value:"astro",label:"Astro"},{value:"wordpress",label:"WordPress"},{value:"express.js",label:"Express.js"},{value:"nest.js",label:"Nest.js"}],B={title:"Data Entry/Inputs/Auto Complete",component:i,args:{value:"",options:p,onChange:A(),placeholder:"Placeholder"}},a={render:()=>{const[r,n]=s.useState("nest.js");return S.jsx(i,{value:r,onChange:e=>{n(e),u("onChange")(e)},className:"max-w-[300px]",placeholder:"Placeholder",options:p})}},o={render:()=>{const[r,n]=s.useState(""),[e,c]=s.useState(!1),[f,j]=s.useState([]),C=async t=>(c(!0),u("onSearch")(t),new Promise(l=>{setTimeout(()=>l(p),1e3)}).then(l=>j(l)).finally(()=>c(!1)));return S.jsx(i,{value:r,onChange:t=>{n(t),u("onChange")(t)},options:f,loading:e,onSearch:C,debounceDelay:300,className:"max-w-[300px]",placeholder:"Placeholder"})}};var m,d,h;a.parameters={...a.parameters,docs:{...(m=a.parameters)==null?void 0:m.docs,source:{originalSource:`{
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
}`,...(x=(g=o.parameters)==null?void 0:g.docs)==null?void 0:x.source}}};const G=["Default","Async"];export{o as Async,a as Default,G as __namedExportsOrder,B as default};
