import{n as e}from"./rolldown-runtime-C0FnF6B9.js";import{t}from"./jsx-runtime-BdxMnOeJ.js";import{a as n,c as r,i,l as a,n as o,o as s,r as c,s as l,t as u}from"./message-CkXCj2KI.js";import{n as d,t as f}from"./user-kCV1wli6.js";import{i as p,n as m}from"./story-section-DVTm6cGm.js";import{a as h,n as g,t as _}from"./bubble-aZ515Xoy.js";var v,y,b,x,S,C,w;function T(){return(T=e((()=>{a(),d(),h(),l(),p(),v=t(),y={title:`Components/Chat/Message`,component:u},b={render:()=>(0,v.jsx)(m,{title:`Default`,description:`A row with an avatar and a bubble.`,children:(0,v.jsx)(`div`,{className:`w-full max-w-md`,children:(0,v.jsxs)(u,{align:`start`,children:[(0,v.jsx)(o,{className:`size-8`,children:(0,v.jsx)(r,{className:`size-4`})}),(0,v.jsx)(c,{children:(0,v.jsx)(_,{variant:`muted`,children:(0,v.jsx)(g,{children:`Hi! How can I help you today?`})})})]})})})},x={render:()=>(0,v.jsx)(m,{title:`Alignment`,description:`Incoming (start) and outgoing (end) messages.`,children:(0,v.jsxs)(`div`,{className:`flex w-full max-w-md flex-col gap-4`,children:[(0,v.jsxs)(u,{align:`start`,children:[(0,v.jsx)(o,{className:`size-8`,children:(0,v.jsx)(r,{className:`size-4`})}),(0,v.jsx)(c,{children:(0,v.jsx)(_,{variant:`muted`,children:(0,v.jsx)(g,{children:`Hi! How can I help you today?`})})})]}),(0,v.jsxs)(u,{align:`end`,children:[(0,v.jsx)(o,{className:`size-8`,children:(0,v.jsx)(f,{className:`size-4`})}),(0,v.jsx)(c,{children:(0,v.jsx)(_,{children:(0,v.jsx)(g,{children:`I would like to explore a genomic case.`})})})]})]})})},S={render:()=>(0,v.jsx)(m,{title:`With header & footer`,description:`Sender name above, timestamp below.`,children:(0,v.jsx)(`div`,{className:`w-full max-w-md`,children:(0,v.jsxs)(u,{align:`start`,children:[(0,v.jsx)(o,{className:`size-8`,children:(0,v.jsx)(r,{className:`size-4`})}),(0,v.jsxs)(c,{children:[(0,v.jsx)(s,{children:`Assistant`}),(0,v.jsx)(_,{variant:`muted`,children:(0,v.jsx)(g,{children:`Here are the variants matching your filters.`})}),(0,v.jsx)(i,{children:`10:42 AM`})]})]})})})},C={render:()=>(0,v.jsx)(m,{title:`Group`,description:`Consecutive messages from the same sender.`,children:(0,v.jsx)(`div`,{className:`w-full max-w-md`,children:(0,v.jsxs)(u,{align:`start`,children:[(0,v.jsx)(o,{className:`size-8`,children:(0,v.jsx)(r,{className:`size-4`})}),(0,v.jsx)(c,{children:(0,v.jsxs)(n,{children:[(0,v.jsx)(_,{variant:`muted`,children:(0,v.jsx)(g,{children:`Let me look that up for you.`})}),(0,v.jsx)(_,{variant:`muted`,children:(0,v.jsx)(g,{children:`I found 3 matching cases.`})})]})})]})})})},b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
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
}`,...b.parameters?.docs?.source}}},x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
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
}`,...x.parameters?.docs?.source}}},S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`{
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
}`,...S.parameters?.docs?.source}}},C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`{
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
}`,...C.parameters?.docs?.source}}},w=[`Default`,`Alignment`,`WithHeaderFooter`,`Group`]})))()}T();export{x as Alignment,b as Default,C as Group,S as WithHeaderFooter,w as __namedExportsOrder,y as default};