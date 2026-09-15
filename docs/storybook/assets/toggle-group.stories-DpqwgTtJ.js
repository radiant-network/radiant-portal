import{n as e}from"./rolldown-runtime-C0FnF6B9.js";import{t}from"./react-BRh_h4kc.js";import{t as n}from"./jsx-runtime-BdxMnOeJ.js";import{a as r,i}from"./toggle-BypjQF-J.js";import{n as a,r as o,t as s}from"./toggle-group-snGjlH5E.js";import{i as c,n as l,r as u,t as d}from"./underline-DrFIC5Zq.js";import{i as f,n as p,r as m,t as h}from"./story-section-DVTm6cGm.js";import{n as g,t as _}from"./story-error-field-DeLRAi8K.js";function v({value:e,onValueChange:t,defaultValue:n}){return(0,x.jsx)(s,{type:`single`,size:`default`,variant:`outline`,spacing:1,className:`flex-wrap justify-start`,value:e,defaultValue:n,onValueChange:t,"aria-invalid":!0,children:w.map(e=>(0,x.jsx)(a,{value:e.value,className:e.className,children:e.label},e.value))})}function y(){let[e,t]=(0,b.useState)(``);return(0,x.jsxs)(`div`,{className:`flex flex-col gap-8`,children:[(0,x.jsxs)(`div`,{className:`flex flex-col gap-3`,children:[(0,x.jsx)(h,{children:`Empty — the error clears as soon as a classification is picked`}),(0,x.jsx)(_,{label:`Classification`,error:`Please pick a classification`,invalid:!e,width:560,children:(0,x.jsx)(v,{value:e,onValueChange:t})})]}),(0,x.jsxs)(`div`,{className:`flex flex-col gap-3`,children:[(0,x.jsx)(h,{children:`Picked while still in error — the selected option keeps its own colour, so it stays readable as a classification rather than as an error`}),(0,x.jsx)(_,{label:`Classification`,error:`Please pick a classification`,width:560,children:(0,x.jsx)(v,{defaultValue:`vus`})})]})]})}var b,x,S,C,w,T,E,D;function O(){return(O=e((()=>{b=t(),r(),c(),l(),o(),g(),f(),x=n(),S=[`sm`,`default`,`lg`],C={title:`Components/Buttons/Toggle Group`,component:s,args:{type:`single`}},w=[{value:`pathogenic`,label:`Pathogenic`,className:`data-[state=on]:bg-red/20 data-[state=on]:text-red-foreground border data-[state=on]:border-red-foreground data-[state=on]:hover:text-red-foreground`},{value:`likely-pathogenic`,label:`Likely pathogenic`,className:`data-[state=on]:bg-orange/20 data-[state=on]:text-orange-foreground border data-[state=on]:border-orange-foreground data-[state=on]:hover:text-orange-foreground`},{value:`vus`,label:`VUS`,className:`data-[state=on]:bg-yellow/20 data-[state=on]:text-yellow-foreground border data-[state=on]:border-yellow-foreground data-[state=on]:hover:text-yellow-foreground`},{value:`likely-benign`,label:`Likely benign`,className:`data-[state=on]:bg-lime/20 data-[state=on]:text-lime-foreground border data-[state=on]:border-lime-foreground data-[state=on]:hover:text-lime-foreground`},{value:`benign`,label:`Benign`,className:`data-[state=on]:bg-green/20 data-[state=on]:text-green-foreground border data-[state=on]:border-green-foreground data-[state=on]:hover:text-green-foreground`}],T={render:()=>(0,x.jsx)(m,{direction:`row`,children:S.map(e=>(0,x.jsxs)(p,{title:`Size ${e}`,align:`center`,children:[(0,x.jsx)(h,{children:`Single type`}),(0,x.jsxs)(s,{type:`single`,size:e,variant:`outline`,spacing:2,defaultValue:`bold`,children:[(0,x.jsx)(a,{value:`bold`,"aria-label":`Bold`,children:(0,x.jsx)(i,{})}),(0,x.jsx)(a,{value:`italic`,"aria-label":`Italic`,children:(0,x.jsx)(u,{})}),(0,x.jsx)(a,{value:`underline`,"aria-label":`Underline`,children:(0,x.jsx)(d,{})})]}),(0,x.jsxs)(s,{type:`single`,size:e,variant:`default`,spacing:2,defaultValue:`bold`,children:[(0,x.jsx)(a,{value:`bold`,"aria-label":`Bold`,children:(0,x.jsx)(i,{})}),(0,x.jsx)(a,{value:`italic`,"aria-label":`Italic`,children:(0,x.jsx)(u,{})}),(0,x.jsx)(a,{value:`underline`,"aria-label":`Underline`,children:(0,x.jsx)(d,{})})]}),(0,x.jsxs)(s,{type:`single`,size:e,variant:`outline`,spacing:0,defaultValue:`bold`,children:[(0,x.jsx)(a,{value:`bold`,"aria-label":`Bold`,children:(0,x.jsx)(i,{})}),(0,x.jsx)(a,{value:`italic`,"aria-label":`Italic`,children:(0,x.jsx)(u,{})}),(0,x.jsx)(a,{value:`underline`,"aria-label":`Underline`,children:(0,x.jsx)(d,{})})]}),(0,x.jsx)(`div`,{className:`w-[240px]`,children:(0,x.jsxs)(s,{type:`single`,size:e,variant:`outline`,spacing:0,defaultValue:`all`,equalWidth:!0,children:[(0,x.jsx)(a,{value:`all`,children:`All`}),(0,x.jsx)(a,{value:`missed`,children:`Missed`})]})}),(0,x.jsx)(`div`,{className:`w-[240px]`,children:(0,x.jsxs)(s,{type:`single`,size:e,variant:`default`,spacing:0,defaultValue:`all`,equalWidth:!0,children:[(0,x.jsx)(a,{value:`all`,children:`All`}),(0,x.jsx)(a,{value:`missed`,children:`Missed`})]})}),(0,x.jsx)(h,{children:`Multiple type`}),(0,x.jsxs)(s,{type:`multiple`,size:e,variant:`outline`,spacing:2,defaultValue:[`bold`,`italic`],children:[(0,x.jsx)(a,{value:`bold`,"aria-label":`Bold`,children:(0,x.jsx)(i,{})}),(0,x.jsx)(a,{value:`italic`,"aria-label":`Italic`,children:(0,x.jsx)(u,{})}),(0,x.jsx)(a,{value:`underline`,"aria-label":`Underline`,children:(0,x.jsx)(d,{})})]})]},e))})},E={render:()=>(0,x.jsx)(p,{title:`Error`,description:`Only the label and the message turn red.`,children:(0,x.jsx)(y,{})})},T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`{
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
}`,...T.parameters?.docs?.source}}},E.parameters={...E.parameters,docs:{...E.parameters?.docs,source:{originalSource:`{
  render: () => <StorySection title="Error" description="Only the label and the message turn red.">
      <ToggleGroupErrorDemo />
    </StorySection>
}`,...E.parameters?.docs?.source}}},D=[`AllVariants`,`ErrorState`]})))()}O();export{T as AllVariants,E as ErrorState,D as __namedExportsOrder,C as default};