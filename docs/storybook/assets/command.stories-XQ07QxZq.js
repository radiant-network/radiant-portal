import{j as m}from"./iframe-CeWulF4T.js";import{_ as d,a as s,b as r,c as t,d as o,f as a,e as p,g as e}from"./command-TNjUVSiC.js";import{a as i}from"./story-section-H6_Fle6z.js";import{U as C}from"./user-JFBAsbsX.js";import"./preload-helper-PPVm8Dsz.js";import"./checkbox-CI-w0ilu.js";import"./index-BI3vdd7S.js";import"./check-HHIYmnL4.js";import"./dialog-qzysEzfw.js";import"./i18n-Cey8cEyU.js";import"./index-Dqf5nBEg.js";import"./x-D_1RLYu7.js";const D={title:"Components/Commands/Command",args:{},component:d},n={render:()=>m.jsx(i,{title:"Default",children:m.jsxs(d,{className:"rounded-lg border shadow-md md:min-w-[450px]",children:[m.jsx(s,{placeholder:"Type a command or search..."}),m.jsxs(r,{children:[m.jsx(t,{children:"No results found."}),m.jsxs(o,{children:[m.jsxs(a,{children:[m.jsx(C,{}),m.jsx("span",{children:"CommandItem"})]}),m.jsx(a,{disabled:!0,children:m.jsx("span",{children:"CommandItem:Disabled"})})]}),m.jsx(p,{}),m.jsxs(o,{children:[m.jsx(e,{children:m.jsx("span",{children:"CommandItemCheckbox"})}),m.jsx(e,{disabled:!0,children:m.jsx("span",{children:"CommandItemCheckbox:disabled"})})]})]})]})})};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
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
