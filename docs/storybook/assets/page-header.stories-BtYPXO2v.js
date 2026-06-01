import{j as e,c as f,b as v,d as y,e as N,f as T}from"./iframe-fZ1JU2dD.js";import{B as u}from"./badge-_ehbmyEb.js";import{B as w}from"./button-CeuGaa2_.js";import{S as B}from"./skeleton-BjkBYmoC.js";import{B as b}from"./chunk-QUQL4437-Dibaqxmg.js";import{U as P}from"./users-85RRvFgu.js";import"./preload-helper-PPVm8Dsz.js";import"./separator-Bt15M7Wt.js";import"./index-BuixPVmM.js";import"./x-DMxNaVrf.js";import"./action-button-DH7rTm7W.js";import"./dropdown-menu-WdkrS53z.js";import"./index-Cuzu6qxP.js";import"./index-Bt1gSSe9.js";import"./check-BCrtbgAX.js";import"./circle-DE-7MMSe.js";import"./i18n-Cu2AZSyu.js";import"./index-BsMQ4rV8.js";function c({className:n,children:d,...s}){return e.jsx("div",{className:f("mx-auto",n),...s,children:d})}c.__docgenInfo={description:"",methods:[],displayName:"Container"};const H=T({slots:{container:"bg-background"},variants:{variant:{navigation:{container:""},info:{container:"border-b pb-4"}}},defaultVariants:{variant:"navigation"}});function o({title:n,badges:d,buttons:s,statuses:l,description:p,isLoading:h=!0,variant:j}){const m=H({variant:j});return h?e.jsx("div",{className:m.container(),children:e.jsx(c,{children:e.jsx("div",{className:"flex flex-col gap-4 pt-4 px-6",children:e.jsx(B,{className:"w-96 h-8"})})})}):e.jsx("div",{className:m.container(),children:e.jsx(c,{children:e.jsx("div",{className:"flex flex-col gap-4 pt-4 px-6",children:e.jsxs("div",{className:"flex justify-between",children:[e.jsxs("div",{className:f("flex flex-col",{"gap-3":!!p}),children:[e.jsxs("div",{className:"flex items-center gap-4 flex-wrap",children:[e.jsx("h1",{className:"text-2xl font-bold max-w-md text-ellipsis overflow-hidden whitespace-nowrap",children:n}),e.jsx("div",{className:"flex items-center gap-2",children:(d??[]).map((r,a)=>{const{tooltipText:x,...g}=r;return x?e.jsxs(v,{children:[e.jsx(y,{children:e.jsx(u,{...g})}),e.jsx(N,{children:x})]},a):e.jsx(u,{...g},a)})})]}),e.jsx("h2",{className:"text-sm text-muted-foreground",children:p})]}),e.jsxs("div",{className:"flex items-center gap-2",children:[l&&l.length>0&&l.map((r,a)=>e.jsx("div",{children:r},a)),s&&s.length>0&&s.map((r,a)=>e.jsx(w,{...r},r.key??a))]})]})})})})}o.__docgenInfo={description:"",methods:[],displayName:"PageHeader",props:{isLoading:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"true",computed:!1}},badges:{required:!1,tsType:{name:"Array",elements:[{name:"intersection",raw:"BadgeProps & { tooltipText?: string }",elements:[{name:"BadgeProps"},{name:"signature",type:"object",raw:"{ tooltipText?: string }",signature:{properties:[{key:"tooltipText",value:{name:"string",required:!1}}]}}]}],raw:"PageHeaderBadge[]"},description:""},buttons:{required:!1,tsType:{name:"Array",elements:[{name:"ButtonProps"}],raw:"ButtonProps[]"},description:""},statuses:{required:!1,tsType:{name:"Array",elements:[{name:"ReactNode"}],raw:"ReactNode[]"},description:""},title:{required:!1,tsType:{name:"string"},description:""},description:{required:!1,tsType:{name:"string"},description:""}},composes:["VariantProps"]};const K={title:"Headers/Page-Header",component:o,args:{}},t={args:{},render:()=>e.jsx(o,{})},i={args:{isLoading:!1,title:"Title",badges:[{variant:"secondary",children:e.jsxs(e.Fragment,{children:[e.jsx(P,{}),"Icon"]})},{variant:"outline",children:e.jsx(e.Fragment,{children:"outline"})}],buttons:[{children:"primary"},{variant:"secondary",children:"Secondary"}],description:"Optional description text…"},render:n=>e.jsx(b,{children:e.jsx(o,{...n})})};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  args: {},
  render: () => {
    return <PageHeader />;
  }
}`,...t.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
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
}`,...i.parameters?.docs?.source}}};const M=["Loading","Default"];export{i as Default,t as Loading,M as __namedExportsOrder,K as default};
