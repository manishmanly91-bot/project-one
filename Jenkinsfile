pipeline {
  agent any

  environment {
    IMAGE_NAME = "project-one"
    TAG = "latest"
  }

  stages {
    stage('Checkout Code') {
      steps {
        git 'https://github.com/manishmanly91-bot/project-one.git'
      }
    }

    stage('Build Docker Image') {
      steps {
        sh 'docker build -t project-one:latest .'
      }
    }

    stage('Deploy to Kubernetes') {
      steps {
        sh '''
          kubectl apply -f deployment.yaml
          kubectl apply -f service.yaml
        '''
      }
    }
  }
}
