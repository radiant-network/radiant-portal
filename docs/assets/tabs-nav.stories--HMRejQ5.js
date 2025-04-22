import{j as e}from"./jsx-runtime-Cf8x2fCZ.js";import{c as I}from"./utils-CytzSlOG.js";import{r as i}from"./index-tvICUrOf.js";import"./index-yBjzXJbu.js";const j=i.createContext(null),V=()=>{const a=i.useContext(j);if(a===null)throw new Error("useTabsNavContext must be used within a TabsNavProvider");return a};function d({ref:a,value:t,onValueChange:r,className:b,...c}){return e.jsx(j.Provider,{value:{value:t,onValueChange:r},children:e.jsx("div",{ref:a,className:I("flex border-b px-3",b),...c})})}function s({ref:a,value:t,disabled:r=!1,className:b,children:c,...n}){const o=V(),T=o.value===t;return e.jsx("div",{ref:a,"data-active":T,"data-disabled":r,className:I("group pt-1.5 pb-1 mb-[-1px] hover:cursor-pointer",{"border-b-2 border-primary":T,"opacity-50 hover:cursor-not-allowed":r},b),...n,onClick:y=>{var v,m;r||((v=o.onValueChange)==null||v.call(o,t),(m=n.onClick)==null||m.call(n,y))},children:e.jsx("div",{className:"px-3 py-2 text-muted-foreground rounded hover:bg-accent group-data-[active=true]:text-accent-foreground hover:text-accent-foreground transition-all duration-300 group-data-[disabled=true]:pointer-events-none",children:c})})}d.__docgenInfo={description:"",methods:[],displayName:"TabsNav",props:{ref:{required:!1,tsType:{name:"ReactRef",raw:"React.Ref<HTMLDivElement>",elements:[{name:"HTMLDivElement"}]},description:""},value:{required:!1,tsType:{name:"T"},description:""},onValueChange:{required:!1,tsType:{name:"signature",type:"function",raw:"(value: T) => void",signature:{arguments:[{type:{name:"T"},name:"value"}],return:{name:"void"}}},description:""}}};s.__docgenInfo={description:"",methods:[],displayName:"TabsNavItem",props:{value:{required:!0,tsType:{name:"string"},description:""},disabled:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"false",computed:!1}},ref:{required:!1,tsType:{name:"ReactRef",raw:"React.Ref<HTMLDivElement>",elements:[{name:"HTMLDivElement"}]},description:""}}};const w={title:"Navigation/TabsNav",component:d,args:{}},u={args:{},render:()=>{const[a,t]=i.useState("Tab1");return e.jsxs(d,{value:a,onValueChange:t,children:[e.jsx(s,{value:"Tab1",children:"Tab 1"}),e.jsx(s,{value:"Tab2",children:"Tab 2"}),e.jsx(s,{value:"Tab3",children:"Tab 3"})]})}},l={args:{},render:()=>{const[a,t]=i.useState("Tab1");return e.jsxs(d,{value:a,onValueChange:t,children:[e.jsx(s,{value:"Tab1",children:"Tab 1"}),e.jsx(s,{value:"Tab2",disabled:!0,children:"Tab 2"}),e.jsx(s,{value:"Tab3",disabled:!0,children:"Tab 3"})]})}};var p,f,N;u.parameters={...u.parameters,docs:{...(p=u.parameters)==null?void 0:p.docs,source:{originalSource:`{
  args: {},
  render: () => {
    const [value, setValue] = useState<Tabs>(Tabs.Tab1);
    return <TabsNav value={value} onValueChange={setValue}>
        <TabsNavItem value={Tabs.Tab1}>Tab 1</TabsNavItem>
        <TabsNavItem value={Tabs.Tab2}>Tab 2</TabsNavItem>
        <TabsNavItem value={Tabs.Tab3}>Tab 3</TabsNavItem>
      </TabsNav>;
  }
}`,...(N=(f=u.parameters)==null?void 0:f.docs)==null?void 0:N.source}}};var x,g,h;l.parameters={...l.parameters,docs:{...(x=l.parameters)==null?void 0:x.docs,source:{originalSource:`{
  args: {},
  render: () => {
    const [value, setValue] = useState<Tabs>(Tabs.Tab1);
    return <TabsNav value={value} onValueChange={setValue}>
        <TabsNavItem value={Tabs.Tab1}>Tab 1</TabsNavItem>
        <TabsNavItem value={Tabs.Tab2} disabled>
          Tab 2
        </TabsNavItem>
        <TabsNavItem value={Tabs.Tab3} disabled>
          Tab 3
        </TabsNavItem>
      </TabsNav>;
  }
}`,...(h=(g=l.parameters)==null?void 0:g.docs)==null?void 0:h.source}}};const q=["Default","Disabled"];export{u as Default,l as Disabled,q as __namedExportsOrder,w as default};
