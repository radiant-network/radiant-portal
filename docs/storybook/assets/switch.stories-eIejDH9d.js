import{r as o,j as e,c as g,b as A}from"./iframe-BXBRzL1c.js";import{S as T,F as f,d as p}from"./story-error-field-B8bACwGZ.js";import{S as h}from"./switch-Ctc41Qii.js";import{S as N,a as S,b as d}from"./story-section-G0DD0yKl.js";import"./preload-helper-PPVm8Dsz.js";import"./index-I9rBnVM7.js";import"./label-FkSBQTJT.js";import"./separator-D6E9NYhF.js";import"./index-ChzukvM0.js";const U=A({slots:{base:"w-full",disabled:"opacity-50 cursor-not-allowed",box:"border rounded-md border-input",boxChecked:"border-primary bg-accent",switchDisabled:"disabled:opacity-100",container:"flex",label:"flex flex-1 flex-col gap-1.5 cursor-pointer",title:"text-sm font-medium text-foreground",description:"text-sm text-muted-foreground font-normal"},variants:{size:{default:{container:"gap-2"},sm:{container:"gap-3",title:"leading-none"}},align:{start:{container:"items-start"},end:{container:"items-start flex-row-reverse"}},invalid:{true:{title:"text-destructive",boxChecked:"border-destructive bg-alert-error/20"}}},defaultVariants:{size:"default",align:"start"}});function i({size:a="default",align:x="start",className:c,label:n,description:r,box:b,id:B,checked:z,defaultChecked:R,disabled:u,onCheckedChange:I,"aria-invalid":C,...O}){const t=U({size:a,align:x,invalid:C===!0||C==="true"}),V=o.useId(),[_,W]=o.useState(R??!1),m=B??V,L=`${m}-label`,E=`${m}-description`,D=z!==void 0,F=D?z:_,$=q=>{D||W(q),I?.(q)};return e.jsx("div",{"data-slot":"switch-field","data-state":F?"checked":"unchecked","data-disabled":u||void 0,className:g(t.base(),b&&t.box(),b&&F&&t.boxChecked(),u&&t.disabled(),c),children:e.jsxs("div",{className:g(t.container(),b&&"p-2.5"),children:[e.jsx(h,{id:m,size:a,checked:F,disabled:u,"aria-invalid":C,"aria-labelledby":n?L:void 0,"aria-describedby":r?E:void 0,className:g(u?t.switchDisabled():"cursor-pointer"),onCheckedChange:$,...O}),(n||r)&&e.jsxs("label",{htmlFor:m,className:g(t.label(),u&&"cursor-not-allowed"),children:[n&&e.jsx("span",{id:L,className:t.title(),children:n}),r&&e.jsx("span",{id:E,className:t.description(),children:r})]})]})})}i.__docgenInfo={description:"A single switch with display option (box, disable, align, ...)",methods:[],displayName:"SwitchField",props:{label:{required:!1,tsType:{name:"ReactReactNode",raw:"React.ReactNode"},description:""},description:{required:!1,tsType:{name:"ReactReactNode",raw:"React.ReactNode"},description:""},box:{required:!1,tsType:{name:"boolean"},description:""},size:{defaultValue:{value:"'default'",computed:!1},required:!1},align:{defaultValue:{value:"'start'",computed:!1},required:!1}}};const ee={title:"Components/Inputs/Switch",args:{size:"default",checked:!1,onCheckedChange:()=>{}},component:h},l="Switch Text",s="This is a switch description.",v={render:()=>{const[a,x]=o.useState(!1),[c,n]=o.useState(!1);return e.jsxs(S,{title:"Sizes",children:[e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx(d,{children:"Default"}),e.jsx(h,{size:"default",checked:a,onCheckedChange:x})]}),e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx(d,{children:"Small"}),e.jsx(h,{size:"sm",checked:c,onCheckedChange:n})]})]})}},k={render:()=>e.jsx(N,{children:e.jsx(S,{title:"Label, description and align",children:e.jsxs("div",{className:"flex gap-20",children:[e.jsxs("div",{className:"flex flex-col gap-4",style:{width:280},children:[e.jsx(d,{children:"Default size"}),e.jsx(i,{label:l,description:s}),e.jsx(i,{label:l,description:s,defaultChecked:!0}),e.jsx(i,{label:l,description:s,align:"end"}),e.jsx(i,{label:l,description:s,align:"end",defaultChecked:!0})]}),e.jsxs("div",{className:"flex flex-col gap-4",style:{width:280},children:[e.jsx(d,{children:"Small size"}),e.jsx(i,{size:"sm",label:l,description:s}),e.jsx(i,{size:"sm",label:l,description:s,defaultChecked:!0}),e.jsx(i,{size:"sm",label:l,description:s,align:"end"}),e.jsx(i,{size:"sm",label:l,description:s,align:"end",defaultChecked:!0})]}),e.jsxs("div",{className:"flex flex-col gap-4",style:{width:280},children:[e.jsx(d,{children:"Label only"}),e.jsx(i,{label:l}),e.jsx(i,{label:l,align:"end"})]})]})})})},j={render:()=>e.jsx(N,{children:e.jsx(S,{title:"Box",children:e.jsxs("div",{className:"flex gap-20",children:[e.jsxs("div",{className:"flex flex-col gap-4",style:{width:280},children:[e.jsx(d,{children:"Default size"}),e.jsx(i,{box:!0,label:l,description:s}),e.jsx(i,{box:!0,label:l,description:s,defaultChecked:!0}),e.jsx(i,{box:!0,align:"end",label:l,description:s}),e.jsx(i,{box:!0,align:"end",label:l,description:s,defaultChecked:!0})]}),e.jsxs("div",{className:"flex flex-col gap-4",style:{width:280},children:[e.jsx(d,{children:"Small size"}),e.jsx(i,{box:!0,size:"sm",label:l,description:s}),e.jsx(i,{box:!0,size:"sm",label:l,description:s,defaultChecked:!0}),e.jsx(i,{box:!0,size:"sm",align:"end",label:l,description:s}),e.jsx(i,{box:!0,size:"sm",align:"end",label:l,description:s,defaultChecked:!0})]})]})})})},w={render:()=>e.jsx(N,{children:e.jsx(S,{title:"Disabled",children:e.jsxs("div",{className:"flex gap-20",children:[e.jsxs("div",{className:"flex flex-col gap-4",style:{width:280},children:[e.jsx(d,{children:"Default"}),e.jsx(i,{disabled:!0,label:l,description:s}),e.jsx(i,{disabled:!0,defaultChecked:!0,label:l,description:s}),e.jsx(i,{disabled:!0,align:"end",label:l,description:s}),e.jsx(i,{disabled:!0,align:"end",defaultChecked:!0,label:l,description:s})]}),e.jsxs("div",{className:"flex flex-col gap-4",style:{width:280},children:[e.jsx(d,{children:"Box"}),e.jsx(i,{box:!0,disabled:!0,label:l,description:s}),e.jsx(i,{box:!0,disabled:!0,defaultChecked:!0,label:l,description:s}),e.jsx(i,{box:!0,disabled:!0,align:"end",label:l,description:s}),e.jsx(i,{box:!0,disabled:!0,align:"end",defaultChecked:!0,label:l,description:s})]})]})})})},y={render:()=>{const[a,x]=o.useState(!1),[c,n]=o.useState(!1),[r,b]=o.useState(!1);return e.jsx(S,{title:"Error",children:e.jsxs("div",{className:"flex flex-col gap-8",children:[e.jsxs("div",{className:"flex flex-col gap-3",children:[e.jsx(d,{children:"Off — the error clears once the switch is turned on, and comes back when it is turned off"}),e.jsx(T,{label:"Enable notifications",error:"This setting is required",layout:"inline",invalid:!a,children:e.jsx(h,{checked:a,onCheckedChange:x,"aria-invalid":!a})})]}),e.jsxs("div",{className:"flex flex-col gap-3",children:[e.jsx(d,{children:"On while still in error"}),e.jsx(T,{label:"Enable notifications",error:"This setting is required",layout:"inline",children:e.jsx(h,{defaultChecked:!0,"aria-invalid":!0})})]}),e.jsxs("div",{className:"flex flex-col gap-3",children:[e.jsx(d,{children:"Switch field"}),e.jsxs("div",{className:"flex gap-20",children:[e.jsx("div",{style:{width:280},children:e.jsxs(f,{children:[e.jsx(i,{checked:c,onCheckedChange:n,"aria-invalid":!c,label:l,description:s}),!c&&e.jsx(p,{children:"This setting is required"})]})}),e.jsx("div",{style:{width:280},children:e.jsxs(f,{children:[e.jsx(i,{box:!0,checked:r,onCheckedChange:b,"aria-invalid":!r,label:l,description:s}),!r&&e.jsx(p,{children:"This setting is required"})]})})]})]}),e.jsxs("div",{className:"flex flex-col gap-3",children:[e.jsx(d,{children:"Switch field on while still in error"}),e.jsxs("div",{className:"flex gap-20",children:[e.jsx("div",{style:{width:280},children:e.jsxs(f,{children:[e.jsx(i,{"aria-invalid":!0,align:"end",defaultChecked:!0,label:l,description:s}),e.jsx(p,{children:"This setting is required"})]})}),e.jsx("div",{style:{width:280},children:e.jsxs(f,{children:[e.jsx(i,{box:!0,"aria-invalid":!0,defaultChecked:!0,label:l,description:s}),e.jsx(p,{children:"This setting is required"})]})}),e.jsx("div",{style:{width:280},children:e.jsxs(f,{children:[e.jsx(i,{box:!0,"aria-invalid":!0,align:"end",defaultChecked:!0,label:l,description:s}),e.jsx(p,{children:"This setting is required"})]})})]})]})]})})}};v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
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
}`,...v.parameters?.docs?.source}}};k.parameters={...k.parameters,docs:{...k.parameters?.docs,source:{originalSource:`{
  render: () => <StoryShowcase>
      <StorySection title="Label, description and align">
        <div className="flex gap-20">
          <div className="flex flex-col gap-4" style={{
          width: 280
        }}>
            <StoryLabel>Default size</StoryLabel>
            <SwitchField label={label} description={description} />
            <SwitchField label={label} description={description} defaultChecked />
            <SwitchField label={label} description={description} align="end" />
            <SwitchField label={label} description={description} align="end" defaultChecked />
          </div>
          <div className="flex flex-col gap-4" style={{
          width: 280
        }}>
            <StoryLabel>Small size</StoryLabel>
            <SwitchField size="sm" label={label} description={description} />
            <SwitchField size="sm" label={label} description={description} defaultChecked />
            <SwitchField size="sm" label={label} description={description} align="end" />
            <SwitchField size="sm" label={label} description={description} align="end" defaultChecked />
          </div>
          <div className="flex flex-col gap-4" style={{
          width: 280
        }}>
            <StoryLabel>Label only</StoryLabel>
            <SwitchField label={label} />
            <SwitchField label={label} align="end" />
          </div>
        </div>
      </StorySection>
    </StoryShowcase>
}`,...k.parameters?.docs?.source}}};j.parameters={...j.parameters,docs:{...j.parameters?.docs,source:{originalSource:`{
  render: () => <StoryShowcase>
      <StorySection title="Box">
        <div className="flex gap-20">
          <div className="flex flex-col gap-4" style={{
          width: 280
        }}>
            <StoryLabel>Default size</StoryLabel>
            <SwitchField box label={label} description={description} />
            <SwitchField box label={label} description={description} defaultChecked />
            <SwitchField box align="end" label={label} description={description} />
            <SwitchField box align="end" label={label} description={description} defaultChecked />
          </div>
          <div className="flex flex-col gap-4" style={{
          width: 280
        }}>
            <StoryLabel>Small size</StoryLabel>
            <SwitchField box size="sm" label={label} description={description} />
            <SwitchField box size="sm" label={label} description={description} defaultChecked />
            <SwitchField box size="sm" align="end" label={label} description={description} />
            <SwitchField box size="sm" align="end" label={label} description={description} defaultChecked />
          </div>
        </div>
      </StorySection>
    </StoryShowcase>
}`,...j.parameters?.docs?.source}}};w.parameters={...w.parameters,docs:{...w.parameters?.docs,source:{originalSource:`{
  render: () => <StoryShowcase>
      <StorySection title="Disabled">
        <div className="flex gap-20">
          <div className="flex flex-col gap-4" style={{
          width: 280
        }}>
            <StoryLabel>Default</StoryLabel>
            <SwitchField disabled label={label} description={description} />
            <SwitchField disabled defaultChecked label={label} description={description} />
            <SwitchField disabled align="end" label={label} description={description} />
            <SwitchField disabled align="end" defaultChecked label={label} description={description} />
          </div>
          <div className="flex flex-col gap-4" style={{
          width: 280
        }}>
            <StoryLabel>Box</StoryLabel>
            <SwitchField box disabled label={label} description={description} />
            <SwitchField box disabled defaultChecked label={label} description={description} />
            <SwitchField box disabled align="end" label={label} description={description} />
            <SwitchField box disabled align="end" defaultChecked label={label} description={description} />
          </div>
        </div>
      </StorySection>
    </StoryShowcase>
}`,...w.parameters?.docs?.source}}};y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  render: () => {
    const [checked, setChecked] = useState(false);
    const [fieldChecked, setFieldChecked] = useState(false);
    const [boxChecked, setBoxChecked] = useState(false);
    return <StorySection title="Error">
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

          <div className="flex flex-col gap-3">
            <StoryLabel>Switch field</StoryLabel>
            <div className="flex gap-20">
              <div style={{
              width: 280
            }}>
                <Field>
                  <SwitchField checked={fieldChecked} onCheckedChange={setFieldChecked} aria-invalid={!fieldChecked} label={label} description={description} />
                  {!fieldChecked && <FieldError>This setting is required</FieldError>}
                </Field>
              </div>
              <div style={{
              width: 280
            }}>
                <Field>
                  <SwitchField box checked={boxChecked} onCheckedChange={setBoxChecked} aria-invalid={!boxChecked} label={label} description={description} />
                  {!boxChecked && <FieldError>This setting is required</FieldError>}
                </Field>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <StoryLabel>Switch field on while still in error</StoryLabel>
            <div className="flex gap-20">
              <div style={{
              width: 280
            }}>
                <Field>
                  <SwitchField aria-invalid align="end" defaultChecked label={label} description={description} />
                  <FieldError>This setting is required</FieldError>
                </Field>
              </div>
              <div style={{
              width: 280
            }}>
                <Field>
                  <SwitchField box aria-invalid defaultChecked label={label} description={description} />
                  <FieldError>This setting is required</FieldError>
                </Field>
              </div>
              <div style={{
              width: 280
            }}>
                <Field>
                  <SwitchField box aria-invalid align="end" defaultChecked label={label} description={description} />
                  <FieldError>This setting is required</FieldError>
                </Field>
              </div>
            </div>
          </div>
        </div>
      </StorySection>;
  }
}`,...y.parameters?.docs?.source}}};const ie=["Sizes","WithLabel","Box","Disabled","ErrorState"];export{j as Box,w as Disabled,y as ErrorState,v as Sizes,k as WithLabel,ie as __namedExportsOrder,ee as default};
