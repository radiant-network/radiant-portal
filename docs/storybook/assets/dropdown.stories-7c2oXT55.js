import{ag as r,r as o,j as e,ah as a,B as s,aj as i,an as d,ao as u,al as n,ap as c,au as g,av as l}from"./iframe-CgZaKe5d.js";import{S as B,a as p}from"./story-section-Cd-IQlgl.js";import{C as w}from"./chevron-down-Dw7IURaJ.js";import"./preload-helper-PPVm8Dsz.js";const y={title:"Components/Dropdowns/Dropdown Menu",component:r,args:{}},t={render:()=>{const[h,D]=o.useState(!0),[M,S]=o.useState(!1),[m,x]=o.useState(!1),[C,j]=o.useState("bottom");return e.jsxs(B,{direction:"row",children:[e.jsx(p,{title:"Default",children:e.jsxs(r,{children:[e.jsx(a,{asChild:!0,children:e.jsxs(s,{variant:"outline",children:["Dropdown ",e.jsx(w,{})]})}),e.jsxs(i,{children:[e.jsx(d,{children:"My Account"}),e.jsx(u,{}),e.jsx(n,{children:"Profile"}),e.jsx(n,{children:"Billing"}),e.jsx(n,{children:"Team"}),e.jsx(n,{children:"Subscription"})]})]})}),e.jsx(p,{title:"Multiple selection",children:e.jsxs(r,{children:[e.jsx(a,{asChild:!0,children:e.jsxs(s,{variant:"outline",children:["Dropdown ",e.jsx(w,{})]})}),e.jsxs(i,{className:"w-56",children:[e.jsx(d,{children:"Appearance"}),e.jsx(u,{}),e.jsx(c,{checked:h,onCheckedChange:D,children:"Status Bar"}),e.jsx(c,{checked:M,onCheckedChange:S,disabled:!0,children:"Activity Bar"}),e.jsx(c,{checked:m,onCheckedChange:x,children:"Panel"})]})]})}),e.jsx(p,{title:"Single selection",children:e.jsxs(r,{children:[e.jsx(a,{asChild:!0,children:e.jsxs(s,{variant:"outline",children:["Dropdown ",e.jsx(w,{})]})}),e.jsxs(i,{className:"w-56",children:[e.jsx(d,{children:"Panel Position"}),e.jsx(u,{}),e.jsxs(g,{value:C,onValueChange:j,children:[e.jsx(l,{value:"top",children:"Top"}),e.jsx(l,{value:"bottom",children:"Bottom"}),e.jsx(l,{value:"right",children:"Right"})]})]})]})})]})}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
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
}`,...t.parameters?.docs?.source}}};const P=["AllVariants"];export{t as AllVariants,P as __namedExportsOrder,y as default};
