import{j as e}from"./iframe-BOkj70l8.js";import{B as l}from"./button-tn5oIYKb.js";import{C as o,a as i,b as c,c as n,d as m,e as d}from"./card-DT4VhHcK.js";import{I as p}from"./input-NnRsrRSq.js";import{L as s}from"./label-0Y6SZoH6.js";import{S as x,a as u,b as j,c as f,d as t}from"./select-CQpSPxiC.js";import{a as h}from"./story-section-DQYgi0mB.js";import"./preload-helper-PPVm8Dsz.js";import"./action-button-CeXyayKt.js";import"./dropdown-menu-CQVY1paU.js";import"./index-CTJyEr6n.js";import"./index-fVILgqWX.js";import"./check-DI71rXD4.js";import"./circle-BIlPbk8H.js";import"./separator-MMk7clR0.js";import"./i18n-C0VA3Pzj.js";import"./index-BiVUSCho.js";import"./index-A2SqbsTG.js";import"./chevron-down-DWw7bU01.js";import"./chevron-up-BsEiHGO1.js";const K={title:"Components/Cards/Card",component:o,args:{}},a={args:{},render:()=>e.jsx(h,{title:"Variant",children:e.jsx("div",{className:"flex flex-col gap-6",children:["default","sm"].map(r=>e.jsxs(o,{size:r,className:"w-[350px]",children:[e.jsxs(i,{size:r,children:[e.jsxs(c,{children:["Card ",e.jsxs("span",{className:"bold uppercase",children:["(",r,")"]})]}),e.jsx(n,{children:"Deploy your new project in one-click."})]}),e.jsx(m,{size:r,children:e.jsx("form",{children:e.jsxs("div",{className:"grid w-full items-center gap-4",children:[e.jsxs("div",{className:"flex flex-col space-y-1.5",children:[e.jsx(s,{htmlFor:"name",children:"Name"}),e.jsx(p,{id:"name",placeholder:"Name of your project"})]}),e.jsxs("div",{className:"flex flex-col space-y-1.5",children:[e.jsx(s,{htmlFor:"framework",children:"Framework"}),e.jsxs(x,{children:[e.jsx(u,{id:"framework",children:e.jsx(j,{placeholder:"Select"})}),e.jsxs(f,{position:"popper",children:[e.jsx(t,{value:"next",children:"Next.js"}),e.jsx(t,{value:"sveltekit",children:"SvelteKit"}),e.jsx(t,{value:"astro",children:"Astro"}),e.jsx(t,{value:"nuxt",children:"Nuxt.js"})]})]})]})]})})}),e.jsxs(d,{size:r,children:[e.jsx(l,{variant:"outline",children:"Cancel"}),e.jsx(l,{color:"primary",children:"Deploy"})]})]},r))})})};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
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
