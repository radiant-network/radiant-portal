import{j as e,c as i}from"./iframe-CdF5EYmg.js";import{S as x,a as t}from"./story-section-D4XYOw5I.js";import{F as r}from"./flask-conical-ByqJrFe0.js";import{U as n}from"./users-MaodY1hn.js";import{F as S}from"./file-text-DYM1Nqra.js";import"./preload-helper-PPVm8Dsz.js";function a({icon:l,value:o,label:c,className:d,iconClassName:m,labelClassName:p,...u}){return e.jsxs("div",{className:i("flex items-center gap-3",d),...u,children:[l&&e.jsx("div",{className:i("text-primary shrink-0 [&_svg]:size-8",m),children:l}),e.jsxs("div",{className:"flex flex-col",children:[e.jsx("span",{className:"text-2xl font-semibold leading-tight",children:o}),e.jsx("span",{className:i("text-muted-foreground text-sm",p),children:c})]})]})}a.__docgenInfo={description:`Compact statistic: optional leading icon + a large value and a muted label.
Used for the "Data Release" figures on the landing page.`,methods:[],displayName:"StatItem",props:{icon:{required:!1,tsType:{name:"ReactNode"},description:""},value:{required:!0,tsType:{name:"ReactNode"},description:""},label:{required:!0,tsType:{name:"ReactNode"},description:""},iconClassName:{required:!1,tsType:{name:"string"},description:""},labelClassName:{required:!1,tsType:{name:"string"},description:""}}};const j={title:"Components/Stat Item/Stat Item",component:a,args:{icon:e.jsx(n,{}),value:"13,500",label:"Participants"}},s={render:()=>e.jsxs(x,{children:[e.jsx(t,{title:"With icon",children:e.jsx(a,{icon:e.jsx(r,{}),value:"17",label:"Studies"})}),e.jsx(t,{title:"Without icon",children:e.jsx(a,{value:"121,540",label:"Files"})}),e.jsx(t,{title:"In a grid",children:e.jsxs("div",{className:"grid grid-cols-3 gap-6",children:[e.jsx(a,{icon:e.jsx(n,{}),value:"13,500",label:"Participants"}),e.jsx(a,{icon:e.jsx(r,{}),value:"17",label:"Studies"}),e.jsx(a,{icon:e.jsx(S,{}),value:"121,540",label:"Files"})]})}),e.jsx(t,{title:"On a colored background (iconClassName / labelClassName)",description:"Override icon and label colors so the stat reads well on a dark surface.",children:e.jsx("div",{className:"bg-primary text-primary-foreground inline-flex rounded-md p-6",children:e.jsx(a,{icon:e.jsx(r,{}),value:"38",label:"Studies",iconClassName:"text-primary-foreground",labelClassName:"text-primary-foreground/90"})})})]})};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  render: () => <StoryShowcase>
      <StorySection title="With icon">
        <StatItem icon={<FlaskConical />} value="17" label="Studies" />
      </StorySection>

      <StorySection title="Without icon">
        <StatItem value="121,540" label="Files" />
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
}`,...s.parameters?.docs?.source}}};const N=["AllVariants"];export{s as AllVariants,N as __namedExportsOrder,j as default};
