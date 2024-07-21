# init-replica.sh
mongosh --username root --password root --authenticationDatabase admin --eval "rs.initiate({
  _id: 'replicaset',
  members: [
    { _id: 0, host: 'mongodb:27017' },
    { _id: 1, host: 'mongodb-secondary:27017' },
    { _id: 2, host: 'mongodb-arbiter:27017', arbiterOnly: true }
  ]
})"
