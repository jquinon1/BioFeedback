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

3.1. Ingresar a la carpeta que contiene la aplicación NodeJS 'biofeedbackWebApp' y ejecutar el siguiente comando.
```console
$ npm start
```




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
