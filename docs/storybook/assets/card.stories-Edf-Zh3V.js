import{n as e}from"./rolldown-runtime-C0FnF6B9.js";import{t}from"./jsx-runtime-BdxMnOeJ.js";import{n,t as r}from"./label-abL0Evlz.js";import{c as i,i as a,l as o,n as s,s as c,t as l}from"./select-DMsOFfHJ.js";import{n as u,t as d}from"./button-Cn480Lud.js";import{i as f,n as p}from"./story-section-DVTm6cGm.js";import{a as m,i as h,n as g,o as _,r as v,s as y,t as b}from"./card-lDj02HnZ.js";import{n as x,t as S}from"./input-D62ACZk8.js";var C,w,T,E;function D(){return(D=e((()=>{u(),y(),x(),n(),o(),f(),C=t(),w={title:`Components/Cards/Card`,component:b,args:{}},T={args:{},render:()=>(0,C.jsx)(p,{title:`Variant`,children:(0,C.jsx)(`div`,{className:`flex flex-col gap-6`,children:[`default`,`sm`].map(e=>(0,C.jsxs)(b,{size:e,className:`w-[350px]`,children:[(0,C.jsxs)(m,{size:e,children:[(0,C.jsxs)(_,{children:[`Card `,(0,C.jsxs)(`span`,{className:`bold uppercase`,children:[`(`,e,`)`]})]}),(0,C.jsx)(v,{children:`Deploy your new project in one-click.`})]}),(0,C.jsx)(g,{size:e,children:(0,C.jsx)(`form`,{children:(0,C.jsxs)(`div`,{className:`grid w-full items-center gap-4`,children:[(0,C.jsxs)(`div`,{className:`flex flex-col space-y-1.5`,children:[(0,C.jsx)(r,{htmlFor:`name`,children:`Name`}),(0,C.jsx)(S,{id:`name`,placeholder:`Name of your project`})]}),(0,C.jsxs)(`div`,{className:`flex flex-col space-y-1.5`,children:[(0,C.jsx)(r,{htmlFor:`framework`,children:`Framework`}),(0,C.jsxs)(l,{children:[(0,C.jsx)(c,{id:`framework`,children:(0,C.jsx)(i,{placeholder:`Select`})}),(0,C.jsxs)(s,{position:`popper`,children:[(0,C.jsx)(a,{value:`next`,children:`Next.js`}),(0,C.jsx)(a,{value:`sveltekit`,children:`SvelteKit`}),(0,C.jsx)(a,{value:`astro`,children:`Astro`}),(0,C.jsx)(a,{value:`nuxt`,children:`Nuxt.js`})]})]})]})]})})}),(0,C.jsxs)(h,{size:e,children:[(0,C.jsx)(d,{variant:`outline`,children:`Cancel`}),(0,C.jsx)(d,{color:`primary`,children:`Deploy`})]})]},e))})})},T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`{
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
}`,...T.parameters?.docs?.source}}},E=[`Variant`]})))()}D();export{T as Variant,E as __namedExportsOrder,w as default};