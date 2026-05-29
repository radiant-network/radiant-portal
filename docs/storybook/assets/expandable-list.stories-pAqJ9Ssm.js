import{j as s}from"./iframe-cY3pXf19.js";import{E as i}from"./expandable-list-BffWox9c.js";import"./preload-helper-Dp1pzeXC.js";import"./button--Wtedmo9.js";import"./index-l2hVhD8x.js";import"./action-button-Dnm389NF.js";import"./dropdown-menu-C90hvEAS.js";import"./index-CzsD47ag.js";import"./index-lW8L5n2K.js";import"./check-DA24y2Ls.js";import"./circle-Cm-azYNc.js";import"./separator-CVW8e8v-.js";import"./i18n-CBBeQjuA.js";const C={title:"Lists/Expandable List",component:i,args:{}},a={args:{visibleCount:3,items:[1,2,3,4,5,6].map(e=>s.jsx("span",{children:e},e)),emptyMessage:s.jsx(s.Fragment,{children:"Empty"})},render:e=>s.jsx("div",{className:"flex flex-col gap-8",children:["default","md","lg"].map(t=>s.jsxs("div",{children:[s.jsxs("span",{children:["Size: ",t]}),s.jsx(i,{size:t,...e})]},t))})},r={args:{visibleCount:3,items:[],emptyMessage:s.jsx("span",{children:"List is Empty"})},render:e=>s.jsx(i,{...e})};var p,m,n;a.parameters={...a.parameters,docs:{...(p=a.parameters)==null?void 0:p.docs,source:{originalSource:`{
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
}`,...(n=(m=a.parameters)==null?void 0:m.docs)==null?void 0:n.source}}};var o,d,l;r.parameters={...r.parameters,docs:{...(o=r.parameters)==null?void 0:o.docs,source:{originalSource:`{
  args: {
    visibleCount: 3,
    items: [],
    emptyMessage: <span>List is Empty</span>
  },
  render: args => <ExpandableList {...args} />
}`,...(l=(d=r.parameters)==null?void 0:d.docs)==null?void 0:l.source}}};const M=["Default","Empty"];export{a as Default,r as Empty,M as __namedExportsOrder,C as default};
