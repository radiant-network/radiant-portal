import{j as e}from"./iframe-D5nbMH0Z.js";import{E as i}from"./expandable-list-dHaoAckA.js";import{S as m,a as o,b as n}from"./story-section-DfWRQdTn.js";import"./preload-helper-PPVm8Dsz.js";import"./button-CivLk_fn.js";import"./index-Cc9ovpm8.js";import"./action-button-CRlVI-Q0.js";import"./dropdown-menu-DXt4HdYg.js";import"./index-Coy-0tiE.js";import"./index-C8YmK8nx.js";import"./check-DI_qTPcP.js";import"./circle-C9-1AW9v.js";import"./separator-DOf7FV04.js";import"./i18n-Bdg0oCKu.js";import"./index-inuiUwi3.js";import"./index-CJ_W4xqL.js";const C={title:"Components/Lists/Expandable List",component:i,args:{}},a=[1,2,3,4,5,6].map(t=>e.jsx("span",{children:t},t)),s={args:{visibleCount:3,items:a,emptyMessage:e.jsx(e.Fragment,{children:"Empty"})},render:t=>e.jsxs(m,{children:[e.jsx(o,{title:"Default",description:"Shows visibleCount items, then a “See more / See less” toggle.",children:e.jsx(i,{...t})}),e.jsx(o,{title:"Sizes",description:"Size controls the vertical spacing between items.",children:e.jsx("div",{className:"flex gap-12",children:["default","md","lg"].map(r=>e.jsxs("div",{className:"flex flex-col gap-2",children:[e.jsx(n,{children:r}),e.jsx(i,{size:r,visibleCount:3,items:a,emptyMessage:e.jsx(e.Fragment,{children:"Empty"})})]},r))})}),e.jsx(o,{title:"Empty",children:e.jsx(i,{visibleCount:3,items:[],emptyMessage:e.jsx("span",{children:"List is Empty"})})})]})};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
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
}`,...s.parameters?.docs?.source}}};const w=["AllVariants"];export{s as AllVariants,w as __namedExportsOrder,C as default};
