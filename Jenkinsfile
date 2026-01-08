pipeline {
  agent none

  environment {
    DOCKER_IMAGE = "manly111/project-one"
    TAG = "latest"
  }

  options {
    skipDefaultCheckout(true)
  }

  stages {
    stage('Build & Push') {
      agent { label '!windows' }
      steps {
        checkout scm
        sh 'docker build -t $DOCKER_IMAGE:$TAG .'
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

    stage('Deploy to Kubernetes') {
      agent { label 'windows' }
      steps {
        checkout scm
        bat '''
          set KUBECONFIG=C:\\jenkins-agent\\.kube\\config

          echo Using KUBECONFIG=%KUBECONFIG%
          kubectl config current-context
          kubectl get nodes

          kubectl apply -f deployment.yaml
          kubectl apply -f service.yaml
          kubectl rollout restart deployment/project-one
          kubectl rollout status deployment/project-one --timeout=120s
        '''
      }
    }
  }
}