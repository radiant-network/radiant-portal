import{d as u,j as r}from"./iframe-C6MOWQMA.js";import{S as n}from"./sidebar-groups-CVeQy8yc.js";import{S as t,a as x,i as h,b as j,c as d,o as f,d as c,f as l,g as m,j as g}from"./sidebar-CMZKozH7.js";import{S,a as s}from"./story-section-_wEsjD86.js";import{S as w}from"./search-DIfaHVxs.js";import{F as v}from"./file-text-BDkPsuRg.js";import{U as y}from"./users-tuLfnumx.js";import{S as G}from"./settings-BXG5xVNk.js";import"./preload-helper-PPVm8Dsz.js";import"./button-D9gCVoS4.js";import"./action-button-CZKHrL7b.js";import"./dropdown-menu-DhbUdTSy.js";import"./index-B2qiHt1l.js";import"./index-BrSS3xdM.js";import"./check-BS5Edn5_.js";import"./circle-C3Ir_esd.js";import"./separator-ChOm_zYy.js";import"./i18n-CnXb1qax.js";import"./index-DP9hQ_sa.js";import"./index-6QwHF8TM.js";import"./input-BACrWIYE.js";import"./sheet-oZhNHcBA.js";import"./x-CsidU9Vl.js";import"./skeleton-CruioE2S.js";const N=[["path",{d:"M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8",key:"5wwlr5"}],["path",{d:"M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z",key:"r6nss1"}]],D=u("house",N),B=[{title:"Home",icon:D,active:!0},{title:"Explore",icon:w},{title:"Cases",icon:v},{title:"Community",icon:y}],p={variant:{items:[]},gene:{items:[]},frequency:{items:[]},occurrence:{items:[]},metric_qc:{items:[]}};function o({brand:b=!1}){return r.jsx(t,{className:"min-h-0 w-48",children:r.jsxs(x,{brand:b,collapsible:"none",className:"h-full rounded-lg border border-sidebar-border",children:[r.jsx(h,{children:r.jsx("span",{className:"px-2 text-sm font-semibold",children:"Radiant"})}),r.jsxs(j,{children:[r.jsxs(d,{children:[r.jsx(f,{children:"Navigation"}),r.jsx(c,{children:B.map(e=>r.jsx(l,{children:r.jsxs(m,{isActive:e.active,tooltip:e.title,children:[r.jsx(e.icon,{}),r.jsx("span",{children:e.title})]})},e.title))})]}),r.jsx(g,{}),r.jsx(d,{children:r.jsx(c,{children:r.jsx(l,{children:r.jsxs(m,{tooltip:"Settings",children:[r.jsx(G,{}),r.jsx("span",{children:"Settings"})]})})})})]})]})})}const Z={title:"Layout/Sidebar",component:o,args:{brand:!1}},i={render:()=>r.jsxs(S,{direction:"row",children:[r.jsx(s,{title:"Default",description:"brand={false}",children:r.jsx(o,{brand:!1})}),r.jsx(s,{title:"Brand",description:"brand",children:r.jsx(o,{brand:!0})})]})},a={name:"Sidebar Groups",render:()=>r.jsxs(S,{direction:"row",children:[r.jsx(s,{title:"Default",description:"brand={false}",children:r.jsx(t,{className:"w-50",children:r.jsx("div",{className:"w-50",children:r.jsx(n,{aggregationGroups:p,brand:!1})})})}),r.jsx(s,{title:"Brand",description:"brand",children:r.jsx(t,{className:"w-50",children:r.jsx("div",{className:"w-50",children:r.jsx(n,{aggregationGroups:p,brand:!0})})})})]})};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
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
