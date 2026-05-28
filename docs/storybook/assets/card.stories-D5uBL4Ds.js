import{j as e}from"./iframe-g_rM03WD.js";import{B as l}from"./button-DyjUiMpD.js";import{C as d,a as m,b as n,c as p,d as x,e as u}from"./card-f1mkc5wR.js";import{I as j}from"./input-DFCLJf90.js";import{L as s}from"./label-CbDGEezo.js";import{S as f,a as h,b as C,c as v,d as a}from"./select-Bvz1jMCZ.js";import"./preload-helper-Dp1pzeXC.js";import"./index-C5nHNu5V.js";import"./action-button-firnxveF.js";import"./dropdown-menu-C8dl2V8Q.js";import"./index-B4C9r0pW.js";import"./index-CiJ_Won9.js";import"./check-Cn-MPm-h.js";import"./circle-CWj6cztr.js";import"./separator-0OwIr9F3.js";import"./i18n-A89o1_Ry.js";import"./index-BFdcfXZc.js";import"./chevron-down-BVdbVXtR.js";import"./chevron-up-KfOk2Dl2.js";const _={title:"Cards/Card",component:d,args:{}},t={args:{},render:()=>e.jsx("div",{className:"flex flex-col gap-6",children:["default","sm"].map(r=>e.jsxs(d,{size:r,className:"w-[350px]",children:[e.jsxs(m,{size:r,children:[e.jsxs(n,{children:["Card ",e.jsxs("span",{className:"bold uppercase",children:["(",r,")"]})]}),e.jsx(p,{children:"Deploy your new project in one-click."})]}),e.jsx(x,{size:r,children:e.jsx("form",{children:e.jsxs("div",{className:"grid w-full items-center gap-4",children:[e.jsxs("div",{className:"flex flex-col space-y-1.5",children:[e.jsx(s,{htmlFor:"name",children:"Name"}),e.jsx(j,{id:"name",placeholder:"Name of your project"})]}),e.jsxs("div",{className:"flex flex-col space-y-1.5",children:[e.jsx(s,{htmlFor:"framework",children:"Framework"}),e.jsxs(f,{children:[e.jsx(h,{id:"framework",children:e.jsx(C,{placeholder:"Select"})}),e.jsxs(v,{position:"popper",children:[e.jsx(a,{value:"next",children:"Next.js"}),e.jsx(a,{value:"sveltekit",children:"SvelteKit"}),e.jsx(a,{value:"astro",children:"Astro"}),e.jsx(a,{value:"nuxt",children:"Nuxt.js"})]})]})]})]})})}),e.jsxs(u,{size:r,children:[e.jsx(l,{variant:"outline",children:"Cancel"}),e.jsx(l,{color:"primary",children:"Deploy"})]})]},r))})};var o,c,i;t.parameters={...t.parameters,docs:{...(o=t.parameters)==null?void 0:o.docs,source:{originalSource:`{
  args: {},
  render: () => <div className="flex flex-col gap-6">
      {(['default', 'sm'] as const).map(size => <Card key={size} size={size} className="w-[350px]">
          <CardHeader size={size}>
            <CardTitle>
              Card <span className="bold uppercase">({size})</span>
            </CardTitle>
            <CardDescription>Deploy your new project in one-click.</CardDescription>
          </CardHeader>
          <CardContent size={size}>
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
          <CardFooter size={size}>
            <Button variant="outline">Cancel</Button>
            <Button color="primary">Deploy</Button>
          </CardFooter>
        </Card>)}
    </div>
}`,...(i=(c=t.parameters)==null?void 0:c.docs)==null?void 0:i.source}}};const O=["Default"];export{t as Default,O as __namedExportsOrder,_ as default};
