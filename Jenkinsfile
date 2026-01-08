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
          REM Use the Windows agent user's kubeconfig (avoids stale copied config)
          set "KUBECONFIG=%USERPROFILE%\\.kube\\config"
          echo Using KUBECONFIG=%KUBECONFIG%

          REM Ensure Minikube is running and kubeconfig is updated (fixes 127.0.0.1:<oldPort> refused)
          minikube status -p minikube || minikube start -p minikube --driver=docker
          minikube update-context -p minikube

          kubectl config use-context minikube
          kubectl config view --minify | findstr server

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