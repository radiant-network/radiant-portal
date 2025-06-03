import{j as S}from"./jsx-runtime-D_zvdyIk.js";import{r as s}from"./index-CTzypqlY.js";import{f as A}from"./index-60NixA5P.js";import{a as u}from"./index-B-lxVbXh.js";import{A as i}from"./auto-complete-T4sSPjwO.js";import"./v4-CtRu48qb.js";import"./useDebounce-9IbkJMY2.js";import"./index-Bn1uQpHS.js";import"./index-DSqg7KUl.js";import"./index-8Ey6BpB7.js";import"./index-X_f_OX5J.js";import"./index-CqHHZPb-.js";import"./Combination-3tVHk2hX.js";import"./index-BEp8L1N2.js";import"./utils-CytzSlOG.js";import"./dialog-CLvvToGl.js";import"./x-CjbLemEF.js";import"./createLucideIcon-j2ULFFRy.js";import"./skeleton-CcVKhvwU.js";import"./check-BwCYBAs1.js";const c=[{value:"next.js",label:"Next.js"},{value:"sveltekit",label:"SvelteKit"},{value:"nuxt.js",label:"Nuxt.js"},{value:"remix",label:"Remix"},{value:"astro",label:"Astro"},{value:"wordpress",label:"WordPress"},{value:"express.js",label:"Express.js"},{value:"nest.js",label:"Nest.js"}],z={title:"Data Entry/Inputs/Auto Complete",component:i,args:{value:"",options:c,onChange:A(),placeholder:"Placeholder"}},t={render:()=>{const[r,n]=s.useState("nest.js");return S.jsx(i,{value:r,onChange:e=>{n(e),u("onChange")(e)},className:"max-w-[300px]",placeholder:"Placeholder",options:c})}},o={render:()=>{const[r,n]=s.useState(""),[e,p]=s.useState(!1),[f,j]=s.useState([]),C=async a=>(p(!0),u("onSearch")(a),new Promise(l=>{setTimeout(()=>l(c),1e3)}).then(l=>j(l)).finally(()=>p(!1)));return S.jsx(i,{value:r,onChange:a=>{n(a),u("onChange")(a)},options:f,loading:e,onSearch:C,debounceDelay:300,className:"max-w-[300px]",placeholder:"Placeholder"})}};var m,d,h;t.parameters={...t.parameters,docs:{...(m=t.parameters)==null?void 0:m.docs,source:{originalSource:`{
  render: () => {
    const [value, setValue] = useState<string | undefined>('nest.js');
    return <AutoComplete value={value} onChange={value => {
      setValue(value);
      action('onChange')(value);
    }} className="max-w-[300px]" placeholder="Placeholder" options={FRAMEWORKS} />;
  }
}`,...(h=(d=t.parameters)==null?void 0:d.docs)==null?void 0:h.source}}};var v,g,x;o.parameters={...o.parameters,docs:{...(v=o.parameters)==null?void 0:v.docs,source:{originalSource:`{
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
}`,...(x=(g=o.parameters)==null?void 0:g.docs)==null?void 0:x.source}}};const B=["Default","Async"];export{o as Async,t as Default,B as __namedExportsOrder,z as default};
