import{j as o}from"./jsx-runtime-D_zvdyIk.js";import{r as a}from"./index-CBYaBgW8.js";import{B as c}from"./button-CbWEvCr6.js";import{D as s,a as w,b as h,c as m,d as l,e,f as p,g as R,h as u}from"./dropdown-menu-DPm_FhUX.js";import{C as D}from"./chevron-down-DOuPo75j.js";import"./index-C-d7IIsQ.js";import"./index-Dy6y0jaD.js";import"./action-button-9r-08jXC.js";import"./separator-ChZWIdMg.js";import"./index-sTUCEGFJ.js";import"./index-BWnBDfn-.js";import"./utils-CDN07tui.js";import"./button.variants-Du9eY_ux.js";import"./index-C66Dxnp2.js";import"./createLucideIcon-B119WVF5.js";import"./spinner-D7tBPZCQ.js";import"./tooltip-0vX-MTK3.js";import"./index-D9mtqW9-.js";import"./index-C8BBKGwP.js";import"./index-BL8Z-moU.js";import"./index-DnEzm5An.js";import"./index-iyInEJkZ.js";import"./index-C2iKAgIe.js";import"./index-CWHKeK-O.js";import"./index-CfXWnpL9.js";import"./i18n-Bl3cUO8L.js";import"./iframe-DN0EbxbO.js";import"./i18next-CYn7LYXT.js";import"./check-DSe_yRo5.js";import"./index-BCzuw4Jg.js";import"./Combination-CrkgvPnV.js";import"./index-CfgEC-S9.js";const uo={title:"Dropdowns/DropDown Menu",component:s,args:{}},n={args:{},render:()=>o.jsxs(s,{children:[o.jsx(w,{asChild:!0,children:o.jsxs(c,{variant:"outline",children:["Dropdown ",o.jsx(D,{})]})}),o.jsxs(h,{children:[o.jsx(m,{children:"My Account"}),o.jsx(l,{}),o.jsx(e,{children:"Profile"}),o.jsx(e,{children:"Billing"}),o.jsx(e,{children:"Team"}),o.jsx(e,{children:"Subscription"})]})]})},r={args:{},render:()=>{const[i,d]=a.useState(!0),[k,I]=a.useState(!1),[P,f]=a.useState(!1);return o.jsxs(s,{children:[o.jsx(w,{asChild:!0,children:o.jsxs(c,{variant:"outline",children:["Dropdown ",o.jsx(D,{})]})}),o.jsxs(h,{className:"w-56",children:[o.jsx(m,{children:"Appearance"}),o.jsx(l,{}),o.jsx(p,{checked:i,onCheckedChange:d,children:"Status Bar"}),o.jsx(p,{checked:k,onCheckedChange:I,disabled:!0,children:"Activity Bar"}),o.jsx(p,{checked:P,onCheckedChange:f,children:"Panel"})]})]})}},t={args:{},render:()=>{const[i,d]=a.useState("bottom");return o.jsxs(s,{children:[o.jsx(w,{asChild:!0,children:o.jsxs(c,{variant:"outline",children:["Dropdown ",o.jsx(D,{})]})}),o.jsxs(h,{className:"w-56",children:[o.jsx(m,{children:"Panel Position"}),o.jsx(l,{}),o.jsxs(R,{value:i,onValueChange:d,children:[o.jsx(u,{value:"top",children:"Top"}),o.jsx(u,{value:"bottom",children:"Bottom"}),o.jsx(u,{value:"right",children:"Right"})]})]})]})}};var M,x,C;n.parameters={...n.parameters,docs:{...(M=n.parameters)==null?void 0:M.docs,source:{originalSource:`{
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
}`,...(b=(v=t.parameters)==null?void 0:v.docs)==null?void 0:b.source}}};const co=["Defaut","Checkboxes","RadioGroup"];export{r as Checkboxes,n as Defaut,t as RadioGroup,co as __namedExportsOrder,uo as default};
