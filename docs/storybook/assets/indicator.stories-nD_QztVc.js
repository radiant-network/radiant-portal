import{n as e}from"./rolldown-runtime-C0FnF6B9.js";import{t}from"./jsx-runtime-BdxMnOeJ.js";import{i as n,n as r}from"./story-section-DVTm6cGm.js";import{n as i,r as a}from"./utils-YvdnXddI.js";import{n as o,t as s}from"./indicator-CE8lAvwh.js";var c,l,u,d,f;function p(){return(p=e((()=>{o(),a(),n(),c=t(),l={title:`Features/Indicators/Indicator`,component:s,args:{}},u={args:{variant:`red`},render:()=>(0,c.jsx)(r,{title:`Variants`,children:(0,c.jsx)(`div`,{className:`flex flex-col items-start gap-2`,children:i.filter(e=>e!==void 0).map(e=>(0,c.jsxs)(`div`,{children:[(0,c.jsx)(s,{variant:e,symbol:`triangle-up`}),(0,c.jsx)(s,{variant:e,symbol:`triangle-down`}),(0,c.jsx)(s,{variant:e,symbol:`diamond`}),(0,c.jsx)(s,{variant:e,symbol:`circle`}),(0,c.jsx)(s,{variant:e,symbol:`triangle-up`,size:`sm`}),(0,c.jsx)(s,{variant:e,symbol:`triangle-down`,size:`sm`}),(0,c.jsx)(s,{variant:e,symbol:`diamond`,size:`sm`}),(0,c.jsx)(s,{variant:e,symbol:`circle`,size:`sm`})]},e))})})},d={args:{variant:`red`},render:()=>(0,c.jsx)(r,{title:`With label`,children:(0,c.jsx)(`div`,{className:`flex flex-col items-start gap-2`,children:i.filter(e=>e!==void 0).map(e=>(0,c.jsxs)(`div`,{children:[(0,c.jsx)(s,{variant:e,symbol:`triangle-up`,children:(0,c.jsx)(`span`,{children:`Text`})}),(0,c.jsx)(s,{variant:e,symbol:`triangle-down`,children:(0,c.jsx)(`span`,{children:`Text`})}),(0,c.jsx)(s,{variant:e,symbol:`diamond`,children:(0,c.jsx)(`span`,{children:`Text`})}),(0,c.jsx)(s,{variant:e,symbol:`circle`,children:(0,c.jsx)(`span`,{children:`Text`})}),(0,c.jsx)(s,{variant:e,symbol:`triangle-up`,size:`sm`,children:(0,c.jsx)(`span`,{children:`Text`})}),(0,c.jsx)(s,{variant:e,symbol:`triangle-down`,size:`sm`,children:(0,c.jsx)(`span`,{children:`Text`})}),(0,c.jsx)(s,{variant:e,symbol:`diamond`,size:`sm`,children:(0,c.jsx)(`span`,{children:`Text`})}),(0,c.jsx)(s,{variant:e,symbol:`circle`,size:`sm`,children:(0,c.jsx)(`span`,{children:`Text`})})]},e))})})},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
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
}`,...u.parameters?.docs?.source}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
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
}`,...d.parameters?.docs?.source}}},f=[`Variants`,`WithLabel`]})))()}p();export{u as Variants,d as WithLabel,f as __namedExportsOrder,l as default};