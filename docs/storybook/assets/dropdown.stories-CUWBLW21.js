import{r as o,j as e}from"./iframe--Wr8akaj.js";import{B as s}from"./button-AGQ9gLKF.js";import{D as r,a,b as i,c as d,d as u,e as n,f as c,g,h as p}from"./dropdown-menu-D__ES2m4.js";import{S as B,a as l}from"./story-section-mf2KVIsr.js";import{C as w}from"./chevron-down-DuUsgp_1.js";import"./preload-helper-PPVm8Dsz.js";import"./action-button-B8HAWUkq.js";import"./separator-DW3W07XT.js";import"./i18n-Bg6Ec5jw.js";import"./index-C36_LE4b.js";import"./check-DN_rAFtv.js";import"./index-D5QIG_v-.js";import"./index-CHj75zQJ.js";import"./circle-kD5s09G8.js";const G={title:"Components/Dropdowns/Dropdown Menu",component:r,args:{}},t={render:()=>{const[h,D]=o.useState(!0),[m,M]=o.useState(!1),[S,x]=o.useState(!1),[C,j]=o.useState("bottom");return e.jsxs(B,{direction:"row",children:[e.jsx(l,{title:"Default",children:e.jsxs(r,{children:[e.jsx(a,{asChild:!0,children:e.jsxs(s,{variant:"outline",children:["Dropdown ",e.jsx(w,{})]})}),e.jsxs(i,{children:[e.jsx(d,{children:"My Account"}),e.jsx(u,{}),e.jsx(n,{children:"Profile"}),e.jsx(n,{children:"Billing"}),e.jsx(n,{children:"Team"}),e.jsx(n,{children:"Subscription"})]})]})}),e.jsx(l,{title:"Multiple selection",children:e.jsxs(r,{children:[e.jsx(a,{asChild:!0,children:e.jsxs(s,{variant:"outline",children:["Dropdown ",e.jsx(w,{})]})}),e.jsxs(i,{className:"w-56",children:[e.jsx(d,{children:"Appearance"}),e.jsx(u,{}),e.jsx(c,{checked:h,onCheckedChange:D,children:"Status Bar"}),e.jsx(c,{checked:m,onCheckedChange:M,disabled:!0,children:"Activity Bar"}),e.jsx(c,{checked:S,onCheckedChange:x,children:"Panel"})]})]})}),e.jsx(l,{title:"Single selection",children:e.jsxs(r,{children:[e.jsx(a,{asChild:!0,children:e.jsxs(s,{variant:"outline",children:["Dropdown ",e.jsx(w,{})]})}),e.jsxs(i,{className:"w-56",children:[e.jsx(d,{children:"Panel Position"}),e.jsx(u,{}),e.jsxs(g,{value:C,onValueChange:j,children:[e.jsx(p,{value:"top",children:"Top"}),e.jsx(p,{value:"bottom",children:"Bottom"}),e.jsx(p,{value:"right",children:"Right"})]})]})]})})]})}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  render: () => {
    const [showStatusBar, setShowStatusBar] = useState<Checked>(true);
    const [showActivityBar, setShowActivityBar] = useState<Checked>(false);
    const [showPanel, setShowPanel] = useState<Checked>(false);
    const [position, setPosition] = useState('bottom');
    return <StoryShowcase direction="row">
        <StorySection title="Default">
          <DropdownMenu>
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
        </StorySection>

        <StorySection title="Multiple selection">
          <DropdownMenu>
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
          </DropdownMenu>
        </StorySection>

        <StorySection title="Single selection">
          <DropdownMenu>
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
          </DropdownMenu>
        </StorySection>
      </StoryShowcase>;
  }
}`,...t.parameters?.docs?.source}}};const _=["AllVariants"];export{t as AllVariants,_ as __namedExportsOrder,G as default};
