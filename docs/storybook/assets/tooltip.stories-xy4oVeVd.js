import{e as t,j as e,b as o,d as s}from"./iframe-g_rM03WD.js";import{B as r}from"./button-DyjUiMpD.js";import"./preload-helper-Dp1pzeXC.js";import"./index-C5nHNu5V.js";import"./action-button-firnxveF.js";import"./dropdown-menu-C8dl2V8Q.js";import"./index-B4C9r0pW.js";import"./index-CiJ_Won9.js";import"./check-Cn-MPm-h.js";import"./circle-CWj6cztr.js";import"./separator-0OwIr9F3.js";import"./i18n-A89o1_Ry.js";const C={title:"Tooltips/Tooltip",component:t,args:{children:"Tooltip Content",sideOffset:8,side:"top"}},i={render:u=>e.jsxs("div",{className:"flex flex-col gap-3 justify-center p-24",children:[e.jsx("div",{className:"flex justify-center",children:e.jsxs(o,{children:[e.jsx(s,{asChild:!0,children:e.jsx(r,{color:"primary",children:"Hover Me"})}),e.jsx(t,{...u})]})}),e.jsx("div",{className:"flex justify-center",children:e.jsxs(o,{children:[e.jsx(s,{asChild:!0,children:e.jsx(r,{color:"primary",children:"Hover Me (long text)"})}),e.jsx(t,{children:"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce a dolor nisl. Praesent varius vestibulum dui vitae aliquam. Suspendisse ac commodo nisl, non congue diam. Aliquam elementum, lectus sit amet viverra pharetra, leo magna iaculis ex, ut volutpat nulla nisl quis lacus. Phasellus vestibulum sit amet justo non facilisis. Proin suscipit condimentum orci eu eleifend. In porttitor libero sed arcu semper, non porta neque imperdiet."})]})})]})};var n,l,a;i.parameters={...i.parameters,docs:{...(n=i.parameters)==null?void 0:n.docs,source:{originalSource:`{
  render: args => <div className="flex flex-col gap-3 justify-center p-24">
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
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce a dolor nisl. Praesent varius vestibulum dui
            vitae aliquam. Suspendisse ac commodo nisl, non congue diam. Aliquam elementum, lectus sit amet viverra
            pharetra, leo magna iaculis ex, ut volutpat nulla nisl quis lacus. Phasellus vestibulum sit amet justo non
            facilisis. Proin suscipit condimentum orci eu eleifend. In porttitor libero sed arcu semper, non porta neque
            imperdiet.
          </TooltipContent>
        </Tooltip>
      </div>
    </div>
}`,...(a=(l=i.parameters)==null?void 0:l.docs)==null?void 0:a.source}}};const q=["Default"];export{i as Default,q as __namedExportsOrder,C as default};
