import{a as m,j as e}from"./iframe-DY5-UQdi.js";import{S as a,a as x,b as n}from"./stat-item-DAMgMBvx.js";import{S as p,a as l,b as o}from"./story-section-BfGxLv6g.js";import{F as r}from"./flask-conical-DpWpDT-n.js";import{U as i}from"./users-Cw9Bi7ei.js";import{F as c}from"./file-text-BAaN_0U_.js";import{B as u}from"./book-open-text-BcTDD_Ok.js";import{U as S}from"./user-DicrVcQZ.js";import"./preload-helper-PPVm8Dsz.js";const d={name:"users-round",size:24,node:[["path",{d:"M18 21a8 8 0 0 0-16 0",key:"3ypg7q"}],["circle",{cx:"10",cy:"8",r:"5",key:"o932ke"}],["path",{d:"M22 20c0-3.37-2-6.5-4-8a5 5 0 0 0-.45-8.3",key:"10s06x"}]],aliases:["users-2"]};d.node;const v=m(d),C={title:"Components/Stat Item",component:a,args:{icon:e.jsx(i,{}),value:"13,500",label:"Participants"}},g=[{icon:e.jsx(u,{}),value:"7",label:"Studies"},{icon:e.jsx(S,{}),value:"8,559",label:"Participants"},{icon:e.jsx(v,{}),value:"2,322",label:"Families"},{icon:e.jsx(r,{}),value:"13.2K",label:"Biospecimens"},{icon:e.jsx(c,{}),value:"313K",label:"Data Files"}],s={render:()=>e.jsxs(p,{children:[e.jsx(l,{title:"With icon",children:e.jsx(a,{icon:e.jsx(r,{}),value:"17",label:"Studies"})}),e.jsx(l,{title:"Without icon",children:e.jsx(a,{value:"121,540",label:"Files"})}),e.jsx(l,{title:"Inline layout (icon + value + label on one centered line)",children:e.jsx(a,{layout:x.Inline,icon:e.jsx(i,{}),value:"13,500",label:"Participants"})}),e.jsx(l,{title:"Sizes (md default / lg)",children:e.jsxs("div",{className:"flex items-center gap-12",children:[e.jsx(a,{size:"md",icon:e.jsx(i,{}),value:"13,500",label:"Participants"}),e.jsx(a,{size:"lg",icon:e.jsx(i,{}),value:"13,500",label:"Participants"})]})}),e.jsx(l,{title:"Icon alignment (center default / start)",description:"Start aligns the icon with the first line — the value — instead of centering it across the value and label. Shown at both sizes: the shift grows with the value.",children:e.jsx("div",{className:"flex flex-col gap-6",children:["md","lg"].map(t=>e.jsxs("div",{className:"flex flex-col gap-2",children:[e.jsx(o,{children:t}),e.jsxs("div",{className:"flex items-start gap-12",children:[e.jsxs("div",{className:"flex flex-col gap-2",children:[e.jsx(o,{children:"center"}),e.jsx(a,{size:t,icon:e.jsx(i,{}),value:"13,500",label:"Participants"})]}),e.jsxs("div",{className:"flex flex-col gap-2",children:[e.jsx(o,{children:"start"}),e.jsx(a,{size:t,icon:e.jsx(i,{}),value:"13,500",label:"Participants",align:n.Start})]})]})]},t))})}),e.jsx(l,{title:"In a grid",children:e.jsxs("div",{className:"grid grid-cols-3 gap-6",children:[e.jsx(a,{icon:e.jsx(i,{}),value:"13,500",label:"Participants"}),e.jsx(a,{icon:e.jsx(r,{}),value:"17",label:"Studies"}),e.jsx(a,{icon:e.jsx(c,{}),value:"121,540",label:"Files"})]})}),e.jsx(l,{title:"On a colored background (iconClassName / labelClassName)",description:"Override icon and label colors so the stat reads well on a dark surface.",children:e.jsx("div",{className:"bg-primary text-primary-foreground inline-flex rounded-md p-6",children:e.jsx(a,{icon:e.jsx(r,{}),value:"38",label:"Studies",iconClassName:"text-primary-foreground",labelClassName:"text-primary-foreground/90"})})}),e.jsx(l,{title:"In bordered cells on a dark panel",description:"Data exploration band: each stat gets its own bordered cell, the icon keeping an accent distinct from the value.",children:e.jsxs("div",{className:"bg-primary text-primary-foreground w-full space-y-3 rounded-md p-4",children:[e.jsx("span",{className:"text-sm font-semibold",children:"Data Exploration"}),e.jsx("div",{className:"grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-5",children:g.map(t=>e.jsx("div",{className:"border-primary-foreground/20 rounded-sm border p-3",children:e.jsx(a,{icon:t.icon,value:t.value,label:t.label,align:n.Start,iconClassName:"text-[var(--color-radiant-400)]",labelClassName:"text-primary-foreground/90"})},t.label))})]})})]})};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
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

      <StorySection title="Icon alignment (center default / start)" description="Start aligns the icon with the first line — the value — instead of centering it across the value and label. Shown at both sizes: the shift grows with the value.">
        <div className="flex flex-col gap-6">
          {(['md', 'lg'] as const).map(size => <div key={size} className="flex flex-col gap-2">
              <StoryLabel>{size}</StoryLabel>
              <div className="flex items-start gap-12">
                <div className="flex flex-col gap-2">
                  <StoryLabel>center</StoryLabel>
                  <StatItem size={size} icon={<Users />} value="13,500" label="Participants" />
                </div>
                <div className="flex flex-col gap-2">
                  <StoryLabel>start</StoryLabel>
                  <StatItem size={size} icon={<Users />} value="13,500" label="Participants" align={StatItemAlign.Start} />
                </div>
              </div>
            </div>)}
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

      <StorySection title="In bordered cells on a dark panel" description="Data exploration band: each stat gets its own bordered cell, the icon keeping an accent distinct from the value.">
        <div className="bg-primary text-primary-foreground w-full space-y-3 rounded-md p-4">
          <span className="text-sm font-semibold">Data Exploration</span>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-5">
            {dataExplorationStats.map(stat => <div key={stat.label} className="border-primary-foreground/20 rounded-sm border p-3">
                <StatItem icon={stat.icon} value={stat.value} label={stat.label} align={StatItemAlign.Start} iconClassName="text-[var(--color-radiant-400)]" labelClassName="text-primary-foreground/90" />
              </div>)}
          </div>
        </div>
      </StorySection>
    </StoryShowcase>
}`,...s.parameters?.docs?.source}}};const F=["AllVariants"];export{s as AllVariants,F as __namedExportsOrder,C as default};
