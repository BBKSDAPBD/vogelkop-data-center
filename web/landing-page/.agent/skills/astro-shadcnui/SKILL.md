---
name: astro-shadcn-component
description: Generates and integrates UI components using Astro, Tailwind CSS, and Shadcn UI. Use this when the user needs to build or modify landing page sections.
---

# Astro Shadcn UI Component Skill

Skill ini fokus pada pembuatan komponen UI yang konsisten dengan desain sistem BBKSDA Papua Barat Daya.

## When to use this skill

- Saat perlu membuat section baru di landing page (Hero, Features, Footer).
- Saat mengintegrasikan komponen dari Shadcn UI ke dalam file `.astro`.
- Saat perlu melakukan styling ulang menggunakan Tailwind CSS.

## How to use it

1. **Component Structure**: Gunakan format file `.astro` untuk komponen statis. Jika butuh interaktivitas kompleks, gunakan framework-agnostic approach atau pastikan directive `client:load` dipakai dengan tepat.
2. **Shadcn Integration**:
   - Gunakan `import { Button } from "@/components/ui/button"` (sesuaikan path alias).
   - Pastikan penggunaan fungsi `cn()` dari `lib/utils` untuk penggabungan class Tailwind.
3. **Styling**:
   - Gunakan utility classes Tailwind secara langsung.
   - Untuk tema BBKSDA, prioritaskan palette warna alam (Green-800 untuk hutan, Blue-600 untuk laut).
4. **Accessibility**: Pastikan setiap komponen memiliki atribut ARIA yang sesuai, terutama untuk konten informasi publik.

## Code Standards

- Selalu gunakan TypeScript.
- Gunakan `astro:assets` untuk optimasi gambar (terutama foto wildlife).
- Pastikan desain _mobile-first_.
