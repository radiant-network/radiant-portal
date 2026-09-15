import{n as e}from"./rolldown-runtime-C0FnF6B9.js";import{t}from"./jsx-runtime-BdxMnOeJ.js";import{a as n,i as r,n as i,r as a,t as o}from"./tabs-jJXarwO4.js";import{n as s,t as c}from"./createLucideIcon-BZk7HdX5.js";import{n as l,t as u}from"./user-kCV1wli6.js";import{i as d,n as f,r as p,t as m}from"./story-section-DVTm6cGm.js";var h,g;function _(){return(_=e((()=>{s(),h={name:`book-down`,size:24,node:[[`path`,{d:`M12 13V7`,key:`h0r20n`}],[`path`,{d:`M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20`,key:`k3hazp`}],[`path`,{d:`m9 10 3 3 3-3`,key:`zt5b4y`}]]},h.node,g=c(h)})))()}var v,y;function b(){return(b=e((()=>{s(),v={name:`key-round`,size:24,node:[[`path`,{d:`M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z`,key:`1s6t7t`}],[`circle`,{cx:`16.5`,cy:`7.5`,r:`.5`,fill:`currentColor`,key:`w0ekpg`}]]},v.node,y=c(v)})))()}var x,S,C,w,T;function E(){return(E=e((()=>{_(),b(),l(),n(),d(),x=t(),S={title:`Components/Tabs/Tabs`,component:o,args:{defaultValue:`account`}},C=[`default`,`primary`],w={render:e=>(0,x.jsx)(p,{direction:`row`,children:C.map(t=>(0,x.jsxs)(f,{title:t==="default"?`Default`:`Primary`,className:`flex-1`,children:[(0,x.jsxs)(`div`,{className:`flex flex-col gap-2 w-full`,children:[(0,x.jsx)(m,{children:`Basic`}),(0,x.jsxs)(o,{...e,variant:t,children:[(0,x.jsxs)(a,{children:[(0,x.jsx)(r,{value:`account`,children:`Account`}),(0,x.jsx)(r,{value:`password`,children:`Password`}),(0,x.jsx)(r,{value:`notifications`,children:`Notifications`})]}),(0,x.jsx)(i,{value:`account`,className:`bg-muted px-3 py-2 rounded-md`,children:`Account settings content.`}),(0,x.jsx)(i,{value:`password`,className:`bg-muted px-3 py-2 rounded-md`,children:`Password settings content.`}),(0,x.jsx)(i,{value:`notifications`,className:`bg-muted px-3 py-2 rounded-md`,children:`Notifications settings content.`})]})]}),(0,x.jsxs)(`div`,{className:`flex flex-col gap-2`,children:[(0,x.jsx)(m,{children:`With icons`}),(0,x.jsx)(o,{...e,variant:t,children:(0,x.jsxs)(a,{children:[(0,x.jsxs)(r,{value:`account`,children:[(0,x.jsx)(u,{}),`Account`]}),(0,x.jsxs)(r,{value:`password`,children:[(0,x.jsx)(y,{}),`Password`]}),(0,x.jsxs)(r,{value:`notifications`,children:[(0,x.jsx)(g,{}),`Notifications`]})]})})]}),(0,x.jsxs)(`div`,{className:`flex flex-col gap-2`,children:[(0,x.jsx)(m,{children:`Vertical orientation`}),(0,x.jsx)(o,{...e,variant:t,orientation:`vertical`,children:(0,x.jsxs)(a,{children:[(0,x.jsx)(r,{value:`account`,children:`Account`}),(0,x.jsx)(r,{value:`password`,children:`Password`}),(0,x.jsx)(r,{value:`notifications`,children:`Notifications`})]})})]}),(0,x.jsxs)(`div`,{className:`flex flex-col gap-2`,children:[(0,x.jsx)(m,{children:`Active and inactive disabled`}),(0,x.jsx)(o,{...e,variant:t,children:(0,x.jsxs)(a,{children:[(0,x.jsx)(r,{value:`account`,disabled:!0,children:`Account`}),(0,x.jsx)(r,{value:`password`,disabled:!0,children:`Password`}),(0,x.jsx)(r,{value:`notifications`,children:`Notifications`})]})})]})]},t))})},w.parameters={...w.parameters,docs:{...w.parameters?.docs,source:{originalSource:`{
  render: args => <StoryShowcase direction="row">
      {tabsVariants.map(variant => <StorySection key={variant} title={variant === 'default' ? 'Default' : 'Primary'} className="flex-1">
          <div className="flex flex-col gap-2 w-full">
            <StoryLabel>Basic</StoryLabel>
            <Tabs {...args} variant={variant}>
              <TabsList>
                <TabsTrigger value="account">Account</TabsTrigger>
                <TabsTrigger value="password">Password</TabsTrigger>
                <TabsTrigger value="notifications">Notifications</TabsTrigger>
              </TabsList>
              <TabsContent value="account" className="bg-muted px-3 py-2 rounded-md">
                Account settings content.
              </TabsContent>
              <TabsContent value="password" className="bg-muted px-3 py-2 rounded-md">
                Password settings content.
              </TabsContent>
              <TabsContent value="notifications" className="bg-muted px-3 py-2 rounded-md">
                Notifications settings content.
              </TabsContent>
            </Tabs>
          </div>

          <div className="flex flex-col gap-2">
            <StoryLabel>With icons</StoryLabel>
            <Tabs {...args} variant={variant}>
              <TabsList>
                <TabsTrigger value="account">
                  <User />
                  Account
                </TabsTrigger>
                <TabsTrigger value="password">
                  <KeyRound />
                  Password
                </TabsTrigger>
                <TabsTrigger value="notifications">
                  <BookDown />
                  Notifications
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div className="flex flex-col gap-2">
            <StoryLabel>Vertical orientation</StoryLabel>
            <Tabs {...args} variant={variant} orientation="vertical">
              <TabsList>
                <TabsTrigger value="account">Account</TabsTrigger>
                <TabsTrigger value="password">Password</TabsTrigger>
                <TabsTrigger value="notifications">Notifications</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div className="flex flex-col gap-2">
            <StoryLabel>Active and inactive disabled</StoryLabel>
            <Tabs {...args} variant={variant}>
              <TabsList>
                <TabsTrigger value="account" disabled>
                  Account
                </TabsTrigger>
                <TabsTrigger value="password" disabled>
                  Password
                </TabsTrigger>
                <TabsTrigger value="notifications">Notifications</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </StorySection>)}
    </StoryShowcase>
}`,...w.parameters?.docs?.source}}},T=[`Variants`]})))()}E();export{w as Variants,T as __namedExportsOrder,S as default};