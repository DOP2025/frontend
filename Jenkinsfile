pipeline {
    agent {label 'self_hosted_agent'}

    stages {
        stage('Hello') {
            steps {
                echo 'Hello World from GitHub Repository!'
                echo 'run by Jenkins Self Hosted Agent'
                echo 'Try trigger pipeline by GitHub webhook!'
            }
        }
    }
}
