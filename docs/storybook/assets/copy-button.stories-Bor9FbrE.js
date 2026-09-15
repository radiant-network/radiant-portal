import{n as e}from"./rolldown-runtime-C0FnF6B9.js";import{t}from"./jsx-runtime-BdxMnOeJ.js";import{a as n,i as r}from"./button-Cn480Lud.js";import{i,n as a}from"./story-section-DVTm6cGm.js";var o,s,c,l,u;function d(){return(d=e((()=>{n(),i(),o=t(),s={title:`Components/Buttons/Copy Button`,component:r,parameters:{docs:{description:{component:`A reusable button component that copies text to clipboard with tooltip feedback and success confirmation.`}}},args:{value:`Hello, World!`},argTypes:{value:{control:`text`,description:`The text value to copy to clipboard`}}},c={args:{value:`Default copy button`},render:e=>(0,o.jsx)(a,{title:`Default`,children:(0,o.jsx)(r,{...e})})},l={render:()=>(0,o.jsx)(a,{title:`Usage examples`,children:(0,o.jsxs)(`div`,{className:`space-y-4`,children:[(0,o.jsxs)(`div`,{className:`flex items-center gap-2`,children:[(0,o.jsx)(`span`,{className:`font-medium`,children:`Patient ID:`}),(0,o.jsx)(`span`,{children:`PAT123456`}),(0,o.jsx)(r,{value:`PAT123456`})]}),(0,o.jsxs)(`div`,{className:`flex items-center gap-2`,children:[(0,o.jsx)(`span`,{className:`font-medium`,children:`MRN:`}),(0,o.jsx)(`span`,{children:`MRN789012`}),(0,o.jsx)(r,{value:`MRN789012`,variant:`outline`})]}),(0,o.jsxs)(`div`,{className:`flex items-center gap-2`,children:[(0,o.jsx)(`span`,{className:`font-medium`,children:`Email:`}),(0,o.jsx)(`span`,{children:`patient@example.com`}),(0,o.jsx)(r,{value:`patient@example.com`,variant:`secondary`,size:`default`,iconSize:16})]}),(0,o.jsxs)(`div`,{className:`flex items-center gap-2`,children:[(0,o.jsx)(`span`,{className:`font-medium`,children:`Quick copy:`}),(0,o.jsx)(`span`,{children:`Fast success (1s)`}),(0,o.jsx)(r,{value:`Quick copy test`,successDuration:1e3})]})]})})},c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  args: {
    value: 'Default copy button'
  },
  render: args => <StorySection title="Default">
      <CopyButton {...args} />
    </StorySection>
}`,...c.parameters?.docs?.source}}},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
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
}`,...l.parameters?.docs?.source}}},u=[`Default`,`UsageExamples`]})))()}d();export{c as Default,l as UsageExamples,u as __namedExportsOrder,s as default};