import{j as m}from"./iframe-DiGfbfp3.js";import{_ as d,a as s,b as r,c as t,d as o,f as a,e as p,g as e}from"./command-BtZwaeaK.js";import{a as i}from"./story-section-DME95Whn.js";import{U as C}from"./user-CV5r7bOK.js";import"./preload-helper-PPVm8Dsz.js";import"./checkbox-C8NM_MjZ.js";import"./index-U5GxrvjR.js";import"./check-IkDt6mIM.js";import"./dialog-CxCMuna4.js";import"./i18n-uvvEETAD.js";import"./index-Cn_qWDha.js";import"./x-J1a-oCAV.js";const D={title:"Components/Commands/Command",args:{},component:d},n={render:()=>m.jsx(i,{title:"Default",children:m.jsxs(d,{className:"rounded-lg border shadow-md md:min-w-[450px]",children:[m.jsx(s,{placeholder:"Type a command or search..."}),m.jsxs(r,{children:[m.jsx(t,{children:"No results found."}),m.jsxs(o,{children:[m.jsxs(a,{children:[m.jsx(C,{}),m.jsx("span",{children:"CommandItem"})]}),m.jsx(a,{disabled:!0,children:m.jsx("span",{children:"CommandItem:Disabled"})})]}),m.jsx(p,{}),m.jsxs(o,{children:[m.jsx(e,{children:m.jsx("span",{children:"CommandItemCheckbox"})}),m.jsx(e,{disabled:!0,children:m.jsx("span",{children:"CommandItemCheckbox:disabled"})})]})]})]})})};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  render: () => <StorySection title="Default">
      <Command className="rounded-lg border shadow-md md:min-w-[450px]">
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup>
            <CommandItem>
              <User />
              <span>CommandItem</span>
            </CommandItem>
            <CommandItem disabled>
              <span>CommandItem:Disabled</span>
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup>
            <CommandItemCheckbox>
              <span>CommandItemCheckbox</span>
            </CommandItemCheckbox>
            <CommandItemCheckbox disabled>
              <span>CommandItemCheckbox:disabled</span>
            </CommandItemCheckbox>
          </CommandGroup>
        </CommandList>
      </Command>
    </StorySection>
}`,...n.parameters?.docs?.source}}};const g=["Default"];export{n as Default,g as __namedExportsOrder,D as default};
