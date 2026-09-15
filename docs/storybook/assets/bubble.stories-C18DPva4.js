import{n as e}from"./rolldown-runtime-C0FnF6B9.js";import{t}from"./jsx-runtime-BdxMnOeJ.js";import{i as n,n as r}from"./story-section-DVTm6cGm.js";import{a as i,i as a,n as o,r as s,t as c}from"./bubble-aZ515Xoy.js";var l,u,d,f,p,m,h,g;function _(){return(_=e((()=>{i(),n(),l=t(),u={title:`Components/Chat/Bubble`,component:c},d=[`default`,`secondary`,`muted`,`tinted`,`outline`,`ghost`,`destructive`],f={render:()=>(0,l.jsx)(r,{title:`Variants`,children:(0,l.jsx)(`div`,{className:`flex flex-col items-start gap-2`,children:d.map(e=>(0,l.jsx)(c,{variant:e,children:(0,l.jsxs)(o,{children:[e,` bubble`]})},e))})})},p={render:()=>(0,l.jsx)(r,{title:`Alignment`,description:`Incoming aligns to the start, outgoing to the end.`,children:(0,l.jsxs)(`div`,{className:`flex w-full max-w-md flex-col gap-2`,children:[(0,l.jsx)(c,{align:`start`,variant:`muted`,children:(0,l.jsx)(o,{children:`Hi! How can I help you today?`})}),(0,l.jsx)(c,{align:`end`,children:(0,l.jsx)(o,{children:`I would like to explore a genomic case.`})})]})})},m={render:()=>(0,l.jsx)(r,{title:`Group`,description:`Consecutive bubbles from the same sender.`,children:(0,l.jsxs)(s,{className:`max-w-md`,children:[(0,l.jsx)(c,{variant:`muted`,children:(0,l.jsx)(o,{children:`First message.`})}),(0,l.jsx)(c,{variant:`muted`,children:(0,l.jsx)(o,{children:`A follow-up in the same group.`})}),(0,l.jsx)(c,{variant:`muted`,children:(0,l.jsx)(o,{children:`And one more.`})})]})})},h={render:()=>(0,l.jsx)(r,{title:`With reactions`,children:(0,l.jsx)(`div`,{className:`pb-4`,children:(0,l.jsxs)(c,{variant:`muted`,children:[(0,l.jsx)(o,{children:`Reactions sit on the bubble surface.`}),(0,l.jsx)(a,{children:`👍 3`})]})})})},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  render: () => <StorySection title="Variants">
      <div className="flex flex-col items-start gap-2">
        {variants.map(variant => <Bubble key={variant} variant={variant}>
            <BubbleContent>{variant} bubble</BubbleContent>
          </Bubble>)}
      </div>
    </StorySection>
}`,...f.parameters?.docs?.source}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  render: () => <StorySection title="Alignment" description="Incoming aligns to the start, outgoing to the end.">
      <div className="flex w-full max-w-md flex-col gap-2">
        <Bubble align="start" variant="muted">
          <BubbleContent>Hi! How can I help you today?</BubbleContent>
        </Bubble>
        <Bubble align="end">
          <BubbleContent>I would like to explore a genomic case.</BubbleContent>
        </Bubble>
      </div>
    </StorySection>
}`,...p.parameters?.docs?.source}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  render: () => <StorySection title="Group" description="Consecutive bubbles from the same sender.">
      <BubbleGroup className="max-w-md">
        <Bubble variant="muted">
          <BubbleContent>First message.</BubbleContent>
        </Bubble>
        <Bubble variant="muted">
          <BubbleContent>A follow-up in the same group.</BubbleContent>
        </Bubble>
        <Bubble variant="muted">
          <BubbleContent>And one more.</BubbleContent>
        </Bubble>
      </BubbleGroup>
    </StorySection>
}`,...m.parameters?.docs?.source}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  render: () => <StorySection title="With reactions">
      <div className="pb-4">
        <Bubble variant="muted">
          <BubbleContent>Reactions sit on the bubble surface.</BubbleContent>
          <BubbleReactions>👍 3</BubbleReactions>
        </Bubble>
      </div>
    </StorySection>
}`,...h.parameters?.docs?.source}}},g=[`Variants`,`Alignment`,`Group`,`WithReactions`]})))()}_();export{p as Alignment,m as Group,f as Variants,h as WithReactions,g as __namedExportsOrder,u as default};