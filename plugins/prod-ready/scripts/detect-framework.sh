#!/bin/bash
# Detect the framework/technology stack of a project
# Usage: detect-framework.sh [project-path]

PROJECT_PATH="${1:-.}"

detect_framework() {
    local path="$1"
    local frameworks=()

    # JavaScript/TypeScript frameworks
    if [ -f "$path/next.config.js" ] || [ -f "$path/next.config.mjs" ] || [ -f "$path/next.config.ts" ]; then
        frameworks+=("nextjs")
    fi

    if [ -f "$path/nuxt.config.js" ] || [ -f "$path/nuxt.config.ts" ]; then
        frameworks+=("nuxt")
    fi

    if [ -f "$path/vite.config.js" ] || [ -f "$path/vite.config.ts" ]; then
        frameworks+=("vite")
    fi

    if [ -f "$path/angular.json" ]; then
        frameworks+=("angular")
    fi

    if [ -f "$path/svelte.config.js" ]; then
        frameworks+=("svelte")
    fi

    if [ -f "$path/remix.config.js" ]; then
        frameworks+=("remix")
    fi

    if [ -f "$path/astro.config.mjs" ] || [ -f "$path/astro.config.js" ]; then
        frameworks+=("astro")
    fi

    # Check package.json for additional detection
    if [ -f "$path/package.json" ]; then
        if grep -q '"react"' "$path/package.json" 2>/dev/null; then
            frameworks+=("react")
        fi
        if grep -q '"vue"' "$path/package.json" 2>/dev/null; then
            frameworks+=("vue")
        fi
        if grep -q '"express"' "$path/package.json" 2>/dev/null; then
            frameworks+=("express")
        fi
        if grep -q '"fastify"' "$path/package.json" 2>/dev/null; then
            frameworks+=("fastify")
        fi
        if grep -q '"nest"' "$path/package.json" 2>/dev/null; then
            frameworks+=("nestjs")
        fi
        if grep -q '"typescript"' "$path/package.json" 2>/dev/null; then
            frameworks+=("typescript")
        fi
    fi

    # Python frameworks
    if [ -f "$path/requirements.txt" ] || [ -f "$path/pyproject.toml" ]; then
        if grep -qi "django" "$path/requirements.txt" 2>/dev/null || grep -qi "django" "$path/pyproject.toml" 2>/dev/null; then
            frameworks+=("django")
        fi
        if grep -qi "flask" "$path/requirements.txt" 2>/dev/null || grep -qi "flask" "$path/pyproject.toml" 2>/dev/null; then
            frameworks+=("flask")
        fi
        if grep -qi "fastapi" "$path/requirements.txt" 2>/dev/null || grep -qi "fastapi" "$path/pyproject.toml" 2>/dev/null; then
            frameworks+=("fastapi")
        fi
        frameworks+=("python")
    fi

    # Ruby frameworks
    if [ -f "$path/Gemfile" ]; then
        if grep -q "rails" "$path/Gemfile" 2>/dev/null; then
            frameworks+=("rails")
        fi
        frameworks+=("ruby")
    fi

    # Go
    if [ -f "$path/go.mod" ]; then
        frameworks+=("go")
    fi

    # Rust
    if [ -f "$path/Cargo.toml" ]; then
        frameworks+=("rust")
    fi

    # PHP frameworks
    if [ -f "$path/composer.json" ]; then
        if grep -q "laravel" "$path/composer.json" 2>/dev/null; then
            frameworks+=("laravel")
        fi
        if grep -q "symfony" "$path/composer.json" 2>/dev/null; then
            frameworks+=("symfony")
        fi
        frameworks+=("php")
    fi

    # Mobile
    if [ -f "$path/pubspec.yaml" ]; then
        frameworks+=("flutter")
    fi

    if [ -f "$path/app.json" ] && grep -q "expo" "$path/app.json" 2>/dev/null; then
        frameworks+=("expo")
    fi

    # Docker
    if [ -f "$path/Dockerfile" ] || [ -f "$path/docker-compose.yml" ] || [ -f "$path/docker-compose.yaml" ]; then
        frameworks+=("docker")
    fi

    # Output results
    if [ ${#frameworks[@]} -eq 0 ]; then
        echo "unknown"
    else
        echo "${frameworks[*]}"
    fi
}

detect_framework "$PROJECT_PATH"
