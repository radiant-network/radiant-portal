import{d as x,j as e,r as F}from"./iframe-BzMpq4Hc.js";import{F as i,a as s,b as a,c as j,d as h,S as v}from"./story-error-field-FbozJQY9.js";import{I as l}from"./input-D5Ga5Y8M.js";import{a as n,b as I}from"./story-section-DVNANUlR.js";import{s as b}from"./utils-Be9R-1lk.js";import"./preload-helper-PPVm8Dsz.js";import"./index-B5eiDOej.js";import"./label-CSyXSd-r.js";import"./separator-BoZNDwc5.js";const w=[["path",{d:"M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2",key:"5owen"}],["circle",{cx:"7",cy:"17",r:"2",key:"u2ysq9"}],["path",{d:"M9 17h6",key:"r8uit2"}],["circle",{cx:"17",cy:"17",r:"2",key:"axvx0g"}]],d=x("car",w),T={title:"Components/Inputs/Input",component:l,args:{value:"Input value",onChange:()=>{},placeholder:"Placeholder"}},t={render:()=>e.jsx(n,{title:"Sizes",children:b.map(r=>e.jsxs("div",{className:"flex flex-col gap-2",children:[e.jsx(I,{children:r}),e.jsxs("div",{className:"flex gap-2",children:[e.jsx(l,{size:r,className:"max-w-[300px]",placeholder:"Placeholder",autoFocus:!0}),e.jsx(l,{size:r,value:"loremp ipsum",className:"max-w-[300px]",placeholder:"Placeholder",autoFocus:!0}),e.jsx(l,{endIcon:d,size:r,className:"max-w-[300px]",placeholder:"Placeholder",autoFocus:!0}),e.jsx(l,{endIcon:d,value:"loremp ipsum",size:r,className:"max-w-[300px]",placeholder:"Placeholder",autoFocus:!0})]})]},r))})},o={render:()=>e.jsx(n,{title:"Field variants",children:e.jsxs("div",{className:"flex max-w-[400px] flex-col gap-6",children:[e.jsxs(i,{children:[e.jsx(s,{children:"Basic Input with Label"}),e.jsx(l,{size:"sm",placeholder:"Placeholder"})]}),e.jsxs(i,{children:[e.jsx(s,{children:"Input with Description"}),e.jsx(a,{children:"This is a helpful description to guide the user"}),e.jsx(l,{size:"sm",placeholder:"Enter your text here"})]}),e.jsxs(i,{children:[e.jsx(j,{children:"Input with Title"}),e.jsx(a,{children:"Titles can be used as an alternative to labels"}),e.jsx(l,{size:"sm",placeholder:"Placeholder"})]}),e.jsxs(i,{children:[e.jsx(s,{className:"text-destructive",children:"Input with Error State"}),e.jsx(a,{children:"This field shows an error message below"}),e.jsx(l,{size:"sm",placeholder:"Placeholder","aria-invalid":!0}),e.jsx(h,{children:"This field is required"})]}),e.jsxs(i,{children:[e.jsx(s,{className:"text-destructive",children:"Input with Multiple Errors"}),e.jsx(l,{size:"sm",placeholder:"Placeholder","aria-invalid":!0}),e.jsx(h,{errors:[{message:"This field is required"},{message:"Must be at least 3 characters"}]})]}),e.jsxs(i,{children:[e.jsx(s,{children:"Complete Field Example"}),e.jsx(a,{children:"This field demonstrates all available components: Label, Description, Input, and helper text."}),e.jsx(l,{size:"sm",placeholder:"Enter complete information",endIcon:d}),e.jsx(a,{className:"text-xs",children:"Additional helper text can go here"})]})]})})};function S(){const[r,m]=F.useState(""),p=r.trim()==="";return e.jsx(v,{label:"Full name",invalid:p,children:e.jsx(l,{size:"sm",placeholder:"Placeholder","aria-invalid":p,value:r,onChange:u=>m(u.target.value)})})}const c={render:()=>e.jsx(n,{title:"Error",children:e.jsx(S,{})})};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  render: () => <StorySection title="Sizes">
      {sizes.map(size => <div key={size} className="flex flex-col gap-2">
          <StoryLabel>{size}</StoryLabel>
          <div className="flex gap-2">
            <Input size={size} className="max-w-[300px]" placeholder="Placeholder" autoFocus />
            <Input size={size} value="loremp ipsum" className="max-w-[300px]" placeholder="Placeholder" autoFocus />
            <Input endIcon={Car} size={size} className="max-w-[300px]" placeholder="Placeholder" autoFocus />
            <Input endIcon={Car} value="loremp ipsum" size={size} className="max-w-[300px]" placeholder="Placeholder" autoFocus />
          </div>
        </div>)}
    </StorySection>
}`,...t.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  render: () => <StorySection title="Field variants">
      <div className="flex max-w-[400px] flex-col gap-6">
        {/* Basic Field with Label */}
        <Field>
          <FieldLabel>Basic Input with Label</FieldLabel>
          <Input size="sm" placeholder="Placeholder" />
        </Field>

        {/* Field with Label and Description */}
        <Field>
          <FieldLabel>Input with Description</FieldLabel>
          <FieldDescription>This is a helpful description to guide the user</FieldDescription>
          <Input size="sm" placeholder="Enter your text here" />
        </Field>

        {/* Field with Title (alternative to Label) */}
        <Field>
          <FieldTitle>Input with Title</FieldTitle>
          <FieldDescription>Titles can be used as an alternative to labels</FieldDescription>
          <Input size="sm" placeholder="Placeholder" />
        </Field>

        {/* Field with Label, Description and Error */}
        <Field>
          <FieldLabel className="text-destructive">Input with Error State</FieldLabel>
          <FieldDescription>This field shows an error message below</FieldDescription>
          <Input size="sm" placeholder="Placeholder" aria-invalid />
          <FieldError>This field is required</FieldError>
        </Field>

        {/* Field with multiple errors */}
        <Field>
          <FieldLabel className="text-destructive">Input with Multiple Errors</FieldLabel>
          <Input size="sm" placeholder="Placeholder" aria-invalid />
          <FieldError errors={[{
          message: 'This field is required'
        }, {
          message: 'Must be at least 3 characters'
        }]} />
        </Field>

        {/* Complete Field with all elements */}
        <Field>
          <FieldLabel>Complete Field Example</FieldLabel>
          <FieldDescription>
            This field demonstrates all available components: Label, Description, Input, and helper text.
          </FieldDescription>
          <Input size="sm" placeholder="Enter complete information" endIcon={Car} />
          <FieldDescription className="text-xs">Additional helper text can go here</FieldDescription>
        </Field>
      </div>
    </StorySection>
}`,...o.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  render: () => <StorySection title="Error">
      <InputErrorDemo />
    </StorySection>
}`,...c.parameters?.docs?.source}}};const C=["Sizes","WithFieldVariant","ErrorState"];export{c as ErrorState,t as Sizes,o as WithFieldVariant,C as __namedExportsOrder,T as default};
