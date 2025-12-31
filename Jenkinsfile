pipeline {
    // 1. Select the agent with the 'docker' and 'linux' labels
    agent {
        label 'docker && linux'
    }

    environment {
        // 2. Define environment variables
        DOCKERHUB_CREDENTIALS_ID = 'dockerhub-credentials'
        DOCKER_IMAGE_NAME = 'nguyentdkptit02/dop2025.shopsquare.frontend' 
    }

    stages {
        stage('Checkout') {
            steps {
                // 3. Checkout the source code from the triggered commit
                checkout scm
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    // 4. Build the image and tag it with the build number and 'latest'
                    echo "Building Docker image: ${DOCKER_IMAGE_NAME}:${BUILD_NUMBER}"
                    sh "docker build -t ${DOCKER_IMAGE_NAME}:${BUILD_NUMBER} -t ${DOCKER_IMAGE_NAME}:latest ."
                }
            }
        }

        stage('Push to DockerHub') {
            steps {
                // 5. Use the credentials stored in Jenkins to log in and push
                withCredentials([usernamePassword(credentialsId: DOCKERHUB_CREDENTIALS_ID, usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                    sh "echo ${DOCKER_PASS} | docker login -u ${DOCKER_USER} --password-stdin"
                    sh "docker push ${DOCKER_IMAGE_NAME}:${BUILD_NUMBER}"
                    sh "docker push ${DOCKER_IMAGE_NAME}:latest"
                }
            }
        }
    }

    post {
        // 6. Always log out of DockerHub as a cleanup step
        always {
            sh "docker logout"
        }
    }
}