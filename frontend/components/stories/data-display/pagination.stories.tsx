import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { BrowserRouter } from 'react-router-dom';
import { ConfigProvider, PortalConfig } from '@/components/model/applications-config';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationFirst,
  PaginationLast,
  PaginationNext,
  PaginationPrevious,
  PaginationPageSize,
} from '@/components/base/ui/pagination';

const config: PortalConfig = {
  variant_entity: {
    app_id: 'variant_entity',
  },
  variant_exploration: {
    app_id: 'variant_exploration_multi_select_filter',
    aggregations: [] as any,
  },
  admin: {
    admin_code: 'admin',
    app_id: 'admin',
  },
  portal: {
    name: '',
    navigation: {},
  },
};

const meta = {
  title: 'Data Display/Pagination',
  component: Pagination,
  decorators: [
    Story => (
      <BrowserRouter>
        <ConfigProvider config={config}>
          <Story className="w-full" />
        </ConfigProvider>
      </BrowserRouter>
    ),
  ],
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof Pagination>;

export default meta;

type Story = StoryObj<typeof meta>;

// Individual component stories
export const ContainerWithNumbers: Story = {
  render: () => (
    <Pagination>
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
  ),
};

export const First: Story = {
  render: () => (
    <PaginationFirst />
  ),
};

export const Last: Story = {
  render: () => (
    <PaginationLast />
  ),
};

export const Previous: Story = {
  render: () => (
    <PaginationPrevious />
  ),
};

export const Next: Story = {
  render: () => (
    <PaginationNext />
  ),
};

export const Ellipsis: Story = {
  render: () => (
    <PaginationEllipsis />
  ),
};

export const PageSize: Story = {
  render: () => (
    <PaginationPageSize 
      pageSize={20} 
      onPageSizeChange={(size) => console.log('Page size changed to:', size)}
    />
  ),
};

// Combined story showing all components together
export const CompletePagination: Story = {
  render: () => (
    <div className="space-y-8">
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
                <PaginationPageSize 
                  pageSize={20} 
                  onPageSizeChange={(size) => console.log('Page size changed to:', size)}
                />
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
  ),
};

// Interactive story with state management
export const InteractivePagination: Story = {
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
          pages.push(
            <PaginationItem key={i}>
              <PaginationLink 
                isActive={i === currentPage}
                onClick={() => handlePageChange(i)}
              >
                {i}
              </PaginationLink>
            </PaginationItem>
          );
        }
      } else {
        // Show first page
        pages.push(
          <PaginationItem key={1}>
            <PaginationLink 
              isActive={1 === currentPage}
              onClick={() => handlePageChange(1)}
            >
              1
            </PaginationLink>
          </PaginationItem>
        );

        // Show ellipsis if needed
        if (currentPage > 3) {
          pages.push(
            <PaginationItem key="ellipsis1">
              <PaginationEllipsis />
            </PaginationItem>
          );
        }

        // Show current page and neighbors
        const start = Math.max(2, currentPage - 1);
        const end = Math.min(totalPages - 1, currentPage + 1);
        
        for (let i = start; i <= end; i++) {
          pages.push(
            <PaginationItem key={i}>
              <PaginationLink 
                isActive={i === currentPage}
                onClick={() => handlePageChange(i)}
              >
                {i}
              </PaginationLink>
            </PaginationItem>
          );
        }

        // Show ellipsis if needed
        if (currentPage < totalPages - 2) {
          pages.push(
            <PaginationItem key="ellipsis2">
              <PaginationEllipsis />
            </PaginationItem>
          );
        }

        // Show last page
        pages.push(
          <PaginationItem key={totalPages}>
            <PaginationLink 
              isActive={totalPages === currentPage}
              onClick={() => handlePageChange(totalPages)}
            >
              {totalPages}
            </PaginationLink>
          </PaginationItem>
        );
      }

      return pages;
    };

    return (
      <div className="space-y-4">
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
          <PaginationPageSize 
            pageSize={pageSize} 
            onPageSizeChange={setPageSize}
            pageSizeOptions={[10, 20, 50, 100]}
          />
        </div>
      </div>
    );
  },
}; 