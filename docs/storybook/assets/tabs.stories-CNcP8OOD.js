import{d as l,j as a}from"./iframe-B5m_r5t1.js";import{T as t,a as r,b as s,c}from"./tabs-BL8Y6nO2.js";import{S as d,a as u,b as o}from"./story-section-pH31KqSy.js";import{U as b}from"./user-W2KBBQtC.js";import"./preload-helper-PPVm8Dsz.js";import"./index-BQW_qE22.js";import"./index-D-iXBiuO.js";const T=[["path",{d:"M12 13V7",key:"h0r20n"}],["path",{d:"M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20",key:"k3hazp"}],["path",{d:"m9 10 3 3 3-3",key:"zt5b4y"}]],g=l("book-down",T);const x=[["path",{d:"M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z",key:"1s6t7t"}],["circle",{cx:"16.5",cy:"7.5",r:".5",fill:"currentColor",key:"w0ekpg"}]],v=l("key-round",x),S={title:"Components/Tabs/Tabs",component:t,args:{defaultValue:"account"}},p=["default","primary"],n={render:i=>a.jsx(d,{direction:"row",children:p.map(e=>a.jsxs(u,{title:e==="default"?"Default":"Primary",className:"flex-1",children:[a.jsxs("div",{className:"flex flex-col gap-2 w-full",children:[a.jsx(o,{children:"Basic"}),a.jsxs(t,{...i,variant:e,children:[a.jsxs(r,{children:[a.jsx(s,{value:"account",children:"Account"}),a.jsx(s,{value:"password",children:"Password"}),a.jsx(s,{value:"notifications",children:"Notifications"})]}),a.jsx(c,{value:"account",className:"bg-muted px-3 py-2 rounded-md",children:"Account settings content."}),a.jsx(c,{value:"password",className:"bg-muted px-3 py-2 rounded-md",children:"Password settings content."}),a.jsx(c,{value:"notifications",className:"bg-muted px-3 py-2 rounded-md",children:"Notifications settings content."})]})]}),a.jsxs("div",{className:"flex flex-col gap-2",children:[a.jsx(o,{children:"With icons"}),a.jsx(t,{...i,variant:e,children:a.jsxs(r,{children:[a.jsxs(s,{value:"account",children:[a.jsx(b,{}),"Account"]}),a.jsxs(s,{value:"password",children:[a.jsx(v,{}),"Password"]}),a.jsxs(s,{value:"notifications",children:[a.jsx(g,{}),"Notifications"]})]})})]}),a.jsxs("div",{className:"flex flex-col gap-2",children:[a.jsx(o,{children:"Vertical orientation"}),a.jsx(t,{...i,variant:e,orientation:"vertical",children:a.jsxs(r,{children:[a.jsx(s,{value:"account",children:"Account"}),a.jsx(s,{value:"password",children:"Password"}),a.jsx(s,{value:"notifications",children:"Notifications"})]})})]}),a.jsxs("div",{className:"flex flex-col gap-2",children:[a.jsx(o,{children:"Active and inactive disabled"}),a.jsx(t,{...i,variant:e,children:a.jsxs(r,{children:[a.jsx(s,{value:"account",disabled:!0,children:"Account"}),a.jsx(s,{value:"password",disabled:!0,children:"Password"}),a.jsx(s,{value:"notifications",children:"Notifications"})]})})]})]},e))})};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
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
}`,...n.parameters?.docs?.source}}};const L=["Variants"];export{n as Variants,L as __namedExportsOrder,S as default};
