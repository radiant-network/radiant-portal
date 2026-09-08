import{r,j as a}from"./iframe-BC4RzbTe.js";import{A as c}from"./auto-complete-DftrKF15.js";import{a as m}from"./story-section-DPrmmWzN.js";import{S as x}from"./story-error-field-B-e2H9VZ.js";import"./preload-helper-PPVm8Dsz.js";import"./command-BfraPepx.js";import"./checkbox-6QADwITq.js";import"./index-DErrjSEm.js";import"./check-CdGhgW-U.js";import"./dialog-CFl_3Pne.js";import"./i18n-B_9vMIaN.js";import"./index-nJ2VJ9o6.js";import"./x-CE8BJu81.js";import"./skeleton-B5ieX502.js";import"./useDebounce-BzvliQkx.js";import"./index-DACLWZXy.js";import"./label-IdXerJGz.js";import"./separator-C1ujT8UF.js";const{action:u}=__STORYBOOK_MODULE_ACTIONS__,p=[{value:"next.js",label:"Next.js"},{value:"sveltekit",label:"SvelteKit"},{value:"nuxt.js",label:"Nuxt.js"},{value:"remix",label:"Remix"},{value:"astro",label:"Astro"},{value:"wordpress",label:"WordPress"},{value:"express.js",label:"Express.js"},{value:"nest.js",label:"Nest.js"}],M={title:"Components/Inputs/Auto Complete",component:c,args:{value:"",options:p,onChange:()=>{},placeholder:"Placeholder"}},n={render:()=>{const[e,o]=r.useState("nest.js");return a.jsx(m,{title:"Default",children:a.jsx(c,{value:e,onChange:t=>{o(t),u("onChange")(t)},className:"max-w-[300px]",placeholder:"Placeholder",options:p})})}},l={render:()=>{const[e,o]=r.useState(""),[t,S]=r.useState(!1),[h,v]=r.useState([]),g=async s=>(S(!0),u("onSearch")(s),new Promise(d=>{setTimeout(()=>d(p),1e3)}).then(d=>v(d)).finally(()=>S(!1)));return a.jsx(m,{title:"Async",children:a.jsx(c,{value:e,onChange:s=>{o(s),u("onChange")(s)},options:h,loading:t,onSearch:g,debounceDelay:300,className:"max-w-[300px]",placeholder:"Placeholder"})})}},i={render:()=>{const[e,o]=r.useState("");return a.jsx(m,{title:"Error",children:a.jsx(x,{label:"Framework",invalid:!e,children:a.jsx(c,{"aria-invalid":!e,value:e,onChange:t=>{o(t),u("onChange")(t)},placeholder:"Placeholder",options:p})})})}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  render: () => {
    const [value, setValue] = useState<string | undefined>('nest.js');
    return <StorySection title="Default">
        <AutoComplete value={value} onChange={value => {
        setValue(value);
        action('onChange')(value);
      }} className="max-w-[300px]" placeholder="Placeholder" options={FRAMEWORKS} />
      </StorySection>;
  }
}`,...n.parameters?.docs?.source}}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
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
}`,...l.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  render: () => {
    const [value, setValue] = useState<string | undefined>('');
    return <StorySection title="Error">
        <StoryErrorField label="Framework" invalid={!value}>
          <AutoComplete aria-invalid={!value} value={value} onChange={value => {
          setValue(value);
          action('onChange')(value);
        }} placeholder="Placeholder" options={FRAMEWORKS} />
        </StoryErrorField>
      </StorySection>;
  }
}`,...i.parameters?.docs?.source}}};const W=["Default","Async","ErrorState"];export{l as Async,n as Default,i as ErrorState,W as __namedExportsOrder,M as default};
