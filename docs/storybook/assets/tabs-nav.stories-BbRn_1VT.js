import{n as e}from"./rolldown-runtime-C0FnF6B9.js";import{t}from"./react-BRh_h4kc.js";import{t as n}from"./jsx-runtime-BdxMnOeJ.js";import{n as r,t as i}from"./utils-hYbUpBR2.js";import{n as a,t as o}from"./user-kCV1wli6.js";import{i as s,n as c}from"./story-section-DVTm6cGm.js";var l,u,d;function f(){return(f=e((()=>{l=t(),u=n(),d=({visible:e,children:t})=>{let n=(0,l.useRef)(e);return e&&!n.current&&(n.current=!0),n.current?(0,u.jsx)(u.Fragment,{children:t}):null},d.__docgenInfo={description:``,methods:[],displayName:`Lazy`,props:{visible:{required:!0,tsType:{name:`boolean`},description:``}}}})))()}var p,m,h;function g(){return(g=e((()=>{p=t(),m=(0,p.createContext)(null),h=()=>{let e=(0,p.useContext)(m);if(e===null)throw Error(`useTabsNavContext must be used within a TabsNavProvider`);return e}})))()}function _({ref:e,value:t,onValueChange:n,...r}){return(0,x.jsx)(m.Provider,{value:{value:t,onValueChange:n},children:(0,x.jsx)(`div`,{ref:e,...r})})}function v({ref:e,className:t,contentClassName:n,children:r,...a}){return(0,x.jsx)(`div`,{ref:e,className:i(`relative before:border-b before:border-border before:absolute before:left-0 before:right-0 before:bottom-0`,t),...a,children:(0,x.jsx)(`div`,{className:i(`flex overflow-x-auto`,n),children:r})})}function y({ref:e,value:t,disabled:n=!1,className:r,children:a,...o}){let s=h(),c=s.value===t;return(0,x.jsx)(`div`,{ref:e,"data-active":c,"data-disabled":n,className:i(`z-1 group pt-1.5 pb-1 hover:cursor-pointer`,{"border-b-2 border-primary font-semibold":c,"opacity-50 hover:cursor-not-allowed":n},r),...o,onClick:e=>{n||(s.onValueChange?.(t),o.onClick?.(e))},children:(0,x.jsx)(`div`,{className:`flex items-center has-[svg]:px-4 px-3 py-2 [&_svg]:size-4 gap-2 text-sm text-muted-foreground rounded-sm hover:bg-accent group-data-[active=true]:text-accent-foreground hover:text-accent-foreground transition-all duration-300 group-data-[disabled=true]:pointer-events-none whitespace-nowrap`,children:a})})}function b({ref:e,value:t,children:n,className:r,...a}){let o=h().value===t;return(0,x.jsx)(d,{visible:o,children:(0,x.jsx)(`div`,{ref:e,className:i({hidden:!o},r),...a,children:n})})}var x;function S(){return(S=e((()=>{t(),f(),r(),g(),x=n(),_.__docgenInfo={description:``,methods:[],displayName:`TabsNav`,props:{ref:{required:!1,tsType:{name:`ReactRef`,raw:`React.Ref<HTMLDivElement>`,elements:[{name:`HTMLDivElement`}]},description:``},value:{required:!1,tsType:{name:`T`},description:``},onValueChange:{required:!1,tsType:{name:`signature`,type:`function`,raw:`(value: T) => void`,signature:{arguments:[{type:{name:`T`},name:`value`}],return:{name:`void`}}},description:``}}},v.__docgenInfo={description:``,methods:[],displayName:`TabsList`,props:{ref:{required:!1,tsType:{name:`ReactRef`,raw:`React.Ref<HTMLDivElement>`,elements:[{name:`HTMLDivElement`}]},description:``},contentClassName:{required:!1,tsType:{name:`string`},description:``}}},y.__docgenInfo={description:``,methods:[],displayName:`TabsListItem`,props:{value:{required:!0,tsType:{name:`T`},description:``},disabled:{required:!1,tsType:{name:`boolean`},description:``,defaultValue:{value:`false`,computed:!1}},ref:{required:!1,tsType:{name:`ReactRef`,raw:`React.Ref<HTMLDivElement>`,elements:[{name:`HTMLDivElement`}]},description:``},children:{required:!0,tsType:{name:`ReactReactNode`,raw:`React.ReactNode`},description:``}}},b.__docgenInfo={description:``,methods:[],displayName:`TabsContent`,props:{value:{required:!0,tsType:{name:`T`},description:``},ref:{required:!1,tsType:{name:`ReactRef`,raw:`React.Ref<HTMLDivElement>`,elements:[{name:`HTMLDivElement`}]},description:``}}}})))()}var C,w,T,E,D,O;function k(){return(k=e((()=>{C=t(),a(),S(),s(),w=n(),T={title:`Components/Tabs/Tabs Nav`,component:_,args:{}},E={args:{},render:()=>{let[e,t]=(0,C.useState)(`Tab1`);return(0,w.jsx)(c,{title:`Default`,children:(0,w.jsx)(`div`,{className:`w-full`,children:(0,w.jsxs)(_,{value:e,onValueChange:t,children:[(0,w.jsxs)(v,{children:[(0,w.jsxs)(y,{value:`Tab1`,children:[(0,w.jsx)(o,{}),` Tab 1`]}),(0,w.jsx)(y,{value:`Tab2`,children:`Tab 2`}),(0,w.jsx)(y,{value:`Tab3`,children:`Tab 3`})]}),(0,w.jsx)(b,{value:`Tab1`,children:(0,w.jsx)(`p`,{children:`Content for Tab 1`})}),(0,w.jsx)(b,{value:`Tab2`,children:(0,w.jsx)(`p`,{children:`Content for Tab 2`})}),(0,w.jsx)(b,{value:`Tab3`,children:(0,w.jsx)(`p`,{children:`Content for Tab 3`})})]})})})}},D={args:{},render:()=>{let[e,t]=(0,C.useState)(`Tab1`);return(0,w.jsx)(c,{title:`Disabled`,children:(0,w.jsx)(`div`,{className:`w-full`,children:(0,w.jsxs)(_,{value:e,onValueChange:t,children:[(0,w.jsxs)(v,{children:[(0,w.jsx)(y,{value:`Tab1`,children:`Tab 1`}),(0,w.jsx)(y,{value:`Tab2`,disabled:!0,children:`Tab 2`}),(0,w.jsx)(y,{value:`Tab3`,disabled:!0,children:`Tab 3`})]}),(0,w.jsx)(b,{value:`Tab1`,children:(0,w.jsx)(`p`,{children:`Content for Tab 1`})}),(0,w.jsx)(b,{value:`Tab2`,children:(0,w.jsx)(`p`,{children:`Content for Tab 2`})}),(0,w.jsx)(b,{value:`Tab3`,children:(0,w.jsx)(`p`,{children:`Content for Tab 3`})})]})})})}},E.parameters={...E.parameters,docs:{...E.parameters?.docs,source:{originalSource:`{
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
}`,...E.parameters?.docs?.source}}},D.parameters={...D.parameters,docs:{...D.parameters?.docs,source:{originalSource:`{
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
}`,...D.parameters?.docs?.source}}},O=[`Default`,`Disabled`]})))()}k();export{E as Default,D as Disabled,O as __namedExportsOrder,T as default};