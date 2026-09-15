import{n as e}from"./rolldown-runtime-C0FnF6B9.js";import{t}from"./jsx-runtime-BdxMnOeJ.js";import{n,t as r}from"./sidebar-groups-CTvia16W.js";import{n as i,t as a}from"./file-text-DLvHsPz8.js";import{n as o,t as s}from"./house-DaEPUWTT.js";import{a as c,c as l,h as u,i as d,l as f,m as p,n as m,o as h,p as g,s as _,t as v}from"./sidebar-DV6ETXba.js";import{n as y,t as b}from"./search-CmqwqpRU.js";import{n as x,t as S}from"./settings-CoBxXs2v.js";import{n as C,t as w}from"./users-B1eOm8So.js";import{i as T,n as E,r as D}from"./story-section-DVTm6cGm.js";function O({brand:e=!1}){return(0,k.jsx)(g,{className:`min-h-0 w-48`,children:(0,k.jsxs)(v,{brand:e,collapsible:`none`,className:`h-full rounded-lg border border-sidebar-border`,children:[(0,k.jsx)(h,{children:(0,k.jsx)(`span`,{className:`px-2 text-sm font-semibold`,children:`Radiant`})}),(0,k.jsxs)(m,{children:[(0,k.jsxs)(d,{children:[(0,k.jsx)(c,{children:`Navigation`}),(0,k.jsx)(_,{children:A.map(e=>(0,k.jsx)(f,{children:(0,k.jsxs)(l,{isActive:e.active,tooltip:e.title,children:[(0,k.jsx)(e.icon,{}),(0,k.jsx)(`span`,{children:e.title})]})},e.title))})]}),(0,k.jsx)(p,{}),(0,k.jsx)(d,{children:(0,k.jsx)(_,{children:(0,k.jsx)(f,{children:(0,k.jsxs)(l,{tooltip:`Settings`,children:[(0,k.jsx)(S,{}),(0,k.jsx)(`span`,{children:`Settings`})]})})})})]})]})})}var k,A,j,M,N,P,F;function I(){return(I=e((()=>{i(),o(),y(),x(),C(),n(),u(),T(),k=t(),A=[{title:`Home`,icon:s,active:!0},{title:`Explore`,icon:b},{title:`Cases`,icon:a},{title:`Community`,icon:w}],j={variant:{items:[]},gene:{items:[]},frequency:{items:[]},occurrence:{items:[]},metric_qc:{items:[]}},M={title:`Layout/Sidebar`,component:O,args:{brand:!1}},N={render:()=>(0,k.jsxs)(D,{direction:`row`,children:[(0,k.jsx)(E,{title:`Default`,description:`brand={false}`,children:(0,k.jsx)(O,{brand:!1})}),(0,k.jsx)(E,{title:`Brand`,description:`brand`,children:(0,k.jsx)(O,{brand:!0})})]})},P={name:`Sidebar Groups`,render:()=>(0,k.jsxs)(D,{direction:`row`,children:[(0,k.jsx)(E,{title:`Default`,description:`brand={false}`,children:(0,k.jsx)(g,{className:`w-50`,children:(0,k.jsx)(`div`,{className:`w-50`,children:(0,k.jsx)(r,{aggregationGroups:j,brand:!1})})})}),(0,k.jsx)(E,{title:`Brand`,description:`brand`,children:(0,k.jsx)(g,{className:`w-50`,children:(0,k.jsx)(`div`,{className:`w-50`,children:(0,k.jsx)(r,{aggregationGroups:j,brand:!0})})})})]})},N.parameters={...N.parameters,docs:{...N.parameters?.docs,source:{originalSource:`{
  render: () => <StoryShowcase direction="row">
      <StorySection title="Default" description="brand={false}">
        <SidebarDemo brand={false} />
      </StorySection>
      <StorySection title="Brand" description="brand">
        <SidebarDemo brand />
      </StorySection>
    </StoryShowcase>
}`,...N.parameters?.docs?.source}}},P.parameters={...P.parameters,docs:{...P.parameters?.docs,source:{originalSource:`{
  name: 'Sidebar Groups',
  render: () => <StoryShowcase direction="row">
      <StorySection title="Default" description="brand={false}">
        <SidebarProvider className="w-50">
          <div className="w-50">
            <SidebarGroups aggregationGroups={aggregationGroups} brand={false} />
          </div>
        </SidebarProvider>
      </StorySection>
      <StorySection title="Brand" description="brand">
        <SidebarProvider className="w-50">
          <div className="w-50">
            <SidebarGroups aggregationGroups={aggregationGroups} brand />
          </div>
        </SidebarProvider>
      </StorySection>
    </StoryShowcase>
}`,...P.parameters?.docs?.source}}},F=[`Default`,`Groups`]})))()}I();export{N as Default,P as Groups,F as __namedExportsOrder,M as default};