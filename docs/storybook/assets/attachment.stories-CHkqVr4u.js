import{j as t}from"./iframe-DDMqSXul.js";import{A as n,a,b as r,c as i,d as s,e as A,f as x,g as j}from"./attachment-CXDfp5-4.js";import{a as o}from"./story-section-29Pt7KkT.js";import{F as c}from"./file-text-Dkntw11C.js";import{X as f}from"./x-nQNHfXDX.js";import"./preload-helper-PPVm8Dsz.js";import"./index-CrIDshkt.js";import"./button-C-NfkkWm.js";import"./action-button-WewT5ZPN.js";import"./dropdown-menu-DIoiAg_I.js";import"./index-BwmN7QES.js";import"./index-BwIDj-Vk.js";import"./check-Dl2pt11_.js";import"./circle-CRiw5vp4.js";import"./separator-Cc_T2enW.js";import"./i18n-C88g_mn6.js";import"./index-Ch5te5Xr.js";const R={title:"Components/Chat/Attachment",component:n},u=["idle","uploading","processing","error","done"],m={render:()=>t.jsx(o,{title:"Default",children:t.jsxs(n,{children:[t.jsx(a,{children:t.jsx(c,{})}),t.jsxs(r,{children:[t.jsx(i,{children:"variants-export.csv"}),t.jsx(s,{children:"24 KB"})]}),t.jsx(A,{children:t.jsx(x,{"aria-label":"Remove attachment",children:t.jsx(f,{})})})]})})},l={render:()=>t.jsx(o,{title:"States",description:"idle · uploading · processing · error · done.",children:t.jsx("div",{className:"flex flex-col items-start gap-3",children:u.map(e=>t.jsxs(n,{state:e,children:[t.jsx(a,{children:t.jsx(c,{})}),t.jsxs(r,{children:[t.jsx(i,{children:"report.pdf"}),t.jsx(s,{children:e})]})]},e))})})},d={render:()=>t.jsx(o,{title:"Orientation",description:"Horizontal (default) and vertical.",children:t.jsxs("div",{className:"flex flex-wrap items-start gap-4",children:[t.jsxs(n,{orientation:"horizontal",children:[t.jsx(a,{children:t.jsx(c,{})}),t.jsxs(r,{children:[t.jsx(i,{children:"report.pdf"}),t.jsx(s,{children:"1.2 MB"})]})]}),t.jsxs(n,{orientation:"vertical",children:[t.jsx(a,{children:t.jsx(c,{})}),t.jsxs(r,{children:[t.jsx(i,{children:"report.pdf"}),t.jsx(s,{children:"1.2 MB"})]})]})]})})},h={render:()=>t.jsx(o,{title:"Sizes",description:"default · sm · xs.",children:t.jsx("div",{className:"flex flex-col items-start gap-3",children:["default","sm","xs"].map(e=>t.jsxs(n,{size:e,children:[t.jsx(a,{children:t.jsx(c,{})}),t.jsxs(r,{children:[t.jsx(i,{children:"report.pdf"}),t.jsx(s,{children:e})]})]},e))})})},p={render:()=>t.jsx(o,{title:"Group",description:"A horizontally scrollable row of attachments.",children:t.jsx("div",{className:"w-full max-w-md",children:t.jsx(j,{children:["variants.csv","report.pdf","notes.txt","cohort.json"].map(e=>t.jsxs(n,{size:"sm",children:[t.jsx(a,{children:t.jsx(c,{})}),t.jsxs(r,{children:[t.jsx(i,{children:e}),t.jsx(s,{children:"attachment"})]})]},e))})})})};m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  render: () => <StorySection title="Default">
      <Attachment>
        <AttachmentMedia>
          <FileText />
        </AttachmentMedia>
        <AttachmentContent>
          <AttachmentTitle>variants-export.csv</AttachmentTitle>
          <AttachmentDescription>24 KB</AttachmentDescription>
        </AttachmentContent>
        <AttachmentActions>
          <AttachmentAction aria-label="Remove attachment">
            <X />
          </AttachmentAction>
        </AttachmentActions>
      </Attachment>
    </StorySection>
}`,...m.parameters?.docs?.source}}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  render: () => <StorySection title="States" description="idle · uploading · processing · error · done.">
      <div className="flex flex-col items-start gap-3">
        {states.map(state => <Attachment key={state} state={state}>
            <AttachmentMedia>
              <FileText />
            </AttachmentMedia>
            <AttachmentContent>
              <AttachmentTitle>report.pdf</AttachmentTitle>
              <AttachmentDescription>{state}</AttachmentDescription>
            </AttachmentContent>
          </Attachment>)}
      </div>
    </StorySection>
}`,...l.parameters?.docs?.source}}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  render: () => <StorySection title="Orientation" description="Horizontal (default) and vertical.">
      <div className="flex flex-wrap items-start gap-4">
        <Attachment orientation="horizontal">
          <AttachmentMedia>
            <FileText />
          </AttachmentMedia>
          <AttachmentContent>
            <AttachmentTitle>report.pdf</AttachmentTitle>
            <AttachmentDescription>1.2 MB</AttachmentDescription>
          </AttachmentContent>
        </Attachment>
        <Attachment orientation="vertical">
          <AttachmentMedia>
            <FileText />
          </AttachmentMedia>
          <AttachmentContent>
            <AttachmentTitle>report.pdf</AttachmentTitle>
            <AttachmentDescription>1.2 MB</AttachmentDescription>
          </AttachmentContent>
        </Attachment>
      </div>
    </StorySection>
}`,...d.parameters?.docs?.source}}};h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  render: () => <StorySection title="Sizes" description="default · sm · xs.">
      <div className="flex flex-col items-start gap-3">
        {(['default', 'sm', 'xs'] as const).map(size => <Attachment key={size} size={size}>
            <AttachmentMedia>
              <FileText />
            </AttachmentMedia>
            <AttachmentContent>
              <AttachmentTitle>report.pdf</AttachmentTitle>
              <AttachmentDescription>{size}</AttachmentDescription>
            </AttachmentContent>
          </Attachment>)}
      </div>
    </StorySection>
}`,...h.parameters?.docs?.source}}};p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  render: () => <StorySection title="Group" description="A horizontally scrollable row of attachments.">
      <div className="w-full max-w-md">
        <AttachmentGroup>
          {['variants.csv', 'report.pdf', 'notes.txt', 'cohort.json'].map(name => <Attachment key={name} size="sm">
              <AttachmentMedia>
                <FileText />
              </AttachmentMedia>
              <AttachmentContent>
                <AttachmentTitle>{name}</AttachmentTitle>
                <AttachmentDescription>attachment</AttachmentDescription>
              </AttachmentContent>
            </Attachment>)}
        </AttachmentGroup>
      </div>
    </StorySection>
}`,...p.parameters?.docs?.source}}};const E=["Default","States","Orientation","Sizes","Group"];export{m as Default,p as Group,d as Orientation,h as Sizes,l as States,E as __namedExportsOrder,R as default};
