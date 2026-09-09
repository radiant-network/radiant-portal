import{B as t,j as a,e as l,f as c}from"./iframe-CgZaKe5d.js";import{a as p,b as r}from"./story-section-Cd-IQlgl.js";import{a as i,b as o}from"./utils-C8QHPIem.js";import"./preload-helper-PPVm8Dsz.js";const{fn:d}=__STORYBOOK_MODULE_TEST__,v={title:"Components/Buttons/Button",component:t,argTypes:{size:{options:i,control:{type:"select"}}},args:{onClick:d(),loading:!1,disabled:!1,iconOnly:!1}},s={args:{},render:()=>a.jsxs(p,{title:"Variants",children:[a.jsxs("div",{className:"space-y-2",children:[a.jsx(r,{children:"Text only"}),o.map(e=>a.jsx("div",{className:"flex gap-2",children:i.map(n=>a.jsxs(t,{size:n,variant:e,children:["Button ",n]},n))},e))]}),a.jsx(l,{}),a.jsxs("div",{className:"space-y-2",children:[a.jsx(r,{children:"Icon only"}),o.map(e=>a.jsx("div",{className:"flex gap-2",children:i.map(n=>a.jsx(t,{size:n,variant:e,iconOnly:!0,children:a.jsx(c,{})},n))},e))]}),a.jsx(l,{}),a.jsxs("div",{className:"space-y-2",children:[a.jsx(r,{children:"Icon + text"}),o.map(e=>a.jsx("div",{className:"flex gap-2",children:i.map(n=>a.jsxs(t,{size:n,variant:e,children:[a.jsx(c,{}),"Button ",n]},n))},e))]})]})};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {},
  render: () => <StorySection title="Variants">
      <div className="space-y-2">
        <StoryLabel>Text only</StoryLabel>
        {buttonVariants.map(variant => <div key={variant} className="flex gap-2">
            {buttonSizes.map(size => <Button key={size} size={size} variant={variant}>
                Button {size}
              </Button>)}
          </div>)}
      </div>

      <Separator />

      <div className="space-y-2">
        <StoryLabel>Icon only</StoryLabel>
        {buttonVariants.map(variant => <div key={variant} className="flex gap-2">
            {buttonSizes.map(size => <Button key={size} size={size} variant={variant} iconOnly>
                <Circle />
              </Button>)}
          </div>)}
      </div>

      <Separator />

      <div className="space-y-2">
        <StoryLabel>Icon + text</StoryLabel>
        {buttonVariants.map(variant => <div key={variant} className="flex gap-2">
            {buttonSizes.map(size => <Button key={size} size={size} variant={variant}>
                <Circle />
                Button {size}
              </Button>)}
          </div>)}
      </div>
    </StorySection>
}`,...s.parameters?.docs?.source}}};const S=["Variants"];export{s as Variants,S as __namedExportsOrder,v as default};
