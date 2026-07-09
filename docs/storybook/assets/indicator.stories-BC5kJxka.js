import{j as a}from"./iframe-C5ghdKPC.js";import{I as s}from"./indicator-C2tt9oKk.js";import{i as n}from"./utils-D76j_Oop.js";import{a as t}from"./story-section-CLlhZcHq.js";import"./preload-helper-PPVm8Dsz.js";import"./shape-triangle-up-icon-2dVWrRQZ.js";const x={title:"Features/Indicators/Indicator",component:s,args:{}},r={args:{variant:"red"},render:()=>a.jsx(t,{title:"Variants",children:a.jsx("div",{className:"flex flex-col items-start gap-2",children:n.filter(i=>i!==void 0).map(i=>a.jsxs("div",{children:[a.jsx(s,{variant:i,symbol:"triangle-up"}),a.jsx(s,{variant:i,symbol:"triangle-down"}),a.jsx(s,{variant:i,symbol:"diamond"}),a.jsx(s,{variant:i,symbol:"circle"}),a.jsx(s,{variant:i,symbol:"triangle-up",size:"sm"}),a.jsx(s,{variant:i,symbol:"triangle-down",size:"sm"}),a.jsx(s,{variant:i,symbol:"diamond",size:"sm"}),a.jsx(s,{variant:i,symbol:"circle",size:"sm"})]},i))})})},e={args:{variant:"red"},render:()=>a.jsx(t,{title:"With label",children:a.jsx("div",{className:"flex flex-col items-start gap-2",children:n.filter(i=>i!==void 0).map(i=>a.jsxs("div",{children:[a.jsx(s,{variant:i,symbol:"triangle-up",children:a.jsx("span",{children:"Text"})}),a.jsx(s,{variant:i,symbol:"triangle-down",children:a.jsx("span",{children:"Text"})}),a.jsx(s,{variant:i,symbol:"diamond",children:a.jsx("span",{children:"Text"})}),a.jsx(s,{variant:i,symbol:"circle",children:a.jsx("span",{children:"Text"})}),a.jsx(s,{variant:i,symbol:"triangle-up",size:"sm",children:a.jsx("span",{children:"Text"})}),a.jsx(s,{variant:i,symbol:"triangle-down",size:"sm",children:a.jsx("span",{children:"Text"})}),a.jsx(s,{variant:i,symbol:"diamond",size:"sm",children:a.jsx("span",{children:"Text"})}),a.jsx(s,{variant:i,symbol:"circle",size:"sm",children:a.jsx("span",{children:"Text"})})]},i))})})};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  args: {
    variant: 'red'
  },
  render: () => <StorySection title="Variants">
      <div className="flex flex-col items-start gap-2">
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
    </StorySection>
}`,...r.parameters?.docs?.source}}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  args: {
    variant: 'red'
  },
  render: () => <StorySection title="With label">
      <div className="flex flex-col items-start gap-2">
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
    </StorySection>
}`,...e.parameters?.docs?.source}}};const v=["Variants","WithLabel"];export{r as Variants,e as WithLabel,v as __namedExportsOrder,x as default};
