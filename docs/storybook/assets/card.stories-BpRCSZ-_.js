import{j as e}from"./iframe-DaN5ePGy.js";import{B as l}from"./button-C2HSnRiu.js";import{C as o,a as c,b as i,c as d,d as m,e as n}from"./card-Cjd0uC8i.js";import{I as p}from"./input-DP_2MVQx.js";import{L as s}from"./label-DFc0ADpw.js";import{S as x,a as u,b as j,c as f,d as a}from"./select-BoZlEhHZ.js";import"./preload-helper-PPVm8Dsz.js";import"./index-buk7i43K.js";import"./action-button-BHK2YR4r.js";import"./dropdown-menu-CPO56L4e.js";import"./index-DeH_VHOF.js";import"./index-CZCzdGEw.js";import"./check-B-s7SQrr.js";import"./circle-ZjFAsy7t.js";import"./separator-Dw2V0eT4.js";import"./i18n-M9kOJp22.js";import"./index-FwWjbq00.js";import"./index-Bxzg_Qkc.js";import"./chevron-down-DEKrCgi_.js";import"./chevron-up-DB5AtR6w.js";const K={title:"Cards/Card",component:o,args:{}},t={args:{},render:()=>e.jsx("div",{className:"flex flex-col gap-6",children:["default","sm"].map(r=>e.jsxs(o,{size:r,className:"w-[350px]",children:[e.jsxs(c,{size:r,children:[e.jsxs(i,{children:["Card ",e.jsxs("span",{className:"bold uppercase",children:["(",r,")"]})]}),e.jsx(d,{children:"Deploy your new project in one-click."})]}),e.jsx(m,{size:r,children:e.jsx("form",{children:e.jsxs("div",{className:"grid w-full items-center gap-4",children:[e.jsxs("div",{className:"flex flex-col space-y-1.5",children:[e.jsx(s,{htmlFor:"name",children:"Name"}),e.jsx(p,{id:"name",placeholder:"Name of your project"})]}),e.jsxs("div",{className:"flex flex-col space-y-1.5",children:[e.jsx(s,{htmlFor:"framework",children:"Framework"}),e.jsxs(x,{children:[e.jsx(u,{id:"framework",children:e.jsx(j,{placeholder:"Select"})}),e.jsxs(f,{position:"popper",children:[e.jsx(a,{value:"next",children:"Next.js"}),e.jsx(a,{value:"sveltekit",children:"SvelteKit"}),e.jsx(a,{value:"astro",children:"Astro"}),e.jsx(a,{value:"nuxt",children:"Nuxt.js"})]})]})]})]})})}),e.jsxs(n,{size:r,children:[e.jsx(l,{variant:"outline",children:"Cancel"}),e.jsx(l,{color:"primary",children:"Deploy"})]})]},r))})};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
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
