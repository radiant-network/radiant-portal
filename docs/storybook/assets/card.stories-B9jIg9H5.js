import{j as e}from"./iframe-BH3MSqWK.js";import{B as l}from"./button-BxP9PPaa.js";import{C as o,a as c,b as i,c as d,d as m,e as n}from"./card-tra_P6sC.js";import{I as p}from"./input-h6d6rGg7.js";import{L as s}from"./label-CbaNIhYw.js";import{S as x,a as u,b as j,c as f,d as a}from"./select-BK-WfEuj.js";import"./preload-helper-PPVm8Dsz.js";import"./index-CfauPKxk.js";import"./action-button-DjPcyzdS.js";import"./dropdown-menu-DwRYTMWI.js";import"./index-B6DCGoSV.js";import"./index-Cipz7JOz.js";import"./check-Bk5l44Qw.js";import"./circle-Cyir8aSn.js";import"./separator-DyfWTagX.js";import"./i18n-MpjanH8G.js";import"./index-BSwCZ4xH.js";import"./index-CUICGVdn.js";import"./chevron-down-NE6jLGu9.js";import"./chevron-up-DPZMdaEM.js";const K={title:"Cards/Card",component:o,args:{}},t={args:{},render:()=>e.jsx("div",{className:"flex flex-col gap-6",children:["default","sm"].map(r=>e.jsxs(o,{size:r,className:"w-[350px]",children:[e.jsxs(c,{size:r,children:[e.jsxs(i,{children:["Card ",e.jsxs("span",{className:"bold uppercase",children:["(",r,")"]})]}),e.jsx(d,{children:"Deploy your new project in one-click."})]}),e.jsx(m,{size:r,children:e.jsx("form",{children:e.jsxs("div",{className:"grid w-full items-center gap-4",children:[e.jsxs("div",{className:"flex flex-col space-y-1.5",children:[e.jsx(s,{htmlFor:"name",children:"Name"}),e.jsx(p,{id:"name",placeholder:"Name of your project"})]}),e.jsxs("div",{className:"flex flex-col space-y-1.5",children:[e.jsx(s,{htmlFor:"framework",children:"Framework"}),e.jsxs(x,{children:[e.jsx(u,{id:"framework",children:e.jsx(j,{placeholder:"Select"})}),e.jsxs(f,{position:"popper",children:[e.jsx(a,{value:"next",children:"Next.js"}),e.jsx(a,{value:"sveltekit",children:"SvelteKit"}),e.jsx(a,{value:"astro",children:"Astro"}),e.jsx(a,{value:"nuxt",children:"Nuxt.js"})]})]})]})]})})}),e.jsxs(n,{size:r,children:[e.jsx(l,{variant:"outline",children:"Cancel"}),e.jsx(l,{color:"primary",children:"Deploy"})]})]},r))})};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
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
}`,...t.parameters?.docs?.source}}};const V=["Default"];export{t as Default,V as __namedExportsOrder,K as default};
