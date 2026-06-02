import{j as a}from"./iframe-BH3MSqWK.js";import{b as i,A as r,a as l,c as d,d as h}from"./avatar-DB1ZneiA.js";import{H as m,a as v,b as p}from"./hover-card-CiyUyn9y.js";import{a as x}from"./utils-BQbZHAUO.js";import{U as A}from"./user-CJ5Zlocr.js";import"./preload-helper-PPVm8Dsz.js";import"./index-BSwCZ4xH.js";const G={title:"Avatars/AvatarGroup",component:i,argTypes:{size:{options:x,control:{type:"select"}}}},b="https://github.com/shadcn.png",s=[{name:"Charles Nelson",initials:"CN",color:"violet"},{name:"Alex Bernard",initials:"AB",color:"emerald"},{name:"Julie Martin",initials:"JM",color:"blue"},{name:"Sarah Wilson",initials:"SW",color:"rose"},{name:"David Brown",initials:"DB",color:"amber"}],n={render:()=>a.jsxs("div",{className:"flex flex-col gap-8",children:[a.jsxs("div",{children:[a.jsx("div",{className:"mb-3 text-sm font-semibold",children:"Two avatars"}),a.jsx(i,{size:"md",children:s.slice(0,2).map(e=>a.jsx(r,{children:a.jsx(l,{color:e.color,children:e.initials})},e.initials))})]}),a.jsxs("div",{children:[a.jsx("div",{className:"mb-3 text-sm font-semibold",children:"With overflow"}),a.jsxs(i,{size:"md",children:[s.slice(0,3).map(e=>a.jsx(r,{children:a.jsx(l,{color:e.color,children:e.initials})},e.initials)),a.jsxs(d,{children:["+",s.length-3]})]})]}),a.jsxs("div",{children:[a.jsx("div",{className:"mb-3 text-sm font-semibold",children:"Mixed fallback types"}),a.jsxs(i,{size:"md",children:[a.jsxs(r,{children:[a.jsx(h,{src:b,alt:"@shadcn"}),a.jsx(l,{color:"violet",children:"CN"})]}),a.jsx(r,{children:a.jsx(l,{color:"emerald",children:"AB"})}),a.jsx(r,{children:a.jsx(l,{color:"blue",children:a.jsx(A,{className:"size-1/2"})})})]})]}),a.jsxs("div",{children:[a.jsx("div",{className:"mb-3 text-sm font-semibold",children:"Mixed colors"}),a.jsx(i,{size:"md",children:s.map(e=>a.jsx(r,{children:a.jsx(l,{color:e.color,children:e.initials})},e.initials))})]})]})},o={render:()=>a.jsx("div",{className:"flex flex-col gap-4",children:x.map(e=>a.jsxs("div",{className:"flex items-center gap-4",children:[a.jsx("span",{className:"w-10 text-sm font-semibold",children:e}),a.jsxs(i,{size:e,children:[s.slice(0,3).map(c=>a.jsx(r,{children:a.jsx(l,{color:c.color,children:c.initials})},c.initials)),a.jsxs(d,{children:["+",s.length-3]})]})]},e))})},t={render:()=>a.jsxs("div",{className:"flex items-center gap-10",children:[a.jsxs("div",{children:[a.jsx("div",{className:"pb-4 text-sm font-semibold",children:"Hover card on group level"}),a.jsxs(m,{children:[a.jsx(v,{asChild:!0,children:a.jsxs(i,{size:"md",children:[s.slice(0,3).map(e=>a.jsx(r,{children:a.jsx(l,{color:e.color,children:e.initials})},e.initials)),a.jsxs(d,{children:["+",s.length-3]})]})}),a.jsx(p,{className:"w-64",children:a.jsxs("div",{className:"flex flex-col gap-2",children:[a.jsxs("span",{className:"text-sm font-semibold",children:[s.length," members"]}),s.map(e=>a.jsxs("div",{className:"flex items-center gap-2",children:[a.jsx(r,{size:"2xs",children:a.jsx(l,{color:e.color,children:e.initials})}),a.jsx("span",{className:"text-sm",children:e.name})]},e.initials))]})})]})]}),a.jsxs("div",{children:[a.jsx("div",{className:"pb-4 text-sm font-semibold",children:"Hover card per child"}),a.jsx(i,{size:"md",children:s.slice(0,3).map(e=>a.jsxs(m,{children:[a.jsx(v,{asChild:!0,children:a.jsx(r,{children:a.jsx(l,{color:e.color,children:e.initials})})}),a.jsx(p,{className:"w-48",children:a.jsx("span",{className:"text-sm font-semibold",children:e.name})})]},e.initials))})]})]})};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  render: () => <div className="flex flex-col gap-8">
      <div>
        <div className="mb-3 text-sm font-semibold">Two avatars</div>
        <AvatarGroup size="md">
          {people.slice(0, 2).map(p => <Avatar key={p.initials}>
              <AvatarFallback color={p.color}>{p.initials}</AvatarFallback>
            </Avatar>)}
        </AvatarGroup>
      </div>

      <div>
        <div className="mb-3 text-sm font-semibold">With overflow</div>
        <AvatarGroup size="md">
          {people.slice(0, 3).map(p => <Avatar key={p.initials}>
              <AvatarFallback color={p.color}>{p.initials}</AvatarFallback>
            </Avatar>)}
          <AvatarGroupCount>+{people.length - 3}</AvatarGroupCount>
        </AvatarGroup>
      </div>

      <div>
        <div className="mb-3 text-sm font-semibold">Mixed fallback types</div>
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

      <div>
        <div className="mb-3 text-sm font-semibold">Mixed colors</div>
        <AvatarGroup size="md">
          {people.map(p => <Avatar key={p.initials}>
              <AvatarFallback color={p.color}>{p.initials}</AvatarFallback>
            </Avatar>)}
        </AvatarGroup>
      </div>
    </div>
}`,...n.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  render: () => <div className="flex flex-col gap-4">
      {avatarSizes.map(size => <div key={size} className="flex items-center gap-4">
          <span className="w-10 text-sm font-semibold">{size}</span>
          <AvatarGroup size={size}>
            {people.slice(0, 3).map(p => <Avatar key={p.initials}>
                <AvatarFallback color={p.color}>{p.initials}</AvatarFallback>
              </Avatar>)}
            <AvatarGroupCount>+{people.length - 3}</AvatarGroupCount>
          </AvatarGroup>
        </div>)}
    </div>
}`,...o.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  render: () => <div className="flex items-center gap-10">
      {/* Group-level */}
      <div>
        <div className="pb-4 text-sm font-semibold">Hover card on group level</div>
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
      <div>
        <div className="pb-4 text-sm font-semibold">Hover card per child</div>
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
}`,...t.parameters?.docs?.source}}};const z=["Variants","Sizes","WithHoverCard"];export{o as Sizes,n as Variants,t as WithHoverCard,z as __namedExportsOrder,G as default};
