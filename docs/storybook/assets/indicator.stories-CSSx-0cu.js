import{j as a}from"./iframe-BH3MSqWK.js";import{I as i}from"./indicator-DAo0P4-_.js";import{i as e}from"./utils-D76j_Oop.js";import"./preload-helper-PPVm8Dsz.js";import"./shape-triangle-up-icon-BIU-3xog.js";const m={title:"Indicators/Indicator",component:i,args:{}},r={args:{variant:"red"},render:()=>a.jsx("div",{className:"flex flex-col items-start gap-2",children:e.filter(s=>s!==void 0).map(s=>a.jsxs("div",{children:[a.jsx(i,{variant:s,symbol:"triangle-up"}),a.jsx(i,{variant:s,symbol:"triangle-down"}),a.jsx(i,{variant:s,symbol:"diamond"}),a.jsx(i,{variant:s,symbol:"circle"}),a.jsx(i,{variant:s,symbol:"triangle-up",size:"sm"}),a.jsx(i,{variant:s,symbol:"triangle-down",size:"sm"}),a.jsx(i,{variant:s,symbol:"diamond",size:"sm"}),a.jsx(i,{variant:s,symbol:"circle",size:"sm"})]},s))})},n={args:{variant:"red"},render:()=>a.jsx("div",{className:"flex flex-col items-start gap-2",children:e.filter(s=>s!==void 0).map(s=>a.jsxs("div",{children:[a.jsx(i,{variant:s,symbol:"triangle-up",children:a.jsx("span",{children:"Text"})}),a.jsx(i,{variant:s,symbol:"triangle-down",children:a.jsx("span",{children:"Text"})}),a.jsx(i,{variant:s,symbol:"diamond",children:a.jsx("span",{children:"Text"})}),a.jsx(i,{variant:s,symbol:"circle",children:a.jsx("span",{children:"Text"})}),a.jsx(i,{variant:s,symbol:"triangle-up",size:"sm",children:a.jsx("span",{children:"Text"})}),a.jsx(i,{variant:s,symbol:"triangle-down",size:"sm",children:a.jsx("span",{children:"Text"})}),a.jsx(i,{variant:s,symbol:"diamond",size:"sm",children:a.jsx("span",{children:"Text"})}),a.jsx(i,{variant:s,symbol:"circle",size:"sm",children:a.jsx("span",{children:"Text"})})]},s))})};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
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
}`,...r.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
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
}`,...n.parameters?.docs?.source}}};const p=["Variants","WithLabel"];export{r as Variants,n as WithLabel,p as __namedExportsOrder,m as default};
