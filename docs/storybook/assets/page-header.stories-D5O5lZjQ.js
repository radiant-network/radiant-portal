import{j as e,c as T,f as b,b as P,d as H,e as q}from"./iframe-DMgXTsUt.js";import{B as u}from"./badge-Dr4vhL1k.js";import{B as R}from"./button-DKHsgogP.js";import{S}from"./skeleton-BNwu5UWS.js";import{U as _}from"./users-D1IQfkt4.js";import{B as L}from"./chunk-EPOLDU6W--IKZhA5V.js";import"./preload-helper-Dp1pzeXC.js";import"./separator-BHEYhOBk.js";import"./index-6FsEz12V.js";import"./x-DOMrXJxb.js";import"./action-button-N1uA_vHz.js";import"./dropdown-menu-D9pNxrVY.js";import"./index-HfLmxDMw.js";import"./circle-Cbw1kZCn.js";import"./check-D1fRC3F_.js";import"./i18n-BeXLuT2M.js";function c({className:n,children:d,...s}){return e.jsx("div",{className:T("mx-auto",n),...s,children:d})}c.__docgenInfo={description:"",methods:[],displayName:"Container"};const k=b({slots:{container:"bg-background"},variants:{variant:{navigation:{container:""},info:{container:"border-b pb-4"}}},defaultVariants:{variant:"navigation"}});function o({title:n,badges:d,buttons:s,statuses:l,description:p,isLoading:w=!0,variant:B}){const m=k({variant:B});return w?e.jsx("div",{className:m.container(),children:e.jsx(c,{children:e.jsx("div",{className:"flex flex-col gap-4 pt-4 px-6",children:e.jsx(S,{className:"w-96 h-8"})})})}):e.jsx("div",{className:m.container(),children:e.jsx(c,{children:e.jsx("div",{className:"flex flex-col gap-4 pt-4 px-6",children:e.jsxs("div",{className:"flex justify-between",children:[e.jsxs("div",{className:T("flex flex-col",{"gap-3":!!p}),children:[e.jsxs("div",{className:"flex items-center gap-4 flex-wrap",children:[e.jsx("h1",{className:"text-2xl font-bold max-w-md text-ellipsis overflow-hidden whitespace-nowrap",children:n}),e.jsx("div",{className:"flex items-center gap-2",children:(d??[]).map((r,a)=>{const{tooltipText:x,...g}=r;return x?e.jsxs(P,{children:[e.jsx(H,{children:e.jsx(u,{...g})}),e.jsx(q,{children:x})]},a):e.jsx(u,{...g},a)})})]}),e.jsx("h2",{className:"text-sm text-muted-foreground",children:p})]}),e.jsxs("div",{className:"flex items-center gap-2",children:[l&&l.length>0&&l.map((r,a)=>e.jsx("div",{children:r},a)),s&&s.length>0&&s.map((r,a)=>e.jsx(R,{...r},r.key??a))]})]})})})})}o.__docgenInfo={description:"",methods:[],displayName:"PageHeader",props:{isLoading:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"true",computed:!1}},badges:{required:!1,tsType:{name:"Array",elements:[{name:"intersection",raw:"BadgeProps & { tooltipText?: string }",elements:[{name:"BadgeProps"},{name:"signature",type:"object",raw:"{ tooltipText?: string }",signature:{properties:[{key:"tooltipText",value:{name:"string",required:!1}}]}}]}],raw:"PageHeaderBadge[]"},description:""},buttons:{required:!1,tsType:{name:"Array",elements:[{name:"ButtonProps"}],raw:"ButtonProps[]"},description:""},statuses:{required:!1,tsType:{name:"Array",elements:[{name:"ReactNode"}],raw:"ReactNode[]"},description:""},title:{required:!1,tsType:{name:"string"},description:""},description:{required:!1,tsType:{name:"string"},description:""}},composes:["VariantProps"]};const X={title:"Headers/Page-Header",component:o,args:{}},t={args:{},render:()=>e.jsx(o,{})},i={args:{isLoading:!1,title:"Title",badges:[{variant:"secondary",children:e.jsxs(e.Fragment,{children:[e.jsx(_,{}),"Icon"]})},{variant:"outline",children:e.jsx(e.Fragment,{children:"outline"})}],buttons:[{children:"primary"},{variant:"secondary",children:"Secondary"}],description:"Optional description text…"},render:n=>e.jsx(L,{children:e.jsx(o,{...n})})};var f,h,j;t.parameters={...t.parameters,docs:{...(f=t.parameters)==null?void 0:f.docs,source:{originalSource:`{
  args: {},
  render: () => {
    return <PageHeader />;
  }
}`,...(j=(h=t.parameters)==null?void 0:h.docs)==null?void 0:j.source}}};var v,y,N;i.parameters={...i.parameters,docs:{...(v=i.parameters)==null?void 0:v.docs,source:{originalSource:`{
  args: {
    isLoading: false,
    title: 'Title',
    badges: [{
      variant: 'secondary',
      children: <>
            <Users />
            Icon
          </>
    }, {
      variant: 'outline',
      children: <>outline</>
    }],
    buttons: [{
      children: 'primary'
    }, {
      variant: 'secondary',
      children: 'Secondary'
    }],
    description: 'Optional description text…'
  },
  render: args => {
    return <BrowserRouter>
        <PageHeader {...args} />
      </BrowserRouter>;
  }
}`,...(N=(y=i.parameters)==null?void 0:y.docs)==null?void 0:N.source}}};const Y=["Loading","Default"];export{i as Default,t as Loading,Y as __namedExportsOrder,X as default};
