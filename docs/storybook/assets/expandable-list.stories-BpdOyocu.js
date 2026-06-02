import{j as s}from"./iframe-X1FdiBKE.js";import{E as i}from"./expandable-list-Dj_E0UK7.js";import"./preload-helper-PPVm8Dsz.js";import"./button-C1dmQasv.js";import"./index-BerhZw8G.js";import"./action-button-D2HkTc1A.js";import"./dropdown-menu-B8dOc9pX.js";import"./index-DnCxSPBU.js";import"./index-DfO9iG95.js";import"./check-CpvZoXR-.js";import"./circle-C0x1jrVb.js";import"./separator-BcF0hBxw.js";import"./i18n-DsLlobA0.js";import"./index-BoMd93ow.js";const v={title:"Lists/Expandable List",component:i,args:{}},a={args:{visibleCount:3,items:[1,2,3,4,5,6].map(e=>s.jsx("span",{children:e},e)),emptyMessage:s.jsx(s.Fragment,{children:"Empty"})},render:e=>s.jsx("div",{className:"flex flex-col gap-8",children:["default","md","lg"].map(t=>s.jsxs("div",{children:[s.jsxs("span",{children:["Size: ",t]}),s.jsx(i,{size:t,...e})]},t))})},r={args:{visibleCount:3,items:[],emptyMessage:s.jsx("span",{children:"List is Empty"})},render:e=>s.jsx(i,{...e})};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  args: {
    visibleCount: 3,
    items: [1, 2, 3, 4, 5, 6].map(item => <span key={item}>{item}</span>),
    emptyMessage: <>Empty</>
  },
  render: args => <div className="flex flex-col gap-8">
      {(['default', 'md', 'lg'] as const).map(size => <div key={size}>
          <span>Size: {size}</span>
          <ExpandableList size={size} {...args} />
        </div>)}
    </div>
}`,...a.parameters?.docs?.source}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  args: {
    visibleCount: 3,
    items: [],
    emptyMessage: <span>List is Empty</span>
  },
  render: args => <ExpandableList {...args} />
}`,...r.parameters?.docs?.source}}};const b=["Default","Empty"];export{a as Default,r as Empty,b as __namedExportsOrder,v as default};
