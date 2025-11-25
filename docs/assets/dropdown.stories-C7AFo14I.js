import{j as o}from"./jsx-runtime-D_zvdyIk.js";import{B as c}from"./button-BBjs8Zjx.js";import{D as s,a as w,b as h,c as l,d as m,e,f as p,g as R,h as u}from"./dropdown-menu-CxUCUeqn.js";import{r as a}from"./index-CGj_12n1.js";import{C as D}from"./chevron-down-BLzVWgYU.js";import"./index-B7CJuYpG.js";import"./index-D8dqFcAi.js";import"./index-BBPXtLXU.js";import"./action-button-DglMD9AQ.js";import"./utils-D-KgF5mV.js";import"./separator-IJKoE26K.js";import"./button.variants-Du9eY_ux.js";import"./index-C66Dxnp2.js";import"./createLucideIcon-8Lr1oLzj.js";import"./spinner-BMSZ66Eg.js";import"./tooltip-anNhU4TT.js";import"./index-CcLUv2_A.js";import"./index-Ch7hUksi.js";import"./index-CIckazZy.js";import"./index-DceihmLw.js";import"./index-A6VgBoaw.js";import"./index-CRLeYu_h.js";import"./index-BDsjCN7N.js";import"./i18n-BHpm8p02.js";import"./iframe-fQ9OXxjq.js";import"./i18next-DOi7g2fS.js";import"./check-DRc1RmCY.js";import"./index-C8qycyLa.js";import"./Combination-DwMjbv-J.js";const so={title:"Dropdowns/DropDown Menu",component:s,args:{}},n={args:{},render:()=>o.jsxs(s,{children:[o.jsx(w,{asChild:!0,children:o.jsxs(c,{variant:"outline",children:["Dropdown ",o.jsx(D,{})]})}),o.jsxs(h,{children:[o.jsx(l,{children:"My Account"}),o.jsx(m,{}),o.jsx(e,{children:"Profile"}),o.jsx(e,{children:"Billing"}),o.jsx(e,{children:"Team"}),o.jsx(e,{children:"Subscription"})]})]})},r={args:{},render:()=>{const[i,d]=a.useState(!0),[k,I]=a.useState(!1),[P,f]=a.useState(!1);return o.jsxs(s,{children:[o.jsx(w,{asChild:!0,children:o.jsxs(c,{variant:"outline",children:["Dropdown ",o.jsx(D,{})]})}),o.jsxs(h,{className:"w-56",children:[o.jsx(l,{children:"Appearance"}),o.jsx(m,{}),o.jsx(p,{checked:i,onCheckedChange:d,children:"Status Bar"}),o.jsx(p,{checked:k,onCheckedChange:I,disabled:!0,children:"Activity Bar"}),o.jsx(p,{checked:P,onCheckedChange:f,children:"Panel"})]})]})}},t={args:{},render:()=>{const[i,d]=a.useState("bottom");return o.jsxs(s,{children:[o.jsx(w,{asChild:!0,children:o.jsxs(c,{variant:"outline",children:["Dropdown ",o.jsx(D,{})]})}),o.jsxs(h,{className:"w-56",children:[o.jsx(l,{children:"Panel Position"}),o.jsx(m,{}),o.jsxs(R,{value:i,onValueChange:d,children:[o.jsx(u,{value:"top",children:"Top"}),o.jsx(u,{value:"bottom",children:"Bottom"}),o.jsx(u,{value:"right",children:"Right"})]})]})]})}};var M,x,C;n.parameters={...n.parameters,docs:{...(M=n.parameters)==null?void 0:M.docs,source:{originalSource:`{
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
}`,...(b=(v=t.parameters)==null?void 0:v.docs)==null?void 0:b.source}}};const io=["Defaut","Checkboxes","RadioGroup"];export{r as Checkboxes,n as Defaut,t as RadioGroup,io as __namedExportsOrder,so as default};
