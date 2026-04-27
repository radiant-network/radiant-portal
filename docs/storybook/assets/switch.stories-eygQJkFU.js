import{r as c,j as e}from"./iframe-LZxw1Sce.js";import{S as a}from"./switch-BR0DQd4_.js";import"./preload-helper-Dp1pzeXC.js";import"./index-Dm9NEt_e.js";const u={title:"Inputs/Switch",args:{size:"default",checked:!1,onCheckedChange:()=>{}},component:a},s={render:()=>{const[d,r]=c.useState(!1),[m,i]=c.useState(!1);return e.jsxs("div",{className:"flex flex-col gap-2",children:[e.jsxs("div",{className:"flex gap-2 items-center",children:[e.jsx("span",{className:"",children:"Default"}),e.jsx(a,{size:"default",checked:d,onCheckedChange:r})]}),e.jsxs("div",{className:"flex gap-2 items-center",children:[e.jsx("span",{className:"",children:"Small"}),e.jsx(a,{size:"sm",checked:m,onCheckedChange:i})]})]})}};var t,n,l;s.parameters={...s.parameters,docs:{...(t=s.parameters)==null?void 0:t.docs,source:{originalSource:`{
  render: () => {
    const [checkedDefault, setCheckedDefault] = useState(false);
    const [checkedSm, setCheckedSm] = useState(false);
    return <div className="flex flex-col gap-2">
        <div className="flex gap-2 items-center">
          <span className="">Default</span>
          <Switch size="default" checked={checkedDefault} onCheckedChange={setCheckedDefault} />
        </div>
        <div className="flex gap-2 items-center">
          <span className="">Small</span>
          <Switch size="sm" checked={checkedSm} onCheckedChange={setCheckedSm} />
        </div>
      </div>;
  }
}`,...(l=(n=s.parameters)==null?void 0:n.docs)==null?void 0:l.source}}};const k=["Sizes"];export{s as Sizes,k as __namedExportsOrder,u as default};
