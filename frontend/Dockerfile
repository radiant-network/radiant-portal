# Stage 1: Install root workspace dependencies
FROM node:20-alpine AS root-dependencies-env
WORKDIR /workspace
COPY ./package.json ./package-lock.json /workspace/
RUN npm install

# Stage 2: Install production dependencies for the target project
FROM node:20-alpine AS production-dependencies-env
WORKDIR /workspace/portals/radiant
COPY ./portals/radiant/package.json /workspace/portals/radiant/
COPY ./package-lock.json /workspace/
RUN ls -l /workspace/
RUN ls -l /workspace/portals/radiant/
RUN npm install --omit=dev

# Stage 3: Build the target project
FROM node:20-alpine AS build-env
WORKDIR /workspace/portals/radiant
COPY ./portals/radiant /workspace/portals/radiant/
COPY --from=production-dependencies-env /workspace/portals/radiant/node_modules /workspace/portals/radiant/node_modules
RUN npm run build

# Stage 4: Create the final production image
FROM node:20-alpine
WORKDIR /workspace/portals/radiant
COPY --from=build-env /workspace/portals/radiant/build /workspace/portals/radiant/build
CMD ["npm", "run", "start"]

