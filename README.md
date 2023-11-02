# GeneralPayment API

Esta api se trabaja con la base del frame work [NestJS](https://nestjs.com/) un framework basado en [NodeJS](https://nodejs.org/)

Para poder correr esta api es necesario tener en consideración que se usa Node, [TypeORM](https://typeorm.io/), [Docker](https://www.docker.com/) y [PostgreSQL](https://www.postgresql.org/)

## Instalación
Es necesario tener instalado NestJS: 
```bash
npm i -g @nestjs/cli
```

Para el correcto funcionamiento es necesario correr el contenedor de docker:
```bash
docker compose up -d db
docker compose build
docker compose up
```
Se implementa primero db ya que el contenedor de la API en si depende de ella.

## Funcionamiento
Para realizar las acciones de la api basta con utilizar [Postman](https://www.postman.com/downloads/)

Si se quiere utilizar para pruebas en desarrollo o producción es necesario realizar cambios a las variables a utilizar en el archivo `src\payments\payments.controller.ts`
Las variables son:
```bash
URL_TOKEN_DEV <--> URL_TOKEN_PROD
URL_GET_PAYMENT_DEV <--> URL_GET_PAYMENT_PROD
URL_GET_PAYMENT_DEV <--> URL_GET_PAYMENT_PROD
```

### Métodos
- Post:
El llamado debe ser de la siguiente manera
```bash
localhost:3000/payments
```
El request body:
```JSON
{
    "trasnferCode": "matias.venegas93@gmail.com",
    "amount": 5000,
    "email": "matias.venegas93@gmail.com",
    "currency":"USD"
}
```
- Get: El método get puede ser llamado para obtener todas las transacciones o transacciones únicas
```bash
localhost:3000/payments
#or
localhost:3000/payments/2
```
donde 2 corresponde a la id de la transacción, escalable para utilizar `trasnferCode` ya que es único.
Se retornará una lista (vacía en caso de no tener transacciones) si no se especifica la id. En caso de buscar un único objeto retorna el objeto completo:
```JSON
{
    "trasnferCode": "matias.venegas93@gmail.com",
    "amount": 5000,
    "email": "matias.venegas93@gmail.com",
    "currency":"USD"
}
```
o de no entrontrase se arroja el error:
```JSON
{
    "message": "Payment does not exist!",
    "error": "Not Found",
    "statusCode": 404
}
```
- Put: Éste método es utilizado para actualizar transacciones, es necesario ingresar la id como parámetro y el body para actualizar
```bash
localhost:3000/payments/2
```
dónde 2 es la id de la transacción, escalable para utilizar `transferCode` ya que es único.
```JSON
{
    "trasnferCode": "matias.venegas93@gmail.com",
    "amount": 500,
    "email": "matias.venegas93@gmail.com",
    "currency":"CLP"
}
```
retornando el mismo valor enviado. 
- Delete: Éste método es para eliminar alguna transacción, es necesario especificar la id de la transacción (puede ser escalable para el uso de `trasnferCode`)
```bash
localhost:3000/payments/2
```
No retorna un valor al eliminar. Solo retornará un error de no encontrar la transacción:
```JSON
{
    "message": "Payment does not exist!",
    "error": "Not Found",
    "statusCode": 404
}
```
