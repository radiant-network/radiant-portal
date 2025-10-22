import{j as m}from"./jsx-runtime-D_zvdyIk.js";import{_ as t,C as p,a as i,b as C,c as o,d as a,e as c,f as e}from"./command-EgOjp73N.js";import{U as l}from"./user-CZ8KFWeE.js";import"./index-CGj_12n1.js";import"./index-CosFuvvC.js";import"./index-CcLUv2_A.js";import"./index-B7CJuYpG.js";import"./index-D8dqFcAi.js";import"./index-BBPXtLXU.js";import"./index-CIckazZy.js";import"./index-Ch7hUksi.js";import"./Combination-DwMjbv-J.js";import"./index-CRLeYu_h.js";import"./index-C66Dxnp2.js";import"./checkbox-CuLJw5hI.js";import"./index-qxuqJ0RB.js";import"./index-A6VgBoaw.js";import"./utils-D-KgF5mV.js";import"./check-DRc1RmCY.js";import"./createLucideIcon-8Lr1oLzj.js";import"./dialog-D8H4qXag.js";import"./x-CubKniSv.js";const q={title:"Commands/Command",args:{},component:t},n={render:()=>m.jsxs(t,{className:"rounded-lg border shadow-md md:min-w-[450px]",children:[m.jsx(p,{placeholder:"Type a command or search..."}),m.jsxs(i,{children:[m.jsx(C,{children:"No results found."}),m.jsxs(o,{children:[m.jsxs(a,{children:[m.jsx(l,{}),m.jsx("span",{children:"CommandItem"})]}),m.jsx(a,{disabled:!0,children:m.jsx("span",{children:"CommandItem:Disabled"})})]}),m.jsx(c,{}),m.jsxs(o,{children:[m.jsx(e,{children:m.jsx("span",{children:"CommandItemCheckbox"})}),m.jsx(e,{disabled:!0,children:m.jsx("span",{children:"CommandItemCheckbox:disabled"})})]})]})]})};var d,r,s;n.parameters={...n.parameters,docs:{...(d=n.parameters)==null?void 0:d.docs,source:{originalSource:`{
  render: () => {
    return <Command className="rounded-lg border shadow-md md:min-w-[450px]">
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
      </Command>;
  }
}`,...(s=(r=n.parameters)==null?void 0:r.docs)==null?void 0:s.source}}};const v=["Default"];export{n as Default,v as __namedExportsOrder,q as default};
