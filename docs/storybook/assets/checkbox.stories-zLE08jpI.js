import{n as e}from"./rolldown-runtime-C0FnF6B9.js";import{t}from"./react-BRh_h4kc.js";import{t as n}from"./jsx-runtime-BdxMnOeJ.js";import{n as r,t as i}from"./checkbox--Wdc3fbi.js";import{i as a,n as o,t as s}from"./story-section-DVTm6cGm.js";import{n as c,t as l}from"./story-error-field-DeLRAi8K.js";var u,d,f,p,m,h;function g(){return(g=e((()=>{u=t(),r(),a(),c(),d=n(),f={title:`Components/Inputs/Checkbox`,args:{size:`default`,checked:!1,onCheckedChange:()=>{}},component:i},p={render:()=>{let[e,t]=(0,u.useState)(!1);return(0,d.jsxs)(o,{title:`Sizes`,children:[(0,d.jsxs)(`div`,{className:`flex flex-col gap-2`,children:[(0,d.jsx)(s,{children:`default`}),(0,d.jsx)(i,{size:`default`,checked:e,onCheckedChange:t})]}),(0,d.jsxs)(`div`,{className:`flex flex-col gap-2`,children:[(0,d.jsx)(s,{children:`xs`}),(0,d.jsx)(i,{size:`xs`,checked:e,onCheckedChange:t})]})]})}},m={render:()=>{let[e,t]=(0,u.useState)(!1);return(0,d.jsx)(o,{title:`Error`,description:`No red border on the box: by design, a checkbox in error shows the red label and the message only.`,children:(0,d.jsx)(l,{label:`I accept the terms`,error:`You must accept the terms to continue`,layout:`inline`,invalid:e!==!0,children:(0,d.jsx)(i,{checked:e,onCheckedChange:t})})})}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  render: () => {
    const [checked, setChecked] = useState<CheckedState>(false);
    return <StorySection title="Sizes">
        <div className="flex flex-col gap-2">
          <StoryLabel>default</StoryLabel>
          <Checkbox size="default" checked={checked} onCheckedChange={setChecked} />
        </div>
        <div className="flex flex-col gap-2">
          <StoryLabel>xs</StoryLabel>
          <Checkbox size="xs" checked={checked} onCheckedChange={setChecked} />
        </div>
      </StorySection>;
  }
}`,...p.parameters?.docs?.source}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  render: () => {
    const [checked, setChecked] = useState<CheckedState>(false);
    return <StorySection title="Error" description="No red border on the box: by design, a checkbox in error shows the red label and the message only.">
        <StoryErrorField label="I accept the terms" error="You must accept the terms to continue" layout="inline" invalid={checked !== true}>
          <Checkbox checked={checked} onCheckedChange={setChecked} />
        </StoryErrorField>
      </StorySection>;
  }
}`,...m.parameters?.docs?.source}}},h=[`Sizes`,`ErrorState`]})))()}g();export{m as ErrorState,p as Sizes,h as __namedExportsOrder,f as default};