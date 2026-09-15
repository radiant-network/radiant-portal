import{n as e}from"./rolldown-runtime-C0FnF6B9.js";import{t}from"./react-BRh_h4kc.js";import{t as n}from"./jsx-runtime-BdxMnOeJ.js";import{n as r,t as i}from"./switch-CdkVHDMl.js";import{n as a,t as o}from"./utils-hYbUpBR2.js";import{n as s,t as c}from"./dist-BxNp_DKL.js";import{i as l,n as u,r as d,t as f}from"./story-section-DVTm6cGm.js";import{a as p,c as m,n as h,r as g,t as _}from"./story-error-field-DeLRAi8K.js";function v({size:e=`default`,align:t=`start`,className:n,label:r,description:a,box:s,id:c,checked:l,defaultChecked:u,disabled:d,onCheckedChange:f,"aria-invalid":p,...m}){let h=x({size:e,align:t,invalid:p===!0||p===`true`}),g=(0,y.useId)(),[_,v]=(0,y.useState)(u??!1),S=c??g,C=`${S}-label`,w=`${S}-description`,T=l!==void 0,E=T?l:_;return(0,b.jsx)(`div`,{"data-slot":`switch-field`,"data-state":E?`checked`:`unchecked`,"data-disabled":d||void 0,className:o(h.base(),s&&h.box(),s&&E&&h.boxChecked(),d&&h.disabled(),n),children:(0,b.jsxs)(`div`,{className:o(h.container(),s&&`p-2.5`),children:[(0,b.jsx)(i,{id:S,size:e,checked:E,disabled:d,"aria-invalid":p,"aria-labelledby":r?C:void 0,"aria-describedby":a?w:void 0,className:o(d?h.switchDisabled():`cursor-pointer`),onCheckedChange:e=>{T||v(e),f?.(e)},...m}),(r||a)&&(0,b.jsxs)(`label`,{htmlFor:S,className:o(h.label(),d&&`cursor-not-allowed`),children:[r&&(0,b.jsx)(`span`,{id:C,className:h.title(),children:r}),a&&(0,b.jsx)(`span`,{id:w,className:h.description(),children:a})]})]})})}var y,b,x;function S(){return(S=e((()=>{y=t(),c(),r(),a(),b=n(),x=s({slots:{base:`w-full`,disabled:`opacity-50 cursor-not-allowed`,box:`border rounded-md border-input`,boxChecked:`border-primary bg-accent`,switchDisabled:`disabled:opacity-100`,container:`flex`,label:`flex flex-1 flex-col gap-1.5 cursor-pointer`,title:`text-sm font-medium text-foreground`,description:`text-sm text-muted-foreground font-normal`},variants:{size:{default:{container:`gap-2`},sm:{container:`gap-3`,title:`leading-none`}},align:{start:{container:`items-start`},end:{container:`items-start flex-row-reverse`}},invalid:{true:{title:`text-destructive`,boxChecked:`border-destructive bg-alert-error/20`}}},defaultVariants:{size:`default`,align:`start`}}),v.__docgenInfo={description:`A single switch with display option (box, disable, align, ...)`,methods:[],displayName:`SwitchField`,props:{label:{required:!1,tsType:{name:`ReactReactNode`,raw:`React.ReactNode`},description:``},description:{required:!1,tsType:{name:`ReactReactNode`,raw:`React.ReactNode`},description:``},box:{required:!1,tsType:{name:`boolean`},description:``},size:{defaultValue:{value:`'default'`,computed:!1},required:!1},align:{defaultValue:{value:`'start'`,computed:!1},required:!1}}}})))()}var C,w,T,E,D,O,k,A,j,M,N;function P(){return(P=e((()=>{C=t(),m(),r(),S(),l(),h(),w=n(),T={title:`Components/Inputs/Switch`,args:{size:`default`,checked:!1,onCheckedChange:()=>{}},component:i},E=`Switch Text`,D=`This is a switch description.`,O={render:()=>{let[e,t]=(0,C.useState)(!1),[n,r]=(0,C.useState)(!1);return(0,w.jsxs)(u,{title:`Sizes`,children:[(0,w.jsxs)(`div`,{className:`flex items-center gap-2`,children:[(0,w.jsx)(f,{children:`Default`}),(0,w.jsx)(i,{size:`default`,checked:e,onCheckedChange:t})]}),(0,w.jsxs)(`div`,{className:`flex items-center gap-2`,children:[(0,w.jsx)(f,{children:`Small`}),(0,w.jsx)(i,{size:`sm`,checked:n,onCheckedChange:r})]})]})}},k={render:()=>(0,w.jsx)(d,{children:(0,w.jsx)(u,{title:`Label, description and align`,children:(0,w.jsxs)(`div`,{className:`flex gap-20`,children:[(0,w.jsxs)(`div`,{className:`flex flex-col gap-4`,style:{width:280},children:[(0,w.jsx)(f,{children:`Default size`}),(0,w.jsx)(v,{label:E,description:D}),(0,w.jsx)(v,{label:E,description:D,defaultChecked:!0}),(0,w.jsx)(v,{label:E,description:D,align:`end`}),(0,w.jsx)(v,{label:E,description:D,align:`end`,defaultChecked:!0})]}),(0,w.jsxs)(`div`,{className:`flex flex-col gap-4`,style:{width:280},children:[(0,w.jsx)(f,{children:`Small size`}),(0,w.jsx)(v,{size:`sm`,label:E,description:D}),(0,w.jsx)(v,{size:`sm`,label:E,description:D,defaultChecked:!0}),(0,w.jsx)(v,{size:`sm`,label:E,description:D,align:`end`}),(0,w.jsx)(v,{size:`sm`,label:E,description:D,align:`end`,defaultChecked:!0})]}),(0,w.jsxs)(`div`,{className:`flex flex-col gap-4`,style:{width:280},children:[(0,w.jsx)(f,{children:`Label only`}),(0,w.jsx)(v,{label:E}),(0,w.jsx)(v,{label:E,align:`end`})]})]})})})},A={render:()=>(0,w.jsx)(d,{children:(0,w.jsx)(u,{title:`Box`,children:(0,w.jsxs)(`div`,{className:`flex gap-20`,children:[(0,w.jsxs)(`div`,{className:`flex flex-col gap-4`,style:{width:280},children:[(0,w.jsx)(f,{children:`Default size`}),(0,w.jsx)(v,{box:!0,label:E,description:D}),(0,w.jsx)(v,{box:!0,label:E,description:D,defaultChecked:!0}),(0,w.jsx)(v,{box:!0,align:`end`,label:E,description:D}),(0,w.jsx)(v,{box:!0,align:`end`,label:E,description:D,defaultChecked:!0})]}),(0,w.jsxs)(`div`,{className:`flex flex-col gap-4`,style:{width:280},children:[(0,w.jsx)(f,{children:`Small size`}),(0,w.jsx)(v,{box:!0,size:`sm`,label:E,description:D}),(0,w.jsx)(v,{box:!0,size:`sm`,label:E,description:D,defaultChecked:!0}),(0,w.jsx)(v,{box:!0,size:`sm`,align:`end`,label:E,description:D}),(0,w.jsx)(v,{box:!0,size:`sm`,align:`end`,label:E,description:D,defaultChecked:!0})]})]})})})},j={render:()=>(0,w.jsx)(d,{children:(0,w.jsx)(u,{title:`Disabled`,children:(0,w.jsxs)(`div`,{className:`flex gap-20`,children:[(0,w.jsxs)(`div`,{className:`flex flex-col gap-4`,style:{width:280},children:[(0,w.jsx)(f,{children:`Default`}),(0,w.jsx)(v,{disabled:!0,label:E,description:D}),(0,w.jsx)(v,{disabled:!0,defaultChecked:!0,label:E,description:D}),(0,w.jsx)(v,{disabled:!0,align:`end`,label:E,description:D}),(0,w.jsx)(v,{disabled:!0,align:`end`,defaultChecked:!0,label:E,description:D})]}),(0,w.jsxs)(`div`,{className:`flex flex-col gap-4`,style:{width:280},children:[(0,w.jsx)(f,{children:`Box`}),(0,w.jsx)(v,{box:!0,disabled:!0,label:E,description:D}),(0,w.jsx)(v,{box:!0,disabled:!0,defaultChecked:!0,label:E,description:D}),(0,w.jsx)(v,{box:!0,disabled:!0,align:`end`,label:E,description:D}),(0,w.jsx)(v,{box:!0,disabled:!0,align:`end`,defaultChecked:!0,label:E,description:D})]})]})})})},M={render:()=>{let[e,t]=(0,C.useState)(!1),[n,r]=(0,C.useState)(!1),[a,o]=(0,C.useState)(!1);return(0,w.jsx)(u,{title:`Error`,children:(0,w.jsxs)(`div`,{className:`flex flex-col gap-8`,children:[(0,w.jsxs)(`div`,{className:`flex flex-col gap-3`,children:[(0,w.jsx)(f,{children:`Off — the error clears once the switch is turned on, and comes back when it is turned off`}),(0,w.jsx)(_,{label:`Enable notifications`,error:`This setting is required`,layout:`inline`,invalid:!e,children:(0,w.jsx)(i,{checked:e,onCheckedChange:t,"aria-invalid":!e})})]}),(0,w.jsxs)(`div`,{className:`flex flex-col gap-3`,children:[(0,w.jsx)(f,{children:`On while still in error`}),(0,w.jsx)(_,{label:`Enable notifications`,error:`This setting is required`,layout:`inline`,children:(0,w.jsx)(i,{defaultChecked:!0,"aria-invalid":!0})})]}),(0,w.jsxs)(`div`,{className:`flex flex-col gap-3`,children:[(0,w.jsx)(f,{children:`Switch field`}),(0,w.jsxs)(`div`,{className:`flex gap-20`,children:[(0,w.jsx)(`div`,{style:{width:280},children:(0,w.jsxs)(g,{children:[(0,w.jsx)(v,{checked:n,onCheckedChange:r,"aria-invalid":!n,label:E,description:D}),!n&&(0,w.jsx)(p,{children:`This setting is required`})]})}),(0,w.jsx)(`div`,{style:{width:280},children:(0,w.jsxs)(g,{children:[(0,w.jsx)(v,{box:!0,checked:a,onCheckedChange:o,"aria-invalid":!a,label:E,description:D}),!a&&(0,w.jsx)(p,{children:`This setting is required`})]})})]})]}),(0,w.jsxs)(`div`,{className:`flex flex-col gap-3`,children:[(0,w.jsx)(f,{children:`Switch field on while still in error`}),(0,w.jsxs)(`div`,{className:`flex gap-20`,children:[(0,w.jsx)(`div`,{style:{width:280},children:(0,w.jsxs)(g,{children:[(0,w.jsx)(v,{"aria-invalid":!0,align:`end`,defaultChecked:!0,label:E,description:D}),(0,w.jsx)(p,{children:`This setting is required`})]})}),(0,w.jsx)(`div`,{style:{width:280},children:(0,w.jsxs)(g,{children:[(0,w.jsx)(v,{box:!0,"aria-invalid":!0,defaultChecked:!0,label:E,description:D}),(0,w.jsx)(p,{children:`This setting is required`})]})}),(0,w.jsx)(`div`,{style:{width:280},children:(0,w.jsxs)(g,{children:[(0,w.jsx)(v,{box:!0,"aria-invalid":!0,align:`end`,defaultChecked:!0,label:E,description:D}),(0,w.jsx)(p,{children:`This setting is required`})]})})]})]})]})})}},O.parameters={...O.parameters,docs:{...O.parameters?.docs,source:{originalSource:`{
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
}`,...O.parameters?.docs?.source}}},k.parameters={...k.parameters,docs:{...k.parameters?.docs,source:{originalSource:`{
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
}`,...k.parameters?.docs?.source}}},A.parameters={...A.parameters,docs:{...A.parameters?.docs,source:{originalSource:`{
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
}`,...A.parameters?.docs?.source}}},j.parameters={...j.parameters,docs:{...j.parameters?.docs,source:{originalSource:`{
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
}`,...j.parameters?.docs?.source}}},M.parameters={...M.parameters,docs:{...M.parameters?.docs,source:{originalSource:`{
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
}`,...M.parameters?.docs?.source}}},N=[`Sizes`,`WithLabel`,`Box`,`Disabled`,`ErrorState`]})))()}P();export{A as Box,j as Disabled,M as ErrorState,O as Sizes,k as WithLabel,N as __namedExportsOrder,T as default};