import{j as e}from"./jsx-runtime-D_zvdyIk.js";import{c as b}from"./index-C66Dxnp2.js";import{B as u}from"./badge-B8JYzoyf.js";import{B as P}from"./button-c1hWc_wn.js";import{S as H}from"./skeleton-_T1otFf0.js";import{T as q,a as R,b as S}from"./tooltip-0vX-MTK3.js";import{c as T}from"./utils-CDN07tui.js";import{U as _}from"./users-BCnyYR8e.js";import{B as L}from"./chunk-EPOLDU6W-BBQlfikL.js";import"./separator-ChZWIdMg.js";import"./index-CBYaBgW8.js";import"./index-sTUCEGFJ.js";import"./index-BWnBDfn-.js";import"./index-C-d7IIsQ.js";import"./index-Dy6y0jaD.js";import"./x-4HkHZ1eq.js";import"./createLucideIcon-B119WVF5.js";import"./action-button-9r-08jXC.js";import"./dropdown-menu-DPm_FhUX.js";import"./index-D9mtqW9-.js";import"./index-BCzuw4Jg.js";import"./index-C8BBKGwP.js";import"./index-BL8Z-moU.js";import"./Combination-CrkgvPnV.js";import"./index-iyInEJkZ.js";import"./index-C2iKAgIe.js";import"./index-CWHKeK-O.js";import"./index-CfgEC-S9.js";import"./index-DnEzm5An.js";import"./check-DSe_yRo5.js";import"./button.variants-Du9eY_ux.js";import"./spinner-DMuui_2m.js";import"./i18n--Kzlvggh.js";import"./iframe-CbY-Mg5K.js";import"./i18next-CYn7LYXT.js";import"./index-CfXWnpL9.js";function p({className:a,children:d,...n}){return e.jsx("div",{className:T("mx-auto",a),...n,children:d})}p.__docgenInfo={description:"",methods:[],displayName:"Container"};const k=b({slots:{container:"bg-background"},variants:{variant:{navigation:{container:""},info:{container:"border-b pb-4"}}},defaultVariants:{variant:"navigation"}});function o({title:a,badges:d,buttons:n,statuses:l,description:c,isLoading:w=!0,variant:B}){const m=k({variant:B});return w?e.jsx("div",{className:m.container(),children:e.jsx(p,{children:e.jsx("div",{className:"flex flex-col gap-4 pt-4 px-6",children:e.jsx(H,{className:"w-96 h-8"})})})}):e.jsx("div",{className:m.container(),children:e.jsx(p,{children:e.jsx("div",{className:"flex flex-col gap-4 pt-4 px-6",children:e.jsxs("div",{className:"flex justify-between",children:[e.jsxs("div",{className:T("flex flex-col",{"gap-3":!!c}),children:[e.jsxs("div",{className:"flex items-center gap-4 flex-wrap",children:[e.jsx("h1",{className:"text-2xl font-bold max-w-md text-ellipsis overflow-hidden whitespace-nowrap",children:a}),e.jsx("div",{className:"flex items-center gap-2",children:(d??[]).map((r,t)=>{const{tooltipText:x,...g}=r;return x?e.jsxs(q,{children:[e.jsx(R,{children:e.jsx(u,{...g})}),e.jsx(S,{children:x})]},t):e.jsx(u,{...g},t)})})]}),e.jsx("h2",{className:"text-sm text-muted-foreground",children:c})]}),e.jsxs("div",{className:"flex items-center gap-2",children:[l&&l.length>0&&l.map((r,t)=>e.jsx("div",{children:r},t)),n&&n.length>0&&n.map((r,t)=>e.jsx(P,{...r},r.key??t))]})]})})})})}o.__docgenInfo={description:"",methods:[],displayName:"PageHeader",props:{isLoading:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"true",computed:!1}},badges:{required:!1,tsType:{name:"Array",elements:[{name:"intersection",raw:"BadgeProps & { tooltipText?: string }",elements:[{name:"BadgeProps"},{name:"signature",type:"object",raw:"{ tooltipText?: string }",signature:{properties:[{key:"tooltipText",value:{name:"string",required:!1}}]}}]}],raw:"PageHeaderBadge[]"},description:""},buttons:{required:!1,tsType:{name:"Array",elements:[{name:"ButtonProps"}],raw:"ButtonProps[]"},description:""},statuses:{required:!1,tsType:{name:"Array",elements:[{name:"ReactNode"}],raw:"ReactNode[]"},description:""},title:{required:!1,tsType:{name:"string"},description:""},description:{required:!1,tsType:{name:"string"},description:""}},composes:["VariantProps"]};const fe={title:"Headers/Page-Header",component:o,args:{}},s={args:{},render:()=>e.jsx(o,{})},i={args:{isLoading:!1,title:"Title",badges:[{variant:"secondary",children:e.jsxs(e.Fragment,{children:[e.jsx(_,{}),"Icon"]})},{variant:"outline",children:e.jsx(e.Fragment,{children:"outline"})}],buttons:[{children:"primary"},{variant:"secondary",children:"Secondary"}],description:"Optional description text…"},render:a=>e.jsx(L,{children:e.jsx(o,{...a})})};var f,h,j;s.parameters={...s.parameters,docs:{...(f=s.parameters)==null?void 0:f.docs,source:{originalSource:`{
  args: {},
  render: () => {
    return <PageHeader />;
  }
}`,...(j=(h=s.parameters)==null?void 0:h.docs)==null?void 0:j.source}}};var v,y,N;i.parameters={...i.parameters,docs:{...(v=i.parameters)==null?void 0:v.docs,source:{originalSource:`{
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
}`,...(N=(y=i.parameters)==null?void 0:y.docs)==null?void 0:N.source}}};const he=["Loading","Default"];export{i as Default,s as Loading,he as __namedExportsOrder,fe as default};
