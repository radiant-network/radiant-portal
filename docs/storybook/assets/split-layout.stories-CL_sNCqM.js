import{j as e,c as h}from"./iframe-BZB1EZgz.js";import{l as S,a as x,S as f}from"./sign-in-form-B72X8DuN.js";import{R as j,N as c}from"./main-navbar-lang-switcher-BG69NrFp.js";import{a as i}from"./story-section-BDrkXYOE.js";import"./preload-helper-PPVm8Dsz.js";import"./button-D8HFhMXd.js";import"./action-button-DqxIOjdS.js";import"./dropdown-menu-C1MQh_QQ.js";import"./index-CA8vCrAG.js";import"./index-DjZJgZTe.js";import"./check-HFbzKaow.js";import"./circle-Dh8DU7_a.js";import"./separator-CcqX_m5t.js";import"./i18n-CQ0WOrKs.js";import"./index-B0w-Ttvh.js";import"./input-n9l0LaJt.js";import"./label-Fj5P-8Ic.js";function r({children:t,logo:l,langSwitcher:m,background:p,className:u,...g}){return e.jsxs("div",{className:h("flex min-h-screen w-full",u),...g,children:[e.jsxs("div",{className:"relative flex flex-1 flex-col bg-muted",children:[(l||m)&&e.jsxs("div",{className:"grid grid-cols-[1fr_auto_1fr] items-center p-6 md:flex md:justify-between md:p-8",children:[e.jsx("div",{className:"md:hidden","aria-hidden":"true"}),e.jsx("div",{children:l}),e.jsx("div",{className:"justify-self-end",children:m})]}),e.jsx("div",{className:"flex flex-1 items-center justify-center p-6",children:t})]}),e.jsx("div",{className:"hidden flex-1 md:block","aria-hidden":"true",children:p??e.jsx(j,{})})]})}r.__docgenInfo={description:"",methods:[],displayName:"SplitLayout",props:{children:{required:!0,tsType:{name:"ReactReactNode",raw:"React.ReactNode"},description:""},logo:{required:!1,tsType:{name:"ReactReactNode",raw:"React.ReactNode"},description:""},langSwitcher:{required:!1,tsType:{name:"ReactReactNode",raw:"React.ReactNode"},description:""},background:{required:!1,tsType:{name:"ReactReactNode",raw:"React.ReactNode"},description:""}}};const N=""+new URL("layoutPicture-C9fPb6vL.jpeg",import.meta.url).href,d=e.jsxs(e.Fragment,{children:[e.jsx("img",{src:S,alt:"Logo",className:"dark:hidden"}),e.jsx("img",{src:x,alt:"Logo",className:"hidden dark:block"})]}),A={title:"Layout/Split layout",component:r},a={args:{logo:d,langSwitcher:e.jsx(c,{}),children:e.jsx("span",{className:"text-muted-foreground",children:"Replace with content"})},render:t=>e.jsx(i,{title:"Default",children:e.jsx(r,{...t})})},s={args:{logo:d,langSwitcher:e.jsx(c,{}),background:e.jsx("img",{src:N,alt:"",className:"size-full object-cover"}),children:e.jsx("span",{className:"text-muted-foreground",children:"Replace with content"})},render:t=>e.jsx(i,{title:"With custom image",children:e.jsx(r,{...t})})},n={args:{logo:d,langSwitcher:e.jsx(c,{}),children:e.jsx(f,{})},render:t=>e.jsx(i,{title:"With sign-in form",description:"Sign in form is mocked without translation.",children:e.jsx(r,{...t})})},o={args:{children:e.jsx("span",{className:"text-muted-foreground",children:"Replace with content"})},render:t=>e.jsx(i,{title:"Without logo and switcher",children:e.jsx(r,{...t})})};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  args: {
    logo,
    langSwitcher: <NavbarLangSwitcher />,
    children: <span className="text-muted-foreground">Replace with content</span>
  },
  render: args => <StorySection title="Default">
      <SplitLayout {...args} />
    </StorySection>
}`,...a.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    logo,
    langSwitcher: <NavbarLangSwitcher />,
    background: <img src={layoutPicture} alt="" className="size-full object-cover" />,
    children: <span className="text-muted-foreground">Replace with content</span>
  },
  render: args => <StorySection title="With custom image">
      <SplitLayout {...args} />
    </StorySection>
}`,...s.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  args: {
    logo,
    langSwitcher: <NavbarLangSwitcher />,
    children: <SignInForm />
  },
  render: args => <StorySection title="With sign-in form" description="Sign in form is mocked without translation.">
      <SplitLayout {...args} />
    </StorySection>
}`,...n.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  args: {
    children: <span className="text-muted-foreground">Replace with content</span>
  },
  render: args => <StorySection title="Without logo and switcher">
      <SplitLayout {...args} />
    </StorySection>
}`,...o.parameters?.docs?.source}}};const E=["Default","WithCustomImage","WithSignInForm","WithoutLogoAndSwitcher"];export{a as Default,s as WithCustomImage,n as WithSignInForm,o as WithoutLogoAndSwitcher,E as __namedExportsOrder,A as default};
