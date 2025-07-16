import{j as e}from"./jsx-runtime-D_zvdyIk.js";import{B as a}from"./button-fL1Y6ivG.js";import{C as i,a as c,b as m,c as p,d,e as x}from"./card-wOWy4WmG.js";import{I as u}from"./input-DyY2UfVx.js";import{L as o}from"./label-BwU4_qxe.js";import{S as j,a as f,b as C,c as h,d as r}from"./select-CBLAvfYe.js";import"./index-b4Krvw3J.js";import"./index-DQLiH3RP.js";import"./index-CECE1b4A.js";import"./index-CJPVTaBz.js";import"./ActionButton-yaQJeqfP.js";import"./dropdown-menu-5z4VmTsG.js";import"./index-DZeBqZZX.js";import"./index-CKWZTibS.js";import"./index-CS2et-gJ.js";import"./index-BlJj-Uol.js";import"./utils-D-KgF5mV.js";import"./check-DSCf8CVO.js";import"./createLucideIcon-BMP5cxO1.js";import"./button.variants-Czj0iLzG.js";import"./index-C66Dxnp2.js";import"./ellipsis-BtlAG3ey.js";import"./spinner-DHVcj7-u.js";import"./tooltip-2a7OmUZw.js";import"./i18n-BhHwX0en.js";import"./iframe-CqmbLTdq.js";import"./index-DDGWSPzp.js";import"./chevron-down-QEmn0_AS.js";const Q={title:"Data Display/Card",component:i,args:{}},t={args:{},render:()=>e.jsxs(i,{className:"w-[350px]",children:[e.jsxs(c,{children:[e.jsx(m,{children:"Create project"}),e.jsx(p,{children:"Deploy your new project in one-click."})]}),e.jsx(d,{children:e.jsx("form",{children:e.jsxs("div",{className:"grid w-full items-center gap-4",children:[e.jsxs("div",{className:"flex flex-col space-y-1.5",children:[e.jsx(o,{htmlFor:"name",children:"Name"}),e.jsx(u,{id:"name",placeholder:"Name of your project"})]}),e.jsxs("div",{className:"flex flex-col space-y-1.5",children:[e.jsx(o,{htmlFor:"framework",children:"Framework"}),e.jsxs(j,{children:[e.jsx(f,{id:"framework",children:e.jsx(C,{placeholder:"Select"})}),e.jsxs(h,{position:"popper",children:[e.jsx(r,{value:"next",children:"Next.js"}),e.jsx(r,{value:"sveltekit",children:"SvelteKit"}),e.jsx(r,{value:"astro",children:"Astro"}),e.jsx(r,{value:"nuxt",children:"Nuxt.js"})]})]})]})]})})}),e.jsxs(x,{className:"flex justify-between",children:[e.jsx(a,{variant:"outline",children:"Cancel"}),e.jsx(a,{color:"primary",children:"Deploy"})]})]})};var l,n,s;t.parameters={...t.parameters,docs:{...(l=t.parameters)==null?void 0:l.docs,source:{originalSource:`{
  args: {},
  render: () => <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Create project</CardTitle>
        <CardDescription>Deploy your new project in one-click.</CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="name">Name</Label>
              <Input id="name" placeholder="Name of your project" />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="framework">Framework</Label>
              <Select>
                <SelectTrigger id="framework">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent position="popper">
                  <SelectItem value="next">Next.js</SelectItem>
                  <SelectItem value="sveltekit">SvelteKit</SelectItem>
                  <SelectItem value="astro">Astro</SelectItem>
                  <SelectItem value="nuxt">Nuxt.js</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline">Cancel</Button>
        <Button color="primary">Deploy</Button>
      </CardFooter>
    </Card>
}`,...(s=(n=t.parameters)==null?void 0:n.docs)==null?void 0:s.source}}};const U=["Default"];export{t as Default,U as __namedExportsOrder,Q as default};
