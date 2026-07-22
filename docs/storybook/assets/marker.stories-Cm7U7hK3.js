import{j as r,ab as o}from"./iframe-ikmO-G8w.js";import{M as e,b as t,a as i}from"./marker-C1c5RWvg.js";import{a as s}from"./story-section-Do19LCYz.js";import"./preload-helper-PPVm8Dsz.js";import"./index-vwb8wDz1.js";const x={title:"Components/Chat/Marker",component:e},a={render:()=>r.jsx(s,{title:"Variants",description:"Inline conversation markers: default, separator, border.",children:r.jsxs("div",{className:"flex w-full max-w-md flex-col gap-4",children:[r.jsx(e,{variant:"default",children:r.jsx(t,{children:"Conversation started"})}),r.jsx(e,{variant:"separator",children:r.jsx(t,{children:"Today"})}),r.jsx(e,{variant:"border",children:r.jsx(t,{children:"Unread messages below"})})]})})},n={render:()=>r.jsx(s,{title:"With icon",children:r.jsx("div",{className:"w-full max-w-md",children:r.jsxs(e,{variant:"default",children:[r.jsx(i,{children:r.jsx(o,{})}),r.jsx(t,{children:"The assistant updated its answer."})]})})})};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  render: () => <StorySection title="Variants" description="Inline conversation markers: default, separator, border.">
      <div className="flex w-full max-w-md flex-col gap-4">
        <Marker variant="default">
          <MarkerContent>Conversation started</MarkerContent>
        </Marker>
        <Marker variant="separator">
          <MarkerContent>Today</MarkerContent>
        </Marker>
        <Marker variant="border">
          <MarkerContent>Unread messages below</MarkerContent>
        </Marker>
      </div>
    </StorySection>
}`,...a.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  render: () => <StorySection title="With icon">
      <div className="w-full max-w-md">
        <Marker variant="default">
          <MarkerIcon>
            <Info />
          </MarkerIcon>
          <MarkerContent>The assistant updated its answer.</MarkerContent>
        </Marker>
      </div>
    </StorySection>
}`,...n.parameters?.docs?.source}}};const k=["Variants","WithIcon"];export{a as Variants,n as WithIcon,k as __namedExportsOrder,x as default};
