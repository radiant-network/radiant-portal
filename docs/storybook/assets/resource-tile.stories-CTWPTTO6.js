import{n as e}from"./rolldown-runtime-C0FnF6B9.js";import{t}from"./jsx-runtime-BdxMnOeJ.js";import{n,t as r}from"./utils-hYbUpBR2.js";import{n as i,t as a}from"./createLucideIcon-BZk7HdX5.js";import{n as o,t as s}from"./arrow-right-Bz6IMn2S.js";import{n as c,t as l}from"./button-Cn480Lud.js";import{n as u,t as d}from"./dna-C5tXX2Nl.js";import{n as f,t as p}from"./square-arrow-out-up-right-C70y7DsI.js";import{i as m,n as h,r as g}from"./story-section-DVTm6cGm.js";import{a as _,i as v,n as y,o as b,s as x,t as S}from"./card-lDj02HnZ.js";var C,w;function T(){return(T=e((()=>{i(),C={name:`cloud`,size:24,node:[[`path`,{d:`M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z`,key:`p7xjir`}]]},C.node,w=a(C)})))()}function E({title:e,description:t,footer:n,className:i,descriptionClassName:a,style:o}){return(0,D.jsxs)(S,{className:r(`h-full`,i),style:o,children:[(0,D.jsx)(_,{children:(0,D.jsx)(b,{children:e})}),(0,D.jsx)(y,{className:`flex-1`,children:(0,D.jsx)(`p`,{className:r(`text-muted-foreground text-sm`,a),children:t})}),n&&(0,D.jsx)(v,{className:`justify-start gap-2`,children:n})]})}var D;function O(){return(O=e((()=>{n(),x(),D=t(),E.__docgenInfo={description:`Resource card: title (icon/logo) + description + optional footer actions.`,methods:[],displayName:`ResourceTile`,props:{title:{required:!0,tsType:{name:`ReactNode`},description:``},description:{required:!0,tsType:{name:`ReactNode`},description:``},footer:{required:!1,tsType:{name:`ReactNode`},description:``},className:{required:!1,tsType:{name:`string`},description:``},descriptionClassName:{required:!1,tsType:{name:`string`},description:``},style:{required:!1,tsType:{name:`CSSProperties`},description:``}}}})))()}var k,A,j,M;function N(){return(N=e((()=>{o(),T(),u(),f(),O(),c(),m(),k=t(),A={title:`Components/Landing/Resource Tile`,component:E,args:{title:`Germline Variants`,description:`Our variant explorer offers advanced searching capabilities. With just a few clicks, you can explore millions of annotated germline variants.`}},j={render:()=>(0,k.jsxs)(g,{children:[(0,k.jsx)(h,{title:`Tiles in a grid`,children:(0,k.jsxs)(`div`,{className:`grid gap-4 sm:grid-cols-2 lg:grid-cols-3`,children:[(0,k.jsx)(E,{title:(0,k.jsxs)(`span`,{className:`flex items-center gap-3`,children:[(0,k.jsx)(`span`,{className:`text-primary [&_svg]:size-8`,children:(0,k.jsx)(d,{})}),`Germline Variants`]}),description:`Our variant explorer offers advanced searching capabilities to explore millions of annotated germline variants.`,footer:(0,k.jsx)(l,{asChild:!0,children:(0,k.jsxs)(`a`,{href:`#`,children:[`Explore variant data `,(0,k.jsx)(s,{})]})})}),(0,k.jsx)(E,{title:(0,k.jsxs)(`span`,{className:`flex items-center gap-3`,children:[(0,k.jsx)(`span`,{className:`text-primary [&_svg]:size-8`,children:(0,k.jsx)(w,{})}),`CAVATICA`]}),description:`A cloud-based platform designed for worldwide data analysis and collaboration.`,footer:(0,k.jsx)(l,{asChild:!0,variant:`outline`,children:(0,k.jsxs)(`a`,{href:`#`,children:[`Get started `,(0,k.jsx)(p,{})]})})})]})}),(0,k.jsx)(h,{title:`Colored card (className + descriptionClassName)`,description:`Override the card background and description color for a branded tile.`,children:(0,k.jsx)(`div`,{className:`max-w-sm`,children:(0,k.jsx)(E,{className:`bg-primary text-primary-foreground border-0`,descriptionClassName:`text-primary-foreground/90`,title:(0,k.jsxs)(`span`,{className:`flex items-center gap-3`,children:[(0,k.jsx)(`span`,{className:`[&_svg]:size-8`,children:(0,k.jsx)(d,{})}),`Germline Variants`]}),description:`Explore millions of annotated germline variants from participant genomes.`,footer:(0,k.jsx)(l,{asChild:!0,variant:`secondary`,children:(0,k.jsxs)(`a`,{href:`#`,children:[`Explore variant data `,(0,k.jsx)(s,{})]})})})})})]})},j.parameters={...j.parameters,docs:{...j.parameters?.docs,source:{originalSource:`{
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
}`,...j.parameters?.docs?.source}}},M=[`AllVariants`]})))()}N();export{j as AllVariants,M as __namedExportsOrder,A as default};