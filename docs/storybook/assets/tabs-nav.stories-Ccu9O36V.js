import{r as b,j as e,c as d}from"./iframe-X1FdiBKE.js";import{U as g}from"./user-RwGclDvQ.js";import"./preload-helper-PPVm8Dsz.js";const f=({visible:a,children:t})=>{const n=b.useRef(a);return a&&!n.current&&(n.current=!0),n.current?e.jsx(e.Fragment,{children:t}):null};f.__docgenInfo={description:"",methods:[],displayName:"Lazy",props:{visible:{required:!0,tsType:{name:"boolean"},description:""}}};const x=b.createContext(null),h=()=>{const a=b.useContext(x);if(a===null)throw new Error("useTabsNavContext must be used within a TabsNavProvider");return a};function c({ref:a,value:t,onValueChange:n,...s}){return e.jsx(x.Provider,{value:{value:t,onValueChange:n},children:e.jsx("div",{ref:a,...s})})}function m({ref:a,className:t,contentClassName:n,children:s,...i}){return e.jsx("div",{ref:a,className:d("relative before:border-b before:border-border before:absolute before:left-0 before:right-0 before:bottom-0",t),...i,children:e.jsx("div",{className:d("flex overflow-x-auto",n),children:s})})}function r({ref:a,value:t,disabled:n=!1,className:s,children:i,...p}){const l=h(),v=l.value===t;return e.jsx("div",{ref:a,"data-active":v,"data-disabled":n,className:d("z-1 group pt-1.5 pb-1 hover:cursor-pointer",{"border-b-2 border-primary font-semibold":v,"opacity-50 hover:cursor-not-allowed":n},s),...p,onClick:C=>{n||(l.onValueChange?.(t),p.onClick?.(C))},children:e.jsx("div",{className:"flex items-center has-[svg]:px-4 px-3 py-2 [&_svg]:size-4 gap-2 text-sm text-muted-foreground rounded-sm hover:bg-accent group-data-[active=true]:text-accent-foreground hover:text-accent-foreground transition-all duration-300 group-data-[disabled=true]:pointer-events-none whitespace-nowrap",children:i})})}function o({ref:a,value:t,children:n,className:s,...i}){const l=h().value===t;return e.jsx(f,{visible:l,children:e.jsx("div",{ref:a,className:d({hidden:!l},s),...i,children:n})})}c.__docgenInfo={description:"",methods:[],displayName:"TabsNav",props:{ref:{required:!1,tsType:{name:"ReactRef",raw:"React.Ref<HTMLDivElement>",elements:[{name:"HTMLDivElement"}]},description:""},value:{required:!1,tsType:{name:"T"},description:""},onValueChange:{required:!1,tsType:{name:"signature",type:"function",raw:"(value: T) => void",signature:{arguments:[{type:{name:"T"},name:"value"}],return:{name:"void"}}},description:""}}};m.__docgenInfo={description:"",methods:[],displayName:"TabsList",props:{ref:{required:!1,tsType:{name:"ReactRef",raw:"React.Ref<HTMLDivElement>",elements:[{name:"HTMLDivElement"}]},description:""},contentClassName:{required:!1,tsType:{name:"string"},description:""}}};r.__docgenInfo={description:"",methods:[],displayName:"TabsListItem",props:{value:{required:!0,tsType:{name:"T"},description:""},disabled:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"false",computed:!1}},ref:{required:!1,tsType:{name:"ReactRef",raw:"React.Ref<HTMLDivElement>",elements:[{name:"HTMLDivElement"}]},description:""},children:{required:!0,tsType:{name:"ReactReactNode",raw:"React.ReactNode"},description:""}}};o.__docgenInfo={description:"",methods:[],displayName:"TabsContent",props:{value:{required:!0,tsType:{name:"T"},description:""},ref:{required:!1,tsType:{name:"ReactRef",raw:"React.Ref<HTMLDivElement>",elements:[{name:"HTMLDivElement"}]},description:""}}};const N={title:"Tabs/TabsNav",component:c,args:{}},T={args:{},render:()=>{const[a,t]=b.useState("Tab1");return e.jsxs(c,{value:a,onValueChange:t,children:[e.jsxs(m,{children:[e.jsxs(r,{value:"Tab1",children:[e.jsx(g,{})," Tab 1"]}),e.jsx(r,{value:"Tab2",children:"Tab 2"}),e.jsx(r,{value:"Tab3",children:"Tab 3"})]}),e.jsx(o,{value:"Tab1",children:e.jsx("p",{children:"Content for Tab 1"})}),e.jsx(o,{value:"Tab2",children:e.jsx("p",{children:"Content for Tab 2"})}),e.jsx(o,{value:"Tab3",children:e.jsx("p",{children:"Content for Tab 3"})})]})}},u={args:{},render:()=>{const[a,t]=b.useState("Tab1");return e.jsxs(c,{value:a,onValueChange:t,children:[e.jsxs(m,{children:[e.jsx(r,{value:"Tab1",children:"Tab 1"}),e.jsx(r,{value:"Tab2",disabled:!0,children:"Tab 2"}),e.jsx(r,{value:"Tab3",disabled:!0,children:"Tab 3"})]}),e.jsx(o,{value:"Tab1",children:e.jsx("p",{children:"Content for Tab 1"})}),e.jsx(o,{value:"Tab2",children:e.jsx("p",{children:"Content for Tab 2"})}),e.jsx(o,{value:"Tab3",children:e.jsx("p",{children:"Content for Tab 3"})})]})}};T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`{
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
}`,...T.parameters?.docs?.source}}};u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
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
}`,...u.parameters?.docs?.source}}};const R=["Default","Disabled"];export{T as Default,u as Disabled,R as __namedExportsOrder,N as default};
