import{d as u,j as r}from"./iframe-ikmO-G8w.js";import{S as n}from"./sidebar-groups-DjM1rtLe.js";import{S as t,a as x,i as h,b as j,c as d,o as f,d as c,f as l,g as m,j as g}from"./sidebar-cj5eTjpZ.js";import{S,a as s}from"./story-section-Do19LCYz.js";import{S as w}from"./search-BBHqMNdV.js";import{F as v}from"./file-text-CppnOedV.js";import{U as y}from"./users-Cs9LZkNo.js";import{S as G}from"./settings-BuaF0aCU.js";import"./preload-helper-PPVm8Dsz.js";import"./button-f2BnibuH.js";import"./action-button-DslSGgMW.js";import"./dropdown-menu-Djo0E1ip.js";import"./index-DLIPavft.js";import"./index-LNYO5vkT.js";import"./check-DFIBGLZn.js";import"./circle-HHVicZ3t.js";import"./separator-DvGIa4AD.js";import"./i18n--cYKJdvf.js";import"./index-TBEFmxjP.js";import"./index-vwb8wDz1.js";import"./input-CG0Dxzxz.js";import"./sheet-Bo3rwkR9.js";import"./x-leFJ26lF.js";import"./skeleton-DBzD6UYr.js";const N=[["path",{d:"M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8",key:"5wwlr5"}],["path",{d:"M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z",key:"r6nss1"}]],D=u("house",N),B=[{title:"Home",icon:D,active:!0},{title:"Explore",icon:w},{title:"Cases",icon:v},{title:"Community",icon:y}],p={variant:{items:[]},gene:{items:[]},frequency:{items:[]},occurrence:{items:[]},metric_qc:{items:[]}};function o({brand:b=!1}){return r.jsx(t,{className:"min-h-0 w-48",children:r.jsxs(x,{brand:b,collapsible:"none",className:"h-full rounded-lg border border-sidebar-border",children:[r.jsx(h,{children:r.jsx("span",{className:"px-2 text-sm font-semibold",children:"Radiant"})}),r.jsxs(j,{children:[r.jsxs(d,{children:[r.jsx(f,{children:"Navigation"}),r.jsx(c,{children:B.map(e=>r.jsx(l,{children:r.jsxs(m,{isActive:e.active,tooltip:e.title,children:[r.jsx(e.icon,{}),r.jsx("span",{children:e.title})]})},e.title))})]}),r.jsx(g,{}),r.jsx(d,{children:r.jsx(c,{children:r.jsx(l,{children:r.jsxs(m,{tooltip:"Settings",children:[r.jsx(G,{}),r.jsx("span",{children:"Settings"})]})})})})]})]})})}const Z={title:"Layout/Sidebar",component:o,args:{brand:!1}},i={render:()=>r.jsxs(S,{direction:"row",children:[r.jsx(s,{title:"Default",description:"brand={false}",children:r.jsx(o,{brand:!1})}),r.jsx(s,{title:"Brand",description:"brand",children:r.jsx(o,{brand:!0})})]})},a={name:"Sidebar Groups",render:()=>r.jsxs(S,{direction:"row",children:[r.jsx(s,{title:"Default",description:"brand={false}",children:r.jsx(t,{className:"w-50",children:r.jsx("div",{className:"w-50",children:r.jsx(n,{aggregationGroups:p,brand:!1})})})}),r.jsx(s,{title:"Brand",description:"brand",children:r.jsx(t,{className:"w-50",children:r.jsx("div",{className:"w-50",children:r.jsx(n,{aggregationGroups:p,brand:!0})})})})]})};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  render: () => <StoryShowcase direction="row">
      <StorySection title="Default" description="brand={false}">
        <SidebarDemo brand={false} />
      </StorySection>
      <StorySection title="Brand" description="brand">
        <SidebarDemo brand />
      </StorySection>
    </StoryShowcase>
}`,...i.parameters?.docs?.source}}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
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
}`,...a.parameters?.docs?.source}}};const $=["Default","Groups"];export{i as Default,a as Groups,$ as __namedExportsOrder,Z as default};
