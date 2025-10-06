"use client";
import { useState } from 'react';

export default function ThemePreviewPage() {
  const [isDark, setIsDark] = useState(false);

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.setAttribute('data-theme', isDark ? 'light' : 'dark');
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-8">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="display text-3xl md:text-4xl text-ink">Theme Preview</h1>
            <p className="text-muted mt-2">Joyful Minimalism Design System</p>
          </div>
          <button
            onClick={toggleTheme}
            className="btn-secondary"
          >
            {isDark ? '☀️ Light' : '🌙 Dark'} Mode
          </button>
        </div>

        {/* Typography */}
        <section className="card p-8">
          <h2 className="display text-2xl md:text-3xl text-ink mb-6">Typography</h2>
          <div className="space-y-4">
            <h1 className="display text-3xl md:text-4xl text-ink">Heading 1 - Display</h1>
            <h2 className="display text-2xl md:text-3xl text-ink">Heading 2 - Display</h2>
            <h3 className="font-semibold text-xl text-ink">Section Title</h3>
            <p className="text-base leading-7 text-foreground">
              This is body text with proper line height for readability. It should feel comfortable to read and maintain good contrast with the background.
            </p>
            <p className="text-muted">This is muted text for secondary information.</p>
          </div>
        </section>

        {/* Buttons */}
        <section className="card p-8">
          <h2 className="display text-2xl md:text-3xl text-ink mb-6">Buttons</h2>
          <div className="flex flex-wrap gap-4">
            <button className="btn-primary">Primary Button</button>
            <button className="btn-secondary">Secondary Button</button>
            <button className="btn-ghost">Ghost Button</button>
          </div>
        </section>

        {/* Links */}
        <section className="card p-8">
          <h2 className="display text-2xl md:text-3xl text-ink mb-6">Links</h2>
          <div className="space-y-2">
            <p>
              This is a <a href="#" className="text-primary hover:underline underline-offset-4">primary link</a> in a paragraph.
            </p>
            <p>
              Here's another <a href="#" className="text-primary hover:underline underline-offset-4">link example</a> with proper hover states.
            </p>
          </div>
        </section>

        {/* Brand Colors */}
        <section className="card p-8">
          <h2 className="display text-2xl md:text-3xl text-ink mb-6">Brand Palette (Sage)</h2>
          <div className="grid grid-cols-5 gap-4">
            {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map((shade) => (
              <div key={shade} className="text-center">
                <div 
                  className={`w-16 h-16 rounded-2xl mx-auto mb-2 border border-brand-200`}
                  style={{ backgroundColor: `var(--brand-${shade})` }}
                />
                <div className="text-xs text-muted">brand-{shade}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Form Elements */}
        <section className="card p-8">
          <h2 className="display text-2xl md:text-3xl text-ink mb-6">Form Elements</h2>
          <div className="space-y-6 max-w-md">
            <div>
              <label className="block text-sm font-medium text-ink mb-2">Label</label>
              <input 
                type="text" 
                placeholder="Input placeholder"
                className="w-full rounded-2xl border border-brand-200 bg-surface p-3 text-sm focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-ink mb-2">Select</label>
              <select className="w-full rounded-2xl border border-brand-200 bg-surface p-3 text-sm focus:ring-2 focus:ring-primary focus:border-transparent transition-all">
                <option>Option 1</option>
                <option>Option 2</option>
                <option>Option 3</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-ink mb-2">Textarea</label>
              <textarea 
                placeholder="Textarea placeholder"
                rows={3}
                className="w-full rounded-2xl border border-brand-200 bg-surface p-3 text-sm focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none"
              />
            </div>
          </div>
        </section>

        {/* Status Colors */}
        <section className="card p-8">
          <h2 className="display text-2xl md:text-3xl text-ink mb-6">Status Colors</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 rounded-2xl bg-success/10">
              <div className="text-2xl font-bold text-success">Success</div>
              <div className="text-sm text-success">#16A34A</div>
            </div>
            <div className="text-center p-4 rounded-2xl bg-warning/10">
              <div className="text-2xl font-bold text-warning">Warning</div>
              <div className="text-sm text-warning">#F59E0B</div>
            </div>
            <div className="text-center p-4 rounded-2xl bg-danger/10">
              <div className="text-2xl font-bold text-danger">Danger</div>
              <div className="text-sm text-danger">#DC2626</div>
            </div>
            <div className="text-center p-4 rounded-2xl bg-primary/10">
              <div className="text-2xl font-bold text-primary">Primary</div>
              <div className="text-sm text-primary">#7FA28A</div>
            </div>
          </div>
        </section>

        {/* Sample Card */}
        <section className="card p-8">
          <h2 className="display text-2xl md:text-3xl text-ink mb-6">Sample Card</h2>
          <div className="card p-6">
            <h3 className="font-semibold text-xl text-ink mb-3">Card Title</h3>
            <p className="text-muted mb-4">
              This is a sample card demonstrating the design system. It uses the card class with proper spacing and typography.
            </p>
            <div className="flex gap-3">
              <button className="btn-primary">Action</button>
              <button className="btn-secondary">Cancel</button>
            </div>
          </div>
        </section>

        {/* Instructions */}
        <section className="card p-8">
          <h2 className="display text-2xl md:text-3xl text-ink mb-6">How to Use</h2>
          <div className="space-y-4 text-muted">
            <p><strong className="text-ink">Changing Colors:</strong> Edit the CSS variables in <code className="bg-brand-50 px-2 py-1 rounded text-sm">globals.css</code></p>
            <p><strong className="text-ink">Dark Mode:</strong> Set <code className="bg-brand-50 px-2 py-1 rounded text-sm">data-theme="dark"</code> on the html element</p>
            <p><strong className="text-ink">Typography:</strong> Use <code className="bg-brand-50 px-2 py-1 rounded text-sm">.display</code> class for headings</p>
            <p><strong className="text-ink">Components:</strong> Use <code className="bg-brand-50 px-2 py-1 rounded text-sm">.card</code>, <code className="bg-brand-50 px-2 py-1 rounded text-sm">.btn-primary</code>, etc.</p>
          </div>
        </section>
      </div>
    </div>
  );
}
