import{j as e}from"./jsx-runtime-Cf8x2fCZ.js";import{B as f}from"./button-DxFWmbbT.js";import{r as o}from"./index-tvICUrOf.js";import{c as s}from"./utils-CytzSlOG.js";import{I as N}from"./input-BBA0CWHH.js";import{L as j}from"./label-CEDjnRHz.js";import{S as y,a as v,b as g,c as S,d as n}from"./select-CKSjdUBo.js";import"./index-yBjzXJbu.js";import"./index-Dq5VjjLd.js";import"./index-_r67kdfS.js";import"./index-fNjTmf9T.js";import"./ActionButton-mrsiaEqD.js";import"./dropdown-menu-MBGF2YNj.js";import"./Combination-DL__bl4O.js";import"./index-BGNEpthp.js";import"./index-y2NRHbXQ.js";import"./index-kJTK8mBK.js";import"./check-CfPT3E_d.js";import"./createLucideIcon-DKFpjrVJ.js";import"./button.variants-B79LQKoe.js";import"./index-C66Dxnp2.js";import"./ellipsis-NIzCCAdy.js";import"./spinner-Bn71UZIB.js";import"./index-C1xbsqtW.js";import"./index-sxzTQ1UW.js";import"./chevron-down-D97Dr_NX.js";const i=o.forwardRef(({className:r,...t},a)=>e.jsx("div",{ref:a,className:s("rounded-xl border bg-card text-card-foreground shadow",r),...t}));i.displayName="Card";const d=o.forwardRef(({className:r,...t},a)=>e.jsx("div",{ref:a,className:s("flex flex-col space-y-1.5 p-6",r),...t}));d.displayName="CardHeader";const c=o.forwardRef(({className:r,...t},a)=>e.jsx("div",{ref:a,className:s("font-semibold leading-none tracking-tight",r),...t}));c.displayName="CardTitle";const m=o.forwardRef(({className:r,...t},a)=>e.jsx("div",{ref:a,className:s("text-sm text-muted-foreground",r),...t}));m.displayName="CardDescription";const p=o.forwardRef(({className:r,...t},a)=>e.jsx("div",{ref:a,className:s("p-6 pt-0",r),...t}));p.displayName="CardContent";const x=o.forwardRef(({className:r,...t},a)=>e.jsx("div",{ref:a,className:s("flex items-center p-6 pt-0",r),...t}));x.displayName="CardFooter";i.__docgenInfo={description:"",methods:[],displayName:"Card"};d.__docgenInfo={description:"",methods:[],displayName:"CardHeader"};x.__docgenInfo={description:"",methods:[],displayName:"CardFooter"};c.__docgenInfo={description:"",methods:[],displayName:"CardTitle"};m.__docgenInfo={description:"",methods:[],displayName:"CardDescription"};p.__docgenInfo={description:"",methods:[],displayName:"CardContent"};const X={title:"Data Display/Card",component:i,args:{}},l={args:{},render:()=>e.jsxs(i,{className:"w-[350px]",children:[e.jsxs(d,{children:[e.jsx(c,{children:"Create project"}),e.jsx(m,{children:"Deploy your new project in one-click."})]}),e.jsx(p,{children:e.jsx("form",{children:e.jsxs("div",{className:"grid w-full items-center gap-4",children:[e.jsxs("div",{className:"flex flex-col space-y-1.5",children:[e.jsx(j,{htmlFor:"name",children:"Name"}),e.jsx(N,{id:"name",placeholder:"Name of your project"})]}),e.jsxs("div",{className:"flex flex-col space-y-1.5",children:[e.jsx(j,{htmlFor:"framework",children:"Framework"}),e.jsxs(y,{children:[e.jsx(v,{id:"framework",children:e.jsx(g,{placeholder:"Select"})}),e.jsxs(S,{position:"popper",children:[e.jsx(n,{value:"next",children:"Next.js"}),e.jsx(n,{value:"sveltekit",children:"SvelteKit"}),e.jsx(n,{value:"astro",children:"Astro"}),e.jsx(n,{value:"nuxt",children:"Nuxt.js"})]})]})]})]})})}),e.jsxs(x,{className:"flex justify-between",children:[e.jsx(f,{variant:"outline",children:"Cancel"}),e.jsx(f,{color:"primary",children:"Deploy"})]})]})};var C,u,h;l.parameters={...l.parameters,docs:{...(C=l.parameters)==null?void 0:C.docs,source:{originalSource:`{
  args: {},
  render: () => <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Create project</CardTitle>
        <CardDescription>Deploy your new project in one-click.</CardDescription>
      </CardHeader>
      <CardContent>
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
      <CardFooter className="flex justify-between">
        <Button variant="outline">Cancel</Button>
        <Button color="primary">Deploy</Button>
      </CardFooter>
    </Card>
}`,...(h=(u=l.parameters)==null?void 0:u.docs)==null?void 0:h.source}}};const Y=["Default"];export{l as Default,Y as __namedExportsOrder,X as default};
