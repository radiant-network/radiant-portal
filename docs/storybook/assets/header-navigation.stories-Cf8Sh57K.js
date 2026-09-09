import{j as e,c as h,v as N,w,x as T,B as S,d as B}from"./iframe-CgZaKe5d.js";import{B as f}from"./badge-Dyg9dEFi.js";import{S as b}from"./skeleton-Y9K1ks3z.js";import{A as L}from"./anchor-link-Bd_UBClM.js";import{A as q}from"./arrow-left-qPcoQM0V.js";import{a as v}from"./story-section-Cd-IQlgl.js";import{B as A}from"./chunk-QUQL4437-kktIQY6E.js";import{U as H}from"./users-ChEQ132C.js";import"./preload-helper-PPVm8Dsz.js";import"./x-C9LJTscZ.js";function c({className:s,children:l,...t}){return e.jsx("div",{className:h("mx-auto",s),...t,children:l})}c.__docgenInfo={description:"",methods:[],displayName:"Container"};const R=B({slots:{container:"bg-background"},variants:{variant:{navigation:{container:""},info:{container:"border-b pb-4"}}},defaultVariants:{variant:"navigation"}});function o({title:s,badges:l,buttons:t,previousPageUrl:m,statuses:d,description:p,isLoading:j=!0,variant:y}){const x=R({variant:y});return j?e.jsx("div",{className:x.container(),children:e.jsx(c,{children:e.jsx("div",{className:"flex flex-col gap-4 pt-4 px-6",children:e.jsx(b,{className:"w-96 h-8"})})})}):e.jsx("div",{className:x.container(),children:e.jsx(c,{children:e.jsx("div",{className:"flex flex-col gap-4 pt-4 px-6",children:e.jsxs("div",{className:"flex justify-between",children:[e.jsxs("div",{className:h("flex flex-col",{"gap-3":!!p}),children:[e.jsxs("div",{className:"flex items-center gap-4 flex-wrap",children:[m&&e.jsx(L,{href:m,children:e.jsx(q,{size:20})}),e.jsx("h1",{className:"text-2xl font-bold max-w-md text-ellipsis overflow-hidden whitespace-nowrap",children:s}),e.jsx("div",{className:"flex items-center gap-2",children:(l??[]).map((r,a)=>{const{tooltipText:g,...u}=r;return g?e.jsxs(N,{children:[e.jsx(w,{children:e.jsx(f,{...u})}),e.jsx(T,{children:g})]},a):e.jsx(f,{...u},a)})})]}),e.jsx("h2",{className:"text-sm text-muted-foreground",children:p})]}),e.jsxs("div",{className:"flex items-center gap-2",children:[d&&d.length>0&&d.map((r,a)=>e.jsx("div",{children:r},a)),t&&t.length>0&&t.map((r,a)=>e.jsx(S,{...r},r.key??a))]})]})})})})}o.__docgenInfo={description:"",methods:[],displayName:"HeaderNavigation",props:{isLoading:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"true",computed:!1}},badges:{required:!1,tsType:{name:"Array",elements:[{name:"intersection",raw:"BadgeProps & { tooltipText?: string }",elements:[{name:"BadgeProps"},{name:"signature",type:"object",raw:"{ tooltipText?: string }",signature:{properties:[{key:"tooltipText",value:{name:"string",required:!1}}]}}]}],raw:"HeaderNavigationBadge[]"},description:""},buttons:{required:!1,tsType:{name:"Array",elements:[{name:"ButtonProps"}],raw:"ButtonProps[]"},description:""},statuses:{required:!1,tsType:{name:"Array",elements:[{name:"ReactNode"}],raw:"ReactNode[]"},description:""},title:{required:!1,tsType:{name:"string"},description:""},description:{required:!1,tsType:{name:"string"},description:""},previousPageUrl:{required:!1,tsType:{name:"string"},description:""}},composes:["VariantProps"]};const F={title:"Layout/Header navigation",component:o,args:{}},i={args:{},render:()=>e.jsx(v,{title:"Loading",children:e.jsx("div",{className:"w-full",children:e.jsx(o,{})})})},n={args:{isLoading:!1,title:"Title",badges:[{variant:"secondary",children:e.jsxs(e.Fragment,{children:[e.jsx(H,{}),"Icon"]})},{variant:"outline",children:e.jsx(e.Fragment,{children:"outline"})}],buttons:[{children:"primary"},{variant:"secondary",children:"Secondary"}],description:"Optional description text…"},render:s=>e.jsx(v,{title:"Default",children:e.jsx(A,{children:e.jsx("div",{className:"w-full",children:e.jsx(o,{...s})})})})};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  args: {},
  render: () => <StorySection title="Loading">
      <div className="w-full">
        <HeaderNavigation />
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
          <HeaderNavigation {...args} />
        </div>
      </BrowserRouter>
    </StorySection>
}`,...n.parameters?.docs?.source}}};const z=["Loading","Default"];export{n as Default,i as Loading,z as __namedExportsOrder,F as default};
