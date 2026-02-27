import{j as a}from"./iframe-ic5Qxcay.js";import{I as i}from"./indicator-C5TNhaVK.js";import{i as m}from"./utils-D76j_Oop.js";import"./preload-helper-Dp1pzeXC.js";import"./shape-triangle-up-icon-ITyo3L6T.js";const j={title:"Indicators/Indicator",component:i,args:{}},r={args:{variant:"red"},render:()=>a.jsx("div",{className:"flex flex-col items-start gap-2",children:m.filter(s=>s!==void 0).map(s=>a.jsxs("div",{children:[a.jsx(i,{variant:s,symbol:"triangle-up"}),a.jsx(i,{variant:s,symbol:"triangle-down"}),a.jsx(i,{variant:s,symbol:"diamond"}),a.jsx(i,{variant:s,symbol:"circle"}),a.jsx(i,{variant:s,symbol:"triangle-up",size:"sm"}),a.jsx(i,{variant:s,symbol:"triangle-down",size:"sm"}),a.jsx(i,{variant:s,symbol:"diamond",size:"sm"}),a.jsx(i,{variant:s,symbol:"circle",size:"sm"})]},s))})},n={args:{variant:"red"},render:()=>a.jsx("div",{className:"flex flex-col items-start gap-2",children:m.filter(s=>s!==void 0).map(s=>a.jsxs("div",{children:[a.jsx(i,{variant:s,symbol:"triangle-up",children:a.jsx("span",{children:"Text"})}),a.jsx(i,{variant:s,symbol:"triangle-down",children:a.jsx("span",{children:"Text"})}),a.jsx(i,{variant:s,symbol:"diamond",children:a.jsx("span",{children:"Text"})}),a.jsx(i,{variant:s,symbol:"circle",children:a.jsx("span",{children:"Text"})}),a.jsx(i,{variant:s,symbol:"triangle-up",size:"sm",children:a.jsx("span",{children:"Text"})}),a.jsx(i,{variant:s,symbol:"triangle-down",size:"sm",children:a.jsx("span",{children:"Text"})}),a.jsx(i,{variant:s,symbol:"diamond",size:"sm",children:a.jsx("span",{children:"Text"})}),a.jsx(i,{variant:s,symbol:"circle",size:"sm",children:a.jsx("span",{children:"Text"})})]},s))})};var e,t,o;r.parameters={...r.parameters,docs:{...(e=r.parameters)==null?void 0:e.docs,source:{originalSource:`{
  args: {
    variant: 'red'
  },
  render: () => <div className="flex flex-col items-start gap-2">
      {indicatorVariants.filter((v): v is NonNullable<typeof v> => v !== undefined).map(variant => <div key={variant}>
            <Indicator variant={variant} symbol="triangle-up" />
            <Indicator variant={variant} symbol="triangle-down" />
            <Indicator variant={variant} symbol="diamond" />
            <Indicator variant={variant} symbol="circle" />

            <Indicator variant={variant} symbol="triangle-up" size="sm" />
            <Indicator variant={variant} symbol="triangle-down" size="sm" />
            <Indicator variant={variant} symbol="diamond" size="sm" />
            <Indicator variant={variant} symbol="circle" size="sm" />
          </div>)}
    </div>
}`,...(o=(t=r.parameters)==null?void 0:t.docs)==null?void 0:o.source}}};var d,l,c;n.parameters={...n.parameters,docs:{...(d=n.parameters)==null?void 0:d.docs,source:{originalSource:`{
  args: {
    variant: 'red'
  },
  render: () => <div className="flex flex-col items-start gap-2">
      {indicatorVariants.filter((v): v is NonNullable<typeof v> => v !== undefined).map(variant => <div key={variant}>
            <Indicator variant={variant} symbol="triangle-up">
              <span>Text</span>
            </Indicator>
            <Indicator variant={variant} symbol="triangle-down">
              <span>Text</span>
            </Indicator>
            <Indicator variant={variant} symbol="diamond">
              <span>Text</span>
            </Indicator>
            <Indicator variant={variant} symbol="circle">
              <span>Text</span>
            </Indicator>

            <Indicator variant={variant} symbol="triangle-up" size="sm">
              <span>Text</span>
            </Indicator>
            <Indicator variant={variant} symbol="triangle-down" size="sm">
              <span>Text</span>
            </Indicator>
            <Indicator variant={variant} symbol="diamond" size="sm">
              <span>Text</span>
            </Indicator>
            <Indicator variant={variant} symbol="circle" size="sm">
              <span>Text</span>
            </Indicator>
          </div>)}
    </div>
}`,...(c=(l=n.parameters)==null?void 0:l.docs)==null?void 0:c.source}}};const I=["Variants","WithLabel"];export{r as Variants,n as WithLabel,I as __namedExportsOrder,j as default};
