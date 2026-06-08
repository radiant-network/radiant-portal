import{j as e}from"./iframe-Dt4dd9_L.js";import{E as i}from"./expandable-list-C3AhtPOW.js";import{S as m,a as o,b as n}from"./story-section-Ba8l4DMz.js";import"./preload-helper-PPVm8Dsz.js";import"./button-BHpOt1n5.js";import"./index--YEVJleu.js";import"./action-button-CUVXthKf.js";import"./dropdown-menu-Db1zsnSb.js";import"./index-B3Y_IRPe.js";import"./index-DydgcOJb.js";import"./check-BkrZypcC.js";import"./circle-CQ2dwaF5.js";import"./separator-CHrX4g91.js";import"./i18n-Buhp04UG.js";import"./index-t9s_g_zt.js";const L={title:"Components/Lists/Expandable List",component:i,args:{}},a=[1,2,3,4,5,6].map(t=>e.jsx("span",{children:t},t)),s={args:{visibleCount:3,items:a,emptyMessage:e.jsx(e.Fragment,{children:"Empty"})},render:t=>e.jsxs(m,{children:[e.jsx(o,{title:"Default",description:"Shows visibleCount items, then a “See more / See less” toggle.",children:e.jsx(i,{...t})}),e.jsx(o,{title:"Sizes",description:"Size controls the vertical spacing between items.",children:e.jsx("div",{className:"flex gap-12",children:["default","md","lg"].map(r=>e.jsxs("div",{className:"flex flex-col gap-2",children:[e.jsx(n,{children:r}),e.jsx(i,{size:r,visibleCount:3,items:a,emptyMessage:e.jsx(e.Fragment,{children:"Empty"})})]},r))})}),e.jsx(o,{title:"Empty",children:e.jsx(i,{visibleCount:3,items:[],emptyMessage:e.jsx("span",{children:"List is Empty"})})})]})};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
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
}`,...s.parameters?.docs?.source}}};const C=["AllVariants"];export{s as AllVariants,C as __namedExportsOrder,L as default};
