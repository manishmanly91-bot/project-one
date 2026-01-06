pipeline {
  agent any

  environment {
    DOCKER_IMAGE = "manly111/project-one"
    TAG = "latest"
  }

  stages {
    stage('Build Docker Image') {
      steps {
        sh 'docker build -t $DOCKER_IMAGE:$TAG .'
      }
    }
  }
}