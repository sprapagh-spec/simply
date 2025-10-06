"use client";
import { useMemo, useState } from 'react';
import Papa from 'papaparse';
import { validateAndPreview, commitImport } from './actions';

type Row = Record<string, string>;

type Mapping = {
  email: string | null;
  first_name: string;
  last_name: string;
  household: string | null;
  address: string | null;
};

const defaultFields = ['email', 'first_name', 'last_name', 'household', 'address'] as const;

export default function ImportGuestsPage() {
  const [headers, setHeaders] = useState<string[]>([]);
  const [rawRows, setRawRows] = useState<Row[]>([]);
  const [fileName, setFileName] = useState<string | null>(null);
  const [mapping, setMapping] = useState<Mapping | null>(null);
  const [preview, setPreview] = useState<any | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [googleSheetsUrl, setGoogleSheetsUrl] = useState('');
  const [loadingSheets, setLoadingSheets] = useState(false);

  function onFile(file: File) {
    setFileName(file.name);
    Papa.parse<Row>(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const data = (results.data as Row[]).filter((r) => Object.keys(r).length > 0);
        setRawRows(data);
        const hdrs = results.meta.fields ?? Object.keys(data[0] ?? {});
        setHeaders(hdrs);
        autoMapColumns(hdrs);
      },
    });
  }

  function autoMapColumns(hdrs: string[]) {
    const lower = hdrs.map((h) => h.toLowerCase());
    const pick = (candidates: string[]) => {
      for (const c of candidates) {
        const i = lower.indexOf(c);
        if (i !== -1) return hdrs[i];
      }
      return null;
    };
    setMapping({
      email: pick(['email']),
      first_name: pick(['first_name', 'first name', 'firstname']) ?? hdrs[0] ?? '',
      last_name: pick(['last_name', 'last name', 'lastname']) ?? hdrs[1] ?? '',
      household: pick(['household', 'household name']),
      address: pick(['address', 'street']),
    });
  }

  async function loadGoogleSheets() {
    if (!googleSheetsUrl.trim()) return;
    setLoadingSheets(true);
    try {
      // Convert Google Sheets share URL to CSV export URL
      const sheetId = googleSheetsUrl.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/)?.[1];
      if (!sheetId) {
        alert('Invalid Google Sheets URL. Please use a shareable link.');
        return;
      }
      
      const csvUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&gid=0`;
      const response = await fetch(csvUrl);
      const csvText = await response.text();
      
      Papa.parse<Row>(csvText, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          const data = (results.data as Row[]).filter((r) => Object.keys(r).length > 0);
          setRawRows(data);
          const hdrs = results.meta.fields ?? Object.keys(data[0] ?? {});
          setHeaders(hdrs);
          setFileName('Google Sheets Import');
          autoMapColumns(hdrs);
        },
      });
    } catch (error) {
      alert('Failed to load Google Sheets. Make sure the sheet is publicly viewable.');
    } finally {
      setLoadingSheets(false);
    }
  }

  const mappedRows = useMemo(() => {
    if (!mapping) return [] as Row[];
    return rawRows.map((r) => ({
      email: mapping.email ? r[mapping.email] ?? '' : '',
      first_name: r[mapping.first_name] ?? '',
      last_name: r[mapping.last_name] ?? '',
      household: mapping.household ? r[mapping.household] ?? '' : '',
      address: mapping.address ? r[mapping.address] ?? '' : '',
    }));
  }, [rawRows, mapping]);

  async function onPreview() {
    const res = await validateAndPreview({ rows: mappedRows });
    setPreview(res);
  }

  async function onCommit() {
    if (!preview) return;
    setSubmitting(true);
    try {
      await commitImport({ rows: preview.cleaned });
      alert('Import committed');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen">
      <aside className="w-60 border-r bg-surface">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-ink">SimplyGift</h1>
          <p className="text-sm text-muted mt-1">Guest Invite Management</p>
        </div>
        <nav className="flex flex-col gap-1 p-2">
          <a href="/" className="rounded-xl px-4 py-3 text-sm font-medium text-muted hover:bg-brand-50">Guests</a>
          <a href="/gifts" className="rounded-xl px-4 py-3 text-sm font-medium text-muted hover:bg-brand-50">Gifts</a>
        </nav>
      </aside>
      <main className="flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="display text-3xl md:text-4xl text-ink">Import Guests</h1>
            <p className="text-muted mt-2">Import your guest list from CSV or Google Sheets</p>
          </div>
          
          {/* Google Sheets Import */}
          <div className="rounded-2xl shadow-sm border border-brand-100 bg-surface p-8 mb-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="text-3xl">📊</div>
              <div>
                <h2 className="font-semibold text-xl text-ink">Import from Google Sheets</h2>
                <p className="text-muted">Paste a shareable link to import directly</p>
              </div>
            </div>
            <div className="space-y-4">
              <input
                type="url"
                placeholder="https://docs.google.com/spreadsheets/d/..."
                value={googleSheetsUrl}
                onChange={(e) => setGoogleSheetsUrl(e.target.value)}
                className="w-full rounded-2xl border border-brand-200 bg-surface p-4 text-sm focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              />
              <button
                onClick={loadGoogleSheets}
                disabled={loadingSheets || !googleSheetsUrl.trim()}
                className="bg-primary text-primary-foreground px-6 py-3 rounded-2xl font-medium hover:bg-primary-hover focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all disabled:opacity-50"
              >
                {loadingSheets ? 'Loading...' : 'Load from Google Sheets'}
              </button>
              <p className="text-sm text-muted flex items-center gap-2">
                💡 Make sure your Google Sheet is set to "Anyone with the link can view"
              </p>
            </div>
          </div>

          {/* CSV File Upload */}
          <div className="rounded-2xl shadow-sm border border-brand-100 bg-surface p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="text-3xl">📁</div>
              <div>
                <h2 className="font-semibold text-xl text-ink">Or Upload CSV File</h2>
                <p className="text-muted">Upload a CSV file from your computer</p>
              </div>
            </div>
            <div className="space-y-4">
              <input
                type="file"
                accept=".csv,text/csv"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) onFile(f);
                }}
                className="w-full rounded-2xl border border-brand-200 bg-surface p-4 text-sm focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              />
              {fileName && (
                <div className="flex items-center gap-2 text-sm text-success">
                  ✅ Loaded {fileName}
                </div>
              )}
            </div>
          </div>

          {headers.length > 0 && mapping && (
            <div className="rounded-2xl shadow-sm border border-brand-100 bg-surface p-8 mt-6">
              <h2 className="font-semibold text-xl text-ink mb-6">Map Columns</h2>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {defaultFields.map((f) => (
                  <div key={f} className="space-y-2">
                    <label className="text-sm font-medium text-ink capitalize">
                      {f.replace('_', ' ')}
                    </label>
                    <select
                      className="w-full rounded-2xl border border-brand-200 bg-surface p-3 text-sm focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                      value={(mapping as any)[f] ?? ''}
                      onChange={(e) => setMapping({ ...mapping, [f]: e.target.value || null })}
                    >
                      <option value="">—</option>
                      {headers.map((h) => (
                        <option key={h} value={h}>{h}</option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
              <button
                className="bg-primary text-primary-foreground px-6 py-3 rounded-2xl font-medium hover:bg-primary-hover focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all mt-6"
                onClick={onPreview}
              >
                Validate & Preview
              </button>
            </div>
          )}

          {preview && (
            <div className="space-y-6 mt-6">
              <div className="rounded-2xl shadow-sm border border-brand-100 bg-surface p-8">
                <h3 className="font-semibold text-xl text-ink mb-4">Validation Results</h3>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="text-center p-4 rounded-2xl bg-brand-50">
                    <div className="text-2xl font-bold text-success">{preview.cleaned.length}</div>
                    <div className="text-sm text-success">Valid Rows</div>
                  </div>
                  <div className="text-center p-4 rounded-2xl bg-accent">
                    <div className="text-2xl font-bold text-danger">{preview.errors.length}</div>
                    <div className="text-sm text-danger">Errors</div>
                  </div>
                  <div className="text-center p-4 rounded-2xl bg-brand-50">
                    <div className="text-2xl font-bold text-primary">{preview.households.length}</div>
                    <div className="text-sm text-primary">Households</div>
                  </div>
                </div>
                {preview.errors.length > 0 && (
                  <div className="mt-4 p-4 rounded-2xl bg-accent">
                    <h4 className="font-medium text-danger mb-2">Errors Found:</h4>
                    <ul className="text-sm text-danger space-y-1">
                      {preview.errors.slice(0, 5).map((e: any, i: number) => (
                        <li key={i}>Row {e.index + 1}: {e.issues.join(', ')}</li>
                      ))}
                      {preview.errors.length > 5 && <li>…and {preview.errors.length - 5} more</li>}
                    </ul>
                  </div>
                )}
              </div>
              
              <div className="rounded-2xl shadow-sm border border-brand-100 bg-surface p-8">
                <h3 className="font-semibold text-xl text-ink mb-4">Ready to Import</h3>
                <p className="text-muted mb-6">
                  {preview.cleaned.length} guests will be imported with {preview.households.length} households detected.
                </p>
                <button
                  className="bg-primary text-primary-foreground px-6 py-3 rounded-2xl font-medium hover:bg-primary-hover focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all disabled:opacity-50"
                  onClick={onCommit}
                  disabled={submitting || preview.cleaned.length === 0}
                >
                  {submitting ? 'Importing…' : 'Import Guests'}
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}