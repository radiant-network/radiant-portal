import{j as m}from"./iframe-DaN5ePGy.js";import{_ as d,C as s,a as r,b as t,c as a,d as e,e as p,f as o}from"./command-Cbufo2GG.js";import{U as C}from"./user-3d638KM8.js";import"./preload-helper-PPVm8Dsz.js";import"./checkbox-R3ES-PDx.js";import"./index-Bxzg_Qkc.js";import"./check-B-s7SQrr.js";import"./dialog-DbhL1w5X.js";import"./x-BX9lxs28.js";const f={title:"Commands/Command",args:{},component:d},n={render:()=>m.jsxs(d,{className:"rounded-lg border shadow-md md:min-w-[450px]",children:[m.jsx(s,{placeholder:"Type a command or search..."}),m.jsxs(r,{children:[m.jsx(t,{children:"No results found."}),m.jsxs(a,{children:[m.jsxs(e,{children:[m.jsx(C,{}),m.jsx("span",{children:"CommandItem"})]}),m.jsx(e,{disabled:!0,children:m.jsx("span",{children:"CommandItem:Disabled"})})]}),m.jsx(p,{}),m.jsxs(a,{children:[m.jsx(o,{children:m.jsx("span",{children:"CommandItemCheckbox"})}),m.jsx(o,{disabled:!0,children:m.jsx("span",{children:"CommandItemCheckbox:disabled"})})]})]})]})};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  render: () => <Command className="rounded-lg border shadow-md md:min-w-[450px]">
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
}`,...n.parameters?.docs?.source}}};const k=["Default"];export{n as Default,k as __namedExportsOrder,f as default};
