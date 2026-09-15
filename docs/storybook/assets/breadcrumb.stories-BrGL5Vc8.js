import{n as e}from"./rolldown-runtime-C0FnF6B9.js";import{t}from"./react-BRh_h4kc.js";import{a as n,t as r}from"./dist-BjHnYScY.js";import{t as i}from"./jsx-runtime-BdxMnOeJ.js";import{a,d as o,f as s,r as c,t as l}from"./dropdown-menu-DzHOJ5Fy.js";import{n as u,t as d}from"./utils-hYbUpBR2.js";import{n as f,t as p}from"./chevron-right-BjDxPntq.js";import{n as m,t as h}from"./ellipsis-B1Ek9gsB.js";import{n as g,t as _}from"./i18n-87HgNCfy.js";import{i as v,n as y}from"./story-section-DVTm6cGm.js";function b({...e}){return(0,T.jsx)(`nav`,{"aria-label":`breadcrumb`,...e})}function x({className:e,...t}){return(0,T.jsx)(`ol`,{className:d(`flex flex-wrap items-center gap-1.5 break-words text-sm text-muted-foreground sm:gap-2.5`,e),...t})}function S({className:e,...t}){return(0,T.jsx)(`li`,{className:d(`inline-flex items-center gap-1.5`,e),...t})}function C({asChild:e,className:t,...n}){return(0,T.jsx)(e?r:`a`,{className:d(`transition-colors hover:text-foreground`,t),...n})}function w({className:e,...t}){return(0,T.jsx)(`span`,{role:`link`,"aria-disabled":`true`,"aria-current":`page`,className:d(`font-normal text-foreground`,e),...t})}var T,E,D;function O(){return(O=e((()=>{t(),n(),f(),m(),_(),u(),T=i(),b.displayName=`Breadcrumb`,x.displayName=`BreadcrumbList`,S.displayName=`BreadcrumbItem`,C.displayName=`BreadcrumbLink`,w.displayName=`BreadcrumbPage`,E=({children:e,className:t,...n})=>(0,T.jsx)(`li`,{role:`presentation`,"aria-hidden":`true`,className:d(`[&>svg]:size-[15px]`,t),...n,children:e??(0,T.jsx)(p,{})}),E.displayName=`BreadcrumbSeparator`,D=({className:e,...t})=>{let{t:n}=g();return(0,T.jsxs)(`span`,{role:`presentation`,"aria-hidden":`true`,className:d(`flex h-9 w-9 items-center justify-center`,e),...t,children:[(0,T.jsx)(h,{className:`h-4 w-4`}),(0,T.jsx)(`span`,{className:`sr-only`,children:n(`a11y.breadcrumb.more`)})]})},D.displayName=`BreadcrumbElipssis`,b.__docgenInfo={description:``,methods:[],displayName:`Breadcrumb`,props:{separator:{required:!1,tsType:{name:`ReactReactNode`,raw:`React.ReactNode`},description:``}}},x.__docgenInfo={description:``,methods:[],displayName:`BreadcrumbList`},S.__docgenInfo={description:``,methods:[],displayName:`BreadcrumbItem`},C.__docgenInfo={description:``,methods:[],displayName:`BreadcrumbLink`,props:{asChild:{required:!1,tsType:{name:`boolean`},description:``}}},w.__docgenInfo={description:``,methods:[],displayName:`BreadcrumbPage`},E.__docgenInfo={description:``,methods:[],displayName:`BreadcrumbSeparator`},D.__docgenInfo={description:``,methods:[],displayName:`BreadcrumbElipssis`}})))()}var k,A,j,M;function N(){return(N=e((()=>{O(),s(),v(),k=i(),A={title:`Layout/Breadcrumb`,component:b,args:{}},j={args:{},render:()=>(0,k.jsx)(y,{title:`Default`,children:(0,k.jsx)(b,{children:(0,k.jsxs)(x,{children:[(0,k.jsx)(S,{children:(0,k.jsx)(C,{href:`#`,children:`Home`})}),(0,k.jsx)(E,{}),(0,k.jsx)(S,{children:(0,k.jsxs)(l,{children:[(0,k.jsxs)(o,{className:`flex items-center gap-1`,children:[(0,k.jsx)(D,{className:`h-4 w-4`}),(0,k.jsx)(`span`,{className:`sr-only`,children:`Toggle menu`})]}),(0,k.jsxs)(c,{align:`start`,children:[(0,k.jsx)(a,{children:`Documentation`}),(0,k.jsx)(a,{children:`Themes`}),(0,k.jsx)(a,{children:`GitHub`})]})]})}),(0,k.jsx)(E,{}),(0,k.jsx)(S,{children:(0,k.jsx)(C,{href:`#`,children:`Components 2`})}),(0,k.jsx)(E,{}),(0,k.jsx)(S,{children:(0,k.jsx)(w,{children:`Breadcrumb`})})]})})})},j.parameters={...j.parameters,docs:{...j.parameters?.docs,source:{originalSource:`{
  args: {},
  render: () => <StorySection title="Default">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="#">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1">
                <BreadcrumbEllipsis className="h-4 w-4" />
                <span className="sr-only">Toggle menu</span>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuItem>Documentation</DropdownMenuItem>
                <DropdownMenuItem>Themes</DropdownMenuItem>
                <DropdownMenuItem>GitHub</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="#">Components 2</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Breadcrumb</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </StorySection>
}`,...j.parameters?.docs?.source}}},M=[`Default`]})))()}N();export{j as Default,M as __namedExportsOrder,A as default};