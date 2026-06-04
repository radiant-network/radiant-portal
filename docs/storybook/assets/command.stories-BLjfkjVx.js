import{j as m}from"./iframe-C_PWKKnV.js";import{_ as d,C as s,a as r,b as t,c as a,d as e,e as p,f as o}from"./command-Ovbj7Hd0.js";import{a as C}from"./story-section-CfmadKEP.js";import{U as i}from"./user-D4_TJ7m3.js";import"./preload-helper-PPVm8Dsz.js";import"./checkbox-JltLvucL.js";import"./index-CshBJO-E.js";import"./check-clqCtUO9.js";import"./dialog-BEqPVi92.js";import"./x-BsW-yT5v.js";const S={title:"Components/Commands/Command",args:{},component:d},n={render:()=>m.jsx(C,{title:"Default",children:m.jsxs(d,{className:"rounded-lg border shadow-md md:min-w-[450px]",children:[m.jsx(s,{placeholder:"Type a command or search..."}),m.jsxs(r,{children:[m.jsx(t,{children:"No results found."}),m.jsxs(a,{children:[m.jsxs(e,{children:[m.jsx(i,{}),m.jsx("span",{children:"CommandItem"})]}),m.jsx(e,{disabled:!0,children:m.jsx("span",{children:"CommandItem:Disabled"})})]}),m.jsx(p,{}),m.jsxs(a,{children:[m.jsx(o,{children:m.jsx("span",{children:"CommandItemCheckbox"})}),m.jsx(o,{disabled:!0,children:m.jsx("span",{children:"CommandItemCheckbox:disabled"})})]})]})]})})};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
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
}`,...n.parameters?.docs?.source}}};const y=["Default"];export{n as Default,y as __namedExportsOrder,S as default};
