import{j as e}from"./iframe-CUHTCraV.js";import{B as l}from"./button-CZjHTKQy.js";import{C as o,a as i,b as c,c as n,d as m,e as d}from"./card-BwvmyX8o.js";import{I as p}from"./input-BF2Ib3mk.js";import{L as s}from"./label-DzikIB7o.js";import{S as x,a as u,b as j,c as f,d as t}from"./select-CWJZWBZH.js";import{a as h}from"./story-section-B5jupzCR.js";import"./preload-helper-PPVm8Dsz.js";import"./action-button-CdHWYpUk.js";import"./dropdown-menu-IpbMOAkX.js";import"./index-Cvvrdsfd.js";import"./index-Dd0IXZ1B.js";import"./check-DnkkXyPO.js";import"./circle-CpDNkknX.js";import"./separator-Cfebd5mI.js";import"./i18n-CvIos0gf.js";import"./index-DpmgubW-.js";import"./index-ArbR8u7G.js";import"./chevron-down-DM-5xFmE.js";import"./chevron-up-IK9k29LV.js";const K={title:"Components/Cards/Card",component:o,args:{}},a={args:{},render:()=>e.jsx(h,{title:"Variant",children:e.jsx("div",{className:"flex flex-col gap-6",children:["default","sm"].map(r=>e.jsxs(o,{size:r,className:"w-[350px]",children:[e.jsxs(i,{size:r,children:[e.jsxs(c,{children:["Card ",e.jsxs("span",{className:"bold uppercase",children:["(",r,")"]})]}),e.jsx(n,{children:"Deploy your new project in one-click."})]}),e.jsx(m,{size:r,children:e.jsx("form",{children:e.jsxs("div",{className:"grid w-full items-center gap-4",children:[e.jsxs("div",{className:"flex flex-col space-y-1.5",children:[e.jsx(s,{htmlFor:"name",children:"Name"}),e.jsx(p,{id:"name",placeholder:"Name of your project"})]}),e.jsxs("div",{className:"flex flex-col space-y-1.5",children:[e.jsx(s,{htmlFor:"framework",children:"Framework"}),e.jsxs(x,{children:[e.jsx(u,{id:"framework",children:e.jsx(j,{placeholder:"Select"})}),e.jsxs(f,{position:"popper",children:[e.jsx(t,{value:"next",children:"Next.js"}),e.jsx(t,{value:"sveltekit",children:"SvelteKit"}),e.jsx(t,{value:"astro",children:"Astro"}),e.jsx(t,{value:"nuxt",children:"Nuxt.js"})]})]})]})]})})}),e.jsxs(d,{size:r,children:[e.jsx(l,{variant:"outline",children:"Cancel"}),e.jsx(l,{color:"primary",children:"Deploy"})]})]},r))})})};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  args: {},
  render: () => <StorySection title="Variant">
      <div className="flex flex-col gap-6">
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
    </StorySection>
}`,...a.parameters?.docs?.source}}};const _=["Variant"];export{a as Variant,_ as __namedExportsOrder,K as default};
