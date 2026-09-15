import{n as e}from"./rolldown-runtime-C0FnF6B9.js";import{t}from"./jsx-runtime-BdxMnOeJ.js";import{n,t as r}from"./utils-hYbUpBR2.js";import{i,n as a,r as o}from"./story-section-DVTm6cGm.js";function s({title:e,subtitle:t,align:n=`center`,className:i,titleClassName:a}){return(0,c.jsxs)(`div`,{className:r(n===`center`?`text-center`:`text-left`,i),children:[(0,c.jsx)(`h1`,{className:r(`text-primary text-5xl font-bold uppercase tracking-tight`,a),children:e}),t&&(0,c.jsx)(`p`,{className:r(`text-primary mt-3 text-xl font-semibold`,n===`center`&&`mx-auto`),children:t})]})}var c;function l(){return(l=e((()=>{n(),c=t(),s.__docgenInfo={description:`Centered (default) uppercase section title with optional subtitle. Used across landing sections.`,methods:[],displayName:`SectionHeading`,props:{title:{required:!0,tsType:{name:`ReactNode`},description:``},subtitle:{required:!1,tsType:{name:`ReactNode`},description:``},align:{required:!1,tsType:{name:`union`,raw:`'center' | 'left'`,elements:[{name:`literal`,value:`'center'`},{name:`literal`,value:`'left'`}]},description:``,defaultValue:{value:`'center'`,computed:!1}},className:{required:!1,tsType:{name:`string`},description:``},titleClassName:{required:!1,tsType:{name:`string`},description:``}}}})))()}var u,d,f,p;function m(){return(m=e((()=>{l(),i(),u=t(),d={title:`Components/Landing/Section Heading`,component:s,args:{title:`Leading the way through data-sharing`}},f={render:()=>(0,u.jsxs)(o,{children:[(0,u.jsx)(a,{title:`Centered (default)`,children:(0,u.jsx)(s,{title:`Leading the way through data-sharing`})}),(0,u.jsx)(a,{title:`With subtitle`,children:(0,u.jsx)(s,{title:`Advancing science through collaboration`,subtitle:`Easily gain access to a range of robust cloud-based resources to drive meaningful research progress.`})}),(0,u.jsx)(a,{title:`Left-aligned`,children:(0,u.jsx)(s,{title:`Accelerating research`,align:`left`})})]})},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
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
}`,...f.parameters?.docs?.source}}},p=[`AllVariants`]})))()}m();export{f as AllVariants,p as __namedExportsOrder,d as default};