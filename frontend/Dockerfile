# Stage 1: Install root dependencies (including devDependencies)
# FROM node:20-alpine AS root-dependencies-env
# COPY . /workspace/
# RUN ls -l 
# WORKDIR /workspace/portals/radiant
# RUN npm install
# 
# # Stage 2: Install production dependencies for the radiant project
# FROM node:20-alpine AS production-dependencies-env
# WORKDIR /workspace/portals/radiant
# #COPY ./portals/radiant/package.json /workspace/portals/radiant/
# #COPY ./package-lock.json /workspace/
# RUN ls -lh
# RUN npm install --omit=dev

FROM node:20-alpine AS build-deps
WORKDIR /workspace/portals/radiant
COPY ./portals/radiant /workspace/portals/radiant/
COPY ./apps /workspace/apps
COPY ./components /workspace/components

FROM node:20-alpine AS workspace-dependencies-env
WORKDIR /workspace
COPY ./package.json ./package-lock.json /workspace/
COPY --from=build-deps /workspace/ /workspace/
RUN npm install 
RUN ls -lh

# Stage 3: Build the radiant project
FROM node:20-alpine AS build-env
WORKDIR /workspace/portals/radiant
# COPY --from=root-dependencies-env /workspace/node_modules /workspace/node_modules
COPY --from=workspace-dependencies-env /workspace/ /workspace/
RUN npm i
RUN npm run build

# Stage 4: Final production image
FROM node:20-alpine
WORKDIR /workspace/portals/radiant
COPY --from=workspace-dependencies-env /workspace/ /workspace/
CMD ["npm", "run", "start"]
# 
