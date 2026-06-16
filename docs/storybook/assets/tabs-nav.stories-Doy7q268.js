import{r as b,j as e,c}from"./iframe-D5nbMH0Z.js";import{a as f}from"./story-section-DfWRQdTn.js";import{U as g}from"./user-CNjk9muP.js";import"./preload-helper-PPVm8Dsz.js";const x=({visible:a,children:t})=>{const n=b.useRef(a);return a&&!n.current&&(n.current=!0),n.current?e.jsx(e.Fragment,{children:t}):null};x.__docgenInfo={description:"",methods:[],displayName:"Lazy",props:{visible:{required:!0,tsType:{name:"boolean"},description:""}}};const h=b.createContext(null),C=()=>{const a=b.useContext(h);if(a===null)throw new Error("useTabsNavContext must be used within a TabsNavProvider");return a};function T({ref:a,value:t,onValueChange:n,...s}){return e.jsx(h.Provider,{value:{value:t,onValueChange:n},children:e.jsx("div",{ref:a,...s})})}function p({ref:a,className:t,contentClassName:n,children:s,...i}){return e.jsx("div",{ref:a,className:c("relative before:border-b before:border-border before:absolute before:left-0 before:right-0 before:bottom-0",t),...i,children:e.jsx("div",{className:c("flex overflow-x-auto",n),children:s})})}function r({ref:a,value:t,disabled:n=!1,className:s,children:i,...m}){const l=C(),v=l.value===t;return e.jsx("div",{ref:a,"data-active":v,"data-disabled":n,className:c("z-1 group pt-1.5 pb-1 hover:cursor-pointer",{"border-b-2 border-primary font-semibold":v,"opacity-50 hover:cursor-not-allowed":n},s),...m,onClick:j=>{n||(l.onValueChange?.(t),m.onClick?.(j))},children:e.jsx("div",{className:"flex items-center has-[svg]:px-4 px-3 py-2 [&_svg]:size-4 gap-2 text-sm text-muted-foreground rounded-sm hover:bg-accent group-data-[active=true]:text-accent-foreground hover:text-accent-foreground transition-all duration-300 group-data-[disabled=true]:pointer-events-none whitespace-nowrap",children:i})})}function o({ref:a,value:t,children:n,className:s,...i}){const l=C().value===t;return e.jsx(x,{visible:l,children:e.jsx("div",{ref:a,className:c({hidden:!l},s),...i,children:n})})}T.__docgenInfo={description:"",methods:[],displayName:"TabsNav",props:{ref:{required:!1,tsType:{name:"ReactRef",raw:"React.Ref<HTMLDivElement>",elements:[{name:"HTMLDivElement"}]},description:""},value:{required:!1,tsType:{name:"T"},description:""},onValueChange:{required:!1,tsType:{name:"signature",type:"function",raw:"(value: T) => void",signature:{arguments:[{type:{name:"T"},name:"value"}],return:{name:"void"}}},description:""}}};p.__docgenInfo={description:"",methods:[],displayName:"TabsList",props:{ref:{required:!1,tsType:{name:"ReactRef",raw:"React.Ref<HTMLDivElement>",elements:[{name:"HTMLDivElement"}]},description:""},contentClassName:{required:!1,tsType:{name:"string"},description:""}}};r.__docgenInfo={description:"",methods:[],displayName:"TabsListItem",props:{value:{required:!0,tsType:{name:"T"},description:""},disabled:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"false",computed:!1}},ref:{required:!1,tsType:{name:"ReactRef",raw:"React.Ref<HTMLDivElement>",elements:[{name:"HTMLDivElement"}]},description:""},children:{required:!0,tsType:{name:"ReactReactNode",raw:"React.ReactNode"},description:""}}};o.__docgenInfo={description:"",methods:[],displayName:"TabsContent",props:{value:{required:!0,tsType:{name:"T"},description:""},ref:{required:!1,tsType:{name:"ReactRef",raw:"React.Ref<HTMLDivElement>",elements:[{name:"HTMLDivElement"}]},description:""}}};const I={title:"Components/Tabs/Tabs Nav",component:T,args:{}},d={args:{},render:()=>{const[a,t]=b.useState("Tab1");return e.jsx(f,{title:"Default",children:e.jsx("div",{className:"w-full",children:e.jsxs(T,{value:a,onValueChange:t,children:[e.jsxs(p,{children:[e.jsxs(r,{value:"Tab1",children:[e.jsx(g,{})," Tab 1"]}),e.jsx(r,{value:"Tab2",children:"Tab 2"}),e.jsx(r,{value:"Tab3",children:"Tab 3"})]}),e.jsx(o,{value:"Tab1",children:e.jsx("p",{children:"Content for Tab 1"})}),e.jsx(o,{value:"Tab2",children:e.jsx("p",{children:"Content for Tab 2"})}),e.jsx(o,{value:"Tab3",children:e.jsx("p",{children:"Content for Tab 3"})})]})})})}},u={args:{},render:()=>{const[a,t]=b.useState("Tab1");return e.jsx(f,{title:"Disabled",children:e.jsx("div",{className:"w-full",children:e.jsxs(T,{value:a,onValueChange:t,children:[e.jsxs(p,{children:[e.jsx(r,{value:"Tab1",children:"Tab 1"}),e.jsx(r,{value:"Tab2",disabled:!0,children:"Tab 2"}),e.jsx(r,{value:"Tab3",disabled:!0,children:"Tab 3"})]}),e.jsx(o,{value:"Tab1",children:e.jsx("p",{children:"Content for Tab 1"})}),e.jsx(o,{value:"Tab2",children:e.jsx("p",{children:"Content for Tab 2"})}),e.jsx(o,{value:"Tab3",children:e.jsx("p",{children:"Content for Tab 3"})})]})})})}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  args: {},
  render: () => {
    const [value, setValue] = useState<Tabs>(Tabs.Tab1);
    return <StorySection title="Default">
        <div className="w-full">
          <TabsNav value={value} onValueChange={setValue}>
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
          </TabsNav>
        </div>
      </StorySection>;
  }
}`,...d.parameters?.docs?.source}}};u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  args: {},
  render: () => {
    const [value, setValue] = useState<Tabs>(Tabs.Tab1);
    return <StorySection title="Disabled">
        <div className="w-full">
          <TabsNav value={value} onValueChange={setValue}>
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
          </TabsNav>
        </div>
      </StorySection>;
  }
}`,...u.parameters?.docs?.source}}};const w=["Default","Disabled"];export{d as Default,u as Disabled,w as __namedExportsOrder,I as default};
