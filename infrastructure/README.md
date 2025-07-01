# Setup neo4j on kubernetes

## Configuration

```
# configure chart repo
helm repo add neo4j https://helm.neo4j.com/neo4j
helm repo update
kubectl create namespace neo4j
helm install neo4j-looplicant-release neo4j/neo4j --namespace neo4j -f neo4j.values.yaml -n neo4j
```

## Use for development

Setup local port forward:

```
kubectl port-forward svc/neo4j-looplicant-release-admin 7474:7474 -n neo4j
kubectl port-forward svc/neo4j-looplicant-release 7687:7687 -n neo4j
```
