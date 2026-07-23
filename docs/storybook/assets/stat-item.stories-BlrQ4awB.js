import{j as e}from"./iframe-DUYxWSE4.js";import{S as t,a as s}from"./stat-item-DcJFDLH9.js";import{S as o,a}from"./story-section-BP93x530.js";import{F as n}from"./flask-conical-CxqzDgRD.js";import{U as l}from"./users-CVX4_RDp.js";import{F as r}from"./file-text-B5xFIcz0.js";import"./preload-helper-PPVm8Dsz.js";const v={title:"Components/Stat Item/Stat Item",component:t,args:{icon:e.jsx(l,{}),value:"13,500",label:"Participants"}},i={render:()=>e.jsxs(o,{children:[e.jsx(a,{title:"With icon",children:e.jsx(t,{icon:e.jsx(n,{}),value:"17",label:"Studies"})}),e.jsx(a,{title:"Without icon",children:e.jsx(t,{value:"121,540",label:"Files"})}),e.jsx(a,{title:"Inline layout (icon + value + label on one centered line)",children:e.jsx(t,{layout:s.Inline,icon:e.jsx(l,{}),value:"13,500",label:"Participants"})}),e.jsx(a,{title:"Sizes (md default / lg)",children:e.jsxs("div",{className:"flex items-center gap-12",children:[e.jsx(t,{size:"md",icon:e.jsx(l,{}),value:"13,500",label:"Participants"}),e.jsx(t,{size:"lg",icon:e.jsx(l,{}),value:"13,500",label:"Participants"})]})}),e.jsx(a,{title:"In a grid",children:e.jsxs("div",{className:"grid grid-cols-3 gap-6",children:[e.jsx(t,{icon:e.jsx(l,{}),value:"13,500",label:"Participants"}),e.jsx(t,{icon:e.jsx(n,{}),value:"17",label:"Studies"}),e.jsx(t,{icon:e.jsx(r,{}),value:"121,540",label:"Files"})]})}),e.jsx(a,{title:"On a colored background (iconClassName / labelClassName)",description:"Override icon and label colors so the stat reads well on a dark surface.",children:e.jsx("div",{className:"bg-primary text-primary-foreground inline-flex rounded-md p-6",children:e.jsx(t,{icon:e.jsx(n,{}),value:"38",label:"Studies",iconClassName:"text-primary-foreground",labelClassName:"text-primary-foreground/90"})})})]})};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  render: () => <StoryShowcase>
      <StorySection title="With icon">
        <StatItem icon={<FlaskConical />} value="17" label="Studies" />
      </StorySection>

      <StorySection title="Without icon">
        <StatItem value="121,540" label="Files" />
      </StorySection>

      <StorySection title="Inline layout (icon + value + label on one centered line)">
        <StatItem layout={StatItemLayout.Inline} icon={<Users />} value="13,500" label="Participants" />
      </StorySection>

      <StorySection title="Sizes (md default / lg)">
        <div className="flex items-center gap-12">
          <StatItem size="md" icon={<Users />} value="13,500" label="Participants" />
          <StatItem size="lg" icon={<Users />} value="13,500" label="Participants" />
        </div>
      </StorySection>

      <StorySection title="In a grid">
        <div className="grid grid-cols-3 gap-6">
          <StatItem icon={<Users />} value="13,500" label="Participants" />
          <StatItem icon={<FlaskConical />} value="17" label="Studies" />
          <StatItem icon={<FileText />} value="121,540" label="Files" />
        </div>
      </StorySection>

      <StorySection title="On a colored background (iconClassName / labelClassName)" description="Override icon and label colors so the stat reads well on a dark surface.">
        <div className="bg-primary text-primary-foreground inline-flex rounded-md p-6">
          <StatItem icon={<FlaskConical />} value="38" label="Studies" iconClassName="text-primary-foreground" labelClassName="text-primary-foreground/90" />
        </div>
      </StorySection>
    </StoryShowcase>
}`,...i.parameters?.docs?.source}}};const b=["AllVariants"];export{i as AllVariants,b as __namedExportsOrder,v as default};
