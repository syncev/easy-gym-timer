# Easy Gym Timer

Timer de entrenamiento de fuerza para móvil, diseñado para controlar las fases de cada repetición, los descansos entre series y el conteo en modo al fallo — sin necesidad de mirar el celular en cada momento.

Funciona como **PWA (Progressive Web App)**: se instala desde Chrome en Android directamente en la pantalla de inicio y opera sin conexión.

---

## Demo

> Después de activar GitHub Pages en este repo, la URL estará disponible en:  
> `https://syncev.github.io/easy-gym-timer/`

---

## Características

### Timer de repeticiones
Cada repetición se divide en tres fases configurables con animación circular y audio:

| Fase | Color | Comportamiento del círculo | Sonido |
|---|---|---|---|
| Contraer | Verde | Crece de 0 a máximo | Beep agudo |
| Isométrico | Azul | Se mantiene al máximo | Beep medio |
| Excéntrico (bajar) | Naranja | Se contrae de máximo a 0 | Beep grave (1 por segundo) |
| Pausa *(opcional)* | Gris | Permanece en 0 | Beep suave |

El contador de segundos muestra **2 decimales en tiempo real** sobre el círculo. Cuando el círculo se contrae a cero, queda visible un punto gris de referencia ("piso") que marca el tamaño mínimo.

### Countdown de inicio
Al presionar **INICIAR** arranca una cuenta regresiva de 5 segundos con tonos ascendentes y un acorde final, permitiendo al usuario ubicarse antes de comenzar.

### Descanso entre series
- Contador visual con barra de progreso
- Los últimos 5 segundos suenan tonos ascendentes (1 por segundo)
- Al terminar, suena el mismo acorde del countdown inicial antes de arrancar la siguiente serie

### Superserie
Modo togglable que encadena dos ejercicios dentro de la misma serie con un descanso corto intermedio. En el timer, la serie actual se muestra como **Serie N - A** o **Serie N - B** para identificar cuál ejercicio corresponde.

### Modo al fallo
Permite marcar individualmente qué series (o ejercicios A/B en superserie) se hacen al fallo en lugar de usar el conteo de reps configurado. El contador de repeticiones al fallo es **independiente por serie** y se muestra durante el entrenamiento. Al finalizar, la pantalla de resultados muestra el detalle por serie.

### Pausa por ejercicio
Fase opcional al final de cada rep (después del excéntrico). En modo superserie se puede activar o desactivar por separado para el ejercicio A y el ejercicio B.

---

## Configuración

Todos los parámetros se configuran en la pantalla principal antes de iniciar:

| Parámetro | Default | Descripción |
|---|---|---|
| **Series** | 4 | Cantidad de series |
| **Reps** | 12 | Repeticiones por serie |
| **Al fallo** | — | Toggle + selector de qué series son al fallo |
| **Superserie** | — | Toggle + segundos de descanso entre ejercicios (default 10s) |
| **Descanso interseries** | 120s | Segundos de descanso entre series |
| **Contraer** | 1s | Duración de la fase concéntrica |
| **Isométrico** | 1s | Duración del hold (0 = fase deshabilitada) |
| **Excéntrico** | 3s | Duración de la bajada controlada |
| **Pausa** | 1s | Duración de la pausa al fondo (toggle por ejercicio) |

---

## Pantallas

### Pantalla de configuración
```
┌─────────────────────────────┐
│         GYM TIMER           │
├─────────────────────────────┤
│ Series [4]  Reps [12]       │
│             [toggle] Al fallo│
│             [ 1 ][ 2 ][ 3 ] │  ← selector por serie
├─────────────────────────────┤
│ Superserie [off]  [10s]     │
├─────────────────────────────┤
│ Descanso interseries [120s] │
├─────────────────────────────┤
│ Fases (s)                   │
│ Contr.[1] Isom.[1] Excen.[3]│
├─────────────────────────────┤
│ Pausa [off]          [1s]   │
├─────────────────────────────┤
│        [ INICIAR ]          │
└─────────────────────────────┘
```

### Pantalla del timer
```
┌─────────────────────────────┐
│ ← │ Serie 1/4 │ Rep 3/12 │ Bajar │
│                             │
│           2.47              │  ← contador en tiempo real
│                             │
│         ╭─────╮             │
│        ╭│█████│╮            │  ← círculo animado
│       ╭─│█████│─╮           │
│       │ │█████│ │           │
│       ╰─│█████│─╯           │
│        ╰│█████│╯            │
│         ╰─────╯             │
│                             │
│    5 completadas            │  ← visible solo en modo al fallo
│                             │
│  [ ⏸ ]        [ ⏭ Skip ]   │
└─────────────────────────────┘
```

### Pantalla de descanso
```
┌─────────────────────────────┐
│ ←  DESCANSO                 │
│                             │
│           87                │  ← segundos restantes
│  ████████████░░░░░░░░░░░░   │  ← barra de progreso
│                             │
│    [ Saltar descanso ]      │
└─────────────────────────────┘
```

---

## Audios

| Evento | Descripción |
|---|---|
| Inicio de rep (Contraer) | Beep agudo |
| Inicio de fase Isométrico / Pausa | Beep medio |
| Cada segundo de la fase Excéntrico | Beep grave (onda triangular, 310 Hz) |
| Fin de serie | Acorde doble |
| Countdown inicial (5→1) | Tonos ascendentes 440→880 Hz |
| Chord de largada (¡YA!) | Acorde Do-Mi-Sol ascendente |
| Últimos 5s del descanso | Tonos ascendentes 440→880 Hz (1 por segundo) |
| Fin del descanso | Mismo acorde Do-Mi-Sol, luego comienza la serie |

---

## Instalación en Android

1. Abrí **Chrome** y navegá a la URL de la app
2. Chrome mostrará un banner "Añadir a pantalla de inicio" — tocalo
3. Si no aparece: menú `⋮` → "Añadir a pantalla de inicio"
4. La app queda instalada como ícono nativo y **funciona offline**

> **Permisos:** La app solicita Wake Lock para mantener la pantalla encendida mientras el timer está activo. No requiere ningún otro permiso.

---

## Deploy propio

### Opción A — Netlify (sin cuenta, 1 click)
1. Ir a [app.netlify.com/drop](https://app.netlify.com/drop)
2. Arrastrar la carpeta del proyecto
3. Listo — URL pública instantánea (crear cuenta para que no expire)

### Opción B — GitHub Pages
1. Fork este repo
2. Settings → Pages → Branch: `main` → Folder: `/ (root)`
3. La app queda en `https://TU_USUARIO.github.io/easy-gym-timer/`

### Opción C — Servidor local (desarrollo)
```bash
cd easy-gym-timer
python3 -m http.server 8080
# Abrir http://localhost:8080
```

---

## Stack técnico

| Tecnología | Uso |
|---|---|
| HTML5 | Estructura y semántica |
| CSS3 | Layout, animaciones, variables |
| JavaScript (vanilla) | Lógica completa del timer |
| Web Audio API | Generación de sonidos procedural (sin archivos de audio) |
| SVG | Animación del círculo |
| Service Worker | Caché offline |
| Web App Manifest | Instalación como PWA |
| Screen Wake Lock API | Pantalla encendida durante el entrenamiento |

Sin frameworks, sin dependencias externas, sin build step. Un archivo de cada tipo.

---

## Estructura del proyecto

```
easy-gym-timer/
├── index.html      # Estructura y markup
├── style.css       # Estilos y layout
├── app.js          # Lógica completa (timer, audio, estado)
├── sw.js           # Service worker (caché offline)
├── manifest.json   # Manifest PWA
└── icon.svg        # Ícono de la app
```

---

## Licencia

MIT — libre para usar, modificar y distribuir.
