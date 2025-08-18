import{j as e}from"./jsx-runtime-D_zvdyIk.js";import{D as o,a as s,b as l,c as d,d as c,e as g,f as m,g as p}from"./dialog-T07bgruI.js";import{B as r}from"./button-Bs-TudSh.js";import"./index-CGj_12n1.js";import"./index-CGTI_uD1.js";import"./index-CcLUv2_A.js";import"./index-COcwYKbe.js";import"./index-D8dqFcAi.js";import"./index-BBPXtLXU.js";import"./index-CIckazZy.js";import"./index-CphM_NEg.js";import"./Combination-Bb6GvI2f.js";import"./index-CKNrATXZ.js";import"./index-C66Dxnp2.js";import"./utils-D-KgF5mV.js";import"./x-CubKniSv.js";import"./createLucideIcon-8Lr1oLzj.js";import"./ActionButton-3Jbj_BdW.js";import"./dropdown-menu-CdOBzT_z.js";import"./index-CbbSLEvm.js";import"./index-A6VgBoaw.js";import"./check-DRc1RmCY.js";import"./button.variants-BQkt_1YJ.js";import"./ellipsis-BM4jpslE.js";import"./spinner-BMSZ66Eg.js";import"./tooltip-Bh6uXa7k.js";import"./i18n-EepRExeP.js";import"./iframe-DkFsQxjM.js";import"./context-DkqwYzW-.js";const oe={title:"Modals/Dialog",component:o,args:{}},i={args:{},render:D=>e.jsxs(o,{children:[e.jsx(s,{children:e.jsx(r,{children:"Open"})}),e.jsxs(l,{children:[e.jsxs(d,{children:[e.jsx(c,{children:"Dialog Title"}),e.jsx(g,{children:"Dialog Description"})]}),e.jsx(m,{children:e.jsx("div",{className:"flex items-center justify-center text-sm border border-dashed border-primary bg-primary/10 rounded h-40",children:"Slot (swap it with your content)"})}),e.jsx(p,{children:e.jsx(r,{children:"Close"})})]})]})},t={args:{},render:D=>e.jsxs(o,{children:[e.jsx(s,{children:e.jsx(r,{children:"Open"})}),e.jsxs(l,{variant:"stickyHeader",className:"h-[300px]",children:[e.jsxs(d,{className:"sticky top-0",children:[e.jsx(c,{children:"Dialog Title"}),e.jsx(g,{children:"Dialog Description"})]}),e.jsxs("div",{className:"overflow-auto",children:[e.jsx(m,{children:e.jsx("div",{className:"flex items-center justify-center text-sm border border-dashed border-primary bg-primary/10 rounded h-40",children:"Slot (swap it with your content)"})}),e.jsx(p,{children:e.jsx(r,{children:"Close"})})]})]})]})},a={args:{},render:D=>e.jsxs(o,{children:[e.jsx(s,{children:e.jsx(r,{children:"Open"})}),e.jsxs(l,{variant:"stickyFooter",className:"h-[300px]",children:[e.jsxs("div",{className:"overflow-auto",children:[e.jsxs(d,{children:[e.jsx(c,{children:"Dialog Title"}),e.jsx(g,{children:"Dialog Description"})]}),e.jsx(m,{children:e.jsx("div",{className:"flex items-center justify-center text-sm border border-dashed border-primary bg-primary/10 rounded h-56",children:"Slot (swap it with your content)"})})]}),e.jsx(p,{children:e.jsx(r,{children:"Close"})})]})]})},n={args:{},render:D=>e.jsxs(o,{children:[e.jsx(s,{children:e.jsx(r,{children:"Open"})}),e.jsxs(l,{variant:"stickyBoth",className:"h-[300px]",children:[e.jsxs(d,{children:[e.jsx(c,{children:"Dialog Title"}),e.jsx(g,{children:"Dialog Description"})]}),e.jsx("div",{className:"overflow-auto px-6 py-4",children:e.jsx("div",{className:"flex items-center justify-center text-sm border border-dashed border-primary bg-primary/10 rounded h-56",children:"Slot (swap it with your content)"})}),e.jsx(p,{children:e.jsx(r,{children:"Close"})})]})]})};var h,x,u;i.parameters={...i.parameters,docs:{...(h=i.parameters)==null?void 0:h.docs,source:{originalSource:`{
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
        <DialogBody>
          <div className="flex items-center justify-center text-sm border border-dashed border-primary bg-primary/10 rounded h-40">
            Slot (swap it with your content)
          </div>
        </DialogBody>
        <DialogFooter>
          <Button>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
}`,...(u=(x=i.parameters)==null?void 0:x.docs)==null?void 0:u.source}}};var j,y,b;t.parameters={...t.parameters,docs:{...(j=t.parameters)==null?void 0:j.docs,source:{originalSource:`{
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
          <DialogBody>
            <div className="flex items-center justify-center text-sm border border-dashed border-primary bg-primary/10 rounded h-40">
              Slot (swap it with your content)
            </div>
          </DialogBody>
          <DialogFooter>
            <Button>Close</Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
}`,...(b=(y=t.parameters)==null?void 0:y.docs)==null?void 0:b.source}}};var v,f,B;a.parameters={...a.parameters,docs:{...(v=a.parameters)==null?void 0:v.docs,source:{originalSource:`{
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
          <DialogBody>
            <div className="flex items-center justify-center text-sm border border-dashed border-primary bg-primary/10 rounded h-56">
              Slot (swap it with your content)
            </div>
          </DialogBody>
        </div>
        <DialogFooter>
          <Button>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
}`,...(B=(f=a.parameters)==null?void 0:f.docs)==null?void 0:B.source}}};var T,w,N;n.parameters={...n.parameters,docs:{...(T=n.parameters)==null?void 0:T.docs,source:{originalSource:`{
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
}`,...(N=(w=n.parameters)==null?void 0:w.docs)==null?void 0:N.source}}};const ie=["Default","StickyHeader","StickyFooter","StickyBoth"];export{i as Default,n as StickyBoth,a as StickyFooter,t as StickyHeader,ie as __namedExportsOrder,oe as default};
