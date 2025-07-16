import{j as e}from"./jsx-runtime-D_zvdyIk.js";import{c as b}from"./index-C66Dxnp2.js";import{c as j}from"./utils-D-KgF5mV.js";import{S as m}from"./skeleton-Shk8p_SP.js";import{B as N}from"./button-GdlRjDSK.js";import{B}from"./badge-D_UfbDzk.js";import{U as P}from"./users-BFGqzbhB.js";import{B as w}from"./chunk-QMGIS6GS-BVn03xmM.js";import"./index-b4Krvw3J.js";import"./index-DQLiH3RP.js";import"./index-CECE1b4A.js";import"./index-CJPVTaBz.js";import"./ActionButton-yaQJeqfP.js";import"./dropdown-menu-5z4VmTsG.js";import"./index-DZeBqZZX.js";import"./index-CKWZTibS.js";import"./index-CS2et-gJ.js";import"./index-BlJj-Uol.js";import"./check-DSCf8CVO.js";import"./createLucideIcon-BMP5cxO1.js";import"./button.variants-Czj0iLzG.js";import"./ellipsis-BtlAG3ey.js";import"./spinner-DHVcj7-u.js";import"./tooltip-2a7OmUZw.js";import"./i18n-D-P4Fd2b.js";import"./iframe-C32Di235.js";import"./x-ClsbQ_rO.js";function d({className:r,children:i,...n}){return e.jsx("div",{className:j("mx-auto",r),...n,children:i})}d.__docgenInfo={description:"",methods:[],displayName:"Container"};const L=b({slots:{container:"bg-background"},variants:{variant:{navigation:{container:""},info:{container:"border-b pb-4"}}},defaultVariants:{variant:"navigation"}});function s({title:r,badges:i,buttons:n,description:c,isLoading:v=!0,variant:y}){const l=L({variant:y});return v?e.jsx("div",{className:l.container(),children:e.jsx(d,{children:e.jsxs("div",{className:"flex flex-col gap-4 pt-4 px-6",children:[e.jsx(m,{className:"w-48 h-8"}),e.jsx(m,{className:"w-96 h-8"})]})})}):e.jsx("div",{className:l.container(),children:e.jsx(d,{children:e.jsx("div",{className:"flex flex-col gap-4 pt-4 px-6",children:e.jsxs("div",{className:"flex justify-between",children:[e.jsxs("div",{className:j("flex flex-col",{"gap-3":!!c}),children:[e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx("h1",{className:"text-2xl font-bold",children:r}),(i??[]).map(o=>e.jsx(B,{...o}))]}),e.jsx("h2",{className:"text-sm text-muted-foreground",children:c})]}),e.jsx("div",{className:"flex items-center gap-2",children:(n??[]).map(o=>e.jsx(N,{...o}))})]})})})})}s.__docgenInfo={description:"",methods:[],displayName:"PageHeader",props:{isLoading:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"true",computed:!1}},badges:{required:!1,tsType:{name:"Array",elements:[{name:"BadgeProps"}],raw:"BadgeProps[]"},description:""},buttons:{required:!1,tsType:{name:"Array",elements:[{name:"ButtonProps"}],raw:"ButtonProps[]"},description:""},title:{required:!1,tsType:{name:"string"},description:""},description:{required:!1,tsType:{name:"string"},description:""}},composes:["VariantProps"]};const ee={title:"data-display/Page-Header",component:s,args:{}},a={args:{},render:()=>e.jsx(s,{})},t={args:{isLoading:!1,breadcrumbs:[{to:"#",text:"Level 1"}],title:"Title",badges:[{variant:"secondary",children:e.jsxs(e.Fragment,{children:[e.jsx(P,{}),"Icon"]})},{variant:"outline",children:e.jsx(e.Fragment,{children:"outline"})}],buttons:[{children:"primary"},{variant:"secondary",children:"Secondary"}],description:"Optional description text…"},render:r=>e.jsx(w,{children:e.jsx(s,{...r})})};var p,u,x;a.parameters={...a.parameters,docs:{...(p=a.parameters)==null?void 0:p.docs,source:{originalSource:`{
  args: {},
  render: () => {
    return <PageHeader />;
  }
}`,...(x=(u=a.parameters)==null?void 0:u.docs)==null?void 0:x.source}}};var g,f,h;t.parameters={...t.parameters,docs:{...(g=t.parameters)==null?void 0:g.docs,source:{originalSource:`{
  args: {
    isLoading: false,
    breadcrumbs: [{
      to: '#',
      text: 'Level 1'
    }],
    title: 'Title',
    badges: [{
      variant: "secondary",
      children: <><Users />Icon</>
    }, {
      variant: "outline",
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
}`,...(h=(f=t.parameters)==null?void 0:f.docs)==null?void 0:h.source}}};const re=["Loading","Default"];export{t as Default,a as Loading,re as __namedExportsOrder,ee as default};
