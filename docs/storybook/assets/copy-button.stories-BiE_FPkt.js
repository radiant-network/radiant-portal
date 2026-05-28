import{j as e}from"./iframe-BdVkGBhb.js";import{C as s}from"./button-zA7C4LoZ.js";import"./preload-helper-Dp1pzeXC.js";import"./index-BTAukcSu.js";import"./action-button-CpRjOizG.js";import"./dropdown-menu-CzBsT1en.js";import"./index-xQ2ojJvx.js";import"./index-CNw0ArEG.js";import"./check-BIdY2e8D.js";import"./circle-B2j6O8ci.js";import"./separator-BYsloDMD.js";import"./i18n-C6QGtJ6I.js";const b={title:"Buttons/Copy Button",component:s,parameters:{docs:{description:{component:"A reusable button component that copies text to clipboard with tooltip feedback and success confirmation."}}},args:{value:"Hello, World!"},argTypes:{value:{control:"text",description:"The text value to copy to clipboard"}}},a={args:{value:"Default copy button"}},n={render:()=>e.jsxs("div",{className:"flex flex-col gap-3",children:[e.jsx("h3",{className:"text-lg font-semibold",children:"Usage Examples"}),e.jsxs("div",{className:"space-y-4",children:[e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx("span",{className:"font-medium",children:"Patient ID:"}),e.jsx("span",{children:"PAT123456"}),e.jsx(s,{value:"PAT123456"})]}),e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx("span",{className:"font-medium",children:"MRN:"}),e.jsx("span",{children:"MRN789012"}),e.jsx(s,{value:"MRN789012",variant:"outline"})]}),e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx("span",{className:"font-medium",children:"Email:"}),e.jsx("span",{children:"patient@example.com"}),e.jsx(s,{value:"patient@example.com",variant:"secondary",size:"default",iconSize:16})]}),e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx("span",{className:"font-medium",children:"Quick copy:"}),e.jsx("span",{children:"Fast success (1s)"}),e.jsx(s,{value:"Quick copy test",successDuration:1e3})]})]})]})};var t,o,c;a.parameters={...a.parameters,docs:{...(t=a.parameters)==null?void 0:t.docs,source:{originalSource:`{
  args: {
    value: 'Default copy button'
  }
}`,...(c=(o=a.parameters)==null?void 0:o.docs)==null?void 0:c.source}}};var i,l,r;n.parameters={...n.parameters,docs:{...(i=n.parameters)==null?void 0:i.docs,source:{originalSource:`{
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
}`,...(r=(l=n.parameters)==null?void 0:l.docs)==null?void 0:r.source}}};const D=["Default","UsageExamples"];export{a as Default,n as UsageExamples,D as __namedExportsOrder,b as default};
