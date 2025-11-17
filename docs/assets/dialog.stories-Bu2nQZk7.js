import{j as e}from"./jsx-runtime-D_zvdyIk.js";import{r as c}from"./index-CGj_12n1.js";import{B as r}from"./button-cSejB-pP.js";import{D as t,a as d,b as p,c as g,d as m,e as D,f as x,g as h}from"./dialog-D8H4qXag.js";import"./index-B7CJuYpG.js";import"./index-D8dqFcAi.js";import"./index-BBPXtLXU.js";import"./action-button-DglMD9AQ.js";import"./utils-D-KgF5mV.js";import"./dropdown-menu-CxUCUeqn.js";import"./index-CcLUv2_A.js";import"./index-C8qycyLa.js";import"./index-Ch7hUksi.js";import"./Combination-DwMjbv-J.js";import"./index-DceihmLw.js";import"./index-A6VgBoaw.js";import"./index-CRLeYu_h.js";import"./index-CIckazZy.js";import"./check-DRc1RmCY.js";import"./createLucideIcon-8Lr1oLzj.js";import"./separator-IJKoE26K.js";import"./button.variants-Du9eY_ux.js";import"./index-C66Dxnp2.js";import"./spinner-BMSZ66Eg.js";import"./tooltip-anNhU4TT.js";import"./index-BDsjCN7N.js";import"./i18n-rU8y34_5.js";import"./iframe-H88FuVDc.js";import"./i18next-DOi7g2fS.js";import"./index-CosFuvvC.js";import"./x-CubKniSv.js";const ae={title:"Modals/Dialog",component:t,args:{}},i={args:{},render:u=>{const[n,o]=c.useState(!1);return e.jsxs(t,{open:n,onOpenChange:o,children:[e.jsx(d,{children:e.jsx(r,{onClick:()=>o(!0),children:"Open"})}),e.jsxs(p,{children:[e.jsxs(g,{children:[e.jsx(m,{children:"Dialog Title"}),e.jsx(D,{children:"Dialog Description"})]}),e.jsx(x,{children:e.jsx("div",{className:"flex items-center justify-center text-sm border border-dashed border-primary bg-primary/10 rounded h-40",children:"Slot (swap it with your content)"})}),e.jsx(h,{children:e.jsx(r,{onClick:()=>o(!1),children:"Close"})})]})]})}},s={args:{},render:u=>{const[n,o]=c.useState(!1);return e.jsxs(t,{open:n,onOpenChange:o,children:[e.jsx(d,{children:e.jsx(r,{onClick:()=>o(!0),children:"Open"})}),e.jsxs(p,{variant:"stickyHeader",className:"h-[300px]",children:[e.jsxs(g,{className:"sticky top-0",children:[e.jsx(m,{children:"Dialog Title"}),e.jsx(D,{children:"Dialog Description"})]}),e.jsxs("div",{className:"overflow-auto",children:[e.jsx(x,{children:e.jsx("div",{className:"flex items-center justify-center text-sm border border-dashed border-primary bg-primary/10 rounded h-40",children:"Slot (swap it with your content)"})}),e.jsx(h,{children:e.jsx(r,{onClick:()=>o(!1),children:"Close"})})]})]})]})}},a={args:{},render:u=>{const[n,o]=c.useState(!1);return e.jsxs(t,{open:n,onOpenChange:o,children:[e.jsx(d,{children:e.jsx(r,{onClick:()=>o(!0),children:"Open"})}),e.jsxs(p,{variant:"stickyFooter",className:"h-[300px]",children:[e.jsxs("div",{className:"overflow-auto",children:[e.jsxs(g,{children:[e.jsx(m,{children:"Dialog Title"}),e.jsx(D,{children:"Dialog Description"})]}),e.jsx(x,{children:e.jsx("div",{className:"flex items-center justify-center text-sm border border-dashed border-primary bg-primary/10 rounded h-56",children:"Slot (swap it with your content)"})})]}),e.jsx(h,{children:e.jsx(r,{onClick:()=>o(!1),children:"Close"})})]})]})}},l={args:{},render:u=>{const[n,o]=c.useState(!1);return e.jsxs(t,{open:n,onOpenChange:o,children:[e.jsx(d,{children:e.jsx(r,{onClick:()=>o(!0),children:"Open"})}),e.jsxs(p,{variant:"stickyBoth",className:"h-[300px]",children:[e.jsxs(g,{children:[e.jsx(m,{children:"Dialog Title"}),e.jsx(D,{children:"Dialog Description"})]}),e.jsx("div",{className:"overflow-auto px-6 py-4",children:e.jsx("div",{className:"flex items-center justify-center text-sm border border-dashed border-primary bg-primary/10 rounded h-56",children:"Slot (swap it with your content)"})}),e.jsx(h,{children:e.jsx(r,{onClick:()=>o(!1),children:"Close"})})]})]})}};var j,y,f;i.parameters={...i.parameters,docs:{...(j=i.parameters)==null?void 0:j.docs,source:{originalSource:`{
  args: {},
  render: args => {
    const [open, setOpen] = useState<boolean>(false);
    return <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger>
          <Button onClick={() => setOpen(true)}>Open</Button>
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
            <Button onClick={() => setOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>;
  }
}`,...(f=(y=i.parameters)==null?void 0:y.docs)==null?void 0:f.source}}};var C,b,O;s.parameters={...s.parameters,docs:{...(C=s.parameters)==null?void 0:C.docs,source:{originalSource:`{
  args: {},
  render: args => {
    const [open, setOpen] = useState<boolean>(false);
    return <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger>
          <Button onClick={() => setOpen(true)}>Open</Button>
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
              <Button onClick={() => setOpen(false)}>Close</Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>;
  }
}`,...(O=(b=s.parameters)==null?void 0:b.docs)==null?void 0:O.source}}};var v,k,B;a.parameters={...a.parameters,docs:{...(v=a.parameters)==null?void 0:v.docs,source:{originalSource:`{
  args: {},
  render: args => {
    const [open, setOpen] = useState<boolean>(false);
    return <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger>
          <Button onClick={() => setOpen(true)}>Open</Button>
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
            <Button onClick={() => setOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>;
  }
}`,...(B=(k=a.parameters)==null?void 0:k.docs)==null?void 0:B.source}}};var S,T,w;l.parameters={...l.parameters,docs:{...(S=l.parameters)==null?void 0:S.docs,source:{originalSource:`{
  args: {},
  render: args => {
    const [open, setOpen] = useState<boolean>(false);
    return <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger>
          <Button onClick={() => setOpen(true)}>Open</Button>
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
            <Button onClick={() => setOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>;
  }
}`,...(w=(T=l.parameters)==null?void 0:T.docs)==null?void 0:w.source}}};const le=["Default","StickyHeader","StickyFooter","StickyBoth"];export{i as Default,l as StickyBoth,a as StickyFooter,s as StickyHeader,le as __namedExportsOrder,ae as default};
