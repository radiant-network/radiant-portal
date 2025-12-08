import{j as n}from"./jsx-runtime-D_zvdyIk.js";import{r as b}from"./index-CBYaBgW8.js";import{P as c,a as m,b as i,c as a,d as C,e as S,f,g as L,h as r,i as N}from"./pagination-CoHhztRS.js";import{C as mn,A as l}from"./applications-config-3OOAo44D.js";import{B as Pn}from"./chunk-PVWAREVJ-ZXULl1h5.js";import"./utils-D-KgF5mV.js";import"./button-CNrQRuJA.js";import"./index-Dut9wsGU.js";import"./index-sTUCEGFJ.js";import"./index-BWnBDfn-.js";import"./action-button-KkvxmIWD.js";import"./dropdown-menu-BJyjb2OL.js";import"./index-Ba5mf8A5.js";import"./index-C6lL4ijz.js";import"./index-CJAxgcjH.js";import"./Combination-B-dCT06H.js";import"./index-DrGCp3O6.js";import"./index-BtWW-1ow.js";import"./index-BZEiv_1o.js";import"./index-ycEarWk3.js";import"./check-DSe_yRo5.js";import"./createLucideIcon-B119WVF5.js";import"./separator-B36Ht569.js";import"./button.variants-Du9eY_ux.js";import"./index-C66Dxnp2.js";import"./spinner-CKwzofCp.js";import"./tooltip-BjBxR1Ac.js";import"./index-BiH9rn-5.js";import"./i18n-B5b-4376.js";import"./iframe-CiL2Wsxj.js";import"./i18next-CYn7LYXT.js";import"./select-DMB6Vi4A.js";import"./index-SF2qmtPV.js";import"./chevron-down-DOuPo75j.js";import"./chevron-up-C0Hb7JXF.js";import"./ellipsis-RxOQoOKc.js";const ln={variant_entity:{app_id:l.variant_entity},snv_occurrence:{app_id:l.snv_occurrence,aggregations:[]},cnv_occurrence:{app_id:l.cnv_occurrence,aggregations:[]},admin:{admin_code:"admin",app_id:l.admin},portal:{name:"",navigation:{}}},Un={title:"Paginations/Pagination",component:c,decorators:[e=>n.jsx(Pn,{children:n.jsx(mn,{config:ln,children:n.jsx(e,{className:"w-full"})})})],parameters:{layout:"centered"}},d={render:()=>n.jsx(c,{children:n.jsxs(m,{children:[n.jsx(i,{children:n.jsx(a,{children:"1"})}),n.jsx(i,{children:n.jsx(a,{children:"2"})}),n.jsx(i,{children:n.jsx(a,{children:"3"})})]})})},p={render:()=>n.jsx(C,{})},h={render:()=>n.jsx(S,{})},x={render:()=>n.jsx(f,{})},u={render:()=>n.jsx(L,{})},j={render:()=>n.jsx(r,{})},I={render:()=>n.jsx(N,{pageSize:20,onPageSizeChange:e=>console.log("Page size changed to:",e)})},k={render:()=>n.jsxs("div",{className:"space-y-8",children:[n.jsxs("div",{children:[n.jsx("h3",{className:"text-sm font-medium mb-2",children:"Basic Pagination"}),n.jsx(c,{children:n.jsxs(m,{children:[n.jsx(i,{children:n.jsx(a,{children:"1"})}),n.jsx(i,{children:n.jsx(a,{isActive:!0,children:"2"})}),n.jsx(i,{children:n.jsx(a,{children:"3"})}),n.jsx(i,{children:n.jsx(a,{children:"4"})}),n.jsx(i,{children:n.jsx(a,{children:"5"})})]})})]}),n.jsxs("div",{children:[n.jsx("h3",{className:"text-sm font-medium mb-2",children:"Pagination with Navigation"}),n.jsx(c,{children:n.jsxs(m,{children:[n.jsx(i,{children:n.jsx(C,{})}),n.jsx(i,{children:n.jsx(f,{})}),n.jsx(i,{children:n.jsx(r,{})}),n.jsx(i,{children:n.jsx(a,{children:"4"})}),n.jsx(i,{children:n.jsx(a,{isActive:!0,children:"5"})}),n.jsx(i,{children:n.jsx(a,{children:"6"})}),n.jsx(i,{children:n.jsx(r,{})}),n.jsx(i,{children:n.jsx(L,{})}),n.jsx(i,{children:n.jsx(S,{})})]})})]}),n.jsxs("div",{children:[n.jsx("h3",{className:"text-sm font-medium mb-2",children:"Complete Pagination Example"}),n.jsxs("div",{className:"flex items-center justify-between",children:[n.jsxs("div",{className:"flex items-center gap-2",children:[n.jsx("span",{className:"text-sm text-muted-foreground",children:"Showing 21-40"}),n.jsx("span",{className:"text-sm text-muted-foreground",children:"of 1,234 results"})]}),n.jsx(c,{children:n.jsxs(m,{children:[n.jsx(i,{children:n.jsx(N,{pageSize:20,onPageSizeChange:e=>console.log("Page size changed to:",e)})}),n.jsx(i,{children:n.jsx(C,{})}),n.jsx(i,{children:n.jsx(f,{})}),n.jsx(i,{children:n.jsx(a,{children:"1"})}),n.jsx(i,{children:n.jsx(r,{})}),n.jsx(i,{children:n.jsx(a,{children:"4"})}),n.jsx(i,{children:n.jsx(a,{isActive:!0,children:"5"})}),n.jsx(i,{children:n.jsx(a,{children:"6"})}),n.jsx(i,{children:n.jsx(r,{})}),n.jsx(i,{children:n.jsx(a,{children:"62"})}),n.jsx(i,{children:n.jsx(L,{})}),n.jsx(i,{children:n.jsx(S,{})})]})})]})]})]})},v={render:()=>{const[e,en]=b.useState(5),[P,tn]=b.useState(20),t=62,z=1234,sn=(e-1)*P+1,on=Math.min(e*P,z),o=s=>{en(Math.max(1,Math.min(s,t)))},rn=()=>{const s=[];{s.push(n.jsx(i,{children:n.jsx(a,{isActive:e===1,onClick:()=>o(1),children:"1"})},1)),e>3&&s.push(n.jsx(i,{children:n.jsx(r,{})},"ellipsis1"));const gn=Math.max(2,e-1),cn=Math.min(t-1,e+1);for(let g=gn;g<=cn;g++)s.push(n.jsx(i,{children:n.jsx(a,{isActive:g===e,onClick:()=>o(g),children:g})},g));e<t-2&&s.push(n.jsx(i,{children:n.jsx(r,{})},"ellipsis2")),s.push(n.jsx(i,{children:n.jsx(a,{isActive:t===e,onClick:()=>o(t),children:t})},t))}return s};return n.jsxs("div",{className:"space-y-4",children:[n.jsxs("div",{className:"text-center",children:[n.jsxs("p",{className:"text-sm text-muted-foreground",children:["Current Page: ",e," | Page Size: ",P," | Total Pages: ",t]}),n.jsxs("p",{className:"text-sm text-muted-foreground",children:["Showing ",sn,"-",on," of ",z," results"]})]}),n.jsx(c,{children:n.jsxs(m,{children:[n.jsx(i,{children:n.jsx(C,{onClick:()=>o(1)})}),n.jsx(i,{children:n.jsx(f,{onClick:()=>o(e-1)})}),rn(),n.jsx(i,{children:n.jsx(L,{onClick:()=>o(e+1)})}),n.jsx(i,{children:n.jsx(S,{onClick:()=>o(t)})})]})}),n.jsx("div",{className:"flex justify-center",children:n.jsx(N,{pageSize:P,onPageSizeChange:tn,pageSizeOptions:[10,20,50,100]})})]})}};var w,y,A;d.parameters={...d.parameters,docs:{...(w=d.parameters)==null?void 0:w.docs,source:{originalSource:`{
  render: () => <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationLink>1</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink>2</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink>3</PaginationLink>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
}`,...(A=(y=d.parameters)==null?void 0:y.docs)==null?void 0:A.source}}};var E,_,M;p.parameters={...p.parameters,docs:{...(E=p.parameters)==null?void 0:E.docs,source:{originalSource:`{
  render: () => <PaginationFirst />
}`,...(M=(_=p.parameters)==null?void 0:_.docs)==null?void 0:M.source}}};var R,F,B;h.parameters={...h.parameters,docs:{...(R=h.parameters)==null?void 0:R.docs,source:{originalSource:`{
  render: () => <PaginationLast />
}`,...(B=(F=h.parameters)==null?void 0:F.docs)==null?void 0:B.source}}};var O,T,V;x.parameters={...x.parameters,docs:{...(O=x.parameters)==null?void 0:O.docs,source:{originalSource:`{
  render: () => <PaginationPrevious />
}`,...(V=(T=x.parameters)==null?void 0:T.docs)==null?void 0:V.source}}};var W,q,D;u.parameters={...u.parameters,docs:{...(W=u.parameters)==null?void 0:W.docs,source:{originalSource:`{
  render: () => <PaginationNext />
}`,...(D=(q=u.parameters)==null?void 0:q.docs)==null?void 0:D.source}}};var G,H,J;j.parameters={...j.parameters,docs:{...(G=j.parameters)==null?void 0:G.docs,source:{originalSource:`{
  render: () => <PaginationEllipsis />
}`,...(J=(H=j.parameters)==null?void 0:H.docs)==null?void 0:J.source}}};var K,Q,U;I.parameters={...I.parameters,docs:{...(K=I.parameters)==null?void 0:K.docs,source:{originalSource:`{
  render: () => <PaginationPageSize pageSize={20} onPageSizeChange={size => console.log('Page size changed to:', size)} />
}`,...(U=(Q=I.parameters)==null?void 0:Q.docs)==null?void 0:U.source}}};var X,Y,Z;k.parameters={...k.parameters,docs:{...(X=k.parameters)==null?void 0:X.docs,source:{originalSource:`{
  render: () => <div className="space-y-8">
      {/* Basic pagination with numbers */}
      <div>
        <h3 className="text-sm font-medium mb-2">Basic Pagination</h3>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationLink>1</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink isActive>2</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink>3</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink>4</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink>5</PaginationLink>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>

      {/* Pagination with navigation buttons */}
      <div>
        <h3 className="text-sm font-medium mb-2">Pagination with Navigation</h3>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationFirst />
            </PaginationItem>
            <PaginationItem>
              <PaginationPrevious />
            </PaginationItem>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink>4</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink isActive>5</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink>6</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem>
              <PaginationNext />
            </PaginationItem>
            <PaginationItem>
              <PaginationLast />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>

      <div>
        <h3 className="text-sm font-medium mb-2">Complete Pagination Example</h3>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Showing 21-40</span>
            <span className="text-sm text-muted-foreground">of 1,234 results</span>
          </div>

          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPageSize pageSize={20} onPageSizeChange={size => console.log('Page size changed to:', size)} />
              </PaginationItem>
              <PaginationItem>
                <PaginationFirst />
              </PaginationItem>
              <PaginationItem>
                <PaginationPrevious />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink>1</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink>4</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink isActive>5</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink>6</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink>62</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationNext />
              </PaginationItem>
              <PaginationItem>
                <PaginationLast />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </div>
}`,...(Z=(Y=k.parameters)==null?void 0:Y.docs)==null?void 0:Z.source}}};var $,nn,an;v.parameters={...v.parameters,docs:{...($=v.parameters)==null?void 0:$.docs,source:{originalSource:`{
  render: () => {
    const [currentPage, setCurrentPage] = React.useState(5);
    const [pageSize, setPageSize] = React.useState(20);
    const totalPages = 62;
    const totalResults = 1234;
    const startItem = (currentPage - 1) * pageSize + 1;
    const endItem = Math.min(currentPage * pageSize, totalResults);
    const handlePageChange = (page: number) => {
      setCurrentPage(Math.max(1, Math.min(page, totalPages)));
    };
    const renderPageNumbers = () => {
      const pages = [];
      const maxVisiblePages = 5;
      if (totalPages <= maxVisiblePages) {
        // Show all pages if total is small
        for (let i = 1; i <= totalPages; i++) {
          pages.push(<PaginationItem key={i}>
              <PaginationLink isActive={i === currentPage} onClick={() => handlePageChange(i)}>
                {i}
              </PaginationLink>
            </PaginationItem>);
        }
      } else {
        // Show first page
        pages.push(<PaginationItem key={1}>
            <PaginationLink isActive={1 === currentPage} onClick={() => handlePageChange(1)}>
              1
            </PaginationLink>
          </PaginationItem>);

        // Show ellipsis if needed
        if (currentPage > 3) {
          pages.push(<PaginationItem key="ellipsis1">
              <PaginationEllipsis />
            </PaginationItem>);
        }

        // Show current page and neighbors
        const start = Math.max(2, currentPage - 1);
        const end = Math.min(totalPages - 1, currentPage + 1);
        for (let i = start; i <= end; i++) {
          pages.push(<PaginationItem key={i}>
              <PaginationLink isActive={i === currentPage} onClick={() => handlePageChange(i)}>
                {i}
              </PaginationLink>
            </PaginationItem>);
        }

        // Show ellipsis if needed
        if (currentPage < totalPages - 2) {
          pages.push(<PaginationItem key="ellipsis2">
              <PaginationEllipsis />
            </PaginationItem>);
        }

        // Show last page
        pages.push(<PaginationItem key={totalPages}>
            <PaginationLink isActive={totalPages === currentPage} onClick={() => handlePageChange(totalPages)}>
              {totalPages}
            </PaginationLink>
          </PaginationItem>);
      }
      return pages;
    };
    return <div className="space-y-4">
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Current Page: {currentPage} | Page Size: {pageSize} | Total Pages: {totalPages}
          </p>
          <p className="text-sm text-muted-foreground">
            Showing {startItem}-{endItem} of {totalResults} results
          </p>
        </div>

        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationFirst onClick={() => handlePageChange(1)} />
            </PaginationItem>
            <PaginationItem>
              <PaginationPrevious onClick={() => handlePageChange(currentPage - 1)} />
            </PaginationItem>

            {renderPageNumbers()}

            <PaginationItem>
              <PaginationNext onClick={() => handlePageChange(currentPage + 1)} />
            </PaginationItem>
            <PaginationItem>
              <PaginationLast onClick={() => handlePageChange(totalPages)} />
            </PaginationItem>
          </PaginationContent>
        </Pagination>

        <div className="flex justify-center">
          <PaginationPageSize pageSize={pageSize} onPageSizeChange={setPageSize} pageSizeOptions={[10, 20, 50, 100]} />
        </div>
      </div>;
  }
}`,...(an=(nn=v.parameters)==null?void 0:nn.docs)==null?void 0:an.source}}};const Xn=["ContainerWithNumbers","First","Last","Previous","Next","Ellipsis","PageSize","CompletePagination","InteractivePagination"];export{k as CompletePagination,d as ContainerWithNumbers,j as Ellipsis,p as First,v as InteractivePagination,h as Last,u as Next,I as PageSize,x as Previous,Xn as __namedExportsOrder,Un as default};
