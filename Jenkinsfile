pipeline {
    agent { label 'self_hosted_agent' }

    tools {
        nodejs 'node-25.2.1'
    }

    parameters {
        string(name: 'GIT_CREDENTIALS', defaultValue: 'GITHUB_CREDENTIALS', description: 'Credentials for GitHub')

        string(name: 'DOCKERHUB_CREDENTIALS', defaultValue: 'DOCKERHUB_CREDENTIALS', description: 'Credentials for DockerHub')
        string(name: 'DOCKERHUB_USER', defaultValue: 'nguydentdkptit02', description: 'User for DockerHub')
        string(name: 'DOCKERHUB_REPO', defaultValue: 'dop2025.shopsquare.frontend', description: 'Repository for DockerHub')
        string(name: 'DOCKER_IMAGE_NAME', defaultValue: 'shopsquare.frontend', description: 'Docker Image Name')

        string(name: 'AWS_ACCESS_KEY_ID', defaultValue: 'AWS_ACCESS_KEY_ID', description: 'Access Key Id for AWS')
        string(name: 'AWS_SECRET_ACCESS_KEY', defaultValue: 'AWS_SECRET_ACCESS_KEY', description: 'Secret Key for AWS')

        string(name: 'TEST_PARAM', defaultValue: 'test_param_default_value', description: 'A test parameter')
    }

    environment {
        AWS_ACCOUNT_ID = '846040891095'
        AWS_REGION     = 'ap-northeast-2'
        ECR_REPO_NAME  = 'shopsquare/frontend'
        IMAGE_TAG      = "${BUILD_NUMBER}"
        ECR_REGISTRY   = "${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com"
        PATH           = "$WORKSPACE/bin:$PATH"
        DOCKERHUB_USER = "${params.DOCKERHUB_USER}"
        DOCKERHUB_REPO = "${params.DOCKERHUB_REPO}"
        TEST_PARAM     = "${params.TEST_PARAM}"
        DOCKERHUB_CREDENTIALS = 'DOCKERHUB_CREDENTIALS'
    }

    stages {
        stage('Setup dependencies') {
            steps {
                // sh '''
                // sudo apt-get update -y
                // sudo apt-get install -y libatomic1 unzip curl
                // sudo apt install apt-transport-https ca-certificates curl gnupg lsb-release -y
                // '''

                sh 'node --version'
                sh 'npm --version'
            }
        }

        stage('Test Parameter') {
          steps {
            // sh '''
            // echo "Testing parameter value"
            // echo "$TEST_PARAM"
            // '''
            // echo "The value of TEST_PARAM is: ${params.TEST_PARAM}"
            // sh "echo ${params.TEST_PARAM}"
            sh "echo quick test"
            sh "id -ng"
          }
        }

        stage('Initialize Docker') {
            steps {
                sh """
                    if ! command -v docker &> /dev/null; then
                        # Update package list and install prerequisites
                        sudo apt-get update
                        sudo apt-get install -y ca-certificates curl gnupg

                        # Add Docker's official GPG key
                        sudo install -m 0755 -d /etc/apt/keyrings
                        curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
                        sudo chmod a+r /etc/apt/keyrings/docker.gpg

                        # Set up the repository
                        echo \
                        "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
                        $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
                        sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
                        
                        # Install Docker Engine
                        sudo apt-get update
                        sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

                        # Add your user to the docker group to run docker without sudo
                        sudo usermod -aG docker $USER
                        newgrp docker      

                        # Installation verification
                        docker --version
                        docker compose version
                    fi
                    
                    if command -v docker &> /dev/null; then
                        docker --version
                        echo "Docker CLI is ready."
                    else
                        echo "ERROR: Failed to install Docker CLI."
                        exit 1
                    fi

                    export DOCKER_BUILDKIT=1
            
                    if [ ! -w /var/run/docker.sock ]; then
                        sudo chmod 666 /var/run/docker.sock
                    fi

                    docker version
                """
            }
        }

        stage('Clone source') {
            steps {
                checkout scm
                // checkout([$class: 'GitSCM',
                //     branches: [[name: '*/main']],
                //     userRemoteConfigs: [[
                //         url: 'https://github.com/DOP2025/frontend',
                //         credentialsId: params.GIT_CREDENTIALS
                //     ]]
                // ])
            }
        }

        stage('Build') {
            steps {
                echo "Building the application"
            }
        }

        stage('Test') {
            steps {
                echo "Running tests"
            }
        }

        stage('Analysis') {
            steps {
                echo "Analysis Application with SonarQube"
            }
        }

        // stage('Login to AWS ECR'){
        //  steps {
        //    withCredentials([[
        //         $class: 'UsernamePasswordMultiBinding', 
        //         credentialsId: params.AWS_CREDENTIALS,
        //         usernameVariable: 'AWS_ACCESS_KEY_ID', 
        //         passwordVariable: 'AWS_SECRET_ACCESS_KEY'
        //     ]]) {
        //        sh '''
        //        mkdir -p $WORKSPACE/bin
        //         mkdir -p $WORKSPACE/aws-cli-src

        //         if ! command -v aws &> /dev/null; then
        //           echo "AWS CLI not found. Installing locally in workspace..."
        //           curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
                  
        //           python3 -m zipfile -e awscliv2.zip $WORKSPACE/aws-cli-src
                  
        //           ./aws-cli-src/aws/install -i $WORKSPACE/aws-cli-install -b $WORKSPACE/bin --update
                  
        //           rm -rf awscliv2.zip $WORKSPACE/aws-cli-src
        //         fi

        //         export AWS_ACCESS_KEY_ID=${AWS_ACCESS_KEY_ID}
        //         export AWS_SECRET_ACCESS_KEY=${AWS_SECRET_ACCESS_KEY}
                
        //         $WORKSPACE/bin/aws ecr get-login-password --region ${AWS_REGION} | docker login --username AWS --password-stdin ${ECR_REGISTRY}
        //        '''

        //        // sh "aws --version"
        //        // sh "aws s3 ls"
        //         // sh "export AWS_ACCESS_KEY_ID=${AWS_ACCESS_KEY_ID}"
        //         // sh "export AWS_SECRET_ACCESS_KEY=${AWS_SECRET_ACCESS_KEY}"
        //     }
        //  }
        // }

        // ! PUSH TO DOCKERHUB
        // docker push nguyentdkptit02/dop2025.shopsquare.frontend:tagname
        stage('Build Docker Image') {
            steps {
                echo "Building Docker Image ..."
                sh """
                    docker build -t ${DOCKERHUB_USER}/${DOCKERHUB_REPO}:${BUILD_NUMBER} .
                    docker tag ${DOCKERHUB_USER}/${DOCKERHUB_REPO}:${BUILD_NUMBER} ${DOCKERHUB_USER}/${DOCKERHUB_REPO}:latest
                    docker image ls
                """
                echo "Build Docker Image Successfully"
            }
        }

        stage('Deploy') {
            steps {
                echo "Deploying the application"
            }
        }
    }

    post {
        always {
            echo "Pipeline execution completed"
            sh "docker logout"
            cleanWs()
        }
    }
}