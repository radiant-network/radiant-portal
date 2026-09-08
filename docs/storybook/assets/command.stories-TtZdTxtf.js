import{j as m}from"./iframe-BC4RzbTe.js";import{_ as d,a as s,b as r,c as t,d as o,f as a,e as p,g as e}from"./command-BfraPepx.js";import{a as i}from"./story-section-DPrmmWzN.js";import{U as C}from"./user-Ca5Ylnaw.js";import"./preload-helper-PPVm8Dsz.js";import"./checkbox-6QADwITq.js";import"./index-DErrjSEm.js";import"./check-CdGhgW-U.js";import"./dialog-CFl_3Pne.js";import"./i18n-B_9vMIaN.js";import"./index-nJ2VJ9o6.js";import"./x-CE8BJu81.js";const D={title:"Components/Commands/Command",args:{},component:d},n={render:()=>m.jsx(i,{title:"Default",children:m.jsxs(d,{className:"rounded-lg border shadow-md md:min-w-[450px]",children:[m.jsx(s,{placeholder:"Type a command or search..."}),m.jsxs(r,{children:[m.jsx(t,{children:"No results found."}),m.jsxs(o,{children:[m.jsxs(a,{children:[m.jsx(C,{}),m.jsx("span",{children:"CommandItem"})]}),m.jsx(a,{disabled:!0,children:m.jsx("span",{children:"CommandItem:Disabled"})})]}),m.jsx(p,{}),m.jsxs(o,{children:[m.jsx(e,{children:m.jsx("span",{children:"CommandItemCheckbox"})}),m.jsx(e,{disabled:!0,children:m.jsx("span",{children:"CommandItemCheckbox:disabled"})})]})]})]})})};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
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
