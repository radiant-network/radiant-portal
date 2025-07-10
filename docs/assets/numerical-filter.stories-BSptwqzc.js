import{j as e}from"./jsx-runtime-D_zvdyIk.js";import{a as G}from"./index-B-lxVbXh.js";import{R as c,q as v,M as Q}from"./query-builder-remote-DIYWDMXg.js";import{r as u}from"./index-DQLiH3RP.js";import{B as J}from"./button-B_hWqCKH.js";import{u as Oe,C as Re}from"./applications-config-pyPLye2e.js";import{d as X,S as Z,a as ee,b as te,c as ae}from"./select-BJ1ILXCN.js";import{I as L}from"./input-DyY2UfVx.js";import{C as Me}from"./checkbox-CO27iIkV.js";import{L as Ve}from"./label-Buk2CdJ1.js";import{E as Ae,L as $e,G as qe,a as Qe,b as Le,c as Ge}from"./less-than-or-equal-operator-icon-BI5aNTvi.js";import{u as He}from"./i18n-BhX7kMii.js";import{u as Ce,o as Ue}from"./index-D93Pn2io.js";import{S as re}from"./skeleton-Shk8p_SP.js";import{w as H,u as _,e as p}from"./index-B7YJKKKT.js";import{c as ne}from"./config-mock-BXxtYAjK.js";import"./v4-CtRu48qb.js";import"./api-L7FCkGF_.js";import"./index-D-AYaadb.js";import"./index-CECE1b4A.js";import"./index-CJPVTaBz.js";import"./ActionButton-A54waDHb.js";import"./dropdown-menu-maOUzwaK.js";import"./index-Bf9LPmYV.js";import"./index-DD7n3F2b.js";import"./index-Bx8PXznd.js";import"./index-C5A_jyAq.js";import"./utils-D-KgF5mV.js";import"./check-DSCf8CVO.js";import"./createLucideIcon-BMP5cxO1.js";import"./button.variants-Czj0iLzG.js";import"./index-C66Dxnp2.js";import"./ellipsis-BtlAG3ey.js";import"./spinner-DHVcj7-u.js";import"./index-DDGWSPzp.js";import"./index-Czeu9DHN.js";import"./chevron-down-QEmn0_AS.js";import"./iframe-EwTUHaZ6.js";import"./index-BjfAAjgr.js";function _e({children:i}){return e.jsx("p",{className:"text-sm text-muted-foreground",children:i})}_e.__docgenInfo={description:"",methods:[],displayName:"TextMuted",props:{children:{required:!1,tsType:{name:"ReactNode"},description:""}}};const Ye=i=>Ue.statisticsGermlineOccurrences(i.seqId,i.statisticsBody).then(a=>a.data);function We(i,a=!1,m){let o;a?o={seqId:"1",statisticsBody:{field:i}}:o=null;const r=v.getResolvedActiveQuery(m);return r&&o&&(o.statisticsBody.sqon={content:r.content,op:r.op}),Ce(o,Ye,{revalidateOnFocus:!1})}function x({field:i}){var Y,W,z,P;const{t:a}=He(),m=Oe(),o=m.variant_exploration.app_id,r=i.key,f={[c.GreaterThan]:{display:a("common.filters.operators.greaterThan"),dropdown:a("common.filters.operators.greaterThan"),icon:Ge},[c.LessThan]:{display:a("common.filters.operators.lessThan"),dropdown:a("common.filters.operators.lessThan"),icon:Le},[c.Between]:{display:a("common.filters.operators.between"),dropdown:a("common.filters.operators.between"),icon:Qe},[c.GreaterThanOrEqualTo]:{display:a("common.filters.operators.greaterThanOrEqual"),dropdown:a("common.filters.operators.greaterThanOrEqual"),icon:qe},[c.LessThanOrEqualTo]:{display:a("common.filters.operators.lessThanOrEqual"),dropdown:a("common.filters.operators.lessThanOrEqual"),icon:$e},[c.In]:{display:a("common.filters.operators.in"),dropdown:a("common.filters.operators.in"),icon:Ae}},{data:s,isLoading:Te}=We(r,!0,o),[h,T]=u.useState(c.GreaterThan),[O,N]=u.useState("0"),[R,B]=u.useState("0"),[M,b]=u.useState("0"),[V,A]=u.useState(!1),[g,C]=u.useState(),[Ne,y]=u.useState(!1),Be=m.variant_exploration.aggregations,t=(Y=Object.values(Be).flatMap(n=>n.items).find(n=>n.key===r))==null?void 0:Y.defaults,be=i.type==="numerical"&&(t==null?void 0:t.noDataInputOption),U=(t==null?void 0:t.intervalDecimal)!==void 0&&((t==null?void 0:t.max)!==void 0||(t==null?void 0:t.min)!==void 0)||s&&(s.min!==void 0||s.max!==void 0),$=(t==null?void 0:t.min)??(s==null?void 0:s.min)??0,q=(t==null?void 0:t.max)??(s==null?void 0:s.max)??100,I=u.useCallback(()=>{var K;const n=v.getResolvedActiveQuery(o);if(!(n!=null&&n.content))return;const l=n.content.find(d=>"content"in d&&"field"in d.content?d.content.field===r:!1),j=n.content.find(d=>"content"in d&&"field"in d.content?d.content.field===`${r}_unit`:!1);if(l){const d=l.content.value;if(console.log("[NumericalFilter] values",d),d.includes("__missing__")){A(!0);return}if(y(!0),d.length===2){T(c.Between);const De=Number(d[0]).toFixed(3),Fe=Number(d[1]).toFixed(3);b(De),B(Fe)}else N(d[0]);l.op&&T(l.op)}else console.log("[NumericalFilter else] no filter exists",t),A(!1),(t==null?void 0:t.defaultMin)!==void 0?(b(t.defaultMin.toString()),N(t.defaultMin.toString())):(s==null?void 0:s.min)!==void 0&&(b(Number(s.min.toFixed(3)).toString()),N(Number(s.min.toFixed(3)).toString())),(t==null?void 0:t.defaultMax)!==void 0?B(t.defaultMax.toString()):(s==null?void 0:s.max)!==void 0&&B(Number(s.max.toFixed(3)).toString()),t!=null&&t.defaultOperator&&T(c[t.defaultOperator]);C(j?j.content.value[0]:(K=t==null?void 0:t.rangeTypes)!=null&&K.length?t.rangeTypes[0].key:void 0)},[o,r,t,s]);u.useEffect(()=>{I()},[I]);const Ie=u.useCallback(n=>{T(n),y(!0)},[]),je=u.useCallback(n=>{A(n),y(!0)},[]),we=u.useCallback(n=>{C(n),y(!0)},[]),Se=u.useCallback(()=>{y(!1),I()},[I]),Ee=u.useCallback(()=>{if(y(!1),V){v.updateActiveQueryField(o,{field:r,value:["__missing__"],merge_strategy:Q.OVERRIDE_VALUES});return}let n=[];n=h===c.Between?[parseFloat(M.toString()),parseFloat(R.toString())]:[parseFloat(O.toString())],v.updateActiveQueryField(o,{field:r,value:n,merge_strategy:Q.OVERRIDE_VALUES,operator:h}),g&&v.updateActiveQueryField(o,{field:`${r}_unit`,value:[g],merge_strategy:Q.OVERRIDE_VALUES})},[o,r,h,O,M,R,V,g]),ke=Object.entries(c).map(([n,l])=>{if(l in f){const j=f[l].icon;return e.jsx(X,{value:l,children:e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx(j,{size:16}),e.jsx("span",{children:f[l].dropdown})]})},l)}return null}).filter(Boolean);return e.jsxs("div",{className:"p-2 w-full max-w-md",id:`${r}_container`,children:[e.jsxs("div",{className:"space-y-3 pt-2",children:[e.jsxs("div",{className:"flex flex-col gap-3",children:[e.jsx("div",{id:`${r}_operator`,children:e.jsxs(Z,{value:h,onValueChange:Ie,children:[e.jsx(ee,{children:e.jsx(te,{placeholder:a("common.filters.operators.selectOperator"),children:f[h].display})}),e.jsx(ae,{children:ke})]})}),h===c.Between?e.jsxs("div",{className:"flex gap-2 flex-row",children:[e.jsx(L,{className:"w-half",value:M,onChange:n=>{const l=n.target.value;console.log("value",l),!isNaN(Number(l))&&(b(l),y(!0))},min:$,max:q,id:`${r}_min`,"data-testid":`${r}_min`}),e.jsx(L,{className:"w-half",value:R,onChange:n=>{const l=n.target.value;isNaN(Number(l))||(B(l),y(!0))},min:$,max:q,id:`${r}_max`,"data-testid":`${r}_max`})]}):e.jsx(L,{className:"w-full",value:O,onChange:n=>{const l=n.target.value;isNaN(Number(l))||(N(l),y(!0))},min:$,max:q,id:`${r}_value`,"data-testid":`${r}_value`}),U&&e.jsx("div",{id:`${r}_interval`,children:e.jsxs(_e,{children:[a("common.filters.labels.actualInterval")," : ",(W=s==null?void 0:s.min)==null?void 0:W.toFixed(3)," -"," ",(z=s==null?void 0:s.max)==null?void 0:z.toFixed(3)]})})]}),(t==null?void 0:t.rangeTypes)&&t.rangeTypes.length>0&&e.jsx("div",{id:`${r}_range_type_container`,children:Te?e.jsxs(e.Fragment,{children:[e.jsx(re,{className:"h-5 w-16 mb-1",id:`${r}_unit_label_skeleton`}),e.jsx(re,{className:"h-9 w-full",id:`${r}_select_skeleton`})]}):e.jsxs(e.Fragment,{children:[e.jsx(Ve,{className:"text-sm",id:`${r}_unit_label`,children:a("common.filters.labels.unit")}),e.jsxs(Z,{defaultValue:g||t.rangeTypes[0].key,onValueChange:we,children:[e.jsx(ee,{children:e.jsx(te,{placeholder:a("common.filters.labels.selectUnit"),children:((P=t.rangeTypes.find(n=>n.key===g))==null?void 0:P.name)||a("common.filters.labels.selectUnit")})}),e.jsx(ae,{children:t.rangeTypes.map(n=>e.jsx(X,{value:n.key,children:n.name},n.key))})]})]})}),be&&!U&&e.jsxs("label",{className:"flex items-center space-x-2 overflow-hidden",id:`${r}_no_data_label`,children:[e.jsx(Me,{checked:V,onCheckedChange:je,id:`${r}_no_data`}),e.jsx("span",{children:a("common.filters.labels.noData")})]})]}),e.jsx("hr",{className:"my-4 border-border",id:`${r}_divider`}),e.jsxs("div",{className:"flex align-right justify-end items-center space-x-2",children:[e.jsx(J,{size:"xs",variant:"ghost",onClick:Se,disabled:!Ne,id:`${r}_clear`,children:a("common.filters.buttons.clear")}),e.jsx("div",{className:"flex space-x-2",children:e.jsx(J,{size:"xs",className:"h-7",color:"primary",onClick:Ee,id:`${r}_apply`,children:a("common.filters.buttons.apply")})})]})]})}x.__docgenInfo={description:"",methods:[],displayName:"NumericalFilter",props:{field:{required:!0,tsType:{name:"AggregationConfig"},description:""}}};const F={...ne,variant_exploration:{...ne.variant_exploration,aggregations:{variant:{items:[{key:"impact_score",type:"numerical",defaults:{min:0,max:100,defaultMin:0,defaultMax:100,intervalDecimal:2,defaultOperator:c.GreaterThan}},{key:"age",type:"numerical",defaults:{min:0,max:120,defaultMin:0,defaultMax:120,intervalDecimal:0,defaultOperator:c.Between,rangeTypes:[{key:"year",name:"Year"},{key:"month",name:"Month"},{key:"day",name:"Day"}]}}]}}}},Ot={title:"Feature/Query Filters/Numerical Filter",component:x,args:{field:{key:"impact_score",type:"numerical",defaults:{min:0,max:100,defaultMin:0,defaultMax:100,intervalDecimal:2,defaultOperator:c.GreaterThan}}},decorators:[i=>e.jsx(Re,{config:F,children:e.jsx(i,{})})]},w={render:i=>e.jsx("div",{className:"space-y-6",children:e.jsx(x,{...i})}),play:async({canvasElement:i})=>{const a=H(i),m=a.getByTestId("impact_score_value");await _.type(m,"75"),p(m).toHaveValue(75);const o=a.getByRole("button",{name:/apply/i});p(o).toBeEnabled(),await _.click(o)}},S={render:i=>(G("activeQuery")(v.updateActiveQueryField(F.variant_exploration.app_id,{field:"impact_score",value:[]})),e.jsx("div",{className:"space-y-6",children:e.jsx(x,{...i})})),play:async({canvasElement:i})=>{const m=await H(i).findByText("No data");await _.click(m),p(m.previousElementSibling).toBeChecked()}},E={args:{field:{key:"impact_score",type:"multiple"}},render:i=>e.jsx("div",{className:"space-y-6",children:e.jsx(x,{...i})})},k={args:{field:{key:"age",type:"numerical",defaults:{min:0,max:120,defaultMin:0,defaultMax:120,intervalDecimal:0,defaultOperator:c.Between}}},render:i=>(G("activeQuery")(v.updateActiveQueryField(F.variant_exploration.app_id,{field:"age",value:[]})),e.jsx("div",{className:"space-y-6",children:e.jsx(x,{...i})})),parameters:{docs:{description:{story:'A numerical filter with range constraints. Note: Shows ">" operator by default due to global config override.'}}}},D={args:{field:{key:"age",type:"numerical",defaults:{min:0,max:120,defaultMin:0,defaultMax:120,intervalDecimal:0,defaultOperator:c.Between,rangeTypes:[{key:"year",name:"Year"},{key:"month",name:"Month"},{key:"day",name:"Day"}]}}},render:i=>(G("activeQuery")(v.updateActiveQueryField(F.variant_exploration.app_id,{field:"age_unit",value:[]})),e.jsx("div",{className:"space-y-6",children:e.jsx(x,{...i})})),play:async({canvasElement:i})=>{const a=H(i),m=a.getByText("Between");p(m).toBeInTheDocument();const o=a.getByTestId("age_min"),r=a.getByTestId("age_max");p(o).toBeInTheDocument(),p(r).toBeInTheDocument();const f=a.getByText("Year");p(f).toBeInTheDocument();const s=a.getByText("Clear");p(s).toBeDisabled(),await _.type(o,"50"),p(s).toBeEnabled(),await _.click(s),p(o).toHaveValue(0),p(r).toHaveValue(120),p(f).toHaveTextContent("Year")},parameters:{docs:{description:{story:"A numerical filter with range type options (Year, Month, Day) and unit selection. Tests validate range operator changes, unit selection, no data visibility, and clear functionality."}}}};var se,ie,oe;w.parameters={...w.parameters,docs:{...(se=w.parameters)==null?void 0:se.docs,source:{originalSource:`{
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
}`,...(oe=(ie=w.parameters)==null?void 0:ie.docs)==null?void 0:oe.source}}};var le,ce,de;S.parameters={...S.parameters,docs:{...(le=S.parameters)==null?void 0:le.docs,source:{originalSource:`{
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
}`,...(de=(ce=S.parameters)==null?void 0:ce.docs)==null?void 0:de.source}}};var ue,me,pe;E.parameters={...E.parameters,docs:{...(ue=E.parameters)==null?void 0:ue.docs,source:{originalSource:`{
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
}`,...(pe=(me=E.parameters)==null?void 0:me.docs)==null?void 0:pe.source}}};var ye,ve,fe;k.parameters={...k.parameters,docs:{...(ye=k.parameters)==null?void 0:ye.docs,source:{originalSource:`{
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
}`,...(fe=(ve=k.parameters)==null?void 0:ve.docs)==null?void 0:fe.source}}};var xe,he,ge;D.parameters={...D.parameters,docs:{...(xe=D.parameters)==null?void 0:xe.docs,source:{originalSource:`{
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
}`,...(ge=(he=D.parameters)==null?void 0:he.docs)==null?void 0:ge.source}}};const Rt=["Default","NoDataToggle","NoDataToggleHidden","RangeFilterWithInterval","RangeFilterWithRangeTypes"];export{w as Default,S as NoDataToggle,E as NoDataToggleHidden,k as RangeFilterWithInterval,D as RangeFilterWithRangeTypes,Rt as __namedExportsOrder,Ot as default};
