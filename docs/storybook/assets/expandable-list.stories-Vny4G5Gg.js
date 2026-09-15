import{n as e}from"./rolldown-runtime-C0FnF6B9.js";import{t}from"./jsx-runtime-BdxMnOeJ.js";import{i as n,n as r,r as i,t as a}from"./story-section-DVTm6cGm.js";import{n as o,t as s}from"./expandable-list-Dq9c5PN2.js";var c,l,u,d,f;function p(){return(p=e((()=>{o(),n(),c=t(),l={title:`Components/Lists/Expandable List`,component:s,args:{}},u=[1,2,3,4,5,6].map(e=>(0,c.jsx)(`span`,{children:e},e)),d={args:{visibleCount:3,items:u,emptyMessage:(0,c.jsx)(c.Fragment,{children:`Empty`})},render:e=>(0,c.jsxs)(i,{children:[(0,c.jsx)(r,{title:`Default`,description:`Shows visibleCount items, then a “See more / See less” toggle.`,children:(0,c.jsx)(s,{...e})}),(0,c.jsx)(r,{title:`Sizes`,description:`Size controls the vertical spacing between items.`,children:(0,c.jsx)(`div`,{className:`flex gap-12`,children:[`default`,`md`,`lg`].map(e=>(0,c.jsxs)(`div`,{className:`flex flex-col gap-2`,children:[(0,c.jsx)(a,{children:e}),(0,c.jsx)(s,{size:e,visibleCount:3,items:u,emptyMessage:(0,c.jsx)(c.Fragment,{children:`Empty`})})]},e))})}),(0,c.jsx)(r,{title:`Empty`,children:(0,c.jsx)(s,{visibleCount:3,items:[],emptyMessage:(0,c.jsx)(`span`,{children:`List is Empty`})})})]})},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  args: {
    visibleCount: 3,
    items: numberItems,
    emptyMessage: <>Empty</>
  },
  render: args => <StoryShowcase>
      <StorySection title="Default" description="Shows visibleCount items, then a “See more / See less” toggle.">
        <ExpandableList {...args} />
      </StorySection>

      <StorySection title="Sizes" description="Size controls the vertical spacing between items.">
        <div className="flex gap-12">
          {(['default', 'md', 'lg'] as const).map(size => <div key={size} className="flex flex-col gap-2">
              <StoryLabel>{size}</StoryLabel>
              <ExpandableList size={size} visibleCount={3} items={numberItems} emptyMessage={<>Empty</>} />
            </div>)}
        </div>
      </StorySection>

      <StorySection title="Empty">
        <ExpandableList visibleCount={3} items={[]} emptyMessage={<span>List is Empty</span>} />
      </StorySection>
    </StoryShowcase>
}`,...d.parameters?.docs?.source}}},f=[`AllVariants`]})))()}p();export{d as AllVariants,f as __namedExportsOrder,l as default};