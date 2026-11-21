# PC Mouse Minimal — extensión para Lemur Browser

## Qué incluye
- Cursor de ratón dibujado sobre páginas web.
- Panel táctil flotante y movible.
- Movimiento con sensibilidad ajustable.
- Botón izquierdo con pulsación mantenida (útil para arrastrar).
- Clic derecho/contextual.
- Modo rueda para desplazar la página.
- Popup para activar/desactivar y ajustar tamaño/sensibilidad.

## Limitaciones importantes
Esta es una extensión de navegador, no un controlador de entrada de Android ni una emulación USB/Bluetooth HID. Los eventos que crea JavaScript son sintéticos (`isTrusted=false`): algunas webs, juegos, reproductores o controles pueden ignorarlos. No puede controlar la interfaz de Lemur ni otras aplicaciones. Las extensiones tampoco pueden convertir estos eventos en eventos físicos auténticos sin soporte privilegiado del sistema.

## Instalar en Lemur
1. Descomprime el proyecto.
2. En Lemur abre el administrador de extensiones.
3. Usa la opción de cargar/importar extensión local si está disponible y selecciona la carpeta que contiene `manifest.json`.
4. Activa PC Mouse Minimal y abre una página `https://` o `http://`.
5. Pulsa el icono de la extensión para activar el panel.

La ubicación exacta del importador depende de la versión de Lemur. Este proyecto está en Manifest V3; si tu versión de Lemur no admite MV3 o carga local, habrá que adaptar el paquete a lo que admita esa versión.

## Crear el ZIP desde Termux
Instala las herramientas:
```sh
pkg update -y
pkg install git zip unzip -y
```
Descomprime este ZIP, entra en la carpeta del proyecto y crea un paquete limpio:
```sh
cd pc-mouse-pro
zip -r pc-mouse-minimal.zip manifest.json popup.html popup.css popup.js src README.md
```
El ZIP generado es el paquete de la extensión. No es un APK y no necesita Gradle.

## Subir a GitHub desde Termux
Crea un repositorio vacío en GitHub y luego:
```sh
git init
git add .
git commit -m "PC Mouse Minimal v1.1"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/pc-mouse-minimal.git
git push -u origin main
```
Cambia `TU_USUARIO` por tu usuario y usa la URL de tu repositorio.

## Compilación automática en GitHub Actions
Al subir un tag `v*`, el workflow empaqueta los archivos de la extensión y publica un artefacto ZIP descargable en la ejecución de Actions.
