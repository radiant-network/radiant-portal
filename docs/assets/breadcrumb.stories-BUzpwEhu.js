import{j as e}from"./jsx-runtime-D_zvdyIk.js";import{S as g}from"./index-D-AYaadb.js";import{c as s}from"./utils-D-KgF5mV.js";import{C as f}from"./chevron-right--l3G0NFC.js";import{E as j}from"./ellipsis-BtlAG3ey.js";import{D as N,a as I,b as w,c}from"./dropdown-menu-maOUzwaK.js";import"./index-DQLiH3RP.js";import"./index-CECE1b4A.js";import"./index-CJPVTaBz.js";import"./createLucideIcon-BMP5cxO1.js";import"./index-Bf9LPmYV.js";import"./index-DD7n3F2b.js";import"./index-Bx8PXznd.js";import"./index-C5A_jyAq.js";import"./check-DSCf8CVO.js";function d({...r}){return e.jsx("nav",{"aria-label":"breadcrumb",...r})}d.displayName="Breadcrumb";function p({className:r,...a}){return e.jsx("ol",{className:s("flex flex-wrap items-center gap-1.5 break-words text-sm text-muted-foreground sm:gap-2.5",r),...a})}p.displayName="BreadcrumbList";function n({className:r,...a}){return e.jsx("li",{className:s("inline-flex items-center gap-1.5",r),...a})}n.displayName="BreadcrumbItem";function m({asChild:r,className:a,...i}){const h=r?g:"a";return e.jsx(h,{className:s("transition-colors hover:text-foreground",a),...i})}m.displayName="BreadcrumbLink";function u({className:r,...a}){return e.jsx("span",{role:"link","aria-disabled":"true","aria-current":"page",className:s("font-normal text-foreground",r),...a})}u.displayName="BreadcrumbPage";const o=({children:r,className:a,...i})=>e.jsx("li",{role:"presentation","aria-hidden":"true",className:s("[&>svg]:size-[15px]",a),...i,children:r??e.jsx(f,{})});o.displayName="BreadcrumbSeparator";const l=({className:r,...a})=>e.jsxs("span",{role:"presentation","aria-hidden":"true",className:s("flex h-9 w-9 items-center justify-center",r),...a,children:[e.jsx(j,{className:"h-4 w-4"}),e.jsx("span",{className:"sr-only",children:"More"})]});l.displayName="BreadcrumbElipssis";d.__docgenInfo={description:"",methods:[],displayName:"Breadcrumb",props:{separator:{required:!1,tsType:{name:"ReactReactNode",raw:"React.ReactNode"},description:""}}};p.__docgenInfo={description:"",methods:[],displayName:"BreadcrumbList"};n.__docgenInfo={description:"",methods:[],displayName:"BreadcrumbItem"};m.__docgenInfo={description:"",methods:[],displayName:"BreadcrumbLink",props:{asChild:{required:!1,tsType:{name:"boolean"},description:""}}};u.__docgenInfo={description:"",methods:[],displayName:"BreadcrumbPage"};o.__docgenInfo={description:"",methods:[],displayName:"BreadcrumbSeparator"};l.__docgenInfo={description:"",methods:[],displayName:"BreadcrumbElipssis"};const G={title:"Navigation/Breacrumb",component:d,args:{}},t={args:{},render:()=>e.jsx(d,{children:e.jsxs(p,{children:[e.jsx(n,{children:e.jsx(m,{href:"#",children:"Home"})}),e.jsx(o,{}),e.jsx(n,{children:e.jsxs(N,{children:[e.jsxs(I,{className:"flex items-center gap-1",children:[e.jsx(l,{className:"h-4 w-4"}),e.jsx("span",{className:"sr-only",children:"Toggle menu"})]}),e.jsxs(w,{align:"start",children:[e.jsx(c,{children:"Documentation"}),e.jsx(c,{children:"Themes"}),e.jsx(c,{children:"GitHub"})]})]})}),e.jsx(o,{}),e.jsx(n,{children:e.jsx(m,{href:"#",children:"Components 2"})}),e.jsx(o,{}),e.jsx(n,{children:e.jsx(u,{children:"Breadcrumb"})})]})})};var b,B,x;t.parameters={...t.parameters,docs:{...(b=t.parameters)==null?void 0:b.docs,source:{originalSource:`{
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
}`,...(x=(B=t.parameters)==null?void 0:B.docs)==null?void 0:x.source}}};const z=["Default"];export{t as Default,z as __namedExportsOrder,G as default};
