import{n as e}from"./rolldown-runtime-C0FnF6B9.js";import{t}from"./react-BRh_h4kc.js";import{t as n}from"./jsx-runtime-BdxMnOeJ.js";import{n as r,t as i}from"./utils-hYbUpBR2.js";import{i as a,n as o}from"./story-section-DVTm6cGm.js";import{a as s,n as c,o as l,s as u,t as d}from"./card-lDj02HnZ.js";import{f,l as p}from"./data-DmlxDJ6U.js";import{i as m,n as h,r as g,t as _}from"./use-plotly-theme-DYIWo8_j.js";import{n as v,t as y}from"./skeleton-CYetxZ-F.js";function b({series:e,title:t,xAxisLabel:n,yAxisLabel:r,loading:a=!1,colors:o=C,pointColor:s,highlightedPoints:c,selectedPoints:l=[],tooltip:u,annotation:d,onPointClick:f,onSelect:p,className:g}){let _=h(),v=(0,x.useMemo)(()=>e.map((e,t)=>{let n=e.color??o[t%o.length],r=c!==void 0&&c.length>0;return{type:`scattergl`,mode:`markers`,name:e.name,x:e.points.map(e=>e.x),y:e.points.map(e=>e.y),marker:{color:s?e.points.map(s):n,opacity:r?e.points.map(e=>c.includes(e)?1:w):1,size:7,line:{color:`white`,width:.8}},selected:{marker:{color:_.foreground}},unselected:{marker:{opacity:w}},hoverlabel:{namelength:0},hovertemplate:u?`%{hovertext}<extra></extra>`:void 0,hovertext:u?e.points.map(u):void 0,customdata:e.points}}),[e,o,s,c,u,_]),b=d?l.map(e=>`${e.x},${e.y}`).join(`|`):``,T=(0,x.useMemo)(()=>({autosize:!0,paper_bgcolor:`transparent`,plot_bgcolor:`transparent`,font:{color:_.foreground},title:t?{text:t,x:.05,font:{size:16,weight:600}}:void 0,margin:{l:40,r:10,t:t?60:20,b:40},legend:{borderwidth:1,bordercolor:_.border,bgcolor:_.card,yanchor:`top`,y:.99,xanchor:`right`,x:.99},xaxis:{title:n?{text:n,font:{size:14}}:void 0,tickfont:{size:12},gridcolor:_.border,linecolor:_.border,zerolinecolor:_.border},yaxis:{title:r?{text:r,font:{size:14}}:void 0,tickfont:{size:12},automargin:!0,gridcolor:_.border,linecolor:_.border,zerolinecolor:_.border}}),[t,n,r,_]),[E,D]=(0,x.useState)(T),[O,k]=(0,x.useState)(0),[A,j]=(0,x.useState)(!1);return(0,x.useEffect)(()=>{let t=d?e.flatMap(e=>e.points.filter(e=>l.includes(e)).map(e=>({x:e.x,y:e.y,text:d(e),arrowhead:6,arrowsize:1.6,arrowwidth:2,arrowcolor:_.foreground,ax:30,ay:-50,bgcolor:_.card,bordercolor:_.border,borderwidth:2,borderpad:4,font:{size:12,color:_.foreground}}))):[];D({...T,annotations:t}),k(e=>e+1)},[b,T]),a?(0,S.jsx)(y,{className:i(`h-full w-full`,g)}):(0,S.jsx)(m,{className:i(`h-full w-full`,g),data:v,layout:E,useResizeHandler:!0,config:{displaylogo:!1,modeBarButtonsToRemove:[`toImage`,`resetGeo`,`sendDataToCloud`,`pan2d`]},onClick:f?e=>{let t=e.points[0]?.customdata;t&&f?.(t)}:void 0,onSelected:p?e=>{let t=(e?.points??[]).map(e=>e.customdata).filter(Boolean);p?.(t)}:void 0,onRelayout:e=>{let t=e[`xaxis.range[0]`]!==void 0||e[`yaxis.range[0]`]!==void 0;D(n=>{let r=n.annotations??[];if(!A&&t&&r.length>0){let t=r[0],i=(e[`xaxis.range[1]`]-e[`xaxis.range[0]`])/2,a=(e[`yaxis.range[1]`]-e[`yaxis.range[0]`])/2;return{...n,xaxis:{...n.xaxis,range:[t.x-i,t.x+i]},yaxis:{...n.yaxis,range:[t.y-a,t.y+a]},annotations:r}}return{...n,annotations:r}}),j(!1)},onRelayouting:()=>j(!0)},O)}var x,S,C,w;function T(){return(T=e((()=>{x=t(),g(),_(),v(),r(),S=n(),C=[`#94a3b8`,`#b91c1c`,`#60a5fa`],w=.4,b.__docgenInfo={description:`Scatter plot: one WebGL marker series per group, scattered across the x/y plane.
Supports per-point coloring, dimming of non-highlighted points, point selection,
and annotation callouts. When exactly one point is annotated, the plot keeps it
centered while the user zooms.


       │ ·                  ·
       │  ··              ··
       │   ···          ···
       │     ···      ···
       │   ·· ············ ··
       └──────────────────────
             x-axis`,methods:[],displayName:`ScatterPlot`,props:{loading:{defaultValue:{value:`false`,computed:!1},required:!1},colors:{defaultValue:{value:`['#94a3b8', '#b91c1c', '#60a5fa']`,computed:!1},required:!1},selectedPoints:{defaultValue:{value:`[]`,computed:!1},required:!1}}}})))()}var E,D,O,k,A,j,M,N,P;function F(){return(F=e((()=>{T(),u(),a(),p(),E=n(),D=`#94a3b8`,O=`#b91c1c`,k=`#60a5fa`,A=.05,j={series:f,title:`Differential gene expression`,xAxisLabel:`log2 fold change`,yAxisLabel:`-log10(q-value)`,pointColor:e=>e.padj>A?D:e.x>0?O:k,tooltip:e=>`${e.gene_symbol} — log2FC ${e.x.toFixed(2)}, q ${e.padj.toExponential(1)}`,onPointClick:e=>{console.warn(`gene clicked`,e)},onSelect:e=>{console.warn(`genes selected`,e)}},M={title:`Components/Charts/Scatter Plot`,component:b,args:j},N={render:()=>(0,E.jsx)(o,{title:`Scatter plot`,children:(0,E.jsxs)(`div`,{className:`w-full flex gap-6`,children:[(0,E.jsxs)(d,{className:`w-full`,children:[(0,E.jsx)(s,{children:(0,E.jsx)(l,{children:`Volcano plot`})}),(0,E.jsx)(c,{className:`h-[420px]`,children:(0,E.jsx)(b,{...j})})]}),(0,E.jsxs)(d,{className:`w-full`,children:[(0,E.jsx)(s,{children:(0,E.jsx)(l,{children:`With a selected gene (annotation)`})}),(0,E.jsx)(c,{className:`h-[420px]`,children:(0,E.jsx)(b,{...j,selectedPoints:[f[0].points[2]],annotation:e=>e.gene_symbol})})]})]})})},N.parameters={...N.parameters,docs:{...N.parameters?.docs,source:{originalSource:`{
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
}`,...N.parameters?.docs?.source}}},P=[`Default`]})))()}F();export{N as Default,P as __namedExportsOrder,M as default};