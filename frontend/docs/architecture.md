# Architectural Design Decisions (ADRs)

This directory contains the architectural design decisions for the Radiant Portal frontend architecture. These documents capture the reasoning behind key architectural choices and serve as a reference for future development decisions.

## Overview

The frontend architecture is designed to support multiple portals (e.g., Radiant, KF) with shared components and applications while maintaining customization capabilities. The architecture emphasizes code reuse, development efficiency, and scalability.

## ADR Index

### [ADR-0004: Multi-Portal Configurable Frontend Architecture](https://github.com/radiant-network/architecture/blob/main/decisions/0004-frontend-multi-portal-configurable-frontend-architecture.md)

This ADR describes the overall multi-portal architecture approach, including the layered structure (Portal Layer, Applications Layer, Components Layer, Tech Stack) and the configuration-driven portal generation strategy.

**Key Decisions**:
- Configuration-driven portal generation
- Compile-time configuration injection
- Theme system with portal-specific customization
- Context-based configuration management

### [ADR-0005: Component and Application Modularity with Workspace-Based Sharing](https://github.com/radiant-network/architecture/blob/main/decisions/0005-frontend-component-and-application-modularity.md)

This ADR focuses on the modular component and application architecture that enables maximum code reuse through workspace-based sharing.

**Key Decisions**:
- Monorepo with workspace for direct source imports
- Self-contained applications with domain focus
- Shared component library with base and feature components
- Configuration-driven application composition

### [ADR-0006: Build and Deployment Strategy](https://github.com/radiant-network/architecture/blob/main/decisions/0006-frontend-build-and-deployment-strategy.md)

This ADR describes the build and deployment strategy that supports multiple portal configurations while optimizing for performance and maintainability.

**Key Decisions**:
- Multi-target build system with environment-based configuration
- Compile-time optimization and tree-shaking
- Portal-specific asset optimization
- Independent deployment pipelines per portal

## Architecture Benefits

### Code Reuse
- **~80% code reduction** through shared components and applications
- **Immediate code sharing** without package management overhead
- **Consistent user experience** across all portals

### Development Efficiency
- **Rapid portal creation** through configuration files
- **Unified development experience** with single repository
- **Type safety** across the entire workspace

### Customization Capabilities
- **Portal-specific themes** and branding
- **Configuration-driven features** and aggregations
- **Flexible application composition** per portal

### Performance Optimization
- **Compile-time tree-shaking** based on portal configuration
- **Portal-specific optimizations** and code splitting
- **Optimized bundle sizes** per portal

## Architecture Diagram

The architecture follows a layered approach:

```
┌───────────────────────────────────────────────────────────┐
│                    PORTAL LAYER                           │
│  ┌────────────────────────────────────────────────────┐   │
│  │              PORTALS DIRECTORY                     │   │
│  │  ┌────────────────────────────────────────────┐    │   │
│  │  │              CUSTOMIZATION                  │   │   │
│  │  │  ┌─────────┐ ┌─────────┐ ┌─────────┐        │   │   │
│  │  │  │ Config  │ │   API   │ │ Logos   │        │   │   │
│  │  │  │  File   │ │Endpoints│ │         │        │   │   │
│  │  │  └─────────┘ └─────────┘ └─────────┘        │   │   │
│  │  │  ┌─────────┐ ┌─────────┐                    │   │   │
│  │  │  │ Themes  │ │Translation│                  │   │   │
│  │  │  │         │ │ Override │                   │   │   │
│  │  │  └─────────┘ └─────────┘                    │   │   │
│  │  └─────────────────────────────────────────────┘   │   │
│  └────────────────────────────────────────────────────┘   │
└───────────────────────────────────────────────────────────┘
                              │
                              │ uses applications
                              ▼
┌────────────────────────────────────────────────────────────┐
│                 APPLICATIONS LAYER                         │
│  ┌─────────────────┐  ┌─────────────────┐                  │
│  │   Case Entity   │  │ Case Exploration│                  │
│  │        A        │  │      🔍         │                  │
│  └─────────────────┘  └─────────────────┘                  │
└────────────────────────────────────────────────────────────┘
                              │
                              │ uses components
                              ▼
┌──────────────────────────────────────────────────────────────┐
│                  COMPONENTS LAYER                            │
│  ┌─────────────────┐  ┌─────────────────┐                    │
│  │    Storybook    │  │     shadcn      │                    │
│  │        S        │  │       ▢         │                    │
│  └─────────────────┘  └─────────────────┘                    │
│                                                              │
│  ┌───────────────────────────────────────────────────────┐   │
│  │                    FEATURES                           │   │
│  │  ┌──────────┐ ┌─────────┐ ┌────────────┐ ┌──────────┐ │   │
│  │  │Navigation│ │ Filters │ │QueryBuilder│ │PageLayout│ │   │
│  │  │    ➡️    │ │   🗑️    │ │      <>    │ │    📄    │ │   │
│  │  └──────────┘ └─────────┘ └────────────┘ └──────────┘ │   │
│  │  ┌─────────┐                                          │   │
│  │  │TanStack │                                          │   │
│  │  │ Table   │                                          │   │
│  │  │   📊    │                                          │   │
│  │  └─────────┘                                          │   │
│  └───────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────┘
                              │
                              │ uses components
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    TECH STACK                               │
│  ┌─────────┐ ┌─────────┐ ┌───────────┐ ┌─────────────────┐  │
│  │   TS    │ │  React  │ │TailwindCSS│ │React Router 7   │  │
│  └─────────┘ └─────────┘ └───────────┘ └─────────────────┘  │
│  ┌─────────┐                                                │
│  │ Shadcn  │                                                │
│  │   ⬜    │                                                │
│  └─────────┘                                                │
└─────────────────────────────────────────────────────────────┘
```

## Related Documentation

- [Project Structure](./project-structure.md)
- [Component Library Documentation](./components/README.md)
- [Portal Configuration Examples](../portals/radiant/config/)

## Contributing

When making significant architectural decisions, please:

1. Create a new ADR following the template
2. Update this index with the new ADR
3. Link related ADRs together
4. Update the status when decisions are implemented or changed
 
