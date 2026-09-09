import{bt as r,j as e,bu as c,bv as d,bw as l}from"./iframe-CEIjD8md.js";import{l as h,a as m,S as u}from"./sign-in-form-BBarzVMh.js";import{a as i}from"./story-section-akNb6BHm.js";import"./preload-helper-PPVm8Dsz.js";import"./input-D5oIp6d4.js";import"./label-B7YzvmnB.js";const p=e.jsxs(e.Fragment,{children:[e.jsx("img",{src:h,alt:"Logo",className:"dark:hidden"}),e.jsx("img",{src:m,alt:"Logo",className:"hidden dark:block"})]}),g=e.jsx("img",{src:l,alt:"Logo"}),f={title:"Layout/Center layout",component:r},o={args:{logo:p,langSwitcher:e.jsx(c,{}),children:e.jsx("span",{className:"text-muted-foreground",children:"Replace with content"})},render:t=>e.jsx(i,{title:"Default",children:e.jsx(r,{...t})})},n={args:{logo:g,langSwitcher:e.jsx(c,{className:"text-white hover:bg-white/10 hover:text-white"}),background:e.jsx(d,{}),children:e.jsx("span",{className:"text-muted-foreground",children:"Replace with content"})},render:t=>e.jsx(i,{title:"With background",children:e.jsx(r,{...t})})},a={args:{logo:g,langSwitcher:e.jsx(c,{className:"text-white hover:bg-white/10 hover:text-white"}),background:e.jsx(d,{}),children:e.jsx(u,{className:"rounded-xl border bg-background p-6"})},render:t=>e.jsx(i,{title:"With sign-in form",description:"Sign in form is mocked without translation.",children:e.jsx(r,{...t})})},s={args:{children:e.jsx("span",{className:"text-muted-foreground",children:"Replace with content"})},render:t=>e.jsx(i,{title:"Without logo and switcher",children:e.jsx(r,{...t})})};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  args: {
    logo,
    langSwitcher: <NavbarLangSwitcher />,
    children: <span className="text-muted-foreground">Replace with content</span>
  },
  render: args => <StorySection title="Default">
      <CenterLayout {...args} />
    </StorySection>
}`,...o.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  args: {
    logo: logoWhite,
    langSwitcher: <NavbarLangSwitcher className="text-white hover:bg-white/10 hover:text-white" />,
    background: <RadiantBackground />,
    children: <span className="text-muted-foreground">Replace with content</span>
  },
  render: args => <StorySection title="With background">
      <CenterLayout {...args} />
    </StorySection>
}`,...n.parameters?.docs?.source}}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  args: {
    logo: logoWhite,
    langSwitcher: <NavbarLangSwitcher className="text-white hover:bg-white/10 hover:text-white" />,
    background: <RadiantBackground />,
    children: <SignInForm className="rounded-xl border bg-background p-6" />
  },
  render: args => <StorySection title="With sign-in form" description="Sign in form is mocked without translation.">
      <CenterLayout {...args} />
    </StorySection>
}`,...a.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    children: <span className="text-muted-foreground">Replace with content</span>
  },
  render: args => <StorySection title="Without logo and switcher">
      <CenterLayout {...args} />
    </StorySection>
}`,...s.parameters?.docs?.source}}};const N=["Default","WithBackground","WithSignInForm","WithoutLogoAndSwitcher"];export{o as Default,n as WithBackground,a as WithSignInForm,s as WithoutLogoAndSwitcher,N as __namedExportsOrder,f as default};
