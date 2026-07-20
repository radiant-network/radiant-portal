import{j as e,c as u}from"./iframe-DVxP0arQ.js";import{R as g,l as h,a as x,S as f}from"./sign-in-form-DxWO4rea.js";import{a as i}from"./story-section-BtKKXoKS.js";import"./preload-helper-PPVm8Dsz.js";import"./button-HLKZGIIG.js";import"./action-button-BE9ZLPWr.js";import"./dropdown-menu-Bdlhi6VJ.js";import"./index-U50s1qQV.js";import"./index-CrmWKYFO.js";import"./check-DnDcPfKb.js";import"./circle-hliijJXo.js";import"./separator-Bx5E3IZe.js";import"./i18n-U8mL1TZy.js";import"./index-DXeCl3bV.js";import"./input-CEDgBxMH.js";import"./label-BxVuC17B.js";function r({children:t,logo:l,background:d,className:m,...p}){return e.jsxs("div",{className:u("flex min-h-screen w-full",m),...p,children:[e.jsxs("div",{className:"relative flex flex-1 flex-col bg-muted",children:[l&&e.jsx("div",{className:"flex justify-center p-6 md:justify-start md:p-8",children:l}),e.jsx("div",{className:"flex flex-1 items-center justify-center p-6",children:t})]}),e.jsx("div",{className:"hidden flex-1 md:block","aria-hidden":"true",children:d??e.jsx(g,{})})]})}r.__docgenInfo={description:"",methods:[],displayName:"SplitLayout",props:{children:{required:!0,tsType:{name:"ReactReactNode",raw:"React.ReactNode"},description:""},logo:{required:!1,tsType:{name:"ReactReactNode",raw:"React.ReactNode"},description:""},background:{required:!1,tsType:{name:"ReactReactNode",raw:"React.ReactNode"},description:""}}};const S=""+new URL("layoutPicture-C9fPb6vL.jpeg",import.meta.url).href,c=e.jsxs(e.Fragment,{children:[e.jsx("img",{src:h,alt:"Logo",className:"dark:hidden"}),e.jsx("img",{src:x,alt:"Logo",className:"hidden dark:block"})]}),C={title:"Layout/Split layout",component:r},o={args:{logo:c,children:e.jsx("span",{className:"text-muted-foreground",children:"Replace with content"})},render:t=>e.jsx(i,{title:"Default",children:e.jsx(r,{...t})})},a={args:{logo:c,background:e.jsx("img",{src:S,alt:"",className:"size-full object-cover"}),children:e.jsx("span",{className:"text-muted-foreground",children:"Replace with content"})},render:t=>e.jsx(i,{title:"With custom image",children:e.jsx(r,{...t})})},s={args:{logo:c,children:e.jsx(f,{})},render:t=>e.jsx(i,{title:"With sign-in form",children:e.jsx(r,{...t})})},n={args:{children:e.jsx("span",{className:"text-muted-foreground",children:"Replace with content"})},render:t=>e.jsx(i,{title:"Without logo",children:e.jsx(r,{...t})})};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  args: {
    logo,
    children: <span className="text-muted-foreground">Replace with content</span>
  },
  render: args => <StorySection title="Default">
      <SplitLayout {...args} />
    </StorySection>
}`,...o.parameters?.docs?.source}}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  args: {
    logo,
    background: <img src={layoutPicture} alt="" className="size-full object-cover" />,
    children: <span className="text-muted-foreground">Replace with content</span>
  },
  render: args => <StorySection title="With custom image">
      <SplitLayout {...args} />
    </StorySection>
}`,...a.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    logo,
    children: <SignInForm />
  },
  render: args => <StorySection title="With sign-in form">
      <SplitLayout {...args} />
    </StorySection>
}`,...s.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  args: {
    children: <span className="text-muted-foreground">Replace with content</span>
  },
  render: args => <StorySection title="Without logo">
      <SplitLayout {...args} />
    </StorySection>
}`,...n.parameters?.docs?.source}}};const T=["Default","WithCustomImage","WithSignInForm","WithoutLogo"];export{o as Default,a as WithCustomImage,s as WithSignInForm,n as WithoutLogo,T as __namedExportsOrder,C as default};
