import{n as e}from"./rolldown-runtime-C0FnF6B9.js";import{t}from"./react-BRh_h4kc.js";import{t as n}from"./jsx-runtime-BdxMnOeJ.js";import{a as r,c as i,h as a,l as o,m as s,n as c,o as l,r as u,t as d,u as f}from"./dropdown-menu-SOZyNO6p.js";import{n as p,t as m}from"./chevron-down-GEWks4uL.js";import{n as h,t as g}from"./button-22dvIMlN.js";import{i as _,n as v,r as y}from"./story-section-DVTm6cGm.js";var b,x,S,C,w;function T(){return(T=e((()=>{b=t(),p(),h(),a(),_(),x=n(),S={title:`Components/Dropdowns/Dropdown Menu`,component:d,args:{}},C={render:()=>{let[e,t]=(0,b.useState)(!0),[n,a]=(0,b.useState)(!1),[p,h]=(0,b.useState)(!1),[_,S]=(0,b.useState)(`bottom`);return(0,x.jsxs)(y,{direction:`row`,children:[(0,x.jsx)(v,{title:`Default`,children:(0,x.jsxs)(d,{children:[(0,x.jsx)(s,{asChild:!0,children:(0,x.jsxs)(g,{variant:`outline`,children:[`Dropdown `,(0,x.jsx)(m,{})]})}),(0,x.jsxs)(u,{children:[(0,x.jsx)(l,{children:`My Account`}),(0,x.jsx)(f,{}),(0,x.jsx)(r,{children:`Profile`}),(0,x.jsx)(r,{children:`Billing`}),(0,x.jsx)(r,{children:`Team`}),(0,x.jsx)(r,{children:`Subscription`})]})]})}),(0,x.jsx)(v,{title:`Multiple selection`,children:(0,x.jsxs)(d,{children:[(0,x.jsx)(s,{asChild:!0,children:(0,x.jsxs)(g,{variant:`outline`,children:[`Dropdown `,(0,x.jsx)(m,{})]})}),(0,x.jsxs)(u,{className:`w-56`,children:[(0,x.jsx)(l,{children:`Appearance`}),(0,x.jsx)(f,{}),(0,x.jsx)(c,{checked:e,onCheckedChange:t,children:`Status Bar`}),(0,x.jsx)(c,{checked:n,onCheckedChange:a,disabled:!0,children:`Activity Bar`}),(0,x.jsx)(c,{checked:p,onCheckedChange:h,children:`Panel`})]})]})}),(0,x.jsx)(v,{title:`Single selection`,children:(0,x.jsxs)(d,{children:[(0,x.jsx)(s,{asChild:!0,children:(0,x.jsxs)(g,{variant:`outline`,children:[`Dropdown `,(0,x.jsx)(m,{})]})}),(0,x.jsxs)(u,{className:`w-56`,children:[(0,x.jsx)(l,{children:`Panel Position`}),(0,x.jsx)(f,{}),(0,x.jsxs)(i,{value:_,onValueChange:S,children:[(0,x.jsx)(o,{value:`top`,children:`Top`}),(0,x.jsx)(o,{value:`bottom`,children:`Bottom`}),(0,x.jsx)(o,{value:`right`,children:`Right`})]})]})]})})]})}},C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`{
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
}`,...C.parameters?.docs?.source}}},w=[`AllVariants`]})))()}T();export{C as AllVariants,w as __namedExportsOrder,S as default};