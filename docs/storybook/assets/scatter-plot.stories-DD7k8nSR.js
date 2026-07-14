import{r as i,j as r,c as k}from"./iframe-Dz8_RTnr.js";import{u as A,r as U}from"./use-plotly-theme-DMg1E0a7.js";import{S as Y}from"./skeleton-XISvpJaa.js";import{C as T,a as R,b as E,d as H}from"./card-CQVAmNCe.js";import{a as X}from"./story-section-D91u7BO8.js";import{s as O}from"./data-CGl4bGS9.js";import"./preload-helper-PPVm8Dsz.js";import"./separator-CwwChQ-7.js";const J=["#94a3b8","#b91c1c","#60a5fa"],I=.4;function x({series:o,title:d,xAxisLabel:f,yAxisLabel:g,loading:q=!1,colors:h=J,pointColor:y,highlightedPoints:p,selectedPoints:w=[],tooltip:m,annotation:C,onPointClick:j,onSelect:N,className:v}){const t=A(),D=i.useMemo(()=>o.map((e,n)=>{const l=e.color??h[n%h.length],c=p!==void 0&&p.length>0;return{type:"scattergl",mode:"markers",name:e.name,x:e.points.map(s=>s.x),y:e.points.map(s=>s.y),marker:{color:y?e.points.map(y):l,opacity:c?e.points.map(s=>p.includes(s)?1:I):1,size:7,line:{color:"white",width:.8}},selected:{marker:{color:t.foreground}},unselected:{marker:{opacity:I}},hoverlabel:{namelength:0},hovertemplate:m?"%{hovertext}<extra></extra>":void 0,hovertext:m?e.points.map(m):void 0,customdata:e.points}}),[o,h,y,p,m,t]),F=C?w.map(a=>`${a.x},${a.y}`).join("|"):"",S=i.useMemo(()=>({autosize:!0,paper_bgcolor:"transparent",plot_bgcolor:"transparent",font:{color:t.foreground},title:d?{text:d,x:.05,font:{size:16,weight:600}}:void 0,margin:{l:40,r:10,t:d?60:20,b:40},legend:{borderwidth:1,bordercolor:t.border,bgcolor:t.card,yanchor:"top",y:.99,xanchor:"right",x:.99},xaxis:{title:f?{text:f,font:{size:14}}:void 0,tickfont:{size:12},gridcolor:t.border,linecolor:t.border,zerolinecolor:t.border},yaxis:{title:g?{text:g,font:{size:14}}:void 0,tickfont:{size:12},automargin:!0,gridcolor:t.border,linecolor:t.border,zerolinecolor:t.border}}),[d,f,g,t]),[M,_]=i.useState(S),[V,W]=i.useState(0),[$,z]=i.useState(!1);if(i.useEffect(()=>{const a=C?o.flatMap(e=>e.points.filter(n=>w.includes(n)).map(n=>({x:n.x,y:n.y,text:C(n),arrowhead:6,arrowsize:1.6,arrowwidth:2,arrowcolor:t.foreground,ax:30,ay:-50,bgcolor:t.card,bordercolor:t.border,borderwidth:2,borderpad:4,font:{size:12,color:t.foreground}}))):[];_({...S,annotations:a}),W(e=>e+1)},[F,S]),q)return r.jsx(Y,{className:k("h-full w-full",v)});const B=a=>{const e=a.points[0]?.customdata;e&&j?.(e)},G=a=>{const e=(a?.points??[]).map(n=>n.customdata).filter(Boolean);N?.(e)},K=a=>{const e=a["xaxis.range[0]"]!==void 0||a["yaxis.range[0]"]!==void 0;_(n=>{const l=n.annotations??[];if(!$&&e&&l.length>0){const c=l[0],s=(a["xaxis.range[1]"]-a["xaxis.range[0]"])/2,P=(a["yaxis.range[1]"]-a["yaxis.range[0]"])/2;return{...n,xaxis:{...n.xaxis,range:[c.x-s,c.x+s]},yaxis:{...n.yaxis,range:[c.y-P,c.y+P]},annotations:l}}return{...n,annotations:l}}),z(!1)},Z=()=>z(!0);return r.jsx(U,{className:k("h-full w-full",v),data:D,layout:M,useResizeHandler:!0,config:{displaylogo:!1,modeBarButtonsToRemove:["toImage","resetGeo","sendDataToCloud","pan2d"]},onClick:j?B:void 0,onSelected:N?G:void 0,onRelayout:K,onRelayouting:Z},V)}x.__docgenInfo={description:`Scatter plot: one WebGL marker series per group, scattered across the x/y plane.
Supports per-point coloring, dimming of non-highlighted points, point selection,
and annotation callouts. When exactly one point is annotated, the plot keeps it
centered while the user zooms.


       │ ·                  ·
       │  ··              ··
       │   ···          ···
       │     ···      ···
       │   ·· ············ ··
       └──────────────────────
             x-axis`,methods:[],displayName:"ScatterPlot",props:{loading:{defaultValue:{value:"false",computed:!1},required:!1},colors:{defaultValue:{value:"['#94a3b8', '#b91c1c', '#60a5fa']",computed:!1},required:!1},selectedPoints:{defaultValue:{value:"[]",computed:!1},required:!1}}};const L="#94a3b8",Q="#b91c1c",ee="#60a5fa",oe=.05,b={series:O,title:"Differential gene expression",xAxisLabel:"log2 fold change",yAxisLabel:"-log10(q-value)",pointColor:o=>o.padj>oe?L:o.x>0?Q:ee,tooltip:o=>`${o.gene_symbol} — log2FC ${o.x.toFixed(2)}, q ${o.padj.toExponential(1)}`,onPointClick:o=>{console.warn("gene clicked",o)},onSelect:o=>{console.warn("genes selected",o)}},de={title:"Components/Charts/Scatter Plot",component:x,args:b},u={render:()=>r.jsx(X,{title:"Scatter plot",children:r.jsxs("div",{className:"w-full flex gap-6",children:[r.jsxs(T,{className:"w-full",children:[r.jsx(R,{children:r.jsx(E,{children:"Volcano plot"})}),r.jsx(H,{className:"h-[420px]",children:r.jsx(x,{...b})})]}),r.jsxs(T,{className:"w-full",children:[r.jsx(R,{children:r.jsx(E,{children:"With a selected gene (annotation)"})}),r.jsx(H,{className:"h-[420px]",children:r.jsx(x,{...b,selectedPoints:[O[0].points[2]],annotation:o=>o.gene_symbol})})]})]})})};u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  render: () => <StorySection title="Scatter plot">
      <div className="w-full flex gap-6">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Volcano plot</CardTitle>
          </CardHeader>
          <CardContent className="h-[420px]">
            <ScatterPlot {...volcanoProps} />
          </CardContent>
        </Card>

        <Card className="w-full">
          <CardHeader>
            <CardTitle>With a selected gene (annotation)</CardTitle>
          </CardHeader>
          <CardContent className="h-[420px]">
            <ScatterPlot {...volcanoProps} selectedPoints={[scatterPlotSeries[0].points[2]]} annotation={point => point.gene_symbol} />
          </CardContent>
        </Card>
      </div>
    </StorySection>
}`,...u.parameters?.docs?.source}}};const pe=["Default"];export{u as Default,pe as __namedExportsOrder,de as default};
