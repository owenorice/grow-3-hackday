# Village Gym Design System

> **Source:** [Village Gym](https://www.villagegym.co.uk/)  
> **Brand:** Village Health & Wellness Clubs  
> **Aesthetic:** High-energy athletic brutalism, high contrast monochrome with high-voltage neon chartreuse accents.

---

## 1. Brand Philosophy & Visual Aesthetic

The Village Gym Padel visual language combines a dark, premium fitness aesthetic with high-visibility athletic accents. Characterized by:
- **High-Voltage Contrast:** Deep pitch black (`#000000`) juxtaposed with striking Volt Lime (`#97D700`) and crisp white (`#FFFFFF`).
- **Architectural Pods:** Dual-toned split sections ("Pods") alternating between dark monochrome imagery and warm stone (`#F1F1EC`) or black text containers.
- **Edgy Brutalist Elements:** Sharp zero-radius edges (`border-radius: 0`), uppercase condensed typography, wide letter-spacing (`2px` to `8px`), and deep vignette inner shadows (`box-shadow: inset 0 0 100px rgba(0,0,0,0.5)`).

---

## 2. Color Palette & Token System

### 2.1 Core Brand Colors

| Swatch | Color Name | Hex | RGB | HSL | Semantic Role |
| :---: | :--- | :--- | :--- | :--- | :--- |
| <span style="display:inline-block;width:32px;height:32px;background:#97D700;border:1px solid #777;"></span> | **Volt Lime** | `#97D700` | `rgb(151, 215, 0)` | `78°, 100%, 42%` | **Primary Brand Accent:** Interactive triggers, active states, CTA borders, link underlines, goal badge highlights. |
| <span style="display:inline-block;width:32px;height:32px;background:#9FC63B;border:1px solid #777;"></span> | **Olive Lime** | `#9FC63B` | `rgb(159, 198, 59)` | `77°, 54%, 50%` | **Logo Accent:** Secondary lime tone used in the official SVG brand mark ("Health & Wellness Club"). |
| <span style="display:inline-block;width:32px;height:32px;background:#000000;border:1px solid #777;"></span> | **Pure Pitch Black** | `#000000` | `rgb(0, 0, 0)` | `0°, 0%, 0%` | **Base Surface & Hero:** Navigation header, dark pod containers, footer, button backgrounds, high-contrast typography. |
| <span style="display:inline-block;width:32px;height:32px;background:#FFFFFF;border:1px solid #ccc;"></span> | **Pure White** | `#FFFFFF` | `rgb(255, 255, 255)` | `0°, 0%, 100%` | **Primary Light Surface:** Crisp text over dark banners, light card bodies, button hover background. |
| <span style="display:inline-block;width:32px;height:32px;background:#F1F1EC;border:1px solid #ccc;"></span> | **Warm Stone Gray** | `#F1F1EC` | `rgb(241, 241, 236)` | `60°, 12%, 94%` | **Secondary Neutral Surface:** Alternating pod backgrounds (`.bg-light-gray`), filter tab pills, soft container fills. |

---

### 2.2 Neutral Grayscale & Surfaces

| Swatch | Token Name | Hex | RGB | Purpose |
| :---: | :--- | :--- | :--- | :--- |
| <span style="display:inline-block;width:28px;height:28px;background:#111111;border:1px solid #555;"></span> | `neutral-950` | `#111111` | `rgb(17, 17, 17)` | Deepest surface elevation, dark card background |
| <span style="display:inline-block;width:28px;height:28px;background:#212529;border:1px solid #555;"></span> | `neutral-900` | `#212529` | `rgb(33, 37, 41)` | Base body text for light mode; off-black surfaces (`.bg-dark`) |
| <span style="display:inline-block;width:28px;height:28px;background:#222222;border:1px solid #555;"></span> | `neutral-850` | `#222222` | `rgb(34, 34, 34)` | Subtle dark surface card backing |
| <span style="display:inline-block;width:28px;height:28px;background:#333333;border:1px solid #555;"></span> | `neutral-800` | `#333333` | `rgb(51, 51, 51)` | Dark gray container (`.bg-dark-gray`), `.btn-1` border, goal indicator arrows |
| <span style="display:inline-block;width:28px;height:28px;background:#555555;border:1px solid #777;"></span> | `neutral-600` | `#555555` | `rgb(85, 85, 85)` | Inactive controls, secondary text on light gray |
| <span style="display:inline-block;width:28px;height:28px;background:#6C757D;border:1px solid #777;"></span> | `neutral-500` | `#6C757D` | `rgb(108, 117, 125)` | Muted body copy, breadcrumb separators, footer legal text |
| <span style="display:inline-block;width:28px;height:28px;background:#777777;border:1px solid #777;"></span> | `neutral-450` | `#777777` | `rgb(119, 119, 119)` | Disabled buttons (`.btn:disabled`), disabled input controls |
| <span style="display:inline-block;width:28px;height:28px;background:#AAAAAA;border:1px solid #aaa;"></span> | `neutral-400` | `#AAAAAA` | `rgb(170, 170, 170)` | Placeholder text, widget overlay tint, modal backdrop borders |
| <span style="display:inline-block;width:28px;height:28px;background:#DEE2E6;border:1px solid #ccc;"></span> | `neutral-200` | `#DEE2E6` | `rgb(222, 226, 230)` | Light card borders, table dividers, subtle separators |
| <span style="display:inline-block;width:28px;height:28px;background:#E9ECEF;border:1px solid #ccc;"></span> | `neutral-150` | `#E9ECEF` | `rgb(233, 236, 239)` | Soft input field borders, subtle background tint |
| <span style="display:inline-block;width:28px;height:28px;background:#F1F1F1;border:1px solid #ccc;"></span> | `neutral-100` | `#F1F1F1` | `rgb(241, 241, 241)` | `.btn-5` border color, light card surface |
| <span style="display:inline-block;width:28px;height:28px;background:#F8F9FA;border:1px solid #ccc;"></span> | `neutral-50` | `#F8F9FA` | `rgb(248, 249, 250)` | Crisp off-white secondary light container (`.bg-light`) |

---

### 2.3 Semantic & Functional States

| Swatch | Status | Hex | RGB | Usage |
| :---: | :--- | :--- | :--- | :--- |
| <span style="display:inline-block;width:28px;height:28px;background:#198754;border:1px solid #ccc;"></span> | **Success** | `#198754` | `rgb(25, 135, 84)` | Form success validation, booking confirmations |
| <span style="display:inline-block;width:28px;height:28px;background:#DFF0D8;border:1px solid #ccc;"></span> | **Success Surface** | `#DFF0D8` | `rgb(223, 240, 216)` | Success banner and alert backgrounds |
| <span style="display:inline-block;width:28px;height:28px;background:#DC3545;border:1px solid #ccc;"></span> | **Danger / Error** | `#DC3545` | `rgb(220, 53, 69)` | Validation errors, court cancellation warnings |
| <span style="display:inline-block;width:28px;height:28px;background:#721C24;border:1px solid #ccc;"></span> | **Error Text** | `#721C24` | `rgb(114, 28, 36)` | High-contrast error message typography |
| <span style="display:inline-block;width:28px;height:28px;background:#FFC107;border:1px solid #ccc;"></span> | **Warning** | `#FFC107` | `rgb(255, 193, 7)` | Important notes, limited court slot indicators |
| <span style="display:inline-block;width:28px;height:28px;background:#FCF8E3;border:1px solid #ccc;"></span> | **Warning Surface** | `#FCF8E3` | `rgb(252, 248, 227)` | Notice callout backgrounds |
| <span style="display:inline-block;width:28px;height:28px;background:#0D6EFD;border:1px solid #ccc;"></span> | **Informational** | `#0D6EFD` | `rgb(13, 110, 253)` | Secondary information triggers, hyperlinks |

---

### 2.4 Overlays, Shadows & Alpha Colors

| Token Name | Value | Usage |
| :--- | :--- | :--- |
| `--vg-overlay-banner` | `rgba(0, 0, 0, 0.6)` | Hero slider & pod image darkening overlay |
| `--vg-overlay-modal` | `rgba(0, 0, 0, 0.8)` | Full-screen video and lightbox overlay (`.light-window-overlay`) |
| `--vg-overlay-input-border` | `rgba(255, 255, 255, 0.2)` | Input outlines in dark form blocks (`.bg-black .form-group .inner`) |
| `--vg-shadow-vignette` | `inset 0 0 100px 0 rgba(0, 0, 0, 0.5)` | Signature deep perimeter shadow on dark media cards |
| `--vg-shadow-vignette-sm` | `inset 0 0 50px 0 rgba(0, 0, 0, 0.5)` | Hover state vignette on interactive media blocks |
| `--vg-shadow-card` | `2px 2px 10px 2px rgba(0, 0, 0, 0.1)` | Subtle floating card elevation |

---

## 3. WCAG Accessibility & Contrast Matrix

| Foreground Color | Background Color | Contrast Ratio | WCAG 2.1 AA | WCAG 2.1 AAA | Best Practice Note |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `#97D700` (Volt Lime) | `#000000` (Black) | **12.42 : 1** | Pass (Normal & Large) | Pass (Normal & Large) | **Ideal pairing** for badges, CTA borders, and highlighted headlines. |
| `#000000` (Black) | `#97D700` (Volt Lime) | **12.42 : 1** | Pass (Normal & Large) | Pass (Normal & Large) | **Recommended for button text** on solid Volt Lime backgrounds. |
| `#FFFFFF` (White) | `#000000` (Black) | **21.00 : 1** | Pass (Normal & Large) | Pass (Normal & Large) | Default for all dark pod text and navigation headers. |
| `#000000` (Black) | `#F1F1EC` (Stone) | **18.23 : 1** | Pass (Normal & Large) | Pass (Normal & Large) | Standard reading pairing for light pod content. |
| `#FFFFFF` | `#97D700` (Volt Lime) | **1.69 : 1** | **Fail** | **Fail** | ⚠️ *Warning:* While used for uppercase bold buttons in marketing, dark text (`#000000`) is recommended for compliant UI. |
| `#6C757D` (Muted) | `#000000` (Black) | **4.61 : 1** | Pass (Normal & Large) | Fail (Normal) | Suitable for secondary subheadings on dark mode. |
| `#6C757D` (Muted) | `#FFFFFF` (White) | **4.55 : 1** | Pass (Normal & Large) | Fail (Normal) | Suitable for secondary body copy on light surfaces. |

---

## 4. Typography System

### 4.1 Font Family Tokens

- **Display & Headings:** `"villageflex_BOLD"`, `"villageflex_MEDIUM"`, `sans-serif`
- **Body & Captions:** `"villageflex_REGULAR"`, `"villageflex_LIGHT"`, `-apple-system`, `BlinkMacSystemFont`, `"Segoe UI"`, `Roboto`, `sans-serif`
- **Italic Expressions:** `"villageflex_MEDIUMITALIC"`, `"villageflex_LIGHTITALIC"`
- **Iconography:** `Ionicons`, `Font Awesome 6 Free` (solid 900), `Font Awesome 6 Brands`

---

### 4.2 Type Scale (`.vflex` Scale)

| Token Class | Font Size | Line Height | Letter Spacing | Transform | Typical Application |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `h1` / `size-10` | `35px` - `60px` | `1.1` | `4px` - `8px` | `UPPERCASE` | Hero display banners ("SERVE UP SOME ACTION") |
| `h2` / `size-20` | `24px` - `40px` | `1.2` | `4px` | `UPPERCASE` | Section titles ("WHERE FITNESS MEETS MAYHEM") |
| `h3` / `size-30` | `22px` | `1.25` | `2px` | `UPPERCASE` | Subsection headings ("WHAT'S ON THE COURT") |
| `h4` / `size-40` | `20px` - `25px` | `1.3` | `2px` | `UPPERCASE` | Pod cards ("PADEL'S RISE TO FAME", "LET'S GET STARTED") |
| `size-45` | `18px` | `1.3` | `2px` | `UPPERCASE` | Navigation titles, card labels ("1:1 COACHING") |
| `size-50` | `18px` | `1.4` | `normal` | `none` | Lead body paragraphs in pod sections |
| `size-60` (Body) | `15px` - `16px` | `1.5` | `normal` | `none` | Standard editorial copy, card text |
| `size-62` | `14px` | `1.5` | `normal` | `none` | Secondary body text, form hints |
| `size-70` / `size-71` | `12px` - `13px` | `1.4` | `1px` | `UPPERCASE` | Legal notes, metadata, badge text |

---

## 5. Component Patterns & Rules

### 5.1 Buttons (`.btn` System)

The design system employs high-contrast, razor-sharp rectangular buttons (`border-radius: 0; min-height: 50px; font-family: "villageflex_MEDIUM"; text-transform: uppercase; letter-spacing: 0.46px - 2px;`).

```css
/* Base Button Styling */
.btn {
  border-radius: 0;
  border-width: 2px;
  border-style: solid;
  min-height: 50px;
  padding: 9px 24px;
  font-family: "villageflex_MEDIUM", sans-serif;
  font-size: 16px;
  line-height: 1;
  text-transform: uppercase;
  letter-spacing: 0.46px;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
```

#### Button Variants

| Variant | Normal State | Hover State | Intended Context |
| :--- | :--- | :--- | :--- |
| **`.btn-1`** (Dark Neutral) | `bg: #000000`<br>`color: #FFFFFF`<br>`border: 2px solid #333333` | `bg: #FFFFFF`<br>`color: #000000`<br>`border-color: #FFFFFF` | Secondary actions on dark surfaces |
| **`.btn-2`** (Accent Outline Dark) | `bg: #000000`<br>`color: #FFFFFF`<br>`border: 2px solid #97D700` | `bg: #FFFFFF`<br>`color: #000000`<br>`border-color: #FFFFFF` | Prominent dark section action |
| **`.btn-3`** (Primary Accent CTA) | `bg: #97D700`<br>`color: #FFFFFF` (or `#000`)<br>`border: 2px solid #97D700` | `bg: #FFFFFF`<br>`color: #97D700`<br>`border-color: #97D700` | **Primary Conversion Goal:** "Book Court", "Join Now" |
| **`.btn-4`** (Inverted Accent) | `bg: #FFFFFF`<br>`color: #000000`<br>`border: 2px solid #97D700` | `bg: #000000`<br>`color: #FFFFFF`<br>`border-color: #000000` | High-visibility action on light pods |
| **`.btn-5`** (Light Ghost) | `bg: #FFFFFF`<br>`color: #000000`<br>`border: 2px solid #F1F1F1` | `bg: #FFFFFF`<br>`color: #000000`<br>`border-color: #97D700` | Tertiary or catalog list actions |
| **`.btn--border`** (Outline) | `bg: transparent`<br>`color: #FFFFFF`<br>`border: 2px solid #97D700` | `bg: #97D700`<br>`color: #000000`<br>`border-color: #97D700` | Hero banner secondary trigger |
| **`.btn:disabled`** | `bg: #777777`<br>`color: #000000`<br>`border: 2px solid #777777` | No hover change (`cursor: not-allowed`) | Inactive form states |

---

### 5.2 Pod Layout Architecture (`.b-double-pod-section`)

The signature visual device of the site is the 50/50 split pod:
- **Left/Right Symmetry:** Two columns on desktop (`min-height: calc(50vw - 17px)`).
- **Media Pod:** Full-bleed lifestyle imagery with high saturation and athletic energy.
- **Content Pod:** Pure black (`#000000`) or stone (`#F1F1EC`) with centered vertical text alignment (`max-width: 480px`).
- **Underline Links:** Inline text links inside pods feature an exclusive volt lime underline:
  ```css
  .b-double-pod-section a.link {
    letter-spacing: 2px;
    border-width: 0 0 2px;
    border-style: solid;
    border-color: #97d700;
    text-transform: uppercase;
    display: inline-block;
    padding-bottom: 2px;
  }
  ```

---

### 5.3 Hero Banner Slider (`.b-banner-slider`)

- Full-screen height (`calc(100vh - 80px)`).
- Centered stacked content with heavy letter-spacing:
  - Small uppercase kicker: `font-size: 20px; letter-spacing: 4px; font-weight: bold;`
  - Main headline: `font-size: 60px; letter-spacing: 6px; text-transform: uppercase;`
- **Vignette Background Overlay:**
  ```css
  .text-container {
    background-color: rgba(0, 0, 0, 0.6);
    box-shadow: inset 0 0 100px 0 rgba(0, 0, 0, 0.5);
  }
  ```

---

### 5.4 Form Elements & Inputs

Dark brutalist forms designed for fast registration:
- **Input Background:** `#000000`
- **Input Text:** `#FFFFFF`
- **Input Border:** `1px solid rgba(255, 255, 255, 0.2)`
- **Input Focus State:** `border-color: #97D700; outline: none;`
- **Submit Button:** Full-width Volt Lime (`#97D700`) button with uppercase label.

---

## 6. Implementation Code Snippets

### 6.1 Native CSS Variables (`:root`)

```css
:root {
  /* Brand Accents */
  --color-brand-primary: #97D700;
  --color-brand-primary-rgb: 151, 215, 0;
  --color-brand-logo: #9FC63B;

  /* Neutrals */
  --color-surface-pitch: #000000;
  --color-surface-dark: #212529;
  --color-surface-charcoal: #333333;
  --color-surface-stone: #F1F1EC;
  --color-surface-light: #F8F9FA;
  --color-surface-white: #FFFFFF;

  /* Text Colors */
  --color-text-on-dark: #FFFFFF;
  --color-text-on-light: #000000;
  --color-text-muted: #6C757D;
  --color-text-disabled: #777777;

  /* Borders & Dividers */
  --color-border-dark: #333333;
  --color-border-light: #DEE2E6;
  --color-border-stone: #F1F1EC;
  --color-border-accent: #97D700;
  --color-border-translucent-white: rgba(255, 255, 255, 0.2);

  /* Status */
  --color-success: #198754;
  --color-warning: #FFC107;
  --color-danger: #DC3545;
  --color-danger-text: #721C24;
  --color-info: #0D6EFD;

  /* Overlays & Shadows */
  --overlay-banner: rgba(0, 0, 0, 0.6);
  --overlay-modal: rgba(0, 0, 0, 0.8);
  --shadow-vignette: inset 0 0 100px 0 rgba(0, 0, 0, 0.5);
  --shadow-vignette-hover: inset 0 0 50px 0 rgba(0, 0, 0, 0.5);

  /* Geometry & Timing */
  --border-radius-base: 0px;
  --transition-standard: all 0.3s ease-in-out;
}
```

---

### 6.2 Tailwind CSS Configuration (`tailwind.config.js`)

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    extend: {
      colors: {
        brand: {
          volt: '#97D700',
          olive: '#9FC63B',
          DEFAULT: '#97D700',
        },
        surface: {
          pitch: '#000000',
          charcoal: '#333333',
          dark: '#212529',
          stone: '#F1F1EC',
          light: '#F8F9FA',
          white: '#FFFFFF',
        },
        status: {
          success: '#198754',
          danger: '#DC3545',
          warning: '#FFC107',
          info: '#0D6EFD',
        }
      },
      fontFamily: {
        village: ['villageflex_REGULAR', 'sans-serif'],
        'village-bold': ['villageflex_BOLD', 'sans-serif'],
        'village-medium': ['villageflex_MEDIUM', 'sans-serif'],
      },
      letterSpacing: {
        'tight-title': '2px',
        'wide-title': '4px',
        'mega-title': '6px',
        'ultra-title': '8px',
      },
      borderRadius: {
        DEFAULT: '0px',
        none: '0px',
      },
      boxShadow: {
        vignette: 'inset 0 0 100px 0 rgba(0, 0, 0, 0.5)',
        'vignette-sm': 'inset 0 0 50px 0 rgba(0, 0, 0, 0.5)',
      }
    },
  },
};
```

---

### 6.3 SCSS Token Map

```scss
$vg-colors: (
  "volt": #97D700,
  "olive": #9FC63B,
  "pitch": #000000,
  "dark": #212529,
  "charcoal": #333333,
  "stone": #F1F1EC,
  "light": #F8F9FA,
  "white": #FFFFFF,
  "muted": #6C757D
);

@function vg-color($key) {
  @return map-get($vg-colors, $key);
}

// Pod link mixin
@mixin vg-pod-link {
  font-family: "villageflex_MEDIUM", sans-serif;
  text-transform: uppercase;
  letter-spacing: 2px;
  border-width: 0 0 2px;
  border-style: solid;
  border-color: vg-color("volt");
  color: inherit;
  text-decoration: none;
  padding-bottom: 2px;
  display: inline-block;
  transition: opacity 0.2s ease;

  &:hover {
    opacity: 0.8;
  }
}
```

---

## 7. Summary & Quick Reference

- **Hero Color:** **Volt Lime (`#97D700`)** – high-voltage athletic chartreuse.
- **Contrast Base:** **Pure Black (`#000000`)** alternating with **Warm Stone Gray (`#F1F1EC`)**.
- **Button Archetype:** Rectangular (`0px` radius) with `2px solid` borders and uppercase medium-weight typography.
- **Vignette Signature:** Inset dark vignette shadows create a theatrical, high-energy sports lighting atmosphere across all photography.
