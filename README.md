#Here we talked about on how to Deploying AWS Lambda As Docker Container Images
# Go through this: https://medium.com/@kumar.santosh5187/deploying-aws-lambda-as-docker-container-images-9d1b36100174

Quick steps to build a Lambda function as a Docker Container Image, push it to ECR, and manually deploy using the lambda console. Hope this will provide you with an idea of how easy it is to integrate Docker into the Lambda build process through ECR


First, let’s review the terms….Docker Objects

Container — A container is a runnable instance of an image.

Docker Image — A Docker Image is a read-only template that enables the creation of a runnable instance of an application, specifically a docker image provides the execution environment for an application, any essential code, config files, and dependencies that are used to spin up a container.

Dockerfile — A Dockerfile is a simple set of instructions used to create a Docker image.

Here are steps to follow -


In order to build the application, we need to use a Dockerfile. A Dockerfile is a script of instructions that is used to create a container image. Create a file named Dockerfile in the same folder as the file package.json
FROM node:16-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install — production
COPY . .

#RUN npm run build

EXPOSE 3000

Dockerfile has no file extension like .txt

2. The Compose file is a YAML file defining services, networks, and volumes for a Docker application. here is one created for login module docker-compose.yml

version: ‘3.8’

services:
dev:container_name: test
image: test:1.0.0
build:context: .
target: development
dockerfile: ./Dockerfile
command: npm run start:dev
ports:
— 3000:3000
— 9229:9229
networks:
— nesjs-network
volumes:
— .:/usr/src/app
— /usr/src/app/node_modules
restart: unless-stopped
networks: nesjs-network:

3. Open a terminal and go to the app directory with the Dockerfile. Now build the container image using the docker build command.

docker build . -t test

This command used the Dockerfile to build a new container image.

Push Lambda container image to Amazon ECR

Create a repository(Amazon Elastic Container Registry) on aws if already not created. Now that you have an image to push to Amazon ECR, you must create a repository to hold it

2. Now you can push your image to the Amazon ECR repository you created in the previous section. You can go to your repository and click on view push commands


Authentication
aws ecr get-login-password — region ap-south-1 | docker login — username AWS — password-stdin *.dkr.ecr.ap-south-1.amazonaws.com

Tag your image
docker tag login:latest *.dkr.ecr.ap-south-1.amazonaws.com/test:latest

Pushing image to ECR
docker push *.dkr.ecr.ap-south-1.amazonaws.com/test:latest

3. Deploy Lambda container image with AWS Lambda console


Now the function container image will get deployed, You can run and test



## Installation

$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
