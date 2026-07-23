import{j as e}from"./iframe-DUYxWSE4.js";import{B as s,a}from"./bubble-D7gU9B6D.js";import{M as n,a as t,B as d,b as r,e as u,c as g,d as b}from"./message-CapIoyZH.js";import{a as m}from"./story-section-BP93x530.js";import{U as h}from"./user-BTtjWrUh.js";import"./preload-helper-PPVm8Dsz.js";import"./index-3mYks1_5.js";const w={title:"Components/Chat/Message",component:n},o={render:()=>e.jsx(m,{title:"Default",description:"A row with an avatar and a bubble.",children:e.jsx("div",{className:"w-full max-w-md",children:e.jsxs(n,{align:"start",children:[e.jsx(t,{className:"size-8",children:e.jsx(d,{className:"size-4"})}),e.jsx(r,{children:e.jsx(s,{variant:"muted",children:e.jsx(a,{children:"Hi! How can I help you today?"})})})]})})})},i={render:()=>e.jsx(m,{title:"Alignment",description:"Incoming (start) and outgoing (end) messages.",children:e.jsxs("div",{className:"flex w-full max-w-md flex-col gap-4",children:[e.jsxs(n,{align:"start",children:[e.jsx(t,{className:"size-8",children:e.jsx(d,{className:"size-4"})}),e.jsx(r,{children:e.jsx(s,{variant:"muted",children:e.jsx(a,{children:"Hi! How can I help you today?"})})})]}),e.jsxs(n,{align:"end",children:[e.jsx(t,{className:"size-8",children:e.jsx(h,{className:"size-4"})}),e.jsx(r,{children:e.jsx(s,{children:e.jsx(a,{children:"I would like to explore a genomic case."})})})]})]})})},l={render:()=>e.jsx(m,{title:"With header & footer",description:"Sender name above, timestamp below.",children:e.jsx("div",{className:"w-full max-w-md",children:e.jsxs(n,{align:"start",children:[e.jsx(t,{className:"size-8",children:e.jsx(d,{className:"size-4"})}),e.jsxs(r,{children:[e.jsx(g,{children:"Assistant"}),e.jsx(s,{variant:"muted",children:e.jsx(a,{children:"Here are the variants matching your filters."})}),e.jsx(b,{children:"10:42 AM"})]})]})})})},c={render:()=>e.jsx(m,{title:"Group",description:"Consecutive messages from the same sender.",children:e.jsx("div",{className:"w-full max-w-md",children:e.jsxs(n,{align:"start",children:[e.jsx(t,{className:"size-8",children:e.jsx(d,{className:"size-4"})}),e.jsx(r,{children:e.jsxs(u,{children:[e.jsx(s,{variant:"muted",children:e.jsx(a,{children:"Let me look that up for you."})}),e.jsx(s,{variant:"muted",children:e.jsx(a,{children:"I found 3 matching cases."})})]})})]})})})};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  render: () => <StorySection title="Default" description="A row with an avatar and a bubble.">
      <div className="w-full max-w-md">
        <Message align="start">
          <MessageAvatar className="size-8">
            <Bot className="size-4" />
          </MessageAvatar>
          <MessageContent>
            <Bubble variant="muted">
              <BubbleContent>Hi! How can I help you today?</BubbleContent>
            </Bubble>
          </MessageContent>
        </Message>
      </div>
    </StorySection>
}`,...o.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  render: () => <StorySection title="Alignment" description="Incoming (start) and outgoing (end) messages.">
      <div className="flex w-full max-w-md flex-col gap-4">
        <Message align="start">
          <MessageAvatar className="size-8">
            <Bot className="size-4" />
          </MessageAvatar>
          <MessageContent>
            <Bubble variant="muted">
              <BubbleContent>Hi! How can I help you today?</BubbleContent>
            </Bubble>
          </MessageContent>
        </Message>
        <Message align="end">
          <MessageAvatar className="size-8">
            <User className="size-4" />
          </MessageAvatar>
          <MessageContent>
            <Bubble>
              <BubbleContent>I would like to explore a genomic case.</BubbleContent>
            </Bubble>
          </MessageContent>
        </Message>
      </div>
    </StorySection>
}`,...i.parameters?.docs?.source}}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  render: () => <StorySection title="With header & footer" description="Sender name above, timestamp below.">
      <div className="w-full max-w-md">
        <Message align="start">
          <MessageAvatar className="size-8">
            <Bot className="size-4" />
          </MessageAvatar>
          <MessageContent>
            <MessageHeader>Assistant</MessageHeader>
            <Bubble variant="muted">
              <BubbleContent>Here are the variants matching your filters.</BubbleContent>
            </Bubble>
            <MessageFooter>10:42 AM</MessageFooter>
          </MessageContent>
        </Message>
      </div>
    </StorySection>
}`,...l.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  render: () => <StorySection title="Group" description="Consecutive messages from the same sender.">
      <div className="w-full max-w-md">
        <Message align="start">
          <MessageAvatar className="size-8">
            <Bot className="size-4" />
          </MessageAvatar>
          <MessageContent>
            <MessageGroup>
              <Bubble variant="muted">
                <BubbleContent>Let me look that up for you.</BubbleContent>
              </Bubble>
              <Bubble variant="muted">
                <BubbleContent>I found 3 matching cases.</BubbleContent>
              </Bubble>
            </MessageGroup>
          </MessageContent>
        </Message>
      </div>
    </StorySection>
}`,...c.parameters?.docs?.source}}};const C=["Default","Alignment","WithHeaderFooter","Group"];export{i as Alignment,o as Default,c as Group,l as WithHeaderFooter,C as __namedExportsOrder,w as default};
