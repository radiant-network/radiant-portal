import{j as e}from"./jsx-runtime-Cf8x2fCZ.js";import{r as m}from"./index-tvICUrOf.js";import{S as j}from"./index-DHoK6HQ1.js";import{c as o}from"./utils-BNf5BS2b.js";import{C as N,D as w,a as I,b as y,c as p}from"./dropdown-menu-Df-q2eXS.js";import{E as D}from"./ellipsis-NIzCCAdy.js";import"./index-yBjzXJbu.js";import"./index-_r67kdfS.js";import"./index-fNjTmf9T.js";import"./Combination-CHLpyrt-.js";import"./index-B7VY1_KI.js";import"./index-C-096Y_y.js";import"./createLucideIcon-DKFpjrVJ.js";const i=m.forwardRef(({...r},a)=>e.jsx("nav",{ref:a,"aria-label":"breadcrumb",...r}));i.displayName="Breadcrumb";const l=m.forwardRef(({className:r,...a},n)=>e.jsx("ol",{ref:n,className:o("flex flex-wrap items-center gap-1.5 break-words text-sm text-muted-foreground sm:gap-2.5",r),...a}));l.displayName="BreadcrumbList";const s=m.forwardRef(({className:r,...a},n)=>e.jsx("li",{ref:n,className:o("inline-flex items-center gap-1.5",r),...a}));s.displayName="BreadcrumbItem";const c=m.forwardRef(({asChild:r,className:a,...n},f)=>{const g=r?j:"a";return e.jsx(g,{ref:f,className:o("transition-colors hover:text-foreground",a),...n})});c.displayName="BreadcrumbLink";const u=m.forwardRef(({className:r,...a},n)=>e.jsx("span",{ref:n,role:"link","aria-disabled":"true","aria-current":"page",className:o("font-normal text-foreground",r),...a}));u.displayName="BreadcrumbPage";const t=({children:r,className:a,...n})=>e.jsx("li",{role:"presentation","aria-hidden":"true",className:o("[&>svg]:size-[15px]",a),...n,children:r??e.jsx(N,{})});t.displayName="BreadcrumbSeparator";const b=({className:r,...a})=>e.jsxs("span",{role:"presentation","aria-hidden":"true",className:o("flex h-9 w-9 items-center justify-center",r),...a,children:[e.jsx(D,{className:"h-4 w-4"}),e.jsx("span",{className:"sr-only",children:"More"})]});b.displayName="BreadcrumbElipssis";i.__docgenInfo={description:"",methods:[],displayName:"Breadcrumb",props:{separator:{required:!1,tsType:{name:"ReactReactNode",raw:"React.ReactNode"},description:""}}};l.__docgenInfo={description:"",methods:[],displayName:"BreadcrumbList"};s.__docgenInfo={description:"",methods:[],displayName:"BreadcrumbItem"};c.__docgenInfo={description:"",methods:[],displayName:"BreadcrumbLink",props:{asChild:{required:!1,tsType:{name:"boolean"},description:""}}};u.__docgenInfo={description:"",methods:[],displayName:"BreadcrumbPage"};t.__docgenInfo={description:"",methods:[],displayName:"BreadcrumbSeparator"};b.__docgenInfo={description:"",methods:[],displayName:"BreadcrumbElipssis"};const G={title:"Base/Navigation/Breacrumb",component:i,tags:["autodocs"],args:{}},d={args:{},render:()=>e.jsx(i,{children:e.jsxs(l,{children:[e.jsx(s,{children:e.jsx(c,{href:"#",children:"Home"})}),e.jsx(t,{}),e.jsx(s,{children:e.jsxs(w,{children:[e.jsxs(I,{className:"flex items-center gap-1",children:[e.jsx(b,{className:"h-4 w-4"}),e.jsx("span",{className:"sr-only",children:"Toggle menu"})]}),e.jsxs(y,{align:"start",children:[e.jsx(p,{children:"Documentation"}),e.jsx(p,{children:"Themes"}),e.jsx(p,{children:"GitHub"})]})]})}),e.jsx(t,{}),e.jsx(s,{children:e.jsx(c,{href:"#",children:"Components 2"})}),e.jsx(t,{}),e.jsx(s,{children:e.jsx(u,{children:"Breadcrumb"})})]})})};var B,x,h;d.parameters={...d.parameters,docs:{...(B=d.parameters)==null?void 0:B.docs,source:{originalSource:`{
  args: {},
  render: () => {
    return <Breadcrumb>
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
      </Breadcrumb>;
  }
}`,...(h=(x=d.parameters)==null?void 0:x.docs)==null?void 0:h.source}}};const V=["Variants"];export{d as Variants,V as __namedExportsOrder,G as default};
