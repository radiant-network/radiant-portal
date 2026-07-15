import{j as e,c as h,T as N,f as w,h as T,b as S}from"./iframe-kLaNX2HI.js";import{B as u}from"./badge-BBff1bAs.js";import{B}from"./button-lcKTI4HU.js";import{S as b}from"./skeleton-DmgM1E7r.js";import{A as P}from"./anchor-link-7G3cZ65N.js";import{A as L}from"./arrow-left-DeV3G6s7.js";import{a as j}from"./story-section-YShHgFMq.js";import{B as q}from"./chunk-QUQL4437-7Vep-gW3.js";import{U as A}from"./users-CKxRJSdH.js";import"./preload-helper-PPVm8Dsz.js";import"./separator-BTZwSWvT.js";import"./x-AVvb3cMA.js";import"./action-button-D3l4bIzZ.js";import"./dropdown-menu-85xmnBFd.js";import"./index-fXaV-lio.js";import"./index-B2vLf8-Q.js";import"./check-NiNg2u4X.js";import"./circle-yHcXqLnR.js";import"./i18n-ZHel4DsP.js";import"./index-BCXviJZk.js";function c({className:t,children:l,...s}){return e.jsx("div",{className:h("mx-auto",t),...s,children:l})}c.__docgenInfo={description:"",methods:[],displayName:"Container"};const H=S({slots:{container:"bg-background"},variants:{variant:{navigation:{container:""},info:{container:"border-b pb-4"}}},defaultVariants:{variant:"navigation"}});function o({title:t,badges:l,buttons:s,previousPageUrl:m,statuses:d,description:p,isLoading:v=!0,variant:y}){const x=H({variant:y});return v?e.jsx("div",{className:x.container(),children:e.jsx(c,{children:e.jsx("div",{className:"flex flex-col gap-4 pt-4 px-6",children:e.jsx(b,{className:"w-96 h-8"})})})}):e.jsx("div",{className:x.container(),children:e.jsx(c,{children:e.jsx("div",{className:"flex flex-col gap-4 pt-4 px-6",children:e.jsxs("div",{className:"flex justify-between",children:[e.jsxs("div",{className:h("flex flex-col",{"gap-3":!!p}),children:[e.jsxs("div",{className:"flex items-center gap-4 flex-wrap",children:[m&&e.jsx(P,{href:m,children:e.jsx(L,{size:20})}),e.jsx("h1",{className:"text-2xl font-bold max-w-md text-ellipsis overflow-hidden whitespace-nowrap",children:t}),e.jsx("div",{className:"flex items-center gap-2",children:(l??[]).map((r,a)=>{const{tooltipText:g,...f}=r;return g?e.jsxs(N,{children:[e.jsx(w,{children:e.jsx(u,{...f})}),e.jsx(T,{children:g})]},a):e.jsx(u,{...f},a)})})]}),e.jsx("h2",{className:"text-sm text-muted-foreground",children:p})]}),e.jsxs("div",{className:"flex items-center gap-2",children:[d&&d.length>0&&d.map((r,a)=>e.jsx("div",{children:r},a)),s&&s.length>0&&s.map((r,a)=>e.jsx(B,{...r},r.key??a))]})]})})})})}o.__docgenInfo={description:"",methods:[],displayName:"PageHeader",props:{isLoading:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"true",computed:!1}},badges:{required:!1,tsType:{name:"Array",elements:[{name:"intersection",raw:"BadgeProps & { tooltipText?: string }",elements:[{name:"BadgeProps"},{name:"signature",type:"object",raw:"{ tooltipText?: string }",signature:{properties:[{key:"tooltipText",value:{name:"string",required:!1}}]}}]}],raw:"PageHeaderBadge[]"},description:""},buttons:{required:!1,tsType:{name:"Array",elements:[{name:"ButtonProps"}],raw:"ButtonProps[]"},description:""},statuses:{required:!1,tsType:{name:"Array",elements:[{name:"ReactNode"}],raw:"ReactNode[]"},description:""},title:{required:!1,tsType:{name:"string"},description:""},description:{required:!1,tsType:{name:"string"},description:""},previousPageUrl:{required:!1,tsType:{name:"string"},description:""}},composes:["VariantProps"]};const Z={title:"Layout/Page Header",component:o,args:{}},i={args:{},render:()=>e.jsx(j,{title:"Loading",children:e.jsx("div",{className:"w-full",children:e.jsx(o,{})})})},n={args:{isLoading:!1,title:"Title",badges:[{variant:"secondary",children:e.jsxs(e.Fragment,{children:[e.jsx(A,{}),"Icon"]})},{variant:"outline",children:e.jsx(e.Fragment,{children:"outline"})}],buttons:[{children:"primary"},{variant:"secondary",children:"Secondary"}],description:"Optional description text…"},render:t=>e.jsx(j,{title:"Default",children:e.jsx(q,{children:e.jsx("div",{className:"w-full",children:e.jsx(o,{...t})})})})};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
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
}`,...n.parameters?.docs?.source}}};const $=["Loading","Default"];export{n as Default,i as Loading,$ as __namedExportsOrder,Z as default};
