import{r as c,j as e}from"./iframe-fZ1JU2dD.js";import{S as a}from"./switch-BFqT1OgL.js";import"./preload-helper-PPVm8Dsz.js";import"./index-oBed2HXp.js";const o={title:"Inputs/Switch",args:{size:"default",checked:!1,onCheckedChange:()=>{}},component:a},s={render:()=>{const[t,n]=c.useState(!1),[l,d]=c.useState(!1);return e.jsxs("div",{className:"flex flex-col gap-2",children:[e.jsxs("div",{className:"flex gap-2 items-center",children:[e.jsx("span",{className:"",children:"Default"}),e.jsx(a,{size:"default",checked:t,onCheckedChange:n})]}),e.jsxs("div",{className:"flex gap-2 items-center",children:[e.jsx("span",{className:"",children:"Small"}),e.jsx(a,{size:"sm",checked:l,onCheckedChange:d})]})]})}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
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
}`,...s.parameters?.docs?.source}}};const f=["Sizes"];export{s as Sizes,f as __namedExportsOrder,o as default};
