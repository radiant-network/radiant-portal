import{j as e}from"./jsx-runtime-Cf8x2fCZ.js";import{a as G}from"./index-B-lxVbXh.js";import{R as c,q as f,M as Q}from"./query-builder-remote-CV1kkaXN.js";import{r as u}from"./index-t5q4d8OJ.js";import{B as J}from"./button-CbbVWId-.js";import{S as Fe}from"./api-CU3RBd8i.js";import{u as Oe,C as Re}from"./applications-config-Buimdc0G.js";import{d as X,S as Z,a as ee,b as te,c as ae}from"./select-C340VIr7.js";import{I as L}from"./input-DXdBqDMR.js";import{C as Me}from"./checkbox-Tw_h6IK8.js";import{L as Ve}from"./label-FPd8fHBc.js";import{E as Ae,L as $e,G as qe,a as Qe,b as Le,c as Ge}from"./less-than-or-equal-operator-icon-BeMEXZ7b.js";import{u as He}from"./i18n-CJXa5-w1.js";import{u as Ue,o as Ce}from"./index-THfzzYH8.js";import{S as re}from"./skeleton-CfkhzHGY.js";import{within as H,userEvent as _,expect as p}from"./index-BgJgh-x_.js";import"./index-yBjzXJbu.js";import"./v4-CtRu48qb.js";import"./index-Bjkhh2p3.js";import"./index-CC5eZYhG.js";import"./index-fNjTmf9T.js";import"./ActionButton-D4jVLNva.js";import"./dropdown-menu-xf-jiMEf.js";import"./index-KhTUl610.js";import"./Combination-CdAak5pT.js";import"./index-BiFLoO8l.js";import"./index-CTFHtJli.js";import"./index-V1T-MO6M.js";import"./utils-CytzSlOG.js";import"./check-1JYhj4AL.js";import"./createLucideIcon-BOZfVBeY.js";import"./button.variants-B79LQKoe.js";import"./index-C66Dxnp2.js";import"./ellipsis-e_tKH1yv.js";import"./spinner-BoKAmKqu.js";import"./index-Kp-sCbH1.js";import"./index-BmfKZQ-K.js";import"./chevron-down-B0uzl_ed.js";import"./iframe-COl4o3pn.js";import"./index-BNh7Aicb.js";function ge({children:i}){return e.jsx("p",{className:"text-sm text-muted-foreground",children:i})}ge.__docgenInfo={description:"",methods:[],displayName:"TextMuted",props:{children:{required:!1,tsType:{name:"ReactNode"},description:""}}};const Ye=i=>Ce.statisticsGermlineOccurrences(i.seqId,i.statisticsBody).then(a=>a.data);function We(i,a=!1,m){let o;a?o={seqId:"1",statisticsBody:{field:i}}:o=null;const r=f.getResolvedActiveQuery(m);return r&&o&&(o.statisticsBody.sqon={content:r.content,op:r.op}),Ue(o,Ye,{revalidateOnFocus:!1})}function x({field:i}){var Y,W,z,P;const{t:a}=He(),m=Oe(),o=m.variant_exploration.app_id,r=i.key,v={[c.GreaterThan]:{display:a("common.filters.operators.greaterThan"),dropdown:a("common.filters.operators.greaterThan"),icon:Ge},[c.LessThan]:{display:a("common.filters.operators.lessThan"),dropdown:a("common.filters.operators.lessThan"),icon:Le},[c.Between]:{display:a("common.filters.operators.between"),dropdown:a("common.filters.operators.between"),icon:Qe},[c.GreaterThanOrEqualTo]:{display:a("common.filters.operators.greaterThanOrEqual"),dropdown:a("common.filters.operators.greaterThanOrEqual"),icon:qe},[c.LessThanOrEqualTo]:{display:a("common.filters.operators.lessThanOrEqual"),dropdown:a("common.filters.operators.lessThanOrEqual"),icon:$e},[c.In]:{display:a("common.filters.operators.in"),dropdown:a("common.filters.operators.in"),icon:Ae}},{data:s,isLoading:_e}=We(r,!0,o),[h,T]=u.useState(c.GreaterThan),[O,N]=u.useState("0"),[R,B]=u.useState("0"),[M,b]=u.useState("0"),[V,A]=u.useState(!1),[g,U]=u.useState(),[Te,y]=u.useState(!1),Ne=m.variant_exploration.aggregations,t=(Y=Object.values(Ne).flatMap(n=>n.items).find(n=>n.key===r))==null?void 0:Y.defaults,Be=i.type==="numerical"&&(t==null?void 0:t.noDataInputOption),C=(t==null?void 0:t.intervalDecimal)!==void 0&&((t==null?void 0:t.max)!==void 0||(t==null?void 0:t.min)!==void 0)||s&&(s.min!==void 0||s.max!==void 0),$=(t==null?void 0:t.min)??(s==null?void 0:s.min)??0,q=(t==null?void 0:t.max)??(s==null?void 0:s.max)??100,I=u.useCallback(()=>{var K;const n=f.getResolvedActiveQuery(o);if(!(n!=null&&n.content))return;const l=n.content.find(d=>"content"in d&&"field"in d.content?d.content.field===r:!1),j=n.content.find(d=>"content"in d&&"field"in d.content?d.content.field===`${r}_unit`:!1);if(l){const d=l.content.value;if(console.log("[NumericalFilter] values",d),d.includes("__missing__")){A(!0);return}if(d.length===2){T(c.Between);const ke=Number(d[0]).toFixed(3),De=Number(d[1]).toFixed(3);b(ke),B(De)}else N(d[0]);l.op&&!(t!=null&&t.defaultOperator)&&T(l.op)}else console.log("[NumericalFilter else] no filter exists",t),A(!1),(t==null?void 0:t.defaultMin)!==void 0?(b(t.defaultMin.toString()),N(t.defaultMin.toString())):(s==null?void 0:s.min)!==void 0&&(b(Number(s.min.toFixed(3)).toString()),N(Number(s.min.toFixed(3)).toString())),(t==null?void 0:t.defaultMax)!==void 0?B(t.defaultMax.toString()):(s==null?void 0:s.max)!==void 0&&B(Number(s.max.toFixed(3)).toString()),t!=null&&t.defaultOperator&&T(c[t.defaultOperator]);U(j?j.content.value[0]:(K=t==null?void 0:t.rangeTypes)!=null&&K.length?t.rangeTypes[0].key:void 0)},[o,r,t,s]);u.useEffect(()=>{I()},[I]);const be=u.useCallback(n=>{T(n),y(!0)},[]),Ie=u.useCallback(n=>{A(n),y(!0)},[]),je=u.useCallback(n=>{U(n),y(!0)},[]),Se=u.useCallback(()=>{y(!1),I()},[I]),we=u.useCallback(()=>{if(y(!1),V){f.updateActiveQueryField(o,{field:r,value:["__missing__"],merge_strategy:Q.OVERRIDE_VALUES});return}let n=[];n=h===c.Between?[parseFloat(M.toString()),parseFloat(R.toString())]:[parseFloat(O.toString())],f.updateActiveQueryField(o,{field:r,value:n,merge_strategy:Q.OVERRIDE_VALUES,operator:h}),g&&f.updateActiveQueryField(o,{field:`${r}_unit`,value:[g],merge_strategy:Q.OVERRIDE_VALUES})},[o,r,h,O,M,R,V,g]),Ee=Object.entries(c).map(([n,l])=>{if(l in v){const j=v[l].icon;return e.jsx(X,{value:l,children:e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx(j,{size:16}),e.jsx("span",{children:v[l].dropdown})]})},l)}return null}).filter(Boolean);return e.jsxs("div",{className:"p-2 w-full max-w-md",id:`${r}_container`,children:[e.jsxs("div",{className:"space-y-3 pt-2",children:[e.jsxs("div",{className:"flex flex-col gap-3",children:[e.jsx("div",{id:`${r}_operator`,children:e.jsxs(Z,{defaultValue:`${Fe.GreaterThan}`,onValueChange:be,children:[e.jsx(ee,{children:e.jsx(te,{placeholder:a("common.filters.operators.selectOperator"),children:v[h].display})}),e.jsx(ae,{children:Ee})]})}),h===c.Between?e.jsxs("div",{className:"flex gap-2 flex-row",children:[e.jsx(L,{className:"w-half",value:M,onChange:n=>{const l=n.target.value;console.log("value",l),!isNaN(Number(l))&&(b(l),y(!0))},min:$,max:q,id:`${r}_min`,"data-testid":`${r}_min`}),e.jsx(L,{className:"w-half",value:R,onChange:n=>{const l=n.target.value;isNaN(Number(l))||(B(l),y(!0))},min:$,max:q,id:`${r}_max`,"data-testid":`${r}_max`})]}):e.jsx(L,{className:"w-full",value:O,onChange:n=>{const l=n.target.value;isNaN(Number(l))||(N(l),y(!0))},min:$,max:q,id:`${r}_value`,"data-testid":`${r}_value`}),C&&e.jsx("div",{id:`${r}_interval`,children:e.jsxs(ge,{children:[a("common.filters.labels.actualInterval")," : ",(W=s==null?void 0:s.min)==null?void 0:W.toFixed(3)," -"," ",(z=s==null?void 0:s.max)==null?void 0:z.toFixed(3)]})})]}),(t==null?void 0:t.rangeTypes)&&t.rangeTypes.length>0&&e.jsx("div",{id:`${r}_range_type_container`,children:_e?e.jsxs(e.Fragment,{children:[e.jsx(re,{className:"h-5 w-16 mb-1",id:`${r}_unit_label_skeleton`}),e.jsx(re,{className:"h-9 w-full",id:`${r}_select_skeleton`})]}):e.jsxs(e.Fragment,{children:[e.jsx(Ve,{className:"text-sm",id:`${r}_unit_label`,children:a("common.filters.labels.unit")}),e.jsxs(Z,{defaultValue:g||t.rangeTypes[0].key,onValueChange:je,children:[e.jsx(ee,{children:e.jsx(te,{placeholder:a("common.filters.labels.selectUnit"),children:((P=t.rangeTypes.find(n=>n.key===g))==null?void 0:P.name)||a("common.filters.labels.selectUnit")})}),e.jsx(ae,{children:t.rangeTypes.map(n=>e.jsx(X,{value:n.key,children:n.name},n.key))})]})]})}),Be&&!C&&e.jsxs("label",{className:"flex items-center space-x-2 overflow-hidden",id:`${r}_no_data_label`,children:[e.jsx(Me,{checked:V,onCheckedChange:Ie,id:`${r}_no_data`}),e.jsx("span",{children:a("common.filters.labels.noData")})]})]}),e.jsx("hr",{className:"my-4 border-border",id:`${r}_divider`}),e.jsxs("div",{className:"flex align-right justify-end items-center space-x-2",children:[e.jsx(J,{size:"xs",variant:"ghost",onClick:Se,disabled:!Te,id:`${r}_clear`,children:a("common.filters.buttons.clear")}),e.jsx("div",{className:"flex space-x-2",children:e.jsx(J,{size:"xs",className:"h-7",color:"primary",onClick:we,id:`${r}_apply`,children:a("common.filters.buttons.apply")})})]})]})}x.__docgenInfo={description:"",methods:[],displayName:"NumericalFilter",props:{field:{required:!0,tsType:{name:"AggregationConfig"},description:""}}};const F={variant_exploration:{app_id:"variant_exploration_toggle_filter",aggregations:[{key:"impact_score",type:"numerical",defaults:{min:0,max:100,defaultMin:0,defaultMax:100,intervalDecimal:2,defaultOperator:c.GreaterThan}},{key:"age",type:"numerical",defaults:{min:0,max:120,defaultMin:0,defaultMax:120,intervalDecimal:0,defaultOperator:c.Between,rangeTypes:[{key:"year",name:"Year"},{key:"month",name:"Month"},{key:"day",name:"Day"}]}}]}},Rt={title:"Feature/Query Filters/Numerical Filter",component:x,args:{field:{key:"impact_score",type:"numerical",defaults:{min:0,max:100,defaultMin:0,defaultMax:100,intervalDecimal:2,defaultOperator:c.GreaterThan}}},decorators:[i=>e.jsx(Re,{config:F,children:e.jsx(i,{})})]},S={render:i=>e.jsx("div",{className:"space-y-6",children:e.jsx(x,{...i})}),play:async({canvasElement:i})=>{const a=H(i),m=a.getByTestId("impact_score_value");await _.type(m,"75"),p(m).toHaveValue(75);const o=a.getByRole("button",{name:/apply/i});p(o).toBeEnabled(),await _.click(o)}},w={render:i=>(G("activeQuery")(f.updateActiveQueryField(F.variant_exploration.app_id,{field:"impact_score",value:[]})),e.jsx("div",{className:"space-y-6",children:e.jsx(x,{...i})})),play:async({canvasElement:i})=>{const m=await H(i).findByText("No data");await _.click(m),p(m.previousElementSibling).toBeChecked()}},E={args:{field:{key:"impact_score",type:"multiple"}},render:i=>e.jsx("div",{className:"space-y-6",children:e.jsx(x,{...i})})},k={args:{field:{key:"age",type:"numerical",defaults:{min:0,max:120,defaultMin:0,defaultMax:120,intervalDecimal:0,defaultOperator:c.Between}}},render:i=>(G("activeQuery")(f.updateActiveQueryField(F.variant_exploration.app_id,{field:"age",value:[]})),e.jsx("div",{className:"space-y-6",children:e.jsx(x,{...i})})),parameters:{docs:{description:{story:'A numerical filter with range constraints. Note: Shows ">" operator by default due to global config override.'}}}},D={args:{field:{key:"age",type:"numerical",defaults:{min:0,max:120,defaultMin:0,defaultMax:120,intervalDecimal:0,defaultOperator:c.Between,rangeTypes:[{key:"year",name:"Year"},{key:"month",name:"Month"},{key:"day",name:"Day"}]}}},render:i=>(G("activeQuery")(f.updateActiveQueryField(F.variant_exploration.app_id,{field:"age_unit",value:[]})),e.jsx("div",{className:"space-y-6",children:e.jsx(x,{...i})})),play:async({canvasElement:i})=>{const a=H(i),m=a.getByText("Between");p(m).toBeInTheDocument();const o=a.getByTestId("age_min"),r=a.getByTestId("age_max");p(o).toBeInTheDocument(),p(r).toBeInTheDocument();const v=a.getByText("Year");p(v).toBeInTheDocument();const s=a.getByText("Clear");p(s).toBeDisabled(),await _.type(o,"50"),p(s).toBeEnabled(),await _.click(s),p(o).toHaveValue(0),p(r).toHaveValue(120),p(v).toHaveTextContent("Year")},parameters:{docs:{description:{story:"A numerical filter with range type options (Year, Month, Day) and unit selection. Tests validate range operator changes, unit selection, no data visibility, and clear functionality."}}}};var ne,se,ie;S.parameters={...S.parameters,docs:{...(ne=S.parameters)==null?void 0:ne.docs,source:{originalSource:`{
  render: args => {
    return <div className="space-y-6">
        <NumericalFilter {...args} />
      </div>;
  },
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);

    // Test numeric input
    const numericInput = canvas.getByTestId('impact_score_value');
    await userEvent.type(numericInput, '75');
    expect(numericInput).toHaveValue(75);

    // Test apply button
    const applyButton = canvas.getByRole('button', {
      name: /apply/i
    });
    expect(applyButton).toBeEnabled();
    await userEvent.click(applyButton);
  }
}`,...(ie=(se=S.parameters)==null?void 0:se.docs)==null?void 0:ie.source}}};var oe,le,ce;w.parameters={...w.parameters,docs:{...(oe=w.parameters)==null?void 0:oe.docs,source:{originalSource:`{
  render: args => {
    action('activeQuery')(queryBuilderRemote.updateActiveQueryField(config.variant_exploration.app_id, {
      field: 'impact_score',
      value: []
    }));
    return <div className="space-y-6">
        <NumericalFilter {...args} />
      </div>;
  },
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    const noDataToggle = await canvas.findByText('No data');
    await userEvent.click(noDataToggle);
    expect(noDataToggle.previousElementSibling).toBeChecked();
  }
}`,...(ce=(le=w.parameters)==null?void 0:le.docs)==null?void 0:ce.source}}};var de,ue,me;E.parameters={...E.parameters,docs:{...(de=E.parameters)==null?void 0:de.docs,source:{originalSource:`{
  args: {
    field: {
      key: 'impact_score',
      type: 'multiple'
    }
  },
  render: args => {
    return <div className="space-y-6">
        <NumericalFilter {...args} />
      </div>;
  }
}`,...(me=(ue=E.parameters)==null?void 0:ue.docs)==null?void 0:me.source}}};var pe,ye,fe;k.parameters={...k.parameters,docs:{...(pe=k.parameters)==null?void 0:pe.docs,source:{originalSource:`{
  args: {
    field: {
      key: 'age',
      type: 'numerical',
      defaults: {
        min: 0,
        max: 120,
        defaultMin: 0,
        defaultMax: 120,
        intervalDecimal: 0,
        defaultOperator: RangeOperators.Between
      }
    }
  },
  render: args => {
    action('activeQuery')(queryBuilderRemote.updateActiveQueryField(config.variant_exploration.app_id, {
      field: 'age',
      value: []
    }));
    return <div className="space-y-6">
        <NumericalFilter {...args} />
      </div>;
  },
  parameters: {
    docs: {
      description: {
        story: 'A numerical filter with range constraints. Note: Shows ">" operator by default due to global config override.'
      }
    }
  }
}`,...(fe=(ye=k.parameters)==null?void 0:ye.docs)==null?void 0:fe.source}}};var ve,xe,he;D.parameters={...D.parameters,docs:{...(ve=D.parameters)==null?void 0:ve.docs,source:{originalSource:`{
  args: {
    field: {
      key: 'age',
      type: 'numerical',
      defaults: {
        min: 0,
        max: 120,
        defaultMin: 0,
        defaultMax: 120,
        intervalDecimal: 0,
        defaultOperator: RangeOperators.Between,
        rangeTypes: [{
          key: 'year',
          name: 'Year'
        }, {
          key: 'month',
          name: 'Month'
        }, {
          key: 'day',
          name: 'Day'
        }]
      }
    }
  },
  render: args => {
    action('activeQuery')(queryBuilderRemote.updateActiveQueryField(config.variant_exploration.app_id, {
      field: 'age_unit',
      value: []
    }));
    return <div className="space-y-6">
        <NumericalFilter {...args} />
      </div>;
  },
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);

    // Test initial state
    const operatorSelect = canvas.getByText('Between');
    expect(operatorSelect).toBeInTheDocument();

    // Verify both inputs are visible with "Between" operator
    const minInput = canvas.getByTestId('age_min');
    const maxInput = canvas.getByTestId('age_max');
    expect(minInput).toBeInTheDocument();
    expect(maxInput).toBeInTheDocument();

    // Test unit type selection
    const unitSelect = canvas.getByText('Year');
    expect(unitSelect).toBeInTheDocument();

    // Test clear functionality
    const clearButton = canvas.getByText('Clear');
    expect(clearButton).toBeDisabled();
    await userEvent.type(minInput, '50');
    expect(clearButton).toBeEnabled();
    await userEvent.click(clearButton);
    expect(minInput).toHaveValue(0);
    expect(maxInput).toHaveValue(120);
    expect(unitSelect).toHaveTextContent('Year');
  },
  parameters: {
    docs: {
      description: {
        story: 'A numerical filter with range type options (Year, Month, Day) and unit selection. Tests validate range operator changes, unit selection, no data visibility, and clear functionality.'
      }
    }
  }
}`,...(he=(xe=D.parameters)==null?void 0:xe.docs)==null?void 0:he.source}}};const Mt=["Default","NoDataToggle","NoDataToggleHidden","RangeFilterWithInterval","RangeFilterWithRangeTypes"];export{S as Default,w as NoDataToggle,E as NoDataToggleHidden,k as RangeFilterWithInterval,D as RangeFilterWithRangeTypes,Mt as __namedExportsOrder,Rt as default};
