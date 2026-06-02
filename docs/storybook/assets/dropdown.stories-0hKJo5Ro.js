import{r as a,j as e}from"./iframe-X1FdiBKE.js";import{B as c}from"./button-C1dmQasv.js";import{D as s,a as w,b as h,d as l,e as D,f as u,c as o,g as j,h as p}from"./dropdown-menu-B8dOc9pX.js";import{C as m}from"./chevron-down-_LLWsBcL.js";import"./preload-helper-PPVm8Dsz.js";import"./index-BerhZw8G.js";import"./action-button-D2HkTc1A.js";import"./separator-BcF0hBxw.js";import"./i18n-DsLlobA0.js";import"./index-BoMd93ow.js";import"./check-CpvZoXR-.js";import"./index-DnCxSPBU.js";import"./index-DfO9iG95.js";import"./circle-C0x1jrVb.js";const N={title:"Dropdowns/DropDown Menu",component:s,args:{}},n={args:{},render:()=>e.jsxs(s,{children:[e.jsx(w,{asChild:!0,children:e.jsxs(c,{variant:"outline",children:["Dropdown ",e.jsx(m,{})]})}),e.jsxs(h,{children:[e.jsx(l,{children:"My Account"}),e.jsx(D,{}),e.jsx(o,{children:"Profile"}),e.jsx(o,{children:"Billing"}),e.jsx(o,{children:"Team"}),e.jsx(o,{children:"Subscription"})]})]})},r={args:{},render:()=>{const[d,i]=a.useState(!0),[M,x]=a.useState(!1),[C,g]=a.useState(!1);return e.jsxs(s,{children:[e.jsx(w,{asChild:!0,children:e.jsxs(c,{variant:"outline",children:["Dropdown ",e.jsx(m,{})]})}),e.jsxs(h,{className:"w-56",children:[e.jsx(l,{children:"Appearance"}),e.jsx(D,{}),e.jsx(u,{checked:d,onCheckedChange:i,children:"Status Bar"}),e.jsx(u,{checked:M,onCheckedChange:x,disabled:!0,children:"Activity Bar"}),e.jsx(u,{checked:C,onCheckedChange:g,children:"Panel"})]})]})}},t={args:{},render:()=>{const[d,i]=a.useState("bottom");return e.jsxs(s,{children:[e.jsx(w,{asChild:!0,children:e.jsxs(c,{variant:"outline",children:["Dropdown ",e.jsx(m,{})]})}),e.jsxs(h,{className:"w-56",children:[e.jsx(l,{children:"Panel Position"}),e.jsx(D,{}),e.jsxs(j,{value:d,onValueChange:i,children:[e.jsx(p,{value:"top",children:"Top"}),e.jsx(p,{value:"bottom",children:"Bottom"}),e.jsx(p,{value:"right",children:"Right"})]})]})]})}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  args: {},
  render: () => <DropdownMenu>
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
    </DropdownMenu>
}`,...n.parameters?.docs?.source}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
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
}`,...r.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
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
}`,...t.parameters?.docs?.source}}};const E=["Defaut","Checkboxes","RadioGroup"];export{r as Checkboxes,n as Defaut,t as RadioGroup,E as __namedExportsOrder,N as default};
