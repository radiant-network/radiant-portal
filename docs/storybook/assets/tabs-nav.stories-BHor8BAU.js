import{j as a}from"./jsx-runtime-D_zvdyIk.js";import{T as r,a as v,b as e,c as s}from"./tabs-nav-DRtqIbyV.js";import{r as p}from"./index-CBYaBgW8.js";import{U as m}from"./user-3oWHM7_v.js";import"./utils-D-KgF5mV.js";import"./createLucideIcon-B119WVF5.js";const I={title:"Tabs/TabsNav",component:r,args:{}},n={args:{},render:()=>{const[b,T]=p.useState("Tab1");return a.jsxs(r,{value:b,onValueChange:T,children:[a.jsxs(v,{children:[a.jsxs(e,{value:"Tab1",children:[a.jsx(m,{})," Tab 1"]}),a.jsx(e,{value:"Tab2",children:"Tab 2"}),a.jsx(e,{value:"Tab3",children:"Tab 3"})]}),a.jsx(s,{value:"Tab1",children:a.jsx("p",{children:"Content for Tab 1"})}),a.jsx(s,{value:"Tab2",children:a.jsx("p",{children:"Content for Tab 2"})}),a.jsx(s,{value:"Tab3",children:a.jsx("p",{children:"Content for Tab 3"})})]})}},t={args:{},render:()=>{const[b,T]=p.useState("Tab1");return a.jsxs(r,{value:b,onValueChange:T,children:[a.jsxs(v,{children:[a.jsx(e,{value:"Tab1",children:"Tab 1"}),a.jsx(e,{value:"Tab2",disabled:!0,children:"Tab 2"}),a.jsx(e,{value:"Tab3",disabled:!0,children:"Tab 3"})]}),a.jsx(s,{value:"Tab1",children:a.jsx("p",{children:"Content for Tab 1"})}),a.jsx(s,{value:"Tab2",children:a.jsx("p",{children:"Content for Tab 2"})}),a.jsx(s,{value:"Tab3",children:a.jsx("p",{children:"Content for Tab 3"})})]})}};var o,l,u;n.parameters={...n.parameters,docs:{...(o=n.parameters)==null?void 0:o.docs,source:{originalSource:`{
  args: {},
  render: () => {
    const [value, setValue] = useState<Tabs>(Tabs.Tab1);
    return <TabsNav value={value} onValueChange={setValue}>
        <TabsList>
          <TabsListItem value={Tabs.Tab1}>
            <User /> Tab 1
          </TabsListItem>
          <TabsListItem value={Tabs.Tab2}>Tab 2</TabsListItem>
          <TabsListItem value={Tabs.Tab3}>Tab 3</TabsListItem>
        </TabsList>
        <TabsContent value={Tabs.Tab1}>
          <p>Content for Tab 1</p>
        </TabsContent>
        <TabsContent value={Tabs.Tab2}>
          <p>Content for Tab 2</p>
        </TabsContent>
        <TabsContent value={Tabs.Tab3}>
          <p>Content for Tab 3</p>
        </TabsContent>
      </TabsNav>;
  }
}`,...(u=(l=n.parameters)==null?void 0:l.docs)==null?void 0:u.source}}};var i,c,d;t.parameters={...t.parameters,docs:{...(i=t.parameters)==null?void 0:i.docs,source:{originalSource:`{
  args: {},
  render: () => {
    const [value, setValue] = useState<Tabs>(Tabs.Tab1);
    return <TabsNav value={value} onValueChange={setValue}>
        <TabsList>
          <TabsListItem value={Tabs.Tab1}>Tab 1</TabsListItem>
          <TabsListItem value={Tabs.Tab2} disabled>
            Tab 2
          </TabsListItem>
          <TabsListItem value={Tabs.Tab3} disabled>
            Tab 3
          </TabsListItem>
        </TabsList>
        <TabsContent value={Tabs.Tab1}>
          <p>Content for Tab 1</p>
        </TabsContent>
        <TabsContent value={Tabs.Tab2}>
          <p>Content for Tab 2</p>
        </TabsContent>
        <TabsContent value={Tabs.Tab3}>
          <p>Content for Tab 3</p>
        </TabsContent>
      </TabsNav>;
  }
}`,...(d=(c=t.parameters)==null?void 0:c.docs)==null?void 0:d.source}}};const g=["Default","Disabled"];export{n as Default,t as Disabled,g as __namedExportsOrder,I as default};
