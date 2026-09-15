import{n as e}from"./rolldown-runtime-C0FnF6B9.js";import{t}from"./jsx-runtime-BdxMnOeJ.js";import{i as n,n as r,r as i}from"./story-section-DVTm6cGm.js";import{n as a,s as o,t as s}from"./card-lDj02HnZ.js";import{a as c,i as l,n as u,o as d,r as f,t as p}from"./carousel-KFPTbjNH.js";function m({n:e}){return(0,h.jsx)(s,{children:(0,h.jsx)(a,{className:`flex aspect-video items-center justify-center p-6`,children:(0,h.jsx)(`span`,{className:`text-3xl font-semibold`,children:e})})})}var h,g,_,v,y;function b(){return(b=e((()=>{o(),d(),n(),h=t(),g={title:`Components/Carousel/Carousel`,component:p},_=[1,2,3,4,5],v={render:()=>(0,h.jsxs)(i,{children:[(0,h.jsx)(r,{title:`Default (one slide per view)`,description:`Side arrows are absolutely positioned outside the track.`,children:(0,h.jsx)(`div`,{className:`px-14`,children:(0,h.jsxs)(p,{opts:{align:`start`},className:`mx-auto w-full max-w-sm`,children:[(0,h.jsx)(u,{children:_.map(e=>(0,h.jsx)(f,{children:(0,h.jsx)(m,{n:e})},e))}),(0,h.jsx)(c,{}),(0,h.jsx)(l,{})]})})}),(0,h.jsx)(r,{title:`Multiple slides per view`,description:`Control how many slides show via the CarouselItem basis (here basis-1/2 · sm:basis-1/3).`,children:(0,h.jsx)(`div`,{className:`px-14`,children:(0,h.jsxs)(p,{opts:{align:`start`},className:`mx-auto w-full max-w-2xl`,children:[(0,h.jsx)(u,{children:_.map(e=>(0,h.jsx)(f,{className:`basis-1/2 sm:basis-1/3`,children:(0,h.jsx)(m,{n:e})},e))}),(0,h.jsx)(c,{}),(0,h.jsx)(l,{})]})})}),(0,h.jsx)(r,{title:`Arrows below the track`,description:"Reset the absolute positioning with `static translate-y-0` to place the controls in normal flow (used on the landing Studies carousel).",children:(0,h.jsxs)(p,{opts:{align:`start`},className:`mx-auto w-full max-w-sm`,children:[(0,h.jsx)(u,{children:_.map(e=>(0,h.jsx)(f,{children:(0,h.jsx)(m,{n:e})},e))}),(0,h.jsxs)(`div`,{className:`mt-4 flex justify-center gap-2`,children:[(0,h.jsx)(c,{className:`static translate-y-0`}),(0,h.jsx)(l,{className:`static translate-y-0`})]})]})})]})},v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  render: () => <StoryShowcase>
      <StorySection title="Default (one slide per view)" description="Side arrows are absolutely positioned outside the track.">
        {/* Horizontal padding leaves room for the default -left-12 / -right-12 arrows. */}
        <div className="px-14">
          <Carousel opts={{
          align: 'start'
        }} className="mx-auto w-full max-w-sm">
            <CarouselContent>
              {SLIDES.map(n => <CarouselItem key={n}>
                  <Slide n={n} />
                </CarouselItem>)}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      </StorySection>

      <StorySection title="Multiple slides per view" description="Control how many slides show via the CarouselItem basis (here basis-1/2 · sm:basis-1/3).">
        <div className="px-14">
          <Carousel opts={{
          align: 'start'
        }} className="mx-auto w-full max-w-2xl">
            <CarouselContent>
              {SLIDES.map(n => <CarouselItem key={n} className="basis-1/2 sm:basis-1/3">
                  <Slide n={n} />
                </CarouselItem>)}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      </StorySection>

      <StorySection title="Arrows below the track" description="Reset the absolute positioning with \`static translate-y-0\` to place the controls in normal flow (used on the landing Studies carousel).">
        <Carousel opts={{
        align: 'start'
      }} className="mx-auto w-full max-w-sm">
          <CarouselContent>
            {SLIDES.map(n => <CarouselItem key={n}>
                <Slide n={n} />
              </CarouselItem>)}
          </CarouselContent>
          <div className="mt-4 flex justify-center gap-2">
            <CarouselPrevious className="static translate-y-0" />
            <CarouselNext className="static translate-y-0" />
          </div>
        </Carousel>
      </StorySection>
    </StoryShowcase>
}`,...v.parameters?.docs?.source}}},y=[`AllVariants`]})))()}b();export{v as AllVariants,y as __namedExportsOrder,g as default};