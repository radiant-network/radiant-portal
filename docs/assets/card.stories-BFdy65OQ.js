import{j as e}from"./jsx-runtime-D_zvdyIk.js";import{B as a}from"./button-Hs0NxiJB.js";import{C as i,a as c,b as m,c as p,d,e as x}from"./card-D-bQbmQu.js";import{I as u}from"./input-W87A0CxH.js";import{L as l}from"./label-DpW8oBa6.js";import{S as j,a as f,b as C,c as h,d as r}from"./select-B3D9JJgq.js";import"./index-DSqg7KUl.js";import"./index-CTzypqlY.js";import"./index-8Ey6BpB7.js";import"./index-X_f_OX5J.js";import"./ActionButton-D_6N7jQy.js";import"./dropdown-menu-BAWNGxRC.js";import"./index-CqHHZPb-.js";import"./Combination-3tVHk2hX.js";import"./index-BFdFQidM.js";import"./index-Y7TeOx8d.js";import"./index-BEp8L1N2.js";import"./utils-bRKmu4jq.js";import"./check-BwCYBAs1.js";import"./createLucideIcon-j2ULFFRy.js";import"./button.variants-Bi9Y1jMV.js";import"./index-C66Dxnp2.js";import"./ellipsis-ClICah0q.js";import"./spinner-4Iyzy26w.js";import"./index-W4gAHHet.js";import"./index-DGfkHXcP.js";import"./chevron-down-Cg3zGEnG.js";const P={title:"Data Display/Card",component:i,args:{}},t={args:{},render:()=>e.jsxs(i,{className:"w-[350px]",children:[e.jsxs(c,{children:[e.jsx(m,{children:"Create project"}),e.jsx(p,{children:"Deploy your new project in one-click."})]}),e.jsx(d,{children:e.jsx("form",{children:e.jsxs("div",{className:"grid w-full items-center gap-4",children:[e.jsxs("div",{className:"flex flex-col space-y-1.5",children:[e.jsx(l,{htmlFor:"name",children:"Name"}),e.jsx(u,{id:"name",placeholder:"Name of your project"})]}),e.jsxs("div",{className:"flex flex-col space-y-1.5",children:[e.jsx(l,{htmlFor:"framework",children:"Framework"}),e.jsxs(j,{children:[e.jsx(f,{id:"framework",children:e.jsx(C,{placeholder:"Select"})}),e.jsxs(h,{position:"popper",children:[e.jsx(r,{value:"next",children:"Next.js"}),e.jsx(r,{value:"sveltekit",children:"SvelteKit"}),e.jsx(r,{value:"astro",children:"Astro"}),e.jsx(r,{value:"nuxt",children:"Nuxt.js"})]})]})]})]})})}),e.jsxs(x,{className:"flex justify-between",children:[e.jsx(a,{variant:"outline",children:"Cancel"}),e.jsx(a,{color:"primary",children:"Deploy"})]})]})};var o,n,s;t.parameters={...t.parameters,docs:{...(o=t.parameters)==null?void 0:o.docs,source:{originalSource:`{
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
}`,...(s=(n=t.parameters)==null?void 0:n.docs)==null?void 0:s.source}}};const Q=["Default"];export{t as Default,Q as __namedExportsOrder,P as default};
