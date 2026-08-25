import{j as e}from"./iframe-CeWulF4T.js";import{E as i}from"./expandable-list-BDn6h5Nk.js";import{S as m,a as o,b as n}from"./story-section-H6_Fle6z.js";import"./preload-helper-PPVm8Dsz.js";import"./button-C683gQgD.js";import"./action-button-fSpfUlMg.js";import"./dropdown-menu-KIY2RxO3.js";import"./index-Derf9KHZ.js";import"./index-R0RQN4yR.js";import"./check-HHIYmnL4.js";import"./circle-DXv1Vmv4.js";import"./separator-CfpQj-nU.js";import"./i18n-Cey8cEyU.js";import"./index-Dqf5nBEg.js";const f={title:"Components/Lists/Expandable List",component:i,args:{}},a=[1,2,3,4,5,6].map(t=>e.jsx("span",{children:t},t)),s={args:{visibleCount:3,items:a,emptyMessage:e.jsx(e.Fragment,{children:"Empty"})},render:t=>e.jsxs(m,{children:[e.jsx(o,{title:"Default",description:"Shows visibleCount items, then a “See more / See less” toggle.",children:e.jsx(i,{...t})}),e.jsx(o,{title:"Sizes",description:"Size controls the vertical spacing between items.",children:e.jsx("div",{className:"flex gap-12",children:["default","md","lg"].map(r=>e.jsxs("div",{className:"flex flex-col gap-2",children:[e.jsx(n,{children:r}),e.jsx(i,{size:r,visibleCount:3,items:a,emptyMessage:e.jsx(e.Fragment,{children:"Empty"})})]},r))})}),e.jsx(o,{title:"Empty",children:e.jsx(i,{visibleCount:3,items:[],emptyMessage:e.jsx("span",{children:"List is Empty"})})})]})};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
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
}`,...s.parameters?.docs?.source}}};const L=["AllVariants"];export{s as AllVariants,L as __namedExportsOrder,f as default};
