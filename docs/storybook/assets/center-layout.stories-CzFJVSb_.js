import{j as e}from"./iframe-DDMqSXul.js";import{l,a as m,S as h}from"./sign-in-form-D0gCTSRD.js";import{l as p}from"./header-full-white-BYvDCc_r.js";import{C as r}from"./center-layout-CxL2kY3o.js";import{N as c,R as d}from"./main-navbar-lang-switcher-CgOjp1XZ.js";import{a as i}from"./story-section-29Pt7KkT.js";import"./preload-helper-PPVm8Dsz.js";import"./button-C-NfkkWm.js";import"./action-button-WewT5ZPN.js";import"./dropdown-menu-DIoiAg_I.js";import"./index-BwmN7QES.js";import"./index-BwIDj-Vk.js";import"./check-Dl2pt11_.js";import"./circle-CRiw5vp4.js";import"./separator-Cc_T2enW.js";import"./i18n-C88g_mn6.js";import"./index-Ch5te5Xr.js";import"./input-f8DQactQ.js";import"./label-Dz3Q6mWi.js";const u=e.jsxs(e.Fragment,{children:[e.jsx("img",{src:l,alt:"Logo",className:"dark:hidden"}),e.jsx("img",{src:m,alt:"Logo",className:"hidden dark:block"})]}),g=e.jsx("img",{src:p,alt:"Logo"}),E={title:"Layout/Center layout",component:r},o={args:{logo:u,langSwitcher:e.jsx(c,{}),children:e.jsx("span",{className:"text-muted-foreground",children:"Replace with content"})},render:t=>e.jsx(i,{title:"Default",children:e.jsx(r,{...t})})},n={args:{logo:g,langSwitcher:e.jsx(c,{className:"text-white hover:bg-white/10 hover:text-white"}),background:e.jsx(d,{}),children:e.jsx("span",{className:"text-muted-foreground",children:"Replace with content"})},render:t=>e.jsx(i,{title:"With background",children:e.jsx(r,{...t})})},a={args:{logo:g,langSwitcher:e.jsx(c,{className:"text-white hover:bg-white/10 hover:text-white"}),background:e.jsx(d,{}),children:e.jsx(h,{className:"rounded-xl border bg-background p-6"})},render:t=>e.jsx(i,{title:"With sign-in form",description:"Sign in form is mocked without translation.",children:e.jsx(r,{...t})})},s={args:{children:e.jsx("span",{className:"text-muted-foreground",children:"Replace with content"})},render:t=>e.jsx(i,{title:"Without logo and switcher",children:e.jsx(r,{...t})})};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
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
}`,...s.parameters?.docs?.source}}};const _=["Default","WithBackground","WithSignInForm","WithoutLogoAndSwitcher"];export{o as Default,n as WithBackground,a as WithSignInForm,s as WithoutLogoAndSwitcher,_ as __namedExportsOrder,E as default};
