import{r as u,j as o,al as v,X as U,C as A,am as w,an as N}from"./iframe-BmQaEKqD.js";import{T as E,t as i}from"./index-DHmgX5MG.js";import{B as r}from"./button-Cwn9pdSz.js";import{S as O,a as C}from"./story-section-DmKrQ7pL.js";import{F as k}from"./flask-conical-C0bm4Qkw.js";import"./preload-helper-PPVm8Dsz.js";import"./action-button-NcZ7v7jd.js";import"./dropdown-menu-D8OFOKsF.js";import"./index-0v-EdXCc.js";import"./index-DQAP5Woc.js";import"./check-ZuEG5tzj.js";import"./circle-BTNlC0Y1.js";import"./separator-lVIRd7xC.js";import"./i18n-DASwuS_h.js";import"./index-DPphhh4w.js";var z=(e,l,g,c,a,n,x,f)=>{let s=document.documentElement,y=["light","dark"];function d(t){(Array.isArray(e)?e:[e]).forEach(m=>{let h=m==="class",j=h&&n?a.map(T=>n[T]||T):a;h?(s.classList.remove(...j),s.classList.add(n&&n[t]?n[t]:t)):s.setAttribute(m,t)}),b(t)}function b(t){f&&y.includes(t)&&(s.style.colorScheme=t)}function S(){return window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}if(c)d(c);else try{let t=localStorage.getItem(l)||g,m=x&&t==="system"?S():t;d(m)}catch{}},D=u.createContext(void 0),F={setTheme:e=>{},themes:[]},I=()=>{var e;return(e=u.useContext(D))!=null?e:F};u.memo(({forcedTheme:e,storageKey:l,attribute:g,enableSystem:c,enableColorScheme:a,defaultTheme:n,value:x,themes:f,nonce:s,scriptProps:y})=>{let d=JSON.stringify([g,l,n,e,f,x,c,a]).slice(1,-1);return u.createElement("script",{...y,suppressHydrationWarning:!0,nonce:typeof window>"u"?s:"",dangerouslySetInnerHTML:{__html:`(${z.toString()})(${d})`}})});const B=({...e})=>{const{theme:l="system"}=I();return o.jsx(E,{theme:l,className:"toaster group",icons:{success:o.jsx(N,{className:"size-5 text-alert-success-foreground fill-alert-success/20 mt-1"}),info:o.jsx(w,{className:"size-5 text-alert-info-foreground fill-alert-info/20 mt-1"}),warning:o.jsx(A,{className:"size-5 text-alert-warning-foreground fill-alert-warning/20 mt-1"}),error:o.jsx(U,{className:"size-5 text-alert-error-foreground fill-alert-error/20 mt-1"}),loading:o.jsx(v,{className:"size-5 animate-spin text-foreground mt-1"})},style:{"--normal-bg":"var(--popover)","--normal-text":"var(--popover-foreground)","--normal-border":"var(--border)","--border-radius":"var(--radius)"},toastOptions:{classNames:{toast:"!items-start !text-sm !shadow-lg !rounded-lg !gap-3",title:"!text-base-popover-foreground",description:"!text-muted-foreground",actionButton:"!inline-flex !items-center !justify-center !whitespace-nowrap !rounded-md !gap-2 !font-medium !text-xs !h-6 !p-2 !bg-primary !text-primary-foreground !shadow-sm hover:!bg-primary/90 !transition-colors",closeButton:"!text-muted-foreground !border !border-border hover:!bg-accent hover:!text-accent-foreground hover:!opacity-100 !transition-all"}},...e})};B.__docgenInfo={description:"",methods:[],displayName:"Toaster"};const Y={title:"Components/Toasters/Toaster",component:r},p={render:()=>o.jsxs(o.Fragment,{children:[o.jsxs(O,{children:[o.jsx(C,{title:"Default",children:o.jsxs("div",{className:"flex gap-4 items-center",children:[o.jsx(r,{onClick:()=>{i("Title")},color:"primary",children:"Title only"}),o.jsx(r,{onClick:()=>{i("Title",{description:"A description"})},color:"primary",children:"Title Desc"}),o.jsx(r,{onClick:()=>{i("Title",{description:"A description",icon:o.jsx(k,{className:"size-5 text-foreground mt-1"})})},color:"primary",children:"Custom icon"}),o.jsx(r,{onClick:()=>{i("Title",{description:"A description",action:{label:"Undo",onClick:()=>console.log("Undo")}})},color:"primary",children:"Title Desc Action"}),o.jsx(r,{onClick:()=>{i("Title",{description:"A description",action:{label:"Undo",onClick:()=>console.log("Undo")},closeButton:!0})},color:"primary",children:"Title Desc Action Close"}),o.jsx(r,{onClick:()=>{i("Title",{description:"A description",action:{label:"Undo",onClick:()=>console.log("Undo")},closeButton:!0,icon:o.jsx(k,{className:"size-5 text-foreground mt-1"})})},color:"primary",children:"Full options"})]})}),o.jsx(C,{title:"Feedback",children:o.jsxs("div",{className:"flex gap-4 items-center",children:[o.jsx(r,{onClick:()=>{i.info("Title",{description:"A description",action:{label:"Undo",onClick:()=>console.log("Undo")},closeButton:!0})},color:"primary",children:"Open Info Toaster"}),o.jsx(r,{onClick:()=>{i.success("Title",{description:"A description",action:{label:"Undo",onClick:()=>console.log("Undo")},closeButton:!0})},color:"primary",children:"Open Success Toaster"}),o.jsx(r,{onClick:()=>{i.warning("Title",{description:"A description",action:{label:"Undo",onClick:()=>console.log("Undo")},closeButton:!0})},color:"primary",children:"Open Warning Toaster"}),o.jsx(r,{onClick:()=>{i.error("Title",{description:"A description",action:{label:"Undo",onClick:()=>console.log("Undo")},closeButton:!0})},color:"primary",children:"Open Error Toaster"})]})}),o.jsx(C,{title:"Promise",children:o.jsx("div",{className:"flex gap-4 items-center",children:o.jsx(r,{onClick:()=>{i.promise(()=>new Promise(e=>setTimeout(()=>e({name:"Event"}),2e3)),{loading:"Loading...",success:e=>`${e.name} has been created`,error:"Error"})},color:"primary",children:"Promise Toaster"})})})]}),o.jsx(B,{position:"top-right"})]})};p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  render: () => <>
      <StoryShowcase>
        <StorySection title="Default">
          <div className="flex gap-4 items-center">
            <Button onClick={() => {
            toast('Title');
          }} color="primary">
              Title only
            </Button>
            <Button onClick={() => {
            toast('Title', {
              description: 'A description'
            });
          }} color="primary">
              Title Desc
            </Button>
            <Button onClick={() => {
            toast('Title', {
              description: 'A description',
              icon: <FlaskConicalIcon className="size-5 text-foreground mt-1" />
            });
          }} color="primary">
              Custom icon
            </Button>
            <Button onClick={() => {
            toast('Title', {
              description: 'A description',
              action: {
                label: 'Undo',
                onClick: () => console.log('Undo')
              }
            });
          }} color="primary">
              Title Desc Action
            </Button>
            <Button onClick={() => {
            toast('Title', {
              description: 'A description',
              action: {
                label: 'Undo',
                onClick: () => console.log('Undo')
              },
              closeButton: true
            });
          }} color="primary">
              Title Desc Action Close
            </Button>
            <Button onClick={() => {
            toast('Title', {
              description: 'A description',
              action: {
                label: 'Undo',
                onClick: () => console.log('Undo')
              },
              closeButton: true,
              icon: <FlaskConicalIcon className="size-5 text-foreground mt-1" />
            });
          }} color="primary">
              Full options
            </Button>
          </div>
        </StorySection>

        <StorySection title="Feedback">
          <div className="flex gap-4 items-center">
            <Button onClick={() => {
            toast.info('Title', {
              description: 'A description',
              action: {
                label: 'Undo',
                onClick: () => console.log('Undo')
              },
              closeButton: true
            });
          }} color="primary">
              Open Info Toaster
            </Button>
            <Button onClick={() => {
            toast.success('Title', {
              description: 'A description',
              action: {
                label: 'Undo',
                onClick: () => console.log('Undo')
              },
              closeButton: true
            });
          }} color="primary">
              Open Success Toaster
            </Button>
            <Button onClick={() => {
            toast.warning('Title', {
              description: 'A description',
              action: {
                label: 'Undo',
                onClick: () => console.log('Undo')
              },
              closeButton: true
            });
          }} color="primary">
              Open Warning Toaster
            </Button>
            <Button onClick={() => {
            toast.error('Title', {
              description: 'A description',
              action: {
                label: 'Undo',
                onClick: () => console.log('Undo')
              },
              closeButton: true
            });
          }} color="primary">
              Open Error Toaster
            </Button>
          </div>
        </StorySection>

        <StorySection title="Promise">
          <div className="flex gap-4 items-center">
            <Button onClick={() => {
            toast.promise<{
              name: string;
            }>(() => new Promise(resolve => setTimeout(() => resolve({
              name: 'Event'
            }), 2000)), {
              loading: 'Loading...',
              success: data => \`\${data.name} has been created\`,
              error: 'Error'
            });
          }} color="primary">
              Promise Toaster
            </Button>
          </div>
        </StorySection>
      </StoryShowcase>

      <Toaster position="top-right" />
    </>
}`,...p.parameters?.docs?.source}}};const Z=["Default"];export{p as Default,Z as __namedExportsOrder,Y as default};
