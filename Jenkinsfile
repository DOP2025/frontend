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

        SONAR_HOST_URL = 'http://13.125.65.154:9000'
        SONAR_AUTH_TOKEN = credentials('sonar-qube-demo-pat')
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm // Checkout the source code from the triggered commit
            }
        }

        stage('Setup dependencies') {
            steps {
                // sh 'node --version'
                // sh 'npm --version'
                echo "Setup dependencies stage success."
            }
        }

        stage('Analysis') {
            steps {
                environment {
                    scannerHome = tool 'SonarQubeScanner'
                }
                steps {
                    withSonarQubeEnv('SonarQubeServer') {
                        sh "${scannerHome}/bin/sonar-scanner \
                            -Dsonar.projectKey=shopsquare-frontend \
                            -Dsonar.projectName=shopsquare-frontend \
                            -Dsonar.sources=. \
                            -Dsonar.host.url=$SONAR_HOST_URL \
                            -Dsonar.login=$SONAR_AUTH_TOKEN"     
                        }                    
                    }
                }
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
                    // echo "Building Docker image: ${DOCKER_IMAGE_NAME}:${BUILD_NUMBER}"
                    // sh "docker build -t ${DOCKER_IMAGE_NAME}:${BUILD_NUMBER} -t ${DOCKER_IMAGE_NAME}:latest ."
                    echo "Building Docker Image ..."
                    sh "docker build -t ${AWS_ECR_IMAGE_URI}:latest ."
                }
            }
        }

        stage('Push to ECR') {
            steps {
                withCredentials([aws(credentialsId: AWS_CREDENTIALS_ID, region: AWS_REGION)]) {
                    sh "aws ecr get-login-password --region ${AWS_REGION} | docker login --username AWS --password-stdin ${AWS_ECR_IMAGE_URI}"
                    sh "docker push ${AWS_ECR_IMAGE_URI}:latest"
                }
            }
        }

        // stage('Push to DockerHub') {
        //     steps {
        //         withCredentials([usernamePassword(credentialsId: DOCKERHUB_CREDENTIALS_ID, usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
        //             sh "echo ${DOCKER_PASS} | docker login -u ${DOCKER_USER} --password-stdin"
        //             sh "docker push ${DOCKER_IMAGE_NAME}:${BUILD_NUMBER}"
        //             sh "docker push ${DOCKER_IMAGE_NAME}:latest"
        //         }
        //     }
        // }
    }

    post {
        always {
            // sh "docker logout"
            sh "docker logout ${AWS_ECR_IMAGE_URI}"
        }
    }
}