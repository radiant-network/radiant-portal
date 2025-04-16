import{j as e}from"./jsx-runtime-Cf8x2fCZ.js";import{c as h}from"./utils-BNf5BS2b.js";import{r as d}from"./index-tvICUrOf.js";import"./index-yBjzXJbu.js";const I=d.createContext(null),y=()=>{const a=d.useContext(I);if(a===null)throw new Error("useTabsNavContext must be used within a TabsNavProvider");return a};function i({ref:a,value:t,onValueChange:r,className:b,...c}){return e.jsx(I.Provider,{value:{value:t,onValueChange:r},children:e.jsx("div",{ref:a,className:h("flex border-b px-3",b),...c})})}function s({ref:a,value:t,disabled:r=!1,className:b,children:c,...n}){const u=y();return e.jsx("div",{ref:a,"data-active":u.value===t,"data-disabled":r,className:h("group pt-1.5 pb-1 mb-[-1px] data-[active=true]:border-b-2 data-[active=true]:border-primary data-[disabled=true]:opacity-50 hover:cursor-pointer data-[disabled=true]:cursor-not-allowed",b),...n,onClick:j=>{var T,v;r||((T=u.onValueChange)==null||T.call(u,t),(v=n.onClick)==null||v.call(n,j))},children:e.jsx("div",{className:"px-3 py-2 text-muted-foreground rounded hover:bg-accent group-data-[active=true]:text-accent-foreground hover:text-accent-foreground transition-all duration-300 group-data-[disabled=true]:pointer-events-none",children:c})})}i.__docgenInfo={description:"",methods:[],displayName:"TabsNav",props:{ref:{required:!1,tsType:{name:"ReactRef",raw:"React.Ref<HTMLDivElement>",elements:[{name:"HTMLDivElement"}]},description:""},value:{required:!1,tsType:{name:"T"},description:""},onValueChange:{required:!1,tsType:{name:"signature",type:"function",raw:"(value: T) => void",signature:{arguments:[{type:{name:"T"},name:"value"}],return:{name:"void"}}},description:""}}};s.__docgenInfo={description:"",methods:[],displayName:"TabsNavItem",props:{value:{required:!0,tsType:{name:"string"},description:""},disabled:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"false",computed:!1}},ref:{required:!1,tsType:{name:"ReactRef",raw:"React.Ref<HTMLDivElement>",elements:[{name:"HTMLDivElement"}]},description:""}}};const E={title:"Navigation/TabsNav",component:i,args:{}},o={args:{},render:()=>{const[a,t]=d.useState("Tab1");return e.jsxs(i,{value:a,onValueChange:t,children:[e.jsx(s,{value:"Tab1",children:"Tab 1"}),e.jsx(s,{value:"Tab2",children:"Tab 2"}),e.jsx(s,{value:"Tab3",children:"Tab 3"})]})}},l={args:{},render:()=>{const[a,t]=d.useState("Tab1");return e.jsxs(i,{value:a,onValueChange:t,children:[e.jsx(s,{value:"Tab1",children:"Tab 1"}),e.jsx(s,{value:"Tab2",disabled:!0,children:"Tab 2"}),e.jsx(s,{value:"Tab3",disabled:!0,children:"Tab 3"})]})}};var m,p,f;o.parameters={...o.parameters,docs:{...(m=o.parameters)==null?void 0:m.docs,source:{originalSource:`{
  args: {},
  render: () => {
    const [value, setValue] = useState<Tabs>(Tabs.Tab1);
    return <TabsNav value={value} onValueChange={setValue}>
        <TabsNavItem value={Tabs.Tab1}>Tab 1</TabsNavItem>
        <TabsNavItem value={Tabs.Tab2}>Tab 2</TabsNavItem>
        <TabsNavItem value={Tabs.Tab3}>Tab 3</TabsNavItem>
      </TabsNav>;
  }
}`,...(f=(p=o.parameters)==null?void 0:p.docs)==null?void 0:f.source}}};var N,x,g;l.parameters={...l.parameters,docs:{...(N=l.parameters)==null?void 0:N.docs,source:{originalSource:`{
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
}`,...(g=(x=l.parameters)==null?void 0:x.docs)==null?void 0:g.source}}};const w=["Default","Disabled"];export{o as Default,l as Disabled,w as __namedExportsOrder,E as default};
