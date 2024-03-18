---
title: "¿What happen if you use an old wordpress version?"
description: "Pentesting to an old wordpress version"
pubDate: "March 9 2024"
heroImage: "/wp.png"
badge: "Demo badge"
tags: ["cybersecurity","safe", "wp", "update", "wordpress"]
---

# The Importance of update your wordpress version.

---

# Maquina ColddBox - Tryhackme

  En este primer escenario se ha elegido una maquina con sistema operativo Linux que contiene un servidor web con un CMS Wordpress ya que este es bastante usado en la actualidad y creo que sería útil incluirlo en el proyecto, ya que muchas empresa lo no lo suelen actualizar mucho y creo sería importante mostrar que podría pasar si no actualizas este CMS.

Como maquina voy a usar la de ColddBox que se encuentra en la pagina llamada Tryhackme, una maquina donde contiene diferentes maquinas preparas para ser explotadas sin corregir el riesgo de que pueda afectar a entornos reales, si no que son escenarios simulad

1. ## Enumeración y Reconocimiento
    

1. En primer lugar vamos a proceder a escanear todos los puertos de la maquina objetivo, ya que solo tenemos la dirección ip, pero previamente podemos insertar esa ip en el navegador para ver si existe algún sitio web.
    

![](file:///Users/jfpg/Library/Application%20Support/LibreOffice/4/user/temp/lu169821xww.tmp/lu169821xx3_tmp_7949aab8.png)  

Vemos que si que existe una página web, pero vamos a lanzar un escaneo con **nmap** para ver si tiene algún otro puerto.
Para ello utilizaremos el siguiente comando:

![](file:///Users/jfpg/Library/Application%20Support/LibreOffice/4/user/temp/lu169821xww.tmp/lu169821xx3_tmp_d5020ce6.png)  

  Y nos mostraría el siguiente resultado:

![](file:///Users/jfpg/Library/Application%20Support/LibreOffice/4/user/temp/lu169821xww.tmp/lu169821xx3_tmp_1941bb34.png)  

He usado un escaneo un poco más avanzado ya que un simple escaneo de nmap mostraba solo el puerto 80 como muestro en esta captura.

Por eso he usado los siguientes parámetros para hacer el escaneo un poco más avanzado

![lu169821xx3_tmp_902d170c.png](app://8c8410ee5504af7a6850d95079421632b73d/Users/jfpg/Library/Application%20Support/LibreOffice/4/user/temp/lu169821xww.tmp/lu169821xx3_tmp_902d170c.png)  

- **-sV** → Esta opción habilita la detección de versiones de servicios en los puertos de nmap. Es decir, nmap intentara determinar qué servicio se está ejecutando en cada puerto abierto y que versión de software utiliza.
    
- **-p-** → esta opción indica que se deben escanear todos los puertos TCP. Es decir, que nmap intentara conectarse a cada puerto TCP en el rango de 1 a 65535.
    
- **--open** → esta opción indica que solo se deben mostrar los puertos que este abiertos, es decir que nmap solo nos mostrara los que respondan a las solicitudes de conexión.
    
- **--min-rate** → Esta opción establece la velocidad mínima de paquetes en 8000 paquetes por segundo. Pero esto es una opción no recomendad para entornos de producción ya que suele ser muy agresivo.
    
- **-Pn** → esta opción indica que se deben ignorar los hosts que no responden a las solicitudes de ping. Es decir, Nmap no intentará determinar si el host está activo antes de realizar el escaneo.
    
Ahora vamos a profundizar un poco y usando la opción _(-p)_ para especificar los dos puertos y _(-sCV)_ para 
algo más de información más detallada acerca de los puertos que tiene abiertos esta máquina. Tras analizar la información devuelta por NMAP se confirma que los puertos TCP 80 y 4512 están abiertos y en ellos corren dos servicios cuyas versiones ya se conocen.

Con esta información obtenemos el siguiente resumen:

- **TCP 80** → Servicio HTTP → Aplicación Apache versión 2.4.18
    
- **TCP 4512** → Servicio SSH → Aplicación OpenSSH versión 2.10 Ubuntu, Protocolo 2.0

En primer lugar se procede a investigar el servicio HTTP tras el puerto TCP80 y se usaran las herramientas whatweb y nikto para obtener algo más información adicional:

**HTTP (TCP80)**
![](file:///Users/jfpg/Library/Application%20Support/LibreOffice/4/user/temp/lu169821xww.tmp/lu169821xx3_tmp_fd6e02c.png) 

![](file:///Users/jfpg/Library/Application%20Support/LibreOffice/4/user/temp/lu169821xww.tmp/lu169821xx3_tmp_c481e46a.png)  

  Gracias a estas dos herramientas podemos confirmar que realmente se trata de un servidor web Apache con la versión 2.4.18 y usando wordpress en la versión 4.1.31 con lo cual esto significa que esta versión de wordpress podría ser vulnerable ya que muchas versiones antiguas de este CMS puede tener vulnerabilidades.
 
 Buscando la versión de wordpress en el navegador nos lleva a esta página del NIST, la cual nos lleva al siguiente CVE el 2020-4046 que si nos fijamos en la descripción afectaría a nuestra versión de wordpress. “Según **INCIBE**, en las versiones afectadas, los usuarios aunque carezcan de privilegios como colaboradores y autores puede usar el bloque incorporado de determinada manera para inyectar código HTML no filtrado en el editor de bloques. Cuando las publicaciones afectadas son vistas por un usuario con mayores privilegios, esto podría conllevar a una ejecución de script en el archivo editor/wp-admin"

  ![](file:///Users/jfpg/Library/Application%20Support/LibreOffice/4/user/temp/lu169821xww.tmp/lu169821xx3_tmp_6db19ebd.png)
  
Ahora tratándose de wordpress, esta CMS tiene una página llamada wp-admin, la cual contiene un login que nos llevara al panel de administración del sitio web el cual nos va a servir para explotar esa vulnerabilidad. Pero el primer paso sería saber que usuarios puede acceder al panel de administración.

Para ello lanzaremos el siguiente comando,

	Wpscan –url_ [_http://10.10.21.213_](http://10.10.21.213/) _–enumarate u_

  Lo que hará este comando es con el parámetro –url nos cogerá la url del sitio web wordpress el –enumerate u nos enumerara solo los usuarios que encontré.

![](file:///Users/jfpg/Library/Application%20Support/LibreOffice/4/user/temp/lu169821xww.tmp/lu169821xx3_tmp_521a60f4.png)  

Vemos que nos muestra tres usuarios, de los cuales, nos creamos un pequeño diccionario con estos tres nombres y usando la misma herramienta de Wpscan junto con el diccionario por defecto rockyou intentaremos mediante fuerza bruta conseguir dicha contraseña para acceder al panel de control.

![](file:///Users/jfpg/Library/Application%20Support/LibreOffice/4/user/temp/lu169821xww.tmp/lu169821xx3_tmp_60082c2b.png)  

Como podemos ver nos saco la contraseña para el usuario c0ldd que seria 9876543210, entonces con esto datos ya podemos proceder a acceder y pasar a la parte de explotación.

**SSH (TCP 4512)**

En segundo lugar, se procede a investigar el servicio ssh tras el puerto TCP4512 y se comprueba que no se permite login sin contraseña o con la contraseña por defecto de root que sería toor.

![](file:///Users/jfpg/Library/Application%20Support/LibreOffice/4/user/temp/lu169821xww.tmp/lu169821xx3_tmp_1faef29a.png)  

## Análisis de Vulnerabilidades

En la siguiente fase como ya hemos conseguido, obtener el usuario y contraseña para poder acceder al panel de control y así poder explotar la vulnerabilidad del editor wordpress la cual nos permitirá obtener un Shell reverso insertando código php en el editor de wordpress usando la página 404.php ubicada en la sección themes > nombredeltema y editor.

Pero primero vamos a realizar una serie de pruebas insertando pequeños fragmentos php para comprar bien que podemos insertar código php.

**TEST 1**
El primer test que realizaremos será el de insertar una pequeña función php llamada phpinfo () la cual nos va a mostrar información detallada sobre php como puede ser su versión y poco más.

![](file:///Users/jfpg/Library/Application%20Support/LibreOffice/4/user/temp/lu169821xww.tmp/lu169821xx3_tmp_74d216ce.png)  

**TEST 2**
El segundo test costara de intentar lanzar un simple comando a través de una sentencia php, la cual nos va a servir para verificar en que directorio estamos y si realmente podemos usar comandos del servidor a través de wordpress.

![](file:///Users/jfpg/Library/Application%20Support/LibreOffice/4/user/temp/lu169821xww.tmp/lu169821xx3_tmp_60eff4b2.png)  

**TEST 3**
Debido a que podemos listar los directorios actuales del servidor y sabiendo ya en carpeta nos encontraremos usando la secuencia _‘..’._ Que en Linux significa el directorio anterior entonces intentaremos listar si existe el user.txt y que permisos tiene.

![](file:///Users/jfpg/Library/Application%20Support/LibreOffice/4/user/temp/lu169821xww.tmp/lu169821xx3_tmp_9de4fc98.png)  

Ahora ya sabemos que podemos usar comandos del sistema, así que como nosotros somos el www-data que es el usuario web en apache2, podemos intentar ir a la carpeta donde se encuentran los ficheros de configuración de wordpress e ir al fichero wp-config.php el cual es donde nosotros escribimos los datos de la base de wordpress y coger el usuario y contraseña y probar de conectarnos vía ssh.

![](file:///Users/jfpg/Library/Application%20Support/LibreOffice/4/user/temp/lu169821xww.tmp/lu169821xx3_tmp_91137bd7.png)  

Aquí podemos ver que mediante el siguiente comando _CAT ../../../wp-config.php,_ el cual nos muestra por pantalla el fichero wp-config el cual vemos el nombre de usuario y contraseña

Usados en la para configurar la base de datos de wordpress, entonces lo que voy a hacer es insertar _el db_username y db_password_ para acceder a la maquina vía ssh por el puerto 4512 que es el que encontramos en la fase de reconocimiento.

Aquí en esta otra captura voy a mostrar que he podido acceder vía ssh usando los credenciales encontrados en el fichero wp-config.php, el cual deberían pertenecer a la base de datos.

Y ahora ya sí que podríamos ir a user.txt y leer la flag del usuario y ya tendríamos una parte que es la de conseguir acceder con un usuario del sistema.

![](file:///Users/jfpg/Library/Application%20Support/LibreOffice/4/user/temp/lu169821xww.tmp/lu169821xx3_tmp_212f52e0.png)  

![](file:///Users/jfpg/Library/Application%20Support/LibreOffice/4/user/temp/lu169821xww.tmp/lu169821xx3_tmp_6998a9a7.png)
## Explotación

En este punto, ahora que ya hemos analizado la vulnerabilidad y obtenido acceso con un usuario del sistema, para poder acceder a la siguiente flag debemos acceder mediante la **escalada de privilegios** y para ello hay diferentes puntos a revisar de la maquina:

- Se revisa la configuración y el contenido de los ficheros **passwd y shadow**: los únicos usuarios con el shell bash asignada son “c0ldd” y “root”. El fichero /etc/shadow se encuentra protegido y solo es legible por root.
    
- El usuario c0ldd, haremos un **sudo -l** para ver si hay algún programa con permisos root que pueda ejecutar el usuario.
    
- Se buscan ficheros con permisos especiales **SUID y SGID**, no se encuentran ficheros con permisos especiales fuera del estándar para el correcto funcionamiento de Linux
    
- Revisar tareas programadas, para localizar si existe alguna que ejecute algún script con altos privilegios, pero no existe ninguna.
    
- Y **revisar la versión del kernel** ya que puede haber alguna de las versiones más antiguas de kernel de Linux que pueda ser vulnerable, pero no es nuestro caso.
    
En nuestro caso el fallo de seguridad se encontrara en que al ejecutar sudo -l, nos llevara a tres binarios de los cuales pertenecen a root pero el usuario tiene permiso para ejecutarlas usando sudo.

![](file:///Users/jfpg/Library/Application%20Support/LibreOffice/4/user/temp/lu169821xww.tmp/lu169821xx3_tmp_390f957a.png) 

Se trata de los binarios de vim (un editor de texto, que se usa en Linux para editar ficheros en modo terminal), la herramienta chmod (Que sirve para otorgar permisos UGO en Linux) y el FTP (el cual es un protocolo de transferencia de archivos).

Estos tres binarios podrían ser nos de utilidad para escalar privilegios ya que gracias a la página de GTFoBins, podemos encontrar cierto comando para ejecutar ciertos ficheros que podrías dar nos acceso root.

En mi caso voy a usar ftp, el cual sería bastante sencillo ya que lo que podemos hacer será con sudo delante ejecutar _ftp_ de forma normal y cuando nos abra una _shell_ con el prompt de _ftp>_ introduciremos! /_bin/sh._

Pero si este mismo comando lo ejecutamos sin sudo delante, lo que nos ara será mostrar una shell normal, eso es debido a que sudo es lo que hace que pueda ejecutar ftp como usuario privilegiado.

![](file:///Users/jfpg/Library/Application%20Support/LibreOffice/4/user/temp/lu169821xww.tmp/lu169821xx3_tmp_a095da9b.png)

![](file:///Users/jfpg/Library/Application%20Support/LibreOffice/4/user/temp/lu169821xww.tmp/lu169821xx3_tmp_2f8a5841.png)  

Y ahora ya tendrías la flag de root

![](file:///Users/jfpg/Library/Application%20Support/LibreOffice/4/user/temp/lu169821xww.tmp/lu169821xx3_tmp_161279db.png)  


**Escenario ColddBox-Easy**

- Flag del **usuario**: RmVsaWNpZGFkZXMsIHByaW1lciBuaXZlbCBjb25zZWd1aWRvIQ==
    
- Flag de **root**: wqFGZWxpY2lkYWRlcywgbcOhcXVpbmEgY29tcGxldGFkYSE=
    
## Post-Explotación
    
Como tarea de **post-explotación** voy a nombrar algunas nociones básicas de seguridad para poder arreglar estos pequeños fallos que nos han hecho conseguir acceso al host y poder escalar privilegios.

- En primer lugar con respecto al acceso al panel de control de wordpress, abría que usar contraseñas un mas fuertes o que no se encuentre en los diccionarios comunes de contraseñas, ya que usando un simple diccionario común que encontramos en kali Linux hemos podido acceder al CMS.
    
- Por otro convendría actualizar la versión de wordpress ya que estos posibles fallos como es el que podamos insertar comandos del servidor en el editor de código en versiones más recientes se encuentra ya parcheado. Es por eso que es muy importante usar siempre la última versión.
    
- Y también convendría no usar el mismo usuario y contraseña para el usuario del servidor que para el usuario de la base de datos de wordpress sobre si es de un usuario con privilegios de sudo.
## Reporte y Mitigación  
**VULNERABILIDAD**

**CVE: CVE** el 2020-4046

**SERVICIO:** Wordpress Versiones 5.4 a anteriores.

**INFORMACIÓN: En** las versiones de wordpress afectadas, usuarios con pocos permisos (como colaboradores o autores) pueden aprovecharse de un bloque llamado “embed” para introducir código HTML sin restricciones en el editor de bloques. Cuando un usuario con permisos más altos ve estos mensajes más altos, podría permitir la ejecución de scripts en el editor o en la parte de administración de Wordpress (wp-admin).

**MITIGACIÓN: y** para poder mitigar este problema lo más recomendable seria actualizar la versión de wordpress ya que si por algo hay versiones más recientes es por eso para corregir este tipo de fallos de seguridad. Además de monitorear y restringir los privilegios que se le aplican a los usuarios sobre el sistemas. Así como existen muchos plugins de seguridad que pueden detectar y prevenir este tipo de ataques como pueden ser Wordfence Security, Sucuri Security, iThemes Security, BulletProof Security, All In One WP Security & Firewall, Security Ninja, MalCare Security, Cerber Security, Antispam & Malware Scan.


### INFORMACIÓN ADICIONAL:

[https://nvd.nist.gov/vuln/detail/CVE-2020-4046](https://nvd.nist.gov/vuln/detail/CVE-2020-4046)

https://www.incibe.es/incibe-cert/alerta-temprana/vulnerabilidades/cve-2020-9046