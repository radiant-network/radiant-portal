import{n as e}from"./rolldown-runtime-C0FnF6B9.js";import{t}from"./react-BRh_h4kc.js";import{t as n}from"./jsx-runtime-BdxMnOeJ.js";import{n as r,t as i}from"./utils-hYbUpBR2.js";import{i as a,n as o,r as s,t as c}from"./main-navbar-lang-switcher-BdeM0Fap.js";import{i as l,n as u}from"./story-section-DVTm6cGm.js";import{a as d,i as f,n as p,o as m,r as h,t as g}from"./sign-in-form-QIdMh4Ke.js";function _({children:e,logo:t,langSwitcher:n,background:r,className:a,...o}){return(0,v.jsxs)(`div`,{className:i(`flex min-h-screen w-full`,a),...o,children:[(0,v.jsxs)(`div`,{className:`relative flex flex-1 flex-col bg-muted`,children:[(t||n)&&(0,v.jsxs)(`div`,{className:`grid grid-cols-[1fr_auto_1fr] items-center p-6 md:flex md:justify-between md:p-8`,children:[(0,v.jsx)(`div`,{className:`md:hidden`,"aria-hidden":`true`}),(0,v.jsx)(`div`,{children:t}),(0,v.jsx)(`div`,{className:`justify-self-end`,children:n})]}),(0,v.jsx)(`div`,{className:`flex flex-1 items-center justify-center p-6`,children:e})]}),(0,v.jsx)(`div`,{className:`hidden flex-1 md:block`,"aria-hidden":`true`,children:r??(0,v.jsx)(s,{})})]})}var v;function y(){return(y=e((()=>{t(),r(),a(),v=n(),_.__docgenInfo={description:``,methods:[],displayName:`SplitLayout`,props:{children:{required:!0,tsType:{name:`ReactReactNode`,raw:`React.ReactNode`},description:``},logo:{required:!1,tsType:{name:`ReactReactNode`,raw:`React.ReactNode`},description:``},langSwitcher:{required:!1,tsType:{name:`ReactReactNode`,raw:`React.ReactNode`},description:``},background:{required:!1,tsType:{name:`ReactReactNode`,raw:`React.ReactNode`},description:``}}}})))()}var b;function x(){return(x=e((()=>{b=new URL(`layoutPicture-C9fPb6vL.jpeg`,import.meta.url).href})))()}var S,C,w,T,E,D,O,k;function A(){return(A=e((()=>{m(),f(),y(),o(),l(),x(),p(),S=n(),C=(0,S.jsxs)(S.Fragment,{children:[(0,S.jsx)(`img`,{src:d,alt:`Logo`,className:`dark:hidden`}),(0,S.jsx)(`img`,{src:h,alt:`Logo`,className:`hidden dark:block`})]}),w={title:`Layout/Split layout`,component:_},T={args:{logo:C,langSwitcher:(0,S.jsx)(c,{}),children:(0,S.jsx)(`span`,{className:`text-muted-foreground`,children:`Replace with content`})},render:e=>(0,S.jsx)(u,{title:`Default`,children:(0,S.jsx)(_,{...e})})},E={args:{logo:C,langSwitcher:(0,S.jsx)(c,{}),background:(0,S.jsx)(`img`,{src:b,alt:``,className:`size-full object-cover`}),children:(0,S.jsx)(`span`,{className:`text-muted-foreground`,children:`Replace with content`})},render:e=>(0,S.jsx)(u,{title:`With custom image`,children:(0,S.jsx)(_,{...e})})},D={args:{logo:C,langSwitcher:(0,S.jsx)(c,{}),children:(0,S.jsx)(g,{})},render:e=>(0,S.jsx)(u,{title:`With sign-in form`,description:`Sign in form is mocked without translation.`,children:(0,S.jsx)(_,{...e})})},O={args:{children:(0,S.jsx)(`span`,{className:`text-muted-foreground`,children:`Replace with content`})},render:e=>(0,S.jsx)(u,{title:`Without logo and switcher`,children:(0,S.jsx)(_,{...e})})},T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`{
  args: {
    logo,
    langSwitcher: <NavbarLangSwitcher />,
    children: <span className="text-muted-foreground">Replace with content</span>
  },
  render: args => <StorySection title="Default">
      <SplitLayout {...args} />
    </StorySection>
}`,...T.parameters?.docs?.source}}},E.parameters={...E.parameters,docs:{...E.parameters?.docs,source:{originalSource:`{
  args: {
    logo,
    langSwitcher: <NavbarLangSwitcher />,
    background: <img src={layoutPicture} alt="" className="size-full object-cover" />,
    children: <span className="text-muted-foreground">Replace with content</span>
  },
  render: args => <StorySection title="With custom image">
      <SplitLayout {...args} />
    </StorySection>
}`,...E.parameters?.docs?.source}}},D.parameters={...D.parameters,docs:{...D.parameters?.docs,source:{originalSource:`{
  args: {
    logo,
    langSwitcher: <NavbarLangSwitcher />,
    children: <SignInForm />
  },
  render: args => <StorySection title="With sign-in form" description="Sign in form is mocked without translation.">
      <SplitLayout {...args} />
    </StorySection>
}`,...D.parameters?.docs?.source}}},O.parameters={...O.parameters,docs:{...O.parameters?.docs,source:{originalSource:`{
  args: {
    children: <span className="text-muted-foreground">Replace with content</span>
  },
  render: args => <StorySection title="Without logo and switcher">
      <SplitLayout {...args} />
    </StorySection>
}`,...O.parameters?.docs?.source}}},k=[`Default`,`WithCustomImage`,`WithSignInForm`,`WithoutLogoAndSwitcher`]})))()}A();export{T as Default,E as WithCustomImage,D as WithSignInForm,O as WithoutLogoAndSwitcher,k as __namedExportsOrder,w as default};