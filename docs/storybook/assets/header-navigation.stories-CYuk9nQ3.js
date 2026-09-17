import{n as e}from"./rolldown-runtime-C0FnF6B9.js";import{t}from"./jsx-runtime-BdxMnOeJ.js";import{a as n,i as r,n as i,t as a}from"./tooltip-CfAUv4AB.js";import{n as o,t as s}from"./utils-hYbUpBR2.js";import{n as c,t as l}from"./arrow-left-CW3d3gSN.js";import{n as u,t as d}from"./anchor-link-C7Xjb5sx.js";import{n as f,t as p}from"./button-Cn480Lud.js";import{n as m,t as h}from"./users-B1eOm8So.js";import{n as g,t as _}from"./dist-BxNp_DKL.js";import{i as v,n as y}from"./story-section-DVTm6cGm.js";import{r as b,t as x}from"./lib-CZRp1gG1.js";import{n as S,t as C}from"./badge-BnbeGwIF.js";import{n as w,t as T}from"./skeleton-CYetxZ-F.js";function E({className:e,children:t,...n}){return(0,D.jsx)(`div`,{className:s(`mx-auto`,e),...n,children:t})}var D;function O(){return(O=e((()=>{o(),D=t(),E.__docgenInfo={description:``,methods:[],displayName:`Container`}})))()}function k({title:e,badges:t,buttons:n,previousPageUrl:o,statuses:c,description:u,isLoading:f=!0,variant:m}){let h=j({variant:m});return f?(0,A.jsx)(`div`,{className:h.container(),children:(0,A.jsx)(E,{children:(0,A.jsx)(`div`,{className:`flex flex-col gap-4 pt-4 px-6`,children:(0,A.jsx)(T,{className:`w-96 h-8`})})})}):(0,A.jsx)(`div`,{className:h.container(),children:(0,A.jsx)(E,{children:(0,A.jsx)(`div`,{className:`flex flex-col gap-4 pt-4 px-6`,children:(0,A.jsxs)(`div`,{className:`flex justify-between`,children:[(0,A.jsxs)(`div`,{className:s(`flex flex-col`,{"gap-3":!!u}),children:[(0,A.jsxs)(`div`,{className:`flex items-center gap-4 flex-wrap`,children:[o&&(0,A.jsx)(d,{href:o,children:(0,A.jsx)(l,{size:20})}),(0,A.jsx)(`h1`,{className:`text-2xl font-bold max-w-md text-ellipsis overflow-hidden whitespace-nowrap`,children:e}),(0,A.jsx)(`div`,{className:`flex items-center gap-2`,children:(t??[]).map((e,t)=>{let{tooltipText:n,...o}=e;return n?(0,A.jsxs)(a,{children:[(0,A.jsx)(r,{children:(0,A.jsx)(C,{...o})}),(0,A.jsx)(i,{children:n})]},t):(0,A.jsx)(C,{...o},t)})})]}),(0,A.jsx)(`h2`,{className:`text-sm text-muted-foreground`,children:u})]}),(0,A.jsxs)(`div`,{className:`flex items-center gap-2`,children:[c&&c.length>0&&c.map((e,t)=>(0,A.jsx)(`div`,{children:e},t)),n&&n.length>0&&n.map((e,t)=>(0,A.jsx)(p,{...e},e.key??t))]})]})})})})}var A,j;function M(){return(M=e((()=>{c(),_(),S(),f(),w(),n(),o(),O(),u(),A=t(),j=g({slots:{container:`bg-background`},variants:{variant:{navigation:{container:``},info:{container:`border-b pb-4`}}},defaultVariants:{variant:`navigation`}}),k.__docgenInfo={description:``,methods:[],displayName:`HeaderNavigation`,props:{isLoading:{required:!1,tsType:{name:`boolean`},description:``,defaultValue:{value:`true`,computed:!1}},badges:{required:!1,tsType:{name:`Array`,elements:[{name:`intersection`,raw:`BadgeProps & { tooltipText?: string }`,elements:[{name:`BadgeProps`},{name:`signature`,type:`object`,raw:`{ tooltipText?: string }`,signature:{properties:[{key:`tooltipText`,value:{name:`string`,required:!1}}]}}]}],raw:`HeaderNavigationBadge[]`},description:``},buttons:{required:!1,tsType:{name:`Array`,elements:[{name:`ButtonProps`}],raw:`ButtonProps[]`},description:``},statuses:{required:!1,tsType:{name:`Array`,elements:[{name:`ReactNode`}],raw:`ReactNode[]`},description:``},title:{required:!1,tsType:{name:`string`},description:``},description:{required:!1,tsType:{name:`string`},description:``},previousPageUrl:{required:!1,tsType:{name:`string`},description:``}},composes:[`VariantProps`]}})))()}var N,P,F,I,L;function R(){return(R=e((()=>{b(),m(),M(),v(),N=t(),P={title:`Layout/Header navigation`,component:k,args:{}},F={args:{},render:()=>(0,N.jsx)(y,{title:`Loading`,children:(0,N.jsx)(`div`,{className:`w-full`,children:(0,N.jsx)(k,{})})})},I={args:{isLoading:!1,title:`Title`,badges:[{variant:`secondary`,children:(0,N.jsxs)(N.Fragment,{children:[(0,N.jsx)(h,{}),`Icon`]})},{variant:`outline`,children:(0,N.jsx)(N.Fragment,{children:`outline`})}],buttons:[{children:`primary`},{variant:`secondary`,children:`Secondary`}],description:`Optional description text…`},render:e=>(0,N.jsx)(y,{title:`Default`,children:(0,N.jsx)(x,{children:(0,N.jsx)(`div`,{className:`w-full`,children:(0,N.jsx)(k,{...e})})})})},F.parameters={...F.parameters,docs:{...F.parameters?.docs,source:{originalSource:`{
  args: {},
  render: () => <StorySection title="Loading">
      <div className="w-full">
        <HeaderNavigation />
      </div>
    </StorySection>
}`,...F.parameters?.docs?.source}}},I.parameters={...I.parameters,docs:{...I.parameters?.docs,source:{originalSource:`{
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
}`,...I.parameters?.docs?.source}}},L=[`Loading`,`Default`]})))()}R();export{I as Default,F as Loading,L as __namedExportsOrder,P as default};