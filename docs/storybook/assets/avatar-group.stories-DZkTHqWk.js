import{j as a}from"./iframe-kLaNX2HI.js";import{A as i,a as s,b as l,c as p,d as j}from"./avatar-D3AewqXD.js";import{H as m,a as h,b as x}from"./hover-card-CLIR5t5m.js";import{a as v,b as n}from"./story-section-YShHgFMq.js";import{a as A}from"./utils-BQbZHAUO.js";import{U as b}from"./user-iih5RIk4.js";import"./preload-helper-PPVm8Dsz.js";const G={title:"Components/Avatars/Avatar Group",component:i,argTypes:{size:{options:A,control:{type:"select"}}}},u="https://github.com/shadcn.png",r=[{name:"Charles Nelson",initials:"CN",color:"violet"},{name:"Alex Bernard",initials:"AB",color:"emerald"},{name:"Julie Martin",initials:"JM",color:"blue"},{name:"Sarah Wilson",initials:"SW",color:"rose"},{name:"David Brown",initials:"DB",color:"amber"}],t={render:()=>a.jsxs(v,{title:"Variants",children:[a.jsxs("div",{className:"space-y-2",children:[a.jsx(n,{children:"Two avatars"}),a.jsx(i,{size:"md",children:r.slice(0,2).map(e=>a.jsx(s,{children:a.jsx(l,{color:e.color,children:e.initials})},e.initials))})]}),a.jsxs("div",{className:"space-y-2",children:[a.jsx(n,{children:"With overflow"}),a.jsxs(i,{size:"md",children:[r.slice(0,3).map(e=>a.jsx(s,{children:a.jsx(l,{color:e.color,children:e.initials})},e.initials)),a.jsxs(p,{children:["+",r.length-3]})]})]}),a.jsxs("div",{className:"space-y-2",children:[a.jsx(n,{children:"Mixed fallback types"}),a.jsxs(i,{size:"md",children:[a.jsxs(s,{children:[a.jsx(j,{src:u,alt:"@shadcn"}),a.jsx(l,{color:"violet",children:"CN"})]}),a.jsx(s,{children:a.jsx(l,{color:"emerald",children:"AB"})}),a.jsx(s,{children:a.jsx(l,{color:"blue",children:a.jsx(b,{className:"size-1/2"})})})]})]}),a.jsxs("div",{className:"space-y-2",children:[a.jsx(n,{children:"Mixed colors"}),a.jsx(i,{size:"md",children:r.map(e=>a.jsx(s,{children:a.jsx(l,{color:e.color,children:e.initials})},e.initials))})]})]})},o={render:()=>a.jsx(v,{title:"Sizes",children:A.map(e=>a.jsxs("div",{className:"flex items-center gap-4",children:[a.jsx("div",{className:"w-10",children:a.jsx(n,{children:e})}),a.jsxs(i,{size:e,children:[r.slice(0,3).map(d=>a.jsx(s,{children:a.jsx(l,{color:d.color,children:d.initials})},d.initials)),a.jsxs(p,{children:["+",r.length-3]})]})]},e))})},c={render:()=>a.jsx(v,{title:"With hover card",children:a.jsxs("div",{className:"flex items-start gap-10",children:[a.jsxs("div",{className:"space-y-2",children:[a.jsx(n,{children:"Hover card on group level"}),a.jsxs(m,{children:[a.jsx(h,{asChild:!0,children:a.jsxs(i,{size:"md",children:[r.slice(0,3).map(e=>a.jsx(s,{children:a.jsx(l,{color:e.color,children:e.initials})},e.initials)),a.jsxs(p,{children:["+",r.length-3]})]})}),a.jsx(x,{className:"w-64",children:a.jsxs("div",{className:"flex flex-col gap-2",children:[a.jsxs("span",{className:"text-sm font-semibold",children:[r.length," members"]}),r.map(e=>a.jsxs("div",{className:"flex items-center gap-2",children:[a.jsx(s,{size:"2xs",children:a.jsx(l,{color:e.color,children:e.initials})}),a.jsx("span",{className:"text-sm",children:e.name})]},e.initials))]})})]})]}),a.jsxs("div",{className:"space-y-2",children:[a.jsx(n,{children:"Hover card per child"}),a.jsx(i,{size:"md",children:r.slice(0,3).map(e=>a.jsxs(m,{children:[a.jsx(h,{asChild:!0,children:a.jsx(s,{children:a.jsx(l,{color:e.color,children:e.initials})})}),a.jsx(x,{className:"w-48",children:a.jsx("span",{className:"text-sm font-semibold",children:e.name})})]},e.initials))})]})]})})};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  render: () => <StorySection title="Variants">
      <div className="space-y-2">
        <StoryLabel>Two avatars</StoryLabel>
        <AvatarGroup size="md">
          {people.slice(0, 2).map(p => <Avatar key={p.initials}>
              <AvatarFallback color={p.color}>{p.initials}</AvatarFallback>
            </Avatar>)}
        </AvatarGroup>
      </div>

      <div className="space-y-2">
        <StoryLabel>With overflow</StoryLabel>
        <AvatarGroup size="md">
          {people.slice(0, 3).map(p => <Avatar key={p.initials}>
              <AvatarFallback color={p.color}>{p.initials}</AvatarFallback>
            </Avatar>)}
          <AvatarGroupCount>+{people.length - 3}</AvatarGroupCount>
        </AvatarGroup>
      </div>

      <div className="space-y-2">
        <StoryLabel>Mixed fallback types</StoryLabel>
        <AvatarGroup size="md">
          <Avatar>
            <AvatarImage src={IMAGE_SRC} alt="@shadcn" />
            <AvatarFallback color="violet">CN</AvatarFallback>
          </Avatar>
          <Avatar>
            <AvatarFallback color="emerald">AB</AvatarFallback>
          </Avatar>
          <Avatar>
            <AvatarFallback color="blue">
              <UserIcon className="size-1/2" />
            </AvatarFallback>
          </Avatar>
        </AvatarGroup>
      </div>

      <div className="space-y-2">
        <StoryLabel>Mixed colors</StoryLabel>
        <AvatarGroup size="md">
          {people.map(p => <Avatar key={p.initials}>
              <AvatarFallback color={p.color}>{p.initials}</AvatarFallback>
            </Avatar>)}
        </AvatarGroup>
      </div>
    </StorySection>
}`,...t.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  render: () => <StorySection title="Sizes">
      {avatarSizes.map(size => <div key={size} className="flex items-center gap-4">
          <div className="w-10">
            <StoryLabel>{size}</StoryLabel>
          </div>
          <AvatarGroup size={size}>
            {people.slice(0, 3).map(p => <Avatar key={p.initials}>
                <AvatarFallback color={p.color}>{p.initials}</AvatarFallback>
              </Avatar>)}
            <AvatarGroupCount>+{people.length - 3}</AvatarGroupCount>
          </AvatarGroup>
        </div>)}
    </StorySection>
}`,...o.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  render: () => <StorySection title="With hover card">
      <div className="flex items-start gap-10">
        {/* Group-level */}
        <div className="space-y-2">
          <StoryLabel>Hover card on group level</StoryLabel>
          <HoverCard>
            <HoverCardTrigger asChild>
              <AvatarGroup size="md">
                {people.slice(0, 3).map(p => <Avatar key={p.initials}>
                    <AvatarFallback color={p.color}>{p.initials}</AvatarFallback>
                  </Avatar>)}
                <AvatarGroupCount>+{people.length - 3}</AvatarGroupCount>
              </AvatarGroup>
            </HoverCardTrigger>
            <HoverCardContent className="w-64">
              <div className="flex flex-col gap-2">
                <span className="text-sm font-semibold">{people.length} members</span>
                {people.map(p => <div key={p.initials} className="flex items-center gap-2">
                    <Avatar size="2xs">
                      <AvatarFallback color={p.color}>{p.initials}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm">{p.name}</span>
                  </div>)}
              </div>
            </HoverCardContent>
          </HoverCard>
        </div>

        {/* Per-child */}
        <div className="space-y-2">
          <StoryLabel>Hover card per child</StoryLabel>
          <AvatarGroup size="md">
            {people.slice(0, 3).map(p => <HoverCard key={p.initials}>
                <HoverCardTrigger asChild>
                  <Avatar>
                    <AvatarFallback color={p.color}>{p.initials}</AvatarFallback>
                  </Avatar>
                </HoverCardTrigger>
                <HoverCardContent className="w-48">
                  <span className="text-sm font-semibold">{p.name}</span>
                </HoverCardContent>
              </HoverCard>)}
          </AvatarGroup>
        </div>
      </div>
    </StorySection>
}`,...c.parameters?.docs?.source}}};const f=["Variants","Sizes","WithHoverCard"];export{o as Sizes,t as Variants,c as WithHoverCard,f as __namedExportsOrder,G as default};
