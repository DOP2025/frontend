pipeline {
	agent any
	stages {
		stage('Clone source')
			steps {
				echo "Setting up the tools"
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
				echo "Analysis Application"
			}
		}
		
		stage('Push Docker Image') {
			steps {
				echo "Build & Push Docker Image to Registry"
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
		}
	}
}