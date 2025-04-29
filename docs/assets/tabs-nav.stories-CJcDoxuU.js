import{j as e}from"./jsx-runtime-Cf8x2fCZ.js";import{c as m}from"./utils-CytzSlOG.js";import{r as T}from"./index-tvICUrOf.js";import"./index-yBjzXJbu.js";const N=T.createContext(null),I=()=>{const a=T.useContext(N);if(a===null)throw new Error("useTabsNavContext must be used within a TabsNavProvider");return a},R=({visible:a,children:n})=>{const t=T.useRef(a);return a&&!t.current&&(t.current=!0),t.current?e.jsx(e.Fragment,{children:n}):null};R.__docgenInfo={description:"",methods:[],displayName:"Lazy",props:{visible:{required:!0,tsType:{name:"boolean"},description:""}}};function c({ref:a,value:n,onValueChange:t,className:b,...i}){return e.jsx(N.Provider,{value:{value:n,onValueChange:t},children:e.jsx("div",{ref:a,...i})})}function p({ref:a,className:n,...t}){return e.jsx("div",{ref:a,className:m("flex border-b overflow-x-auto",n),...t})}function r({ref:a,value:n,disabled:t=!1,className:b,children:i,...l}){const s=I(),v=s.value===n;return e.jsx("div",{ref:a,"data-active":v,"data-disabled":t,className:m("group pt-1.5 pb-1 mb-[-1px] hover:cursor-pointer",{"border-b-2 border-primary":v,"opacity-50 hover:cursor-not-allowed":t},b),...l,onClick:V=>{var f,x;t||((f=s.onValueChange)==null||f.call(s,n),(x=l.onClick)==null||x.call(l,V))},children:e.jsx("div",{className:"px-3 py-2 text-sm text-muted-foreground rounded hover:bg-accent group-data-[active=true]:text-accent-foreground hover:text-accent-foreground transition-all duration-300 group-data-[disabled=true]:pointer-events-none",children:i})})}function o({ref:a,value:n,children:t,className:b,...i}){const s=I().value===n;return e.jsx(R,{visible:s,children:e.jsx("div",{ref:a,className:m("py-3",{flex:s,hidden:!s},b),...i,children:t})})}c.__docgenInfo={description:"",methods:[],displayName:"TabsNav",props:{ref:{required:!1,tsType:{name:"ReactRef",raw:"React.Ref<HTMLDivElement>",elements:[{name:"HTMLDivElement"}]},description:""},value:{required:!1,tsType:{name:"T"},description:""},onValueChange:{required:!1,tsType:{name:"signature",type:"function",raw:"(value: T) => void",signature:{arguments:[{type:{name:"T"},name:"value"}],return:{name:"void"}}},description:""}}};p.__docgenInfo={description:"",methods:[],displayName:"TabsList",props:{ref:{required:!1,tsType:{name:"ReactRef",raw:"React.Ref<HTMLDivElement>",elements:[{name:"HTMLDivElement"}]},description:""}}};r.__docgenInfo={description:"",methods:[],displayName:"TabsListItem",props:{value:{required:!0,tsType:{name:"T"},description:""},disabled:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"false",computed:!1}},ref:{required:!1,tsType:{name:"ReactRef",raw:"React.Ref<HTMLDivElement>",elements:[{name:"HTMLDivElement"}]},description:""}}};o.__docgenInfo={description:"",methods:[],displayName:"TabsContent",props:{value:{required:!0,tsType:{name:"T"},description:""},ref:{required:!1,tsType:{name:"ReactRef",raw:"React.Ref<HTMLDivElement>",elements:[{name:"HTMLDivElement"}]},description:""}}};const w={title:"Navigation/TabsNav",component:c,args:{}},u={args:{},render:()=>{const[a,n]=T.useState("Tab1");return e.jsxs(c,{value:a,onValueChange:n,children:[e.jsxs(p,{children:[e.jsx(r,{value:"Tab1",children:"Tab 1"}),e.jsx(r,{value:"Tab2",children:"Tab 2"}),e.jsx(r,{value:"Tab3",children:"Tab 3"})]}),e.jsx(o,{value:"Tab1",children:e.jsx("p",{children:"Content for Tab 1"})}),e.jsx(o,{value:"Tab2",children:e.jsx("p",{children:"Content for Tab 2"})}),e.jsx(o,{value:"Tab3",children:e.jsx("p",{children:"Content for Tab 3"})})]})}},d={args:{},render:()=>{const[a,n]=T.useState("Tab1");return e.jsxs(c,{value:a,onValueChange:n,children:[e.jsxs(p,{children:[e.jsx(r,{value:"Tab1",children:"Tab 1"}),e.jsx(r,{value:"Tab2",disabled:!0,children:"Tab 2"}),e.jsx(r,{value:"Tab3",disabled:!0,children:"Tab 3"})]}),e.jsx(o,{value:"Tab1",children:e.jsx("p",{children:"Content for Tab 1"})}),e.jsx(o,{value:"Tab2",children:e.jsx("p",{children:"Content for Tab 2"})}),e.jsx(o,{value:"Tab3",children:e.jsx("p",{children:"Content for Tab 3"})})]})}};var h,C,j;u.parameters={...u.parameters,docs:{...(h=u.parameters)==null?void 0:h.docs,source:{originalSource:`{
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
}`,...(j=(C=u.parameters)==null?void 0:C.docs)==null?void 0:j.source}}};var g,L,y;d.parameters={...d.parameters,docs:{...(g=d.parameters)==null?void 0:g.docs,source:{originalSource:`{
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
}`,...(y=(L=d.parameters)==null?void 0:L.docs)==null?void 0:y.source}}};const H=["Default","Disabled"];export{u as Default,d as Disabled,H as __namedExportsOrder,w as default};
