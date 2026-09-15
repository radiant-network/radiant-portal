import{n as e,o as t}from"./rolldown-runtime-C0FnF6B9.js";import{t as n}from"./react-BRh_h4kc.js";import{t as r}from"./jsx-runtime-BdxMnOeJ.js";import{n as i,t as a}from"./circle-alert-BunZdy7a.js";import{i as o,n as s,r as c,t as l}from"./circle-x-CdOW_mBh.js";import{n as u,t as d}from"./button-Cn480Lud.js";import{n as f,t as p}from"./flask-conical-BYREMSRM.js";import{n as m,t as h}from"./info-eRAGJ51X.js";import{n as g,t as _}from"./loader-circle-WQOG-vbg.js";import{i as v,n as y,r as b}from"./story-section-DVTm6cGm.js";import{n as x,r as S,t as C}from"./dist-BTVu5ZQv.js";var w,T,E,D,O;function k(){return(k=e((()=>{w=t(n(),1),T=(e,t,n,r,i,a,o,s)=>{let c=document.documentElement,l=[`light`,`dark`];function u(t){(Array.isArray(e)?e:[e]).forEach(e=>{let n=e===`class`,r=n&&a?i.map(e=>a[e]||e):i;n?(c.classList.remove(...r),c.classList.add(a&&a[t]?a[t]:t)):c.setAttribute(e,t)}),d(t)}function d(e){s&&l.includes(e)&&(c.style.colorScheme=e)}function f(){return window.matchMedia(`(prefers-color-scheme: dark)`).matches?`dark`:`light`}if(r)u(r);else try{let e=localStorage.getItem(t)||n;u(o&&e===`system`?f():e)}catch{}},E=w.createContext(void 0),D={setTheme:e=>{},themes:[]},O=()=>w.useContext(E)??D,w.memo(({forcedTheme:e,storageKey:t,attribute:n,enableSystem:r,enableColorScheme:i,defaultTheme:a,value:o,themes:s,nonce:c,scriptProps:l})=>{let u=JSON.stringify([n,t,a,e,s,o,r,i]).slice(1,-1);return w.createElement(`script`,{...l,suppressHydrationWarning:!0,nonce:typeof window>`u`?c:``,dangerouslySetInnerHTML:{__html:`(${T.toString()})(${u})`}})})})))()}var A,j;function M(){return(M=e((()=>{i(),o(),s(),m(),g(),k(),x(),A=r(),j=({...e})=>{let{theme:t=`system`}=O();return(0,A.jsx)(C,{theme:t,className:`toaster group`,icons:{success:(0,A.jsx)(c,{className:`size-5 text-alert-success-foreground fill-alert-success/20 mt-1`}),info:(0,A.jsx)(h,{className:`size-5 text-alert-info-foreground fill-alert-info/20 mt-1`}),warning:(0,A.jsx)(a,{className:`size-5 text-alert-warning-foreground fill-alert-warning/20 mt-1`}),error:(0,A.jsx)(l,{className:`size-5 text-alert-error-foreground fill-alert-error/20 mt-1`}),loading:(0,A.jsx)(_,{className:`size-5 animate-spin text-foreground mt-1`})},style:{"--normal-bg":`var(--popover)`,"--normal-text":`var(--popover-foreground)`,"--normal-border":`var(--border)`,"--border-radius":`var(--radius)`},toastOptions:{classNames:{toast:`!items-start !text-sm !shadow-lg !rounded-lg !gap-3`,title:`!text-base-popover-foreground`,description:`!text-muted-foreground`,actionButton:`!inline-flex !items-center !justify-center !whitespace-nowrap !rounded-md !gap-2 !font-medium !text-xs !h-6 !p-2 !bg-primary !text-primary-foreground !shadow-sm hover:!bg-primary/90 !transition-colors`,closeButton:`!text-muted-foreground !border !border-border hover:!bg-accent hover:!text-accent-foreground hover:!opacity-100 !transition-all`}},...e})},j.__docgenInfo={description:``,methods:[],displayName:`Toaster`}})))()}var N,P,F,I;function L(){return(L=e((()=>{f(),x(),u(),M(),v(),N=r(),P={title:`Components/Toasters/Toaster`,component:d},F={render:()=>(0,N.jsxs)(N.Fragment,{children:[(0,N.jsxs)(b,{children:[(0,N.jsx)(y,{title:`Default`,children:(0,N.jsxs)(`div`,{className:`flex gap-4 items-center`,children:[(0,N.jsx)(d,{onClick:()=>{S(`Title`)},color:`primary`,children:`Title only`}),(0,N.jsx)(d,{onClick:()=>{S(`Title`,{description:`A description`})},color:`primary`,children:`Title Desc`}),(0,N.jsx)(d,{onClick:()=>{S(`Title`,{description:`A description`,icon:(0,N.jsx)(p,{className:`size-5 text-foreground mt-1`})})},color:`primary`,children:`Custom icon`}),(0,N.jsx)(d,{onClick:()=>{S(`Title`,{description:`A description`,action:{label:`Undo`,onClick:()=>console.log(`Undo`)}})},color:`primary`,children:`Title Desc Action`}),(0,N.jsx)(d,{onClick:()=>{S(`Title`,{description:`A description`,action:{label:`Undo`,onClick:()=>console.log(`Undo`)},closeButton:!0})},color:`primary`,children:`Title Desc Action Close`}),(0,N.jsx)(d,{onClick:()=>{S(`Title`,{description:`A description`,action:{label:`Undo`,onClick:()=>console.log(`Undo`)},closeButton:!0,icon:(0,N.jsx)(p,{className:`size-5 text-foreground mt-1`})})},color:`primary`,children:`Full options`})]})}),(0,N.jsx)(y,{title:`Feedback`,children:(0,N.jsxs)(`div`,{className:`flex gap-4 items-center`,children:[(0,N.jsx)(d,{onClick:()=>{S.info(`Title`,{description:`A description`,action:{label:`Undo`,onClick:()=>console.log(`Undo`)},closeButton:!0})},color:`primary`,children:`Open Info Toaster`}),(0,N.jsx)(d,{onClick:()=>{S.success(`Title`,{description:`A description`,action:{label:`Undo`,onClick:()=>console.log(`Undo`)},closeButton:!0})},color:`primary`,children:`Open Success Toaster`}),(0,N.jsx)(d,{onClick:()=>{S.warning(`Title`,{description:`A description`,action:{label:`Undo`,onClick:()=>console.log(`Undo`)},closeButton:!0})},color:`primary`,children:`Open Warning Toaster`}),(0,N.jsx)(d,{onClick:()=>{S.error(`Title`,{description:`A description`,action:{label:`Undo`,onClick:()=>console.log(`Undo`)},closeButton:!0})},color:`primary`,children:`Open Error Toaster`})]})}),(0,N.jsx)(y,{title:`Promise`,children:(0,N.jsx)(`div`,{className:`flex gap-4 items-center`,children:(0,N.jsx)(d,{onClick:()=>{S.promise(()=>new Promise(e=>setTimeout(()=>e({name:`Event`}),2e3)),{loading:`Loading...`,success:e=>`${e.name} has been created`,error:`Error`})},color:`primary`,children:`Promise Toaster`})})})]}),(0,N.jsx)(j,{position:`top-right`})]})},F.parameters={...F.parameters,docs:{...F.parameters?.docs,source:{originalSource:`{
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
}`,...F.parameters?.docs?.source}}},I=[`Default`]})))()}L();export{F as Default,I as __namedExportsOrder,P as default};