pipeline {
    agent {
        label 'docker && linux'
    }

    environment {
        DOCKERHUB_CREDENTIALS_ID = 'dockerhub-credentials'
        DOCKER_IMAGE_NAME = 'nguyentdkptit02/dop2025.shopsquare.frontend'

        AWS_CREDENTIALS_ID = 'aws-credentials'
        AWS_REGION = 'ap-northeast-2'
        AWS_ACCOUNT_ID = '846040891095'
        AWS_ECR_REPO_NAME = 'shopsquare/frontend'
        AWS_ECR_IMAGE_URI = "${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${AWS_ECR_REPO_NAME}"
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm // Checkout the source code from the triggered commit
            }
        }

        stage('Install Docker') {
            steps {
                sh '''
                if ! [ -x "$(command -v docker)" ]; then
                    echo "Docker is not installed. Installing Docker..."
                    curl -fsSL https://get.docker.com -o get-docker.sh
                    sh get-docker.sh
                    rm get-docker.sh
                else
                    echo "Docker is already installed."
                fi
                '''
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    echo "Building Docker image: ${DOCKER_IMAGE_NAME}:${BUILD_NUMBER}"
                    sh "docker build -t ${DOCKER_IMAGE_NAME}:${BUILD_NUMBER} -t ${DOCKER_IMAGE_NAME}:latest ."
                }
            }
        }

        stage('Push to DockerHub') {
            steps {
                withCredentials([usernamePassword(credentialsId: DOCKERHUB_CREDENTIALS_ID, usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                    sh "echo ${DOCKER_PASS} | docker login -u ${DOCKER_USER} --password-stdin"
                    sh "docker push ${DOCKER_IMAGE_NAME}:v1.0.${BUILD_NUMBER}"
                    sh "docker push ${DOCKER_IMAGE_NAME}:latest"
                }
            }
        }
    }

    post {
        always {
            sh "docker logout"
        }
    }
}