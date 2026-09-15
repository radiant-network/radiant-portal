import{n as e}from"./rolldown-runtime-C0FnF6B9.js";import{t}from"./jsx-runtime-BdxMnOeJ.js";import{n,t as r}from"./file-text-DLvHsPz8.js";import{n as i,t as a}from"./x-H4Ywn8aG.js";import{i as o,n as s}from"./story-section-DVTm6cGm.js";import{a as c,c as l,i as u,l as d,n as f,o as p,r as m,s as h,t as g}from"./attachment-jolsGDWT.js";var _,v,y,b,x,S,C,w,T;function E(){return(E=e((()=>{n(),i(),d(),o(),_=t(),v={title:`Components/Chat/Attachment`,component:g},y=[`idle`,`uploading`,`processing`,`error`,`done`],b={render:()=>(0,_.jsx)(s,{title:`Default`,children:(0,_.jsxs)(g,{children:[(0,_.jsx)(h,{children:(0,_.jsx)(r,{})}),(0,_.jsxs)(u,{children:[(0,_.jsx)(l,{children:`variants-export.csv`}),(0,_.jsx)(c,{children:`24 KB`})]}),(0,_.jsx)(m,{children:(0,_.jsx)(f,{"aria-label":`Remove attachment`,children:(0,_.jsx)(a,{})})})]})})},x={render:()=>(0,_.jsx)(s,{title:`States`,description:`idle · uploading · processing · error · done.`,children:(0,_.jsx)(`div`,{className:`flex flex-col items-start gap-3`,children:y.map(e=>(0,_.jsxs)(g,{state:e,children:[(0,_.jsx)(h,{children:(0,_.jsx)(r,{})}),(0,_.jsxs)(u,{children:[(0,_.jsx)(l,{children:`report.pdf`}),(0,_.jsx)(c,{children:e})]})]},e))})})},S={render:()=>(0,_.jsx)(s,{title:`Orientation`,description:`Horizontal (default) and vertical.`,children:(0,_.jsxs)(`div`,{className:`flex flex-wrap items-start gap-4`,children:[(0,_.jsxs)(g,{orientation:`horizontal`,children:[(0,_.jsx)(h,{children:(0,_.jsx)(r,{})}),(0,_.jsxs)(u,{children:[(0,_.jsx)(l,{children:`report.pdf`}),(0,_.jsx)(c,{children:`1.2 MB`})]})]}),(0,_.jsxs)(g,{orientation:`vertical`,children:[(0,_.jsx)(h,{children:(0,_.jsx)(r,{})}),(0,_.jsxs)(u,{children:[(0,_.jsx)(l,{children:`report.pdf`}),(0,_.jsx)(c,{children:`1.2 MB`})]})]})]})})},C={render:()=>(0,_.jsx)(s,{title:`Sizes`,description:`default · sm · xs.`,children:(0,_.jsx)(`div`,{className:`flex flex-col items-start gap-3`,children:[`default`,`sm`,`xs`].map(e=>(0,_.jsxs)(g,{size:e,children:[(0,_.jsx)(h,{children:(0,_.jsx)(r,{})}),(0,_.jsxs)(u,{children:[(0,_.jsx)(l,{children:`report.pdf`}),(0,_.jsx)(c,{children:e})]})]},e))})})},w={render:()=>(0,_.jsx)(s,{title:`Group`,description:`A horizontally scrollable row of attachments.`,children:(0,_.jsx)(`div`,{className:`w-full max-w-md`,children:(0,_.jsx)(p,{children:[`variants.csv`,`report.pdf`,`notes.txt`,`cohort.json`].map(e=>(0,_.jsxs)(g,{size:`sm`,children:[(0,_.jsx)(h,{children:(0,_.jsx)(r,{})}),(0,_.jsxs)(u,{children:[(0,_.jsx)(l,{children:e}),(0,_.jsx)(c,{children:`attachment`})]})]},e))})})})},b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
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
}`,...b.parameters?.docs?.source}}},x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
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
}`,...x.parameters?.docs?.source}}},S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`{
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
}`,...S.parameters?.docs?.source}}},C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`{
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
}`,...C.parameters?.docs?.source}}},w.parameters={...w.parameters,docs:{...w.parameters?.docs,source:{originalSource:`{
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
}`,...w.parameters?.docs?.source}}},T=[`Default`,`States`,`Orientation`,`Sizes`,`Group`]})))()}E();export{b as Default,w as Group,S as Orientation,C as Sizes,x as States,T as __namedExportsOrder,v as default};