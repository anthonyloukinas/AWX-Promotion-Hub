const mysqlx = require('@mysql/xdevapi');

const config = {
  password: 'password',
  user: 'root',
  host: 'localhost',
  port: 33060,
  schema: 'awx_promotion_hub'
};

mysqlx
    .getSession(config)
    .then(session => {
      return session.createSchema('mySchema')
      .then(() => {
          return session.getSchema('mySchema').createCollection('myCollection');
      })
      .then(() => {
          return session.getSchema('mySchema').getCollection('myCollection')
              .add([{ name: 'foo', age: 42 }])
              .execute()
      })
      .then(() => {
          return session.getSchema('mySchema').getCollection('myCollection')
              .find()
              .fields(['name', 'age'])
              .execute(row => {
                  console.log(row); // { name: 'foo', age: 42 }
              });
      })
      .then(() => {
          return session.getSchema('mySchema').getCollection('myCollection')
              .modify('age = :value')
              .bind('value', 42)
              .set('name', 'bar')
              .execute();
      })
      .then(() => {
          return session.getSchema('mySchema').getCollection('myCollection')
              .find()
              .fields(['name', 'age'])
              .execute(row => {
                  console.log(row); // { name: 'bar', age: 42 }
              });
      })
      .then(() => {
          return session.getSchema('mySchema').getCollection('myCollection')
              .remove('true')
              .execute();
      })
      .then(() => {
          return session.getSchema('mySchema').dropCollection('myCollection');
      })
      .then(() => {
          return session.dropSchema('mySchema');
      })
      .then(() => {
          return session.close();
      })
      .catch(err => {
          return session.close()
              .then(() => {
                  throw err;
              })
              .catch(err => {
                  throw err;
              });
      });
    }).catch(err => {
      console.log(err.message);
    });