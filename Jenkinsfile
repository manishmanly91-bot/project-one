pipeline {
  agent any

  environment {
    IMAGE_NAME = "project-one"
    TAG = "latest"
  }

  stages {
    stage('Build Docker Image') {
      steps {
        sh 'docker build -t $IMAGE_NAME:$TAG .'
      }
    }
  }
}