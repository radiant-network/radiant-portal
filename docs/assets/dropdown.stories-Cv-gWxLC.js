import{j as e}from"./jsx-runtime-D_zvdyIk.js";import{B as c}from"./button-CM5DEq1j.js";import{D as s,a as h,b as w,d as l,e as m,c as o,f as u,g as R,h as p}from"./dropdown-menu-DGmzL58B.js";import{r as a}from"./index-DQLiH3RP.js";import{C as D}from"./chevron-down-QEmn0_AS.js";import"./index-b4Krvw3J.js";import"./index-CECE1b4A.js";import"./index-CJPVTaBz.js";import"./ActionButton-DuC4fis2.js";import"./utils-D-KgF5mV.js";import"./button.variants-BQkt_1YJ.js";import"./index-C66Dxnp2.js";import"./ellipsis-BtlAG3ey.js";import"./createLucideIcon-BMP5cxO1.js";import"./spinner-DHVcj7-u.js";import"./tooltip-2a7OmUZw.js";import"./index-DZeBqZZX.js";import"./index-CS2et-gJ.js";import"./index-BlJj-Uol.js";import"./i18n-Da450cti.js";import"./iframe-B-c5X26M.js";import"./check-DSCf8CVO.js";import"./index-CKWZTibS.js";const ee={title:"Navigation/DropDown Menu",component:s,args:{}},n={args:{},render:()=>e.jsxs(s,{children:[e.jsx(h,{asChild:!0,children:e.jsxs(c,{variant:"outline",children:["Dropdown ",e.jsx(D,{})]})}),e.jsxs(w,{children:[e.jsx(l,{children:"My Account"}),e.jsx(m,{}),e.jsx(o,{children:"Profile"}),e.jsx(o,{children:"Billing"}),e.jsx(o,{children:"Team"}),e.jsx(o,{children:"Subscription"})]})]})},r={args:{},render:()=>{const[d,i]=a.useState(!0),[k,I]=a.useState(!1),[P,f]=a.useState(!1);return e.jsxs(s,{children:[e.jsx(h,{asChild:!0,children:e.jsxs(c,{variant:"outline",children:["Dropdown ",e.jsx(D,{})]})}),e.jsxs(w,{className:"w-56",children:[e.jsx(l,{children:"Appearance"}),e.jsx(m,{}),e.jsx(u,{checked:d,onCheckedChange:i,children:"Status Bar"}),e.jsx(u,{checked:k,onCheckedChange:I,disabled:!0,children:"Activity Bar"}),e.jsx(u,{checked:P,onCheckedChange:f,children:"Panel"})]})]})}},t={args:{},render:()=>{const[d,i]=a.useState("bottom");return e.jsxs(s,{children:[e.jsx(h,{asChild:!0,children:e.jsxs(c,{variant:"outline",children:["Dropdown ",e.jsx(D,{})]})}),e.jsxs(w,{className:"w-56",children:[e.jsx(l,{children:"Panel Position"}),e.jsx(m,{}),e.jsxs(R,{value:d,onValueChange:i,children:[e.jsx(p,{value:"top",children:"Top"}),e.jsx(p,{value:"bottom",children:"Bottom"}),e.jsx(p,{value:"right",children:"Right"})]})]})]})}};var M,x,C;n.parameters={...n.parameters,docs:{...(M=n.parameters)==null?void 0:M.docs,source:{originalSource:`{
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
}`,...(b=(v=t.parameters)==null?void 0:v.docs)==null?void 0:b.source}}};const oe=["Defaut","Checkboxes","RadioGroup"];export{r as Checkboxes,n as Defaut,t as RadioGroup,oe as __namedExportsOrder,ee as default};
