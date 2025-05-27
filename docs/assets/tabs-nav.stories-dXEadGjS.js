import{j as e}from"./jsx-runtime-Cf8x2fCZ.js";import{c as m}from"./utils-CytzSlOG.js";import{r as b}from"./index-t5q4d8OJ.js";import"./index-yBjzXJbu.js";const N=b.createContext(null),I=()=>{const a=b.useContext(N);if(a===null)throw new Error("useTabsNavContext must be used within a TabsNavProvider");return a},R=({visible:a,children:t})=>{const n=b.useRef(a);return a&&!n.current&&(n.current=!0),n.current?e.jsx(e.Fragment,{children:t}):null};R.__docgenInfo={description:"",methods:[],displayName:"Lazy",props:{visible:{required:!0,tsType:{name:"boolean"},description:""}}};function d({ref:a,value:t,onValueChange:n,...s}){return e.jsx(N.Provider,{value:{value:t,onValueChange:n},children:e.jsx("div",{ref:a,...s})})}function v({ref:a,className:t,children:n,...s}){return e.jsx("div",{ref:a,className:m("relative before:border-b before:border-border before:absolute before:left-0 before:right-0 before:bottom-0",t),...s,children:e.jsx("div",{className:"flex overflow-x-auto",children:n})})}function o({ref:a,value:t,disabled:n=!1,className:s,children:c,...l}){const r=I(),p=r.value===t;return e.jsx("div",{ref:a,"data-active":p,"data-disabled":n,className:m("z-[1] group pt-1.5 pb-1 hover:cursor-pointer",{"border-b-2 border-primary":p,"opacity-50 hover:cursor-not-allowed":n},s),...l,onClick:V=>{var f,x;n||((f=r.onValueChange)==null||f.call(r,t),(x=l.onClick)==null||x.call(l,V))},children:e.jsx("div",{className:"px-3 py-2 text-sm text-muted-foreground rounded hover:bg-accent group-data-[active=true]:text-accent-foreground hover:text-accent-foreground transition-all duration-300 group-data-[disabled=true]:pointer-events-none",children:c})})}function i({ref:a,value:t,children:n,className:s,...c}){const r=I().value===t;return e.jsx(R,{visible:r,children:e.jsx("div",{ref:a,className:m("py-3",{hidden:!r},s),...c,children:n})})}d.__docgenInfo={description:"",methods:[],displayName:"TabsNav",props:{ref:{required:!1,tsType:{name:"ReactRef",raw:"React.Ref<HTMLDivElement>",elements:[{name:"HTMLDivElement"}]},description:""},value:{required:!1,tsType:{name:"T"},description:""},onValueChange:{required:!1,tsType:{name:"signature",type:"function",raw:"(value: T) => void",signature:{arguments:[{type:{name:"T"},name:"value"}],return:{name:"void"}}},description:""}}};v.__docgenInfo={description:"",methods:[],displayName:"TabsList",props:{ref:{required:!1,tsType:{name:"ReactRef",raw:"React.Ref<HTMLDivElement>",elements:[{name:"HTMLDivElement"}]},description:""}}};o.__docgenInfo={description:"",methods:[],displayName:"TabsListItem",props:{value:{required:!0,tsType:{name:"T"},description:""},disabled:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"false",computed:!1}},ref:{required:!1,tsType:{name:"ReactRef",raw:"React.Ref<HTMLDivElement>",elements:[{name:"HTMLDivElement"}]},description:""}}};i.__docgenInfo={description:"",methods:[],displayName:"TabsContent",props:{value:{required:!0,tsType:{name:"T"},description:""},ref:{required:!1,tsType:{name:"ReactRef",raw:"React.Ref<HTMLDivElement>",elements:[{name:"HTMLDivElement"}]},description:""}}};const w={title:"Navigation/TabsNav",component:d,args:{}},T={args:{},render:()=>{const[a,t]=b.useState("Tab1");return e.jsxs(d,{value:a,onValueChange:t,children:[e.jsxs(v,{children:[e.jsx(o,{value:"Tab1",children:"Tab 1"}),e.jsx(o,{value:"Tab2",children:"Tab 2"}),e.jsx(o,{value:"Tab3",children:"Tab 3"})]}),e.jsx(i,{value:"Tab1",children:e.jsx("p",{children:"Content for Tab 1"})}),e.jsx(i,{value:"Tab2",children:e.jsx("p",{children:"Content for Tab 2"})}),e.jsx(i,{value:"Tab3",children:e.jsx("p",{children:"Content for Tab 3"})})]})}},u={args:{},render:()=>{const[a,t]=b.useState("Tab1");return e.jsxs(d,{value:a,onValueChange:t,children:[e.jsxs(v,{children:[e.jsx(o,{value:"Tab1",children:"Tab 1"}),e.jsx(o,{value:"Tab2",disabled:!0,children:"Tab 2"}),e.jsx(o,{value:"Tab3",disabled:!0,children:"Tab 3"})]}),e.jsx(i,{value:"Tab1",children:e.jsx("p",{children:"Content for Tab 1"})}),e.jsx(i,{value:"Tab2",children:e.jsx("p",{children:"Content for Tab 2"})}),e.jsx(i,{value:"Tab3",children:e.jsx("p",{children:"Content for Tab 3"})})]})}};var h,C,j;T.parameters={...T.parameters,docs:{...(h=T.parameters)==null?void 0:h.docs,source:{originalSource:`{
  args: {},
  render: () => {
    const [value, setValue] = useState<Tabs>(Tabs.Tab1);
    return <TabsNav value={value} onValueChange={setValue}>
        <TabsList>
          <TabsListItem value={Tabs.Tab1}>Tab 1</TabsListItem>
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
}`,...(j=(C=T.parameters)==null?void 0:C.docs)==null?void 0:j.source}}};var g,L,y;u.parameters={...u.parameters,docs:{...(g=u.parameters)==null?void 0:g.docs,source:{originalSource:`{
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
}`,...(y=(L=u.parameters)==null?void 0:L.docs)==null?void 0:y.source}}};const H=["Default","Disabled"];export{T as Default,u as Disabled,H as __namedExportsOrder,w as default};
