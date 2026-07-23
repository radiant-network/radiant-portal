import{j as e}from"./iframe-C6MOWQMA.js";import{B as n,a as t,b as c,c as b}from"./bubble-Po6jwhoX.js";import{a as i}from"./story-section-_wEsjD86.js";import"./preload-helper-PPVm8Dsz.js";import"./index-6QwHF8TM.js";const B={title:"Components/Chat/Bubble",component:n},u=["default","secondary","muted","tinted","outline","ghost","destructive"],r={render:()=>e.jsx(i,{title:"Variants",children:e.jsx("div",{className:"flex flex-col items-start gap-2",children:u.map(l=>e.jsx(n,{variant:l,children:e.jsxs(t,{children:[l," bubble"]})},l))})})},a={render:()=>e.jsx(i,{title:"Alignment",description:"Incoming aligns to the start, outgoing to the end.",children:e.jsxs("div",{className:"flex w-full max-w-md flex-col gap-2",children:[e.jsx(n,{align:"start",variant:"muted",children:e.jsx(t,{children:"Hi! How can I help you today?"})}),e.jsx(n,{align:"end",children:e.jsx(t,{children:"I would like to explore a genomic case."})})]})})},s={render:()=>e.jsx(i,{title:"Group",description:"Consecutive bubbles from the same sender.",children:e.jsxs(c,{className:"max-w-md",children:[e.jsx(n,{variant:"muted",children:e.jsx(t,{children:"First message."})}),e.jsx(n,{variant:"muted",children:e.jsx(t,{children:"A follow-up in the same group."})}),e.jsx(n,{variant:"muted",children:e.jsx(t,{children:"And one more."})})]})})},o={render:()=>e.jsx(i,{title:"With reactions",children:e.jsx("div",{className:"pb-4",children:e.jsxs(n,{variant:"muted",children:[e.jsx(t,{children:"Reactions sit on the bubble surface."}),e.jsx(b,{children:"👍 3"})]})})})};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  render: () => <StorySection title="Variants">
      <div className="flex flex-col items-start gap-2">
        {variants.map(variant => <Bubble key={variant} variant={variant}>
            <BubbleContent>{variant} bubble</BubbleContent>
          </Bubble>)}
      </div>
    </StorySection>
}`,...r.parameters?.docs?.source}}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
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
}`,...a.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
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
}`,...s.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  render: () => <StorySection title="With reactions">
      <div className="pb-4">
        <Bubble variant="muted">
          <BubbleContent>Reactions sit on the bubble surface.</BubbleContent>
          <BubbleReactions>👍 3</BubbleReactions>
        </Bubble>
      </div>
    </StorySection>
}`,...o.parameters?.docs?.source}}};const g=["Variants","Alignment","Group","WithReactions"];export{a as Alignment,s as Group,r as Variants,o as WithReactions,g as __namedExportsOrder,B as default};
