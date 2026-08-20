import{a as x,j as e}from"./iframe-c2IPk3oe.js";import{A as t,a as r,b as a,c as o}from"./accordion-Csrl2EeG.js";import{B as h}from"./badge-BZB0Hphq.js";import{C as y,a as v,b,c as f,d as A}from"./card-C6gXMcNZ.js";import{S as s,a as i,b as c}from"./story-section-CAEPkWC7.js";import{H as j}from"./house-BD8KwiiW.js";import"./preload-helper-PPVm8Dsz.js";import"./index-BxFSGfgl.js";import"./index-B755i5HK.js";import"./isEqual-NEHDhy_1.js";import"./_baseUniq-Bnm1mgG0.js";import"./chevron-right-BLB89RYQ.js";import"./chevron-down-g2DBveUu.js";import"./separator-CC9AvFe8.js";import"./x-DSPDcSor.js";const S=[["path",{d:"M16 10a4 4 0 0 1-8 0",key:"1ltviw"}],["path",{d:"M3.103 6.034h17.794",key:"awc11p"}],["path",{d:"M3.4 5.467a2 2 0 0 0-.4 1.2V20a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6.667a2 2 0 0 0-.4-1.2l-2-2.667A2 2 0 0 0 17 2H7a2 2 0 0 0-1.6.8z",key:"o988cm"}]],w=x("shopping-bag",S);const N=[["path",{d:"M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2",key:"wrbu53"}],["path",{d:"M15 18H9",key:"1lyqi6"}],["path",{d:"M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14",key:"lysw3i"}],["circle",{cx:"17",cy:"18",r:"2",key:"332jqn"}],["circle",{cx:"7",cy:"18",r:"2",key:"19iecd"}]],C=x("truck",N),l=[{value:"accessible",question:"Is it accessible?",answer:"Yes. It adheres to the WAI-ARIA design pattern."},{value:"styled",question:"Is it styled?",answer:"Yes. It comes with default styles from our design system."},{value:"animated",question:"Is it animated?",answer:"Yes. It uses the accordion-up / accordion-down keyframes."}],g=[{value:"plans",question:"What subscription plans do you offer?",answer:"We offer three subscription tiers: Starter ($9/month), Professional ($29/month), and Enterprise ($99/month). Each plan includes increasing storage limits, API access, priority support, and team collaboration features."},{value:"billing",question:"How does billing work?",answer:"Plans are billed monthly on the day you subscribed. Annual billing is available with a 20% discount."},{value:"cancel",question:"How do I cancel my subscription?",answer:"Cancel any time from your account settings. Your plan stays active until the end of the current period."}],d=[{value:"order",label:"Order Complete",icon:w,detail:"Order confirmed on July 5th at 9:12am."},{value:"delivery",label:"Out for delivery",icon:C,badge:"Free",detail:"Handed to the carrier on July 7th at 6:40am."},{value:"delivered",label:"Delivered",icon:j,detail:"Signed by Adam on July 8th at 2:25pm."}],W={title:"Components/Accordion",component:t,args:{type:"single",collapsible:!0}},m={render:()=>e.jsxs(s,{children:[e.jsxs(s,{direction:"row",children:[e.jsx(i,{title:"Chevron left",description:"Default placement — one item open at a time.",children:e.jsx(t,{type:"single",collapsible:!0,defaultValue:"accessible",style:{width:420},children:l.map(n=>e.jsxs(r,{value:n.value,children:[e.jsx(a,{children:e.jsx("span",{className:"font-medium",children:n.question})}),e.jsx(o,{style:{paddingLeft:24},children:n.answer})]},n.value))})}),e.jsx(i,{title:"Chevron right",description:"Chevron pushed to the far right of the trigger.",children:e.jsx(t,{type:"single",collapsible:!0,defaultValue:"accessible",style:{width:420},children:l.map(n=>e.jsxs(r,{value:n.value,children:[e.jsx(a,{chevronPlacement:"right",children:e.jsx("span",{className:"font-medium",children:n.question})}),e.jsx(o,{children:n.answer})]},n.value))})})]}),e.jsxs(s,{direction:"row",children:[e.jsx(i,{title:"Bordered",description:"Wrap the accordion in a border and pad the items for a card look.",children:e.jsx(t,{type:"single",collapsible:!0,defaultValue:"accessible",className:"rounded-md border",style:{width:420},children:l.map(n=>e.jsxs(r,{value:n.value,className:"px-4 last:border-b-0",children:[e.jsx(a,{chevronPlacement:"right",children:e.jsx("span",{className:"font-medium",children:n.question})}),e.jsx(o,{children:n.answer})]},n.value))})}),e.jsx(i,{title:"Multiple",description:"Several items can stay open at the same time.",children:e.jsx(t,{type:"multiple",defaultValue:["accessible","styled"],style:{width:420},children:l.map(n=>e.jsxs(r,{value:n.value,children:[e.jsx(a,{chevronPlacement:"right",children:e.jsx("span",{className:"font-medium",children:n.question})}),e.jsx(o,{children:n.answer})]},n.value))})})]})]})},p={render:()=>e.jsx(i,{title:"States",description:"Press Tab to reveal the focus ring — it wraps the whole trigger row.",children:e.jsxs("div",{className:"flex flex-col gap-6",style:{width:480},children:[e.jsxs("div",{className:"flex flex-col gap-2",children:[e.jsx(c,{children:"Closed"}),e.jsx(t,{type:"single",collapsible:!0,children:e.jsxs(r,{value:"trigger",children:[e.jsx(a,{chevronPlacement:"right",children:e.jsx("span",{className:"font-medium",children:"Trigger Text"})}),e.jsx(o,{children:"This is an accordion content."})]})})]}),e.jsxs("div",{className:"flex flex-col gap-2",children:[e.jsx(c,{children:"Open"}),e.jsx(t,{type:"single",collapsible:!0,defaultValue:"trigger",children:e.jsxs(r,{value:"trigger",children:[e.jsx(a,{chevronPlacement:"right",children:e.jsx("span",{className:"font-medium",children:"Trigger Text"})}),e.jsx(o,{children:"This is an accordion content."})]})})]}),e.jsxs("div",{className:"flex flex-col gap-2",children:[e.jsx(c,{children:"Disabled — closed"}),e.jsx(t,{type:"single",collapsible:!0,children:e.jsxs(r,{value:"trigger",disabled:!0,children:[e.jsx(a,{chevronPlacement:"right",children:e.jsx("span",{className:"font-medium",children:"Trigger Text"})}),e.jsx(o,{children:"This is an accordion content."})]})})]}),e.jsxs("div",{className:"flex flex-col gap-2",children:[e.jsx(c,{children:"Disabled — open"}),e.jsx(t,{type:"single",collapsible:!0,defaultValue:"trigger",children:e.jsxs(r,{value:"trigger",disabled:!0,children:[e.jsx(a,{chevronPlacement:"right",children:e.jsx("span",{className:"font-medium",children:"Trigger Text"})}),e.jsx(o,{children:"This is an accordion content."})]})})]})]})})},u={render:()=>e.jsxs(s,{direction:"row",children:[e.jsx(i,{title:"In a card",description:"FAQ block — the card provides the border, the items only separate.",children:e.jsxs(y,{style:{width:440},children:[e.jsxs(v,{children:[e.jsx(b,{children:"Subscription & Billing"}),e.jsx(f,{children:"Common questions about your account, plans, payments and cancellations."})]}),e.jsx(A,{children:e.jsx(t,{type:"single",collapsible:!0,defaultValue:g[0].value,children:g.map(n=>e.jsxs(r,{value:n.value,className:"last:border-b-0",children:[e.jsx(a,{chevronPlacement:"right",children:e.jsx("span",{className:"font-medium",children:n.question})}),e.jsx(o,{className:"pr-8 text-muted-foreground",children:n.answer})]},n.value))})})]})}),e.jsxs(s,{children:[e.jsx(i,{title:"Custom content",description:"An icon and a badge next to the label — any node can go in the trigger.",children:e.jsx(t,{type:"single",collapsible:!0,defaultValue:d[2].value,style:{width:440},children:d.map(n=>e.jsxs(r,{value:n.value,className:"last:border-b-0",children:[e.jsx(a,{children:e.jsxs("span",{className:"flex items-center gap-2",children:[e.jsx(n.icon,{className:"size-4 text-muted-foreground"}),e.jsx("span",{className:"font-medium",children:n.label}),n.badge&&e.jsx(h,{variant:"green",children:n.badge})]})}),e.jsx(o,{className:"text-muted-foreground",style:{paddingLeft:48},children:n.detail})]},n.value))})}),e.jsx(i,{title:"Custom content bordered",description:"Same items, chevron on the right, inside a bordered container.",children:e.jsx(t,{type:"single",collapsible:!0,defaultValue:d[2].value,className:"rounded-md border",style:{width:440},children:d.map(n=>e.jsxs(r,{value:n.value,className:"px-4 last:border-b-0",children:[e.jsx(a,{chevronPlacement:"right",className:"py-3",children:e.jsxs("span",{className:"flex items-center gap-2",children:[e.jsx(n.icon,{className:"size-4 text-muted-foreground"}),e.jsx("span",{className:"font-medium",children:n.label}),n.badge&&e.jsx(h,{variant:"green",children:n.badge})]})}),e.jsx(o,{className:"pb-3 text-muted-foreground",children:n.detail})]},n.value))})})]})]})};m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  render: () => <StoryShowcase>
      <StoryShowcase direction="row">
        <StorySection title="Chevron left" description="Default placement — one item open at a time.">
          <Accordion type="single" collapsible defaultValue="accessible" style={{
          width: 420
        }}>
            {items.map(item => <AccordionItem key={item.value} value={item.value}>
                <AccordionTrigger>
                  <span className="font-medium">{item.question}</span>
                </AccordionTrigger>
                <AccordionContent style={{
              paddingLeft: 24
            }}>{item.answer}</AccordionContent>
              </AccordionItem>)}
          </Accordion>
        </StorySection>
        <StorySection title="Chevron right" description="Chevron pushed to the far right of the trigger.">
          <Accordion type="single" collapsible defaultValue="accessible" style={{
          width: 420
        }}>
            {items.map(item => <AccordionItem key={item.value} value={item.value}>
                <AccordionTrigger chevronPlacement="right">
                  <span className="font-medium">{item.question}</span>
                </AccordionTrigger>
                <AccordionContent>{item.answer}</AccordionContent>
              </AccordionItem>)}
          </Accordion>
        </StorySection>
      </StoryShowcase>
      <StoryShowcase direction="row">
        <StorySection title="Bordered" description="Wrap the accordion in a border and pad the items for a card look.">
          <Accordion type="single" collapsible defaultValue="accessible" className="rounded-md border" style={{
          width: 420
        }}>
            {items.map(item => <AccordionItem key={item.value} value={item.value} className="px-4 last:border-b-0">
                <AccordionTrigger chevronPlacement="right">
                  <span className="font-medium">{item.question}</span>
                </AccordionTrigger>
                <AccordionContent>{item.answer}</AccordionContent>
              </AccordionItem>)}
          </Accordion>
        </StorySection>
        <StorySection title="Multiple" description="Several items can stay open at the same time.">
          <Accordion type="multiple" defaultValue={['accessible', 'styled']} style={{
          width: 420
        }}>
            {items.map(item => <AccordionItem key={item.value} value={item.value}>
                <AccordionTrigger chevronPlacement="right">
                  <span className="font-medium">{item.question}</span>
                </AccordionTrigger>
                <AccordionContent>{item.answer}</AccordionContent>
              </AccordionItem>)}
          </Accordion>
        </StorySection>
      </StoryShowcase>
    </StoryShowcase>
}`,...m.parameters?.docs?.source}}};p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  render: () => <StorySection title="States" description="Press Tab to reveal the focus ring — it wraps the whole trigger row.">
      <div className="flex flex-col gap-6" style={{
      width: 480
    }}>
        <div className="flex flex-col gap-2">
          <StoryLabel>Closed</StoryLabel>
          <Accordion type="single" collapsible>
            <AccordionItem value="trigger">
              <AccordionTrigger chevronPlacement="right">
                <span className="font-medium">Trigger Text</span>
              </AccordionTrigger>
              <AccordionContent>This is an accordion content.</AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
        <div className="flex flex-col gap-2">
          <StoryLabel>Open</StoryLabel>
          <Accordion type="single" collapsible defaultValue="trigger">
            <AccordionItem value="trigger">
              <AccordionTrigger chevronPlacement="right">
                <span className="font-medium">Trigger Text</span>
              </AccordionTrigger>
              <AccordionContent>This is an accordion content.</AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
        <div className="flex flex-col gap-2">
          <StoryLabel>Disabled — closed</StoryLabel>
          <Accordion type="single" collapsible>
            <AccordionItem value="trigger" disabled>
              <AccordionTrigger chevronPlacement="right">
                <span className="font-medium">Trigger Text</span>
              </AccordionTrigger>
              <AccordionContent>This is an accordion content.</AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
        <div className="flex flex-col gap-2">
          <StoryLabel>Disabled — open</StoryLabel>
          <Accordion type="single" collapsible defaultValue="trigger">
            <AccordionItem value="trigger" disabled>
              <AccordionTrigger chevronPlacement="right">
                <span className="font-medium">Trigger Text</span>
              </AccordionTrigger>
              <AccordionContent>This is an accordion content.</AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </StorySection>
}`,...p.parameters?.docs?.source}}};u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  render: () => <StoryShowcase direction="row">
      <StorySection title="In a card" description="FAQ block — the card provides the border, the items only separate.">
        <Card style={{
        width: 440
      }}>
          <CardHeader>
            <CardTitle>Subscription &amp; Billing</CardTitle>
            <CardDescription>Common questions about your account, plans, payments and cancellations.</CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible defaultValue={faq[0].value}>
              {faq.map(item => <AccordionItem key={item.value} value={item.value} className="last:border-b-0">
                  <AccordionTrigger chevronPlacement="right">
                    <span className="font-medium">{item.question}</span>
                  </AccordionTrigger>
                  <AccordionContent className="pr-8 text-muted-foreground">{item.answer}</AccordionContent>
                </AccordionItem>)}
            </Accordion>
          </CardContent>
        </Card>
      </StorySection>
      <StoryShowcase>
        <StorySection title="Custom content" description="An icon and a badge next to the label — any node can go in the trigger.">
          <Accordion type="single" collapsible defaultValue={steps[2].value} style={{
          width: 440
        }}>
            {steps.map(step => <AccordionItem key={step.value} value={step.value} className="last:border-b-0">
                <AccordionTrigger>
                  <span className="flex items-center gap-2">
                    <step.icon className="size-4 text-muted-foreground" />
                    <span className="font-medium">{step.label}</span>
                    {step.badge && <Badge variant="green">{step.badge}</Badge>}
                  </span>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground" style={{
              paddingLeft: 48
            }}>
                  {step.detail}
                </AccordionContent>
              </AccordionItem>)}
          </Accordion>
        </StorySection>
        <StorySection title="Custom content bordered" description="Same items, chevron on the right, inside a bordered container.">
          <Accordion type="single" collapsible defaultValue={steps[2].value} className="rounded-md border" style={{
          width: 440
        }}>
            {steps.map(step => <AccordionItem key={step.value} value={step.value} className="px-4 last:border-b-0">
                <AccordionTrigger chevronPlacement="right" className="py-3">
                  <span className="flex items-center gap-2">
                    <step.icon className="size-4 text-muted-foreground" />
                    <span className="font-medium">{step.label}</span>
                    {step.badge && <Badge variant="green">{step.badge}</Badge>}
                  </span>
                </AccordionTrigger>
                <AccordionContent className="pb-3 text-muted-foreground">{step.detail}</AccordionContent>
              </AccordionItem>)}
          </Accordion>
        </StorySection>
      </StoryShowcase>
    </StoryShowcase>
}`,...u.parameters?.docs?.source}}};const Y=["Default","States","Examples"];export{m as Default,u as Examples,p as States,Y as __namedExportsOrder,W as default};
