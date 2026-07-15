import{j as e}from"./iframe-BJ0KBJU7.js";import{B as l}from"./button-DFGR7V5l.js";import{C as o,a as i,b as c,c as n,d as m,e as d}from"./card-DYy5Xp3_.js";import{I as p}from"./input-B9PMAus_.js";import{L as s}from"./label-DRF3oeBn.js";import{S as x,a as u,b as j,c as f,d as t}from"./select-DBbNWz04.js";import{a as h}from"./story-section-BU2eJCi3.js";import"./preload-helper-PPVm8Dsz.js";import"./action-button-C928MkJM.js";import"./dropdown-menu-D5WDI4zP.js";import"./index-DfueDfU3.js";import"./index-DjBvZjcf.js";import"./check-Dg29415_.js";import"./circle-B1ny9b-U.js";import"./separator-CKp5KkZQ.js";import"./i18n-DmjSHWrQ.js";import"./index-B78TygC3.js";import"./index-CaZkY5dK.js";import"./chevron-down-qfXDwytH.js";import"./chevron-up-fZE14ZCf.js";const K={title:"Components/Cards/Card",component:o,args:{}},a={args:{},render:()=>e.jsx(h,{title:"Variant",children:e.jsx("div",{className:"flex flex-col gap-6",children:["default","sm"].map(r=>e.jsxs(o,{size:r,className:"w-[350px]",children:[e.jsxs(i,{size:r,children:[e.jsxs(c,{children:["Card ",e.jsxs("span",{className:"bold uppercase",children:["(",r,")"]})]}),e.jsx(n,{children:"Deploy your new project in one-click."})]}),e.jsx(m,{size:r,children:e.jsx("form",{children:e.jsxs("div",{className:"grid w-full items-center gap-4",children:[e.jsxs("div",{className:"flex flex-col space-y-1.5",children:[e.jsx(s,{htmlFor:"name",children:"Name"}),e.jsx(p,{id:"name",placeholder:"Name of your project"})]}),e.jsxs("div",{className:"flex flex-col space-y-1.5",children:[e.jsx(s,{htmlFor:"framework",children:"Framework"}),e.jsxs(x,{children:[e.jsx(u,{id:"framework",children:e.jsx(j,{placeholder:"Select"})}),e.jsxs(f,{position:"popper",children:[e.jsx(t,{value:"next",children:"Next.js"}),e.jsx(t,{value:"sveltekit",children:"SvelteKit"}),e.jsx(t,{value:"astro",children:"Astro"}),e.jsx(t,{value:"nuxt",children:"Nuxt.js"})]})]})]})]})})}),e.jsxs(d,{size:r,children:[e.jsx(l,{variant:"outline",children:"Cancel"}),e.jsx(l,{color:"primary",children:"Deploy"})]})]},r))})})};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
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
