import{j as s}from"./iframe-ikmO-G8w.js";import{C as u,d}from"./card-B2Khm5nL.js";import{C as a,a as o,b as r,c as l,d as i}from"./carousel-BMl9Ix5Y.js";import{S as p,a as n}from"./story-section-Do19LCYz.js";import"./preload-helper-PPVm8Dsz.js";import"./separator-DvGIa4AD.js";import"./button-f2BnibuH.js";import"./action-button-DslSGgMW.js";import"./dropdown-menu-Djo0E1ip.js";import"./index-DLIPavft.js";import"./index-LNYO5vkT.js";import"./check-DFIBGLZn.js";import"./circle-HHVicZ3t.js";import"./i18n--cYKJdvf.js";import"./index-TBEFmxjP.js";import"./arrow-left-CVVe611q.js";import"./arrow-right-g_gY70kQ.js";const L={title:"Components/Carousel/Carousel",component:a},m=[1,2,3,4,5];function c({n:e}){return s.jsx(u,{children:s.jsx(d,{className:"flex aspect-video items-center justify-center p-6",children:s.jsx("span",{className:"text-3xl font-semibold",children:e})})})}const t={render:()=>s.jsxs(p,{children:[s.jsx(n,{title:"Default (one slide per view)",description:"Side arrows are absolutely positioned outside the track.",children:s.jsx("div",{className:"px-14",children:s.jsxs(a,{opts:{align:"start"},className:"mx-auto w-full max-w-sm",children:[s.jsx(o,{children:m.map(e=>s.jsx(r,{children:s.jsx(c,{n:e})},e))}),s.jsx(l,{}),s.jsx(i,{})]})})}),s.jsx(n,{title:"Multiple slides per view",description:"Control how many slides show via the CarouselItem basis (here basis-1/2 · sm:basis-1/3).",children:s.jsx("div",{className:"px-14",children:s.jsxs(a,{opts:{align:"start"},className:"mx-auto w-full max-w-2xl",children:[s.jsx(o,{children:m.map(e=>s.jsx(r,{className:"basis-1/2 sm:basis-1/3",children:s.jsx(c,{n:e})},e))}),s.jsx(l,{}),s.jsx(i,{})]})})}),s.jsx(n,{title:"Arrows below the track",description:"Reset the absolute positioning with `static translate-y-0` to place the controls in normal flow (used on the landing Studies carousel).",children:s.jsxs(a,{opts:{align:"start"},className:"mx-auto w-full max-w-sm",children:[s.jsx(o,{children:m.map(e=>s.jsx(r,{children:s.jsx(c,{n:e})},e))}),s.jsxs("div",{className:"mt-4 flex justify-center gap-2",children:[s.jsx(l,{className:"static translate-y-0"}),s.jsx(i,{className:"static translate-y-0"})]})]})})]})};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
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
}`,...t.parameters?.docs?.source}}};const P=["AllVariants"];export{t as AllVariants,P as __namedExportsOrder,L as default};
