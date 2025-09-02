import{j as e}from"./jsx-runtime-D_zvdyIk.js";import{r as l}from"./index-CGj_12n1.js";import{f as p}from"./index-DtL3pAzF.js";import{C as a}from"./checkbox-B0xIRynn.js";import"./index-COcwYKbe.js";import"./index-D8dqFcAi.js";import"./index-BBPXtLXU.js";import"./index-CcLUv2_A.js";import"./index-qxuqJ0RB.js";import"./index-A6VgBoaw.js";import"./index-BOEjv1S3.js";import"./index-C66Dxnp2.js";import"./utils-D-KgF5mV.js";import"./check-DRc1RmCY.js";import"./createLucideIcon-8Lr1oLzj.js";const F={title:"Inputs/Checkbox",args:{size:"default",checked:!1,onCheckedChange:p()},component:a},c={render:()=>{const[s,t]=l.useState(!1);return e.jsx(a,{checked:s,onCheckedChange:t})}},r={render:()=>{const[s,t]=l.useState(!1);return e.jsxs(e.Fragment,{children:[e.jsxs("div",{className:"p-4",children:[e.jsx("h3",{className:"mb-4 text-lg font-semibold",children:"Size: default"}),e.jsx(a,{size:"default",checked:s,onCheckedChange:t})]}),e.jsxs("div",{className:"p-4",children:[e.jsx("h3",{className:"mb-4 text-lg font-semibold",children:"Size: xs"}),e.jsx(a,{size:"xs",checked:s,onCheckedChange:t})]})]})}};var n,o,d;c.parameters={...c.parameters,docs:{...(n=c.parameters)==null?void 0:n.docs,source:{originalSource:`{
  render: () => {
    const [checked, setChecked] = useState<CheckedState>(false);
    return <Checkbox checked={checked} onCheckedChange={setChecked} />;
  }
}`,...(d=(o=c.parameters)==null?void 0:o.docs)==null?void 0:d.source}}};var h,m,i;r.parameters={...r.parameters,docs:{...(h=r.parameters)==null?void 0:h.docs,source:{originalSource:`{
  render: () => {
    const [checked, setChecked] = useState<CheckedState>(false);
    return <>
        <div className="p-4">
          <h3 className="mb-4 text-lg font-semibold">Size: default</h3>
          <Checkbox size="default" checked={checked} onCheckedChange={setChecked} />
        </div>
        <div className="p-4">
          <h3 className="mb-4 text-lg font-semibold">Size: xs</h3>
          <Checkbox size="xs" checked={checked} onCheckedChange={setChecked} />
        </div>
      </>;
  }
}`,...(i=(m=r.parameters)==null?void 0:m.docs)==null?void 0:i.source}}};const I=["Default","Sizes"];export{c as Default,r as Sizes,I as __namedExportsOrder,F as default};
