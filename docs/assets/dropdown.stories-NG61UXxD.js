import{j as e}from"./jsx-runtime-Cf8x2fCZ.js";import{B as c}from"./button-DxOOzeBY.js";import{D as s,a as h,b as w,d as l,e as m,c as o,f as u,g as R,h as p}from"./dropdown-menu-xf-jiMEf.js";import{r as a}from"./index-t5q4d8OJ.js";import{C as D}from"./chevron-down-B0uzl_ed.js";import"./index-yBjzXJbu.js";import"./index-Bjkhh2p3.js";import"./index-CC5eZYhG.js";import"./index-fNjTmf9T.js";import"./ActionButton-D4jVLNva.js";import"./utils-CytzSlOG.js";import"./button.variants-B79LQKoe.js";import"./index-C66Dxnp2.js";import"./ellipsis-e_tKH1yv.js";import"./createLucideIcon-BOZfVBeY.js";import"./spinner-BoKAmKqu.js";import"./index-KhTUl610.js";import"./Combination-CdAak5pT.js";import"./index-BiFLoO8l.js";import"./index-CTFHtJli.js";import"./index-V1T-MO6M.js";import"./check-1JYhj4AL.js";const $={title:"Navigation/DropDown Menu",component:s,args:{}},n={args:{},render:()=>e.jsxs(s,{children:[e.jsx(h,{asChild:!0,children:e.jsxs(c,{variant:"outline",children:["Dropdown ",e.jsx(D,{})]})}),e.jsxs(w,{children:[e.jsx(l,{children:"My Account"}),e.jsx(m,{}),e.jsx(o,{children:"Profile"}),e.jsx(o,{children:"Billing"}),e.jsx(o,{children:"Team"}),e.jsx(o,{children:"Subscription"})]})]})},r={args:{},render:()=>{const[d,i]=a.useState(!0),[k,I]=a.useState(!1),[P,f]=a.useState(!1);return e.jsxs(s,{children:[e.jsx(h,{asChild:!0,children:e.jsxs(c,{variant:"outline",children:["Dropdown ",e.jsx(D,{})]})}),e.jsxs(w,{className:"w-56",children:[e.jsx(l,{children:"Appearance"}),e.jsx(m,{}),e.jsx(u,{checked:d,onCheckedChange:i,children:"Status Bar"}),e.jsx(u,{checked:k,onCheckedChange:I,disabled:!0,children:"Activity Bar"}),e.jsx(u,{checked:P,onCheckedChange:f,children:"Panel"})]})]})}},t={args:{},render:()=>{const[d,i]=a.useState("bottom");return e.jsxs(s,{children:[e.jsx(h,{asChild:!0,children:e.jsxs(c,{variant:"outline",children:["Dropdown ",e.jsx(D,{})]})}),e.jsxs(w,{className:"w-56",children:[e.jsx(l,{children:"Panel Position"}),e.jsx(m,{}),e.jsxs(R,{value:d,onValueChange:i,children:[e.jsx(p,{value:"top",children:"Top"}),e.jsx(p,{value:"bottom",children:"Bottom"}),e.jsx(p,{value:"right",children:"Right"})]})]})]})}};var M,x,C;n.parameters={...n.parameters,docs:{...(M=n.parameters)==null?void 0:M.docs,source:{originalSource:`{
  args: {},
  render: () => {
    return <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">
            Dropdown <ChevronDown />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Profile</DropdownMenuItem>
          <DropdownMenuItem>Billing</DropdownMenuItem>
          <DropdownMenuItem>Team</DropdownMenuItem>
          <DropdownMenuItem>Subscription</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>;
  }
}`,...(C=(x=n.parameters)==null?void 0:x.docs)==null?void 0:C.source}}};var g,j,S;r.parameters={...r.parameters,docs:{...(g=r.parameters)==null?void 0:g.docs,source:{originalSource:`{
  args: {},
  render: () => {
    const [showStatusBar, setShowStatusBar] = useState<Checked>(true);
    const [showActivityBar, setShowActivityBar] = useState<Checked>(false);
    const [showPanel, setShowPanel] = useState<Checked>(false);
    return <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">
            Dropdown <ChevronDown />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel>Appearance</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuCheckboxItem checked={showStatusBar} onCheckedChange={setShowStatusBar}>
            Status Bar
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem checked={showActivityBar} onCheckedChange={setShowActivityBar} disabled>
            Activity Bar
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem checked={showPanel} onCheckedChange={setShowPanel}>
            Panel
          </DropdownMenuCheckboxItem>
        </DropdownMenuContent>
      </DropdownMenu>;
  }
}`,...(S=(j=r.parameters)==null?void 0:j.docs)==null?void 0:S.source}}};var B,v,b;t.parameters={...t.parameters,docs:{...(B=t.parameters)==null?void 0:B.docs,source:{originalSource:`{
  args: {},
  render: () => {
    const [position, setPosition] = useState('bottom');
    return <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">
            Dropdown <ChevronDown />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel>Panel Position</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuRadioGroup value={position} onValueChange={setPosition}>
            <DropdownMenuRadioItem value="top">Top</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="bottom">Bottom</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="right">Right</DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>;
  }
}`,...(b=(v=t.parameters)==null?void 0:v.docs)==null?void 0:b.source}}};const ee=["Defaut","Checkboxes","RadioGroup"];export{r as Checkboxes,n as Defaut,t as RadioGroup,ee as __namedExportsOrder,$ as default};
