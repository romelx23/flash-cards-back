# Votation App

Esta es una aplicación de votaciones en tiempo real, desarrollada con React, Node.js, Express y Socket.io.

![alt](https://media.discordapp.net/attachments/839620709517230081/1020753481394569316/unknown.png?width=720&height=364)

## Instalación

Para instalar las dependencias del servidor y del cliente, ejecutar el siguiente comando:

```bash
npm install
```

## Ejecución

Para ejecutar el servidor y el cliente, ejecutar el siguiente comando:

```bash
npm run dev
```

## Licencia

[MIT](https://choosealicense.com/licenses/mit/)

## Autor

[Romel Alexis Carrasco Mallma]

Para Instalar dependencias:

```
npm install
```
para reconstruir los modulos de node

## PARA CREAR UN TAG
  * git tag -a v0.0.2 -m "modulo 9 terminado"
  * git push --tags
## PARA QUITAR EL SEGUIMIENTO DEL GIT
  * git rm .env --cached
  * agregar el archivo al gitignore , luego add, and commit


## VARIABLES PARA CONFIGURAR "HEROKU"
  * heroku config  -> lista todas la variables de entorno
  * heroku config:set nombreVariable = "variable"  -> Crear variable
  * heroku config:get  -> listar las variables
  * heroku config:unset  nombreVariale  -> eliminar varibale