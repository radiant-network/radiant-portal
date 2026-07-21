import{d as f,j as e,c as t}from"./iframe-BOkj70l8.js";import{C as u,a as g,b as h,d as j,e as N}from"./card-DT4VhHcK.js";import{B as s}from"./button-tn5oIYKb.js";import{S as v,a as n}from"./story-section-DQYgi0mB.js";import{A as o}from"./arrow-right-DGQyJvt3.js";import{D as l}from"./dna-Baw4PAzZ.js";import{S as y}from"./square-arrow-out-up-right-CGcntJeD.js";import"./preload-helper-PPVm8Dsz.js";import"./separator-MMk7clR0.js";import"./action-button-CeXyayKt.js";import"./dropdown-menu-CQVY1paU.js";import"./index-CTJyEr6n.js";import"./index-fVILgqWX.js";import"./check-DI71rXD4.js";import"./circle-BIlPbk8H.js";import"./i18n-C0VA3Pzj.js";import"./index-BiVUSCho.js";const C=[["path",{d:"M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z",key:"p7xjir"}]],S=f("cloud",C);function r({title:d,description:c,footer:i,className:p,descriptionClassName:m,style:x}){return e.jsxs(u,{className:t("h-full",p),style:x,children:[e.jsx(g,{children:e.jsx(h,{children:d})}),e.jsx(j,{className:"flex-1",children:e.jsx("p",{className:t("text-muted-foreground text-sm",m),children:c})}),i&&e.jsx(N,{className:"justify-start gap-2",children:i})]})}r.__docgenInfo={description:"Resource card: title (icon/logo) + description + optional footer actions.",methods:[],displayName:"ResourceTile",props:{title:{required:!0,tsType:{name:"ReactNode"},description:""},description:{required:!0,tsType:{name:"ReactNode"},description:""},footer:{required:!1,tsType:{name:"ReactNode"},description:""},className:{required:!1,tsType:{name:"string"},description:""},descriptionClassName:{required:!1,tsType:{name:"string"},description:""},style:{required:!1,tsType:{name:"CSSProperties"},description:""}}};const L={title:"Components/Landing/Resource Tile",component:r,args:{title:"Germline Variants",description:"Our variant explorer offers advanced searching capabilities. With just a few clicks, you can explore millions of annotated germline variants."}},a={render:()=>e.jsxs(v,{children:[e.jsx(n,{title:"Tiles in a grid",children:e.jsxs("div",{className:"grid gap-4 sm:grid-cols-2 lg:grid-cols-3",children:[e.jsx(r,{title:e.jsxs("span",{className:"flex items-center gap-3",children:[e.jsx("span",{className:"text-primary [&_svg]:size-8",children:e.jsx(l,{})}),"Germline Variants"]}),description:"Our variant explorer offers advanced searching capabilities to explore millions of annotated germline variants.",footer:e.jsx(s,{asChild:!0,children:e.jsxs("a",{href:"#",children:["Explore variant data ",e.jsx(o,{})]})})}),e.jsx(r,{title:e.jsxs("span",{className:"flex items-center gap-3",children:[e.jsx("span",{className:"text-primary [&_svg]:size-8",children:e.jsx(S,{})}),"CAVATICA"]}),description:"A cloud-based platform designed for worldwide data analysis and collaboration.",footer:e.jsx(s,{asChild:!0,variant:"outline",children:e.jsxs("a",{href:"#",children:["Get started ",e.jsx(y,{})]})})})]})}),e.jsx(n,{title:"Colored card (className + descriptionClassName)",description:"Override the card background and description color for a branded tile.",children:e.jsx("div",{className:"max-w-sm",children:e.jsx(r,{className:"bg-primary text-primary-foreground border-0",descriptionClassName:"text-primary-foreground/90",title:e.jsxs("span",{className:"flex items-center gap-3",children:[e.jsx("span",{className:"[&_svg]:size-8",children:e.jsx(l,{})}),"Germline Variants"]}),description:"Explore millions of annotated germline variants from participant genomes.",footer:e.jsx(s,{asChild:!0,variant:"secondary",children:e.jsxs("a",{href:"#",children:["Explore variant data ",e.jsx(o,{})]})})})})})]})};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
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
}`,...a.parameters?.docs?.source}}};const U=["AllVariants"];export{a as AllVariants,U as __namedExportsOrder,L as default};
