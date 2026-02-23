import{g as N,r as u,j as o,ak as w,U as E,C as z,a6 as O,as as S}from"./iframe-ZUKLh1y0.js";import{T as D,t as n}from"./index-B6ft-1rc.js";import{B as r}from"./button-Dpxyi3qN.js";import"./preload-helper-Dp1pzeXC.js";import"./index-CG-ZRbHY.js";import"./action-button-CS0baHSH.js";import"./dropdown-menu-lWueQF7S.js";import"./index-BlRbp4g_.js";import"./circle-DQ25Nq_E.js";import"./check-tJGMWMh_.js";import"./separator-BkcTXRGq.js";import"./i18n-Dldl3Adp.js";/**
 * @license lucide-react v0.482.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const I=[["path",{d:"M14 2v6a2 2 0 0 0 .245.96l5.51 10.08A2 2 0 0 1 18 22H6a2 2 0 0 1-1.755-2.96l5.51-10.08A2 2 0 0 0 10 8V2",key:"18mbvz"}],["path",{d:"M6.453 15h11.094",key:"3shlmq"}],["path",{d:"M8.5 2h7",key:"csnxdl"}]],k=N("FlaskConical",I);var F=(e,l,g,c,a,i,x,h)=>{let s=document.documentElement,f=["light","dark"];function d(t){(Array.isArray(e)?e:[e]).forEach(m=>{let T=m==="class",A=T&&i?a.map(C=>i[C]||C):a;T?(s.classList.remove(...A),s.classList.add(i&&i[t]?i[t]:t)):s.setAttribute(m,t)}),j(t)}function j(t){h&&f.includes(t)&&(s.style.colorScheme=t)}function U(){return window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}if(c)d(c);else try{let t=localStorage.getItem(l)||g,m=x&&t==="system"?U():t;d(m)}catch{}},_=u.createContext(void 0),L={setTheme:e=>{},themes:[]},P=()=>{var e;return(e=u.useContext(_))!=null?e:L};u.memo(({forcedTheme:e,storageKey:l,attribute:g,enableSystem:c,enableColorScheme:a,defaultTheme:i,value:x,themes:h,nonce:s,scriptProps:f})=>{let d=JSON.stringify([g,l,i,e,h,x,c,a]).slice(1,-1);return u.createElement("script",{...f,suppressHydrationWarning:!0,nonce:typeof window>"u"?s:"",dangerouslySetInnerHTML:{__html:`(${F.toString()})(${d})`}})});const b=({...e})=>{const{theme:l="system"}=P();return o.jsx(D,{theme:l,className:"toaster group",icons:{success:o.jsx(S,{className:"size-5 text-alert-success-foreground fill-alert-success/20 mt-1"}),info:o.jsx(O,{className:"size-5 text-alert-info-foreground fill-alert-info/20 mt-1"}),warning:o.jsx(z,{className:"size-5 text-alert-warning-foreground fill-alert-warning/20 mt-1"}),error:o.jsx(E,{className:"size-5 text-alert-error-foreground fill-alert-error/20 mt-1"}),loading:o.jsx(w,{className:"size-5 animate-spin text-foreground mt-1"})},style:{"--normal-bg":"var(--popover)","--normal-text":"var(--popover-foreground)","--normal-border":"var(--border)","--border-radius":"var(--radius)"},toastOptions:{classNames:{toast:"!items-start !text-sm !shadow-lg !rounded-lg !gap-3",title:"!text-base-popover-foreground",description:"!text-muted-foreground",actionButton:"!inline-flex !items-center !justify-center !whitespace-nowrap !rounded-md !gap-2 !font-medium !text-xs !h-6 !p-2 !bg-primary !text-primary-foreground !shadow-sm hover:!bg-primary/90 !transition-colors",closeButton:"!text-muted-foreground !border !border-border hover:!bg-accent hover:!text-accent-foreground hover:!opacity-100 !transition-all"}},...e})};b.__docgenInfo={description:"",methods:[],displayName:"Toaster"};const Y={title:"Toasters/Toaster",component:r},p={render:()=>o.jsxs("div",{className:"flex flex-col gap-4",children:[o.jsx("h4",{children:"Default Toaster"}),o.jsxs("div",{className:"flex gap-4 items-center",children:[o.jsx(r,{onClick:()=>{n("Title")},color:"primary",children:"Title only"}),o.jsx(r,{onClick:()=>{n("Title",{description:"A description"})},color:"primary",children:"Title Desc"}),o.jsx(r,{onClick:()=>{n("Title",{description:"A description",icon:o.jsx(k,{className:"size-5 text-foreground mt-1"})})},color:"primary",children:"Custom icon"}),o.jsx(r,{onClick:()=>{n("Title",{description:"A description",action:{label:"Undo",onClick:()=>console.log("Undo")}})},color:"primary",children:"Title Desc Action"}),o.jsx(r,{onClick:()=>{n("Title",{description:"A description",action:{label:"Undo",onClick:()=>console.log("Undo")},closeButton:!0})},color:"primary",children:"Title Desc Action Close"}),o.jsx(r,{onClick:()=>{n("Title",{description:"A description",action:{label:"Undo",onClick:()=>console.log("Undo")},closeButton:!0,icon:o.jsx(k,{className:"size-5 text-foreground mt-1"})})},color:"primary",children:"Full options"})]}),o.jsx("h4",{children:"Feedback Toaster"}),o.jsxs("div",{className:"flex gap-4 items-center",children:[o.jsx(r,{onClick:()=>{n.info("Title",{description:"A description",action:{label:"Undo",onClick:()=>console.log("Undo")},closeButton:!0})},color:"primary",children:"Open Info Toaster"}),o.jsx(r,{onClick:()=>{n.success("Title",{description:"A description",action:{label:"Undo",onClick:()=>console.log("Undo")},closeButton:!0})},color:"primary",children:"Open Success Toaster"}),o.jsx(r,{onClick:()=>{n.warning("Title",{description:"A description",action:{label:"Undo",onClick:()=>console.log("Undo")},closeButton:!0})},color:"primary",children:"Open Warning Toaster"}),o.jsx(r,{onClick:()=>{n.error("Title",{description:"A description",action:{label:"Undo",onClick:()=>console.log("Undo")},closeButton:!0})},color:"primary",children:"Open Error Toaster"})]}),o.jsx("h4",{children:"Promise Toaster"}),o.jsx("div",{className:"flex gap-4 items-center",children:o.jsx(r,{onClick:()=>{n.promise(()=>new Promise(e=>setTimeout(()=>e({name:"Event"}),2e3)),{loading:"Loading...",success:e=>`${e.name} has been created`,error:"Error"})},color:"primary",children:"Promise Toaster"})}),o.jsx(b,{position:"top-right"})]})};var y,B,v;p.parameters={...p.parameters,docs:{...(y=p.parameters)==null?void 0:y.docs,source:{originalSource:`{
  render: () => <div className="flex flex-col gap-4">
      <h4>Default Toaster</h4>
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
      <h4>Feedback Toaster</h4>
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
      <h4>Promise Toaster</h4>
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
      <Toaster position="top-right" />
    </div>
}`,...(v=(B=p.parameters)==null?void 0:B.docs)==null?void 0:v.source}}};const Z=["Default"];export{p as Default,Z as __namedExportsOrder,Y as default};
