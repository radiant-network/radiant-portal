import{j as e}from"./iframe-KxDQxQDs.js";import{C as s}from"./button-DcEb2QoR.js";import{a as n}from"./story-section-B6HdLg4-.js";import"./preload-helper-PPVm8Dsz.js";import"./index-DL5skkIA.js";import"./action-button-zarxO1Cp.js";import"./dropdown-menu-BKe34Zcm.js";import"./index-Obe_1VFm.js";import"./index-C9Hzv6Cn.js";import"./check-OcLjUnTR.js";import"./circle-YicaXG0V.js";import"./separator-RpiEdedA.js";import"./i18n-BnCxB2cP.js";import"./index-CPmIy41W.js";const g={title:"Components/Buttons/Copy Button",component:s,parameters:{docs:{description:{component:"A reusable button component that copies text to clipboard with tooltip feedback and success confirmation."}}},args:{value:"Hello, World!"},argTypes:{value:{control:"text",description:"The text value to copy to clipboard"}}},a={args:{value:"Default copy button"},render:o=>e.jsx(n,{title:"Default",children:e.jsx(s,{...o})})},t={render:()=>e.jsx(n,{title:"Usage examples",children:e.jsxs("div",{className:"space-y-4",children:[e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx("span",{className:"font-medium",children:"Patient ID:"}),e.jsx("span",{children:"PAT123456"}),e.jsx(s,{value:"PAT123456"})]}),e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx("span",{className:"font-medium",children:"MRN:"}),e.jsx("span",{children:"MRN789012"}),e.jsx(s,{value:"MRN789012",variant:"outline"})]}),e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx("span",{className:"font-medium",children:"Email:"}),e.jsx("span",{children:"patient@example.com"}),e.jsx(s,{value:"patient@example.com",variant:"secondary",size:"default",iconSize:16})]}),e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx("span",{className:"font-medium",children:"Quick copy:"}),e.jsx("span",{children:"Fast success (1s)"}),e.jsx(s,{value:"Quick copy test",successDuration:1e3})]})]})})};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  args: {
    value: 'Default copy button'
  },
  render: args => <StorySection title="Default">
      <CopyButton {...args} />
    </StorySection>
}`,...a.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  render: () => <StorySection title="Usage examples">
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
    </StorySection>
}`,...t.parameters?.docs?.source}}};const h=["Default","UsageExamples"];export{a as Default,t as UsageExamples,h as __namedExportsOrder,g as default};
