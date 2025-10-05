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
      email: pick(['email']) ,
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
    <main className="p-6">
      <h1 className="text-xl font-semibold">Import Guests</h1>
      
      {/* Google Sheets Import */}
      <div className="mt-4 rounded-lg border-2 border-blue-200 bg-blue-50 p-6">
        <h2 className="text-lg font-semibold text-blue-800 mb-3">📊 Import from Google Sheets</h2>
        <div className="space-y-3">
          <input
            type="url"
            placeholder="Paste Google Sheets shareable link here..."
            value={googleSheetsUrl}
            onChange={(e) => setGoogleSheetsUrl(e.target.value)}
            className="w-full rounded border border-blue-300 bg-white p-3 text-sm"
          />
          <button
            onClick={loadGoogleSheets}
            disabled={loadingSheets || !googleSheetsUrl.trim()}
            className="rounded bg-blue-600 px-4 py-2 text-white text-sm hover:bg-blue-700 disabled:opacity-50"
          >
            {loadingSheets ? 'Loading...' : 'Load from Google Sheets'}
          </button>
          <p className="text-xs text-blue-600">
            💡 Make sure your Google Sheet is set to "Anyone with the link can view"
          </p>
        </div>
      </div>

      {/* CSV File Upload */}
      <div className="mt-6 rounded-lg border-2 border-gray-200 bg-gray-50 p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">📁 Or Upload CSV File</h2>
        <input
          type="file"
          accept=".csv,text/csv"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) onFile(f);
          }}
          className="w-full rounded border border-gray-300 bg-white p-3 text-sm"
        />
        {fileName && <p className="mt-2 text-sm text-gray-600">✅ Loaded {fileName}</p>}
      </div>

      {headers.length > 0 && mapping && (
        <div className="mt-6 rounded border p-4">
          <h2 className="font-medium">Map Columns</h2>
          <div className="mt-3 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {defaultFields.map((f) => (
              <label key={f} className="flex items-center gap-2 text-sm">
                <span className="w-28 capitalize">{f.replace('_', ' ')}</span>
                <select
                  className="w-full rounded border bg-background p-2"
                  value={(mapping as any)[f] ?? ''}
                  onChange={(e) => setMapping({ ...mapping, [f]: e.target.value || null })}
                >
                  <option value="">—</option>
                  {headers.map((h) => (
                    <option key={h} value={h}>{h}</option>
                  ))}
                </select>
              </label>
            ))}
          </div>
          <button
            className="mt-4 rounded bg-primary px-3 py-2 text-primary-foreground text-sm"
            onClick={onPreview}
          >
            Validate & Preview
          </button>
        </div>
      )}

      {preview && (
        <div className="mt-6 space-y-4">
          <div className="rounded border p-4">
            <h3 className="font-medium">Validation</h3>
            <p className="text-sm text-muted-foreground">Valid rows: {preview.cleaned.length}, Errors: {preview.errors.length}</p>
            {preview.errors.length > 0 && (
              <ul className="mt-2 list-disc pl-5 text-sm">
                {preview.errors.slice(0, 5).map((e: any, i: number) => (
                  <li key={i}>Row {e.index + 1}: {e.issues.join(', ')}</li>
                ))}
                {preview.errors.length > 5 && <li>…and more</li>}
              </ul>
            )}
          </div>
          <div className="rounded border p-4">
            <h3 className="font-medium">Duplicates Detected</h3>
            <p className="text-sm text-muted-foreground">{preview.duplicates.length} potential duplicates</p>
          </div>
          <div className="rounded border p-4">
            <h3 className="font-medium">Household Inference</h3>
            <p className="text-sm text-muted-foreground">{preview.households.length} inferred groups</p>
          </div>
          <button
            className="rounded bg-primary px-3 py-2 text-primary-foreground text-sm disabled:opacity-50"
            onClick={onCommit}
            disabled={submitting || preview.cleaned.length === 0}
          >
            {submitting ? 'Committing…' : 'Commit Import'}
          </button>
        </div>
      )}
    </main>
  );
}

