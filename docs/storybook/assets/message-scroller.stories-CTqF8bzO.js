import{n as e}from"./rolldown-runtime-C0FnF6B9.js";import{t}from"./jsx-runtime-BdxMnOeJ.js";import{c as n,l as r,n as i,r as a,s as o,t as s}from"./message-CkXCj2KI.js";import{n as c,t as l}from"./user-kCV1wli6.js";import{i as u,n as d}from"./story-section-DVTm6cGm.js";import{a as f,n as p,t as m}from"./bubble-aZ515Xoy.js";import{a as h,i as g,n as _,o as v,r as y,s as b,t as x}from"./message-scroller-DnHfvUlz.js";var S,C,w,T,E;function D(){return(D=e((()=>{r(),c(),f(),o(),b(),u(),S=t(),C={title:`Components/Chat/MessageScroller`,component:x},w=Array.from({length:12},(e,t)=>{let n=t%2==0?`start`:`end`;return{id:`msg-${t}`,align:n,text:n===`start`?`Assistant message #${t+1}: here is some context about your query.`:`Your message #${t+1}: can you tell me more?`}}),T={render:()=>(0,S.jsx)(d,{title:`Default`,description:`Scrollable conversation with a scroll-to-bottom control. Scroll up to reveal it.`,children:(0,S.jsx)(`div`,{className:`h-[420px] w-full max-w-md overflow-hidden rounded-lg border`,children:(0,S.jsx)(h,{children:(0,S.jsxs)(x,{children:[(0,S.jsx)(v,{className:`p-4`,children:(0,S.jsx)(y,{className:`gap-4`,children:w.map(e=>(0,S.jsx)(g,{messageId:e.id,children:(0,S.jsxs)(s,{align:e.align,children:[(0,S.jsx)(i,{className:`size-8`,children:e.align===`end`?(0,S.jsx)(l,{className:`size-4`}):(0,S.jsx)(n,{className:`size-4`})}),(0,S.jsx)(a,{children:(0,S.jsx)(m,{align:e.align,variant:e.align===`end`?`default`:`muted`,children:(0,S.jsx)(p,{children:e.text})})})]})},e.id))})}),(0,S.jsx)(_,{direction:`end`})]})})})})},T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`{
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
}`,...T.parameters?.docs?.source}}},E=[`Default`]})))()}D();export{T as Default,E as __namedExportsOrder,C as default};