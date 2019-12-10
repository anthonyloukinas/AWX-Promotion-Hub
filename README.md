# AWX-Promotion-Hub
Third party application that aids AWX object migrations from one node to another.

## Getting Started

### Development

Spin up your MySQL container. You can provide your own if you already have one,
you will just need to make appropriate configuration changes in config/env/all.js
```bash
docker-compose up -d
```

*Note: You will also get a PhpMyAdmin container spun up using the docker-compose*

Install the Node.js dependencies

```bash
npm install
```

Run the application

```bash
node index.js
```

## Support

This is an open-source community driven project, so at this time this product is considered experimental and is not meant for production environments.
No support will be provided outside of issues created through this GitHub Repository. 

## Authors

- Anthony Loukinas <<anthony.loukinas@redhat.com>>