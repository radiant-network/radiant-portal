import{r as E,j as r,c as C}from"./iframe-BOkj70l8.js";import{u as T,r as F}from"./use-plotly-theme-BnfeoOMD.js";import{S as H}from"./skeleton-yvCFhn6H.js";import{C as b,a as g,b as v,d as y}from"./card-DT4VhHcK.js";import{a as M}from"./story-section-DQYgi0mB.js";import{a as i}from"./data-CGl4bGS9.js";import"./preload-helper-PPVm8Dsz.js";import"./separator-MMk7clR0.js";const $=["#0284c7","#94a3b8"];function d({groups:e,title:c,yAxisLabel:u,loading:P=!1,colors:p=$,selectedPoints:S=[],tooltip:n,annotation:x,onPointClick:f,onSelect:h,className:w}){const t=T(),j=E.useMemo(()=>e.map((o,a)=>{const s=o.color??p[a%p.length];return{type:"box",name:o.name,x:Array(o.points.length).fill(a+1),y:o.points.map(k=>k.value),boxpoints:"all",jitter:1,pointpos:0,marker:{color:s,size:7,line:{color:"white",width:.5}},selected:{marker:{color:s}},unselected:{marker:{color:s,opacity:.1}},hoverlabel:{namelength:0},hovertemplate:n?"%{hovertext}<extra></extra>":void 0,hovertext:n?o.points.map(n):void 0,customdata:o.points}}),[e,p,n]),N=x?e.flatMap((o,a)=>o.points.filter(s=>S.includes(s)).map(s=>({x:a+1,y:s.value,text:x(s),arrowhead:6,arrowsize:1,arrowwidth:2,arrowcolor:t.foreground,ax:100,ay:0,bgcolor:t.card,bordercolor:t.border,borderwidth:1,font:{size:12,color:t.foreground}}))):[];if(P)return r.jsx(H,{className:C("h-full w-full",w)});const _=o=>{const a=o.points[0]?.customdata;a&&f?.(a)},G=o=>{const a=(o?.points??[]).map(s=>s.customdata).filter(Boolean);h?.(a)},z={annotations:N,autosize:!0,paper_bgcolor:"transparent",plot_bgcolor:"transparent",font:{color:t.foreground},title:c?{text:c,x:.05,font:{size:16,weight:600}}:void 0,margin:{l:40,r:10,t:c?60:20,b:40},legend:{borderwidth:1,bordercolor:t.border,bgcolor:t.card,yanchor:"top",y:.99,xanchor:"right",x:.99},yaxis:{title:u?{text:u}:void 0,gridcolor:t.border,linecolor:t.border,zerolinecolor:t.border},xaxis:{tickvals:e.map((o,a)=>a+1),ticktext:e.map(o=>o.name),gridcolor:t.border,linecolor:t.border,zerolinecolor:t.border}};return r.jsx(F,{className:C("h-full w-full",w),data:j,layout:z,useResizeHandler:!0,config:{displaylogo:!1,modeBarButtonsToRemove:["toImage","resetGeo","lasso2d","sendDataToCloud","zoomIn2d","zoomOut2d","pan2d"]},onClick:f?_:void 0,onSelecting:h?G:void 0})}d.__docgenInfo={description:`Swarm plot: one jittered column of points per group, distributed along the
y-axis by their value.

       │   · ·           ·
       │  · · ··        · ·
       │ · ···· ·      · · ·
       │  · · ·         · ··
       └──────────────────────
         Group A        Group B`,methods:[],displayName:"SwarmPlot",props:{loading:{defaultValue:{value:"false",computed:!1},required:!1},colors:{defaultValue:{value:"['#0284c7', '#94a3b8']",computed:!1},required:!1},selectedPoints:{defaultValue:{value:"[]",computed:!1},required:!1}}};const m={groups:i,title:"Gene expression — GENE1",yAxisLabel:"FPKM",tooltip:e=>`${e.sample_id}: ${e.value.toFixed(2)} FPKM`,onPointClick:e=>{console.warn("point clicked",e)},onSelect:e=>{console.warn("points selected",e)}},V={title:"Components/Charts/Swarm Plot",component:d,args:m},l={render:()=>r.jsx(M,{title:"Swarm plot",children:r.jsxs("div",{className:"w-full flex gap-6",children:[r.jsxs(b,{className:"w-full",children:[r.jsx(g,{children:r.jsx(v,{children:"Gene expression by group"})}),r.jsx(y,{className:"h-[420px]",children:r.jsx(d,{...m})})]}),r.jsxs(b,{className:"w-full",children:[r.jsx(g,{children:r.jsx(v,{children:"With selected samples (annotations)"})}),r.jsx(y,{className:"h-[420px]",children:r.jsx(d,{...m,selectedPoints:[i[0].points[8],i[0].points[5],i[0].points[3]],annotation:e=>`${e.sample_id}: ${e.value.toFixed(2)} FPKM`})})]})]})})};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  render: () => <StorySection title="Swarm plot">
      <div className="w-full flex gap-6">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Gene expression by group</CardTitle>
          </CardHeader>
          <CardContent className="h-[420px]">
            <SwarmPlot {...geneExpressionProps} />
          </CardContent>
        </Card>

        <Card className="w-full">
          <CardHeader>
            <CardTitle>With selected samples (annotations)</CardTitle>
          </CardHeader>
          <CardContent className="h-[420px]">
            <SwarmPlot {...geneExpressionProps} selectedPoints={[swarmPlotGroups[0].points[8], swarmPlotGroups[0].points[5], swarmPlotGroups[0].points[3]]} annotation={point => \`\${point.sample_id}: \${point.value.toFixed(2)} FPKM\`} />
          </CardContent>
        </Card>
      </div>
    </StorySection>
}`,...l.parameters?.docs?.source}}};const L=["Default"];export{l as Default,L as __namedExportsOrder,V as default};
