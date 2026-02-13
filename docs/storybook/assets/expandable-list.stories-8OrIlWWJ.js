import{j as s}from"./jsx-runtime-D_zvdyIk.js";import{E as p}from"./expandable-list-r--nsccZ.js";import"./index-CBYaBgW8.js";import"./index-C66Dxnp2.js";import"./button-0hQ_ash6.js";import"./index-C-d7IIsQ.js";import"./index-Dy6y0jaD.js";import"./action-button-BssP5rd1.js";import"./dropdown-menu-DPm_FhUX.js";import"./index-D9mtqW9-.js";import"./index-sTUCEGFJ.js";import"./index-BWnBDfn-.js";import"./index-BCzuw4Jg.js";import"./index-C8BBKGwP.js";import"./index-BL8Z-moU.js";import"./Combination-CrkgvPnV.js";import"./index-iyInEJkZ.js";import"./index-C2iKAgIe.js";import"./index-CWHKeK-O.js";import"./index-CfgEC-S9.js";import"./createLucideIcon-B119WVF5.js";import"./index-DnEzm5An.js";import"./utils-CDN07tui.js";import"./check-DSe_yRo5.js";import"./separator-ChZWIdMg.js";import"./tooltip-W7g5_Dow.js";import"./index-CfXWnpL9.js";import"./button.variants-Du9eY_ux.js";import"./spinner-DMuui_2m.js";import"./i18n-DM4hSTvV.js";import"./iframe-B7RHRjYg.js";import"./i18next-CYn7LYXT.js";const P={title:"Lists/Expandable List",component:p,args:{}},r={args:{visibleCount:3,items:[1,2,3,4,5,6].map(e=>s.jsx("span",{children:e},e)),emptyMessage:s.jsx(s.Fragment,{children:"Empty"})},render:e=>s.jsx("div",{className:"flex flex-col gap-8",children:["default","md","lg"].map(i=>s.jsxs("div",{children:[s.jsxs("span",{children:["Size: ",i]}),s.jsx(p,{size:i,...e})]},i))})},t={args:{visibleCount:3,items:[],emptyMessage:s.jsx("span",{children:"List is Empty"})},render:e=>s.jsx(p,{...e})};var m,a,o;r.parameters={...r.parameters,docs:{...(m=r.parameters)==null?void 0:m.docs,source:{originalSource:`{
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
}`,...(o=(a=r.parameters)==null?void 0:a.docs)==null?void 0:o.source}}};var n,d,l;t.parameters={...t.parameters,docs:{...(n=t.parameters)==null?void 0:n.docs,source:{originalSource:`{
  args: {
    visibleCount: 3,
    items: [],
    emptyMessage: <span>List is Empty</span>
  },
  render: args => <ExpandableList {...args} />
}`,...(l=(d=t.parameters)==null?void 0:d.docs)==null?void 0:l.source}}};const Q=["Default","Empty"];export{r as Default,t as Empty,Q as __namedExportsOrder,P as default};
