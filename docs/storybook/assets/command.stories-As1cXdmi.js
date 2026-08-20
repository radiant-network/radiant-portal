import{j as m}from"./iframe-c2IPk3oe.js";import{_ as d,a as s,b as r,c as t,d as o,f as a,e as p,g as e}from"./command-C5_Dx5-4.js";import{a as i}from"./story-section-CAEPkWC7.js";import{U as C}from"./user-CUm-OZSf.js";import"./preload-helper-PPVm8Dsz.js";import"./checkbox-kgNs3td8.js";import"./index-Cv-qAHrj.js";import"./check-DUGuR0C1.js";import"./dialog-C6NuQbgX.js";import"./i18n-CfOqn4nZ.js";import"./index-Bk_1Mjxr.js";import"./x-DSPDcSor.js";const D={title:"Components/Commands/Command",args:{},component:d},n={render:()=>m.jsx(i,{title:"Default",children:m.jsxs(d,{className:"rounded-lg border shadow-md md:min-w-[450px]",children:[m.jsx(s,{placeholder:"Type a command or search..."}),m.jsxs(r,{children:[m.jsx(t,{children:"No results found."}),m.jsxs(o,{children:[m.jsxs(a,{children:[m.jsx(C,{}),m.jsx("span",{children:"CommandItem"})]}),m.jsx(a,{disabled:!0,children:m.jsx("span",{children:"CommandItem:Disabled"})})]}),m.jsx(p,{}),m.jsxs(o,{children:[m.jsx(e,{children:m.jsx("span",{children:"CommandItemCheckbox"})}),m.jsx(e,{disabled:!0,children:m.jsx("span",{children:"CommandItemCheckbox:disabled"})})]})]})]})})};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
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
