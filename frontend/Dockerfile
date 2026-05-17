# Stage 1: Build

FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL


RUN echo "The built-in API URL is: $VITE_API_BASE_URL"
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:stable-alpine
COPY --from=build /app/dist /usr/share/nginx/html

# If you use React Router, you need a custom nginx.conf to handle routing
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]