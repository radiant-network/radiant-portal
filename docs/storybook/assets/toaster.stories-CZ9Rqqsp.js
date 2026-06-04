import{d as j,r as u,j as o,a5 as U,Q as A,C as N,a6 as w,a7 as E}from"./iframe-Cbdknb1k.js";import{T as z,t as i}from"./index-C_Haeo4Q.js";import{B as r}from"./button-B2dwLL0F.js";import{S as O,a as y}from"./story-section-BVaUEtis.js";import"./preload-helper-PPVm8Dsz.js";import"./index-87WvwnWY.js";import"./action-button-vyGBaIAJ.js";import"./dropdown-menu-BHyRkyrg.js";import"./index-Cz_krX8a.js";import"./index-vbxHKvSM.js";import"./check-DPpRClnn.js";import"./circle-CJX0r14w.js";import"./separator-Bq5mxrnm.js";import"./i18n-D-yzr8ya.js";import"./index-C6yqdqIH.js";const D=[["path",{d:"M14 2v6a2 2 0 0 0 .245.96l5.51 10.08A2 2 0 0 1 18 22H6a2 2 0 0 1-1.755-2.96l5.51-10.08A2 2 0 0 0 10 8V2",key:"18mbvz"}],["path",{d:"M6.453 15h11.094",key:"3shlmq"}],["path",{d:"M8.5 2h7",key:"csnxdl"}]],k=j("flask-conical",D);var I=(e,c,g,l,a,n,x,h)=>{let s=document.documentElement,f=["light","dark"];function d(t){(Array.isArray(e)?e:[e]).forEach(m=>{let C=m==="class",S=C&&n?a.map(T=>n[T]||T):a;C?(s.classList.remove(...S),s.classList.add(n&&n[t]?n[t]:t)):s.setAttribute(m,t)}),b(t)}function b(t){h&&f.includes(t)&&(s.style.colorScheme=t)}function v(){return window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}if(l)d(l);else try{let t=localStorage.getItem(c)||g,m=x&&t==="system"?v():t;d(m)}catch{}},F=u.createContext(void 0),_={setTheme:e=>{},themes:[]},L=()=>{var e;return(e=u.useContext(F))!=null?e:_};u.memo(({forcedTheme:e,storageKey:c,attribute:g,enableSystem:l,enableColorScheme:a,defaultTheme:n,value:x,themes:h,nonce:s,scriptProps:f})=>{let d=JSON.stringify([g,c,n,e,h,x,l,a]).slice(1,-1);return u.createElement("script",{...f,suppressHydrationWarning:!0,nonce:typeof window>"u"?s:"",dangerouslySetInnerHTML:{__html:`(${I.toString()})(${d})`}})});const B=({...e})=>{const{theme:c="system"}=L();return o.jsx(z,{theme:c,className:"toaster group",icons:{success:o.jsx(E,{className:"size-5 text-alert-success-foreground fill-alert-success/20 mt-1"}),info:o.jsx(w,{className:"size-5 text-alert-info-foreground fill-alert-info/20 mt-1"}),warning:o.jsx(N,{className:"size-5 text-alert-warning-foreground fill-alert-warning/20 mt-1"}),error:o.jsx(A,{className:"size-5 text-alert-error-foreground fill-alert-error/20 mt-1"}),loading:o.jsx(U,{className:"size-5 animate-spin text-foreground mt-1"})},style:{"--normal-bg":"var(--popover)","--normal-text":"var(--popover-foreground)","--normal-border":"var(--border)","--border-radius":"var(--radius)"},toastOptions:{classNames:{toast:"!items-start !text-sm !shadow-lg !rounded-lg !gap-3",title:"!text-base-popover-foreground",description:"!text-muted-foreground",actionButton:"!inline-flex !items-center !justify-center !whitespace-nowrap !rounded-md !gap-2 !font-medium !text-xs !h-6 !p-2 !bg-primary !text-primary-foreground !shadow-sm hover:!bg-primary/90 !transition-colors",closeButton:"!text-muted-foreground !border !border-border hover:!bg-accent hover:!text-accent-foreground hover:!opacity-100 !transition-all"}},...e})};B.__docgenInfo={description:"",methods:[],displayName:"Toaster"};const oo={title:"Components/Toasters/Toaster",component:r},p={render:()=>o.jsxs(o.Fragment,{children:[o.jsxs(O,{children:[o.jsx(y,{title:"Default",children:o.jsxs("div",{className:"flex gap-4 items-center",children:[o.jsx(r,{onClick:()=>{i("Title")},color:"primary",children:"Title only"}),o.jsx(r,{onClick:()=>{i("Title",{description:"A description"})},color:"primary",children:"Title Desc"}),o.jsx(r,{onClick:()=>{i("Title",{description:"A description",icon:o.jsx(k,{className:"size-5 text-foreground mt-1"})})},color:"primary",children:"Custom icon"}),o.jsx(r,{onClick:()=>{i("Title",{description:"A description",action:{label:"Undo",onClick:()=>console.log("Undo")}})},color:"primary",children:"Title Desc Action"}),o.jsx(r,{onClick:()=>{i("Title",{description:"A description",action:{label:"Undo",onClick:()=>console.log("Undo")},closeButton:!0})},color:"primary",children:"Title Desc Action Close"}),o.jsx(r,{onClick:()=>{i("Title",{description:"A description",action:{label:"Undo",onClick:()=>console.log("Undo")},closeButton:!0,icon:o.jsx(k,{className:"size-5 text-foreground mt-1"})})},color:"primary",children:"Full options"})]})}),o.jsx(y,{title:"Feedback",children:o.jsxs("div",{className:"flex gap-4 items-center",children:[o.jsx(r,{onClick:()=>{i.info("Title",{description:"A description",action:{label:"Undo",onClick:()=>console.log("Undo")},closeButton:!0})},color:"primary",children:"Open Info Toaster"}),o.jsx(r,{onClick:()=>{i.success("Title",{description:"A description",action:{label:"Undo",onClick:()=>console.log("Undo")},closeButton:!0})},color:"primary",children:"Open Success Toaster"}),o.jsx(r,{onClick:()=>{i.warning("Title",{description:"A description",action:{label:"Undo",onClick:()=>console.log("Undo")},closeButton:!0})},color:"primary",children:"Open Warning Toaster"}),o.jsx(r,{onClick:()=>{i.error("Title",{description:"A description",action:{label:"Undo",onClick:()=>console.log("Undo")},closeButton:!0})},color:"primary",children:"Open Error Toaster"})]})}),o.jsx(y,{title:"Promise",children:o.jsx("div",{className:"flex gap-4 items-center",children:o.jsx(r,{onClick:()=>{i.promise(()=>new Promise(e=>setTimeout(()=>e({name:"Event"}),2e3)),{loading:"Loading...",success:e=>`${e.name} has been created`,error:"Error"})},color:"primary",children:"Promise Toaster"})})})]}),o.jsx(B,{position:"top-right"})]})};p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
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
}`,...p.parameters?.docs?.source}}};const eo=["Default"];export{p as Default,eo as __namedExportsOrder,oo as default};
