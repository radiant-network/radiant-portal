import{j as e}from"./iframe-D78160ma.js";import{B as l}from"./button-D31B_Gsf.js";import{C as o,a as i,b as c,c as n,d as m,e as d}from"./card-C-K4ns8X.js";import{I as p}from"./input-CR_iVGUi.js";import{L as s}from"./label-Li_1t0cO.js";import{S as x,a as u,b as j,c as f,d as t}from"./select-XTpFega2.js";import{a as h}from"./story-section-CJRHUJpZ.js";import"./preload-helper-PPVm8Dsz.js";import"./action-button-CXmwuvNv.js";import"./dropdown-menu-CFr9nLu7.js";import"./index-E6EEG8_q.js";import"./index-BJO3_Py_.js";import"./check-Dz-4uiGV.js";import"./circle-DO4DQqF4.js";import"./separator-C2Q6CsId.js";import"./i18n-BrjiU_bT.js";import"./index-BSsmB6Hv.js";import"./index-CHDJoLbi.js";import"./chevron-down-w59Cf0Xn.js";import"./chevron-up-DOrLK14z.js";const K={title:"Components/Cards/Card",component:o,args:{}},a={args:{},render:()=>e.jsx(h,{title:"Variant",children:e.jsx("div",{className:"flex flex-col gap-6",children:["default","sm"].map(r=>e.jsxs(o,{size:r,className:"w-[350px]",children:[e.jsxs(i,{size:r,children:[e.jsxs(c,{children:["Card ",e.jsxs("span",{className:"bold uppercase",children:["(",r,")"]})]}),e.jsx(n,{children:"Deploy your new project in one-click."})]}),e.jsx(m,{size:r,children:e.jsx("form",{children:e.jsxs("div",{className:"grid w-full items-center gap-4",children:[e.jsxs("div",{className:"flex flex-col space-y-1.5",children:[e.jsx(s,{htmlFor:"name",children:"Name"}),e.jsx(p,{id:"name",placeholder:"Name of your project"})]}),e.jsxs("div",{className:"flex flex-col space-y-1.5",children:[e.jsx(s,{htmlFor:"framework",children:"Framework"}),e.jsxs(x,{children:[e.jsx(u,{id:"framework",children:e.jsx(j,{placeholder:"Select"})}),e.jsxs(f,{position:"popper",children:[e.jsx(t,{value:"next",children:"Next.js"}),e.jsx(t,{value:"sveltekit",children:"SvelteKit"}),e.jsx(t,{value:"astro",children:"Astro"}),e.jsx(t,{value:"nuxt",children:"Nuxt.js"})]})]})]})]})})}),e.jsxs(d,{size:r,children:[e.jsx(l,{variant:"outline",children:"Cancel"}),e.jsx(l,{color:"primary",children:"Deploy"})]})]},r))})})};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
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
