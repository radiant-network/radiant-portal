import{j as e}from"./iframe-DiSFfoD4.js";import{T as i,a as l}from"./toggle-group-ULuO3Hl0.js";import{B as r}from"./toggle-T_MucoYP.js";import{I as o,U as s}from"./underline-CxcCCXOm.js";import"./preload-helper-Dp1pzeXC.js";import"./index-BRwQSXJv.js";import"./index-Cg7zLYUJ.js";const g=["sm","default","lg"],I={title:"Buttons/ToggleGroup",component:i,args:{type:"single"}},n={render:()=>e.jsx("div",{className:"flex gap-26",children:g.map(a=>e.jsxs("div",{className:"flex flex-col items-center gap-3",children:[e.jsxs("div",{className:"text-sm font-bold text-muted-foreground mb-4",children:["Size: ",a]}),e.jsxs(i,{type:"single",size:a,variant:"outline",spacing:2,defaultValue:"bold",children:[e.jsx(l,{value:"bold","aria-label":"Bold",children:e.jsx(r,{})}),e.jsx(l,{value:"italic","aria-label":"Italic",children:e.jsx(o,{})}),e.jsx(l,{value:"underline","aria-label":"Underline",children:e.jsx(s,{})})]}),e.jsxs(i,{type:"single",size:a,variant:"default",spacing:2,defaultValue:"bold",children:[e.jsx(l,{value:"bold","aria-label":"Bold",children:e.jsx(r,{})}),e.jsx(l,{value:"italic","aria-label":"Italic",children:e.jsx(o,{})}),e.jsx(l,{value:"underline","aria-label":"Underline",children:e.jsx(s,{})})]}),e.jsxs(i,{type:"single",size:a,variant:"outline",spacing:0,defaultValue:"bold",children:[e.jsx(l,{value:"bold","aria-label":"Bold",children:e.jsx(r,{})}),e.jsx(l,{value:"italic","aria-label":"Italic",children:e.jsx(o,{})}),e.jsx(l,{value:"underline","aria-label":"Underline",children:e.jsx(s,{})})]}),e.jsx("div",{className:"w-[240px]",children:e.jsxs(i,{type:"single",size:a,variant:"outline",spacing:0,defaultValue:"all",equalWidth:!0,children:[e.jsx(l,{value:"all",children:"All"}),e.jsx(l,{value:"missed",children:"Missed"})]})}),e.jsx("div",{className:"w-[240px]",children:e.jsxs(i,{type:"single",size:a,variant:"default",spacing:0,defaultValue:"all",equalWidth:!0,children:[e.jsx(l,{value:"all",children:"All"}),e.jsx(l,{value:"missed",children:"Missed"})]})})]},a))})};var t,u,d;n.parameters={...n.parameters,docs:{...(t=n.parameters)==null?void 0:t.docs,source:{originalSource:`{
  render: () => <div className="flex gap-26">
      {sizes.map(size => <div key={size} className="flex flex-col items-center gap-3">
          <div className="text-sm font-bold text-muted-foreground mb-4">Size: {size}</div>
          <ToggleGroup type="single" size={size} variant="outline" spacing={2} defaultValue="bold">
            <ToggleGroupItem value="bold" aria-label="Bold">
              <Bold />
            </ToggleGroupItem>
            <ToggleGroupItem value="italic" aria-label="Italic">
              <Italic />
            </ToggleGroupItem>
            <ToggleGroupItem value="underline" aria-label="Underline">
              <Underline />
            </ToggleGroupItem>
          </ToggleGroup>
          <ToggleGroup type="single" size={size} variant="default" spacing={2} defaultValue="bold">
            <ToggleGroupItem value="bold" aria-label="Bold">
              <Bold />
            </ToggleGroupItem>
            <ToggleGroupItem value="italic" aria-label="Italic">
              <Italic />
            </ToggleGroupItem>
            <ToggleGroupItem value="underline" aria-label="Underline">
              <Underline />
            </ToggleGroupItem>
          </ToggleGroup>
          <ToggleGroup type="single" size={size} variant="outline" spacing={0} defaultValue="bold">
            <ToggleGroupItem value="bold" aria-label="Bold">
              <Bold />
            </ToggleGroupItem>
            <ToggleGroupItem value="italic" aria-label="Italic">
              <Italic />
            </ToggleGroupItem>
            <ToggleGroupItem value="underline" aria-label="Underline">
              <Underline />
            </ToggleGroupItem>
          </ToggleGroup>
          <div className="w-[240px]">
            <ToggleGroup type="single" size={size} variant="outline" spacing={0} defaultValue="all" equalWidth>
              <ToggleGroupItem value="all">All</ToggleGroupItem>
              <ToggleGroupItem value="missed">Missed</ToggleGroupItem>
            </ToggleGroup>
          </div>
          <div className="w-[240px]">
            <ToggleGroup type="single" size={size} variant="default" spacing={0} defaultValue="all" equalWidth>
              <ToggleGroupItem value="all">All</ToggleGroupItem>
              <ToggleGroupItem value="missed">Missed</ToggleGroupItem>
            </ToggleGroup>
          </div>
        </div>)}
    </div>
}`,...(d=(u=n.parameters)==null?void 0:u.docs)==null?void 0:d.source}}};const b=["AllVariants"];export{n as AllVariants,b as __namedExportsOrder,I as default};
