import{j as e}from"./jsx-runtime-D_zvdyIk.js";import{B as o}from"./button-DAgLdymK.js";import{C as m,a as p,b as d,c as n,d as x,e as u}from"./card-Cyh3E19J.js";import{I as j}from"./input-Bj-MPxry.js";import{L as l}from"./label-BI8zg36L.js";import{S as f,a as h,b as C,c as v,d as t}from"./select-Dcd4mvCY.js";import"./index-C-d7IIsQ.js";import"./index-CBYaBgW8.js";import"./index-Dy6y0jaD.js";import"./action-button-9r-08jXC.js";import"./dropdown-menu-DPm_FhUX.js";import"./index-D9mtqW9-.js";import"./index-sTUCEGFJ.js";import"./index-BWnBDfn-.js";import"./index-BCzuw4Jg.js";import"./index-C8BBKGwP.js";import"./index-BL8Z-moU.js";import"./Combination-CrkgvPnV.js";import"./index-iyInEJkZ.js";import"./index-C2iKAgIe.js";import"./index-CWHKeK-O.js";import"./index-CfgEC-S9.js";import"./createLucideIcon-B119WVF5.js";import"./index-DnEzm5An.js";import"./utils-CDN07tui.js";import"./check-DSe_yRo5.js";import"./separator-ChZWIdMg.js";import"./button.variants-Du9eY_ux.js";import"./index-C66Dxnp2.js";import"./spinner-D7tBPZCQ.js";import"./tooltip-0vX-MTK3.js";import"./index-CfXWnpL9.js";import"./i18n-BTxp_gVm.js";import"./iframe-GBrYIRbG.js";import"./i18next-CYn7LYXT.js";import"./index-SF2qmtPV.js";import"./chevron-down-DOuPo75j.js";import"./chevron-up-C0Hb7JXF.js";const oe={title:"Cards/Card",component:m,args:{}},a={args:{},render:()=>e.jsx("div",{className:"flex flex-col gap-6",children:["default","sm"].map(r=>e.jsxs(m,{size:r,className:"w-[350px]",children:[e.jsxs(p,{size:r,children:[e.jsxs(d,{children:["Card ",e.jsxs("span",{className:"bold uppercase",children:["(",r,")"]})]}),e.jsx(n,{children:"Deploy your new project in one-click."})]}),e.jsx(x,{size:r,children:e.jsx("form",{children:e.jsxs("div",{className:"grid w-full items-center gap-4",children:[e.jsxs("div",{className:"flex flex-col space-y-1.5",children:[e.jsx(l,{htmlFor:"name",children:"Name"}),e.jsx(j,{id:"name",placeholder:"Name of your project"})]}),e.jsxs("div",{className:"flex flex-col space-y-1.5",children:[e.jsx(l,{htmlFor:"framework",children:"Framework"}),e.jsxs(f,{children:[e.jsx(h,{id:"framework",children:e.jsx(C,{placeholder:"Select"})}),e.jsxs(v,{position:"popper",children:[e.jsx(t,{value:"next",children:"Next.js"}),e.jsx(t,{value:"sveltekit",children:"SvelteKit"}),e.jsx(t,{value:"astro",children:"Astro"}),e.jsx(t,{value:"nuxt",children:"Nuxt.js"})]})]})]})]})})}),e.jsxs(u,{size:r,children:[e.jsx(o,{variant:"outline",children:"Cancel"}),e.jsx(o,{color:"primary",children:"Deploy"})]})]},r))})};var s,i,c;a.parameters={...a.parameters,docs:{...(s=a.parameters)==null?void 0:s.docs,source:{originalSource:`{
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
}`,...(c=(i=a.parameters)==null?void 0:i.docs)==null?void 0:c.source}}};const le=["Default"];export{a as Default,le as __namedExportsOrder,oe as default};
