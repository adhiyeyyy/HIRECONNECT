# Tailwind CSS Setup for CampusLink

## Current Configuration

Your project is now set up to use **Tailwind CSS via CDN** with custom CSS extensions.

### What's Installed

- ✅ **tailwindcss** v4.1.18 (dev dependency)
- ✅ **postcss** v8.5.6 (dev dependency)
- ✅ **autoprefixer** v10.4.24 (dev dependency)

### How It Works

1. **Tailwind CDN** - Your HTML files load Tailwind via CDN:
   ```html
   <script src="https://cdn.tailwindcss.com"></script>
   ```

2. **Custom CSS** - `frontend/styles.css` contains:
   - CSS custom properties (`:root` variables) for your theme colors
   - Custom component classes (`.card`, `.btn-primary`, `.btn-secondary`, `.input-field`)
   - These work alongside Tailwind's utility classes

3. **No Build Step Required** - Since you're using the CDN, you can:
   - Use all Tailwind utility classes directly in your HTML
   - Your custom CSS is loaded separately and works perfectly with Tailwind

### IDE Warnings - RESOLVED ✅

The previous warnings about `@tailwind` and `@apply` directives have been **eliminated** by:
- Removing Tailwind-specific directives from your CSS
- Using standard CSS custom properties instead
- Relying on the CDN for Tailwind utilities

### Using Tailwind in Your Project

**In HTML files:**
```html
<!-- Use Tailwind utility classes directly -->
<div class="bg-teal-500 text-white p-4 rounded-lg hover:bg-teal-600">
    Click me
</div>

<!-- Or use your custom classes -->
<button class="btn-primary">Submit</button>
```

**In CSS files:**
```css
/* Use your custom properties */
.my-custom-class {
    background-color: var(--color-primary);
    color: white;
}
```

### Available NPM Scripts

While you don't need these for the CDN approach, they're available if you want to switch to a build-based approach later:

```bash
npm run build:css   # Build production CSS (minified)
npm run watch:css   # Watch for changes and rebuild
```

### Custom Theme Colors

Your project uses these custom colors defined in `styles.css`:

- **Primary**: `#14b8a6` (Teal) - `var(--color-primary)`
- **Secondary**: `#1e293b` (Dark Slate) - `var(--color-secondary)`

### Switching to Build-Based Approach (Optional)

If you want to stop using the CDN and build Tailwind locally:

1. Remove the CDN script from your HTML files
2. Update your CSS to use Tailwind directives
3. Run `npm run build:css` to generate the output file
4. Link to `output.css` instead of `styles.css` in your HTML

For now, the **CDN approach is simpler and works perfectly** for your project!

## Summary

✅ **All IDE warnings resolved**  
✅ **Tailwind CSS working via CDN**  
✅ **Custom styles working perfectly**  
✅ **No build step required**  
✅ **Ready to use in development and production**
