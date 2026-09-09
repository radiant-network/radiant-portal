import{a as f,j as e,c as n,B as s}from"./iframe-CEIjD8md.js";import{C as u,a as g,b as h,d as j,e as N}from"./card-CNapmLtt.js";import{S as v,a as t}from"./story-section-akNb6BHm.js";import{A as o}from"./arrow-right-BGg07uqk.js";import{D as l}from"./dna-DQaY_Nkg.js";import{S as y}from"./square-arrow-out-up-right-D_XMvHP7.js";import"./preload-helper-PPVm8Dsz.js";const C=[["path",{d:"M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z",key:"p7xjir"}]],S=f("cloud",C);function a({title:d,description:c,footer:i,className:p,descriptionClassName:m,style:x}){return e.jsxs(u,{className:n("h-full",p),style:x,children:[e.jsx(g,{children:e.jsx(h,{children:d})}),e.jsx(j,{className:"flex-1",children:e.jsx("p",{className:n("text-muted-foreground text-sm",m),children:c})}),i&&e.jsx(N,{className:"justify-start gap-2",children:i})]})}a.__docgenInfo={description:"Resource card: title (icon/logo) + description + optional footer actions.",methods:[],displayName:"ResourceTile",props:{title:{required:!0,tsType:{name:"ReactNode"},description:""},description:{required:!0,tsType:{name:"ReactNode"},description:""},footer:{required:!1,tsType:{name:"ReactNode"},description:""},className:{required:!1,tsType:{name:"string"},description:""},descriptionClassName:{required:!1,tsType:{name:"string"},description:""},style:{required:!1,tsType:{name:"CSSProperties"},description:""}}};const q={title:"Components/Landing/Resource Tile",component:a,args:{title:"Germline Variants",description:"Our variant explorer offers advanced searching capabilities. With just a few clicks, you can explore millions of annotated germline variants."}},r={render:()=>e.jsxs(v,{children:[e.jsx(t,{title:"Tiles in a grid",children:e.jsxs("div",{className:"grid gap-4 sm:grid-cols-2 lg:grid-cols-3",children:[e.jsx(a,{title:e.jsxs("span",{className:"flex items-center gap-3",children:[e.jsx("span",{className:"text-primary [&_svg]:size-8",children:e.jsx(l,{})}),"Germline Variants"]}),description:"Our variant explorer offers advanced searching capabilities to explore millions of annotated germline variants.",footer:e.jsx(s,{asChild:!0,children:e.jsxs("a",{href:"#",children:["Explore variant data ",e.jsx(o,{})]})})}),e.jsx(a,{title:e.jsxs("span",{className:"flex items-center gap-3",children:[e.jsx("span",{className:"text-primary [&_svg]:size-8",children:e.jsx(S,{})}),"CAVATICA"]}),description:"A cloud-based platform designed for worldwide data analysis and collaboration.",footer:e.jsx(s,{asChild:!0,variant:"outline",children:e.jsxs("a",{href:"#",children:["Get started ",e.jsx(y,{})]})})})]})}),e.jsx(t,{title:"Colored card (className + descriptionClassName)",description:"Override the card background and description color for a branded tile.",children:e.jsx("div",{className:"max-w-sm",children:e.jsx(a,{className:"bg-primary text-primary-foreground border-0",descriptionClassName:"text-primary-foreground/90",title:e.jsxs("span",{className:"flex items-center gap-3",children:[e.jsx("span",{className:"[&_svg]:size-8",children:e.jsx(l,{})}),"Germline Variants"]}),description:"Explore millions of annotated germline variants from participant genomes.",footer:e.jsx(s,{asChild:!0,variant:"secondary",children:e.jsxs("a",{href:"#",children:["Explore variant data ",e.jsx(o,{})]})})})})})]})};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  render: () => <StoryShowcase>
      <StorySection title="Tiles in a grid">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <ResourceTile title={<span className="flex items-center gap-3">
                <span className="text-primary [&_svg]:size-8">
                  <Dna />
                </span>
                Germline Variants
              </span>} description="Our variant explorer offers advanced searching capabilities to explore millions of annotated germline variants." footer={<Button asChild>
                <a href="#">
                  Explore variant data <ArrowRight />
                </a>
              </Button>} />
          <ResourceTile title={<span className="flex items-center gap-3">
                <span className="text-primary [&_svg]:size-8">
                  <Cloud />
                </span>
                CAVATICA
              </span>} description="A cloud-based platform designed for worldwide data analysis and collaboration." footer={<Button asChild variant="outline">
                <a href="#">
                  Get started <SquareArrowOutUpRight />
                </a>
              </Button>} />
        </div>
      </StorySection>

      <StorySection title="Colored card (className + descriptionClassName)" description="Override the card background and description color for a branded tile.">
        <div className="max-w-sm">
          <ResourceTile className="bg-primary text-primary-foreground border-0" descriptionClassName="text-primary-foreground/90" title={<span className="flex items-center gap-3">
                <span className="[&_svg]:size-8">
                  <Dna />
                </span>
                Germline Variants
              </span>} description="Explore millions of annotated germline variants from participant genomes." footer={<Button asChild variant="secondary">
                <a href="#">
                  Explore variant data <ArrowRight />
                </a>
              </Button>} />
        </div>
      </StorySection>
    </StoryShowcase>
}`,...r.parameters?.docs?.source}}};const B=["AllVariants"];export{r as AllVariants,B as __namedExportsOrder,q as default};
