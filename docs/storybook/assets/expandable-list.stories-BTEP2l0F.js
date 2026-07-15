import{j as e}from"./iframe-CuWpm1qa.js";import{E as i}from"./expandable-list-BXfGoOhw.js";import{S as m,a as o,b as n}from"./story-section-w3-NF7Xp.js";import"./preload-helper-PPVm8Dsz.js";import"./button-CSz6EV4E.js";import"./action-button-lN5zPVbm.js";import"./dropdown-menu-BOERjw4c.js";import"./index-Dmb4mQ0b.js";import"./index-CJQJWHRc.js";import"./check-j36eKSHy.js";import"./circle-Dfldtqa6.js";import"./separator-BEF1T6M0.js";import"./i18n-Dk4pliQz.js";import"./index-8BZx1Yb8.js";const f={title:"Components/Lists/Expandable List",component:i,args:{}},a=[1,2,3,4,5,6].map(t=>e.jsx("span",{children:t},t)),s={args:{visibleCount:3,items:a,emptyMessage:e.jsx(e.Fragment,{children:"Empty"})},render:t=>e.jsxs(m,{children:[e.jsx(o,{title:"Default",description:"Shows visibleCount items, then a “See more / See less” toggle.",children:e.jsx(i,{...t})}),e.jsx(o,{title:"Sizes",description:"Size controls the vertical spacing between items.",children:e.jsx("div",{className:"flex gap-12",children:["default","md","lg"].map(r=>e.jsxs("div",{className:"flex flex-col gap-2",children:[e.jsx(n,{children:r}),e.jsx(i,{size:r,visibleCount:3,items:a,emptyMessage:e.jsx(e.Fragment,{children:"Empty"})})]},r))})}),e.jsx(o,{title:"Empty",children:e.jsx(i,{visibleCount:3,items:[],emptyMessage:e.jsx("span",{children:"List is Empty"})})})]})};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
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
