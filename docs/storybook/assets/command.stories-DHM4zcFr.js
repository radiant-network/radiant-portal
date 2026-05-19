import{j as m}from"./iframe-BHfqIMzt.js";import{_ as t,C as p,a as C,b as c,c as a,d as e,e as i,f as o}from"./command-DZF7ytcH.js";import{U as l}from"./user-Dc35guHj.js";import"./preload-helper-Dp1pzeXC.js";import"./checkbox-CNQBp01B.js";import"./index-3LkGnVHf.js";import"./check-C0u0WUKH.js";import"./dialog-Bn1MS73X.js";import"./x-BF5vTZ3R.js";const E={title:"Commands/Command",args:{},component:t},n={render:()=>m.jsxs(t,{className:"rounded-lg border shadow-md md:min-w-[450px]",children:[m.jsx(p,{placeholder:"Type a command or search..."}),m.jsxs(C,{children:[m.jsx(c,{children:"No results found."}),m.jsxs(a,{children:[m.jsxs(e,{children:[m.jsx(l,{}),m.jsx("span",{children:"CommandItem"})]}),m.jsx(e,{disabled:!0,children:m.jsx("span",{children:"CommandItem:Disabled"})})]}),m.jsx(i,{}),m.jsxs(a,{children:[m.jsx(o,{children:m.jsx("span",{children:"CommandItemCheckbox"})}),m.jsx(o,{disabled:!0,children:m.jsx("span",{children:"CommandItemCheckbox:disabled"})})]})]})]})};var d,s,r;n.parameters={...n.parameters,docs:{...(d=n.parameters)==null?void 0:d.docs,source:{originalSource:`{
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
