import{j as e}from"./iframe-C3tvUR1J.js";import{B as l}from"./button-DBxIrY1M.js";import{C as o,a as i,b as c,c as n,d as m,e as d}from"./card-COsSMpki.js";import{I as p}from"./input-CaIta0Ot.js";import{L as s}from"./label-BAA81ssV.js";import{S as x,a as u,b as j,c as f,d as t}from"./select-CexQazZ-.js";import{a as h}from"./story-section-Cml820jU.js";import"./preload-helper-PPVm8Dsz.js";import"./index-wNbfclQ1.js";import"./action-button-BNzMztdM.js";import"./dropdown-menu-6SkrUZiL.js";import"./index-B_di4gWb.js";import"./index-BQlRfD1v.js";import"./check-Cewv9fI2.js";import"./circle-B5BEDuQC.js";import"./separator-DYKEDePW.js";import"./i18n-sXy_IXHd.js";import"./index-COGJCRuB.js";import"./index-t1n2C8Aq.js";import"./index-BnzHzloH.js";import"./chevron-down-D-F92SRE.js";import"./chevron-up-8kpNgi0N.js";const O={title:"Components/Cards/Card",component:o,args:{}},a={args:{},render:()=>e.jsx(h,{title:"Variant",children:e.jsx("div",{className:"flex flex-col gap-6",children:["default","sm"].map(r=>e.jsxs(o,{size:r,className:"w-[350px]",children:[e.jsxs(i,{size:r,children:[e.jsxs(c,{children:["Card ",e.jsxs("span",{className:"bold uppercase",children:["(",r,")"]})]}),e.jsx(n,{children:"Deploy your new project in one-click."})]}),e.jsx(m,{size:r,children:e.jsx("form",{children:e.jsxs("div",{className:"grid w-full items-center gap-4",children:[e.jsxs("div",{className:"flex flex-col space-y-1.5",children:[e.jsx(s,{htmlFor:"name",children:"Name"}),e.jsx(p,{id:"name",placeholder:"Name of your project"})]}),e.jsxs("div",{className:"flex flex-col space-y-1.5",children:[e.jsx(s,{htmlFor:"framework",children:"Framework"}),e.jsxs(x,{children:[e.jsx(u,{id:"framework",children:e.jsx(j,{placeholder:"Select"})}),e.jsxs(f,{position:"popper",children:[e.jsx(t,{value:"next",children:"Next.js"}),e.jsx(t,{value:"sveltekit",children:"SvelteKit"}),e.jsx(t,{value:"astro",children:"Astro"}),e.jsx(t,{value:"nuxt",children:"Nuxt.js"})]})]})]})]})})}),e.jsxs(d,{size:r,children:[e.jsx(l,{variant:"outline",children:"Cancel"}),e.jsx(l,{color:"primary",children:"Deploy"})]})]},r))})})};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
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
}`,...a.parameters?.docs?.source}}};const R=["Variant"];export{a as Variant,R as __namedExportsOrder,O as default};
