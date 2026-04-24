# Prueba Tecnica Frontend - Preparacion de Entorno

Este repositorio quedó preparado para comenzar la prueba tecnica de Accenture con una base real de `Ionic + Angular + Cordova`.

## Estado actual

- Repositorio Git inicializado.
- Configuracion de `npm` ajustada para usar cache local en el workspace.
- Starter generado en `todo-accenture/`.
- Integracion de Cordova habilitada.
- Compilacion web validada con `npm run build`.

## Estructura

- Proyecto principal: `todo-accenture/`
- Configuracion local de npm: `.npmrc`
- Exclusiones de Git: `.gitignore`

## Herramientas validadas

- Git: instalado
- Node.js: `v22.19.0`
- npm: `10.9.3`
- Java: detectado (`21.0.8`)

## Faltantes o riesgos a resolver

- `adb` no esta disponible en `PATH`
- `sdkmanager` no esta disponible en `PATH`
- No se detecta `ANDROID_HOME` ni `ANDROID_SDK_ROOT`
- La exportacion de `IPA` no es posible desde Windows; para `cordova-ios` se necesita macOS con Xcode
- Cordova Android actual recomienda JDK 17; en esta maquina se detecto Java 21, asi que conviene instalar o apuntar un JDK 17 para evitar incompatibilidades al compilar Android

## Comandos utiles

Desde la raiz:

```powershell
cd .\todo-accenture
npm install
npm run build
```

## Siguiente paso recomendado

1. Instalar Android Studio con Android SDK, platform-tools y build-tools.
2. Configurar `ANDROID_SDK_ROOT` y validar `adb`.
3. Instalar o configurar JDK 17 para Cordova Android.
4. Definir si el `IPA` se generara en una Mac local o en un servicio CI con macOS.
5. Empezar el desarrollo funcional de la To-Do List, categorias, Firebase Remote Config y optimizaciones.
