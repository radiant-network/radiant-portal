import{j as e,c as h}from"./iframe-DVxP0arQ.js";import{l,a as x,R as m,S as f}from"./sign-in-form-DxWO4rea.js";import{a as c}from"./story-section-BtKKXoKS.js";import"./preload-helper-PPVm8Dsz.js";import"./button-HLKZGIIG.js";import"./action-button-BE9ZLPWr.js";import"./dropdown-menu-Bdlhi6VJ.js";import"./index-U50s1qQV.js";import"./index-CrmWKYFO.js";import"./check-DnDcPfKb.js";import"./circle-hliijJXo.js";import"./separator-Bx5E3IZe.js";import"./i18n-U8mL1TZy.js";import"./index-DXeCl3bV.js";import"./input-CEDgBxMH.js";import"./label-BxVuC17B.js";function t({children:r,logo:i,background:d,className:u,...p}){return e.jsxs("div",{className:h("relative flex min-h-screen w-full flex-col bg-muted",u),...p,children:[d&&e.jsx("div",{className:"absolute inset-0","aria-hidden":"true",children:d}),e.jsxs("div",{className:"relative flex flex-1 flex-col",children:[i&&e.jsx("div",{className:"flex justify-center p-6 md:justify-start md:p-8",children:i}),e.jsx("div",{className:"flex flex-1 items-center justify-center p-6",children:r})]})]})}t.__docgenInfo={description:"",methods:[],displayName:"CenterLayout",props:{children:{required:!0,tsType:{name:"ReactReactNode",raw:"React.ReactNode"},description:""},logo:{required:!1,tsType:{name:"ReactReactNode",raw:"React.ReactNode"},description:""},background:{required:!1,tsType:{name:"ReactReactNode",raw:"React.ReactNode"},description:""}}};const j=e.jsxs(e.Fragment,{children:[e.jsx("img",{src:l,alt:"Logo",className:"dark:hidden"}),e.jsx("img",{src:x,alt:"Logo",className:"hidden dark:block"})]}),g=e.jsx("img",{src:l,alt:"Logo",className:"brightness-0 invert"}),q={title:"Layout/Center layout",component:t},o={args:{logo:j,children:e.jsx("span",{className:"text-muted-foreground",children:"Replace with content"})},render:r=>e.jsx(c,{title:"Default",children:e.jsx(t,{...r})})},a={args:{logo:g,background:e.jsx(m,{}),children:e.jsx("span",{className:"text-muted-foreground",children:"Replace with content"})},render:r=>e.jsx(c,{title:"With background",children:e.jsx(t,{...r})})},n={args:{logo:g,background:e.jsx(m,{}),children:e.jsx(f,{className:"rounded-xl border bg-background p-6"})},render:r=>e.jsx(c,{title:"With sign-in form",children:e.jsx(t,{...r})})},s={args:{children:e.jsx("span",{className:"text-muted-foreground",children:"Replace with content"})},render:r=>e.jsx(c,{title:"Without logo",children:e.jsx(t,{...r})})};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  args: {
    logo,
    children: <span className="text-muted-foreground">Replace with content</span>
  },
  render: args => <StorySection title="Default">
      <CenterLayout {...args} />
    </StorySection>
}`,...o.parameters?.docs?.source}}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  args: {
    logo: logoWhite,
    background: <RadiantBackground />,
    children: <span className="text-muted-foreground">Replace with content</span>
  },
  render: args => <StorySection title="With background">
      <CenterLayout {...args} />
    </StorySection>
}`,...a.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  args: {
    logo: logoWhite,
    background: <RadiantBackground />,
    children: <SignInForm className="rounded-xl border bg-background p-6" />
  },
  render: args => <StorySection title="With sign-in form">
      <CenterLayout {...args} />
    </StorySection>
}`,...n.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    children: <span className="text-muted-foreground">Replace with content</span>
  },
  render: args => <StorySection title="Without logo">
      <CenterLayout {...args} />
    </StorySection>
}`,...s.parameters?.docs?.source}}};const T=["Default","WithBackground","WithSignInForm","WithoutLogo"];export{o as Default,a as WithBackground,n as WithSignInForm,s as WithoutLogo,T as __namedExportsOrder,q as default};
