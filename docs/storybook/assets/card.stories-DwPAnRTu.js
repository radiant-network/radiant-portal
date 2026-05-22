import{j as e}from"./iframe-DZxGQyD0.js";import{B as l}from"./button-1W1d7xAn.js";import{C as d,a as m,b as n,c as p,d as x,e as u}from"./card-Dui-VUUm.js";import{I as j}from"./input-DOSbHBHI.js";import{L as s}from"./label-BW_LS4F4.js";import{S as f,a as h,b as C,c as v,d as a}from"./select-4JYIN6an.js";import"./preload-helper-Dp1pzeXC.js";import"./index-Busr1vTm.js";import"./action-button-tMYSlpGq.js";import"./dropdown-menu-LRGitqO-.js";import"./index-Do7m-0ZR.js";import"./index-B5XFpENV.js";import"./check-CYxpBnf-.js";import"./circle-CNziIkuH.js";import"./separator-DW3ZXT-L.js";import"./i18n-C2h1o0aw.js";import"./index-DRBuaod2.js";import"./chevron-down-DjUkaEXt.js";import"./chevron-up-B0RMPqcs.js";const _={title:"Cards/Card",component:d,args:{}},t={args:{},render:()=>e.jsx("div",{className:"flex flex-col gap-6",children:["default","sm"].map(r=>e.jsxs(d,{size:r,className:"w-[350px]",children:[e.jsxs(m,{size:r,children:[e.jsxs(n,{children:["Card ",e.jsxs("span",{className:"bold uppercase",children:["(",r,")"]})]}),e.jsx(p,{children:"Deploy your new project in one-click."})]}),e.jsx(x,{size:r,children:e.jsx("form",{children:e.jsxs("div",{className:"grid w-full items-center gap-4",children:[e.jsxs("div",{className:"flex flex-col space-y-1.5",children:[e.jsx(s,{htmlFor:"name",children:"Name"}),e.jsx(j,{id:"name",placeholder:"Name of your project"})]}),e.jsxs("div",{className:"flex flex-col space-y-1.5",children:[e.jsx(s,{htmlFor:"framework",children:"Framework"}),e.jsxs(f,{children:[e.jsx(h,{id:"framework",children:e.jsx(C,{placeholder:"Select"})}),e.jsxs(v,{position:"popper",children:[e.jsx(a,{value:"next",children:"Next.js"}),e.jsx(a,{value:"sveltekit",children:"SvelteKit"}),e.jsx(a,{value:"astro",children:"Astro"}),e.jsx(a,{value:"nuxt",children:"Nuxt.js"})]})]})]})]})})}),e.jsxs(u,{size:r,children:[e.jsx(l,{variant:"outline",children:"Cancel"}),e.jsx(l,{color:"primary",children:"Deploy"})]})]},r))})};var o,c,i;t.parameters={...t.parameters,docs:{...(o=t.parameters)==null?void 0:o.docs,source:{originalSource:`{
  args: {},
  render: () => <div className="flex flex-col gap-6">
      {['default', 'sm'].map(size => <Card key={size} size={size} className="w-[350px]">
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
