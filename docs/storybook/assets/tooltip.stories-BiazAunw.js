import{p as t,j as e,T as o,o as s}from"./iframe-BIXXYuBI.js";import{B as r}from"./button-xPG5O6R2.js";import{a as l}from"./story-section-DE5REqsE.js";import"./preload-helper-PPVm8Dsz.js";import"./action-button-BSswwT5c.js";import"./dropdown-menu-DBlI4iuc.js";import"./index-BqZtMSNs.js";import"./index-D0c3HBoV.js";import"./check-BfX4x5II.js";import"./circle-CKfwywNe.js";import"./separator-B6mOwfzL.js";import"./i18n-DzF9286q.js";import"./index-CFXxicox.js";const y={title:"Components/Tooltips/Tooltip",component:t,args:{children:"Tooltip Content",sideOffset:8,side:"top"}},i={render:n=>e.jsx(l,{title:"Tooltip",children:e.jsxs("div",{className:"flex flex-col gap-3 justify-center p-24",children:[e.jsx("div",{className:"flex justify-center",children:e.jsxs(o,{children:[e.jsx(s,{asChild:!0,children:e.jsx(r,{color:"primary",children:"Hover Me"})}),e.jsx(t,{...n})]})}),e.jsx("div",{className:"flex justify-center",children:e.jsxs(o,{children:[e.jsx(s,{asChild:!0,children:e.jsx(r,{color:"primary",children:"Hover Me (long text)"})}),e.jsx(t,{children:"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce a dolor nisl. Praesent varius vestibulum dui dui vitae aliquam. Suspendisse ac commodo nisl, non congue diam. Aliquam elementum, lectus sit amet viverra pharetra, leo magna iaculis ex, ut volutpat nulla nisl quis lacus. Phasellus vestibulum sit amet justo non facilisis. Proin suscipit condimentum orci eu eleifend. In porttitor libero sed arcu semper, non neque imperdiet."})]})})]})})};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  render: args => <StorySection title="Tooltip">
      <div className="flex flex-col gap-3 justify-center p-24">
        <div className="flex justify-center">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button color="primary">Hover Me</Button>
            </TooltipTrigger>
            <TooltipContent {...args} />
          </Tooltip>
        </div>
        <div className="flex justify-center">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button color="primary">Hover Me (long text)</Button>
            </TooltipTrigger>
            <TooltipContent>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce a dolor nisl. Praesent varius vestibulum
              dui dui vitae aliquam. Suspendisse ac commodo nisl, non congue diam. Aliquam elementum, lectus sit amet
              viverra pharetra, leo magna iaculis ex, ut volutpat nulla nisl quis lacus. Phasellus vestibulum sit amet
              justo non facilisis. Proin suscipit condimentum orci eu eleifend. In porttitor libero sed arcu semper, non
              neque imperdiet.
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </StorySection>
}`,...i.parameters?.docs?.source}}};const C=["Default"];export{i as Default,C as __namedExportsOrder,y as default};
