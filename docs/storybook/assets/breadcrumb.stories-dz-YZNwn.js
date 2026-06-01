import{j as e,c as s}from"./iframe-CgYzld9M.js";import{S as B}from"./index-0Ui6iiVS.js";import{C as x}from"./chevron-right-DtnNy1M1.js";import{E as h}from"./ellipsis-DSqnSFWf.js";import{D as g,a as f,b as j,c as i}from"./dropdown-menu-CCEHsgQp.js";import"./preload-helper-PPVm8Dsz.js";import"./index-D5qyD-5a.js";import"./index-CPRKa62s.js";import"./check-DrnC7o8K.js";import"./circle-BJPs1Iry.js";function d({...r}){return e.jsx("nav",{"aria-label":"breadcrumb",...r})}d.displayName="Breadcrumb";function u({className:r,...a}){return e.jsx("ol",{className:s("flex flex-wrap items-center gap-1.5 break-words text-sm text-muted-foreground sm:gap-2.5",r),...a})}u.displayName="BreadcrumbList";function n({className:r,...a}){return e.jsx("li",{className:s("inline-flex items-center gap-1.5",r),...a})}n.displayName="BreadcrumbItem";function t({asChild:r,className:a,...c}){const b=r?B:"a";return e.jsx(b,{className:s("transition-colors hover:text-foreground",a),...c})}t.displayName="BreadcrumbLink";function p({className:r,...a}){return e.jsx("span",{role:"link","aria-disabled":"true","aria-current":"page",className:s("font-normal text-foreground",r),...a})}p.displayName="BreadcrumbPage";const o=({children:r,className:a,...c})=>e.jsx("li",{role:"presentation","aria-hidden":"true",className:s("[&>svg]:size-[15px]",a),...c,children:r??e.jsx(x,{})});o.displayName="BreadcrumbSeparator";const l=({className:r,...a})=>e.jsxs("span",{role:"presentation","aria-hidden":"true",className:s("flex h-9 w-9 items-center justify-center",r),...a,children:[e.jsx(h,{className:"h-4 w-4"}),e.jsx("span",{className:"sr-only",children:"More"})]});l.displayName="BreadcrumbElipssis";d.__docgenInfo={description:"",methods:[],displayName:"Breadcrumb",props:{separator:{required:!1,tsType:{name:"ReactReactNode",raw:"React.ReactNode"},description:""}}};u.__docgenInfo={description:"",methods:[],displayName:"BreadcrumbList"};n.__docgenInfo={description:"",methods:[],displayName:"BreadcrumbItem"};t.__docgenInfo={description:"",methods:[],displayName:"BreadcrumbLink",props:{asChild:{required:!1,tsType:{name:"boolean"},description:""}}};p.__docgenInfo={description:"",methods:[],displayName:"BreadcrumbPage"};o.__docgenInfo={description:"",methods:[],displayName:"BreadcrumbSeparator"};l.__docgenInfo={description:"",methods:[],displayName:"BreadcrumbElipssis"};const S={title:"Breadcrumbs/Breacrumb",component:d,args:{}},m={args:{},render:()=>e.jsx(d,{children:e.jsxs(u,{children:[e.jsx(n,{children:e.jsx(t,{href:"#",children:"Home"})}),e.jsx(o,{}),e.jsx(n,{children:e.jsxs(g,{children:[e.jsxs(f,{className:"flex items-center gap-1",children:[e.jsx(l,{className:"h-4 w-4"}),e.jsx("span",{className:"sr-only",children:"Toggle menu"})]}),e.jsxs(j,{align:"start",children:[e.jsx(i,{children:"Documentation"}),e.jsx(i,{children:"Themes"}),e.jsx(i,{children:"GitHub"})]})]})}),e.jsx(o,{}),e.jsx(n,{children:e.jsx(t,{href:"#",children:"Components 2"})}),e.jsx(o,{}),e.jsx(n,{children:e.jsx(p,{children:"Breadcrumb"})})]})})};m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  args: {},
  render: () => <Breadcrumb>
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
}`,...m.parameters?.docs?.source}}};const T=["Default"];export{m as Default,T as __namedExportsOrder,S as default};
