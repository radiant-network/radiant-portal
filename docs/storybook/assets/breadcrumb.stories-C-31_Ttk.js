import{j as e,c as s,as as x,u as B,ag as h,ah as g,aj as f,al as i}from"./iframe-CgZaKe5d.js";import{C as j}from"./chevron-right-HkdTfvnM.js";import{E as N}from"./ellipsis-ByFW0juB.js";import{a as I}from"./story-section-Cd-IQlgl.js";import"./preload-helper-PPVm8Dsz.js";function c({...r}){return e.jsx("nav",{"aria-label":"breadcrumb",...r})}c.displayName="Breadcrumb";function u({className:r,...a}){return e.jsx("ol",{className:s("flex flex-wrap items-center gap-1.5 break-words text-sm text-muted-foreground sm:gap-2.5",r),...a})}u.displayName="BreadcrumbList";function n({className:r,...a}){return e.jsx("li",{className:s("inline-flex items-center gap-1.5",r),...a})}n.displayName="BreadcrumbItem";function m({asChild:r,className:a,...o}){const b=r?x:"a";return e.jsx(b,{className:s("transition-colors hover:text-foreground",a),...o})}m.displayName="BreadcrumbLink";function l({className:r,...a}){return e.jsx("span",{role:"link","aria-disabled":"true","aria-current":"page",className:s("font-normal text-foreground",r),...a})}l.displayName="BreadcrumbPage";const t=({children:r,className:a,...o})=>e.jsx("li",{role:"presentation","aria-hidden":"true",className:s("[&>svg]:size-[15px]",a),...o,children:r??e.jsx(j,{})});t.displayName="BreadcrumbSeparator";const p=({className:r,...a})=>{const{t:o}=B();return e.jsxs("span",{role:"presentation","aria-hidden":"true",className:s("flex h-9 w-9 items-center justify-center",r),...a,children:[e.jsx(N,{className:"h-4 w-4"}),e.jsx("span",{className:"sr-only",children:o("a11y.breadcrumb.more")})]})};p.displayName="BreadcrumbElipssis";c.__docgenInfo={description:"",methods:[],displayName:"Breadcrumb",props:{separator:{required:!1,tsType:{name:"ReactReactNode",raw:"React.ReactNode"},description:""}}};u.__docgenInfo={description:"",methods:[],displayName:"BreadcrumbList"};n.__docgenInfo={description:"",methods:[],displayName:"BreadcrumbItem"};m.__docgenInfo={description:"",methods:[],displayName:"BreadcrumbLink",props:{asChild:{required:!1,tsType:{name:"boolean"},description:""}}};l.__docgenInfo={description:"",methods:[],displayName:"BreadcrumbPage"};t.__docgenInfo={description:"",methods:[],displayName:"BreadcrumbSeparator"};p.__docgenInfo={description:"",methods:[],displayName:"BreadcrumbElipssis"};const S={title:"Layout/Breadcrumb",component:c,args:{}},d={args:{},render:()=>e.jsx(I,{title:"Default",children:e.jsx(c,{children:e.jsxs(u,{children:[e.jsx(n,{children:e.jsx(m,{href:"#",children:"Home"})}),e.jsx(t,{}),e.jsx(n,{children:e.jsxs(h,{children:[e.jsxs(g,{className:"flex items-center gap-1",children:[e.jsx(p,{className:"h-4 w-4"}),e.jsx("span",{className:"sr-only",children:"Toggle menu"})]}),e.jsxs(f,{align:"start",children:[e.jsx(i,{children:"Documentation"}),e.jsx(i,{children:"Themes"}),e.jsx(i,{children:"GitHub"})]})]})}),e.jsx(t,{}),e.jsx(n,{children:e.jsx(m,{href:"#",children:"Components 2"})}),e.jsx(t,{}),e.jsx(n,{children:e.jsx(l,{children:"Breadcrumb"})})]})})})};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
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
}`,...d.parameters?.docs?.source}}};const L=["Default"];export{d as Default,L as __namedExportsOrder,S as default};
