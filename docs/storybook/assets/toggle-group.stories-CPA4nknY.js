import{j as e,r as b}from"./iframe-D7ER49TR.js";import{T as r,a as l}from"./toggle-group-CBvlT8a_.js";import{S as c}from"./story-error-field-CL5AOD_6.js";import{S as v,a as m,b as u}from"./story-section-T7092GL1.js";import{B as t}from"./toggle-CdIszvhF.js";import{I as i,U as s}from"./underline-FqEXJDAW.js";import"./preload-helper-PPVm8Dsz.js";import"./index-Dud_FKwN.js";import"./index-B6dqpAEy.js";import"./index-Bk6opAzS.js";import"./label-COAHrHCp.js";import"./separator-BkZFpBO0.js";const h=["sm","default","lg"],k={title:"Components/Buttons/Toggle Group",component:r,args:{type:"single"}},f=[{value:"pathogenic",label:"Pathogenic",className:"data-[state=on]:bg-red/20 data-[state=on]:text-red-foreground border data-[state=on]:border-red-foreground data-[state=on]:hover:text-red-foreground"},{value:"likely-pathogenic",label:"Likely pathogenic",className:"data-[state=on]:bg-orange/20 data-[state=on]:text-orange-foreground border data-[state=on]:border-orange-foreground data-[state=on]:hover:text-orange-foreground"},{value:"vus",label:"VUS",className:"data-[state=on]:bg-yellow/20 data-[state=on]:text-yellow-foreground border data-[state=on]:border-yellow-foreground data-[state=on]:hover:text-yellow-foreground"},{value:"likely-benign",label:"Likely benign",className:"data-[state=on]:bg-lime/20 data-[state=on]:text-lime-foreground border data-[state=on]:border-lime-foreground data-[state=on]:hover:text-lime-foreground"},{value:"benign",label:"Benign",className:"data-[state=on]:bg-green/20 data-[state=on]:text-green-foreground border data-[state=on]:border-green-foreground data-[state=on]:hover:text-green-foreground"}];function p({value:a,onValueChange:g,defaultValue:x}){return e.jsx(r,{type:"single",size:"default",variant:"outline",spacing:1,className:"flex-wrap justify-start",value:a,defaultValue:x,onValueChange:g,"aria-invalid":!0,children:f.map(o=>e.jsx(l,{value:o.value,className:o.className,children:o.label},o.value))})}function j(){const[a,g]=b.useState("");return e.jsxs("div",{className:"flex flex-col gap-8",children:[e.jsxs("div",{className:"flex flex-col gap-3",children:[e.jsx(u,{children:"Empty — the error clears as soon as a classification is picked"}),e.jsx(c,{label:"Classification",error:"Please pick a classification",invalid:!a,width:560,children:e.jsx(p,{value:a,onValueChange:g})})]}),e.jsxs("div",{className:"flex flex-col gap-3",children:[e.jsx(u,{children:"Picked while still in error — the selected option keeps its own colour, so it stays readable as a classification rather than as an error"}),e.jsx(c,{label:"Classification",error:"Please pick a classification",width:560,children:e.jsx(p,{defaultValue:"vus"})})]})]})}const n={render:()=>e.jsx(v,{direction:"row",children:h.map(a=>e.jsxs(m,{title:`Size ${a}`,align:"center",children:[e.jsx(u,{children:"Single type"}),e.jsxs(r,{type:"single",size:a,variant:"outline",spacing:2,defaultValue:"bold",children:[e.jsx(l,{value:"bold","aria-label":"Bold",children:e.jsx(t,{})}),e.jsx(l,{value:"italic","aria-label":"Italic",children:e.jsx(i,{})}),e.jsx(l,{value:"underline","aria-label":"Underline",children:e.jsx(s,{})})]}),e.jsxs(r,{type:"single",size:a,variant:"default",spacing:2,defaultValue:"bold",children:[e.jsx(l,{value:"bold","aria-label":"Bold",children:e.jsx(t,{})}),e.jsx(l,{value:"italic","aria-label":"Italic",children:e.jsx(i,{})}),e.jsx(l,{value:"underline","aria-label":"Underline",children:e.jsx(s,{})})]}),e.jsxs(r,{type:"single",size:a,variant:"outline",spacing:0,defaultValue:"bold",children:[e.jsx(l,{value:"bold","aria-label":"Bold",children:e.jsx(t,{})}),e.jsx(l,{value:"italic","aria-label":"Italic",children:e.jsx(i,{})}),e.jsx(l,{value:"underline","aria-label":"Underline",children:e.jsx(s,{})})]}),e.jsx("div",{className:"w-[240px]",children:e.jsxs(r,{type:"single",size:a,variant:"outline",spacing:0,defaultValue:"all",equalWidth:!0,children:[e.jsx(l,{value:"all",children:"All"}),e.jsx(l,{value:"missed",children:"Missed"})]})}),e.jsx("div",{className:"w-[240px]",children:e.jsxs(r,{type:"single",size:a,variant:"default",spacing:0,defaultValue:"all",equalWidth:!0,children:[e.jsx(l,{value:"all",children:"All"}),e.jsx(l,{value:"missed",children:"Missed"})]})}),e.jsx(u,{children:"Multiple type"}),e.jsxs(r,{type:"multiple",size:a,variant:"outline",spacing:2,defaultValue:["bold","italic"],children:[e.jsx(l,{value:"bold","aria-label":"Bold",children:e.jsx(t,{})}),e.jsx(l,{value:"italic","aria-label":"Italic",children:e.jsx(i,{})}),e.jsx(l,{value:"underline","aria-label":"Underline",children:e.jsx(s,{})})]})]},a))})},d={render:()=>e.jsx(m,{title:"Error",description:"Only the label and the message turn red.",children:e.jsx(j,{})})};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
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
}`,...n.parameters?.docs?.source}}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  render: () => <StorySection title="Error" description="Only the label and the message turn red.">
      <ToggleGroupErrorDemo />
    </StorySection>
}`,...d.parameters?.docs?.source}}};const L=["AllVariants","ErrorState"];export{n as AllVariants,d as ErrorState,L as __namedExportsOrder,k as default};
