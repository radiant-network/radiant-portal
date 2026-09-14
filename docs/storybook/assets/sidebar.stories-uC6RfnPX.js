import{j as e}from"./iframe-DY5-UQdi.js";import{S as n}from"./sidebar-groups-BKs_6Wd9.js";import{S as t,a as u,i as x,b as j,c as d,o as h,d as c,f as l,g as m,j as f}from"./sidebar-BPtbEVUK.js";import{S as p,a as i}from"./story-section-BfGxLv6g.js";import{H as g}from"./house-Bk74wBr4.js";import{S as w}from"./search-BkllAiPf.js";import{F as y}from"./file-text-BAaN_0U_.js";import{U as v}from"./users-Cw9Bi7ei.js";import{S as G}from"./settings-DDgyJ1dC.js";import"./preload-helper-PPVm8Dsz.js";import"./index--NuN4mfZ.js";import"./input-DtvqY5Jj.js";import"./sheet-m4XXWoGM.js";import"./x-CLuQ0dgg.js";import"./skeleton-Prw77uM6.js";const N=[{title:"Home",icon:g,active:!0},{title:"Explore",icon:w},{title:"Cases",icon:y},{title:"Community",icon:v}],S={variant:{items:[]},gene:{items:[]},frequency:{items:[]},occurrence:{items:[]},metric_qc:{items:[]}};function o({brand:b=!1}){return e.jsx(t,{className:"min-h-0 w-48",children:e.jsxs(u,{brand:b,collapsible:"none",className:"h-full rounded-lg border border-sidebar-border",children:[e.jsx(x,{children:e.jsx("span",{className:"px-2 text-sm font-semibold",children:"Radiant"})}),e.jsxs(j,{children:[e.jsxs(d,{children:[e.jsx(h,{children:"Navigation"}),e.jsx(c,{children:N.map(r=>e.jsx(l,{children:e.jsxs(m,{isActive:r.active,tooltip:r.title,children:[e.jsx(r.icon,{}),e.jsx("span",{children:r.title})]})},r.title))})]}),e.jsx(f,{}),e.jsx(d,{children:e.jsx(c,{children:e.jsx(l,{children:e.jsxs(m,{tooltip:"Settings",children:[e.jsx(G,{}),e.jsx("span",{children:"Settings"})]})})})})]})]})})}const O={title:"Layout/Sidebar",component:o,args:{brand:!1}},s={render:()=>e.jsxs(p,{direction:"row",children:[e.jsx(i,{title:"Default",description:"brand={false}",children:e.jsx(o,{brand:!1})}),e.jsx(i,{title:"Brand",description:"brand",children:e.jsx(o,{brand:!0})})]})},a={name:"Sidebar Groups",render:()=>e.jsxs(p,{direction:"row",children:[e.jsx(i,{title:"Default",description:"brand={false}",children:e.jsx(t,{className:"w-50",children:e.jsx("div",{className:"w-50",children:e.jsx(n,{aggregationGroups:S,brand:!1})})})}),e.jsx(i,{title:"Brand",description:"brand",children:e.jsx(t,{className:"w-50",children:e.jsx("div",{className:"w-50",children:e.jsx(n,{aggregationGroups:S,brand:!0})})})})]})};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  render: () => <StoryShowcase direction="row">
      <StorySection title="Default" description="brand={false}">
        <SidebarDemo brand={false} />
      </StorySection>
      <StorySection title="Brand" description="brand">
        <SidebarDemo brand />
      </StorySection>
    </StoryShowcase>
}`,...s.parameters?.docs?.source}}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
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
}`,...a.parameters?.docs?.source}}};const T=["Default","Groups"];export{s as Default,a as Groups,T as __namedExportsOrder,O as default};
