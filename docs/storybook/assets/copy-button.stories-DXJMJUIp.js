import{j as e}from"./jsx-runtime-D_zvdyIk.js";import{C as s}from"./button-DVi2YR5Y.js";import"./index-C-d7IIsQ.js";import"./index-CBYaBgW8.js";import"./index-Dy6y0jaD.js";import"./action-button-9r-08jXC.js";import"./dropdown-menu-DPm_FhUX.js";import"./index-D9mtqW9-.js";import"./index-sTUCEGFJ.js";import"./index-BWnBDfn-.js";import"./index-BCzuw4Jg.js";import"./index-C8BBKGwP.js";import"./index-BL8Z-moU.js";import"./Combination-CrkgvPnV.js";import"./index-iyInEJkZ.js";import"./index-C2iKAgIe.js";import"./index-CWHKeK-O.js";import"./index-CfgEC-S9.js";import"./createLucideIcon-B119WVF5.js";import"./index-DnEzm5An.js";import"./utils-CDN07tui.js";import"./check-DSe_yRo5.js";import"./separator-ChZWIdMg.js";import"./button.variants-Du9eY_ux.js";import"./index-C66Dxnp2.js";import"./spinner-DMuui_2m.js";import"./tooltip-0vX-MTK3.js";import"./index-CfXWnpL9.js";import"./i18n-C40I7Y3q.js";import"./iframe-BPQjb6vk.js";import"./i18next-CYn7LYXT.js";const H={title:"Buttons/Copy Button",component:s,parameters:{docs:{description:{component:"A reusable button component that copies text to clipboard with tooltip feedback and success confirmation."}}},args:{value:"Hello, World!"},argTypes:{value:{control:"text",description:"The text value to copy to clipboard"}}},a={args:{value:"Default copy button"}},t={render:()=>e.jsxs("div",{className:"flex flex-col gap-3",children:[e.jsx("h3",{className:"text-lg font-semibold",children:"Usage Examples"}),e.jsxs("div",{className:"space-y-4",children:[e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx("span",{className:"font-medium",children:"Patient ID:"}),e.jsx("span",{children:"PAT123456"}),e.jsx(s,{value:"PAT123456"})]}),e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx("span",{className:"font-medium",children:"MRN:"}),e.jsx("span",{children:"MRN789012"}),e.jsx(s,{value:"MRN789012",variant:"outline"})]}),e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx("span",{className:"font-medium",children:"Email:"}),e.jsx("span",{children:"patient@example.com"}),e.jsx(s,{value:"patient@example.com",variant:"secondary",size:"default",iconSize:16})]}),e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx("span",{className:"font-medium",children:"Quick copy:"}),e.jsx("span",{children:"Fast success (1s)"}),e.jsx(s,{value:"Quick copy test",successDuration:1e3})]})]})]})};var n,o,i;a.parameters={...a.parameters,docs:{...(n=a.parameters)==null?void 0:n.docs,source:{originalSource:`{
  args: {
    value: 'Default copy button'
  }
}`,...(i=(o=a.parameters)==null?void 0:o.docs)==null?void 0:i.source}}};var r,p,m;t.parameters={...t.parameters,docs:{...(r=t.parameters)==null?void 0:r.docs,source:{originalSource:`{
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
}`,...(m=(p=t.parameters)==null?void 0:p.docs)==null?void 0:m.source}}};const O=["Default","UsageExamples"];export{a as Default,t as UsageExamples,O as __namedExportsOrder,H as default};
