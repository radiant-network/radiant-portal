import{j as e}from"./jsx-runtime-Cf8x2fCZ.js";import{B as a}from"./button-68tiabAR.js";import{C as i,a as c,b as m,c as p,d,e as x}from"./card-BJAsdJf1.js";import{I as u}from"./input-OUxWDfFO.js";import{L as o}from"./label-BX6-Aqla.js";import{S as j,a as f,b as C,c as h,d as r}from"./select-BJY3Gqqw.js";import"./index-yBjzXJbu.js";import"./index-tvICUrOf.js";import"./index-Csi1vtvD.js";import"./index-_r67kdfS.js";import"./index-fNjTmf9T.js";import"./ActionButton-B7qNdG6r.js";import"./dropdown-menu-It6xAzeJ.js";import"./index-CJn4dinJ.js";import"./Combination-e2pxAl-M.js";import"./index-D-y1Urua.js";import"./index-DJkr1wGX.js";import"./index-pLOVI5Ig.js";import"./utils-CytzSlOG.js";import"./check-CfPT3E_d.js";import"./createLucideIcon-DKFpjrVJ.js";import"./button.variants-B79LQKoe.js";import"./index-C66Dxnp2.js";import"./ellipsis-NIzCCAdy.js";import"./spinner-Bn71UZIB.js";import"./index-C1xbsqtW.js";import"./index-Bwb5bU54.js";import"./chevron-down-D97Dr_NX.js";const Q={title:"Data Display/Card",component:i,args:{}},t={args:{},render:()=>e.jsxs(i,{className:"w-[350px]",children:[e.jsxs(c,{children:[e.jsx(m,{children:"Create project"}),e.jsx(p,{children:"Deploy your new project in one-click."})]}),e.jsx(d,{children:e.jsx("form",{children:e.jsxs("div",{className:"grid w-full items-center gap-4",children:[e.jsxs("div",{className:"flex flex-col space-y-1.5",children:[e.jsx(o,{htmlFor:"name",children:"Name"}),e.jsx(u,{id:"name",placeholder:"Name of your project"})]}),e.jsxs("div",{className:"flex flex-col space-y-1.5",children:[e.jsx(o,{htmlFor:"framework",children:"Framework"}),e.jsxs(j,{children:[e.jsx(f,{id:"framework",children:e.jsx(C,{placeholder:"Select"})}),e.jsxs(h,{position:"popper",children:[e.jsx(r,{value:"next",children:"Next.js"}),e.jsx(r,{value:"sveltekit",children:"SvelteKit"}),e.jsx(r,{value:"astro",children:"Astro"}),e.jsx(r,{value:"nuxt",children:"Nuxt.js"})]})]})]})]})})}),e.jsxs(x,{className:"flex justify-between",children:[e.jsx(a,{variant:"outline",children:"Cancel"}),e.jsx(a,{color:"primary",children:"Deploy"})]})]})};var l,n,s;t.parameters={...t.parameters,docs:{...(l=t.parameters)==null?void 0:l.docs,source:{originalSource:`{
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
