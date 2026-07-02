import{j as s}from"./iframe-GYMnz-7x.js";import{C as u,d}from"./card-BeBc4Fcj.js";import{C as a,a as o,b as r,c as l,d as i}from"./carousel-D_SnJk3e.js";import{S as p,a as n}from"./story-section-B8hLDL9V.js";import"./preload-helper-PPVm8Dsz.js";import"./separator-CxIJlsta.js";import"./button-BW7uYpsZ.js";import"./action-button-C5yNblEX.js";import"./dropdown-menu-D8RNBs8V.js";import"./index-DWsE9wOP.js";import"./index-OS3JsfxU.js";import"./check-BxNDYKk2.js";import"./circle-q-mOcdtX.js";import"./i18n-LMd9zC7u.js";import"./index-CtN1RmEe.js";import"./arrow-right-DIqGSUD1.js";const A={title:"Components/Carousel/Carousel",component:a},m=[1,2,3,4,5];function c({n:e}){return s.jsx(u,{children:s.jsx(d,{className:"flex aspect-video items-center justify-center p-6",children:s.jsx("span",{className:"text-3xl font-semibold",children:e})})})}const t={render:()=>s.jsxs(p,{children:[s.jsx(n,{title:"Default (one slide per view)",description:"Side arrows are absolutely positioned outside the track.",children:s.jsx("div",{className:"px-14",children:s.jsxs(a,{opts:{align:"start"},className:"mx-auto w-full max-w-sm",children:[s.jsx(o,{children:m.map(e=>s.jsx(r,{children:s.jsx(c,{n:e})},e))}),s.jsx(l,{}),s.jsx(i,{})]})})}),s.jsx(n,{title:"Multiple slides per view",description:"Control how many slides show via the CarouselItem basis (here basis-1/2 · sm:basis-1/3).",children:s.jsx("div",{className:"px-14",children:s.jsxs(a,{opts:{align:"start"},className:"mx-auto w-full max-w-2xl",children:[s.jsx(o,{children:m.map(e=>s.jsx(r,{className:"basis-1/2 sm:basis-1/3",children:s.jsx(c,{n:e})},e))}),s.jsx(l,{}),s.jsx(i,{})]})})}),s.jsx(n,{title:"Arrows below the track",description:"Reset the absolute positioning with `static translate-y-0` to place the controls in normal flow (used on the landing Studies carousel).",children:s.jsxs(a,{opts:{align:"start"},className:"mx-auto w-full max-w-sm",children:[s.jsx(o,{children:m.map(e=>s.jsx(r,{children:s.jsx(c,{n:e})},e))}),s.jsxs("div",{className:"mt-4 flex justify-center gap-2",children:[s.jsx(l,{className:"static translate-y-0"}),s.jsx(i,{className:"static translate-y-0"})]})]})})]})};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
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
}`,...t.parameters?.docs?.source}}};const L=["AllVariants"];export{t as AllVariants,L as __namedExportsOrder,A as default};
