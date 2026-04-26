# Prueba Tecnica Frontend - To Do App Ionic

Documentacion tecnica del entregable desarrollado para la prueba de Accenture con `Ionic 8`, `Angular 20` y `Cordova`.

Verificacion realizada el `2026-04-26`.

## 1. Resumen

La aplicacion implementa una experiencia de gestion de tareas con categorias, filtros y persistencia local. El proyecto esta pensado para correr como aplicacion web y como base para empaquetado movil con Cordova.

## 2. Alcance funcional

- Crear tareas.
- Editar tareas.
- Completar tareas.
- Eliminar tareas.
- Crear categorias.
- Editar categorias.
- Eliminar categorias.
- Asignar categoria a una tarea.
- Filtrar por categoria.
- Filtrar por estado: `Todo`, `Pendiente`, `Completado`.
- Persistir informacion con `localStorage`.
- Consumir feature flags desde `Firebase Remote Config` con valores por defecto locales.

## 3. Arquitectura

### Frontend

- Framework UI: `Ionic Angular`
- Framework base: `Angular 20`
- Navegacion: `Angular Router`
- Estado local: `BehaviorSubject`
- Persistencia: `localStorage`
- Integracion remota: `Firebase Remote Config`
- Empaquetado movil: `Cordova 13`

### Estructura principal

- App principal: `todo-accenture/`
- Ruteo: `todo-accenture/src/app/app-routing.module.ts`
- Pantalla principal: `todo-accenture/src/app/home/`
- Servicios de dominio: `todo-accenture/src/app/core/services/`
- Modelos: `todo-accenture/src/app/core/models/`
- Entornos: `todo-accenture/src/environments/`
- Configuracion Cordova: `todo-accenture/config.xml`

### Servicios clave

- `TaskStoreService`: administra CRUD de tareas y actualiza `localStorage`.
- `CategoryStoreService`: administra CRUD de categorias y sincroniza cambios locales.
- `LocalStorageService`: encapsula lectura y escritura segura sobre `localStorage`.
- `FeatureFlagsService`: inicializa Firebase y resuelve flags remotas con fallback local.

## 4. Feature flags

El proyecto ya tiene configuracion funcional para Firebase:

- `enable_task_editing`
- `show_status_filters`

Comportamiento:

- Si Firebase esta configurado y el entorno soporta Remote Config, la app hace `fetchAndActivate`.
- Si la inicializacion falla, la app usa valores por defecto locales:
  - `enableTaskEditing = true`
  - `showStatusFilters = true`

Archivos relacionados:

- `todo-accenture/src/environments/environment.ts`
- `todo-accenture/src/environments/environment.prod.ts`
- `todo-accenture/src/app/core/services/feature-flags.service.ts`

## 5. Ejecucion local

### Requisitos

- `Node.js`
- `npm`

### Instalacion

```powershell
& "C:\Program Files\nodejs\npm.cmd" --prefix .\todo-accenture install
```

### Desarrollo

```powershell
& "C:\Program Files\nodejs\npm.cmd" --prefix .\todo-accenture run start
```

### Desarrollo seguro con configuracion local privada

```powershell
& "C:\Program Files\nodejs\npm.cmd" --prefix .\todo-accenture run start:secure
```

### Build web

```powershell
& "C:\Program Files\nodejs\npm.cmd" --prefix .\todo-accenture run build
```

### Build web seguro

```powershell
& "C:\Program Files\nodejs\npm.cmd" --prefix .\todo-accenture run build:web:secure
```

Resultado verificado:

- El build web compilo correctamente el `2026-04-26`.
- La salida queda en `todo-accenture/www/`.

## 6. Configuracion privada y seguridad

La configuracion sensible del proyecto no queda versionada en Git.

Archivos versionados y seguros:

- `todo-accenture/src/environments/environment.ts`
- `todo-accenture/src/environments/environment.prod.ts`
- `todo-accenture/.env.example`
- `todo-accenture/scripts/generate-local-env.mjs`

Archivos locales ignorados por Git:

- `todo-accenture/.env.local`
- `todo-accenture/src/environments/environment.local.ts`
- `todo-accenture/src/environments/environment.local.prod.ts`
- `todo-accenture/signing/todo-accenture-release.jks`
- `Entregables/*.apk`

Flujo recomendado:

1. Completar `todo-accenture/.env.local` con los valores privados.
2. Ejecutar `npm run env:generate:local`.
3. Usar `start:secure`, `build:web:secure` o `build:android:secure`.

Esto permite mantener fuera del repositorio:

- configuracion real de Firebase
- llaves locales de firma Android
- binarios APK entregables

## 7. Estado del empaquetado movil

### Android APK

Acciones realizadas:

- Se instalaron dependencias locales para build movil:
- `cordova`
- `cordova-android`
- `@ionic/cli`
- Se genero la plataforma Android en `todo-accenture/platforms/android`.
- Se configuro el entorno local con Android SDK y JDK.
- Se genero un build `debug` funcional.
- Se genero un build `release` y se firmo localmente con keystore privado.

Estado actual:

- `APK Debug` generado correctamente.
- `APK Release firmado` generado correctamente.

Artefacto disponible en:

- `todo-accenture\platforms\android\app\build\outputs\apk\debug\app-debug.apk`
- `todo-accenture\platforms\android\app\build\outputs\apk\release\app-release-signed.apk`
- `Entregables\app-debug.apk`
- `Entregables\app-release-signed.apk`

Tamano del archivo generado:

- `app-debug.apk`: `4,614,246 bytes`
- `app-release-signed.apk`: `3,784,784 bytes`

Comandos usados para validar y construir:

```powershell
Set-Location .\todo-accenture
.\node_modules\.bin\cordova.cmd requirements android
.\node_modules\.bin\cordova.cmd build android --debug
.\node_modules\.bin\cordova.cmd build android --release
```

Notas tecnicas relevantes:

- En este entorno fue necesario usar una ruta corta de Windows para evitar fallos nativos de Cordova al crear la plataforma.
- Los plugins Cordova declarados originalmente en `config.xml` se retiraron porque bloqueaban la preparacion del proyecto y no eran necesarios para la funcionalidad principal de la prueba.
- El `APK Release` final se firma con un keystore local ignorado por Git.
- Sin ese keystore no se deben publicar actualizaciones futuras de la app firmada.

### iOS IPA

Estado actual:

- `IPA` no se genera localmente en este equipo Windows.
- El workflow de GitHub Actions queda preparado, pero no se puede completar sin cuenta Apple Developer, certificados y provisioning profile.

Motivo tecnico:

- Cordova iOS requiere `macOS`, `Xcode`, toolchain de firma de Apple y certificados/perfiles de aprovisionamiento.

Recomendacion de implementacion:

- Usar `GitHub Actions` con runner `macOS`.

Motivos:

- GitHub Actions ofrece runners `macOS` hospedados por GitHub y es una opcion generalista y mantenible para el repo.
- GitHub permite publicar el `IPA` como artifact descargable del workflow.
- Appflow sigue soportando builds nativos para proyectos `Cordova`, pero su CLI esta orientado a clientes enterprise y las ventas de planes enterprise fueron descontinuadas, por lo que no es la opcion mas conveniente para una configuracion nueva.

Opciones reales para generar el `IPA`:

1. Clonar el repo en una Mac con `Xcode`.
2. Usar `GitHub Actions` sobre runner `macOS`.
3. Usar `Appflow` solo si ya cuentas con acceso activo a esa plataforma y certificados cargados.

Comando de referencia en macOS:

```bash
cd todo-accenture
./node_modules/.bin/cordova platform add ios
./node_modules/.bin/cordova build ios
```

## 7. Calidad y mantenibilidad

- Separacion clara entre UI, almacenamiento local y feature flags.
- Uso de `BehaviorSubject` para estado observable simple y suficiente para el alcance.
- Fallback seguro cuando Firebase no responde.
- Seed data inicial para mejorar demo y evaluacion funcional.
- Build web validado como smoke test tecnico.

## 8. Publicacion en GitHub

El repositorio puede publicarse sin comprometer cuentas o credenciales porque:

- `.env.local` queda ignorado.
- los `environment.local*.ts` quedan ignorados.
- el keystore Android queda ignorado.
- los `APK` copiados en `Entregables/` quedan ignorados.
- el workflow iOS usa solo `GitHub Secrets` y no contiene secretos hardcodeados.

## 9. Riesgos y recomendaciones

- El proyecto ya esta listo para demostrar logica funcional y build Android.
- Para iOS, el limite real sigue siendo la cuenta Apple Developer y la firma de Apple.
- Se recomienda mover el keystore a una ubicacion privada fuera del proyecto despues de la entrega.
- Si el evaluador solo revisa codigo y comportamiento, el repositorio puede compartirse sin exponer la configuracion privada local.

## 10. Entregables generados en esta iteracion

- Actualizacion de `README.md` como documentacion tecnica.
- Manual de usuario fuente en `docs/manual-usuario.md`.
- Generador reproducible de PDF en `docs/generate_user_manual.py`.
- PDF del manual en `docs/manual-usuario-todo-app.pdf`.
- Workflow iOS en `.github/workflows/build-ios-ipa.yml`.
- Guia de iOS en `docs/github-actions-ipa.md`.
- `APK Debug` local en `Entregables/app-debug.apk`.
- `APK Release firmado` local en `Entregables/app-release-signed.apk`.
