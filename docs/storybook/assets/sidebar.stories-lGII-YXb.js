import{j as e}from"./iframe-CgZaKe5d.js";import{S as n}from"./sidebar-groups-DAvSnLPS.js";import{S as t,a as u,i as x,b as j,c as d,o as h,d as c,f as l,g as m,j as f}from"./sidebar-Ce0UlTL-.js";import{S as p,a as i}from"./story-section-Cd-IQlgl.js";import{H as g}from"./house-Dhq1WVcB.js";import{S as w}from"./search-omVJqrmb.js";import{F as y}from"./file-text-DeA8BOpT.js";import{U as v}from"./users-ChEQ132C.js";import{S as G}from"./settings-CJ6rgyvL.js";import"./preload-helper-PPVm8Dsz.js";import"./index-DOoNJz6V.js";import"./input-wTxIY8D5.js";import"./sheet-B4fhyPm2.js";import"./x-C9LJTscZ.js";import"./skeleton-Y9K1ks3z.js";const N=[{title:"Home",icon:g,active:!0},{title:"Explore",icon:w},{title:"Cases",icon:y},{title:"Community",icon:v}],S={variant:{items:[]},gene:{items:[]},frequency:{items:[]},occurrence:{items:[]},metric_qc:{items:[]}};function o({brand:b=!1}){return e.jsx(t,{className:"min-h-0 w-48",children:e.jsxs(u,{brand:b,collapsible:"none",className:"h-full rounded-lg border border-sidebar-border",children:[e.jsx(x,{children:e.jsx("span",{className:"px-2 text-sm font-semibold",children:"Radiant"})}),e.jsxs(j,{children:[e.jsxs(d,{children:[e.jsx(h,{children:"Navigation"}),e.jsx(c,{children:N.map(r=>e.jsx(l,{children:e.jsxs(m,{isActive:r.active,tooltip:r.title,children:[e.jsx(r.icon,{}),e.jsx("span",{children:r.title})]})},r.title))})]}),e.jsx(f,{}),e.jsx(d,{children:e.jsx(c,{children:e.jsx(l,{children:e.jsxs(m,{tooltip:"Settings",children:[e.jsx(G,{}),e.jsx("span",{children:"Settings"})]})})})})]})]})})}const O={title:"Layout/Sidebar",component:o,args:{brand:!1}},s={render:()=>e.jsxs(p,{direction:"row",children:[e.jsx(i,{title:"Default",description:"brand={false}",children:e.jsx(o,{brand:!1})}),e.jsx(i,{title:"Brand",description:"brand",children:e.jsx(o,{brand:!0})})]})},a={name:"Sidebar Groups",render:()=>e.jsxs(p,{direction:"row",children:[e.jsx(i,{title:"Default",description:"brand={false}",children:e.jsx(t,{className:"w-50",children:e.jsx("div",{className:"w-50",children:e.jsx(n,{aggregationGroups:S,brand:!1})})})}),e.jsx(i,{title:"Brand",description:"brand",children:e.jsx(t,{className:"w-50",children:e.jsx("div",{className:"w-50",children:e.jsx(n,{aggregationGroups:S,brand:!0})})})})]})};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
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
