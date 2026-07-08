import{j as e,c as a}from"./iframe-AvqL8SKE.js";import{S as d,a as r}from"./story-section-SMd-_iOc.js";import"./preload-helper-PPVm8Dsz.js";function t({title:o,subtitle:i,align:s="center",className:c,titleClassName:l}){return e.jsxs("div",{className:a(s==="center"?"text-center":"text-left",c),children:[e.jsx("h1",{className:a("text-primary text-5xl font-bold uppercase tracking-tight",l),children:o}),i&&e.jsx("p",{className:a("text-primary mt-3 text-xl font-semibold",s==="center"&&"mx-auto"),children:i})]})}t.__docgenInfo={description:"Centered (default) uppercase section title with optional subtitle. Used across landing sections.",methods:[],displayName:"SectionHeading",props:{title:{required:!0,tsType:{name:"ReactNode"},description:""},subtitle:{required:!1,tsType:{name:"ReactNode"},description:""},align:{required:!1,tsType:{name:"union",raw:"'center' | 'left'",elements:[{name:"literal",value:"'center'"},{name:"literal",value:"'left'"}]},description:"",defaultValue:{value:"'center'",computed:!1}},className:{required:!1,tsType:{name:"string"},description:""},titleClassName:{required:!1,tsType:{name:"string"},description:""}}};const p={title:"Components/Landing/Section Heading",component:t,args:{title:"Leading the way through data-sharing"}},n={render:()=>e.jsxs(d,{children:[e.jsx(r,{title:"Centered (default)",children:e.jsx(t,{title:"Leading the way through data-sharing"})}),e.jsx(r,{title:"With subtitle",children:e.jsx(t,{title:"Advancing science through collaboration",subtitle:"Easily gain access to a range of robust cloud-based resources to drive meaningful research progress."})}),e.jsx(r,{title:"Left-aligned",children:e.jsx(t,{title:"Accelerating research",align:"left"})})]})};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  render: () => <StoryShowcase>
      <StorySection title="Centered (default)">
        <SectionHeading title="Leading the way through data-sharing" />
      </StorySection>

      <StorySection title="With subtitle">
        <SectionHeading title="Advancing science through collaboration" subtitle="Easily gain access to a range of robust cloud-based resources to drive meaningful research progress." />
      </StorySection>

      <StorySection title="Left-aligned">
        <SectionHeading title="Accelerating research" align="left" />
      </StorySection>
    </StoryShowcase>
}`,...n.parameters?.docs?.source}}};const h=["AllVariants"];export{n as AllVariants,h as __namedExportsOrder,p as default};
