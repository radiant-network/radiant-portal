import{j as e,c as s,S as x}from"./iframe-DUYxWSE4.js";import{C as B}from"./chevron-right-6OvOA_tb.js";import{E as h}from"./ellipsis-2bI1zpoe.js";import{D as f,a as g,b as j,c as i}from"./dropdown-menu-Dw6dDXhx.js";import{a as N}from"./story-section-BP93x530.js";import"./preload-helper-PPVm8Dsz.js";import"./index-d-V1lAha.js";import"./index-CIzFjBAZ.js";import"./check-CXWDQykU.js";import"./circle-CnzHj9YT.js";function d({...r}){return e.jsx("nav",{"aria-label":"breadcrumb",...r})}d.displayName="Breadcrumb";function u({className:r,...a}){return e.jsx("ol",{className:s("flex flex-wrap items-center gap-1.5 break-words text-sm text-muted-foreground sm:gap-2.5",r),...a})}u.displayName="BreadcrumbList";function n({className:r,...a}){return e.jsx("li",{className:s("inline-flex items-center gap-1.5",r),...a})}n.displayName="BreadcrumbItem";function m({asChild:r,className:a,...c}){const b=r?x:"a";return e.jsx(b,{className:s("transition-colors hover:text-foreground",a),...c})}m.displayName="BreadcrumbLink";function l({className:r,...a}){return e.jsx("span",{role:"link","aria-disabled":"true","aria-current":"page",className:s("font-normal text-foreground",r),...a})}l.displayName="BreadcrumbPage";const o=({children:r,className:a,...c})=>e.jsx("li",{role:"presentation","aria-hidden":"true",className:s("[&>svg]:size-[15px]",a),...c,children:r??e.jsx(B,{})});o.displayName="BreadcrumbSeparator";const p=({className:r,...a})=>e.jsxs("span",{role:"presentation","aria-hidden":"true",className:s("flex h-9 w-9 items-center justify-center",r),...a,children:[e.jsx(h,{className:"h-4 w-4"}),e.jsx("span",{className:"sr-only",children:"More"})]});p.displayName="BreadcrumbElipssis";d.__docgenInfo={description:"",methods:[],displayName:"Breadcrumb",props:{separator:{required:!1,tsType:{name:"ReactReactNode",raw:"React.ReactNode"},description:""}}};u.__docgenInfo={description:"",methods:[],displayName:"BreadcrumbList"};n.__docgenInfo={description:"",methods:[],displayName:"BreadcrumbItem"};m.__docgenInfo={description:"",methods:[],displayName:"BreadcrumbLink",props:{asChild:{required:!1,tsType:{name:"boolean"},description:""}}};l.__docgenInfo={description:"",methods:[],displayName:"BreadcrumbPage"};o.__docgenInfo={description:"",methods:[],displayName:"BreadcrumbSeparator"};p.__docgenInfo={description:"",methods:[],displayName:"BreadcrumbElipssis"};const T={title:"Layout/Breadcrumb",component:d,args:{}},t={args:{},render:()=>e.jsx(N,{title:"Default",children:e.jsx(d,{children:e.jsxs(u,{children:[e.jsx(n,{children:e.jsx(m,{href:"#",children:"Home"})}),e.jsx(o,{}),e.jsx(n,{children:e.jsxs(f,{children:[e.jsxs(g,{className:"flex items-center gap-1",children:[e.jsx(p,{className:"h-4 w-4"}),e.jsx("span",{className:"sr-only",children:"Toggle menu"})]}),e.jsxs(j,{align:"start",children:[e.jsx(i,{children:"Documentation"}),e.jsx(i,{children:"Themes"}),e.jsx(i,{children:"GitHub"})]})]})}),e.jsx(o,{}),e.jsx(n,{children:e.jsx(m,{href:"#",children:"Components 2"})}),e.jsx(o,{}),e.jsx(n,{children:e.jsx(l,{children:"Breadcrumb"})})]})})})};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
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
}`,...t.parameters?.docs?.source}}};const E=["Default"];export{t as Default,E as __namedExportsOrder,T as default};
