import{g as u,j as s}from"./iframe-UzZZM96I.js";import{T as e,a as i,b as a,c as o}from"./tabs-DGsf9v3M.js";import{U as g}from"./user-Rm6c68SJ.js";import"./preload-helper-Dp1pzeXC.js";import"./index-BhlzdYk0.js";import"./index-CvKgbFy1.js";/**
 * @license lucide-react v0.482.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const T=[["path",{d:"M12 13V7",key:"h0r20n"}],["path",{d:"M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20",key:"k3hazp"}],["path",{d:"m9 10 3 3 3-3",key:"zt5b4y"}]],x=u("BookDown",T);/**
 * @license lucide-react v0.482.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const b=[["path",{d:"M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z",key:"1s6t7t"}],["circle",{cx:"16.5",cy:"7.5",r:".5",fill:"currentColor",key:"w0ekpg"}]],p=u("KeyRound",b),y={title:"Tabs/Tabs",component:e,args:{defaultValue:"account"}},m=["default","primary"],r={render:t=>s.jsx("div",{className:"flex flex-row gap-12",children:m.map(n=>s.jsxs("div",{className:"flex flex-1 flex-col gap-4",children:[s.jsx("span",{className:"text-muted-foreground text-sm uppercase",children:n}),s.jsxs(e,{...t,variant:n,children:[s.jsxs(i,{children:[s.jsx(a,{value:"account",children:"Account"}),s.jsx(a,{value:"password",children:"Password"}),s.jsx(a,{value:"notifications",children:"Notifications"})]}),s.jsx(o,{value:"account",className:"bg-muted px-3 py-2 rounded-md",children:"Account settings content."}),s.jsx(o,{value:"password",className:"bg-muted px-3 py-2 rounded-md",children:"Password settings content."}),s.jsx(o,{value:"notifications",className:"bg-muted px-3 py-2 rounded-md",children:"Notifications settings content."})]}),s.jsx("span",{className:"text-muted-foreground text-xs",children:"Tabs with icons"}),s.jsx(e,{...t,variant:n,children:s.jsxs(i,{children:[s.jsxs(a,{value:"account",children:[s.jsx(g,{}),"Account"]}),s.jsxs(a,{value:"password",children:[s.jsx(p,{}),"Password"]}),s.jsxs(a,{value:"notifications",children:[s.jsx(x,{}),"Notifications"]})]})}),s.jsx("span",{className:"text-muted-foreground text-xs",children:"Orientation vertical"}),s.jsx(e,{...t,variant:n,orientation:"vertical",children:s.jsxs(i,{children:[s.jsx(a,{value:"account",children:"Account"}),s.jsx(a,{value:"password",children:"Password"}),s.jsx(a,{value:"notifications",children:"Notifications"})]})}),s.jsx("span",{className:"text-muted-foreground text-xs",children:"Active and inactive disabled"}),s.jsx(e,{...t,variant:n,children:s.jsxs(i,{children:[s.jsx(a,{value:"account",disabled:!0,children:"Account"}),s.jsx(a,{value:"password",disabled:!0,children:"Password"}),s.jsx(a,{value:"notifications",children:"Notifications"})]})})]},n))})};var c,d,l;r.parameters={...r.parameters,docs:{...(c=r.parameters)==null?void 0:c.docs,source:{originalSource:`{
  render: args => <div className="flex flex-row gap-12">
      {tabsVariants.map(variant => <div key={variant} className="flex flex-1 flex-col gap-4">
          <span className="text-muted-foreground text-sm uppercase">{variant}</span>
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
          <span className="text-muted-foreground text-xs">Tabs with icons</span>
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
          <span className="text-muted-foreground text-xs">Orientation vertical</span>
          <Tabs {...args} variant={variant} orientation="vertical">
            <TabsList>
              <TabsTrigger value="account">Account</TabsTrigger>
              <TabsTrigger value="password">Password</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
            </TabsList>
          </Tabs>
          <span className="text-muted-foreground text-xs">Active and inactive disabled</span>
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
        </div>)}
    </div>
}`,...(l=(d=r.parameters)==null?void 0:d.docs)==null?void 0:l.source}}};const A=["Variants"];export{r as Variants,A as __namedExportsOrder,y as default};
