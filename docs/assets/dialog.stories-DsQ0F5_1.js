import{j as e}from"./jsx-runtime-D_zvdyIk.js";import{D as i,a as s,b as l,c as d,d as c,e as g,f as p}from"./dialog-DT2vT3g-.js";import{B as r}from"./button-C2wdHN5o.js";import"./index-CGTI_uD1.js";import"./index-CGj_12n1.js";import"./index-CcLUv2_A.js";import"./index-COcwYKbe.js";import"./index-D8dqFcAi.js";import"./index-BBPXtLXU.js";import"./index-CIckazZy.js";import"./index-CphM_NEg.js";import"./Combination-Bb6GvI2f.js";import"./index-CKNrATXZ.js";import"./utils-D-KgF5mV.js";import"./index-C66Dxnp2.js";import"./x-CubKniSv.js";import"./createLucideIcon-8Lr1oLzj.js";import"./ActionButton-3Jbj_BdW.js";import"./dropdown-menu-CdOBzT_z.js";import"./index-CbbSLEvm.js";import"./index-A6VgBoaw.js";import"./check-DRc1RmCY.js";import"./button.variants-BQkt_1YJ.js";import"./ellipsis-BM4jpslE.js";import"./spinner-BMSZ66Eg.js";import"./tooltip-Bh6uXa7k.js";import"./i18n-CjMoR66Y.js";import"./iframe-CWLgbHqd.js";import"./context-DkqwYzW-.js";const re={title:"Modals/Dialog",component:i,args:{}},o={args:{},render:m=>e.jsxs(i,{children:[e.jsx(s,{children:e.jsx(r,{children:"Open"})}),e.jsxs(l,{children:[e.jsxs(d,{children:[e.jsx(c,{children:"Dialog Title"}),e.jsx(g,{children:"Dialog Description"})]}),e.jsx("div",{className:"px-6 py-4",children:e.jsx("div",{className:"flex items-center justify-center text-sm border border-dashed border-primary bg-primary/10 rounded h-40",children:"Slot (swap it with your content)"})}),e.jsx(p,{children:e.jsx(r,{children:"Close"})})]})]})},t={args:{},render:m=>e.jsxs(i,{children:[e.jsx(s,{children:e.jsx(r,{children:"Open"})}),e.jsxs(l,{variant:"stickyHeader",className:"h-[300px]",children:[e.jsxs(d,{className:"sticky top-0",children:[e.jsx(c,{children:"Dialog Title"}),e.jsx(g,{children:"Dialog Description"})]}),e.jsxs("div",{className:"overflow-auto",children:[e.jsx("div",{className:"px-6 py-4",children:e.jsx("div",{className:"flex items-center justify-center text-sm border border-dashed border-primary bg-primary/10 rounded h-40",children:"Slot (swap it with your content)"})}),e.jsx(p,{children:e.jsx(r,{children:"Close"})})]})]})]})},a={args:{},render:m=>e.jsxs(i,{children:[e.jsx(s,{children:e.jsx(r,{children:"Open"})}),e.jsxs(l,{variant:"stickyFooter",className:"h-[300px]",children:[e.jsxs("div",{className:"overflow-auto",children:[e.jsxs(d,{children:[e.jsx(c,{children:"Dialog Title"}),e.jsx(g,{children:"Dialog Description"})]}),e.jsx("div",{className:"px-6 py-4",children:e.jsx("div",{className:"flex items-center justify-center text-sm border border-dashed border-primary bg-primary/10 rounded h-56",children:"Slot (swap it with your content)"})})]}),e.jsx(p,{children:e.jsx(r,{children:"Close"})})]})]})},n={args:{},render:m=>e.jsxs(i,{children:[e.jsx(s,{children:e.jsx(r,{children:"Open"})}),e.jsxs(l,{variant:"stickyBoth",className:"h-[300px]",children:[e.jsxs(d,{children:[e.jsx(c,{children:"Dialog Title"}),e.jsx(g,{children:"Dialog Description"})]}),e.jsx("div",{className:"overflow-auto px-6 py-4",children:e.jsx("div",{className:"flex items-center justify-center text-sm border border-dashed border-primary bg-primary/10 rounded h-56",children:"Slot (swap it with your content)"})}),e.jsx(p,{children:e.jsx(r,{children:"Close"})})]})]})};var D,h,x;o.parameters={...o.parameters,docs:{...(D=o.parameters)==null?void 0:D.docs,source:{originalSource:`{
  args: {},
  render: args => <Dialog>
      <DialogTrigger>
        <Button>Open</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Dialog Title</DialogTitle>
          <DialogDescription>Dialog Description</DialogDescription>
        </DialogHeader>
        <div className="px-6 py-4">
          <div className="flex items-center justify-center text-sm border border-dashed border-primary bg-primary/10 rounded h-40">
            Slot (swap it with your content)
          </div>
        </div>
        <DialogFooter>
          <Button>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
}`,...(x=(h=o.parameters)==null?void 0:h.docs)==null?void 0:x.source}}};var u,j,y;t.parameters={...t.parameters,docs:{...(u=t.parameters)==null?void 0:u.docs,source:{originalSource:`{
  args: {},
  render: args => <Dialog>
      <DialogTrigger>
        <Button>Open</Button>
      </DialogTrigger>
      <DialogContent variant="stickyHeader" className="h-[300px]">
        <DialogHeader className="sticky top-0">
          <DialogTitle>Dialog Title</DialogTitle>
          <DialogDescription>Dialog Description</DialogDescription>
        </DialogHeader>
        <div className="overflow-auto">
          <div className="px-6 py-4">
            <div className="flex items-center justify-center text-sm border border-dashed border-primary bg-primary/10 rounded h-40">
              Slot (swap it with your content)
            </div>
          </div>
          <DialogFooter>
            <Button>Close</Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
}`,...(y=(j=t.parameters)==null?void 0:j.docs)==null?void 0:y.source}}};var v,b,f;a.parameters={...a.parameters,docs:{...(v=a.parameters)==null?void 0:v.docs,source:{originalSource:`{
  args: {},
  render: args => <Dialog>
      <DialogTrigger>
        <Button>Open</Button>
      </DialogTrigger>
      <DialogContent variant="stickyFooter" className="h-[300px]">
        <div className="overflow-auto">
          <DialogHeader>
            <DialogTitle>Dialog Title</DialogTitle>
            <DialogDescription>Dialog Description</DialogDescription>
          </DialogHeader>
          <div className="px-6 py-4">
            <div className="flex items-center justify-center text-sm border border-dashed border-primary bg-primary/10 rounded h-56">
              Slot (swap it with your content)
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
}`,...(f=(b=a.parameters)==null?void 0:b.docs)==null?void 0:f.source}}};var N,T,w;n.parameters={...n.parameters,docs:{...(N=n.parameters)==null?void 0:N.docs,source:{originalSource:`{
  args: {},
  render: args => <Dialog>
      <DialogTrigger>
        <Button>Open</Button>
      </DialogTrigger>
      <DialogContent variant="stickyBoth" className="h-[300px]">
        <DialogHeader>
          <DialogTitle>Dialog Title</DialogTitle>
          <DialogDescription>Dialog Description</DialogDescription>
        </DialogHeader>
        <div className="overflow-auto px-6 py-4">
          <div className="flex items-center justify-center text-sm border border-dashed border-primary bg-primary/10 rounded h-56">
            Slot (swap it with your content)
          </div>
        </div>
        <DialogFooter>
          <Button>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
}`,...(w=(T=n.parameters)==null?void 0:T.docs)==null?void 0:w.source}}};const ie=["Default","StickyHeader","StickyFooter","StickyBoth"];export{o as Default,n as StickyBoth,a as StickyFooter,t as StickyHeader,ie as __namedExportsOrder,re as default};
