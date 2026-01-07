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

    stage('Push to Docker Hub') {
      steps {
        withCredentials([usernamePassword(
          credentialsId: 'Manly99',
          usernameVariable: 'DOCKER_USER',
          passwordVariable: 'DOCKER_PASS'
        )]) {
          sh '''
            echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin
            docker push $DOCKER_IMAGE:$TAG
            docker logout
          '''
        }
      }
    }
  }
}