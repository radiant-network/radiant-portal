import{n as e}from"./rolldown-runtime-C0FnF6B9.js";import{t}from"./jsx-runtime-BdxMnOeJ.js";import{i as n,n as r}from"./story-section-DVTm6cGm.js";import{a as i,n as a,o,s,t as c}from"./card-lDj02HnZ.js";import{n as l,t as u}from"./skeleton-CYetxZ-F.js";function d({title:e,rows:t,...n}){return(0,f.jsxs)(c,{...n,children:[(0,f.jsx)(i,{className:`border-b [.border-b]:pb-2`,children:(0,f.jsx)(o,{children:e})}),(0,f.jsx)(a,{className:`flex flex-col gap-3 text-sm`,children:Array.from({length:t},(e,t)=>(0,f.jsx)(u,{className:`h-5 w-full`},t))})]})}var f;function p(){return(p=e((()=>{s(),l(),f=t(),d.__docgenInfo={description:``,methods:[],displayName:`SkeletonCard`,props:{title:{required:!0,tsType:{name:`string`},description:``},rows:{required:!0,tsType:{name:`number`},description:``}}}})))()}var m,h,g,_,v;function y(){return(y=e((()=>{p(),n(),m=t(),h={title:`Components/Cards/Skeleton Card`,component:d,args:{title:`Loading`,rows:3}},g={render:e=>(0,m.jsx)(r,{title:`Default`,children:(0,m.jsx)(`div`,{className:`w-[350px]`,children:(0,m.jsx)(d,{...e})})})},_={render:()=>(0,m.jsx)(r,{title:`Row counts`,description:`Pick a row count that approximates the fields of the loaded card.`,children:(0,m.jsx)(`div`,{className:`flex flex-col gap-6`,children:[1,3,4,6].map(e=>(0,m.jsx)(`div`,{className:`w-[350px]`,children:(0,m.jsx)(d,{title:`${e} ${e===1?`row`:`rows`}`,rows:e})},e))})})},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  render: args => <StorySection title="Default">
      <div className="w-[350px]">
        <SkeletonCard {...args} />
      </div>
    </StorySection>
}`,...g.parameters?.docs?.source}}},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  render: () => <StorySection title="Row counts" description="Pick a row count that approximates the fields of the loaded card.">
      <div className="flex flex-col gap-6">
        {[1, 3, 4, 6].map(rows => <div key={rows} className="w-[350px]">
            <SkeletonCard title={\`\${rows} \${rows === 1 ? 'row' : 'rows'}\`} rows={rows} />
          </div>)}
      </div>
    </StorySection>
}`,..._.parameters?.docs?.source}}},v=[`Default`,`RowCounts`]})))()}y();export{g as Default,_ as RowCounts,v as __namedExportsOrder,h as default};