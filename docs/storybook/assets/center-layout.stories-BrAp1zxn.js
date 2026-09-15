import{n as e}from"./rolldown-runtime-C0FnF6B9.js";import{t}from"./jsx-runtime-BdxMnOeJ.js";import{i as n,n as r,r as i,t as a}from"./main-navbar-lang-switcher-BdeM0Fap.js";import{n as o,t as s}from"./header-full-white-CC8v0Ozx.js";import{n as c,t as l}from"./center-layout-CIMc7AX0.js";import{i as u,n as d}from"./story-section-DVTm6cGm.js";import{a as f,i as p,n as m,o as h,r as g,t as _}from"./sign-in-form-QIdMh4Ke.js";var v,y,b,x,S,C,w,T,E;function D(){return(D=e((()=>{h(),p(),o(),c(),n(),r(),u(),m(),v=t(),y=(0,v.jsxs)(v.Fragment,{children:[(0,v.jsx)(`img`,{src:f,alt:`Logo`,className:`dark:hidden`}),(0,v.jsx)(`img`,{src:g,alt:`Logo`,className:`hidden dark:block`})]}),b=(0,v.jsx)(`img`,{src:s,alt:`Logo`}),x={title:`Layout/Center layout`,component:l},S={args:{logo:y,langSwitcher:(0,v.jsx)(a,{}),children:(0,v.jsx)(`span`,{className:`text-muted-foreground`,children:`Replace with content`})},render:e=>(0,v.jsx)(d,{title:`Default`,children:(0,v.jsx)(l,{...e})})},C={args:{logo:b,langSwitcher:(0,v.jsx)(a,{className:`text-white hover:bg-white/10 hover:text-white`}),background:(0,v.jsx)(i,{}),children:(0,v.jsx)(`span`,{className:`text-muted-foreground`,children:`Replace with content`})},render:e=>(0,v.jsx)(d,{title:`With background`,children:(0,v.jsx)(l,{...e})})},w={args:{logo:b,langSwitcher:(0,v.jsx)(a,{className:`text-white hover:bg-white/10 hover:text-white`}),background:(0,v.jsx)(i,{}),children:(0,v.jsx)(_,{className:`rounded-xl border bg-background p-6`})},render:e=>(0,v.jsx)(d,{title:`With sign-in form`,description:`Sign in form is mocked without translation.`,children:(0,v.jsx)(l,{...e})})},T={args:{children:(0,v.jsx)(`span`,{className:`text-muted-foreground`,children:`Replace with content`})},render:e=>(0,v.jsx)(d,{title:`Without logo and switcher`,children:(0,v.jsx)(l,{...e})})},S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`{
  args: {
    logo,
    langSwitcher: <NavbarLangSwitcher />,
    children: <span className="text-muted-foreground">Replace with content</span>
  },
  render: args => <StorySection title="Default">
      <CenterLayout {...args} />
    </StorySection>
}`,...S.parameters?.docs?.source}}},C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`{
  args: {
    logo: logoWhite,
    langSwitcher: <NavbarLangSwitcher className="text-white hover:bg-white/10 hover:text-white" />,
    background: <RadiantBackground />,
    children: <span className="text-muted-foreground">Replace with content</span>
  },
  render: args => <StorySection title="With background">
      <CenterLayout {...args} />
    </StorySection>
}`,...C.parameters?.docs?.source}}},w.parameters={...w.parameters,docs:{...w.parameters?.docs,source:{originalSource:`{
  args: {
    logo: logoWhite,
    langSwitcher: <NavbarLangSwitcher className="text-white hover:bg-white/10 hover:text-white" />,
    background: <RadiantBackground />,
    children: <SignInForm className="rounded-xl border bg-background p-6" />
  },
  render: args => <StorySection title="With sign-in form" description="Sign in form is mocked without translation.">
      <CenterLayout {...args} />
    </StorySection>
}`,...w.parameters?.docs?.source}}},T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`{
  args: {
    children: <span className="text-muted-foreground">Replace with content</span>
  },
  render: args => <StorySection title="Without logo and switcher">
      <CenterLayout {...args} />
    </StorySection>
}`,...T.parameters?.docs?.source}}},E=[`Default`,`WithBackground`,`WithSignInForm`,`WithoutLogoAndSwitcher`]})))()}D();export{S as Default,C as WithBackground,w as WithSignInForm,T as WithoutLogoAndSwitcher,E as __namedExportsOrder,x as default};