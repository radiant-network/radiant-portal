import{j as e}from"./iframe-5hjCxaQ_.js";import{T as i,a as l}from"./toggle-group-lmqNl3hi.js";import{S as u,a as g,b as n}from"./story-section-Dz-VNK5b.js";import{B as r}from"./toggle-CoaI0BNp.js";import{I as o,U as t}from"./underline-vpJZ5WlK.js";import"./preload-helper-PPVm8Dsz.js";import"./index-DJkBUnxK.js";import"./index-NgiKxE6c.js";const d=["sm","default","lg"],b={title:"Components/Buttons/Toggle Group",component:i,args:{type:"single"}},s={render:()=>e.jsx(u,{direction:"row",children:d.map(a=>e.jsxs(g,{title:`Size ${a}`,align:"center",children:[e.jsx(n,{children:"Single type"}),e.jsxs(i,{type:"single",size:a,variant:"outline",spacing:2,defaultValue:"bold",children:[e.jsx(l,{value:"bold","aria-label":"Bold",children:e.jsx(r,{})}),e.jsx(l,{value:"italic","aria-label":"Italic",children:e.jsx(o,{})}),e.jsx(l,{value:"underline","aria-label":"Underline",children:e.jsx(t,{})})]}),e.jsxs(i,{type:"single",size:a,variant:"default",spacing:2,defaultValue:"bold",children:[e.jsx(l,{value:"bold","aria-label":"Bold",children:e.jsx(r,{})}),e.jsx(l,{value:"italic","aria-label":"Italic",children:e.jsx(o,{})}),e.jsx(l,{value:"underline","aria-label":"Underline",children:e.jsx(t,{})})]}),e.jsxs(i,{type:"single",size:a,variant:"outline",spacing:0,defaultValue:"bold",children:[e.jsx(l,{value:"bold","aria-label":"Bold",children:e.jsx(r,{})}),e.jsx(l,{value:"italic","aria-label":"Italic",children:e.jsx(o,{})}),e.jsx(l,{value:"underline","aria-label":"Underline",children:e.jsx(t,{})})]}),e.jsx("div",{className:"w-[240px]",children:e.jsxs(i,{type:"single",size:a,variant:"outline",spacing:0,defaultValue:"all",equalWidth:!0,children:[e.jsx(l,{value:"all",children:"All"}),e.jsx(l,{value:"missed",children:"Missed"})]})}),e.jsx("div",{className:"w-[240px]",children:e.jsxs(i,{type:"single",size:a,variant:"default",spacing:0,defaultValue:"all",equalWidth:!0,children:[e.jsx(l,{value:"all",children:"All"}),e.jsx(l,{value:"missed",children:"Missed"})]})}),e.jsx(n,{children:"Multiple type"}),e.jsxs(i,{type:"multiple",size:a,variant:"outline",spacing:2,defaultValue:["bold","italic"],children:[e.jsx(l,{value:"bold","aria-label":"Bold",children:e.jsx(r,{})}),e.jsx(l,{value:"italic","aria-label":"Italic",children:e.jsx(o,{})}),e.jsx(l,{value:"underline","aria-label":"Underline",children:e.jsx(t,{})})]})]},a))})};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  render: () => <StoryShowcase direction="row">
      {sizes.map(size => <StorySection key={size} title={\`Size \${size}\`} align="center">
          <StoryLabel>Single type</StoryLabel>
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

          <StoryLabel>Multiple type</StoryLabel>
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
        </StorySection>)}
    </StoryShowcase>
}`,...s.parameters?.docs?.source}}};const j=["AllVariants"];export{s as AllVariants,j as __namedExportsOrder,b as default};
