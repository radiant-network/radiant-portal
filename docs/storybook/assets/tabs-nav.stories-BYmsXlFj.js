import{r as T,j as e,c}from"./iframe-DQ1t6oJB.js";import{U as V}from"./user-DkizaDAL.js";import"./preload-helper-Dp1pzeXC.js";const N=({visible:a,children:t})=>{const n=T.useRef(a);return a&&!n.current&&(n.current=!0),n.current?e.jsx(e.Fragment,{children:t}):null};N.__docgenInfo={description:"",methods:[],displayName:"Lazy",props:{visible:{required:!0,tsType:{name:"boolean"},description:""}}};const R=T.createContext(null),I=()=>{const a=T.useContext(R);if(a===null)throw new Error("useTabsNavContext must be used within a TabsNavProvider");return a};function m({ref:a,value:t,onValueChange:n,...s}){return e.jsx(R.Provider,{value:{value:t,onValueChange:n},children:e.jsx("div",{ref:a,...s})})}function p({ref:a,className:t,contentClassName:n,children:s,...l}){return e.jsx("div",{ref:a,className:c("relative before:border-b before:border-border before:absolute before:left-0 before:right-0 before:bottom-0",t),...l,children:e.jsx("div",{className:c("flex overflow-x-auto",n),children:s})})}function o({ref:a,value:t,disabled:n=!1,className:s,children:l,...b}){const r=I(),v=r.value===t;return e.jsx("div",{ref:a,"data-active":v,"data-disabled":n,className:c("z-1 group pt-1.5 pb-1 hover:cursor-pointer",{"border-b-2 border-primary font-semibold":v,"opacity-50 hover:cursor-not-allowed":n},s),...b,onClick:w=>{var f,x;n||((f=r.onValueChange)==null||f.call(r,t),(x=b.onClick)==null||x.call(b,w))},children:e.jsx("div",{className:"flex items-center has-[svg]:px-4 px-3 py-2 [&_svg]:size-4 gap-2 text-sm text-muted-foreground rounded-sm hover:bg-accent group-data-[active=true]:text-accent-foreground hover:text-accent-foreground transition-all duration-300 group-data-[disabled=true]:pointer-events-none whitespace-nowrap",children:l})})}function i({ref:a,value:t,children:n,className:s,...l}){const r=I().value===t;return e.jsx(N,{visible:r,children:e.jsx("div",{ref:a,className:c({hidden:!r},s),...l,children:n})})}m.__docgenInfo={description:"",methods:[],displayName:"TabsNav",props:{ref:{required:!1,tsType:{name:"ReactRef",raw:"React.Ref<HTMLDivElement>",elements:[{name:"HTMLDivElement"}]},description:""},value:{required:!1,tsType:{name:"T"},description:""},onValueChange:{required:!1,tsType:{name:"signature",type:"function",raw:"(value: T) => void",signature:{arguments:[{type:{name:"T"},name:"value"}],return:{name:"void"}}},description:""}}};p.__docgenInfo={description:"",methods:[],displayName:"TabsList",props:{ref:{required:!1,tsType:{name:"ReactRef",raw:"React.Ref<HTMLDivElement>",elements:[{name:"HTMLDivElement"}]},description:""},contentClassName:{required:!1,tsType:{name:"string"},description:""}}};o.__docgenInfo={description:"",methods:[],displayName:"TabsListItem",props:{value:{required:!0,tsType:{name:"T"},description:""},disabled:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"false",computed:!1}},ref:{required:!1,tsType:{name:"ReactRef",raw:"React.Ref<HTMLDivElement>",elements:[{name:"HTMLDivElement"}]},description:""},children:{required:!0,tsType:{name:"ReactReactNode",raw:"React.ReactNode"},description:""}}};i.__docgenInfo={description:"",methods:[],displayName:"TabsContent",props:{value:{required:!0,tsType:{name:"T"},description:""},ref:{required:!1,tsType:{name:"ReactRef",raw:"React.Ref<HTMLDivElement>",elements:[{name:"HTMLDivElement"}]},description:""}}};const E={title:"Tabs/TabsNav",component:m,args:{}},u={args:{},render:()=>{const[a,t]=T.useState("Tab1");return e.jsxs(m,{value:a,onValueChange:t,children:[e.jsxs(p,{children:[e.jsxs(o,{value:"Tab1",children:[e.jsx(V,{})," Tab 1"]}),e.jsx(o,{value:"Tab2",children:"Tab 2"}),e.jsx(o,{value:"Tab3",children:"Tab 3"})]}),e.jsx(i,{value:"Tab1",children:e.jsx("p",{children:"Content for Tab 1"})}),e.jsx(i,{value:"Tab2",children:e.jsx("p",{children:"Content for Tab 2"})}),e.jsx(i,{value:"Tab3",children:e.jsx("p",{children:"Content for Tab 3"})})]})}},d={args:{},render:()=>{const[a,t]=T.useState("Tab1");return e.jsxs(m,{value:a,onValueChange:t,children:[e.jsxs(p,{children:[e.jsx(o,{value:"Tab1",children:"Tab 1"}),e.jsx(o,{value:"Tab2",disabled:!0,children:"Tab 2"}),e.jsx(o,{value:"Tab3",disabled:!0,children:"Tab 3"})]}),e.jsx(i,{value:"Tab1",children:e.jsx("p",{children:"Content for Tab 1"})}),e.jsx(i,{value:"Tab2",children:e.jsx("p",{children:"Content for Tab 2"})}),e.jsx(i,{value:"Tab3",children:e.jsx("p",{children:"Content for Tab 3"})})]})}};var h,C,g;u.parameters={...u.parameters,docs:{...(h=u.parameters)==null?void 0:h.docs,source:{originalSource:`{
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
}`,...(g=(C=u.parameters)==null?void 0:C.docs)==null?void 0:g.source}}};var j,L,y;d.parameters={...d.parameters,docs:{...(j=d.parameters)==null?void 0:j.docs,source:{originalSource:`{
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
}`,...(y=(L=d.parameters)==null?void 0:L.docs)==null?void 0:y.source}}};const H=["Default","Disabled"];export{u as Default,d as Disabled,H as __namedExportsOrder,E as default};
