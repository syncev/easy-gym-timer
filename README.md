# Easy Gym Timer

Timer de entrenamiento de fuerza para móvil, diseñado para controlar las fases de cada repetición, los descansos entre series, el conteo en modo al fallo y — ahora — guardar tus ejercicios como una rutina reutilizable con seguimiento de peso e intensidad. Todo sin necesidad de mirar el celular en cada momento.

Funciona como **PWA (Progressive Web App)**: se instala desde Chrome en Android directamente en la pantalla de inicio y opera sin conexión.

---

## Demo

**https://syncev.github.io/easy-gym-timer/**

La app está hosteada con GitHub Pages directo desde la rama `main`: cada cambio que se pushea al repo se refleja ahí solo, en general en un par de minutos.

---

## Características

### Timer de repeticiones
Cada repetición se divide en fases configurables con animación circular y audio:

| Fase | Color | Comportamiento del círculo | Sonido |
|---|---|---|---|
| Contraer | Verde | Crece de 0 a máximo | Beep agudo |
| Isométrico *(opcional)* | Celeste | Se mantiene al máximo | Beep medio |
| Excéntrico (bajar) | Naranja | Se contrae de máximo a 0 | Beep grave (1 por segundo) |
| Pausa *(opcional)* | Gris | Permanece en 0 | Beep suave |

Las fases se pueden **invertir** (Excéntrico → Pausa → Concéntrico → Isométrico), útil para ejercicios donde arrancás desde la posición estirada. El contador de segundos muestra 2 decimales en tiempo real sobre el círculo.

### Countdown de inicio y "Skip Intro"
Al presionar **INICIAR** arranca una cuenta regresiva de 10 segundos con tonos ascendentes y un acorde final antes de la primera repetición. El botón que en el resto del entrenamiento dice **"Skip serie"** pasa a decir **"Skip Intro"** mientras corre este countdown, y solo lo cancela a él — nunca salta la serie completa por error.

### Descanso entre series
- Contador visual con barra de progreso, con pausa y salto manual
- Los últimos 15/10/5 segundos suenan avisos (campana simple, doble, y tonos ascendentes por segundo)
- Al terminar (o al saltarlo), suena un acorde y hay **3 segundos de gracia** con cuenta regresiva antes de que arranque la siguiente serie — así siempre da tiempo a soltar el celular
- Se puede **minimizar**: al tocar "←" durante el descanso, el timer se reduce a un cartel arriba de la pantalla principal y sigue contando en segundo plano; tocándolo volvés a la pantalla de descanso, y al llegar a 0 arranca la siguiente serie solo

### Descanso rápido (independiente de un entrenamiento)
Módulo en la pantalla principal para arrancar un descanso suelto (90/120/150/180s o un valor personalizado) sin necesidad de estar en medio de un entrenamiento — útil como cronómetro de mano.

### Superserie
Modo togglable que encadena dos ejercicios (A y B) dentro de la misma serie, con un "short rest" corto entre ambos. Series, reps, fases y pesos se pueden configurar igual o distinto para cada ejercicio.

### Modo al fallo
Permite marcar individualmente qué series (o ejercicios A/B en superserie) se hacen al fallo en lugar de usar el conteo de reps configurado. El contador de repeticiones al fallo es independiente por serie y se muestra durante el entrenamiento; al finalizar, la pantalla de resultados muestra el detalle por serie.

### Pesos por serie
Un input de Kg por cada serie (o por cada serie y ejercicio, en superserie) para llevar registro de cuánto peso usaste. Queda guardado junto con el resto de la configuración del ejercicio.

### Pausa por ejercicio
Fase opcional al final de cada rep (después del excéntrico), activable por separado para el ejercicio A y B en superserie.

### Módulo Series
Agrupa Superserie, Descanso interseries, Series/Reps, Pesos y Fases en una sola tarjeta colapsable (con borde naranja) — tocando el título "Series" se colapsa a solo el encabezado, útil si ya tenés la rutina armada y no querés perder pantalla. El estado (colapsado o no) se recuerda entre sesiones.

### Ejercicios guardados
Al final de la pantalla principal hay un módulo "Ejercicios" donde queda tu rutina:
- **Guardar**: al costado de INICIAR, guarda toda la configuración actual (series, reps, fases, pesos, etc.) con un nombre — dos nombres si es superserie, uno por ejercicio.
- Cada ejercicio de la lista se puede **reordenar arrastrando** el ícono de la izquierda, tiene un botón **▶ Play** y uno **✎ Editar**.
- Los nombres largos se desplazan solos (con una pausa antes de empezar y otra al llegar al final) en vez de cortarse.
- **Exportar / Importar** (⬇️/⬆️ junto al título): descarga o restaura toda la lista como un archivo `.json` — la única copia "de respaldo" fuera del navegador, útil si limpiás datos del sitio o cambiás de dispositivo.

### Vista previa antes de empezar ("ejercicio por hacer")
Tocar ▶ en un ejercicio guardado **no arranca el entrenamiento directo** — lleva a una pantalla de resumen de solo lectura (valores, no inputs) para repasar antes de empezar:
- Título con el/los nombre(s) del ejercicio (dos colores distintos si es superserie)
- Series, reps, descanso, fases y pesos, todo simplificado con íconos
- Historial de **intensidad** de las últimas 3 veces (ver más abajo)
- Botones: **← Volver** (a la config, sin arrancar nada), **Editar** y **Comenzar**

### Modo edición
Tocar **Editar** — desde la lista de ejercicios o desde la vista previa — carga esa configuración en el módulo Series real y lo marca visualmente: borde violeta-rosado fluo, el nombre del ejercicio debajo del título (editable ahí mismo con ✎), y el botón INICIAR se reemplaza por **Cancelar** (rojo, pide confirmación). "Guardar Cambios" guarda y sale del modo edición con una animación de brillo en el borde. Si entrás a editar desde la vista previa, el módulo se ve siempre expandido ahí (sin importar si lo tenías colapsado) y edita en esa misma pantalla, sin navegar a otro lado.

### Registro de intensidad
Al terminar un entrenamiento que arrancó desde un ejercicio guardado, la pantalla final ("Entrenamiento completo") muestra una sección para registrar cómo te fue — una pregunta por ejercicio (A y B por separado en superserie) con 6 iconos de esfuerzo (de "muy bien" a "faltaron 5 o más reps"). Queda guardado junto con el peso de la última serie, y se ve en el historial de la vista previa la próxima vez.

---

## Cómo usar la app

1. **Configurá** los parámetros en la pantalla principal (o cargá un ejercicio guardado con ✎ para editarlo).
2. Opcionalmente, **Guardá** esa configuración como un ejercicio con nombre.
3. Para entrenar: tocá **INICIAR** directo, o tocá **▶** en un ejercicio guardado → revisá el resumen → **Comenzar**.
4. Entrená: el círculo marca cada fase con sonido; **Skip Intro** salta el countdown inicial, **Skip serie** salta la serie actual, **Saltar descanso** salta el descanso (con 3s de gracia antes de la próxima serie).
5. Al terminar, si el entrenamiento vino de un ejercicio guardado, **registrá la intensidad** de esa sesión.
6. Repetí — la próxima vez que abras la vista previa de ese ejercicio vas a ver el historial de pesos e intensidad de las últimas veces.

---

## Configuración

Todos los parámetros se configuran en el módulo Series antes de iniciar:

| Parámetro | Default | Descripción |
|---|---|---|
| **Superserie** | off | Toggle + segundos de "short rest" entre ejercicio A y B |
| **Descanso interseries** | 120s | Segundos de descanso entre series |
| **Series** | 4 | Cantidad de series |
| **Reps** | 12 | Repeticiones por serie (o por ejercicio, si "Reps dif." está activo) |
| **Al fallo** | — | Toggle + selector de qué series son al fallo |
| **Pesos** | — | Kg por serie (o por serie y ejercicio en superserie) |
| **Concéntrico / Isométrico / Excéntrico / Pausa** | 1s / 1s / 3s / 1s | Duración de cada fase (Isométrico y Pausa son opcionales, en 0 se desactivan) |
| **Invertir fases** | off | Cambia el orden a Excéntrico → Pausa → Concéntrico → Isométrico |

---

## Audios

| Evento | Descripción |
|---|---|
| Inicio de rep (Contraer) | Beep agudo |
| Inicio de fase Isométrico / Pausa | Beep medio |
| Cada segundo de la fase Excéntrico | Beep grave (onda triangular, 310 Hz) |
| Mitad de las reps / última rep | Dos tonos ascendentes / dos pings agudos |
| Fin de serie | Acorde doble |
| Countdown inicial (10→1) y período de gracia (3→1) | Tonos ascendentes 440→880 Hz + acorde final Do-Mi-Sol |
| Descanso: quedan 20s / 15s / 10s | Campana suave / campana simple / campana doble |
| Últimos 5s del descanso | Tonos ascendentes (1 por segundo) |
| Fin del descanso | Acorde Do-Mi-Sol, luego el período de gracia de 3s |

---

## Instalación en Android

1. Abrí **Chrome** y navegá a la URL de la app
2. Chrome mostrará un banner "Añadir a pantalla de inicio" — tocalo
3. Si no aparece: menú `⋮` → "Añadir a pantalla de inicio"
4. La app queda instalada como ícono nativo y **funciona offline**

> **Permisos:** La app solicita Wake Lock para mantener la pantalla encendida mientras el timer está activo. No requiere ningún otro permiso.

---

## Backup de datos

Los ejercicios guardados (incluyendo pesos e historial de intensidad) viven en el `localStorage` del navegador — sobreviven a un reload normal, pero se pierden si limpiás los datos del sitio o cambiás de navegador/dispositivo. Usá **Exportar** (⬇️, junto al título "Ejercicios") para bajar un `.json` de respaldo, e **Importar** (⬆️) para restaurarlo cuando haga falta.

---

## Deploy propio

### Opción A — GitHub Pages (la que usa este repo)
1. Fork este repo
2. Settings → Pages → Branch: `main` → Folder: `/ (root)`
3. La app queda en `https://TU_USUARIO.github.io/easy-gym-timer/`

### Opción B — Netlify (sin cuenta, 1 click)
1. Ir a [app.netlify.com/drop](https://app.netlify.com/drop)
2. Arrastrar la carpeta del proyecto
3. Listo — URL pública instantánea (crear cuenta para que no expire)

### Opción C — Servidor local (desarrollo)
```bash
cd easy-gym-timer
python3 -m http.server 8080
# Abrir http://localhost:8080 (o http://TU_IP_LOCAL:8080 desde el celular en la misma red)
```

> Durante desarrollo, si usás el service worker recordá que un hard-reload (Ctrl+Shift+R) alcanza para ver cambios — evitá "Clear site data" salvo que necesites resetear todo, porque también borra los ejercicios guardados.

---

## Stack técnico

| Tecnología | Uso |
|---|---|
| HTML5 | Estructura y semántica |
| CSS3 | Layout, animaciones, variables |
| JavaScript (vanilla) | Lógica completa del timer, estado, persistencia |
| Web Audio API | Generación de sonidos procedural (sin archivos de audio) |
| SVG | Animación del círculo |
| Service Worker | Caché offline |
| Web App Manifest | Instalación como PWA |
| Screen Wake Lock API | Pantalla encendida durante el entrenamiento |
| localStorage | Ejercicios guardados, pesos, historial de intensidad, preferencias |

Sin frameworks, sin dependencias externas, sin build step.

---

## Estructura del proyecto

```
easy-gym-timer/
├── index.html      # Estructura y markup
├── style.css       # Estilos y layout
├── app.js          # Lógica completa (timer, audio, estado, ejercicios)
├── sw.js           # Service worker (caché offline)
├── manifest.json   # Manifest PWA
├── icon.svg        # Ícono de la app
└── icons/          # Íconos de las opciones de intensidad
```

---

## Licencia

MIT — libre para usar, modificar y distribuir.
