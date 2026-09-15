import{n as e}from"./rolldown-runtime-C0FnF6B9.js";import{t}from"./jsx-runtime-BdxMnOeJ.js";import{n,t as r}from"./info-eRAGJ51X.js";import{i,n as a}from"./story-section-DVTm6cGm.js";import{i as o,n as s,r as c,t as l}from"./marker-C-eAEDWx.js";var u,d,f,p,m;function h(){return(h=e((()=>{n(),o(),i(),u=t(),d={title:`Components/Chat/Marker`,component:l},f={render:()=>(0,u.jsx)(a,{title:`Variants`,description:`Inline conversation markers: default, separator, border.`,children:(0,u.jsxs)(`div`,{className:`flex w-full max-w-md flex-col gap-4`,children:[(0,u.jsx)(l,{variant:`default`,children:(0,u.jsx)(s,{children:`Conversation started`})}),(0,u.jsx)(l,{variant:`separator`,children:(0,u.jsx)(s,{children:`Today`})}),(0,u.jsx)(l,{variant:`border`,children:(0,u.jsx)(s,{children:`Unread messages below`})})]})})},p={render:()=>(0,u.jsx)(a,{title:`With icon`,children:(0,u.jsx)(`div`,{className:`w-full max-w-md`,children:(0,u.jsxs)(l,{variant:`default`,children:[(0,u.jsx)(c,{children:(0,u.jsx)(r,{})}),(0,u.jsx)(s,{children:`The assistant updated its answer.`})]})})})},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
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
}`,...f.parameters?.docs?.source}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
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
}`,...p.parameters?.docs?.source}}},m=[`Variants`,`WithIcon`]})))()}h();export{f as Variants,p as WithIcon,m as __namedExportsOrder,d as default};