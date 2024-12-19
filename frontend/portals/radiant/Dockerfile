# Stage 1: Install root dependencies (including devDependencies)
FROM node:20-alpine AS directory-env
WORKDIR /workspace
COPY . /workspace/
RUN ls -l 
# RUN npm install
# 
# 
# FROM node:20-alpine AS root-dependencies-env
# RUN ls -l 
# WORKDIR /workspace/portals/radiant
# RUN npm install
# 
# # Stage 2: Install production dependencies for the radiant project
# FROM node:20-alpine AS production-dependencies-env
# WORKDIR /workspace/portals/radiant
# COPY ./portals/radiant/package.json /workspace/portals/radiant/
# COPY ./package-lock.json /workspace/
# RUN npm install --omit=dev
# 
# # Stage 3: Build the radiant project
# FROM node:20-alpine AS build-env
# WORKDIR /workspace/portals/radiant
# COPY ./portals/radiant /workspace/portals/radiant/
# COPY ./apps /workspace/apps
# COPY ./components /workspace/components
# COPY --from=root-dependencies-env /workspace/node_modules /workspace/node_modules
# RUN npm run build

# Stage 4: Final production image
# FROM node:20-alpine
# WORKDIR /workspace/portals/radiant
# COPY ./portals/radiant/package.json /workspace/portals/radiant/
# COPY --from=production-dependencies-env /workspace/portals/radiant/node_modules /workspace/portals/radiant/node_modules
# COPY --from=build-env /workspace/portals/radiant/build /workspace/portals/radiant/build
# CMD ["npm", "run", "start"]

