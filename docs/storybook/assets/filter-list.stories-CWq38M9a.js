import{j as e}from"./jsx-runtime-D_zvdyIk.js";import{H as s,h as p}from"./index-DRDTZ9zG.js";import{a as M,F as L,A as O}from"./upload-id-modal-Dh21rnHr.js";import{S as A}from"./sidebar-DkCGrmm5.js";import{A as c,F as n,C as T}from"./applications-config-D6sxpq9M.js";import{R as i}from"./sqon-DDFmFWEM.js";import{M as I,R,a as w}from"./chunk-EPOLDU6W-BBQlfikL.js";import{X as E}from"./x-4HkHZ1eq.js";async function j(a){let r;return r=a,new Promise(v=>setTimeout(v,r))}const x="/api/occurrences/germline/snv/1/1/aggregate",N="/api/occurrences/germline/snv/1/1/statistics";async function C({request:a}){return(await a.clone().json()).field.includes("toggle filter")?s.json([{key:"true",count:150},{key:"false",count:85}]):s.json([{key:"lorem_ipsum",count:2},{key:"id_finibus",count:18},{key:"iaculis",count:39},{key:"porttitor_nec_ligula.",count:40},{key:"etiam_pharetra_ornare_porttitor",count:41},{key:"vivamus_non_facilisis_purus",count:52},{key:"proin_eu_felis_eu_arcu_varius_mattis",count:77},{key:"IG_J_pseudogene",count:168},{key:"lorem_ipsum_dolor_sit_amet_consectetur_adipiscing_elit",count:191},{key:"nam_diam_urna",count:227}])}async function F({request:a}){const r=await a.clone().json();return r.field.includes("no data")?s.json({avg:50,count:1e3,type:"decimal"}):r.field.includes("integer")?s.json({max:100,min:1,type:"integer"}):s.json({max:100,min:1,type:"decimal"})}const t={variant_entity:{app_id:c.variant_entity},snv_occurrence:{app_id:c.snv_occurrence,aggregations:{variant:{items:[{key:"multiple",translation_key:"multiple",type:n.MULTIPLE},{key:"multiple (with dictionary)",translation_key:"multiple (with dictionary)",type:n.MULTIPLE,withDictionary:!0},{key:"numerical (decimal)",translation_key:"numerical (decimal)",type:n.NUMERICAL,defaults:{min:0,max:100,defaultOperator:i.LessThan,defaultMin:0,defaultMax:100}},{key:"numerical (integer)",translation_key:"numerical (integer)",type:n.NUMERICAL,defaults:{min:0,max:100,defaultOperator:i.LessThan,defaultMin:0,defaultMax:100}},{key:"numerical (with unit)",translation_key:"numerical (with unit)",type:n.NUMERICAL,defaults:{min:0,max:120,defaultOperator:i.Between,defaultMin:0,defaultMax:120,intervalDecimal:0,rangeTypes:[{key:"year",name:"Year"},{key:"month",name:"Month"},{key:"day",name:"Day"}]}},{key:"numerical (no data)",translation_key:"numerical (no data)",type:n.NUMERICAL,defaults:{min:void 0,max:void 0,defaultOperator:i.GreaterThan,noDataInputOption:!0}},{key:"toggle filter",translation_key:"toggle filter",type:n.BOOLEAN}]}}},cnv_occurrence:{app_id:c.cnv_occurrence,aggregations:{variant:{items:[{key:"multiple",translation_key:"multiple",type:n.MULTIPLE},{key:"numerical (decimal)",translation_key:"numerical (decimal)",type:n.NUMERICAL,defaults:{min:0,max:100,defaultOperator:i.LessThan,defaultMin:0,defaultMax:100}},{key:"numerical (integer)",translation_key:"numerical (integer)",type:n.NUMERICAL,defaults:{min:0,max:100,defaultOperator:i.LessThan,defaultMin:0,defaultMax:100}},{key:"has_interpretation",translation_key:"has_interpretation",type:n.BOOLEAN}]}}},admin:{admin_code:"admin",app_id:c.admin},portal:{name:"",navigation:{}}},U={title:"QueryBuilder/Facets/FilterList",component:M,args:{appId:t.snv_occurrence.app_id,aggregations:t.snv_occurrence.aggregations,groupKey:"variant"},decorators:[a=>e.jsx(I,{initialEntries:["/case/1"],children:e.jsx(R,{children:e.jsx(w,{path:"/case/:caseId",element:e.jsx(T,{config:t,children:e.jsx(L.Provider,{value:{appId:t.snv_occurrence.app_id,aggregations:t.snv_occurrence.aggregations},children:e.jsx(O.Provider,{value:{caseId:1,seqId:1},children:e.jsx(A,{className:"h-full flex flex-row",children:e.jsx("div",{className:"bg-muted overflow-auto mb-16 border-r transition-[width] duration-300 ease-in-out w-[280px] p-4 opacity-100 relative",children:e.jsxs("div",{className:"whitespace-nowrap",children:[e.jsx("div",{className:"flex justify-end mb-4",children:e.jsx("button",{className:"text-muted-foreground hover:text-foreground",children:e.jsx(E,{size:16})})}),e.jsx(a,{})]})})})})})})})})})]},o={parameters:{msw:{handlers:[p.post(x,C),p.post(N,F)]}}},l={parameters:{msw:{handlers:[p.post(x,async()=>(await j(800),new s(null,{status:403})))]}}};var u,m,d;t.parameters={...t.parameters,docs:{...(u=t.parameters)==null?void 0:u.docs,source:{originalSource:`{
  variant_entity: {
    app_id: ApplicationId.variant_entity
  },
  snv_occurrence: {
    app_id: ApplicationId.snv_occurrence,
    aggregations: {
      variant: {
        items: [{
          key: 'multiple',
          translation_key: 'multiple',
          type: FilterTypes.MULTIPLE
        }, {
          key: 'multiple (with dictionary)',
          translation_key: 'multiple (with dictionary)',
          type: FilterTypes.MULTIPLE,
          withDictionary: true
        }, {
          key: 'numerical (decimal)',
          translation_key: 'numerical (decimal)',
          type: FilterTypes.NUMERICAL,
          defaults: {
            min: 0,
            max: 100,
            defaultOperator: RangeOperators.LessThan,
            defaultMin: 0,
            defaultMax: 100
          }
        }, {
          key: 'numerical (integer)',
          translation_key: 'numerical (integer)',
          type: FilterTypes.NUMERICAL,
          defaults: {
            min: 0,
            max: 100,
            defaultOperator: RangeOperators.LessThan,
            defaultMin: 0,
            defaultMax: 100
          }
        }, {
          key: 'numerical (with unit)',
          translation_key: 'numerical (with unit)',
          type: FilterTypes.NUMERICAL,
          defaults: {
            min: 0,
            max: 120,
            defaultOperator: RangeOperators.Between,
            defaultMin: 0,
            defaultMax: 120,
            intervalDecimal: 0,
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
        }, {
          key: 'numerical (no data)',
          translation_key: 'numerical (no data)',
          type: FilterTypes.NUMERICAL,
          defaults: {
            min: undefined,
            max: undefined,
            defaultOperator: RangeOperators.GreaterThan,
            noDataInputOption: true
          }
        }, {
          key: 'toggle filter',
          translation_key: 'toggle filter',
          type: FilterTypes.BOOLEAN
        }]
      }
    }
  },
  cnv_occurrence: {
    app_id: ApplicationId.cnv_occurrence,
    aggregations: {
      variant: {
        items: [{
          key: 'multiple',
          translation_key: 'multiple',
          type: FilterTypes.MULTIPLE
        }, {
          key: 'numerical (decimal)',
          translation_key: 'numerical (decimal)',
          type: FilterTypes.NUMERICAL,
          defaults: {
            min: 0,
            max: 100,
            defaultOperator: RangeOperators.LessThan,
            defaultMin: 0,
            defaultMax: 100
          }
        }, {
          key: 'numerical (integer)',
          translation_key: 'numerical (integer)',
          type: FilterTypes.NUMERICAL,
          defaults: {
            min: 0,
            max: 100,
            defaultOperator: RangeOperators.LessThan,
            defaultMin: 0,
            defaultMax: 100
          }
        }, {
          key: 'has_interpretation',
          translation_key: 'has_interpretation',
          type: FilterTypes.BOOLEAN
        }]
      }
    }
  },
  admin: {
    admin_code: 'admin',
    app_id: ApplicationId.admin
  },
  portal: {
    name: '',
    navigation: {}
  }
}`,...(d=(m=t.parameters)==null?void 0:m.docs)==null?void 0:d.source}}};var y,f,_;o.parameters={...o.parameters,docs:{...(y=o.parameters)==null?void 0:y.docs,source:{originalSource:`{
  parameters: {
    msw: {
      handlers: [http.post(occurrenceApi, httpOccurrenceApiResponse), http.post(statisticApi, httpStatisticsApiResponse)]
    }
  }
}`,...(_=(f=o.parameters)==null?void 0:f.docs)==null?void 0:_.source}}};var g,k,h;l.parameters={...l.parameters,docs:{...(g=l.parameters)==null?void 0:g.docs,source:{originalSource:`{
  parameters: {
    msw: {
      handlers: [http.post(occurrenceApi, async () => {
        await delay(800);
        return new HttpResponse(null, {
          status: 403
        });
      })]
    }
  }
}`,...(h=(k=l.parameters)==null?void 0:k.docs)==null?void 0:h.source}}};const b=["filterListConfig","Default","Error"],q=Object.freeze(Object.defineProperty({__proto__:null,Default:o,Error:l,__namedExportsOrder:b,default:U,filterListConfig:t},Symbol.toStringTag,{value:"Module"}));export{F as a,q as b,t as f,C as h,x as o,N as s};
