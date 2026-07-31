import{r as c,j as e}from"./iframe-C_dP7gnO.js";import{S as t}from"./switch-BWmIIspT.js";import{a as o,b as i}from"./story-section-J70NlQOA.js";import{S as l}from"./story-error-field-O7hQaaPJ.js";import"./preload-helper-PPVm8Dsz.js";import"./index-BVx3zF6O.js";import"./index-Dbp-Hxy3.js";import"./label-CT5jJSHz.js";import"./separator-D3keCDl2.js";const g={title:"Components/Inputs/Switch",args:{size:"default",checked:!1,onCheckedChange:()=>{}},component:t},s={render:()=>{const[r,a]=c.useState(!1),[d,h]=c.useState(!1);return e.jsxs(o,{title:"Sizes",children:[e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx(i,{children:"Default"}),e.jsx(t,{size:"default",checked:r,onCheckedChange:a})]}),e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx(i,{children:"Small"}),e.jsx(t,{size:"sm",checked:d,onCheckedChange:h})]})]})}},n={render:()=>{const[r,a]=c.useState(!1);return e.jsx(o,{title:"Error",description:"In error the switch gets a red border and the label turns red. Once on, the track stays primary — unlike the checkbox, which fills red.",children:e.jsxs("div",{className:"flex flex-col gap-8",children:[e.jsxs("div",{className:"flex flex-col gap-3",children:[e.jsx(i,{children:"Off — the error clears once the switch is turned on, and comes back when it is turned off"}),e.jsx(l,{label:"Enable notifications",error:"This setting is required",layout:"inline",invalid:!r,children:e.jsx(t,{checked:r,onCheckedChange:a,"aria-invalid":!r})})]}),e.jsxs("div",{className:"flex flex-col gap-3",children:[e.jsx(i,{children:"On while still in error"}),e.jsx(l,{label:"Enable notifications",error:"This setting is required",layout:"inline",children:e.jsx(t,{defaultChecked:!0,"aria-invalid":!0})})]})]})})}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  render: () => {
    const [checkedDefault, setCheckedDefault] = useState(false);
    const [checkedSm, setCheckedSm] = useState(false);
    return <StorySection title="Sizes">
        <div className="flex items-center gap-2">
          <StoryLabel>Default</StoryLabel>
          <Switch size="default" checked={checkedDefault} onCheckedChange={setCheckedDefault} />
        </div>
        <div className="flex items-center gap-2">
          <StoryLabel>Small</StoryLabel>
          <Switch size="sm" checked={checkedSm} onCheckedChange={setCheckedSm} />
        </div>
      </StorySection>;
  }
}`,...s.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  render: () => {
    const [checked, setChecked] = useState(false);
    return <StorySection title="Error" description="In error the switch gets a red border and the label turns red. Once on, the track stays primary — unlike the checkbox, which fills red.">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-3">
            <StoryLabel>
              Off — the error clears once the switch is turned on, and comes back when it is turned off
            </StoryLabel>
            <StoryErrorField label="Enable notifications" error="This setting is required" layout="inline" invalid={!checked}>
              <Switch checked={checked} onCheckedChange={setChecked} aria-invalid={!checked} />
            </StoryErrorField>
          </div>

          <div className="flex flex-col gap-3">
            <StoryLabel>On while still in error</StoryLabel>
            <StoryErrorField label="Enable notifications" error="This setting is required" layout="inline">
              <Switch defaultChecked aria-invalid />
            </StoryErrorField>
          </div>
        </div>
      </StorySection>;
  }
}`,...n.parameters?.docs?.source}}};const C=["Sizes","ErrorState"];export{n as ErrorState,s as Sizes,C as __namedExportsOrder,g as default};
