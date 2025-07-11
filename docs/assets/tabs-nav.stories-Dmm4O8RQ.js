import{j as e}from"./jsx-runtime-D_zvdyIk.js";import{c as m}from"./utils-D-KgF5mV.js";import{r as T}from"./index-DQLiH3RP.js";import{U as q}from"./user-Dv_C2EEw.js";import"./createLucideIcon-BMP5cxO1.js";const N=T.createContext(null),R=()=>{const a=T.useContext(N);if(a===null)throw new Error("useTabsNavContext must be used within a TabsNavProvider");return a},I=({visible:a,children:t})=>{const n=T.useRef(a);return a&&!n.current&&(n.current=!0),n.current?e.jsx(e.Fragment,{children:t}):null};I.__docgenInfo={description:"",methods:[],displayName:"Lazy",props:{visible:{required:!0,tsType:{name:"boolean"},description:""}}};function p({ref:a,value:t,onValueChange:n,...s}){return e.jsx(N.Provider,{value:{value:t,onValueChange:n},children:e.jsx("div",{ref:a,...s})})}function v({ref:a,className:t,contentClassName:n,children:s,...l}){return e.jsx("div",{ref:a,className:m("relative before:border-b before:border-border before:absolute before:left-0 before:right-0 before:bottom-0",t),...l,children:e.jsx("div",{className:m("flex overflow-x-auto",n),children:s})})}function r({ref:a,value:t,disabled:n=!1,className:s,children:l,...i}){const b=R(),u=b.value===t;return e.jsx("div",{ref:a,"data-active":u,"data-disabled":n,className:m("z-1 group pt-1.5 pb-1 hover:cursor-pointer",{"border-b-2 border-primary font-semibold":u,"opacity-50 hover:cursor-not-allowed":n},s),...i,onClick:V=>{var f,x;n||((f=b.onValueChange)==null||f.call(b,t),(x=i.onClick)==null||x.call(i,V))},children:e.jsx("div",{className:"flex items-center has-[svg]:px-4 px-3 py-2 [&_svg]:size-4 gap-2 text-sm text-muted-foreground rounded-sm hover:bg-accent group-data-[active=true]:text-accent-foreground hover:text-accent-foreground transition-all duration-300 group-data-[disabled=true]:pointer-events-none",children:l})})}function o({ref:a,value:t,children:n,className:s,noMargin:l=!1,...i}){const u=R().value===t;return e.jsx(I,{visible:u,children:e.jsx("div",{ref:a,className:m({"py-3":!l,hidden:!u},s),...i,children:n})})}p.__docgenInfo={description:"",methods:[],displayName:"TabsNav",props:{ref:{required:!1,tsType:{name:"ReactRef",raw:"React.Ref<HTMLDivElement>",elements:[{name:"HTMLDivElement"}]},description:""},value:{required:!1,tsType:{name:"T"},description:""},onValueChange:{required:!1,tsType:{name:"signature",type:"function",raw:"(value: T) => void",signature:{arguments:[{type:{name:"T"},name:"value"}],return:{name:"void"}}},description:""}}};v.__docgenInfo={description:"",methods:[],displayName:"TabsList",props:{ref:{required:!1,tsType:{name:"ReactRef",raw:"React.Ref<HTMLDivElement>",elements:[{name:"HTMLDivElement"}]},description:""},contentClassName:{required:!1,tsType:{name:"string"},description:""}}};r.__docgenInfo={description:"",methods:[],displayName:"TabsListItem",props:{value:{required:!0,tsType:{name:"T"},description:""},disabled:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"false",computed:!1}},ref:{required:!1,tsType:{name:"ReactRef",raw:"React.Ref<HTMLDivElement>",elements:[{name:"HTMLDivElement"}]},description:""},children:{required:!0,tsType:{name:"ReactReactNode",raw:"React.ReactNode"},description:""}}};o.__docgenInfo={description:"",methods:[],displayName:"TabsContent",props:{value:{required:!0,tsType:{name:"T"},description:""},noMargin:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"false",computed:!1}},ref:{required:!1,tsType:{name:"ReactRef",raw:"React.Ref<HTMLDivElement>",elements:[{name:"HTMLDivElement"}]},description:""}}};const H={title:"Navigation/TabsNav",component:p,args:{}},d={args:{},render:()=>{const[a,t]=T.useState("Tab1");return e.jsxs(p,{value:a,onValueChange:t,children:[e.jsxs(v,{children:[e.jsxs(r,{value:"Tab1",children:[e.jsx(q,{})," Tab 1"]}),e.jsx(r,{value:"Tab2",children:"Tab 2"}),e.jsx(r,{value:"Tab3",children:"Tab 3"})]}),e.jsx(o,{value:"Tab1",children:e.jsx("p",{children:"Content for Tab 1"})}),e.jsx(o,{value:"Tab2",children:e.jsx("p",{children:"Content for Tab 2"})}),e.jsx(o,{value:"Tab3",children:e.jsx("p",{children:"Content for Tab 3"})})]})}},c={args:{},render:()=>{const[a,t]=T.useState("Tab1");return e.jsxs(p,{value:a,onValueChange:t,children:[e.jsxs(v,{children:[e.jsx(r,{value:"Tab1",children:"Tab 1"}),e.jsx(r,{value:"Tab2",disabled:!0,children:"Tab 2"}),e.jsx(r,{value:"Tab3",disabled:!0,children:"Tab 3"})]}),e.jsx(o,{value:"Tab1",children:e.jsx("p",{children:"Content for Tab 1"})}),e.jsx(o,{value:"Tab2",children:e.jsx("p",{children:"Content for Tab 2"})}),e.jsx(o,{value:"Tab3",children:e.jsx("p",{children:"Content for Tab 3"})})]})}};var h,C,g;d.parameters={...d.parameters,docs:{...(h=d.parameters)==null?void 0:h.docs,source:{originalSource:`{
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
}`,...(g=(C=d.parameters)==null?void 0:C.docs)==null?void 0:g.source}}};var j,L,y;c.parameters={...c.parameters,docs:{...(j=c.parameters)==null?void 0:j.docs,source:{originalSource:`{
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
}`,...(y=(L=c.parameters)==null?void 0:L.docs)==null?void 0:y.source}}};const S=["Default","Disabled"];export{d as Default,c as Disabled,S as __namedExportsOrder,H as default};
