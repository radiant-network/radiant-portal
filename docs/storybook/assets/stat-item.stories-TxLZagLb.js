import{n as e}from"./rolldown-runtime-C0FnF6B9.js";import{t}from"./jsx-runtime-BdxMnOeJ.js";import{n,t as r}from"./createLucideIcon-BZk7HdX5.js";import{n as i,t as a}from"./book-open-text-BPCtwtwA.js";import{n as o,t as s}from"./file-text-DLvHsPz8.js";import{n as c,t as l}from"./flask-conical-BYREMSRM.js";import{n as u,t as d}from"./user-kCV1wli6.js";import{n as f,t as p}from"./users-B1eOm8So.js";import{i as m,n as h,r as g,t as _}from"./story-section-DVTm6cGm.js";import{i as v,n as y,r as b,t as x}from"./stat-item-Dc6hjp-F.js";var S,C;function w(){return(w=e((()=>{n(),S={name:`users-round`,size:24,node:[[`path`,{d:`M18 21a8 8 0 0 0-16 0`,key:`3ypg7q`}],[`circle`,{cx:`10`,cy:`8`,r:`5`,key:`o932ke`}],[`path`,{d:`M22 20c0-3.37-2-6.5-4-8a5 5 0 0 0-.45-8.3`,key:`10s06x`}]],aliases:[`users-2`]},S.node,C=r(S)})))()}var T,E,D,O,k;function A(){return(A=e((()=>{i(),o(),c(),u(),f(),w(),v(),m(),T=t(),E={title:`Components/Stat Item`,component:x,args:{icon:(0,T.jsx)(p,{}),value:`13,500`,label:`Participants`}},D=[{icon:(0,T.jsx)(a,{}),value:`7`,label:`Studies`},{icon:(0,T.jsx)(d,{}),value:`8,559`,label:`Participants`},{icon:(0,T.jsx)(C,{}),value:`2,322`,label:`Families`},{icon:(0,T.jsx)(l,{}),value:`13.2K`,label:`Biospecimens`},{icon:(0,T.jsx)(s,{}),value:`313K`,label:`Data Files`}],O={render:()=>(0,T.jsxs)(g,{children:[(0,T.jsx)(h,{title:`With icon`,children:(0,T.jsx)(x,{icon:(0,T.jsx)(l,{}),value:`17`,label:`Studies`})}),(0,T.jsx)(h,{title:`Without icon`,children:(0,T.jsx)(x,{value:`121,540`,label:`Files`})}),(0,T.jsx)(h,{title:`Inline layout (icon + value + label on one centered line)`,children:(0,T.jsx)(x,{layout:b.Inline,icon:(0,T.jsx)(p,{}),value:`13,500`,label:`Participants`})}),(0,T.jsx)(h,{title:`Sizes (md default / lg)`,children:(0,T.jsxs)(`div`,{className:`flex items-center gap-12`,children:[(0,T.jsx)(x,{size:`md`,icon:(0,T.jsx)(p,{}),value:`13,500`,label:`Participants`}),(0,T.jsx)(x,{size:`lg`,icon:(0,T.jsx)(p,{}),value:`13,500`,label:`Participants`})]})}),(0,T.jsx)(h,{title:`Icon alignment (center default / start)`,description:`Start aligns the icon with the first line — the value — instead of centering it across the value and label. Shown at both sizes: the shift grows with the value.`,children:(0,T.jsx)(`div`,{className:`flex flex-col gap-6`,children:[`md`,`lg`].map(e=>(0,T.jsxs)(`div`,{className:`flex flex-col gap-2`,children:[(0,T.jsx)(_,{children:e}),(0,T.jsxs)(`div`,{className:`flex items-start gap-12`,children:[(0,T.jsxs)(`div`,{className:`flex flex-col gap-2`,children:[(0,T.jsx)(_,{children:`center`}),(0,T.jsx)(x,{size:e,icon:(0,T.jsx)(p,{}),value:`13,500`,label:`Participants`})]}),(0,T.jsxs)(`div`,{className:`flex flex-col gap-2`,children:[(0,T.jsx)(_,{children:`start`}),(0,T.jsx)(x,{size:e,icon:(0,T.jsx)(p,{}),value:`13,500`,label:`Participants`,align:y.Start})]})]})]},e))})}),(0,T.jsx)(h,{title:`In a grid`,children:(0,T.jsxs)(`div`,{className:`grid grid-cols-3 gap-6`,children:[(0,T.jsx)(x,{icon:(0,T.jsx)(p,{}),value:`13,500`,label:`Participants`}),(0,T.jsx)(x,{icon:(0,T.jsx)(l,{}),value:`17`,label:`Studies`}),(0,T.jsx)(x,{icon:(0,T.jsx)(s,{}),value:`121,540`,label:`Files`})]})}),(0,T.jsx)(h,{title:`On a colored background (iconClassName / labelClassName)`,description:`Override icon and label colors so the stat reads well on a dark surface.`,children:(0,T.jsx)(`div`,{className:`bg-primary text-primary-foreground inline-flex rounded-md p-6`,children:(0,T.jsx)(x,{icon:(0,T.jsx)(l,{}),value:`38`,label:`Studies`,iconClassName:`text-primary-foreground`,labelClassName:`text-primary-foreground/90`})})}),(0,T.jsx)(h,{title:`In bordered cells on a dark panel`,description:`Data exploration band: each stat gets its own bordered cell, the icon keeping an accent distinct from the value.`,children:(0,T.jsxs)(`div`,{className:`bg-primary text-primary-foreground w-full space-y-3 rounded-md p-4`,children:[(0,T.jsx)(`span`,{className:`text-sm font-semibold`,children:`Data Exploration`}),(0,T.jsx)(`div`,{className:`grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-5`,children:D.map(e=>(0,T.jsx)(`div`,{className:`border-primary-foreground/20 rounded-sm border p-3`,children:(0,T.jsx)(x,{icon:e.icon,value:e.value,label:e.label,align:y.Start,iconClassName:`text-[var(--color-radiant-400)]`,labelClassName:`text-primary-foreground/90`})},e.label))})]})})]})},O.parameters={...O.parameters,docs:{...O.parameters?.docs,source:{originalSource:`{
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
}`,...O.parameters?.docs?.source}}},k=[`AllVariants`]})))()}A();export{O as AllVariants,k as __namedExportsOrder,E as default};