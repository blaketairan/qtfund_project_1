# Data Model: Tailwind CSS Configuration

**Feature**: 010-fix-tailwind-styling  
**Date**: 2025-01-27  
**Purpose**: Define configuration entities for Tailwind CSS setup

## Entities

### CSS Configuration

**Source**: Configuration Files  
**Entity Name**: `CSSConfiguration`  
**Purpose**: Defines how CSS is processed in the build pipeline

#### Fields

| Field Name | Type | Required | Description | File Location |
|-----------|------|----------|-------------|---------------|
| `entryPoint` | String | Yes | Path to CSS entry file | src/index.css |
| `tailwindConfig` | String | Yes | Tailwind configuration file | tailwind.config.js |
| `postcssConfig` | String | Yes | PostCSS configuration file | postcss.config.js |
| `webpackRule` | Object | Yes | Webpack module rule for CSS | webpack.config.js |
| `importStatement` | String | Yes | CSS import in entry point | src/index.js |

#### Configuration Data

```javascript
{
  entryPoint: "src/index.css",
  tailwindConfig: "tailwind.config.js",
  postcssConfig: "postcss.config.js",
  webpackRule: {
    test: /\.css$/,
    use: ['style-loader', 'css-loader', 'postcss-loader']
  },
  importStatement: "import './index.css'"
}
```

---

### Tailwind Configuration

**Source**: tailwind.config.js  
**Entity Name**: `TailwindConfig`  
**Purpose**: Tells Tailwind which files to scan for classes

#### Fields

| Field Name | Type | Required | Description |
|-----------|------|----------|-------------|
| `content` | Array<String> | Yes | File patterns to scan for Tailwind classes |
| `theme` | Object | No | Theme customization |
| `plugins` | Array | No | Tailwind plugins |

#### Current Configuration

```javascript
{
  content: [
    "./src/**/*.{js,jsx}",
    "./src/**/*.{html,js}",
    "./public/index.html"
  ],
  theme: {
    extend: {}
  },
  plugins: []
}
```

---

### PostCSS Configuration

**Source**: postcss.config.js  
**Entity Name**: `PostCSSConfig`  
**Purpose**: Configures PostCSS plugins including Tailwind

#### Fields

| Field Name | Type | Required | Description |
|-----------|------|----------|-------------|
| `plugins` | Object | Yes | PostCSS plugins to use |
| `tailwindcss` | String | Yes | Plugin name (@tailwindcss/postcss) |
| `autoprefixer` | Object | Yes | Autoprefixer plugin |

#### Current Configuration

```javascript
{
  plugins: {
    '@tailwindcss/postcss': {},
    autoprefixer: {}
  }
}
```

---

## Data Flow

```
src/index.js
    ↓
    Imports: './index.css'
    ↓
src/index.css
    ↓
    Contains: @import "tailwindcss"
    ↓
Webpack processes CSS
    ↓
    css-loader: Resolves @import
    ↓
    postcss-loader: Runs PostCSS with @tailwindcss/postcss
    ↓
    Tailwind scans content files
    ↓
    Generates utility classes
    ↓
    style-loader: Injects CSS into DOM
    ↓
Browser renders with Tailwind styles
```

---

## Dependencies

### Build Process Dependencies

1. **source files** (src/**/*.jsx) → Tailwind scans for classes
2. **index.css** → Tailwind processes @import directive
3. **tailwind.config.js** → Defines what to scan
4. **postcss.config.js** → Configures PostCSS pipeline
5. **webpack.config.js** → Processes CSS through loaders
6. **package.json** → Defines dependencies

### Processing Chain

```
CSS File (index.css)
    ↓
Webpack module rule (test: /\.css$/)
    ↓
style-loader (injects into DOM)
    ↓
css-loader (processes imports)
    ↓
postcss-loader (runs PostCSS)
    ↓
@tailwindcss/postcss plugin
    ↓
Tailwind (scans files, generates utilities)
    ↓
Autoprefixer (adds vendor prefixes)
    ↓
Final CSS (injected into page)
```

---

## Constraints

### Build-Time Processing

1. **CSS processing happens at build time** - Styles are bundled, not generated at runtime
2. **Content scanning is static** - Tailwind analyzes files listed in content array
3. **Only used classes are included** - Tailwind's purging removes unused utilities
4. **Configuration files are required** - Tailwind needs config to know what to scan

### File Requirements

1. **src/index.css**: MUST exist and import Tailwind
2. **tailwind.config.js**: MUST exist with content paths
3. **postcss.config.js**: MUST exist with @tailwindcss/postcss plugin
4. **webpack.config.js**: MUST have CSS rule configured
5. **src/index.js**: MUST import './index.css'

---

## Summary

- **Configuration-based**: No application data, only build configuration
- **Static analysis**: Tailwind scans files at build time
- **Build pipeline**: CSS processed through webpack → PostCSS → Tailwind
- **No runtime data**: All styling resolved before page loads

