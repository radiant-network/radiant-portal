import{n as e}from"./rolldown-runtime-C0FnF6B9.js";import{t}from"./react-BRh_h4kc.js";import{t as n}from"./jsx-runtime-BdxMnOeJ.js";import{n as r,t as i}from"./utils-hYbUpBR2.js";import{i as a,n as o}from"./story-section-DVTm6cGm.js";import{a as s,n as c,o as l,s as u,t as d}from"./card-lDj02HnZ.js";import{h as f,l as p}from"./data-DmlxDJ6U.js";import{i as m,n as h,r as g,t as _}from"./use-plotly-theme-DYIWo8_j.js";import{n as v,t as y}from"./skeleton-CYetxZ-F.js";function b({groups:e,title:t,yAxisLabel:n,loading:r=!1,colors:a=C,selectedPoints:o=[],tooltip:s,annotation:c,onPointClick:l,onSelect:u,className:d}){let f=h(),p=(0,x.useMemo)(()=>e.map((e,t)=>{let n=e.color??a[t%a.length];return{type:`box`,name:e.name,x:Array(e.points.length).fill(t+1),y:e.points.map(e=>e.value),boxpoints:`all`,jitter:1,pointpos:0,marker:{color:n,size:7,line:{color:`white`,width:.5}},selected:{marker:{color:n}},unselected:{marker:{color:n,opacity:.1}},hoverlabel:{namelength:0},hovertemplate:s?`%{hovertext}<extra></extra>`:void 0,hovertext:s?e.points.map(s):void 0,customdata:e.points}}),[e,a,s]),g=c?e.flatMap((e,t)=>e.points.filter(e=>o.includes(e)).map(e=>({x:t+1,y:e.value,text:c(e),arrowhead:6,arrowsize:1,arrowwidth:2,arrowcolor:f.foreground,ax:100,ay:0,bgcolor:f.card,bordercolor:f.border,borderwidth:1,font:{size:12,color:f.foreground}}))):[];if(r)return(0,S.jsx)(y,{className:i(`h-full w-full`,d)});let _=e=>{let t=e.points[0]?.customdata;t&&l?.(t)},v=e=>{let t=(e?.points??[]).map(e=>e.customdata).filter(Boolean);u?.(t)},b={annotations:g,autosize:!0,paper_bgcolor:`transparent`,plot_bgcolor:`transparent`,font:{color:f.foreground},title:t?{text:t,x:.05,font:{size:16,weight:600}}:void 0,margin:{l:40,r:10,t:t?60:20,b:40},legend:{borderwidth:1,bordercolor:f.border,bgcolor:f.card,yanchor:`top`,y:.99,xanchor:`right`,x:.99},yaxis:{title:n?{text:n}:void 0,gridcolor:f.border,linecolor:f.border,zerolinecolor:f.border},xaxis:{tickvals:e.map((e,t)=>t+1),ticktext:e.map(e=>e.name),gridcolor:f.border,linecolor:f.border,zerolinecolor:f.border}};return(0,S.jsx)(m,{className:i(`h-full w-full`,d),data:p,layout:b,useResizeHandler:!0,config:{displaylogo:!1,modeBarButtonsToRemove:[`toImage`,`resetGeo`,`lasso2d`,`sendDataToCloud`,`zoomIn2d`,`zoomOut2d`,`pan2d`]},onClick:l?_:void 0,onSelecting:u?v:void 0})}var x,S,C;function w(){return(w=e((()=>{x=t(),g(),_(),v(),r(),S=n(),C=[`#0284c7`,`#94a3b8`],b.__docgenInfo={description:`Swarm plot: one jittered column of points per group, distributed along the
y-axis by their value.

       │   · ·           ·
       │  · · ··        · ·
       │ · ···· ·      · · ·
       │  · · ·         · ··
       └──────────────────────
         Group A        Group B`,methods:[],displayName:`SwarmPlot`,props:{loading:{defaultValue:{value:`false`,computed:!1},required:!1},colors:{defaultValue:{value:`['#0284c7', '#94a3b8']`,computed:!1},required:!1},selectedPoints:{defaultValue:{value:`[]`,computed:!1},required:!1}}}})))()}var T,E,D,O,k;function A(){return(A=e((()=>{w(),u(),a(),p(),T=n(),E={groups:f,title:`Gene expression — GENE1`,yAxisLabel:`FPKM`,tooltip:e=>`${e.sample_id}: ${e.value.toFixed(2)} FPKM`,onPointClick:e=>{console.warn(`point clicked`,e)},onSelect:e=>{console.warn(`points selected`,e)}},D={title:`Components/Charts/Swarm Plot`,component:b,args:E},O={render:()=>(0,T.jsx)(o,{title:`Swarm plot`,children:(0,T.jsxs)(`div`,{className:`w-full flex gap-6`,children:[(0,T.jsxs)(d,{className:`w-full`,children:[(0,T.jsx)(s,{children:(0,T.jsx)(l,{children:`Gene expression by group`})}),(0,T.jsx)(c,{className:`h-[420px]`,children:(0,T.jsx)(b,{...E})})]}),(0,T.jsxs)(d,{className:`w-full`,children:[(0,T.jsx)(s,{children:(0,T.jsx)(l,{children:`With selected samples (annotations)`})}),(0,T.jsx)(c,{className:`h-[420px]`,children:(0,T.jsx)(b,{...E,selectedPoints:[f[0].points[8],f[0].points[5],f[0].points[3]],annotation:e=>`${e.sample_id}: ${e.value.toFixed(2)} FPKM`})})]})]})})},O.parameters={...O.parameters,docs:{...O.parameters?.docs,source:{originalSource:`{
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
}`,...O.parameters?.docs?.source}}},k=[`Default`]})))()}A();export{O as Default,k as __namedExportsOrder,D as default};