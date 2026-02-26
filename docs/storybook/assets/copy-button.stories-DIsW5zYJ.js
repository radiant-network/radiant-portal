import{j as e}from"./iframe-DTNMgtJ9.js";import{C as s}from"./button-BiWZa9fG.js";import"./preload-helper-Dp1pzeXC.js";import"./index-DmW2l3rw.js";import"./action-button-C48Q3ZbN.js";import"./dropdown-menu-rE6kSISp.js";import"./index-q85xT6Ym.js";import"./circle-DVbZsvoH.js";import"./check-DWPdEd59.js";import"./separator-BbDgtkUj.js";import"./i18n-_VeiNF7Q.js";const y={title:"Buttons/Copy Button",component:s,parameters:{docs:{description:{component:"A reusable button component that copies text to clipboard with tooltip feedback and success confirmation."}}},args:{value:"Hello, World!"},argTypes:{value:{control:"text",description:"The text value to copy to clipboard"}}},a={args:{value:"Default copy button"}},n={render:()=>e.jsxs("div",{className:"flex flex-col gap-3",children:[e.jsx("h3",{className:"text-lg font-semibold",children:"Usage Examples"}),e.jsxs("div",{className:"space-y-4",children:[e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx("span",{className:"font-medium",children:"Patient ID:"}),e.jsx("span",{children:"PAT123456"}),e.jsx(s,{value:"PAT123456"})]}),e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx("span",{className:"font-medium",children:"MRN:"}),e.jsx("span",{children:"MRN789012"}),e.jsx(s,{value:"MRN789012",variant:"outline"})]}),e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx("span",{className:"font-medium",children:"Email:"}),e.jsx("span",{children:"patient@example.com"}),e.jsx(s,{value:"patient@example.com",variant:"secondary",size:"default",iconSize:16})]}),e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx("span",{className:"font-medium",children:"Quick copy:"}),e.jsx("span",{children:"Fast success (1s)"}),e.jsx(s,{value:"Quick copy test",successDuration:1e3})]})]})]})};var t,c,o;a.parameters={...a.parameters,docs:{...(t=a.parameters)==null?void 0:t.docs,source:{originalSource:`{
  args: {
    value: 'Default copy button'
  }
}`,...(o=(c=a.parameters)==null?void 0:c.docs)==null?void 0:o.source}}};var i,l,r;n.parameters={...n.parameters,docs:{...(i=n.parameters)==null?void 0:i.docs,source:{originalSource:`{
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
}`,...(r=(l=n.parameters)==null?void 0:l.docs)==null?void 0:r.source}}};const b=["Default","UsageExamples"];export{a as Default,n as UsageExamples,b as __namedExportsOrder,y as default};
