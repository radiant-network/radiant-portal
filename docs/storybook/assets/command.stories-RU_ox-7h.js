import{j as m}from"./iframe-Dazgu-xC.js";import{_ as t,C as p,a as C,b as c,c as a,d as e,e as i,f as o}from"./command-DYkhM0KC.js";import{U as l}from"./user-CmX3iciL.js";import"./preload-helper-Dp1pzeXC.js";import"./checkbox-DwIg2Wk7.js";import"./index-CwEq_5Lw.js";import"./check-CzryUxBS.js";import"./dialog-Di7D3E91.js";import"./x-CKsu-GPn.js";const E={title:"Commands/Command",args:{},component:t},n={render:()=>m.jsxs(t,{className:"rounded-lg border shadow-md md:min-w-[450px]",children:[m.jsx(p,{placeholder:"Type a command or search..."}),m.jsxs(C,{children:[m.jsx(c,{children:"No results found."}),m.jsxs(a,{children:[m.jsxs(e,{children:[m.jsx(l,{}),m.jsx("span",{children:"CommandItem"})]}),m.jsx(e,{disabled:!0,children:m.jsx("span",{children:"CommandItem:Disabled"})})]}),m.jsx(i,{}),m.jsxs(a,{children:[m.jsx(o,{children:m.jsx("span",{children:"CommandItemCheckbox"})}),m.jsx(o,{disabled:!0,children:m.jsx("span",{children:"CommandItemCheckbox:disabled"})})]})]})]})};var d,s,r;n.parameters={...n.parameters,docs:{...(d=n.parameters)==null?void 0:d.docs,source:{originalSource:`{
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
}`,...(r=(s=n.parameters)==null?void 0:s.docs)==null?void 0:r.source}}};const G=["Default"];export{n as Default,G as __namedExportsOrder,E as default};
