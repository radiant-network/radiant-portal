import{j as m}from"./jsx-runtime-D_zvdyIk.js";import{_ as t,C as p,a as i,d as C,b as o,c as a,e as c,f as e}from"./command-Brw0tXPK.js";import{U as l}from"./user-CZ8KFWeE.js";import"./index-CGj_12n1.js";import"./index-io6LyWnD.js";import"./index-CDVHwwC2.js";import"./index-COcwYKbe.js";import"./index-D8dqFcAi.js";import"./index-BBPXtLXU.js";import"./index-DUXZ-Llx.js";import"./index-2ptLTYfO.js";import"./index-Bp_Zkv6j.js";import"./utils-D-KgF5mV.js";import"./dialog-DkadOBmo.js";import"./x-CubKniSv.js";import"./createLucideIcon-8Lr1oLzj.js";import"./checkbox-DMd2svcp.js";import"./index-qxuqJ0RB.js";import"./index-C66Dxnp2.js";import"./check-DRc1RmCY.js";const O={title:"Data Entry/Command",args:{},component:t},n={render:()=>m.jsxs(t,{className:"rounded-lg border shadow-md md:min-w-[450px]",children:[m.jsx(p,{placeholder:"Type a command or search..."}),m.jsxs(i,{children:[m.jsx(C,{children:"No results found."}),m.jsxs(o,{children:[m.jsxs(a,{children:[m.jsx(l,{}),m.jsx("span",{children:"CommandItem"})]}),m.jsx(a,{disabled:!0,children:m.jsx("span",{children:"CommandItem:Disabled"})})]}),m.jsx(c,{}),m.jsxs(o,{children:[m.jsx(e,{children:m.jsx("span",{children:"CommandItemCheckbox"})}),m.jsx(e,{disabled:!0,children:m.jsx("span",{children:"CommandItemCheckbox:disabled"})})]})]})]})};var d,r,s;n.parameters={...n.parameters,docs:{...(d=n.parameters)==null?void 0:d.docs,source:{originalSource:`{
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
}`,...(s=(r=n.parameters)==null?void 0:r.docs)==null?void 0:s.source}}};const R=["Default"];export{n as Default,R as __namedExportsOrder,O as default};
