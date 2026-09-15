import{n as e}from"./rolldown-runtime-C0FnF6B9.js";import{t}from"./react-BRh_h4kc.js";import{t as n}from"./jsx-runtime-BdxMnOeJ.js";import{n as r,t as i}from"./createLucideIcon-BZk7HdX5.js";import{i as a,n as o,t as s}from"./story-section-DVTm6cGm.js";import{a as c,c as l,i as u,n as d,o as f,r as p,s as m,t as h}from"./story-error-field-DeLRAi8K.js";import{n as g,t as _}from"./input-D62ACZk8.js";import{r as v,t as y}from"./utils-DY5BCjP1.js";var b,x;function S(){return(S=e((()=>{r(),b={name:`car`,size:24,node:[[`path`,{d:`M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2`,key:`5owen`}],[`circle`,{cx:`7`,cy:`17`,r:`2`,key:`u2ysq9`}],[`path`,{d:`M9 17h6`,key:`r8uit2`}],[`circle`,{cx:`17`,cy:`17`,r:`2`,key:`axvx0g`}]]},b.node,x=i(b)})))()}function C(){let[e,t]=(0,w.useState)(``),n=e.trim()===``;return(0,T.jsx)(h,{label:`Full name`,invalid:n,children:(0,T.jsx)(_,{size:`sm`,placeholder:`Placeholder`,"aria-invalid":n,value:e,onChange:e=>t(e.target.value)})})}var w,T,E,D,O,k,A;function j(){return(j=e((()=>{w=t(),S(),l(),g(),a(),d(),y(),T=n(),E={title:`Components/Inputs/Input`,component:_,args:{value:`Input value`,onChange:()=>{},placeholder:`Placeholder`}},D={render:()=>(0,T.jsx)(o,{title:`Sizes`,children:v.map(e=>(0,T.jsxs)(`div`,{className:`flex flex-col gap-2`,children:[(0,T.jsx)(s,{children:e}),(0,T.jsxs)(`div`,{className:`flex gap-2`,children:[(0,T.jsx)(_,{size:e,className:`max-w-[300px]`,placeholder:`Placeholder`,autoFocus:!0}),(0,T.jsx)(_,{size:e,value:`loremp ipsum`,className:`max-w-[300px]`,placeholder:`Placeholder`,autoFocus:!0}),(0,T.jsx)(_,{endIcon:x,size:e,className:`max-w-[300px]`,placeholder:`Placeholder`,autoFocus:!0}),(0,T.jsx)(_,{endIcon:x,value:`loremp ipsum`,size:e,className:`max-w-[300px]`,placeholder:`Placeholder`,autoFocus:!0})]})]},e))})},O={render:()=>(0,T.jsx)(o,{title:`Field variants`,children:(0,T.jsxs)(`div`,{className:`flex max-w-[400px] flex-col gap-6`,children:[(0,T.jsxs)(p,{children:[(0,T.jsx)(f,{children:`Basic Input with Label`}),(0,T.jsx)(_,{size:`sm`,placeholder:`Placeholder`})]}),(0,T.jsxs)(p,{children:[(0,T.jsx)(f,{children:`Input with Description`}),(0,T.jsx)(u,{children:`This is a helpful description to guide the user`}),(0,T.jsx)(_,{size:`sm`,placeholder:`Enter your text here`})]}),(0,T.jsxs)(p,{children:[(0,T.jsx)(m,{children:`Input with Title`}),(0,T.jsx)(u,{children:`Titles can be used as an alternative to labels`}),(0,T.jsx)(_,{size:`sm`,placeholder:`Placeholder`})]}),(0,T.jsxs)(p,{children:[(0,T.jsx)(f,{className:`text-destructive`,children:`Input with Error State`}),(0,T.jsx)(u,{children:`This field shows an error message below`}),(0,T.jsx)(_,{size:`sm`,placeholder:`Placeholder`,"aria-invalid":!0}),(0,T.jsx)(c,{children:`This field is required`})]}),(0,T.jsxs)(p,{children:[(0,T.jsx)(f,{className:`text-destructive`,children:`Input with Multiple Errors`}),(0,T.jsx)(_,{size:`sm`,placeholder:`Placeholder`,"aria-invalid":!0}),(0,T.jsx)(c,{errors:[{message:`This field is required`},{message:`Must be at least 3 characters`}]})]}),(0,T.jsxs)(p,{children:[(0,T.jsx)(f,{children:`Complete Field Example`}),(0,T.jsx)(u,{children:`This field demonstrates all available components: Label, Description, Input, and helper text.`}),(0,T.jsx)(_,{size:`sm`,placeholder:`Enter complete information`,endIcon:x}),(0,T.jsx)(u,{className:`text-xs`,children:`Additional helper text can go here`})]})]})})},k={render:()=>(0,T.jsx)(o,{title:`Error`,children:(0,T.jsx)(C,{})})},D.parameters={...D.parameters,docs:{...D.parameters?.docs,source:{originalSource:`{
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
}`,...D.parameters?.docs?.source}}},O.parameters={...O.parameters,docs:{...O.parameters?.docs,source:{originalSource:`{
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
}`,...O.parameters?.docs?.source}}},k.parameters={...k.parameters,docs:{...k.parameters?.docs,source:{originalSource:`{
  render: () => <StorySection title="Error">
      <InputErrorDemo />
    </StorySection>
}`,...k.parameters?.docs?.source}}},A=[`Sizes`,`WithFieldVariant`,`ErrorState`]})))()}j();export{k as ErrorState,D as Sizes,O as WithFieldVariant,A as __namedExportsOrder,E as default};