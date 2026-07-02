import{m as t,j as e,T as o,l as s}from"./iframe-GYMnz-7x.js";import{B as r}from"./button-BW7uYpsZ.js";import{a as l}from"./story-section-B8hLDL9V.js";import"./preload-helper-PPVm8Dsz.js";import"./action-button-C5yNblEX.js";import"./dropdown-menu-D8RNBs8V.js";import"./index-DWsE9wOP.js";import"./index-OS3JsfxU.js";import"./check-BxNDYKk2.js";import"./circle-q-mOcdtX.js";import"./separator-CxIJlsta.js";import"./i18n-LMd9zC7u.js";import"./index-CtN1RmEe.js";const y={title:"Components/Tooltips/Tooltip",component:t,args:{children:"Tooltip Content",sideOffset:8,side:"top"}},i={render:n=>e.jsx(l,{title:"Tooltip",children:e.jsxs("div",{className:"flex flex-col gap-3 justify-center p-24",children:[e.jsx("div",{className:"flex justify-center",children:e.jsxs(o,{children:[e.jsx(s,{asChild:!0,children:e.jsx(r,{color:"primary",children:"Hover Me"})}),e.jsx(t,{...n})]})}),e.jsx("div",{className:"flex justify-center",children:e.jsxs(o,{children:[e.jsx(s,{asChild:!0,children:e.jsx(r,{color:"primary",children:"Hover Me (long text)"})}),e.jsx(t,{children:"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce a dolor nisl. Praesent varius vestibulum dui dui vitae aliquam. Suspendisse ac commodo nisl, non congue diam. Aliquam elementum, lectus sit amet viverra pharetra, leo magna iaculis ex, ut volutpat nulla nisl quis lacus. Phasellus vestibulum sit amet justo non facilisis. Proin suscipit condimentum orci eu eleifend. In porttitor libero sed arcu semper, non neque imperdiet."})]})})]})})};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
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
