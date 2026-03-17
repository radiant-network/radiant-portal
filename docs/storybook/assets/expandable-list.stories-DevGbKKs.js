import{j as s}from"./iframe-fuMeGN55.js";import{E as i}from"./expandable-list-B5XbtMlh.js";import"./preload-helper-Dp1pzeXC.js";import"./button-Bxfmps2v.js";import"./index-xXWWjBr5.js";import"./action-button-CNAnyKFq.js";import"./dropdown-menu-BWOWLXa_.js";import"./index-BcsYj1sj.js";import"./circle-Dx5yjyGq.js";import"./check-BpVxTnN5.js";import"./separator-C8lzm_Mx.js";import"./i18n-Cn9hqjYo.js";const z={title:"Lists/Expandable List",component:i,args:{}},a={args:{visibleCount:3,items:[1,2,3,4,5,6].map(e=>s.jsx("span",{children:e},e)),emptyMessage:s.jsx(s.Fragment,{children:"Empty"})},render:e=>s.jsx("div",{className:"flex flex-col gap-8",children:["default","md","lg"].map(t=>s.jsxs("div",{children:[s.jsxs("span",{children:["Size: ",t]}),s.jsx(i,{size:t,...e})]},t))})},r={args:{visibleCount:3,items:[],emptyMessage:s.jsx("span",{children:"List is Empty"})},render:e=>s.jsx(i,{...e})};var p,m,n;a.parameters={...a.parameters,docs:{...(p=a.parameters)==null?void 0:p.docs,source:{originalSource:`{
  args: {
    visibleCount: 3,
    items: [1, 2, 3, 4, 5, 6].map(item => <span key={item}>{item}</span>),
    emptyMessage: <>Empty</>
  },
  render: args => <div className="flex flex-col gap-8">
      {['default', 'md', 'lg'].map(size => <div key={size}>
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
}`,...(l=(d=r.parameters)==null?void 0:d.docs)==null?void 0:l.source}}};const C=["Default","Empty"];export{a as Default,r as Empty,C as __namedExportsOrder,z as default};
