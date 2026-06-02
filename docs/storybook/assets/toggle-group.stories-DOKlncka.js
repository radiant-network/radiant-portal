import{j as e}from"./iframe-DaN5ePGy.js";import{T as i,a as l}from"./toggle-group-Bg9QcZTe.js";import{B as r}from"./toggle-CvEZfL22.js";import{I as t,U as o}from"./underline-CLKpMD1B.js";import"./preload-helper-PPVm8Dsz.js";import"./index-CZCzdGEw.js";import"./index-DeH_VHOF.js";const u=["sm","default","lg"],v={title:"Buttons/ToggleGroup",component:i,args:{type:"single"}},s={render:()=>e.jsx("div",{className:"flex gap-26",children:u.map(a=>e.jsxs("div",{className:"flex flex-col items-center gap-3",children:[e.jsxs("div",{className:"text-sm font-bold text-muted-foreground mb-4",children:["Size: ",a]}),e.jsx("span",{className:"text-muted-foreground text-sm uppercase",children:"Single type"}),e.jsxs(i,{type:"single",size:a,variant:"outline",spacing:2,defaultValue:"bold",children:[e.jsx(l,{value:"bold","aria-label":"Bold",children:e.jsx(r,{})}),e.jsx(l,{value:"italic","aria-label":"Italic",children:e.jsx(t,{})}),e.jsx(l,{value:"underline","aria-label":"Underline",children:e.jsx(o,{})})]}),e.jsxs(i,{type:"single",size:a,variant:"default",spacing:2,defaultValue:"bold",children:[e.jsx(l,{value:"bold","aria-label":"Bold",children:e.jsx(r,{})}),e.jsx(l,{value:"italic","aria-label":"Italic",children:e.jsx(t,{})}),e.jsx(l,{value:"underline","aria-label":"Underline",children:e.jsx(o,{})})]}),e.jsxs(i,{type:"single",size:a,variant:"outline",spacing:0,defaultValue:"bold",children:[e.jsx(l,{value:"bold","aria-label":"Bold",children:e.jsx(r,{})}),e.jsx(l,{value:"italic","aria-label":"Italic",children:e.jsx(t,{})}),e.jsx(l,{value:"underline","aria-label":"Underline",children:e.jsx(o,{})})]}),e.jsx("div",{className:"w-[240px]",children:e.jsxs(i,{type:"single",size:a,variant:"outline",spacing:0,defaultValue:"all",equalWidth:!0,children:[e.jsx(l,{value:"all",children:"All"}),e.jsx(l,{value:"missed",children:"Missed"})]})}),e.jsx("div",{className:"w-[240px]",children:e.jsxs(i,{type:"single",size:a,variant:"default",spacing:0,defaultValue:"all",equalWidth:!0,children:[e.jsx(l,{value:"all",children:"All"}),e.jsx(l,{value:"missed",children:"Missed"})]})}),e.jsx("span",{className:"text-muted-foreground text-sm uppercase",children:"Multiple type"}),e.jsxs(i,{type:"multiple",size:a,variant:"outline",spacing:2,defaultValue:["bold","italic"],children:[e.jsx(l,{value:"bold","aria-label":"Bold",children:e.jsx(r,{})}),e.jsx(l,{value:"italic","aria-label":"Italic",children:e.jsx(t,{})}),e.jsx(l,{value:"underline","aria-label":"Underline",children:e.jsx(o,{})})]})]},a))})};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  render: () => <div className="flex gap-26">
      {sizes.map(size => <div key={size} className="flex flex-col items-center gap-3">
          <div className="text-sm font-bold text-muted-foreground mb-4">Size: {size}</div>
          <span className="text-muted-foreground text-sm uppercase">Single type</span>
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

          <span className="text-muted-foreground text-sm uppercase">Multiple type</span>
          <ToggleGroup type="multiple" size={size} variant="outline" spacing={2} defaultValue={['bold', 'italic']}>
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
        </div>)}
    </div>
}`,...s.parameters?.docs?.source}}};const T=["AllVariants"];export{s as AllVariants,T as __namedExportsOrder,v as default};
