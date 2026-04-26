# GitHub Actions para generar el IPA

Este proyecto incluye el workflow:

- `.github/workflows/build-ios-ipa.yml`

## Que hace

1. Instala dependencias Node.
2. Compila la app web de Ionic.
3. Agrega y prepara la plataforma `ios` con Cordova.
4. Instala certificado y provisioning profile en el runner `macOS`.
5. Genera un archive de Xcode.
6. Exporta el `IPA`.
7. Sube el `IPA` como artifact del workflow.

## Secrets requeridos en GitHub

Configuralos en `Settings > Secrets and variables > Actions`.

- `IOS_CERTIFICATE_P12`
  - Contenido Base64 del certificado `.p12`.
- `IOS_CERTIFICATE_PASSWORD`
  - Password del `.p12`.
- `IOS_PROVISION_PROFILE`
  - Contenido Base64 del archivo `.mobileprovision`.
- `KEYCHAIN_PASSWORD`
  - Password temporal para el keychain del runner.
- `APPLE_TEAM_ID`
  - Team ID de tu cuenta de Apple Developer.

## Como obtener los Base64

### PowerShell para el `.p12`

```powershell
[Convert]::ToBase64String([IO.File]::ReadAllBytes("C:\ruta\certificado.p12"))
```

### PowerShell para el `.mobileprovision`

```powershell
[Convert]::ToBase64String([IO.File]::ReadAllBytes("C:\ruta\perfil.mobileprovision"))
```

## Como ejecutar el workflow

1. Sube el repo a GitHub con el workflow incluido.
2. Configura los secrets.
3. Abre `Actions`.
4. Selecciona `Build iOS IPA`.
5. Pulsa `Run workflow`.
6. Elige el `export_method`:
   - `development`
   - `ad-hoc`
   - `app-store`
7. Descarga el artifact generado al terminar.

## Notas

- El workflow usa `manual signing`.
- Si el nombre del scheme cambia al agregar iOS, el workflow intenta resolverlo automaticamente.
- Si Apple rechaza la firma, normalmente el problema estara en el certificado, el provisioning profile o el `APPLE_TEAM_ID`.
