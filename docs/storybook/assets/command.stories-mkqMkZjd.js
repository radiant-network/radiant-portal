import{j as m}from"./iframe-Dt4dd9_L.js";import{_ as d,C as s,a as r,b as t,c as a,d as e,e as p,f as o}from"./command-DDGfZRh0.js";import{a as C}from"./story-section-Ba8l4DMz.js";import{U as i}from"./user-BEmFT4Ps.js";import"./preload-helper-PPVm8Dsz.js";import"./checkbox-BwoKYgS4.js";import"./index-D3WMzQ8D.js";import"./check-BkrZypcC.js";import"./dialog-DAC96_W1.js";import"./x-CPSnwLTF.js";const S={title:"Components/Commands/Command",args:{},component:d},n={render:()=>m.jsx(C,{title:"Default",children:m.jsxs(d,{className:"rounded-lg border shadow-md md:min-w-[450px]",children:[m.jsx(s,{placeholder:"Type a command or search..."}),m.jsxs(r,{children:[m.jsx(t,{children:"No results found."}),m.jsxs(a,{children:[m.jsxs(e,{children:[m.jsx(i,{}),m.jsx("span",{children:"CommandItem"})]}),m.jsx(e,{disabled:!0,children:m.jsx("span",{children:"CommandItem:Disabled"})})]}),m.jsx(p,{}),m.jsxs(a,{children:[m.jsx(o,{children:m.jsx("span",{children:"CommandItemCheckbox"})}),m.jsx(o,{disabled:!0,children:m.jsx("span",{children:"CommandItemCheckbox:disabled"})})]})]})]})})};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
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
