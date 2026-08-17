import{j as e,c as s,S as x}from"./iframe-D7ER49TR.js";import{u as B}from"./i18n-D0rznIQh.js";import{C as h}from"./chevron-right-BqeK5SHb.js";import{E as f}from"./ellipsis-l8HX8mgV.js";import{D as g,a as j,b as N,c as i}from"./dropdown-menu-DgcnzvDN.js";import{a as I}from"./story-section-T7092GL1.js";import"./preload-helper-PPVm8Dsz.js";import"./index-oucxxOkI.js";import"./index-B6dqpAEy.js";import"./index-Dud_FKwN.js";import"./check-Dm7HKO46.js";import"./circle-CgC-JePX.js";function c({...r}){return e.jsx("nav",{"aria-label":"breadcrumb",...r})}c.displayName="Breadcrumb";function u({className:r,...a}){return e.jsx("ol",{className:s("flex flex-wrap items-center gap-1.5 break-words text-sm text-muted-foreground sm:gap-2.5",r),...a})}u.displayName="BreadcrumbList";function n({className:r,...a}){return e.jsx("li",{className:s("inline-flex items-center gap-1.5",r),...a})}n.displayName="BreadcrumbItem";function d({asChild:r,className:a,...o}){const b=r?x:"a";return e.jsx(b,{className:s("transition-colors hover:text-foreground",a),...o})}d.displayName="BreadcrumbLink";function l({className:r,...a}){return e.jsx("span",{role:"link","aria-disabled":"true","aria-current":"page",className:s("font-normal text-foreground",r),...a})}l.displayName="BreadcrumbPage";const t=({children:r,className:a,...o})=>e.jsx("li",{role:"presentation","aria-hidden":"true",className:s("[&>svg]:size-[15px]",a),...o,children:r??e.jsx(h,{})});t.displayName="BreadcrumbSeparator";const p=({className:r,...a})=>{const{t:o}=B();return e.jsxs("span",{role:"presentation","aria-hidden":"true",className:s("flex h-9 w-9 items-center justify-center",r),...a,children:[e.jsx(f,{className:"h-4 w-4"}),e.jsx("span",{className:"sr-only",children:o("a11y.breadcrumb.more")})]})};p.displayName="BreadcrumbElipssis";c.__docgenInfo={description:"",methods:[],displayName:"Breadcrumb",props:{separator:{required:!1,tsType:{name:"ReactReactNode",raw:"React.ReactNode"},description:""}}};u.__docgenInfo={description:"",methods:[],displayName:"BreadcrumbList"};n.__docgenInfo={description:"",methods:[],displayName:"BreadcrumbItem"};d.__docgenInfo={description:"",methods:[],displayName:"BreadcrumbLink",props:{asChild:{required:!1,tsType:{name:"boolean"},description:""}}};l.__docgenInfo={description:"",methods:[],displayName:"BreadcrumbPage"};t.__docgenInfo={description:"",methods:[],displayName:"BreadcrumbSeparator"};p.__docgenInfo={description:"",methods:[],displayName:"BreadcrumbElipssis"};const P={title:"Layout/Breadcrumb",component:c,args:{}},m={args:{},render:()=>e.jsx(I,{title:"Default",children:e.jsx(c,{children:e.jsxs(u,{children:[e.jsx(n,{children:e.jsx(d,{href:"#",children:"Home"})}),e.jsx(t,{}),e.jsx(n,{children:e.jsxs(g,{children:[e.jsxs(j,{className:"flex items-center gap-1",children:[e.jsx(p,{className:"h-4 w-4"}),e.jsx("span",{className:"sr-only",children:"Toggle menu"})]}),e.jsxs(N,{align:"start",children:[e.jsx(i,{children:"Documentation"}),e.jsx(i,{children:"Themes"}),e.jsx(i,{children:"GitHub"})]})]})}),e.jsx(t,{}),e.jsx(n,{children:e.jsx(d,{href:"#",children:"Components 2"})}),e.jsx(t,{}),e.jsx(n,{children:e.jsx(l,{children:"Breadcrumb"})})]})})})};m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
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
}`,...m.parameters?.docs?.source}}};const v=["Default"];export{m as Default,v as __namedExportsOrder,P as default};
