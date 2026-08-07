import{j as r}from"./iframe-DiGfbfp3.js";import{S as n}from"./sidebar-groups-CbKcswre.js";import{S as t,a as u,i as x,b as j,c as d,o as h,d as c,f as l,g as m,j as f}from"./sidebar-D0cYjTSw.js";import{S,a}from"./story-section-DME95Whn.js";import{H as g}from"./house-B9DrzVvI.js";import{S as w}from"./search-D5fh8e5-.js";import{F as y}from"./file-text-D5OPym9q.js";import{U as v}from"./users-F9gd7TnC.js";import{S as G}from"./settings-HVyRBUWF.js";import"./preload-helper-PPVm8Dsz.js";import"./button-Bo0DQutg.js";import"./action-button-De4ur-7I.js";import"./dropdown-menu-CNdkncgA.js";import"./index-D8Osr2Vx.js";import"./index-BZGt5Ho_.js";import"./check-IkDt6mIM.js";import"./circle-BTr0m0BF.js";import"./separator-Dj9939qF.js";import"./i18n-uvvEETAD.js";import"./index-Cn_qWDha.js";import"./index-DI_ycpoJ.js";import"./input-CuiOqIFL.js";import"./sheet-BXKy38GZ.js";import"./x-J1a-oCAV.js";import"./skeleton-CSZoEeGy.js";const N=[{title:"Home",icon:g,active:!0},{title:"Explore",icon:w},{title:"Cases",icon:y},{title:"Community",icon:v}],p={variant:{items:[]},gene:{items:[]},frequency:{items:[]},occurrence:{items:[]},metric_qc:{items:[]}};function o({brand:b=!1}){return r.jsx(t,{className:"min-h-0 w-48",children:r.jsxs(u,{brand:b,collapsible:"none",className:"h-full rounded-lg border border-sidebar-border",children:[r.jsx(x,{children:r.jsx("span",{className:"px-2 text-sm font-semibold",children:"Radiant"})}),r.jsxs(j,{children:[r.jsxs(d,{children:[r.jsx(h,{children:"Navigation"}),r.jsx(c,{children:N.map(e=>r.jsx(l,{children:r.jsxs(m,{isActive:e.active,tooltip:e.title,children:[r.jsx(e.icon,{}),r.jsx("span",{children:e.title})]})},e.title))})]}),r.jsx(f,{}),r.jsx(d,{children:r.jsx(c,{children:r.jsx(l,{children:r.jsxs(m,{tooltip:"Settings",children:[r.jsx(G,{}),r.jsx("span",{children:"Settings"})]})})})})]})]})})}const Y={title:"Layout/Sidebar",component:o,args:{brand:!1}},i={render:()=>r.jsxs(S,{direction:"row",children:[r.jsx(a,{title:"Default",description:"brand={false}",children:r.jsx(o,{brand:!1})}),r.jsx(a,{title:"Brand",description:"brand",children:r.jsx(o,{brand:!0})})]})},s={name:"Sidebar Groups",render:()=>r.jsxs(S,{direction:"row",children:[r.jsx(a,{title:"Default",description:"brand={false}",children:r.jsx(t,{className:"w-50",children:r.jsx("div",{className:"w-50",children:r.jsx(n,{aggregationGroups:p,brand:!1})})})}),r.jsx(a,{title:"Brand",description:"brand",children:r.jsx(t,{className:"w-50",children:r.jsx("div",{className:"w-50",children:r.jsx(n,{aggregationGroups:p,brand:!0})})})})]})};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  render: () => <StoryShowcase direction="row">
      <StorySection title="Default" description="brand={false}">
        <SidebarDemo brand={false} />
      </StorySection>
      <StorySection title="Brand" description="brand">
        <SidebarDemo brand />
      </StorySection>
    </StoryShowcase>
}`,...i.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
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
}`,...s.parameters?.docs?.source}}};const Z=["Default","Groups"];export{i as Default,s as Groups,Z as __namedExportsOrder,Y as default};
