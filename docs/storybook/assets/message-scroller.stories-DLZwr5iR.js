import{j as e}from"./iframe-DiGfbfp3.js";import{B as l,a as n}from"./bubble-HfaEG2OT.js";import{M as i,a as c,B as m,b as d}from"./message-C7MICkt-.js";import{M as t,a as g,b as p,c as u,d as M,e as S}from"./message-scroller-DzZ1NbJV.js";import{a as x}from"./story-section-DME95Whn.js";import{U as b}from"./user-CV5r7bOK.js";import"./preload-helper-PPVm8Dsz.js";import"./index-DI_ycpoJ.js";import"./button-Bo0DQutg.js";import"./action-button-De4ur-7I.js";import"./dropdown-menu-CNdkncgA.js";import"./index-D8Osr2Vx.js";import"./index-BZGt5Ho_.js";import"./check-IkDt6mIM.js";import"./circle-BTr0m0BF.js";import"./separator-Dj9939qF.js";import"./i18n-uvvEETAD.js";import"./index-Cn_qWDha.js";import"./arrow-down-C4aRpq4y.js";const q={title:"Components/Chat/MessageScroller",component:t},h=Array.from({length:12},(s,r)=>{const o=r%2===0?"start":"end";return{id:`msg-${r}`,align:o,text:o==="start"?`Assistant message #${r+1}: here is some context about your query.`:`Your message #${r+1}: can you tell me more?`}}),a={render:()=>e.jsx(x,{title:"Default",description:"Scrollable conversation with a scroll-to-bottom control. Scroll up to reveal it.",children:e.jsx("div",{className:"h-[420px] w-full max-w-md overflow-hidden rounded-lg border",children:e.jsx(g,{children:e.jsxs(t,{children:[e.jsx(p,{className:"p-4",children:e.jsx(u,{className:"gap-4",children:h.map(s=>e.jsx(M,{messageId:s.id,children:e.jsxs(i,{align:s.align,children:[e.jsx(c,{className:"size-8",children:s.align==="end"?e.jsx(b,{className:"size-4"}):e.jsx(m,{className:"size-4"})}),e.jsx(d,{children:e.jsx(l,{align:s.align,variant:s.align==="end"?"default":"muted",children:e.jsx(n,{children:s.text})})})]})},s.id))})}),e.jsx(S,{direction:"end"})]})})})})};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
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
}`,...a.parameters?.docs?.source}}};const O=["Default"];export{a as Default,O as __namedExportsOrder,q as default};
