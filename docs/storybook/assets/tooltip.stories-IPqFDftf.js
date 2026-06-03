import{f as t,j as e,T as o,e as s}from"./iframe-ELwkN4WH.js";import{B as r}from"./button-DVxJRXa8.js";import{a as l}from"./story-section-BW9mZuMq.js";import"./preload-helper-PPVm8Dsz.js";import"./index-Ct7crFnJ.js";import"./action-button-B8RD553Y.js";import"./dropdown-menu-B5W2V41I.js";import"./index-DrATjyRU.js";import"./index-Ts0_7Z4Q.js";import"./check-BwKrSwsD.js";import"./circle-BM1LvZdU.js";import"./separator-DOzexuXx.js";import"./i18n-DRl3AD0J.js";import"./index-BIP8QzMY.js";const C={title:"Components/Tooltips/Tooltip",component:t,args:{children:"Tooltip Content",sideOffset:8,side:"top"}},i={render:n=>e.jsx(l,{title:"Tooltip",children:e.jsxs("div",{className:"flex flex-col gap-3 justify-center p-24",children:[e.jsx("div",{className:"flex justify-center",children:e.jsxs(o,{children:[e.jsx(s,{asChild:!0,children:e.jsx(r,{color:"primary",children:"Hover Me"})}),e.jsx(t,{...n})]})}),e.jsx("div",{className:"flex justify-center",children:e.jsxs(o,{children:[e.jsx(s,{asChild:!0,children:e.jsx(r,{color:"primary",children:"Hover Me (long text)"})}),e.jsx(t,{children:"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce a dolor nisl. Praesent varius vestibulum dui dui vitae aliquam. Suspendisse ac commodo nisl, non congue diam. Aliquam elementum, lectus sit amet viverra pharetra, leo magna iaculis ex, ut volutpat nulla nisl quis lacus. Phasellus vestibulum sit amet justo non facilisis. Proin suscipit condimentum orci eu eleifend. In porttitor libero sed arcu semper, non neque imperdiet."})]})})]})})};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
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
}`,...i.parameters?.docs?.source}}};const S=["Default"];export{i as Default,S as __namedExportsOrder,C as default};
