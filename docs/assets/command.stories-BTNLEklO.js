import{j as m}from"./jsx-runtime-D_zvdyIk.js";import{_ as t,C as p,a as i,d as C,b as o,c as a,e as c,f as e}from"./command-BXEpiVTz.js";import{U as l}from"./user-Dv_C2EEw.js";import"./index-DQLiH3RP.js";import"./index-CkYa-_Ih.js";import"./index-D-AYaadb.js";import"./index-CECE1b4A.js";import"./index-CJPVTaBz.js";import"./index-Bf9LPmYV.js";import"./index-DD7n3F2b.js";import"./index-C5A_jyAq.js";import"./utils-D-KgF5mV.js";import"./dialog-tSfKNUXe.js";import"./x-ClsbQ_rO.js";import"./createLucideIcon-BMP5cxO1.js";import"./checkbox-CO27iIkV.js";import"./index-DDGWSPzp.js";import"./index-C66Dxnp2.js";import"./check-DSCf8CVO.js";const T={title:"Data Entry/Command",args:{},component:t},n={render:()=>m.jsxs(t,{className:"rounded-lg border shadow-md md:min-w-[450px]",children:[m.jsx(p,{placeholder:"Type a command or search..."}),m.jsxs(i,{children:[m.jsx(C,{children:"No results found."}),m.jsxs(o,{children:[m.jsxs(a,{children:[m.jsx(l,{}),m.jsx("span",{children:"CommandItem"})]}),m.jsx(a,{disabled:!0,children:m.jsx("span",{children:"CommandItem:Disabled"})})]}),m.jsx(c,{}),m.jsxs(o,{children:[m.jsx(e,{children:m.jsx("span",{children:"CommandItemCheckbox"})}),m.jsx(e,{disabled:!0,children:m.jsx("span",{children:"CommandItemCheckbox:disabled"})})]})]})]})};var d,r,s;n.parameters={...n.parameters,docs:{...(d=n.parameters)==null?void 0:d.docs,source:{originalSource:`{
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
}`,...(s=(r=n.parameters)==null?void 0:r.docs)==null?void 0:s.source}}};const O=["Default"];export{n as Default,O as __namedExportsOrder,T as default};
