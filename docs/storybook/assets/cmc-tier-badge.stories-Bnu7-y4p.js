import{n as e}from"./rolldown-runtime-C0FnF6B9.js";import{t}from"./jsx-runtime-BdxMnOeJ.js";import{i as n,n as r,t as i}from"./story-section-DVTm6cGm.js";import{n as a,t as o}from"./cmc-tier-badge-BNtbcnwE.js";import{r as s}from"./utils-CQogxeLg.js";var c,l,u,d,f,p,m,h;function g(){return(g=e((()=>{a(),n(),c=t(),l=[`1`,`2`,`3`,`Other`],u=s(`22-19524402-G-A`),d={title:`Components/Badges/CMC Tier Badge`,component:o,args:{value:`1`}},f={render:()=>(0,c.jsx)(r,{title:`Default`,children:(0,c.jsx)(`div`,{className:`flex items-center gap-2`,children:l.map(e=>(0,c.jsx)(o,{value:e},e))})})},p={render:()=>(0,c.jsx)(r,{title:`With Franklin link`,description:`Opens Franklin in a new tab`,children:(0,c.jsx)(`div`,{className:`flex items-center gap-2`,children:l.map(e=>(0,c.jsx)(o,{value:e,href:u},e))})})},m={render:()=>(0,c.jsxs)(r,{title:`No data`,children:[(0,c.jsxs)(`div`,{className:`space-y-2`,children:[(0,c.jsx)(i,{children:`Without link`}),(0,c.jsx)(o,{value:void 0})]}),(0,c.jsxs)(`div`,{className:`space-y-2`,children:[(0,c.jsx)(i,{children:`With link (never clickable)`}),(0,c.jsx)(o,{value:void 0,href:u})]})]})},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  render: () => <StorySection title="Default">
      <div className="flex items-center gap-2">
        {CMC_TIERS.map(tier => <CmcTierBadge key={tier} value={tier} />)}
      </div>
    </StorySection>
}`,...f.parameters?.docs?.source}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  render: () => <StorySection title="With Franklin link" description="Opens Franklin in a new tab">
      <div className="flex items-center gap-2">
        {CMC_TIERS.map(tier => <CmcTierBadge key={tier} value={tier} href={FRANKLIN_URL} />)}
      </div>
    </StorySection>
}`,...p.parameters?.docs?.source}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  render: () => <StorySection title="No data">
      <div className="space-y-2">
        <StoryLabel>Without link</StoryLabel>
        <CmcTierBadge value={undefined} />
      </div>
      <div className="space-y-2">
        <StoryLabel>With link (never clickable)</StoryLabel>
        <CmcTierBadge value={undefined} href={FRANKLIN_URL} />
      </div>
    </StorySection>
}`,...m.parameters?.docs?.source}}},h=[`Default`,`WithFranklinLink`,`NoData`]})))()}g();export{f as Default,m as NoData,p as WithFranklinLink,h as __namedExportsOrder,d as default};