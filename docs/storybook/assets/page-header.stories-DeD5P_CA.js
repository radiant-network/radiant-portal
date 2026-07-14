import{j as e,c as f,T as y,f as N,h as w,b as T}from"./iframe-Dz8_RTnr.js";import{B as u}from"./badge-CUeufY1L.js";import{B as S}from"./button-BoQ-FEGa.js";import{S as B}from"./skeleton-XISvpJaa.js";import{a as h}from"./story-section-D91u7BO8.js";import{B as b}from"./chunk-QUQL4437-BOWQmQxI.js";import{U as P}from"./users-BPTs6Prn.js";import"./preload-helper-PPVm8Dsz.js";import"./separator-CwwChQ-7.js";import"./x-Dsdioaxj.js";import"./action-button-Dfe_PX_5.js";import"./dropdown-menu-CVXrsCd5.js";import"./index-DJVrsfBV.js";import"./index-DR0W2HG6.js";import"./check-BHMYym5j.js";import"./circle-CTXBJzqY.js";import"./i18n-DET2zMxp.js";import"./index-DvkhtlNS.js";function c({className:t,children:l,...s}){return e.jsx("div",{className:f("mx-auto",t),...s,children:l})}c.__docgenInfo={description:"",methods:[],displayName:"Container"};const L=T({slots:{container:"bg-background"},variants:{variant:{navigation:{container:""},info:{container:"border-b pb-4"}}},defaultVariants:{variant:"navigation"}});function o({title:t,badges:l,buttons:s,statuses:d,description:p,isLoading:j=!0,variant:v}){const m=L({variant:v});return j?e.jsx("div",{className:m.container(),children:e.jsx(c,{children:e.jsx("div",{className:"flex flex-col gap-4 pt-4 px-6",children:e.jsx(B,{className:"w-96 h-8"})})})}):e.jsx("div",{className:m.container(),children:e.jsx(c,{children:e.jsx("div",{className:"flex flex-col gap-4 pt-4 px-6",children:e.jsxs("div",{className:"flex justify-between",children:[e.jsxs("div",{className:f("flex flex-col",{"gap-3":!!p}),children:[e.jsxs("div",{className:"flex items-center gap-4 flex-wrap",children:[e.jsx("h1",{className:"text-2xl font-bold max-w-md text-ellipsis overflow-hidden whitespace-nowrap",children:t}),e.jsx("div",{className:"flex items-center gap-2",children:(l??[]).map((r,a)=>{const{tooltipText:x,...g}=r;return x?e.jsxs(y,{children:[e.jsx(N,{children:e.jsx(u,{...g})}),e.jsx(w,{children:x})]},a):e.jsx(u,{...g},a)})})]}),e.jsx("h2",{className:"text-sm text-muted-foreground",children:p})]}),e.jsxs("div",{className:"flex items-center gap-2",children:[d&&d.length>0&&d.map((r,a)=>e.jsx("div",{children:r},a)),s&&s.length>0&&s.map((r,a)=>e.jsx(S,{...r},r.key??a))]})]})})})})}o.__docgenInfo={description:"",methods:[],displayName:"PageHeader",props:{isLoading:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"true",computed:!1}},badges:{required:!1,tsType:{name:"Array",elements:[{name:"intersection",raw:"BadgeProps & { tooltipText?: string }",elements:[{name:"BadgeProps"},{name:"signature",type:"object",raw:"{ tooltipText?: string }",signature:{properties:[{key:"tooltipText",value:{name:"string",required:!1}}]}}]}],raw:"PageHeaderBadge[]"},description:""},buttons:{required:!1,tsType:{name:"Array",elements:[{name:"ButtonProps"}],raw:"ButtonProps[]"},description:""},statuses:{required:!1,tsType:{name:"Array",elements:[{name:"ReactNode"}],raw:"ReactNode[]"},description:""},title:{required:!1,tsType:{name:"string"},description:""},description:{required:!1,tsType:{name:"string"},description:""}},composes:["VariantProps"]};const M={title:"Layout/Page Header",component:o,args:{}},i={args:{},render:()=>e.jsx(h,{title:"Loading",children:e.jsx("div",{className:"w-full",children:e.jsx(o,{})})})},n={args:{isLoading:!1,title:"Title",badges:[{variant:"secondary",children:e.jsxs(e.Fragment,{children:[e.jsx(P,{}),"Icon"]})},{variant:"outline",children:e.jsx(e.Fragment,{children:"outline"})}],buttons:[{children:"primary"},{variant:"secondary",children:"Secondary"}],description:"Optional description text…"},render:t=>e.jsx(h,{title:"Default",children:e.jsx(b,{children:e.jsx("div",{className:"w-full",children:e.jsx(o,{...t})})})})};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  args: {},
  render: () => <StorySection title="Loading">
      <div className="w-full">
        <PageHeader />
      </div>
    </StorySection>
}`,...i.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
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
  render: args => <StorySection title="Default">
      <BrowserRouter>
        <div className="w-full">
          <PageHeader {...args} />
        </div>
      </BrowserRouter>
    </StorySection>
}`,...n.parameters?.docs?.source}}};const Q=["Loading","Default"];export{n as Default,i as Loading,Q as __namedExportsOrder,M as default};
