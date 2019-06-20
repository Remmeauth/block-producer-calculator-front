Block producer investments payback calculator front-end.

  * [Development](#development)

## Development

Clone the project with the following command:

```bash
$ git clone https://github.com/remmeauth/block-producer-calculator-front.git
$ cd block-producer-calculator-front
```

To build the project, use the following command:

```bash
$ docker build -t block-producer-calculator-front . -f Dockerfile.development
```

To run the project, use the following command. It will start the server and occupate current terminal session:

```bash
$ docker run -p 8080:8080 -v $PWD:/block-producer-calculator-front \
      --name block-producer-calculator-front block-producer-calculator-front
```

If you need to enter the bash of the container, use the following command:

```bash
$ docker exec -it block-producer-calculator-front bash
```

Clean all containers with the following command:

```bash
$ docker rm $(docker ps -a -q) -f
```

Clean all images with the following command:

```bash
$ docker rmi $(docker images -q) -f
