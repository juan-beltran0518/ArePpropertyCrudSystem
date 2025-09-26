# AREP Property CRUD System 🏠

Web app sencilla para gestionar propiedades inmobiliarias con operaciones CRUD (crear, leer, actualizar y eliminar).

**Versión Local (Spring Boot específica):**
- Archivos de Spring Boot (HELP.md, target/)
- Configuraciones IDE (IntelliJ, Eclipse, VS Code)
- Archivos Maven wrapper

**Versión Remota (Java general):**
- Archivos compilados (*.class, *.jar, *.war)
- Logs (*.log)
- Archivos temporales Java

#### 4. Conexión con Repositorio Remotocripción del Proyecto

Este es un sistema CRUD (Create, Read, Update, Delete) desarrollado con Spring Boot como parte del curso AREP (Arquitecturas Empresariales). El proyecto implementa las operaciones básicas para la gestión de propiedades inmobiliarias.

## 🚀 Tecnologías Utilizadas

- **Java** - Lenguaje de programación principal
- **Spring Boot** - Framework para desarrollo de aplicaciones Java
- **Maven** - Herramienta de gestión de dependencias y construcción
- **Git** - Control de versiones

## 📁 Estructura del Proyecto

```
arepcrudsystem/
├── .gitattributes
├── .gitignore
├── .mvn/wrapper/
│   └── maven-wrapper.properties
├── mvnw
├── mvnw.cmd
├── pom.xml
├── README.md
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── arep/edu/co/arepcrudsystem/
│   │   │       └── ArepcrudsystemApplication.java
│   │   └── resources/
│   │       ├── application.properties
│   │       ├── static/
│   │       └── templates/
│   └── test/
│       └── java/
│           └── arep/edu/co/arepcrudsystem/
│               └── ArepcrudsystemApplicationTests.java
└── target/
```

## 📋 Archivos Principales

### ArepcrudsystemApplication.java
Clase principal de Spring Boot que contiene el método `main()` para ejecutar la aplicación.

### pom.xml
Archivo de configuración de Maven con las dependencias del proyecto Spring Boot.

### application.properties
Archivo de configuración de la aplicación Spring Boot.

## Comandos Útiles

### Ejecutar la aplicación
```bash
# Usando Maven wrapper (recomendado)
./mvnw spring-boot:run

# O usando Maven instalado globalmente
mvn spring-boot:run
```

### Ejecutar tests
```bash
# Usando Maven wrapper
./mvnw test

# O usando Maven
mvn test
```

### Compilar proyecto
```bash
# Usando Maven wrapper
./mvnw clean compile

# O usando Maven
mvn clean compile
```

## Licencia

Este proyecto es desarrollado con fines educativos como parte del curso AREP.

## Autor

**Sebastian Beltran**
- Email: juan.beltran0518@hotmail.com
- GitHub: [@juan-beltran0518](https://github.com/juan-beltran0518)

---


