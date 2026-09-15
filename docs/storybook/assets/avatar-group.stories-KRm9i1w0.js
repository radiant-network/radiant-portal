import{n as e}from"./rolldown-runtime-C0FnF6B9.js";import{t}from"./jsx-runtime-BdxMnOeJ.js";import{a as n,i as r,n as i,o as a,r as o,t as s}from"./avatar-CNwySCT8.js";import{i as c,n as l,r as u,t as d}from"./hover-card-Cb1_WjL0.js";import{n as f,t as p}from"./user-kCV1wli6.js";import{i as m,n as h,t as g}from"./story-section-DVTm6cGm.js";import{n as _,r as v}from"./utils-C2FSVfac.js";var y,b,x,S,C,w,T,E;function D(){return(D=e((()=>{f(),a(),c(),m(),v(),y=t(),b={title:`Components/Avatars/Avatar Group`,component:o,argTypes:{size:{options:_,control:{type:`select`}}}},x=`https://github.com/shadcn.png`,S=[{name:`Charles Nelson`,initials:`CN`,color:`violet`},{name:`Alex Bernard`,initials:`AB`,color:`emerald`},{name:`Julie Martin`,initials:`JM`,color:`blue`},{name:`Sarah Wilson`,initials:`SW`,color:`rose`},{name:`David Brown`,initials:`DB`,color:`amber`}],C={render:()=>(0,y.jsxs)(h,{title:`Variants`,children:[(0,y.jsxs)(`div`,{className:`space-y-2`,children:[(0,y.jsx)(g,{children:`Two avatars`}),(0,y.jsx)(o,{size:`md`,children:S.slice(0,2).map(e=>(0,y.jsx)(s,{children:(0,y.jsx)(i,{color:e.color,children:e.initials})},e.initials))})]}),(0,y.jsxs)(`div`,{className:`space-y-2`,children:[(0,y.jsx)(g,{children:`With overflow`}),(0,y.jsxs)(o,{size:`md`,children:[S.slice(0,3).map(e=>(0,y.jsx)(s,{children:(0,y.jsx)(i,{color:e.color,children:e.initials})},e.initials)),(0,y.jsxs)(r,{children:[`+`,S.length-3]})]})]}),(0,y.jsxs)(`div`,{className:`space-y-2`,children:[(0,y.jsx)(g,{children:`Mixed fallback types`}),(0,y.jsxs)(o,{size:`md`,children:[(0,y.jsxs)(s,{children:[(0,y.jsx)(n,{src:x,alt:`@shadcn`}),(0,y.jsx)(i,{color:`violet`,children:`CN`})]}),(0,y.jsx)(s,{children:(0,y.jsx)(i,{color:`emerald`,children:`AB`})}),(0,y.jsx)(s,{children:(0,y.jsx)(i,{color:`blue`,children:(0,y.jsx)(p,{className:`size-1/2`})})})]})]}),(0,y.jsxs)(`div`,{className:`space-y-2`,children:[(0,y.jsx)(g,{children:`Mixed colors`}),(0,y.jsx)(o,{size:`md`,children:S.map(e=>(0,y.jsx)(s,{children:(0,y.jsx)(i,{color:e.color,children:e.initials})},e.initials))})]})]})},w={render:()=>(0,y.jsx)(h,{title:`Sizes`,children:_.map(e=>(0,y.jsxs)(`div`,{className:`flex items-center gap-4`,children:[(0,y.jsx)(`div`,{className:`w-10`,children:(0,y.jsx)(g,{children:e})}),(0,y.jsxs)(o,{size:e,children:[S.slice(0,3).map(e=>(0,y.jsx)(s,{children:(0,y.jsx)(i,{color:e.color,children:e.initials})},e.initials)),(0,y.jsxs)(r,{children:[`+`,S.length-3]})]})]},e))})},T={render:()=>(0,y.jsx)(h,{title:`With hover card`,children:(0,y.jsxs)(`div`,{className:`flex items-start gap-10`,children:[(0,y.jsxs)(`div`,{className:`space-y-2`,children:[(0,y.jsx)(g,{children:`Hover card on group level`}),(0,y.jsxs)(d,{children:[(0,y.jsx)(u,{asChild:!0,children:(0,y.jsxs)(o,{size:`md`,children:[S.slice(0,3).map(e=>(0,y.jsx)(s,{children:(0,y.jsx)(i,{color:e.color,children:e.initials})},e.initials)),(0,y.jsxs)(r,{children:[`+`,S.length-3]})]})}),(0,y.jsx)(l,{className:`w-64`,children:(0,y.jsxs)(`div`,{className:`flex flex-col gap-2`,children:[(0,y.jsxs)(`span`,{className:`text-sm font-semibold`,children:[S.length,` members`]}),S.map(e=>(0,y.jsxs)(`div`,{className:`flex items-center gap-2`,children:[(0,y.jsx)(s,{size:`2xs`,children:(0,y.jsx)(i,{color:e.color,children:e.initials})}),(0,y.jsx)(`span`,{className:`text-sm`,children:e.name})]},e.initials))]})})]})]}),(0,y.jsxs)(`div`,{className:`space-y-2`,children:[(0,y.jsx)(g,{children:`Hover card per child`}),(0,y.jsx)(o,{size:`md`,children:S.slice(0,3).map(e=>(0,y.jsxs)(d,{children:[(0,y.jsx)(u,{asChild:!0,children:(0,y.jsx)(s,{children:(0,y.jsx)(i,{color:e.color,children:e.initials})})}),(0,y.jsx)(l,{className:`w-48`,children:(0,y.jsx)(`span`,{className:`text-sm font-semibold`,children:e.name})})]},e.initials))})]})]})})},C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`{
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
}`,...C.parameters?.docs?.source}}},w.parameters={...w.parameters,docs:{...w.parameters?.docs,source:{originalSource:`{
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
}`,...w.parameters?.docs?.source}}},T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`{
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
}`,...T.parameters?.docs?.source}}},E=[`Variants`,`Sizes`,`WithHoverCard`]})))()}D();export{w as Sizes,C as Variants,T as WithHoverCard,E as __namedExportsOrder,b as default};