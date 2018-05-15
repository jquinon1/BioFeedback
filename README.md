# BioFeedback

TODO: Write a project description

## 1. Requisitos

1. NodeJS v8.11.1
2. Python 3.x
3. virtualenv 15.0.1
4. pip 8.1.1
5. MongoDB 3.2.19
6. npm 5.6.0

## 2. Instalación

2.1. Clonar el repositorio.

2.2. Ingresar a la carpeta del repositorio y cambiar la rama del repositorio con el siguiente comando
```console
$ git checkout Valentin-Quintero
```

### Instalación de dependencias

Este proyecto esta compuesto por una aplicacion desarrollada y otra aplicacion desarrollada en el framework de python Django, para ello se deben instalar las dependencias para cada una de estas aplicaciones las cuales estan ubicadas en las carpetas 'biofeedbackWebApp' y 'biofeedbackAPI' respectivamente. Los pasos de instalacion se muestran a continuacion.

#### Aplicación de NodeJS (biofeedbackWebApp)

2.2. Instalar las dependencias ejecutando el siguiente comando.
```console
$ npm install
```

#### Aplicación REST Django (biofeedbackAPI)

2.3. Crear un ambiente virtual para instalar las dependencias ejecutando el siguiente comando.
```console
$ virtualenv -p python3 <directorioVE>
```
2.4. Activar el ambiente virtual ejecutando el siguiente comando.
```console
$ source <directorioVE>/bin/activate
```
2.5. Instalar las dependencias ejecutando el siguiente comando.
```console
$ pip install -r requirements.txt
```

## 3. Ejecución del proyecto

Una vez completados los pasos de instalación se puede proceder a ejecutar el proyecto siguiendo los pasos a continuación.


### Correr los servidores
3.1. Abrir una nueva terminal e ingresar a la carpeta que contiene la aplicación NodeJS 'biofeedbackWebApp' y ejecutar el siguiente comando.
```console
$ npm start
```
Si todo salió correctamente se debe mostrar el siguiente mensaje 'Express server listening on port 3000'

2.4. Abrir una nueva terminal independiente a la anterior y activar el ambiente virtual nuevamente ejecutando el siguiente comando.
```console
$ source <directorioVE>/bin/activate
```
3.2. Ingresar a la carpeta que contiene la aplicación Django 'biofeedbackAPI' y ejecutar el siguiente comando.
```console
$ python manage.py runserver
```
Si todo salió correctamente se debe mostrar el siguiente mensaje 'Quit the server with CONTROL-C'

### Configurar conductor

3.3. Una vez estan corriendo los servidores se debe de crear una cuenta de supervisor ingresando al siguiente enlace http://localhost:3000/signup

3.4. Una vez creada la cuenta se debe proceder a ingresar al siguiente enlace que corresponde al panel del supervisor http://localhost:3000/supervisor

3.5. Crear un nuevo conductor pulsando en el boton 'Agregar conductor', una vez creado se le redireccionará al panel del supervisor nuevamente.

3.4. Dar click en el conductor previamente creado y copiar el codigo que aparece debajo de su nombre (Ej: 5afb5244db79fe17e87a0e74).

3.5. Abrir con un editor de texto el archivo 'simulador_cliente.py' ubicado en la raíz del repositorio y pegar el codigo copiado previamente donde se indica a continuación ("conductor": "<PEGAR AQUÍ>"). Debe quedar de esta manera: "conductor": "5aeb39c88c131d1cf52d1a7b".

3.6. 




## Contributing

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D

## History

TODO: Write history

## Credits

TODO: Write credits

## License

TODO: Write license
