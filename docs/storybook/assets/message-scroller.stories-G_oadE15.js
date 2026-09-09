import{j as e}from"./iframe-CgZaKe5d.js";import{B as l,a as n}from"./bubble-BVQDXpVZ.js";import{M as i,a as c,B as d,b as m}from"./message-CoL340n6.js";import{M as t,a as g,b as p,c as u,d as M,e as S}from"./message-scroller-fbgL9-zW.js";import{a as x}from"./story-section-Cd-IQlgl.js";import{U as b}from"./user-9xVxgcUq.js";import"./preload-helper-PPVm8Dsz.js";import"./index-DOoNJz6V.js";import"./arrow-down-CaJyK_9-.js";const A={title:"Components/Chat/MessageScroller",component:t},h=Array.from({length:12},(s,a)=>{const o=a%2===0?"start":"end";return{id:`msg-${a}`,align:o,text:o==="start"?`Assistant message #${a+1}: here is some context about your query.`:`Your message #${a+1}: can you tell me more?`}}),r={render:()=>e.jsx(x,{title:"Default",description:"Scrollable conversation with a scroll-to-bottom control. Scroll up to reveal it.",children:e.jsx("div",{className:"h-[420px] w-full max-w-md overflow-hidden rounded-lg border",children:e.jsx(g,{children:e.jsxs(t,{children:[e.jsx(p,{className:"p-4",children:e.jsx(u,{className:"gap-4",children:h.map(s=>e.jsx(M,{messageId:s.id,children:e.jsxs(i,{align:s.align,children:[e.jsx(c,{className:"size-8",children:s.align==="end"?e.jsx(b,{className:"size-4"}):e.jsx(d,{className:"size-4"})}),e.jsx(m,{children:e.jsx(l,{align:s.align,variant:s.align==="end"?"default":"muted",children:e.jsx(n,{children:s.text})})})]})},s.id))})}),e.jsx(S,{direction:"end"})]})})})})};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  render: () => <StorySection title="Default" description="Scrollable conversation with a scroll-to-bottom control. Scroll up to reveal it.">
      <div className="h-[420px] w-full max-w-md overflow-hidden rounded-lg border">
        <MessageScrollerProvider>
          <MessageScroller>
            <MessageScrollerViewport className="p-4">
              <MessageScrollerContent className="gap-4">
                {conversation.map(message => <MessageScrollerItem key={message.id} messageId={message.id}>
                    <Message align={message.align}>
                      <MessageAvatar className="size-8">
                        {message.align === 'end' ? <User className="size-4" /> : <Bot className="size-4" />}
                      </MessageAvatar>
                      <MessageContent>
                        <Bubble align={message.align} variant={message.align === 'end' ? 'default' : 'muted'}>
                          <BubbleContent>{message.text}</BubbleContent>
                        </Bubble>
                      </MessageContent>
                    </Message>
                  </MessageScrollerItem>)}
              </MessageScrollerContent>
            </MessageScrollerViewport>
            <MessageScrollerButton direction="end" />
          </MessageScroller>
        </MessageScrollerProvider>
      </div>
    </StorySection>
}`,...r.parameters?.docs?.source}}};const I=["Default"];export{r as Default,I as __namedExportsOrder,A as default};
