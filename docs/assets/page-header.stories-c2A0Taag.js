import{j as e}from"./jsx-runtime-D_zvdyIk.js";import{c as h}from"./utils-D-KgF5mV.js";import{S as c}from"./skeleton-Shk8p_SP.js";import{B as b}from"./back-link-p8OCs1eK.js";import{B as v}from"./button-BcgqHh3y.js";import{B as N}from"./badge-D_UfbDzk.js";import{L as B,B as w}from"./chunk-QMGIS6GS-BVn03xmM.js";import{U as L}from"./users-BFGqzbhB.js";import"./chevron-left-DGpQFcG5.js";import"./createLucideIcon-BMP5cxO1.js";import"./index-DQLiH3RP.js";import"./index-b4Krvw3J.js";import"./index-CECE1b4A.js";import"./index-CJPVTaBz.js";import"./ActionButton-yaQJeqfP.js";import"./dropdown-menu-5z4VmTsG.js";import"./index-DZeBqZZX.js";import"./index-CKWZTibS.js";import"./index-CS2et-gJ.js";import"./index-BlJj-Uol.js";import"./check-DSCf8CVO.js";import"./button.variants-Czj0iLzG.js";import"./index-C66Dxnp2.js";import"./ellipsis-BtlAG3ey.js";import"./spinner-DHVcj7-u.js";import"./tooltip-2a7OmUZw.js";import"./i18n-CCBxOW2n.js";import"./iframe-DlbWOXsi.js";import"./x-ClsbQ_rO.js";function d({className:t,children:n,...o}){return e.jsx("div",{className:h("mx-auto",t),...o,children:n})}d.__docgenInfo={description:"",methods:[],displayName:"Container"};function i({title:t,badges:n,buttons:o,description:m,breadcrumbs:j,isLoading:y=!0}){return y?e.jsx("div",{className:"bg-background",children:e.jsx(d,{children:e.jsxs("div",{className:"flex flex-col gap-4 pt-4 px-6",children:[e.jsx(c,{className:"w-48 h-8"}),e.jsx(c,{className:"w-96 h-8"})]})})}):e.jsx("div",{className:"bg-background",children:e.jsx(d,{children:e.jsxs("div",{className:"flex flex-col gap-4 pt-4 px-6",children:[(j??[]).map(r=>e.jsx(B,{to:r.to,children:e.jsx(b,{children:r.text})})),e.jsxs("div",{className:"flex justify-between",children:[e.jsxs("div",{className:h("flex flex-col",{"gap-3":!!m}),children:[e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx("h1",{className:"text-2xl font-bold",children:t}),(n??[]).map(r=>e.jsx(N,{...r}))]}),e.jsx("h2",{className:"text-sm text-muted-foreground",children:m})]}),e.jsx("div",{className:"flex items-center gap-2",children:(o??[]).map(r=>e.jsx(v,{...r}))})]})]})})})}i.__docgenInfo={description:"",methods:[],displayName:"PageHeader",props:{isLoading:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"true",computed:!1}},breadcrumbs:{required:!1,tsType:{name:"Array",elements:[{name:"signature",type:"object",raw:`{
  to: string;
  text: string;
}`,signature:{properties:[{key:"to",value:{name:"string",required:!0}},{key:"text",value:{name:"string",required:!0}}]}}],raw:"breadcrumbsProps[]"},description:""},badges:{required:!1,tsType:{name:"Array",elements:[{name:"BadgeProps"}],raw:"BadgeProps[]"},description:""},buttons:{required:!1,tsType:{name:"Array",elements:[{name:"ButtonProps"}],raw:"ButtonProps[]"},description:""},title:{required:!1,tsType:{name:"string"},description:""},description:{required:!1,tsType:{name:"string"},description:""}}};const re={title:"data-display/Page-Header",component:i,args:{}},s={args:{},render:()=>e.jsx(i,{})},a={args:{isLoading:!1,breadcrumbs:[{to:"#",text:"Level 1"}],title:"Title",badges:[{variant:"secondary",children:e.jsxs(e.Fragment,{children:[e.jsx(L,{}),"Icon"]})},{variant:"outline",children:e.jsx(e.Fragment,{children:"outline"})}],buttons:[{children:"primary"},{variant:"secondary",children:"Secondary"}],description:"Optional description text…"},render:t=>e.jsx(w,{children:e.jsx(i,{...t})})};var l,p,u;s.parameters={...s.parameters,docs:{...(l=s.parameters)==null?void 0:l.docs,source:{originalSource:`{
  args: {},
  render: () => {
    return <PageHeader />;
  }
}`,...(u=(p=s.parameters)==null?void 0:p.docs)==null?void 0:u.source}}};var x,g,f;a.parameters={...a.parameters,docs:{...(x=a.parameters)==null?void 0:x.docs,source:{originalSource:`{
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
}`,...(f=(g=a.parameters)==null?void 0:g.docs)==null?void 0:f.source}}};const te=["Loading","Default"];export{a as Default,s as Loading,te as __namedExportsOrder,re as default};
