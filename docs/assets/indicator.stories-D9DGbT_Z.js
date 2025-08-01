import{j as a}from"./jsx-runtime-D_zvdyIk.js";import{I as i}from"./indicator-BUUtuDcG.js";import{i as p}from"./utils-D76j_Oop.js";import"./utils-D-KgF5mV.js";import"./index-C66Dxnp2.js";const u={title:"Data Display/Indicator",component:i,args:{}},r={args:{},render:e=>a.jsx("div",{className:"flex flex-col items-start gap-2",children:p.map(t=>a.jsx(i,{variant:t,...e}))})},s={args:{children:"Badge"},render:e=>a.jsx("div",{className:"flex flex-col items-start gap-2",children:p.map(t=>a.jsx(i,{variant:t,...e,children:a.jsx("span",{children:"Text"})}))})};var n,o,c;r.parameters={...r.parameters,docs:{...(n=r.parameters)==null?void 0:n.docs,source:{originalSource:`{
  args: {},
  render: args => <div className="flex flex-col items-start gap-2">
      {indicatorVariants.map(variant => <Indicator variant={variant} {...args} />)}
    </div>
}`,...(c=(o=r.parameters)==null?void 0:o.docs)==null?void 0:c.source}}};var d,m,l;s.parameters={...s.parameters,docs:{...(d=s.parameters)==null?void 0:d.docs,source:{originalSource:`{
  args: {
    children: 'Badge'
  },
  render: args => <div className="flex flex-col items-start gap-2">
      {indicatorVariants.map(variant => <Indicator variant={variant} {...args}>
          <span>Text</span>
        </Indicator>)}
    </div>
}`,...(l=(m=s.parameters)==null?void 0:m.docs)==null?void 0:l.source}}};const j=["Variants","WithLabel"];export{r as Variants,s as WithLabel,j as __namedExportsOrder,u as default};
