import{j as e}from"./jsx-runtime-Cf8x2fCZ.js";import{a as G}from"./index-B-lxVbXh.js";import{R as c,q as f,M as Q,S as Oe}from"./query-builder-remote-CzQy3Xv-.js";import{r as d}from"./index-tvICUrOf.js";import{B as J}from"./button-DrgHO3YC.js";import{u as Fe,C as Re}from"./applications-config-B4jBJrF9.js";import{d as X,S as Z,a as ee,b as te,c as ae}from"./select-LTPZfwaq.js";import{I as L}from"./input-BBA0CWHH.js";import{C as Me}from"./checkbox-DR5AvqL2.js";import{L as Ve}from"./label-BX6-Aqla.js";import{E as Ae,L as $e,G as qe,a as Qe,b as Le,c as Ge}from"./less-than-or-equal-operator-icon-BeMEXZ7b.js";import{u as He}from"./i18n-Ptj8cNv8.js";import{u as Ue,o as Ce}from"./api-DzVNRSuw.js";import{S as ne}from"./skeleton-CfkhzHGY.js";import{w as H,u as _,e as p}from"./index-BZkcKs8Z.js";import"./index-yBjzXJbu.js";import"./v4-CtRu48qb.js";import"./index-Csi1vtvD.js";import"./index-_r67kdfS.js";import"./index-fNjTmf9T.js";import"./ActionButton-Cw-9aGzR.js";import"./dropdown-menu-CMZaZ8cH.js";import"./Combination-CmKP2mMJ.js";import"./index-CueSDTQu.js";import"./index-DJkr1wGX.js";import"./index-pLOVI5Ig.js";import"./utils-CytzSlOG.js";import"./check-CfPT3E_d.js";import"./createLucideIcon-DKFpjrVJ.js";import"./button.variants-B79LQKoe.js";import"./index-C66Dxnp2.js";import"./ellipsis-NIzCCAdy.js";import"./spinner-Bn71UZIB.js";import"./index-C1xbsqtW.js";import"./index-Bwb5bU54.js";import"./chevron-down-D97Dr_NX.js";import"./iframe-iSvGW3un.js";import"./index-BNh7Aicb.js";function ge({children:i}){return e.jsx("p",{className:"text-sm text-muted-foreground",children:i})}ge.__docgenInfo={description:"",methods:[],displayName:"TextMuted",props:{children:{required:!1,tsType:{name:"ReactNode"},description:""}}};const Ye=i=>Ce.statisticsOccurrences(i.seqId,i.statisticsBody).then(a=>a.data);function We(i,a=!1,m){let o;a?o={seqId:"5011",statisticsBody:{field:i}}:o=null;const n=f.getResolvedActiveQuery(m);return n&&o&&(o.statisticsBody.sqon={content:n.content,op:n.op}),Ue(o,Ye,{revalidateOnFocus:!1})}function x({field:i}){var Y,W,z,P;const{t:a}=He(),m=Fe(),o=m.variant_entity.app_id,n=i.key,v={[c.GreaterThan]:{display:a("common.filters.operators.greaterThan"),dropdown:a("common.filters.operators.greaterThan"),icon:Ge},[c.LessThan]:{display:a("common.filters.operators.lessThan"),dropdown:a("common.filters.operators.lessThan"),icon:Le},[c.Between]:{display:a("common.filters.operators.between"),dropdown:a("common.filters.operators.between"),icon:Qe},[c.GreaterThanOrEqualTo]:{display:a("common.filters.operators.greaterThanOrEqual"),dropdown:a("common.filters.operators.greaterThanOrEqual"),icon:qe},[c.LessThanOrEqualTo]:{display:a("common.filters.operators.lessThanOrEqual"),dropdown:a("common.filters.operators.lessThanOrEqual"),icon:$e},[c.In]:{display:a("common.filters.operators.in"),dropdown:a("common.filters.operators.in"),icon:Ae}},{data:s,isLoading:_e}=We(n,!0,o),[h,T]=d.useState(c.GreaterThan),[F,B]=d.useState("0"),[R,N]=d.useState("0"),[M,b]=d.useState("0"),[V,A]=d.useState(!1),[g,U]=d.useState(),[Te,y]=d.useState(!1),Be=m.variant_entity.aggregations,t=(Y=Object.values(Be).flatMap(r=>r.items).find(r=>r.key===n))==null?void 0:Y.defaults,Ne=i.type==="numerical"&&(t==null?void 0:t.noDataInputOption),C=(t==null?void 0:t.intervalDecimal)!==void 0&&((t==null?void 0:t.max)!==void 0||(t==null?void 0:t.min)!==void 0)||s&&(s.min!==void 0||s.max!==void 0),$=(t==null?void 0:t.min)??(s==null?void 0:s.min)??0,q=(t==null?void 0:t.max)??(s==null?void 0:s.max)??100,I=d.useCallback(()=>{var K;const r=f.getResolvedActiveQuery(o);if(!(r!=null&&r.content))return;const l=r.content.find(u=>"content"in u&&"field"in u.content?u.content.field===n:!1),j=r.content.find(u=>"content"in u&&"field"in u.content?u.content.field===`${n}_unit`:!1);if(l){const u=l.content.value;if(u.includes("__missing__")){A(!0);return}if(u.length===2){T(c.Between);const ke=Number(u[0]).toFixed(3),De=Number(u[1]).toFixed(3);b(ke),N(De)}else B(u[0]);l.op&&!(t!=null&&t.defaultOperator)&&T(l.op)}else A(!1),(t==null?void 0:t.defaultMin)!==void 0?(b(t.defaultMin.toString()),B(t.defaultMin.toString())):(s==null?void 0:s.min)!==void 0&&(b(Number(s.min.toFixed(3)).toString()),B(Number(s.min.toFixed(3)).toString())),(t==null?void 0:t.defaultMax)!==void 0?N(t.defaultMax.toString()):(s==null?void 0:s.max)!==void 0&&N(Number(s.max.toFixed(3)).toString()),t!=null&&t.defaultOperator&&T(t.defaultOperator);U(j?j.content.value[0]:(K=t==null?void 0:t.rangeTypes)!=null&&K.length?t.rangeTypes[0].key:void 0)},[o,n,t,s]);d.useEffect(()=>{I()},[I]);const be=d.useCallback(r=>{T(r),y(!0)},[]),Ie=d.useCallback(r=>{A(r),y(!0)},[]),je=d.useCallback(r=>{U(r),y(!0)},[]),we=d.useCallback(()=>{y(!1),I()},[I]),Se=d.useCallback(()=>{if(y(!1),V){f.updateActiveQueryField(o,{field:n,value:["__missing__"],merge_strategy:Q.OVERRIDE_VALUES});return}let r=[];r=h===c.Between?[parseFloat(M.toString()),parseFloat(R.toString())]:[parseFloat(F.toString())],f.updateActiveQueryField(o,{field:n,value:r,merge_strategy:Q.OVERRIDE_VALUES,operator:h}),g&&f.updateActiveQueryField(o,{field:`${n}_unit`,value:[g],merge_strategy:Q.OVERRIDE_VALUES})},[o,n,h,F,M,R,V,g]),Ee=Object.entries(c).map(([r,l])=>{if(l in v){const j=v[l].icon;return e.jsx(X,{value:l,children:e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx(j,{size:16}),e.jsx("span",{children:v[l].dropdown})]})},l)}return null}).filter(Boolean);return e.jsxs("div",{className:"p-2 w-full max-w-md",id:`${n}_container`,children:[e.jsxs("div",{className:"space-y-3 pt-2",children:[e.jsxs("div",{className:"flex flex-col gap-3",children:[e.jsx("div",{id:`${n}_operator`,children:e.jsxs(Z,{defaultValue:`${Oe.GreaterThan}`,onValueChange:be,children:[e.jsx(ee,{children:e.jsx(te,{placeholder:a("common.filters.operators.selectOperator"),children:v[h].display})}),e.jsx(ae,{children:Ee})]})}),h===c.Between?e.jsxs("div",{className:"flex gap-2 flex-row",children:[e.jsx(L,{className:"w-half",value:M,onChange:r=>{const l=r.target.value;console.log("value",l),!isNaN(Number(l))&&(b(l),y(!0))},min:$,max:q,id:`${n}_min`,"data-testid":`${n}_min`}),e.jsx(L,{className:"w-half",value:R,onChange:r=>{const l=r.target.value;isNaN(Number(l))||(N(l),y(!0))},min:$,max:q,id:`${n}_max`,"data-testid":`${n}_max`})]}):e.jsx(L,{className:"w-full",value:F,onChange:r=>{const l=r.target.value;isNaN(Number(l))||(B(l),y(!0))},min:$,max:q,id:`${n}_value`,"data-testid":`${n}_value`}),C&&e.jsx("div",{id:`${n}_interval`,children:e.jsxs(ge,{children:[a("common.filters.labels.actualInterval")," : ",(W=s==null?void 0:s.min)==null?void 0:W.toFixed(3)," -"," ",(z=s==null?void 0:s.max)==null?void 0:z.toFixed(3)]})})]}),(t==null?void 0:t.rangeTypes)&&t.rangeTypes.length>0&&e.jsx("div",{id:`${n}_range_type_container`,children:_e?e.jsxs(e.Fragment,{children:[e.jsx(ne,{className:"h-5 w-16 mb-1",id:`${n}_unit_label_skeleton`}),e.jsx(ne,{className:"h-9 w-full",id:`${n}_select_skeleton`})]}):e.jsxs(e.Fragment,{children:[e.jsx(Ve,{className:"text-sm",id:`${n}_unit_label`,children:a("common.filters.labels.unit")}),e.jsxs(Z,{defaultValue:g||t.rangeTypes[0].key,onValueChange:je,children:[e.jsx(ee,{children:e.jsx(te,{placeholder:a("common.filters.labels.selectUnit"),children:((P=t.rangeTypes.find(r=>r.key===g))==null?void 0:P.name)||a("common.filters.labels.selectUnit")})}),e.jsx(ae,{children:t.rangeTypes.map(r=>e.jsx(X,{value:r.key,children:r.name},r.key))})]})]})}),Ne&&!C&&e.jsxs("label",{className:"flex items-center space-x-2 overflow-hidden",id:`${n}_no_data_label`,children:[e.jsx(Me,{checked:V,onCheckedChange:Ie,id:`${n}_no_data`}),e.jsx("span",{children:a("common.filters.labels.noData")})]})]}),e.jsx("hr",{className:"my-4 border-border",id:`${n}_divider`}),e.jsxs("div",{className:"flex align-right justify-end items-center space-x-2",children:[e.jsx(J,{size:"xs",variant:"ghost",onClick:we,disabled:!Te,id:`${n}_clear`,children:a("common.filters.buttons.clear")}),e.jsx("div",{className:"flex space-x-2",children:e.jsx(J,{size:"xs",className:"h-7",color:"primary",onClick:Se,id:`${n}_apply`,children:a("common.filters.buttons.apply")})})]})]})}x.__docgenInfo={description:"",methods:[],displayName:"NumericalFilter",props:{field:{required:!0,tsType:{name:"AggregationConfig"},description:""}}};const O={variant_entity:{app_id:"variant_entity_toggle_filter",aggregations:[{key:"impact_score",type:"numerical",defaults:{min:0,max:100,defaultMin:0,defaultMax:100,intervalDecimal:2,defaultOperator:c.GreaterThan}},{key:"age",type:"numerical",defaults:{min:0,max:120,defaultMin:0,defaultMax:120,intervalDecimal:0,defaultOperator:c.Between,rangeTypes:[{key:"year",name:"Year"},{key:"month",name:"Month"},{key:"day",name:"Day"}]}}]}},Ot={title:"Feature/Query Filters/Numerical Filter",component:x,args:{field:{key:"impact_score",type:"numerical",defaults:{min:0,max:100,defaultMin:0,defaultMax:100,intervalDecimal:2,defaultOperator:c.GreaterThan}}},decorators:[i=>e.jsx(Re,{config:O,children:e.jsx(i,{})})]},w={render:i=>e.jsx("div",{className:"space-y-6",children:e.jsx(x,{...i})}),play:async({canvasElement:i})=>{const a=H(i),m=a.getByTestId("impact_score_value");await _.type(m,"75"),p(m).toHaveValue(75);const o=a.getByRole("button",{name:/apply/i});p(o).toBeEnabled(),await _.click(o)}},S={render:i=>(G("activeQuery")(f.updateActiveQueryField(O.variant_entity.app_id,{field:"impact_score",value:[]})),e.jsx("div",{className:"space-y-6",children:e.jsx(x,{...i})})),play:async({canvasElement:i})=>{const m=await H(i).findByText("No data");await _.click(m),p(m.previousElementSibling).toBeChecked()}},E={args:{field:{key:"impact_score",type:"multiple"}},render:i=>e.jsx("div",{className:"space-y-6",children:e.jsx(x,{...i})})},k={args:{field:{key:"age",type:"numerical",defaults:{min:0,max:120,defaultMin:0,defaultMax:120,intervalDecimal:0,defaultOperator:c.Between}}},render:i=>(G("activeQuery")(f.updateActiveQueryField(O.variant_entity.app_id,{field:"age",value:[]})),e.jsx("div",{className:"space-y-6",children:e.jsx(x,{...i})})),parameters:{docs:{description:{story:'A numerical filter with range constraints. Note: Shows ">" operator by default due to global config override.'}}}},D={args:{field:{key:"age",type:"numerical",defaults:{min:0,max:120,defaultMin:0,defaultMax:120,intervalDecimal:0,defaultOperator:c.Between,rangeTypes:[{key:"year",name:"Year"},{key:"month",name:"Month"},{key:"day",name:"Day"}]}}},render:i=>(G("activeQuery")(f.updateActiveQueryField(O.variant_entity.app_id,{field:"age_unit",value:[]})),e.jsx("div",{className:"space-y-6",children:e.jsx(x,{...i})})),play:async({canvasElement:i})=>{const a=H(i),m=a.getByText("Between");p(m).toBeInTheDocument();const o=a.getByTestId("age_min"),n=a.getByTestId("age_max");p(o).toBeInTheDocument(),p(n).toBeInTheDocument();const v=a.getByText("Year");p(v).toBeInTheDocument();const s=a.getByText("Clear");p(s).toBeDisabled(),await _.type(o,"50"),p(s).toBeEnabled(),await _.click(s),p(o).toHaveValue(0),p(n).toHaveValue(120),p(v).toHaveTextContent("Year")},parameters:{docs:{description:{story:"A numerical filter with range type options (Year, Month, Day) and unit selection. Tests validate range operator changes, unit selection, no data visibility, and clear functionality."}}}};var re,se,ie;w.parameters={...w.parameters,docs:{...(re=w.parameters)==null?void 0:re.docs,source:{originalSource:`{
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
}`,...(ie=(se=w.parameters)==null?void 0:se.docs)==null?void 0:ie.source}}};var oe,le,ce;S.parameters={...S.parameters,docs:{...(oe=S.parameters)==null?void 0:oe.docs,source:{originalSource:`{
  render: args => {
    action('activeQuery')(queryBuilderRemote.updateActiveQueryField(config.variant_entity.app_id, {
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
}`,...(ce=(le=S.parameters)==null?void 0:le.docs)==null?void 0:ce.source}}};var de,ue,me;E.parameters={...E.parameters,docs:{...(de=E.parameters)==null?void 0:de.docs,source:{originalSource:`{
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
    action('activeQuery')(queryBuilderRemote.updateActiveQueryField(config.variant_entity.app_id, {
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
    action('activeQuery')(queryBuilderRemote.updateActiveQueryField(config.variant_entity.app_id, {
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
}`,...(he=(xe=D.parameters)==null?void 0:xe.docs)==null?void 0:he.source}}};const Ft=["Default","NoDataToggle","NoDataToggleHidden","RangeFilterWithInterval","RangeFilterWithRangeTypes"];export{w as Default,S as NoDataToggle,E as NoDataToggleHidden,k as RangeFilterWithInterval,D as RangeFilterWithRangeTypes,Ft as __namedExportsOrder,Ot as default};
