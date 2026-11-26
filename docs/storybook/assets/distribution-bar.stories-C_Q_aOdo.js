import{n as e}from"./rolldown-runtime-BCiCTKAo.js";import{t}from"./jsx-runtime-BB9-612F.js";import{n,t as r}from"./utils-BWvAN0j0.js";import{i,n as a,r as o}from"./story-section-D0qBaT6h.js";function s(e){let t=f;switch(e%d){case 0:return{backgroundImage:`repeating-linear-gradient(45deg, ${t} 0 1.5px, transparent 1.5px 6px)`};case 1:return{backgroundImage:`radial-gradient(${t} 1px, transparent 1.5px)`,backgroundSize:`5px 5px`};default:return{backgroundImage:`repeating-linear-gradient(-45deg, ${t} 0 1.5px, transparent 1.5px 6px)`}}}function c({items:e,colorblindMode:t=!1,className:n}){let i=e.every(e=>e.value<=0),a=e.map(e=>`${e.value} ${e.label}`).join(`, `);return(0,l.jsx)(`div`,{role:`img`,"aria-label":a,className:r(`flex h-3.5 w-full gap-0.5 overflow-hidden rounded-sm`,i&&`bg-muted`,n),children:e.map((e,n)=>e.value>0?(0,l.jsx)(`div`,{className:r(`h-full basis-0`,u[e.color]),style:{flexGrow:e.value,...t?s(n):{}}},e.key):null)})}var l,u,d,f;function p(){return(p=e((()=>{n(),l=t(),u={green:`bg-green text-green`,lime:`bg-lime text-lime`,yellow:`bg-yellow text-yellow`,amber:`bg-amber text-amber`,orange:`bg-orange text-orange`,red:`bg-red text-red`,cyan:`bg-cyan text-cyan`,blue:`bg-blue text-blue`,violet:`bg-violet text-violet`,fuchsia:`bg-fuchsia text-fuchsia`,neutral:`bg-neutral text-neutral`},d=3,f=`color-mix(in oklab, currentColor 85%, black)`,c.__docgenInfo={description:``,methods:[],displayName:`DistributionBar`,props:{items:{required:!0,tsType:{name:`Array`,elements:[{name:`signature`,type:`object`,raw:`{
  key: string;
  label: string;
  value: number;
  color: DistributionBarColor;
}`,signature:{properties:[{key:`key`,value:{name:`string`,required:!0}},{key:`label`,value:{name:`string`,required:!0}},{key:`value`,value:{name:`number`,required:!0}},{key:`color`,value:{name:`union`,raw:`| 'green'
| 'lime'
| 'yellow'
| 'amber'
| 'orange'
| 'red'
| 'cyan'
| 'blue'
| 'violet'
| 'fuchsia'
| 'neutral'`,elements:[{name:`literal`,value:`'green'`},{name:`literal`,value:`'lime'`},{name:`literal`,value:`'yellow'`},{name:`literal`,value:`'amber'`},{name:`literal`,value:`'orange'`},{name:`literal`,value:`'red'`},{name:`literal`,value:`'cyan'`},{name:`literal`,value:`'blue'`},{name:`literal`,value:`'violet'`},{name:`literal`,value:`'fuchsia'`},{name:`literal`,value:`'neutral'`}],required:!0}}]}}],raw:`DistributionBarItem[]`},description:``},colorblindMode:{required:!1,tsType:{name:`boolean`},description:``,defaultValue:{value:`false`,computed:!1}},className:{required:!1,tsType:{name:`string`},description:``}}}})))()}function m({items:e,colorblindMode:t=!1,className:n}){return(0,h.jsx)(`ul`,{className:r(`flex flex-wrap items-center gap-x-6 gap-y-2 text-sm`,n),children:e.map((e,n)=>(0,h.jsxs)(`li`,{className:`flex items-center gap-2`,children:[(0,h.jsx)(`span`,{"aria-hidden":!0,className:r(`h-3 shrink-0 rounded-sm`,t?`w-6`:`w-3`,u[e.color]),style:t?s(n):void 0}),(0,h.jsx)(`span`,{className:`font-semibold`,children:e.value}),(0,h.jsx)(`span`,{children:e.label})]},e.key))})}var h;function g(){return(g=e((()=>{n(),p(),h=t(),m.__docgenInfo={description:``,methods:[],displayName:`DistributionLegend`,props:{items:{required:!0,tsType:{name:`Array`,elements:[{name:`signature`,type:`object`,raw:`{
  key: string;
  label: string;
  value: number;
  color: DistributionBarColor;
}`,signature:{properties:[{key:`key`,value:{name:`string`,required:!0}},{key:`label`,value:{name:`string`,required:!0}},{key:`value`,value:{name:`number`,required:!0}},{key:`color`,value:{name:`union`,raw:`| 'green'
| 'lime'
| 'yellow'
| 'amber'
| 'orange'
| 'red'
| 'cyan'
| 'blue'
| 'violet'
| 'fuchsia'
| 'neutral'`,elements:[{name:`literal`,value:`'green'`},{name:`literal`,value:`'lime'`},{name:`literal`,value:`'yellow'`},{name:`literal`,value:`'amber'`},{name:`literal`,value:`'orange'`},{name:`literal`,value:`'red'`},{name:`literal`,value:`'cyan'`},{name:`literal`,value:`'blue'`},{name:`literal`,value:`'violet'`},{name:`literal`,value:`'fuchsia'`},{name:`literal`,value:`'neutral'`}],required:!0}}]}}],raw:`DistributionBarItem[]`},description:``},colorblindMode:{required:!1,tsType:{name:`boolean`},description:``,defaultValue:{value:`false`,computed:!1}},className:{required:!1,tsType:{name:`string`},description:``}}}})))()}function _({items:e,colorblindMode:t}){return(0,v.jsxs)(`div`,{className:`flex w-full flex-col gap-2.5`,children:[(0,v.jsx)(c,{items:e,colorblindMode:t}),(0,v.jsx)(m,{items:e,colorblindMode:t})]})}var v,y,b,x,S,C;function w(){return(w=e((()=>{p(),g(),i(),v=t(),y=[{key:`pass`,label:`Pass`,value:147,color:`green`},{key:`warning`,label:`Warning`,value:26,color:`amber`},{key:`fail`,label:`Fail`,value:23,color:`red`},{key:`unmappable`,label:`Unmappable`,value:17,color:`neutral`}],b={title:`Components/Distribution Bar`,component:c,args:{items:y,colorblindMode:!1},decorators:[e=>(0,v.jsx)(`div`,{className:`max-w-3xl`,children:(0,v.jsx)(e,{})})]},x={render:e=>(0,v.jsx)(_,{items:e.items,colorblindMode:e.colorblindMode})},S={render:()=>(0,v.jsxs)(o,{children:[(0,v.jsx)(a,{title:`Bar with legend`,children:(0,v.jsx)(_,{items:y})}),(0,v.jsx)(a,{title:`Colorblind mode`,description:`A pattern per item position, as in the charts.`,children:(0,v.jsx)(_,{items:y,colorblindMode:!0})}),(0,v.jsx)(a,{title:`Bar only`,children:(0,v.jsx)(c,{items:y})}),(0,v.jsx)(a,{title:`Item with a zero value`,description:`Hidden in the bar, kept in the legend.`,children:(0,v.jsx)(_,{items:y.map(e=>e.key===`fail`?{...e,value:0}:e)})}),(0,v.jsx)(a,{title:`Single item`,children:(0,v.jsx)(_,{items:[y[0]]})}),(0,v.jsx)(a,{title:`Empty`,description:`Every value is zero.`,children:(0,v.jsx)(_,{items:y.map(e=>({...e,value:0}))})})]})},C=[`Default`,`AllVariants`]})))()}w();export{S as AllVariants,x as Default,C as __namedExportsOrder,b as default};