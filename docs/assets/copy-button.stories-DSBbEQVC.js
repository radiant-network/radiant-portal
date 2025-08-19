import{j as e}from"./jsx-runtime-D_zvdyIk.js";import{C as s}from"./button-BTzoVuc5.js";import"./index-COcwYKbe.js";import"./index-CGj_12n1.js";import"./index-D8dqFcAi.js";import"./index-BBPXtLXU.js";import"./ActionButton-3Jbj_BdW.js";import"./dropdown-menu-CdOBzT_z.js";import"./index-CcLUv2_A.js";import"./index-CphM_NEg.js";import"./Combination-Bb6GvI2f.js";import"./index-CbbSLEvm.js";import"./index-A6VgBoaw.js";import"./index-CKNrATXZ.js";import"./index-CIckazZy.js";import"./utils-D-KgF5mV.js";import"./check-DRc1RmCY.js";import"./createLucideIcon-8Lr1oLzj.js";import"./button.variants-BQkt_1YJ.js";import"./index-C66Dxnp2.js";import"./ellipsis-BM4jpslE.js";import"./spinner-BMSZ66Eg.js";import"./tooltip-Bh6uXa7k.js";import"./i18n-FvMCU3us.js";import"./iframe-DNyp2aTw.js";import"./context-DkqwYzW-.js";const U={title:"Buttons/Copy Button",component:s,parameters:{docs:{description:{component:"A reusable button component that copies text to clipboard with tooltip feedback and success confirmation."}}},args:{value:"Hello, World!"},argTypes:{value:{control:"text",description:"The text value to copy to clipboard"}}},a={args:{value:"Default copy button"}},t={render:()=>e.jsxs("div",{className:"flex flex-col gap-3",children:[e.jsx("h3",{className:"text-lg font-semibold",children:"Usage Examples"}),e.jsxs("div",{className:"space-y-4",children:[e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx("span",{className:"font-medium",children:"Patient ID:"}),e.jsx("span",{children:"PAT123456"}),e.jsx(s,{value:"PAT123456"})]}),e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx("span",{className:"font-medium",children:"MRN:"}),e.jsx("span",{children:"MRN789012"}),e.jsx(s,{value:"MRN789012",variant:"outline"})]}),e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx("span",{className:"font-medium",children:"Email:"}),e.jsx("span",{children:"patient@example.com"}),e.jsx(s,{value:"patient@example.com",variant:"secondary",size:"default",iconSize:16})]}),e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx("span",{className:"font-medium",children:"Quick copy:"}),e.jsx("span",{children:"Fast success (1s)"}),e.jsx(s,{value:"Quick copy test",successDuration:1e3})]})]})]})};var n,o,i;a.parameters={...a.parameters,docs:{...(n=a.parameters)==null?void 0:n.docs,source:{originalSource:`{
  args: {
    value: 'Default copy button'
  }
}`,...(i=(o=a.parameters)==null?void 0:o.docs)==null?void 0:i.source}}};var r,p,c;t.parameters={...t.parameters,docs:{...(r=t.parameters)==null?void 0:r.docs,source:{originalSource:`{
  render: () => {
    return <div className="flex flex-col gap-3">
        <h3 className="text-lg font-semibold">Usage Examples</h3>

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="font-medium">Patient ID:</span>
            <span>PAT123456</span>
            <CopyButton value="PAT123456" />
          </div>

          <div className="flex items-center gap-2">
            <span className="font-medium">MRN:</span>
            <span>MRN789012</span>
            <CopyButton value="MRN789012" variant="outline" />
          </div>

          <div className="flex items-center gap-2">
            <span className="font-medium">Email:</span>
            <span>patient@example.com</span>
            <CopyButton value="patient@example.com" variant="secondary" size="default" iconSize={16} />
          </div>

          <div className="flex items-center gap-2">
            <span className="font-medium">Quick copy:</span>
            <span>Fast success (1s)</span>
            <CopyButton value="Quick copy test" successDuration={1000} />
          </div>
        </div>
      </div>;
  }
}`,...(c=(p=t.parameters)==null?void 0:p.docs)==null?void 0:c.source}}};const F=["Default","UsageExamples"];export{a as Default,t as UsageExamples,F as __namedExportsOrder,U as default};
