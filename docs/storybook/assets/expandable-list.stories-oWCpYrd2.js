import{j as e}from"./iframe-CEIjD8md.js";import{E as i}from"./expandable-list-B140YPFL.js";import{S as n,a as r,b as l}from"./story-section-akNb6BHm.js";import"./preload-helper-PPVm8Dsz.js";const S={title:"Components/Lists/Expandable List",component:i,args:{}},o=[1,2,3,4,5,6].map(s=>e.jsx("span",{children:s},s)),t={args:{visibleCount:3,items:o,emptyMessage:e.jsx(e.Fragment,{children:"Empty"})},render:s=>e.jsxs(n,{children:[e.jsx(r,{title:"Default",description:"Shows visibleCount items, then a “See more / See less” toggle.",children:e.jsx(i,{...s})}),e.jsx(r,{title:"Sizes",description:"Size controls the vertical spacing between items.",children:e.jsx("div",{className:"flex gap-12",children:["default","md","lg"].map(a=>e.jsxs("div",{className:"flex flex-col gap-2",children:[e.jsx(l,{children:a}),e.jsx(i,{size:a,visibleCount:3,items:o,emptyMessage:e.jsx(e.Fragment,{children:"Empty"})})]},a))})}),e.jsx(r,{title:"Empty",children:e.jsx(i,{visibleCount:3,items:[],emptyMessage:e.jsx("span",{children:"List is Empty"})})})]})};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
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
}`,...t.parameters?.docs?.source}}};const x=["AllVariants"];export{t as AllVariants,x as __namedExportsOrder,S as default};
